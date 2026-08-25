<?php
require_once __DIR__ . '/bootstrap.php';
require "connectdb.php";
require "login_protection.php";
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_error('Method Not Allowed', 405);
$username = trim((string)($_POST['name'] ?? ''));
$password = (string)($_POST['pass'] ?? '');
$turnstileToken = trim((string)($_POST['cf-turnstile-response'] ?? ''));
if ($username === '' || $password === '') json_error('Invalid request', 400);
$ip = get_client_ip();
try {
    $limit = check_login_rate_limit($dbcon, $username, $ip);
    if (!$limit['allowed']) { header('Retry-After: ' . $limit['retry_after']); json_error('Too many login attempts. Please try again later.', 429, ['retry_after'=>$limit['retry_after']]); }
} catch (Throwable $e) { error_log('Login rate limiter failure: ' . $e->getMessage()); json_error('Login service temporarily unavailable', 503); }
try { if (!verify_turnstile($turnstileToken, $ip)) json_error('Human verification failed. Please try again.', 403); }
catch (Throwable $e) { error_log('Turnstile verification failure: ' . $e->getMessage()); json_error('Login service temporarily unavailable', 503); }

$query = $dbcon->prepare("SELECT * FROM tb_account WHERE account_user = :username LIMIT 1");
$query->execute([':username'=>$username]);
$row_count = $query->fetch(PDO::FETCH_ASSOC);
if (!$row_count) { echo json_encode(['status'=>false,'message'=>'No user'], JSON_UNESCAPED_UNICODE); exit(); }
$storedPassword = (string)$row_count['account_pass'];
$hashInfo = password_get_info($storedPassword);
if (!empty($hashInfo['algo'])) { $passwordValid = password_verify($password, $storedPassword); }
else { $passwordValid = hash_equals($storedPassword, $password); }
if (!$passwordValid) { echo json_encode(['status'=>false,'message'=>'No user'], JSON_UNESCAPED_UNICODE); exit(); }
if (empty($hashInfo['algo']) || password_needs_rehash($storedPassword, PASSWORD_DEFAULT)) {
    $storedPassword = password_hash($password, PASSWORD_DEFAULT);
    $rehashStmt = $dbcon->prepare('UPDATE tb_account SET account_pass=:pass WHERE account_id=:id');
    $rehashStmt->execute([':pass'=>$storedPassword, ':id'=>$row_count['account_id']]);
}
if ((int)$row_count['account_suspend'] === 0) { echo json_encode(['status'=>false,'message'=>'Suspend'], JSON_UNESCAPED_UNICODE); exit(); }

secure_session_start(); session_regenerate_id(true);
$_SESSION['account_id'] = (int)$row_count['account_id'];
$_SESSION['account_user'] = (string)$row_count['account_user'];
$u_id = (int)$row_count['account_id'];
$account_user = (string)$row_count['account_user'];
$account_theme = (string)$row_count['account_theme'];
$account_img = ($row_count['account_img'] == '') ? 'user.png' : $row_count['account_img'];

$level_1 = (int)$dbcon->query("SELECT COUNT(userST_level) FROM tb_user_st WHERE userST_accountID=" . $u_id . " AND userST_level=1")->fetchColumn();
if ($level_1 > 0) {
    $level = 1;
    $stmtSH = $dbcon->query("SELECT * FROM tb_house INNER JOIN tb_site ON tb_house.house_siteID=tb_site.site_id");
    $display = ['countSite'=>'','siteID'=>'','countHouse'=>'','select'=>['siteID'=>'','houseID'=>'','sn'=>'','phase'=>'','temp'=>'']];
} else {
    $level_2 = (int)$dbcon->query("SELECT COUNT(userST_level) FROM tb_user_st WHERE userST_accountID=" . $u_id . " AND userST_level=2")->fetchColumn();
    $level = $level_2 > 0 ? 2 : 3;
    $count_site = (int)$dbcon->query("SELECT userST_siteID FROM tb_user_st WHERE userST_accountID=" . $u_id . " GROUP BY userST_siteID")->rowCount();
    $stmt = $dbcon->query("SELECT * FROM tb_user_st INNER JOIN tb_house ON tb_user_st.userST_houseID=tb_house.house_id INNER JOIN tb_site ON tb_user_st.userST_siteID=tb_site.site_id WHERE userST_accountID=" . $u_id . " GROUP BY userST_houseID");
    $count_House = (int)$stmt->rowCount();
    $lise_House = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
    if ($count_site === 1 && $count_House === 1) {
        $display = ['countSite'=>$count_site,'countHouse'=>$count_House,'siteID'=>$lise_House['userST_siteID'],'houseID'=>$lise_House['house_id'],'select'=>['siteID'=>$lise_House['userST_siteID'],'siteName'=>$lise_House['site_name'],'houseID'=>$lise_House['house_id'],'houseName'=>$lise_House['house_name'],'loop'=>0,'loopHouse'=>0,'sn'=>$lise_House['house_sn'],'phase'=>$lise_House['house_phase'],'temp'=>$lise_House['house_temp']]];
    } elseif ($count_site === 1) {
        $display = ['countSite'=>$count_site,'siteID'=>$lise_House['userST_siteID'] ?? '','siteName'=>$lise_House['site_name'] ?? '','countHouse'=>$count_House,'select'=>['siteID'=>$lise_House['userST_siteID'] ?? '','loop'=>0,'houseID'=>'','sn'=>'','phase'=>'','temp'=>'']];
    } else { $display = ['countSite'=>$count_site,'select'=>['siteID'=>'','houseID'=>'','sn'=>'','phase'=>'','temp'=>'']]; }
    $stmtSH = $dbcon->query("SELECT * FROM tb_user_st INNER JOIN tb_site ON tb_user_st.userST_siteID=tb_site.site_id INNER JOIN tb_house ON tb_user_st.userST_houseID=tb_house.house_id WHERE userST_accountID=" . $u_id);
}
$display['logSite'] = $stmtSH->fetchAll(PDO::FETCH_ASSOC);
cleanup_login_rate_table($dbcon);

echo json_encode(['status'=>true,'message'=>'Login Success','data'=>['account'=>['id'=>$u_id,'user'=>$account_user,'img'=>$account_img,'level'=>$level,'p'=>$storedPassword],'theme'=>$account_theme,'display'=>$display,'dt'=>date('Y-m-d H:i:s')]], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
exit();
