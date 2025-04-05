# API List

## 1. `api/login.php`
- **Method:** POST
- **Description:** User login authentication.
- **Parameters:**
  - `name` (string): Username
  - `pass` (string): Password
  - `status` (string, optional): Additional status flag

---

## 2. `api/getChart.php`
- **Method:** POST
- **Description:** Retrieve chart data filtered by time range, phase, and mode.
- **Parameters:**
  - `phase` (int): Phase number (1, 2, or 3)
  - `sn` (string): Serial number of the device
  - `status` (string): Data range type (`realtime`, `day`, `week`, `month`)
  - `year` (string): Year (used when status is 'month')
  - `month` (string): Month (used when status is 'month')
  - `mode` (string): Data mode, e.g., `ENERGY`

---

## 3. `api/getTable.php`
- **Method:** POST
- **Description:** Retrieve table data filtered by time range and phase.
- **Parameters:**
  - `sn` (string): Serial number of the device
  - `status` (string): Data range type (`realtime`, `day`, `week`, `month`)
  - `year` (string): Year (used when status is 'month')
  - `month` (string): Month (used when status is 'month')
  - `phase` (int): Phase number (1, 2, or 3)

---

## 4. `api/getData.php`
- **Method:** POST
- **Description:** Fetch or process data based on provided JSON value.
- **Parameters:**
  - `val` (JSON string): Data payload

---

## 5. `api/setting_theme.php`
- **Method:** POST
- **Description:** Update or set theme preferences for an account.
- **Parameters:**
  - `theme` (string): Theme setting
  - `acc_id` (string): Account ID

---

## 6. `api/connectdb.php`
- **Method:** (Not applicable)
- **Description:** Database connection script, not an API endpoint.