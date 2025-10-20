<?php
    require "connectdb.php";

    if (isset($_POST['name'])) {
        $username = $_POST['name'];
        $password = $_POST['pass'];
        // echo $username." and ".$password." and ".$_POST["status"];
        // exit();

        $query = $dbcon->query("SELECT *, COUNT('account_user') AS count_user FROM tb_account WHERE account_user = '$username' AND account_pass = '$password' ");
        $row_count = $query->fetch();
        // echo $row_count['count_user']; exit();
        if ($row_count['count_user'] == 0) {
            echo json_encode([
                'status' => false,
                'message' => 'No user'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        if ($row_count['account_suspend'] == 0) {
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
        if ($row_count["account_img"] == "") {
            $account_img = "user.png";
        } else {
            $account_img = $row_count["account_img"];
        }
        $account_p = $row_count['account_pass'];

        $level_1 = $dbcon->query("SELECT COUNT(`userST_level`) FROM `tb_user_st` WHERE `userST_accountID`='$u_id' AND `userST_level` = 1 ")->fetch()[0];
        if($level_1 > 0){ // sup
            $level = 1;
            // $count_s = "";
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
            if($level_2 > 0){ // admin
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
            $stmtSH = $dbcon->query("SELECT * FROM  `tb_user_st` 
                        INNER JOIN `tb_site` ON tb_user_st.userST_siteID = tb_site.site_id 
                        INNER JOIN `tb_house` ON tb_user_st.userST_houseID = tb_house.house_id
                        WHERE `userST_accountID` = '$u_id' ");
        }
        foreach ($stmtSH as $row) {
            $logSite[] = $row;
        }
        $display['logSite'] = $logSite;
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
                'dt'         => date("Y-m-d").' '.date("H:i:s", strtotime('30 minute')) //hour
            ]
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }