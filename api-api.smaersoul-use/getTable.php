<?php
    require 'connectdb.php';

    $sn = $_POST["sn"];

    $sn = $sn;//'TESTPOWER000'.$sn;
    if ($_POST["status"] == 'realtime') {
        $start_day = date("Y/m/d - H:i:s", strtotime('-1 day'));
        $stop_day = date("Y/m/d - H:i:s");
        $where_d = "`data_sn`='$sn' AND `data_timestamp` BETWEEN '$start_day' AND '$stop_day'";
    } else if ($_POST["status"] == 'day') {
        $start_day = date("Y/m/d - H:i:s", strtotime('-1 day'));
        $stop_day = date("Y/m/d - H:i:s");
        $where_d = "`data_sn`='$sn' AND `data_timestamp` BETWEEN '$start_day' AND '$stop_day'";
    } else if ($_POST["status"] == 'week') {
        $start_day = date("Y/m/d", strtotime('-6 day'));
        $stop_day = date("Y/m/d");
        $where_d = "`data_sn`='$sn' AND SUBSTRING(`data_timestamp`,1,10) BETWEEN '$start_day' AND '$stop_day'";
        // echo $where_d;
        // exit();
    } else if ($_POST["status"] == 'month') {
        function calculator_day($date_start){ // count day in month
            $day = 0;
            $date_end =date("Y-m-d", strtotime("+1 month",strtotime($date_start)));
            while($date_start<$date_end){
                $date_start =date("Y-m-d", strtotime("+1 day",strtotime($date_start)));
                $day++;
            }
            return $day;
        }
        $cont_date =  calculator_day($_POST["year"]."-".$_POST["month"]."-01");
        // echo $cont_date;

        $data_date = $_POST["year"]."/".$_POST["month"];
        $where_d = "`data_sn`='$sn' AND SUBSTRING(`data_timestamp`,1,7) = '$data_date'";
        // echo $where_d;
        // exit();
    }
    if($_POST['phase'] == 3){ // meter ใหญ่
        if ($sn == "FC4D0527843C") {
            // อบต.กาสิน
            $sql = "SELECT
                UNIX_TIMESTAMP(STR_TO_DATE(SUBSTRING(data_timestamp,1,18), '%Y/%m/%d - %H:%i')) AS ts,
                -- SUBSTRING(`data_timestamp`,1,18), SUBSTRING(`data_timestamp`,1,10), SUBSTRING(`data_timestamp`,14,5),
                round( AVG(`data_v_A-N`), 2) AS v_AN,
                round( AVG(`data_v_B-N`), 2) AS v_BN,
                round( AVG(`data_v_C-N`), 2) AS v_CN,
                round( AVG(`data_v_L-N-AVG`), 2) AS v_Avg,
                round( AVG(`data_c_A`), 2) AS c_A,
                round( AVG(`data_c_B`), 2) AS c_B,
                round( AVG(`data_c_C`), 2) AS c_C,
                round( AVG(`data_c_AVG`), 2) AS c_Avg,
                round( AVG(CASE WHEN data_id < 353880 THEN `data_atp-A` * (-1) ELSE `data_atp-A` END), 2) AS p_A,
                round( AVG(CASE WHEN data_id < 353880 THEN `data_atp-B` * (-1) ELSE `data_atp-B` END), 2) AS p_B,
                round( AVG(CASE WHEN data_id < 353880 THEN `data_atp-C` * (-1) ELSE `data_atp-C` END), 2) AS p_C,
                round( AVG(CASE WHEN data_id < 353880 THEN `data_atp-Total` * (-1) ELSE `data_atp-Total` END), 2) AS p_Total,
                round( AVG(CASE WHEN data_id < 353880 THEN `data_e` * (-1) ELSE `data_e` END), 2) AS e_data,
                round( AVG(`data_temp`), 2) AS t_data
                FROM `tb_data_sensor` WHERE $where_d 
                    AND data_e != 0 
                    AND `data_v_L-N-AVG` != 0 
                    GROUP BY SUBSTRING(`data_timestamp`,1,18) ORDER BY `data_timestamp`";
        }
        else{
            $sql = "SELECT
                -- SUBSTRING(`data_timestamp`,1,18), SUBSTRING(`data_timestamp`,1,10), SUBSTRING(`data_timestamp`,14,5),
                UNIX_TIMESTAMP(STR_TO_DATE(SUBSTRING(data_timestamp,1,18), '%Y/%m/%d - %H:%i')) AS ts,
                round( AVG(`data_v_A-N`), 2) AS v_AN,
                round( AVG(`data_v_B-N`), 2) AS v_BN,
                round( AVG(`data_v_C-N`), 2) AS v_CN,
                round( AVG(`data_v_L-N-AVG`), 2) AS v_Avg,
                round( AVG(`data_c_A`), 2) AS c_A,
                round( AVG(`data_c_B`), 2) AS c_B,
                round( AVG(`data_c_C`), 2) AS c_C,
                round( AVG(`data_c_AVG`), 2) AS c_Avg,
                round( AVG(`data_atp-A`), 2) AS p_A,
                round( AVG(`data_atp-B`), 2) AS p_B,
                round( AVG(`data_atp-C`), 2) AS p_C,
                round( AVG(`data_atp-Total`), 2) AS p_Total,
                round( AVG(`data_e`), 2) AS e_data,
                round( AVG(`data_temp`), 2) AS t_data
                FROM `tb_data_sensor` WHERE $where_d 
                    AND data_e != 0 
                    AND `data_v_L-N-AVG` != 0 
                    GROUP BY SUBSTRING(`data_timestamp`,1,18) ORDER BY `data_timestamp`";
        }
    }
    elseif($_POST['phase'] == 2){ // meter เล็ก
        if ($sn == "E01D01BF13886") {
            // หอโหวดชั้น 33
            $sql = "SELECT
                -- SUBSTRING(`data_timestamp`,1,18), SUBSTRING(`data_timestamp`,1,10), SUBSTRING(`data_timestamp`,14,5),
                UNIX_TIMESTAMP(STR_TO_DATE(SUBSTRING(data_timestamp,1,18), '%Y/%m/%d - %H:%i')) AS ts,
                round( AVG(`data_v`), 2) AS v_Avg,
                round( AVG(`data_c`), 2) AS c_Avg,
                round( (AVG(`data_p`)/1000)*(-1), 2) AS p_Total,
                round( AVG(`data_e`), 2) AS e_data,
                round( AVG(`data_t`), 2) AS t_data
            FROM `tb_data_sensor_mini` WHERE $where_d 
                AND data_e != 0 
                AND data_v != 0 
                GROUP BY SUBSTRING(`data_timestamp`,1,18) ORDER BY `data_timestamp`";
        }
        else{
            $sql = "SELECT
                -- SUBSTRING(`data_timestamp`,1,18), SUBSTRING(`data_timestamp`,1,10), SUBSTRING(`data_timestamp`,14,5),
                UNIX_TIMESTAMP(STR_TO_DATE(SUBSTRING(data_timestamp,1,18), '%Y/%m/%d - %H:%i')) AS ts,
                round( AVG(`data_v`), 2) AS v_Avg,
                round( AVG(`data_c`), 2) AS c_Avg,
                round( (AVG(`data_p`)/1000), 2) AS p_Total,
                round( AVG(`data_e`), 2) AS e_data,
                round( AVG(`data_t`), 2) AS t_data
                FROM `tb_data_sensor_mini` WHERE $where_d 
                    AND data_e != 0 
                    AND data_v != 0 
                    GROUP BY SUBSTRING(`data_timestamp`,1,18) ORDER BY `data_timestamp`";
        }
    }
    elseif($_POST['phase'] == 1){ // meter ใหญ่ ทำ 1 เฟส
        $sql = "SELECT
            -- SUBSTRING(`data_timestamp`,1,18), SUBSTRING(`data_timestamp`,1,10), SUBSTRING(`data_timestamp`,14,5),
            UNIX_TIMESTAMP(STR_TO_DATE(SUBSTRING(data_timestamp,1,18), '%Y/%m/%d - %H:%i')) AS ts,
            round( AVG(`data_v_L-N-AVG`), 2) AS v_Avg,
            round( AVG(`data_c_AVG`), 2) AS c_Avg,
            round( AVG(`data_atp-Total`), 2) AS p_Total,
            round( AVG(`data_e`), 2) AS e_data,
            round( AVG(`data_temp`), 2) AS t_data
        FROM `tb_data_sensor` WHERE $where_d 
                    AND data_e != 0 
                    AND `data_v_L-N-AVG` != 0 
                    GROUP BY SUBSTRING(`data_timestamp`,1,18) ORDER BY `data_timestamp`";
    }

    // $sql = "SELECT SELECT `data_timestamp`, AVG(`data_v`) AS v_data, AVG(`data_c`) AS c_data, AVG(`data_p`) AS p_data, AVG(`data_e`) AS e_data, AVG(`data_t`) AS t_data FROM `tb_data_sensor` WHERE `data_sn`='$sn' AND `data_timestamp` BETWEEN '$start_day' AND '$stop_day' AND mod(minute(`data_timestamp`) ORDER BY `data_timestamp` ";

    // echo $sql;exit();
    $stmt = $dbcon->prepare($sql);
    $stmt->execute();
    $data =[];
    while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
        $data[] = $row;
    }
    echo $data ? json_encode($data) : json_encode(null);
