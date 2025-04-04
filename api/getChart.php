<?php
    require "connectdb.php";
    // echo json_encode($_POST);
    // exit();
    $phase = $_POST['phase'];
    $sn = $_POST["sn"];//'TESTPOWER000'.$meter_numb;
    // SELECT DATE_FORMAT( DATE_SUB(`data_timestamp`, INTERVAL (MINUTE(`data_timestamp`) % 5) MINUTE ), '%Y-%m-%d %H:%i' ) as timestamp, round(MAX(`data_temp_out_2`),2) as temp_max, round(MIN(`data_temp_out_2`),2) as temp_min, round(AVG(`data_temp_out_2`),2) as temp_avg FROM tbn_data_tu WHERE `data_timestamp` BETWEEN '2024-12-01 00:00:00' AND '2024-12-31 23:59:59' GROUP BY FLOOR(MINUTE(`data_timestamp`)/5), DATE_FORMAT(`data_timestamp`, '%Y-%m-%d %H') ORDER BY data_timestamp;

    if ($_POST["status"] == 'realtime') {
        $start = date("Y/m/d - H:i", strtotime('-6 hour'));
        $stop = date("Y/m/d - H:i");
    } // exit realtime
    else if ($_POST["status"] == 'day') {
        $start = date("Y/m/d - H:i", strtotime('-1 day'));
        $stop = date("Y/m/d - H:i");
    } // exit day
    else if ($_POST["status"] == 'week') {
        $start = date("Y/m/d - H:i", strtotime('-7 day'));
        $stop = date("Y/m/d - H:i");
    } // exit week
    else if ($_POST["status"] == 'month') {
        $data_date = $_POST["year"]."/".$_POST["month"];
        $start = $_POST["year"]."/".$_POST["month"]."/01 - 00:00";
        if($_POST["month"] == date("m")){
            $stop = $_POST["year"]."/".$_POST["month"]."/".date("d - H:i");
        }else{
            $stop = date('Y/m/t', strtotime($_POST["year"].'/'.$_POST["month"].'/01')).' - 23:59'; //date('Y/m/d - H:i', strtotime($_POST["year"]."/".$_POST["month"]));
        }
    }

    if($_POST["mode"] == "ENERGY"){
        if($phase == 2){
            $sql = "SELECT
                        UNIX_TIMESTAMP(STR_TO_DATE(SUBSTRING(data_timestamp,1,15), '%Y/%m/%d - %H')) AS  ts,
                        round(MAX(`data_e`) - MIN(`data_e`), 2) AS energy
                    FROM `tb_data_sensor_mini` WHERE `data_sn`= ? AND SUBSTRING(`data_timestamp`,1,10) BETWEEN ? AND ? group by SUBSTRING(`data_timestamp`,1,15) ORDER BY `data_timestamp`"; // hour(SUBSTRING(`data_timestamp`,14,5)), day(SUBSTRING(`data_timestamp`,1,10)) ORDER BY `tb_data_sensor_mini`.`data_timestamp`";
        }else{ // emter big
            $sql = "SELECT
                        -- SUBSTRING(`data_timestamp`,1,15) AS timestamp,
                        UNIX_TIMESTAMP(STR_TO_DATE(SUBSTRING(data_timestamp,1,15), '%Y/%m/%d - %H')) AS  ts,
                        round(MAX(`data_e`) - MIN(`data_e`), 2) AS energy
                    FROM `tb_data_sensor` WHERE `data_sn`= ? AND SUBSTRING(`data_timestamp`,1,18) BETWEEN ? AND ? group by SUBSTRING(`data_timestamp`,1,15) ORDER BY `data_timestamp`";// hour(SUBSTRING(`data_timestamp`,14,5)), day(SUBSTRING(`data_timestamp`,1,10)) ORDER BY `tb_data_sensor`.`data_timestamp`";
        }

        $dateHourStart = substr($start, 0, -2) . "00";  // ได้ "2025/02/18 - 13:00"
        $dateHourStop = substr($stop, 0, -2) . "00";  // ได้ "2025/02/18 - 13:00"
    }
    else { // other

        if ($phase == 3) {
            $sql = "SELECT
                    -- `data_timestamp`,
                    UNIX_TIMESTAMP(STR_TO_DATE(SUBSTRING(data_timestamp,1,18), '%Y/%m/%d - %H:%i')) AS ts,
                    round(AVG(`data_v_A-N`),2) vAN,
                    round(AVG(`data_v_B-N`),2) vBN,
                    round(AVG(`data_v_C-N`),2) vCN,
                    round(AVG(`data_v_L-N-AVG`),2) vAvg,
                    round(AVG(`data_c_A`),2) cA,
                    round(AVG(`data_c_B`),2) cB,
                    round(AVG(`data_c_C`),2) cC,
                    round(AVG(`data_c_AVG`),2) cAvg,
                    round(AVG(`data_atp-A`),2) pA,
                    round(AVG(`data_atp-B`),2) pB,
                    round(AVG(`data_atp-C`),2) pC,
                    round(AVG(`data_atp-Total`),2) pT,
                    round(AVG(`data_temp`),2) t
                FROM `tb_data_sensor` WHERE `data_sn`= ? AND SUBSTRING(`data_timestamp`,1,18) BETWEEN ? AND ? group by SUBSTRING(`data_timestamp`,1,18) ORDER BY `data_timestamp`";
        }
        elseif($phase == 2){
            $sql = "SELECT
    -- `data_timestamp`,
    UNIX_TIMESTAMP(STR_TO_DATE(SUBSTRING(data_timestamp,1,18), '%Y/%m/%d - %H:%i')) AS ts,
    round(AVG(`data_v`),2) AS v,
    round(AVG(`data_c`),2) AS c,
    round((AVG(`data_p`)/1000),2) AS p,
    round(AVG(`data_t`),2) AS t
FROM `tb_data_sensor_mini`
WHERE `data_sn` = ?
    AND SUBSTRING(`data_timestamp`,1,18) BETWEEN ? AND ?
    AND `data_v` != 0
GROUP BY SUBSTRING(`data_timestamp`,1,18)
ORDER BY `data_timestamp`";
        }
        elseif($phase == 1){
            $sql = "SELECT
                    -- `data_timestamp`,
                    UNIX_TIMESTAMP(STR_TO_DATE(SUBSTRING(data_timestamp,1,18), '%Y/%m/%d - %H:%i')) AS ts,
                    round(AVG(`data_v_L-N-AVG`),2) AS v,
                    round(AVG(`data_c_AVG`),2) AS c,
                    round(AVG(`data_atp-Total`),2) AS p,
                    round(AVG(`data_temp`),2) AS t
                FROM `tb_data_sensor` WHERE `data_sn`= ? AND SUBSTRING(`data_timestamp`,1,18) BETWEEN ? AND ? group by SUBSTRING(`data_timestamp`,1,18) ORDER BY `data_timestamp`";
        }
        $dateHourStart = $start;  // ได้ "2025/02/18 - 13:00"
        $dateHourStop =$stop;  // ได้ "2025/02/18 - 13:00"
    }
    $stmt = $dbcon->prepare($sql);
    $stmt->execute([$sn, $start, $stop]);

    $data = [];
    while($row = $stmt->fetch(PDO::FETCH_NUM)) {
        // $row[0] = $row[0];//substr($row[0], 0, -2);
        $data[] = $row;
    }
    $datetimeStart = DateTime::createFromFormat('Y/m/d - H:i', $dateHourStart);
    $timestampStart = $datetimeStart->getTimestamp();

    $datetimeStop = DateTime::createFromFormat('Y/m/d - H:i', $dateHourStop);
    $timestampStop = $datetimeStop->getTimestamp();
    echo $data ? json_encode(array(
            $data,
            $timestampStart,
            $timestampStop,
            $dateHourStart,
            $dateHourStop
        )) : json_encode(null);

    // if($data == null){
    //     echo json_encode("null");
    // }else{
    //     echo json_encode([
    //         'data' => $data,
    //         'start' => $start,
    //         'stop' => $stop,
    //         'mode' => $_POST["mode"]
    //     ]);
    // }

    function calculator_day($date_start){
        $day = 0;
        $date_end =date("Y-m-d", strtotime("+1 month",strtotime($date_start)));
        while($date_start<$date_end){
            $date_start =date("Y-m-d", strtotime("+1 day",strtotime($date_start)));
            $day++;
        }
        return $day;
    }
