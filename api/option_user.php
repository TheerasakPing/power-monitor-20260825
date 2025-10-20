
<?php
    require 'connectdb.php';
    $user_id = $_GET['id'];

    if($_GET['level'] == 1){
        $stmt = $dbcon->prepare("SELECT account_id, account_user, account_img FROM `tb_account` ");
    }else{
        $stmt = $dbcon->prepare("SELECT * FROM `tb_account` WHERE `account_main`='$user_id'");
    }
    $stmt->execute();
    if($stmt->rowCount() == 1){
        while ($row = $stmt->fetch(PDO::FETCH_BOTH)) {
            echo '<option value="'.$row['account_id'].'" img="'.$row['account_img'].'" iname="'.$row['account_user'].'">'.$row['account_user'].'</option>';
        }
    }else{
        echo '<option value="0">เลือกผู้ใช้งาน</option>';
        while ($row = $stmt->fetch(PDO::FETCH_BOTH)) {
            echo '<option value="'.$row['account_id'].'" img="'.$row['account_img'].'" iname="'.$row['account_user'].'">'.$row['account_user'].'</option>';
        }
    }
