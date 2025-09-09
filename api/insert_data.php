<?php
    require "connectdb.php";
    // Return JSON response
    header('Content-Type: application/json');
    if(isset($_POST['get_data'])){
        $meter = $dbcon->query("SELECT `house_sn` FROM `tb_house` ");
        foreach ($meter as $row) {
            $house_sn = $row[0];
            $drow_ = $dbcon->query("SELECT `data_timestamp` FROM `tb_data_sensor` WHERE `data_sn`='$house_sn' ORDER BY `data_timestamp` DESC LIMIT 1")->fetch();
            if($drow_ == false){
                $dd = false;
            }else{
                $dd = $drow_[0];
            }
            $data[] = [
                'sn' => $house_sn,
                'data_timestamp' => $dd
            ];
            // $data[] = $data0;
        }
        echo json_encode($data);
       
    }
    elseif(isset($_POST['insert_data'])){
        $json = json_decode($_POST['insert_data']);
        // echo $json;
        // echo json_encode($json->ID);
        // exit();
        // $sn = $json->ID;
        // if($sn == 'FC4D0527843C'){ // อบต.กาสิน
        //     $row = $dbcon->query("SELECT data_e FROM `tb_data_sensor` WHERE `data_sn`='$sn' ORDER BY data_timestamp DESC LIMIT 1")->fetch();
        //     $pTotal = $json->Active_Power_Total;
        //     $energy = ($pTotal/60)+$row[0];
        //     $data = [
        //         'dt'        => $json->timestamp,     //date("Y/m/d - H:i:s"), //$date.' - '.$time,
        //         'sn'        => $sn,
        //         "V_AB"     => $json->Voltage_AB,
        //         "V_BC"     => $json->Voltage_BC,
        //         "V_CA"     => $json->Voltage_CA,
        //         "V_LL_Avg" => $json->Voltage_LL_Avg,
        //         "V_AN"     => $json->Voltage_AN,
        //         "V_BN"     => $json->Voltage_BN,
        //         "V_CN"     => $json->Voltage_CN,
        //         "V_LN_Avg" => $json->Voltage_LN_Avg,
        //         "C_A"       => $json->Current_A,
        //         "C_B"       => $json->Current_B,
        //         "C_C"       => $json->Current_C,
        //         "C_N"       => $json->Current_N,
        //         "C_G"       => $json->Current_G,
        //         "C_Avg"     => $json->Current_Avg,
        //         "Atp_A"     => $json->Active_Power_A,
        //         "Atp_B"     => $json->Active_Power_B,
        //         "Atp_C"     => $json->Active_Power_C,
        //         "Atp_Total" => $pTotal,
        //         "Ratp_A"    => $json->Reactive_Power_A,
        //         "Ratp_B"    => $json->Reactive_Power_B,
        //         "Ratp_C"    => $json->Reactive_Power_C,
        //         "Ratp_Total" => $json->Reactive_Power_Total,
        //         "App_A"     => $json->Apparent_Power_A,
        //         "App_B"     => $json->Apparent_Power_B,
        //         "App_C"     => $json->Apparent_Power_C,
        //         "pf"        => $json->Power_Factor_Total,
        //         "f"         => $json->Frequency,
        //         "e"         => $energy,
        //         "t"         => $json->Temperature
        //     ];
        // }else{

        if(!isset($json->timestamp)){
            $json->timestamp = date("Y/m/d - H:i:s");
        }
            $data = [
                'dt'        => $json->timestamp,     //date("Y/m/d - H:i:s"), //$date.' - '.$time,
                'sn'        => $json->ID,
                "V_AB"     => $json->Voltage_AB,
                "V_BC"     => $json->Voltage_BC,
                "V_CA"     => $json->Voltage_CA,
                "V_LL_Avg" => $json->Voltage_LL_Avg,
                "V_AN"     => $json->Voltage_AN,
                "V_BN"     => $json->Voltage_BN,
                "V_CN"     => $json->Voltage_CN,
                "V_LN_Avg" => $json->Voltage_LN_Avg,
                "C_A"       => $json->Current_A,
                "C_B"       => $json->Current_B,
                "C_C"       => $json->Current_C,
                "C_N"       => $json->Current_N,
                "C_G"       => $json->Current_G,
                "C_Avg"     => $json->Current_Avg,
                "Atp_A"     => $json->Active_Power_A,
                "Atp_B"     => $json->Active_Power_B,
                "Atp_C"     => $json->Active_Power_C,
                "Atp_Total" => $json->Active_Power_Total,
                "Ratp_A"    => $json->Reactive_Power_A,
                "Ratp_B"    => $json->Reactive_Power_B,
                "Ratp_C"    => $json->Reactive_Power_C,
                "Ratp_Total" => $json->Reactive_Power_Total,
                "App_A"     => $json->Apparent_Power_A,
                "App_B"     => $json->Apparent_Power_B,
                "App_C"     => $json->Apparent_Power_C,
                "pf"        => $json->Power_Factor_Total,
                "f"         => $json->Frequency,
                "e"         => $json->Active_Energy_Delivered,
                "t"         => $json->Temperature
            ];
        // }
        // echo "success";//json_encode($data);
        // exit();
        try{
            $sql = "INSERT INTO `tb_data_sensor`(`data_timestamp`, `data_sn`, 
                        `data_v_A-B`,   `data_v_B-C`,   `data_v_C-A`,   `data_v_L-L-AVG`, 
                        `data_v_A-N`,   `data_v_B-N`,   `data_v_C-N`,   `data_v_L-N-AVG`, 
                        `data_c_A`,     `data_c_B`,     `data_c_C`,     `data_c_N`,         `data_c_G`, `data_c_AVG`, 
                        `data_atp-A`,   `data_atp-B`,   `data_atp-C`,   `data_atp-Total`, 
                        `data_ratp-A`,  `data_ratp-B`,  `data_ratp-C`,  `data_ratp-Total`, 
                        `data_app_A`,   `data_app_B`,   `data_app_C`, 
                        `data_pf`,      `data_f`,       `data_e`,       `data_temp`) 
                    VALUES (:dt, :sn, :V_AB, :V_BC, :V_CA, :V_LL_Avg, 
                            :V_AN, :V_BN, :V_CN, :V_LN_Avg, 
                            :C_A, :C_B, :C_C, :C_N, :C_G, :C_Avg,
                            :Atp_A, :Atp_B, :Atp_C, :Atp_Total, 
                            :Ratp_A, :Ratp_B, :Ratp_C, :Ratp_Total, 
                            :App_A, :App_B, :App_C, 
                            :pf, :f, :e, :t)";
            $stmt = $dbcon->prepare($sql)->execute($data);
            if ($stmt === TRUE) {
                echo "Insert_Success / sn ".$json->ID." / date ".$json->timestamp ;
            }else{
                echo "Error / sn ".$json->ID." / date ".$json->timestamp ;
            }
        }catch(Exception $ex){
            echo $ex->getMessage();
        }
    }
    elseif(isset($_GET['sn'])){
        $sn = $_GET['sn'];
        
        if(Is_numeric( $_GET['volt'] )){    $volt = $_GET['volt'];          }else{ $volt = 0; }
        if(Is_numeric( $_GET['current'] )){ $current = $_GET['current'];    }else{ $current = 0; }
        if(Is_numeric( $_GET['power'] )){   $power = $_GET['power'];        }else{ $power = 0; }
        if(Is_numeric( $_GET['pf'] )){      $pf = $_GET['pf'];              }else{ $pf = 0; }
        if(Is_numeric( $_GET['frequency'])){$frequency = $_GET['frequency'];}else{ $frequency = 0; }
        if(Is_numeric( $_GET['energy'] )){  $energy = $_GET['energy'];      }else{ $energy = 0; }
        if(Is_numeric( $_GET['temp'] )){    $temp = $_GET['temp'];          }else{ $temp = 0; }

        $data = [
            'dt' => date("Y/m/d - H:i:s"), //$date.' - '.$time,
            'sn' => $sn,
            'v'  => $volt,
            'c'  => $current,
            'p'  => $power,
            'pf' => $pf,
            'f'  => $frequency,
            'e'  => $energy,
            't'  => $temp
        ];
        // echo json_encode($data);
        // exit();
        try{
            $ins_cont = "INSERT INTO `tb_data_sensor_mini`(`data_timestamp`, `data_sn`, `data_v`, `data_c`, `data_p`, `data_pf`, `data_f`, `data_e`, `data_t`) 
                        VALUES (:dt, :sn, :v, :c, :p, :pf, :f, :e, :t)";
            if ($dbcon->prepare($ins_cont)->execute($data) === TRUE) {
                echo json_encode("Insert_Success / sn ".$sn." / date".date("Y/m/d - H:i:s") );
            }else{
                echo json_encode("Error / sn ".$sn." / date".date("Y/m/d - H:i:s") );
            }
        }catch(Exception $ex){
            echo $ex->getMessage();
        }
        // 192.168.1.70/powermeter/config/insert_data.php?sn="TESTPOWER0001"&volt=10&current=11&power=12&pf=13&frequency=14&energy=15&temp=0
        // 192.168.1.70/powermeter/config/insert_data.php?sn=TESTPOWER0001&volt=10&current=11&power=12&pf=13&frequency=14&energy=15&temp=0
    }
    else{
        echo json_encode("Error: Invalid Request");
    }