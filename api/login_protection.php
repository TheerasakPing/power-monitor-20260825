<?php
/**
 * Login protection helpers: Cloudflare Turnstile + database-backed rate limiting.
 * Secrets are read from environment variables and never returned to clients.
 */

const LOGIN_RATE_LIMITS = [
    'ip_short' => ['max' => 5, 'window' => 60],
    'ip_long'  => ['max' => 10, 'window' => 600],
    'account'  => ['max' => 5, 'window' => 600],
];

function json_error(string $message, int $status = 400, array $extra = []): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(array_merge([
        'status' => false,
        'message' => $message,
    ], $extra), JSON_UNESCAPED_UNICODE);
    exit;
}

function get_client_ip(): string
{
    // Trust Cloudflare's CF-Connecting-IP only when the request is actually
    // coming through Cloudflare. Otherwise use the direct REMOTE_ADDR.
    $remote = $_SERVER['REMOTE_ADDR'] ?? '';
    $cfIp = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? '';

    if ($cfIp !== '' && filter_var($remote, FILTER_VALIDATE_IP)) {
        // Optional deployment hardening: set TRUST_CLOUDFLARE_PROXY=1 only when
        // the origin is actually protected by Cloudflare and direct access is blocked.
        if (getenv('TRUST_CLOUDFLARE_PROXY') === '1') {
            if (filter_var($cfIp, FILTER_VALIDATE_IP)) {
                return $cfIp;
            }
        }
    }

    return filter_var($remote, FILTER_VALIDATE_IP) ? $remote : 'unknown';
}

function normalize_login_identifier(string $username): string
{
    $username = trim(mb_strtolower($username, 'UTF-8'));
    return mb_substr($username, 0, 191, 'UTF-8');
}

function ensure_login_rate_table(PDO $db): void
{
    static $ready = false;
    if ($ready) {
        return;
    }

    $sql = "CREATE TABLE IF NOT EXISTS `tb_login_rate_limit` (
        `rate_key` VARCHAR(255) NOT NULL,
        `window_name` VARCHAR(32) NOT NULL,
        `window_start` INT UNSIGNED NOT NULL,
        `attempts` INT UNSIGNED NOT NULL DEFAULT 0,
        `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`rate_key`, `window_name`, `window_start`),
        INDEX `idx_login_rate_updated` (`updated_at`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

    if (!$db->exec($sql)) {
        throw new RuntimeException('Unable to initialize login rate limiter');
    }

    $ready = true;
}

function consume_rate_limit(PDO $db, string $key, string $windowName, int $max, int $windowSeconds): array
{
    $now = time();
    $windowStart = intdiv($now, $windowSeconds) * $windowSeconds;

    $sql = "INSERT INTO `tb_login_rate_limit` (`rate_key`, `window_name`, `window_start`, `attempts`)
            VALUES (:rate_key, :window_name, :window_start, 1)
            ON DUPLICATE KEY UPDATE `attempts` = `attempts` + 1";
    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':rate_key' => $key,
        ':window_name' => $windowName,
        ':window_start' => $windowStart,
    ]);

    $stmt = $db->prepare("SELECT `attempts` FROM `tb_login_rate_limit`
                          WHERE `rate_key` = :rate_key
                            AND `window_name` = :window_name
                            AND `window_start` = :window_start
                          LIMIT 1");
    $stmt->execute([
        ':rate_key' => $key,
        ':window_name' => $windowName,
        ':window_start' => $windowStart,
    ]);
    $attempts = (int) $stmt->fetchColumn();

    $resetAt = $windowStart + $windowSeconds;
    return [
        'allowed' => $attempts <= $max,
        'attempts' => $attempts,
        'retry_after' => max(1, $resetAt - $now),
    ];
}

function check_login_rate_limit(PDO $db, string $username, string $ip): array
{
    ensure_login_rate_table($db);

    $identifier = normalize_login_identifier($username);
    $checks = [
        consume_rate_limit($db, 'ip:' . hash('sha256', $ip), 'ip_short', LOGIN_RATE_LIMITS['ip_short']['max'], LOGIN_RATE_LIMITS['ip_short']['window']),
        consume_rate_limit($db, 'ip:' . hash('sha256', $ip), 'ip_long', LOGIN_RATE_LIMITS['ip_long']['max'], LOGIN_RATE_LIMITS['ip_long']['window']),
        consume_rate_limit($db, 'acct:' . hash('sha256', $identifier), 'account', LOGIN_RATE_LIMITS['account']['max'], LOGIN_RATE_LIMITS['account']['window']),
    ];

    foreach ($checks as $check) {
        if (!$check['allowed']) {
            return [
                'allowed' => false,
                'retry_after' => $check['retry_after'],
            ];
        }
    }

    return ['allowed' => true, 'retry_after' => 0];
}

function verify_turnstile(string $token, string $remoteIp): bool
{
    $secret = getenv('TURNSTILE_SECRET');
    if (!$secret) {
        throw new RuntimeException('TURNSTILE_SECRET is not configured');
    }

    if ($token === '' || strlen($token) > 2048) {
        return false;
    }

    $payload = json_encode([
        'secret' => $secret,
        'response' => $token,
        'remoteip' => $remoteIp,
    ], JSON_UNESCAPED_SLASHES);

    $ch = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    ]);

    $raw = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($raw === false || $httpCode < 200 || $httpCode >= 300) {
        return false;
    }

    $result = json_decode($raw, true);
    if (!is_array($result) || ($result['success'] ?? false) !== true) {
        return false;
    }

    $expectedAction = getenv('TURNSTILE_ACTION') ?: 'login';
    if (!empty($expectedAction) && (($result['action'] ?? '') !== $expectedAction)) {
        return false;
    }

    $allowedHosts = array_values(array_filter(array_map('trim', explode(',', getenv('TURNSTILE_HOSTNAMES') ?: ''))));
    if ($allowedHosts !== [] && !in_array($result['hostname'] ?? '', $allowedHosts, true)) {
        return false;
    }

    return true;
}

function get_turnstile_site_key(): string
{
    return trim((string) (getenv('TURNSTILE_SITE_KEY') ?: ''));
}

function cleanup_login_rate_table(PDO $db): void
{
    // Best-effort housekeeping. Failure here should not break login.
    try {
        $db->exec("DELETE FROM `tb_login_rate_limit` WHERE `updated_at` < (NOW() - INTERVAL 1 DAY)");
    } catch (Throwable $e) {
        // Intentionally ignored.
    }
}
