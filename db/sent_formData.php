<?php
// $url = "insert_data.php"; // URL to the PHP script that handles the POST request

// $curl = curl_init();
// curl_setopt($curl, CURLOPT_URL, $url);
// curl_setopt($curl, CURLOPT_HTTPHEADER, array('Accept: application/json', 'Content-Type: application/json'));
// curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

// $data = <<<DATA
// {
//   "ID": "SN-12345",
//   "Voltage_AB": 220,
//   "Voltage_BC": 220,
//   "Voltage_CA": 220,
//   "Voltage_LL_Avg": 220,
//   "Voltage_AN": 110,
//   "Voltage_BN": 110,
//   "Voltage_CN": 110,
//   "Voltage_LN_Avg": 110,
//   "Current_A": 5,
//   "Current_B": 5,
//   "Current_C": 5,
//   "Current_N": 0,
//   "Current_G": 0,
//   "Current_Avg": 5,
//   "Active_Power_A": 1000,
//   "Active_Power_B": 1000,
//   "Active_Power_C": 1000,
//   "Active_Power_Total": 3000,
//   "Reactive_Power_A": -500,
//   "Reactive_Power_B": -500,
//   "Reactive_Power_C": -500,
//   "Reactive_Power_Total": -1500,
//   "Apparent_Power_A": 1200,
//   "Apparent_Power_B": 1200,
//   "Apparent_Power_C": 1200,
//   "Power_Factor_Total": 0.8,
//   "Frequency": 50,
//   "Active_Energy_Delivered": "1500",
//   "Temperature": 25,
//   "timestamp": "2025/07/01 - 12:00:00"
// }
// DATA;

// curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

// $resp = curl_exec($curl);
// curl_close($curl);

// echo $resp;

// localhost/powermeter_2025/db/post_insertData.php?ID=PMLRP3F0-001&v_AB=220&v_BC=220&v_CA=220&v_LL=220&v_AN=110&v_BN=110&v_CN=110&v_LN=110&c_A=5&c_B=5&c_C=5&c_N=0&c_G=0&c_Avg=5&ap_A=1000&ap_B=1000&ap_C=1000&ap_Total=3000&rp_A=-500&rp_B=-500&rp_C=-500&rp_Total=-1500&app_A=1200&app_B=1200&app_C=1200&pf=0.8&f=50&e=1500&t=25
// ข้อมูลที่คุณต้องการส่ง (key:value)

    //วันที่
    date_default_timezone_set('Asia/Bangkok');
$data = [
    'timestamp'        => date("Y/m/d - H:i:s"), //$date.' - '.$time,
    'ID'                        => $_GET["ID"],
    "Voltage_AB"                => $_GET["v_AB"],
    "Voltage_BC"                => $_GET["v_BC"],
    "Voltage_CA"                => $_GET["v_CA"],
    "Voltage_LL_Avg"            => $_GET["v_LL"],
    "Voltage_AN"                => $_GET["v_AN"],
    "Voltage_BN"                => $_GET["v_BN"],
    "Voltage_CN"                => $_GET["v_CN"],
    "Voltage_LN_Avg"            => $_GET["v_LN"],
    "Current_A"                 => $_GET["c_A"],
    "Current_B"                 => $_GET["c_B"],
    "Current_C"                 => $_GET["c_C"],
    "Current_N"                 => $_GET["c_N"],
    "Current_G"                 => $_GET["c_G"],
    "Current_Avg"               => $_GET["c_Avg"],
    "Active_Power_A"            => $_GET["ap_A"],
    "Active_Power_B"            => $_GET["ap_B"],
    "Active_Power_C"            => $_GET["ap_C"],
    "Active_Power_Total"        => $_GET["ap_Total"],
    "Reactive_Power_A"          => $_GET["rp_A"],
    "Reactive_Power_B"          => $_GET["rp_B"],
    "Reactive_Power_C"          => $_GET["rp_C"],
    "Reactive_Power_Total"      => $_GET["rp_Total"],
    "Apparent_Power_A"          => $_GET["app_A"],
    "Apparent_Power_B"          => $_GET["app_B"],
    "Apparent_Power_C"          => $_GET["app_C"],
    "Power_Factor_Total"        => $_GET["pf"],
    "Frequency"                 => $_GET["f"],
    "Active_Energy_Delivered"   => $_GET["e"],
    "Temperature"               => $_GET["t"]
];

// 2. แปลง PHP Array ให้เป็น JSON string
$jsonString = json_encode($data);

// ตรวจสอบว่าแปลงสำเร็จหรือไม่
if ($jsonString === false) {
    die('Error: Failed to encode JSON data.');
}

// 3. เตรียมข้อมูลสำหรับ POST request ที่จะส่งไปยัง insert.php
// Key จะต้องเป็น 'insert_data' ตามที่ insert.php คาดหวัง
$postFields = array(
    'insert_data' => $jsonString
);

// echo json_encode($postData); // แสดงผลลัพธ์สำหรับการตรวจสอบ
// exit();

// URL ของไฟล์ insert.php
$targetUrl = 'http://localhost/powermeter/api/insert_data.php'; 
//'http://localhost/your-project/insert.php'; // *เปลี่ยน 'your-project' ด้วยชื่อโฟลเดอร์โปรเจกต์ของคุณ*

$ch = curl_init();

// 5. ตั้งค่า cURL options
curl_setopt($ch, CURLOPT_URL, $targetUrl);             // กำหนด URL ปลายทาง
curl_setopt($ch, CURLOPT_POST, true);                 // ระบุว่าเป็น POST request
// ใช้ http_build_query เพื่อแปลง array $postFields ให้เป็นรูปแบบ URL-encoded string
// นี่คือสิ่งที่ insert.php คาดหวังสำหรับ $_POST['insert_data']
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postFields));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);       // ให้ cURL ส่งคืนผลลัพธ์เป็น string แทนการแสดงออกไปตรงๆ
curl_setopt($ch, CURLOPT_TIMEOUT, 30);                // กำหนด timeout 30 วินาที

// 6. ส่ง request และรับผลลัพธ์
$response = curl_exec($ch);

// 7. ตรวจสอบข้อผิดพลาด (ถ้ามี)
if (curl_errno($ch)) {
    echo 'cURL Error: ' . curl_error($ch);
} else {
    // เนื่องจาก insert.php ของคุณ Return JSON response, เราจะลอง decode มัน
    $responseData = json_decode($response, true);
    if (json_last_error() === JSON_ERROR_NONE) {
        echo 'Response from insert.php (JSON Decoded): <pre>';
        print_r($responseData);
        echo '</pre>';
    } else {
        echo 'Response from insert.php (Raw): ' . $response;
    }
}

// 8. ปิด cURL session
curl_close($ch);
