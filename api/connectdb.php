<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

$local = __DIR__ . '/config.local.php';
$config = is_file($local) ? require $local : [];
$config = is_array($config) ? $config : [];

$host = (string) ($config['host'] ?? getenv('DB_HOST') ?: 'localhost');
$user = (string) ($config['user'] ?? getenv('DB_USER') ?: '');
$pass = (string) ($config['pass'] ?? getenv('DB_PASS') ?: '');
$name = (string) ($config['name'] ?? getenv('DB_NAME') ?: 'db_powermeter');

if ($user === '' || $pass === '') {
    error_log('PowerMonitor DB credentials are not configured');
    api_json_error('Service temporarily unavailable', 503);
}

try {
    $dbcon = new PDO(
        "mysql:host={$host};dbname={$name};charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_STRINGIFY_FETCHES => false,
            PDO::ATTR_TIMEOUT => 5,
        ]
    );
} catch (PDOException $ex) {
    error_log('PowerMonitor DB connection failure: ' . $ex->getMessage());
    api_json_error('Service temporarily unavailable', 503);
}
