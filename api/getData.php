<?php
    require "connectdb.php";

    $json = $_POST['val'];
    $mini_sns = [];
    $big_sns = [];

    // แยก serial number (sn) ตามประเภท phase
    foreach($json as $item) {
        if ($item['phase'] == 2) {
            $mini_sns[] = $item['sn'];
        } else {
            $big_sns[] = $item['sn'];
        }
    }

    $all_data = [];

    // 1. Query สำหรับ phase 2 (tb_data_sensor_mini)
    if (!empty($mini_sns)) {
        // สร้าง string สำหรับเงื่อนไข IN
        $mini_sns_string = "'" . implode("','", $mini_sns) . "'";
        $sql_mini = "SELECT *, UNIX_TIMESTAMP(STR_TO_DATE(SUBSTRING(data_timestamp,1,18), '%Y/%m/%d - %H:%i')) AS ts FROM `tb_data_sensor_mini` WHERE `data_sn` IN ($mini_sns_string) ORDER BY `data_timestamp` DESC";
        $result_mini = $dbcon->query($sql_mini);

        if ($result_mini) {
            $latest_data = [];
            while ($row = $result_mini->fetch(PDO::FETCH_ASSOC)) {
                // เก็บข้อมูลล่าสุดสำหรับแต่ละ sn
                if (!isset($latest_data[$row['data_sn']])) {
                    $latest_data[$row['data_sn']] = $row;
                }
            }
            // จัดการข้อมูลสำหรับ phase 2
            foreach ($mini_sns as $sn) {
                if (isset($latest_data[$sn])) {
                    $drow_ = $latest_data[$sn];
                    $data = [
                        'siteID' => $json[array_search($sn, array_column($json, 'sn'))]['siteID'],
                        'houseID' => $json[array_search($sn, array_column($json, 'sn'))]['houseID'],
                        'phase' => 2,
                        'date' => $drow_['data_timestamp'],
                        'ts' => $drow_['ts'],
                        'v_LN' => ($drow_['data_v'] == 0) ? 0 : round($drow_['data_v'], 2),
                        'c_AVG' => ($drow_['data_c'] == 0) ? 0 : round($drow_['data_c'], 2),
                        'atp_Total' => ($drow_['data_p'] == 0) ? 0 : round(abs($drow_['data_p']) / 1000, 2),
                        'e' => ($drow_['data_e'] == 0) ? 0 : round($drow_['data_e'], 2),
                        'temp' => ($drow_['data_t'] == 0) ? 0 : round($drow_['data_t'], 2),
                        // กำหนดค่าอื่นๆ เป็น '-' ตามเดิม
                        'v_AN' => '-', 'v_BN' => '-', 'v_CN' => '-',
                        'c_A' => '-', 'c_B' => '-', 'c_C' => '-',
                        'atp_A' => '-', 'atp_B' => '-', 'atp_C' => '-'
                    ];
                    $all_data[] = $data;
                } else {
                    // ไม่พบข้อมูล
                    $data = [
                        'siteID' => $json[array_search($sn, array_column($json, 'sn'))]['siteID'],
                        'houseID' => $json[array_search($sn, array_column($json, 'sn'))]['houseID'],
                        'phase' => 2,
                        'date' => '-', 'ts' => '-', 'v_AN' => '-', 'v_BN' => '-', 'v_CN' => '-', 'v_LN' => '-',
                        'c_A' => '-', 'c_B' => '-', 'c_C' => '-', 'c_AVG' => '-',
                        'atp_A' => '-', 'atp_B' => '-', 'atp_C' => '-', 'atp_Total' => '-',
                        'e' => '-', 'temp' => '-'
                    ];
                    $all_data[] = $data;
                }
            }
        }
    }

    // 2. Query สำหรับ phase อื่นๆ (tb_data_sensor)
    if (!empty($big_sns)) {
        // สร้าง string สำหรับเงื่อนไข IN
        $big_sns_string = "'" . implode("','", $big_sns) . "'";
        $sql_big = "SELECT *, UNIX_TIMESTAMP(STR_TO_DATE(SUBSTRING(data_timestamp,1,18), '%Y/%m/%d - %H:%i')) AS ts FROM `tb_data_sensor` WHERE `data_sn` IN ($big_sns_string) ORDER BY `data_timestamp` DESC";
        $result_big = $dbcon->query($sql_big);

        if ($result_big) {
            $latest_data = [];
            while ($row = $result_big->fetch(PDO::FETCH_ASSOC)) {
                // เก็บข้อมูลล่าสุดสำหรับแต่ละ sn
                if (!isset($latest_data[$row['data_sn']])) {
                    $latest_data[$row['data_sn']] = $row;
                }
            }
            // จัดการข้อมูลสำหรับ phase อื่นๆ
            foreach ($big_sns as $sn) {
                if (isset($latest_data[$sn])) {
                    $drow_ = $latest_data[$sn];
                    $data = [
                        'siteID' => $json[array_search($sn, array_column($json, 'sn'))]['siteID'],
                        'houseID' => $json[array_search($sn, array_column($json, 'sn'))]['houseID'],
                        'phase' => '-',
                        'sn' => $drow_['data_sn'],
                        'date' => $drow_['data_timestamp'],
                        'ts' => $drow_['ts'],
                        'v_AN' => ($drow_['data_v_A-N'] == 0) ? 0 : round($drow_['data_v_A-N'], 2),
                        'v_BN' => ($drow_['data_v_B-N'] == 0) ? 0 : round($drow_['data_v_B-N'], 2),
                        'v_CN' => ($drow_['data_v_C-N'] == 0) ? 0 : round($drow_['data_v_C-N'], 2),
                        'v_LN' => ($drow_['data_v_L-N-AVG'] == 0) ? 0 : round($drow_['data_v_L-N-AVG'], 2),
                        'c_A' => ($drow_['data_c_A'] == 0) ? 0 : round($drow_['data_c_A'], 2),
                        'c_B' => ($drow_['data_c_B'] == 0) ? 0 : round($drow_['data_c_B'], 2),
                        'c_C' => ($drow_['data_c_C'] == 0) ? 0 : round($drow_['data_c_C'], 2),
                        'c_AVG' => ($drow_['data_c_AVG'] == 0) ? 0 : round($drow_['data_c_AVG'], 2),
                        'atp_A' => ($drow_['data_atp-A'] == 0) ? 0 : round(abs($drow_['data_atp-A']), 2),
                        'atp_B' => ($drow_['data_atp-B'] == 0) ? 0 : round(abs($drow_['data_atp-B']), 2),
                        'atp_C' => ($drow_['data_atp-C'] == 0) ? 0 : round(abs($drow_['data_atp-C']), 2),
                        'atp_Total' => ($drow_['data_atp-Total'] == 0) ? 0 : round(abs($drow_['data_atp-Total']), 2),
                        'e' => ($drow_['data_e'] == 0) ? 0 : round($drow_['data_e'], 2),
                        'temp' => ($drow_['data_temp'] == 0) ? 0 : round($drow_['data_temp'], 2)
                    ];
                    $all_data[] = $data;
                } else {
                    // ไม่พบข้อมูล
                    $data = [
                        'siteID' => $json[array_search($sn, array_column($json, 'sn'))]['siteID'],
                        'houseID' => $json[array_search($sn, array_column($json, 'sn'))]['houseID'],
                        'phase' => '-',
                        'sn' => $sn,
                        'date' => '-', 'ts' => '-', 'v_AN' => '-', 'v_BN' => '-', 'v_CN' => '-', 'v_LN' => '-',
                        'c_A' => '-', 'c_B' => '-', 'c_C' => '-', 'c_AVG' => '-',
                        'atp_A' => '-', 'atp_B' => '-', 'atp_C' => '-', 'atp_Total' => '-',
                        'e' => '-', 'temp' => '-'
                    ];
                    $all_data[] = $data;
                }
            }
        }
    }

    $all_data[] = date("Y/m/d").' - '.date("H:i", strtotime('-1 minute'));
    echo json_encode($all_data);
?>