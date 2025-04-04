<?php
session_start();
// echo json_encode($_POST);
if(isset($_POST['login'])){
    $data = $_POST['login'];
    // echo $data['dt'];
    $_SESSION['account'] = [
        'id'    => $data['account_id'],
        'user'  => $data['account_name'],
        'img'   => $data['image'],
        'level' => $data['level'],
        'p'     => $data['p']
    ];
    $_SESSION["theme"] = $data['theme'];
    // $_SESSION['statusSite']        = $data['site_'];

    if($data['level'] == 1){
        $_SESSION['display'] = [
            'countSite'     => '',
            'siteID'        => '',
            'countHouse'    => '',
            'select'        => [
                'siteID'    => '',
                'houseID'   => '',
                'sn'        => '',
                'phase'     => '',
                'temp'      => '',
            ]
        ];
    }else{
        if($data['logSite']['count_site'] == 1){
            // site = 1
            if($data['logSite']['count_house'] == 1){
                // House = 1
                $_SESSION['display'] = [
                    'countSite'=> $data['logSite']['count_site'],
                    'countHouse'=> $data['logSite']['count_house'],
                    'siteID'    => $data['logSite']['siteID'],
                    'houseID'   => $data['logSite']['houseID'],
                    'select'    => [
                        'siteID'    => $data['logSite']['siteID'],
                        'siteName'  => $data['logSite']['siteName'],
                        'houseID'   => $data['logSite']['houseID'],
                        'houseName' => $data['logSite']['houseName'],
                        'loopHouse' => '0',
                        'sn'        => $data['logSite']['houseSN'],
                        'phase'     => $data['logSite']['phase'],
                        'temp'      => $data['logSite']['stemp'],
                        'loop'      => '0',
                    ]
                ];
            }
            else{
                // House > 1
                $_SESSION['display'] = [
                    'countSite' => $data['logSite']['count_site'],
                    'siteID'    => $data['logSite']['siteID'],
                    'siteName'  => $data['logSite']['siteName'],
                    'countHouse'=> $data['logSite']['count_house'],
                    'select'    => [
                        'siteID'    => $data['logSite']['siteID'],
                        'houseID'   => '',
                        'sn'        => '',
                        'phase'     => '',
                        'temp'      => '',
                    ]
                ];
            }
            $_SESSION['display']['select']['loop'] = '0';
        }else{ // Site > 1
            $_SESSION['display'] = [
                'countSite' => $data['logSite']['count_site'],
                'select'    => [
                        'siteID'    => '',
                        'houseID'   => '',
                        'sn'        => '',
                        'phase'     => '',
                        'temp'      => '',
                    ]
            ];
        }
    }
    $_SESSION['display']['logSite'] = $data['logSite']['log'];
}

if (isset($_POST['logout'])) {
    session_destroy();
    echo json_encode("logout_succress");
    exit();
}
if(isset($_POST['select'])){
    if ($_POST['select'] == 'selectSite') {
        $json = $_POST['log'];
        $_SESSION['display']['select']['siteID'] = $json['site_id'];
        $_SESSION['display']['select']['siteName'] = $json['site_name'];
        $_SESSION['display']['select']['loop']   = $_POST['loop'];
        if(count($json['houses']) == 1){
            $log = $json['houses'][0];
            // echo json_encode($log['house_id']);exit();
            $_SESSION['display']['select']['houseID']   = $log['house_id'];
            $_SESSION['display']['select']['phase']     = $log['house_phase'];
            $_SESSION['display']['select']['sn']        = $log['house_sn'];
            $_SESSION['display']['select']['houseName'] = $log['house_name'];
            $_SESSION['display']['select']['temp']      = $log['house_temp'];
            $_SESSION['display']['select']['loopHouse'] = '0';


            // $_SESSION['display']['select']['selH1'] = 1;
        }else{
            $_SESSION['display']['select']['houseName'] = '';
            // $_SESSION['display']['select']['selH1'] = 0;
        }
    }
    if ($_POST['select'] == 'selectHouse') {
        $json = $_POST['log'];
        $_SESSION['display']['select']['houseID']   = $json['house_id'];
        $_SESSION['display']['select']['phase']     = $json['house_phase'];
        $_SESSION['display']['select']['sn']        = $json['house_sn'];
        $_SESSION['display']['select']['houseName'] = $json['house_name'];
        $_SESSION['display']['select']['temp']      = $json['house_temp'];
        $_SESSION['display']['select']['loopHouse'] = $_POST['loop'];
        // // echo json_encode();
        // exit();
        // $_SESSION['display']['select']['selH1'] = 0;
    }
}

if (isset($_SESSION["account"])) {
    echo json_encode([
        'account' => $_SESSION['account'],
        'theme'      => $_SESSION["theme"],
        'display' => $_SESSION['display'],
        'dt'         => date("Y-m-d").' '.date("H:i:s", strtotime('30 minute')) //hour
    ], JSON_UNESCAPED_UNICODE);
}
else {
    echo json_encode(['account'  => ""]);
}
