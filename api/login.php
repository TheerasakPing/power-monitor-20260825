<?php
require "connectdb.php";
require "login_protection.php";

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method Not Allowed', 405);
}

$username = trim((string)($_POST['name'] ?? ''));
$password = (string)($_POST['pass'] ?? '');
$turnstileToken = trim((string)($_POST['cf-turnstile-response'] ?? ''));

if ($username === '' || $password === '') {
    json_error('Invalid request', 400);
}

$ip = get_client_ip();

try {
    $limit = check_login_rate_limit($dbcon, $username, $ip);
    if (!$limit['allowed']) {
        header('Retry-After: ' . $limit['retry_after']);
        json_error('Too many login attempts. Please try again later.', 429, [
            'retry_after' => $limit['retry_after'],
        ]);
    }
} catch (Throwable $e) {
    // Fail closed when the rate limiter cannot be initialized safely.
    error_log('Login rate limiter failure: ' . $e->getMessage());
    json_error('Login service temporarily unavailable', 503);
}

try {
    if (!verify_turnstile($turnstileToken, $ip)) {
        json_error('Human verification failed. Please try again.', 403);
    }
} catch (Throwable $e) {
    error_log('Turnstile verification failure: ' . $e->getMessage());
    json_error('Login service temporarily unavailable', 503);
}

// Prepared statement prevents username/password input from altering the SQL query.
$query = $dbcon->prepare("SELECT * FROM tb_account WHERE account_user = :username LIMIT 1");
$query->execute([':username' => $username]);
$row_count = $query->fetch(PDO::FETCH_ASSOC);

if (!$row_count) {
    echo json_encode([
        'status' => false,
        'message' => 'No user'
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// Existing deployments currently store plaintext passwords. This comparison is kept
// for compatibility until the password-hashing migration is completed in the related issue.
if (!hash_equals((string)$row_count['account_pass'], $password)) {
    echo json_encode([
        'status' => false,
        'message' => 'No user'
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

if ((int)$row_count['account_suspend'] === 0) {
    echo json_encode([
        'status' => false,
        'message' => 'Suspend'
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

function encode($string){
    return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($string . 'zasn'));
}

$u_id = $row_count['account_id'];
$account_user = $row_count['account_user'];
$account_theme = $row_count['account_theme'];
$account_img = ($row_count['account_img'] == '') ? 'user.png' : $row_count['account_img'];
$account_p = $row_count['account_pass'];

$level_1 = $dbcon->query("SELECT COUNT(`userST_level`) FROM `tb_user_st` WHERE `userST_accountID`='$u_id' AND `userST_level` = 1 ")->fetch()[0];
if($level_1 > 0){ // sup
    $level = 1;
    $stmtSH = $dbcon->query("SELECT * FROM tb_house INNER JOIN tb_site ON tb_house.house_siteID = tb_site.site_id");
    $display = [
        'countSite'     => '',
        'siteID'        => '',
        'countHouse'    => '',
        'select'        => [
            'siteID'    => '',
            'houseID'   => '',
            'sn'        => '',
            'phase'     => '',
            'temp'      => ''
        ]
    ];
}else{ // ad & us
    $level_2 = $dbcon->query("SELECT COUNT(`userST_level`) FROM `tb_user_st` WHERE `userST_accountID`='$u_id' AND `userST_level` = 2 ")->fetch()[0];
    if($level_2 > 0){
        $level = 2;
    }else{
        $level = 3;
    }

    $count_site = $dbcon->query("SELECT userST_siteID FROM `tb_user_st` WHERE `userST_accountID`='$u_id' GROUP BY `userST_siteID`")->rowCount();
    $stmt = $dbcon->query("SELECT * FROM `tb_user_st`
                            INNER JOIN `tb_house` ON tb_user_st.userST_houseID = tb_house.house_id
                            INNER JOIN `tb_site` ON tb_user_st.userST_siteID = tb_site.site_id
                            WHERE `userST_accountID`='$u_id' GROUP BY `userST_houseID`");
    $count_House = $stmt->rowCount();
    $lise_House = $stmt->fetch();

    if($count_site == 1){
        if($count_House == 1){
            $display = [
                'countSite' => $count_site,
                'countHouse'=> $count_House,
                'siteID'    => $lise_House['userST_siteID'],
                'houseID'   => $lise_House['house_id'],
                'select'    => [
                    'siteID'    => $lise_House['userST_siteID'],
                    'siteName'  => $lise_House['site_name'],
                    'houseID'   => $lise_House['house_id'],
                    'houseName' => $lise_House['house_name'],
                    'loop'      => 0,
                    'loopHouse' => 0,
                    'sn'        => $lise_House['house_sn'],
                    'phase'     => $lise_House['house_phase'],
                    'temp'      => $lise_House['house_temp'],
                ]
            ];
        }else{
            $display = [
                'countSite' => $count_site,
                'siteID'    => $lise_House['userST_siteID'],
                'siteName'  => $lise_House['site_name'],
                'countHouse'=> $count_House,
                'select'    => [
                    'siteID'    => $lise_House['userST_siteID'],
                    'loop'      => 0,
                    'houseID'   => '',
                    'sn'        => '',
                    'phase'     => '',
                    'temp'      => '',
                ]
            ];
        }
    }else{
        $display = [
            'countSite' => $count_site,
            'select'    => [
                'siteID'    => '',
                'houseID'   => '',
                'sn'        => '',
                'phase'     => '',
                'temp'      => '',
            ]
        ];
    }

    $stmtSH = $dbcon->query("SELECT * FROM `tb_user_st`
                INNER JOIN `tb_site` ON tb_user_st.userST_siteID = tb_site.site_id
                INNER JOIN `tb_house` ON tb_user_st.userST_houseID = tb_house.house_id
                WHERE `userST_accountID` = '$u_id'");
}

$logSite = [];
foreach ($stmtSH as $row) {
    $logSite[] = $row;
}
$display['logSite'] = $logSite;

cleanup_login_rate_table($dbcon);

echo json_encode([
    'status' => true,
    'message' => 'Login Success',
    'data' => [
        'account' => [
            'id' => $u_id,
            'user'  => $account_user,
            'img'   => $account_img,
            'level' => $level,
            'p'     => $account_p
        ],
        'theme'      => $account_theme,
        'display' => $display,
        'dt'         => date("Y-m-d") . ' ' . date("H:i:s", strtotime('30 minute'))
    ]
], JSON_UNESCAPED_UNICODE);
exit();
