<?php
    require "connectdb.php";

    $json = $_POST['val'];
    // echo json_encode($json);
    // exit();
    for($i = 0; $i < count($json); $i++){
        $data['siteID'] = $siteID = $json[$i]['siteID'];
        $data['houseID'] = $houseID = $json[$i]['houseID'];
        $house_sn = $json[$i]['sn'];
        $data['phase'] = $json[$i]['phase'];
        if($json[$i]['phase'] == 2){
            $drow_= $dbcon->query("SELECT *, UNIX_TIMESTAMP(STR_TO_DATE(SUBSTRING(data_timestamp,1,18), '%Y/%m/%d - %H:%i')) AS ts FROM `tb_data_sensor_mini` WHERE `data_sn`='$house_sn' ORDER BY `data_timestamp` DESC LIMIT 1")->fetch();
            if( !isset($drow_['data_timestamp'])){
                $data['date']   = '-';
                $data['ts']     = '-';
                $data['v_AN']   = '-';
                $data['v_BN']   = '-';
                $data['v_CN']   = '-';
                $data['v_LN']   = '-';
                $data['c_A']    = '-';
                $data['c_B']    = '-';
                $data['c_C']    = '-';
                $data['c_AVG']  = '-';
                $data['atp_A']   = '-';
                $data['atp_B']   = '-';
                $data['atp_C']   = '-';
                $data['atp_Total']   = '-';
                $data['e']      = '-';
                $data['temp']      = '-';

            }
            else {
                $data['date']   = $drow_['data_timestamp'];
                $data['ts']     = $drow_['ts'];
                $data['v_AN']   = '-';
                $data['v_BN']   = '-';
                $data['v_CN']   = '-';
                if($drow_['data_v'] == 0){ $data['v_LN']   = 0; }else{ $data['v_LN']   = round($drow_['data_v'],2); }

                $data['c_A']    = '-';
                $data['c_B']    = '-';
                $data['c_C']    = '-';
                if($drow_['data_c'] == 0){ $data['c_AVG']  = 0; }else{ $data['c_AVG']  = round($drow_['data_c'],2); }

                $data['atp_A']   = '-';
                $data['atp_B']   = '-';
                $data['atp_C']   = '-';
                if($drow_['data_p'] == 0){ $data['atp_Total'] = 0; }else{
                    if ($drow_['data_p'] < 0) {
                        // หอโหวดชั้น 33
                        $data['atp_Total'] = round(($drow_['data_p']/1000)*(-1),2);
                    }else{
                        $data['atp_Total'] = round(($drow_['data_p']/1000),2);
                    }
                }

                if($drow_['data_e']  == 0){ $data['e']     = 0; }else{ $data['e']     = round($drow_['data_e'],2); }
                if($drow_['data_t']  == 0){ $data['temp']     = 0; }else{ $data['temp']     = round($drow_['data_t'],2); }
            }
        }
        else{ // miter big
            $drow_= $dbcon->query("SELECT *,UNIX_TIMESTAMP(STR_TO_DATE(SUBSTRING(data_timestamp,1,18), '%Y/%m/%d - %H:%i')) AS ts FROM `tb_data_sensor` WHERE `data_sn`='$house_sn' ORDER BY `data_timestamp` DESC LIMIT 1")->fetch();
            $data['sn']   = $drow_['data_sn'];
            if( !isset($drow_['data_timestamp'])){
                $data['date']   = '-';
                $data['ts']   = '-';
                $data['v_AN']   = '-';
                $data['v_BN']   = '-';
                $data['v_CN']   = '-';
                $data['v_LN']   = '-';
                $data['c_A']    = '-';
                $data['c_B']    = '-';
                $data['c_C']    = '-';
                $data['c_AVG']  = '-';
                $data['atp_A']   = '-';
                $data['atp_B']   = '-';
                $data['atp_C']   = '-';
                $data['atp_Total']   = '-';
                $data['e']      = '-';
                $data['temp']      = '-';

            }
            else {
                $data['date']   = $drow_['data_timestamp'];
                $data['ts']   = $drow_['ts'];
                // $data['date']   = $drow_['data_timestamp'];
                if($drow_['data_v_A-N']     == 0){ $data['v_AN']   = 0; }else{ $data['v_AN']   = round($drow_['data_v_A-N'],2); }
                if($drow_['data_v_B-N']     == 0){ $data['v_BN']   = 0; }else{ $data['v_BN']   = round($drow_['data_v_B-N'],2); }
                if($drow_['data_v_C-N']     == 0){ $data['v_CN']   = 0; }else{ $data['v_CN']   = round($drow_['data_v_C-N'],2); }
                if($drow_['data_v_L-N-AVG'] == 0){ $data['v_LN']   = 0; }else{ $data['v_LN']   = round($drow_['data_v_L-N-AVG'],2); }

                if($drow_['data_c_A']   == 0){ $data['c_A']    = 0; }else{ $data['c_A']    = round($drow_['data_c_A'],2); }
                if($drow_['data_c_B']   == 0){ $data['c_B']    = 0; }else{ $data['c_B']    = round($drow_['data_c_B'],2); }
                if($drow_['data_c_C']   == 0){ $data['c_C']    = 0; }else{ $data['c_C']    = round($drow_['data_c_C'],2); }
                if($drow_['data_c_AVG'] == 0){ $data['c_AVG']  = 0; }else{ $data['c_AVG']  = round($drow_['data_c_AVG'],2); }

                if($drow_['data_atp-A']     == 0){ $data['atp_A']     = 0; }else{
                    if ($drow_['data_atp-A'] < 0) {
                        $data['atp_A'] = round(($drow_['data_atp-A'])*(-1),2);
                    }else{
                        $data['atp_A']     = round($drow_['data_atp-A'],2);
                    }
                }
                if($drow_['data_atp-B']     == 0){ $data['atp_B']     = 0; }else{
                    // $data['atp_B']     = round($drow_['data_atp-B'],2);
                    if ($drow_['data_atp-B'] < 0) {
                        $data['atp_B'] = round(($drow_['data_atp-B'])*(-1),2);
                    }else{
                        $data['atp_B']     = round($drow_['data_atp-B'],2);
                    }
                }
                if($drow_['data_atp-C']     == 0){ $data['atp_C']     = 0; }else{
                    // $data['atp_C']     = round($drow_['data_atp-C'],2);
                    if ($drow_['data_atp-C'] < 0) {
                        $data['atp_C'] = round(($drow_['data_atp-C'])*(-1),2);
                    }else{
                        $data['atp_C']     = round($drow_['data_atp-C'],2);
                    }
                }
                if($drow_['data_atp-Total'] == 0){ $data['atp_Total'] = 0; }else{
                    // $data['atp_Total'] = round($drow_['data_atp-Total'],2);
                    if ($drow_['data_atp-Total'] < 0) {
                        $data['atp_Total'] = round(($drow_['data_atp-Total'])*(-1),2);
                    }else{
                        $data['atp_Total']     = round($drow_['data_atp-Total'],2);
                    }
                }

                if($drow_['data_e']     == 0){ $data['e']     = 0; }else{ $data['e']     = round($drow_['data_e'],2); }
                if($drow_['data_temp']  == 0){ $data['temp']     = 0; }else{ $data['temp']     = round($drow_['data_temp'],2); }

            }
        }
        $data0[] = $data;
    }
    $data0[count($data0)] = date("Y/m/d").' - '.date("H:i", strtotime('-1 minute'));
    echo json_encode($data0);
