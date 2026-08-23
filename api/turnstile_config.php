<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');

$siteKey = trim((string) (getenv('TURNSTILE_SITE_KEY') ?: ''));

if ($siteKey === '') {
    http_response_code(503);
    echo json_encode([
        'status' => false,
        'message' => 'Turnstile is not configured'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode([
    'status' => true,
    'siteKey' => $siteKey
], JSON_UNESCAPED_UNICODE);
