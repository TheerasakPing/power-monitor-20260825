<?php
    session_start();
    require "connectdb.php";
    $user_id = $_SESSION['account']['id'];
    // echo $_POST["mode_insert"];
    // exit();
    // Edit Profile
    if($_POST["mode_insert"] == "edit_profile"){
        // chack_user
        if($_POST["p_name"] != $_SESSION['account']["user"]){
            $post_name = $_POST["p_name"];
            $chack_user = $dbcon->query("SELECT COUNT('account_id') FROM tb_account WHERE account_user = '$post_name' ")->fetch();
            if($chack_user[0] > 0){
                echo json_encode(['status' => "มีรายชื่อนี้แล้ว"], JSON_UNESCAPED_UNICODE );
                exit();
            }
            $n_name = $_POST["p_name"];
        }
        else{
            $n_name = $_POST["p_name"];
        }
        // chack_pass
        if($_POST["p_pass"] == ""){
            $n_pass = $_SESSION['account']['p'];
        }
        else{
            $n_pass = $_POST["p_pass"];
        }

        // chack_image
        $file = $_FILES['p_img']['name'];
        if($file == ""){
            if($_SESSION['account']["img"] == "user.png"){
                $n_img = '';
            }else {
                $n_img = $_SESSION['account']["img"];
            }
        }else{
            $infoExt = getimagesize($_FILES['p_img']['tmp_name']);
            if(strtolower($infoExt['mime']) == 'image/gif' || strtolower($infoExt['mime']) == 'image/jpeg' || strtolower($infoExt['mime']) == 'image/jpg' || strtolower($infoExt['mime']) == 'image/png' || strtolower($infoExt['mime']) == 'image/svg'){
                // ลบ img เดิม
                if($_SESSION['account']["img"] != "user.png"){
                    $img_user_del = "../assets/images/users/".$_SESSION['account']["img"];
                    unlink($img_user_del);
                }
                $img_part = pathinfo(basename($file),PATHINFO_EXTENSION); // ่สกุล
                $n_img = "img_user_".$user_id.".".$img_part;
                $location = "../assets/images/users/".$n_img;
                move_uploaded_file($_FILES['p_img']['tmp_name'],$location);
            }else{
                echo json_encode(['status' => "สกุลไฟล์ไม่ถูกต้อง"], JSON_UNESCAPED_UNICODE );
                exit();
            }
        }
        $data = [
            'p1' => $n_name,
            'p2' => $n_pass,
            'p3' => $n_img,
            'p4' => $user_id
        ];
        // echo json_encode($data);
        // exit();
        $sql = "UPDATE `tb_account` SET `account_user`=:p1, `account_pass`=:p2, `account_img`=:p3 WHERE `account_id`=:p4";
        // echo $sql;
        // exit();
        if ($dbcon->prepare($sql)->execute($data) === TRUE) {
            $_SESSION['account']["user"] = $n_name;
            $_SESSION['account']["p"] = $n_pass;
            if ($n_img === "") {
                $_SESSION["account_img"] = "user.png";
            } else {
                $_SESSION['account']["img"] = $n_img;
            }
            $return = [
                'user'  => $n_name,
                'image' => $n_img,
            ];
            echo json_encode(['status' => "Insert_success", "data" => $return], JSON_UNESCAPED_UNICODE );
            exit();
        }else{
            echo json_encode(['status' => "Insert_Error"], JSON_UNESCAPED_UNICODE );
            exit();
        }
    }
    // Add New User
    if($_POST["mode_insert"] == "add_user"){
        $s = $_POST['mode_site'];
        if($_SESSION['account']['level'] != 1){
            $mainID = $_SESSION['account']['id'];
            // echo "SELECT COUNT(`userST_id`) FROM `tb_user_st` WHERE `userST_siteID` = '$s' AND `userST_main` = '$mainID' GROUP BY `userST_accountID`";
            $chack_LimitUser = $dbcon->query("SELECT SUM(account_count) AS total_count
                                                FROM (
                                                    SELECT COUNT(`userST_id`) AS account_count 
                                                    FROM `tb_user_st` 
                                                    WHERE `userST_siteID` = '$s' AND `userST_main` = '$mainID'
                                                    GROUP BY `userST_accountID`
                                                ) AS subquery ")->fetch();
            if($chack_LimitUser[0] >= 5){
                echo json_encode(['status' => "Limit", 'count' => $chack_LimitUser[0]], JSON_UNESCAPED_UNICODE );
                exit();
            }
        }
        // exit();
        $post_name = $_POST["p_name"];
        $chack_user = $dbcon->query("SELECT COUNT('account_id') FROM tb_account WHERE account_user = '$post_name' ")->fetch();
        if($chack_user[0] > 0){
            echo json_encode(['status' => "มีรายชื่อนี้แล้ว"], JSON_UNESCAPED_UNICODE );
            exit();
        }

        // chack_image
        $file = $_FILES['p_img']['name'];
        if($file == ""){
            $n_img = "";
        }else{
            $cont_img = $dbcon->query("SELECT account_id FROM tb_account ORDER BY account_id DESC LIMIT 1 ")->fetch();

            $infoExt = getimagesize($_FILES['p_img']['tmp_name']);
            if(strtolower($infoExt['mime']) == 'image/gif' || strtolower($infoExt['mime']) == 'image/jpeg' || strtolower($infoExt['mime']) == 'image/jpg' || strtolower($infoExt['mime']) == 'image/png' || strtolower($infoExt['mime']) == 'image/svg'){
                $img_part = pathinfo(basename($file),PATHINFO_EXTENSION); // ่สกุล
                $n_img = "img_user_".($cont_img[0]+1).".".$img_part;
                $location = "../assets/images/users/".$n_img;
                move_uploaded_file($_FILES['p_img']['tmp_name'],$location);
            }else{
                echo json_encode(['status' => "สกุลไฟล์ไม่ถูกต้อง"], JSON_UNESCAPED_UNICODE );
                exit();
            }
        }
        $data = [
            'p1' => $post_name,
            'p2' => $_POST["p_pass"],
            'p3' => $n_img,
            'main'=> $user_id
            // 'p4' => $_POST['p_status']
        ];
        // echo json_encode($data);
        // exit();
        $sql = "INSERT INTO `tb_account` (`account_user`, `account_pass`, `account_img`, `account_main`) VALUE (:p1, :p2, :p3, :main)";
        if ($dbcon->prepare($sql)->execute($data) === TRUE) {
            $last_id = $dbcon->lastInsertId();
            if($_POST["mode_house"] == 0){
                if($_SESSION['account']['level'] == 1){
                    $stmt_s = $dbcon->prepare("SELECT house_id FROM `tb_house` WHERE `house_siteID`='$s' ");
                }else{
                    $stmt_s = $dbcon->prepare("SELECT house_id FROM `tb_user_st` INNER JOIN `tb_house` ON tb_user_st.userST_houseID = tb_house.house_id WHERE `userST_accountID`='$user_id' AND userST_siteID = '$s'  GROUP BY userST_houseID ");
                }
                $stmt_s->execute();
                foreach ($stmt_s as $row_) {
                    $data2 = [
                        'p1' => $last_id,
                        'p2' => $s,
                        'p3' => $row_["house_id"],
                        'p4' => $_POST['p_status'],
                        'p5' => $user_id
                    ];
                    $sql2 = "INSERT INTO `tb_user_st`(`userST_accountID`, `userST_siteID`, `userST_houseID`, `userST_level`, `userST_main`) VALUES (:p1, :p2, :p3, :p4, :p5)";
                    if ($dbcon->prepare($sql2)->execute($data2) === FALSE) {
                        echo json_encode(['status' => "Insert_Error",'tb'=>'tbn_user_st'], JSON_UNESCAPED_UNICODE );
                        exit();
                    }
                }
            }
            else{
                $data2 = [
                    'p1' => $last_id,
                    'p2' => $s,
                    'p3' => $_POST["mode_house"],
                    'p4' => $_POST['p_status'],
                    'p5' => $user_id
                ];
                $sql2 = "INSERT INTO `tb_user_st`(`userST_accountID`, `userST_siteID`, `userST_houseID`, `userST_level`, `userST_main`) VALUES (:p1, :p2, :p3, :p4, :p5)";
                if ($dbcon->prepare($sql2)->execute($data2) === FALSE) {
                    echo json_encode(['status' => "Insert_Error",'tb'=>'tbn_user_st'], JSON_UNESCAPED_UNICODE );
                    exit();
                }
            }
            echo json_encode(['status' => "Insert_success", "data" => $data], JSON_UNESCAPED_UNICODE );
            exit();
        }else{
            echo json_encode(['status' => "Insert_Error"], JSON_UNESCAPED_UNICODE );
            exit();
        }
    }
    // edit_user on table
    if($_POST["mode_insert"] == "edit_user"){
        $ustid = $_POST["p_id"];
        $u_acid = $_POST["asid"];
        $siteID = $_POST["mode_site"];
        $houseID = $_POST["mode_house"];
        // user
        $post_name = $_POST["p_name"];
        $chack_user = $dbcon->query("SELECT COUNT('account_id') FROM tb_account WHERE account_user = '$post_name' AND account_id != '$u_acid' ")->fetch();
        if($chack_user[0] > 0){
            echo json_encode(['status' => "มีรายชื่อนี้แล้ว"], JSON_UNESCAPED_UNICODE );
            exit();
        }

        $chack_user = $dbcon->query("SELECT * FROM tb_user_st WHERE userST_id = '$ustid' ")->fetch();
        if($chack_user['userST_siteID'] != $siteID || $chack_user['userST_houseID'] != $houseID){
            $chack_house = $dbcon->query("SELECT COUNT('userST_houseID') FROM tb_user_st WHERE userST_accountID	= '$u_acid' AND userST_houseID = '$houseID' ")->fetch();
            if($chack_house[0] > 0){
                echo json_encode(['status' => "yes_h"], JSON_UNESCAPED_UNICODE );
                exit();
            }
        }
        $data = [
            'p1' => $_POST["mode_site"],
            'p2' => $houseID,
            'p3' => $_POST['p_status'],
            'p4' => $_POST["p_id"]
        ];
        $data2 = [
            'p1' => $post_name,
            'p2' => $_POST["p_pass"],
            'p3' => $_POST["p_suspend"],
            'p4' => $u_acid
        ];

        // echo json_encode($data2);
        // exit();
        $sqlu = "UPDATE `tb_user_st` SET `userST_siteID`=:p1, userST_houseID = :p2, userST_level= :p3 WHERE `userST_id`=:p4";
        if ($dbcon->prepare($sqlu)->execute($data) === TRUE) {
            $sql2 = "UPDATE `tb_account` SET `account_user`=:p1, `account_pass`=:p2, `account_suspend`=:p3 WHERE `account_id`=:p4";
            if ($dbcon->prepare($sql2)->execute($data2) === TRUE) {
                echo json_encode(['status' => "Insert_success", "data" => ''], JSON_UNESCAPED_UNICODE );
                exit();
            }
        }
    }
    // delete_user on table
    if($_POST["mode_insert"] == "delete_user"){
        if ($dbcon->prepare("DELETE FROM tb_user_st WHERE userST_id = :id")->execute(['id'=>$_POST["id"]]) === TRUE) {
            $post_id = $_POST["acid"];
            $chack_user = $dbcon->query("SELECT COUNT('userST_id') FROM tb_user_st WHERE userST_accountID = '$post_id' ")->fetch();
            if($chack_user[0] == 0){
                echo json_encode(['status' => "Delete_success", 'user_id' => $post_id ], JSON_UNESCAPED_UNICODE );
                exit();
            }else{
                echo json_encode(['status' => "Delete_success", 'user_id' => 'No'], JSON_UNESCAPED_UNICODE );
                exit();
            }
        }else {
            echo json_encode(['status' => "Insert_Error"], JSON_UNESCAPED_UNICODE );
            exit();
        }
    }
    // delete_user on system
    if($_POST["mode_insert"] == "delete_user_system"){
        $post_id = $_POST["id"];
        $img = $_POST["img"];
        // echo json_encode(['status' => "Delete_success",  $post_id, $img ], JSON_UNESCAPED_UNICODE );
        //     exit();
        if($img != ""){
            if($img != "user.png"){
                $Delete_image = "../assets/images/users/".$img;
                unlink($Delete_image);
            }
        }
        if ($dbcon->prepare("DELETE FROM tb_account WHERE account_id = :id")->execute(['id'=>$post_id]) === TRUE) {
            echo json_encode(['status' => "Delete_success" ], JSON_UNESCAPED_UNICODE );
            exit();
        }else {
            echo json_encode(['status' => "Insert_Error"], JSON_UNESCAPED_UNICODE );
            exit();
        }
    }
    // add user ที่มี
    if($_POST["mode_insert"] == "add_user_e"){
        $us_sid = $_POST['mode_site'];
        if($_SESSION['account']['level'] != 1){
            $mainID = $_SESSION['account']['id'];
            // echo "SELECT COUNT(`userST_id`) FROM `tb_user_st` WHERE `userST_siteID` = '$s' AND `userST_main` = '$mainID' GROUP BY `userST_accountID`";
            $chack_LimitUser = $dbcon->query("SELECT SUM(account_count) AS total_count
                                                FROM (
                                                    SELECT COUNT(`userST_id`) AS account_count 
                                                    FROM `tb_user_st` 
                                                    WHERE `userST_siteID` = '$us_sid' AND `userST_main` = '$mainID'
                                                    GROUP BY `userST_accountID`
                                                ) AS subquery ")->fetch();
            if($chack_LimitUser[0] >= 5){
                echo json_encode(['status' => "Limit", 'count' => $chack_LimitUser[0]], JSON_UNESCAPED_UNICODE );
                exit();
            }
        }
        // exit();
        $us_id = $_POST['sel_name'];
        $us_hid = $_POST['mode_house'];
        $data = [
            'p1' => $us_id,
            'p2' => $us_sid,
            'p3' => $us_hid,
            'p4' => $_POST["p_status"],
            'p5' => $user_id
        ];
        // echo "SELECT COUNT('userST_id') FROM tb_user_st WHERE userST_accountID = '$us_id' AND userST_siteID = '$us_sid' AND userST_houseID = '$us_hid'";
        // echo json_encode( $data);
        $chack_user = $dbcon->query("SELECT COUNT('userST_id') FROM tb_user_st WHERE userST_accountID = '$us_id' AND userST_siteID = '$us_sid' AND userST_houseID = '$us_hid' ")->fetch();
        if($chack_user[0] > 0){
            echo json_encode(['status' => "yes_h"], JSON_UNESCAPED_UNICODE );
            exit();
        }else{
            $sql2 = "INSERT INTO `tb_user_st`(`userST_accountID`, `userST_siteID`, `userST_houseID`, `userST_level`, `userST_main`) VALUES (:p1, :p2, :p3, :p4, :p5)";
            if ($dbcon->prepare($sql2)->execute($data) === FALSE) {
                echo json_encode(['status' => "Insert_Error",'tb'=>'tbn_user_st'], JSON_UNESCAPED_UNICODE );
                exit();
            }else{
                echo json_encode(['status' => "Insert_success", "data" => ''], JSON_UNESCAPED_UNICODE );
                exit();
            }
        }
    }
