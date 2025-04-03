# Power Meter - SmartSoulPCB

## Overview

This project is a web-based power monitoring system called "PowerMeter," developed by SmartSoulPCB. It's designed to track and display real-time and historical power consumption data from various meters and sites. The application provides a user-friendly interface for monitoring voltage, current, power, energy, and temperature.

## Key Features

*   **Dashboard:** Displays real-time data for voltage, current, power, and temperature.
*   **Site Management:** Allows users to monitor multiple sites and their associated meters.
*   **Meter Monitoring:** Provides detailed information for individual meters, including phase-specific data (A, B, C) for 3-phase systems.
*   **Data Visualization:** Uses ECharts to display historical data in interactive charts, including energy, voltage, current, power, and temperature.
*   **Data Reporting:** Offers data reporting features with options for real-time, 24-hour, 7-day, monthly, and yearly views.
*   **User Management:** Enables administrators to manage user accounts, including adding, editing, and deleting users.
*   **Profile Management:** Allows users to manage their profiles, including changing their username, password, and profile picture.
*   **Theme Customization:** Supports both light and dark themes, which can be toggled by the user.
*   **Responsive Design:** Adapts to different screen sizes for optimal viewing on various devices.
*   **Realtime Updates:** The dashboard and data tables update in real-time to reflect the latest sensor readings.
*   **Data Export:** Allows users to export data in CSV format.
*   **Status Indicator:** Shows the online/offline status of each meter.

## Technologies Used

*   **HTML5:** For structuring the web page.
*   **CSS3:** For styling and layout, including custom styles for the application.
*   **JavaScript:** For interactivity, data handling, and real-time updates.
*   **jQuery:** For simplifying DOM manipulation and AJAX requests.
*   **Bootstrap 5:** For responsive design and UI components.
*   **ECharts:** For creating interactive charts.
*   **DataTables:** For displaying data in sortable and searchable tables.
*   **Moment.js:** For date and time formatting.
*   **Feather Icons:** For vector icons.
*   **SweetAlert2:** For user-friendly alerts and confirmations.
*   **Pace.js:** For the loading progress bar.
*   **Simplebar:** For custom scrollbars.
*   **MetisMenu:** For the sidebar menu.
*   **Perfect-scrollbar:** For custom scrollbars.
*   **Customizable-Loading-Modal-Plugin:** For loading modals.
* **Apexcharts:** For chart.
* **PHP:** For server-side logic and database interactions (implied from file paths like `db/session.php`).
* **MySQL:** For database (implied from PHP usage).

## File Structure (Based on index.html)

*   **index.html:** The main HTML file for the application.
*   **assets/**
    *   **css/**
        *   app.css: Main application styles.
        *   bootstrap.min.css: Bootstrap CSS.
        *   icons.css: Icon styles.
        *   dark-theme.css: Dark theme styles.
        *   pace.min.css: Pace.js styles.
    *   **images/**
        *   favicon-32x32.png: Favicon.
        *   logo-icon.png: Logo icon.
        *   status/: Images for voltage, current, power, and temp.
        *   users/: User profile images.
    *   **js/**
        *   app.js: Main application JavaScript.
        *   bootstrap.bundle.min.js: Bootstrap JavaScript.
        *   jquery.min.js: jQuery library.
        *   pace.min.js: Pace.js library.
        *   feather-icons.js: Feather Icons library.
        *   decode.js: (May be custom code for data decoding).
    *   **plugins/**
        *   **simplebar/**
            *   css/simplebar.css: Simplebar styles.
            *   js/simplebar.min.js: Simplebar library.
        *   **perfect-scrollbar/**
            *   css/perfect-scrollbar.css: Perfect-scrollbar styles.
            *   js/perfect-scrollbar.js: Perfect-scrollbar library.
        *   **metismenu/**
            *   css/metisMenu.min.css: MetisMenu styles.
            *   js/metisMenu.min.js: MetisMenu library.
        *   **chartjs/**
            *   js/Chart.min.js: Chart.js library.
        *   **datatable/**
            *   css/dataTables.bootstrap5.min.css: DataTables styles.
            *   js/jquery.dataTables.min.js: DataTables library.
            *   js/dataTables.bootstrap5.min.js: DataTables Bootstrap integration.
        *   **apexcharts/**
            *   apexcharts.js: Apexcharts library.
            *   scripts.js: Apexcharts scripts.
        *   **momentjs/**
            *   moment.min.js: Moment.js library.
        *   **Customizable-Loading-Modal-Plugin/**
            *   css/modal-loading.css: Loading modal styles.
            *   js/modal-loading.js: Loading modal library.
        *   **sweetalert2-7.28.12/**
            *   dist/sweetalert2.all.min.js: SweetAlert2 library.
        *   **echarts.5.4.2/**
            *   echarts.min.js: ECharts library.
*   **db/**: (Implied) Contains PHP files for database interaction and server-side logic.
    *   session.php: Handle user session.
    *   setting_theme.php: Handle theme setting.
    *   getData.php: Get data from database.
    *   getChart.php: Get data for chart.
    *   getTable.php: Get data for table.
    *   getTableUsers.php: Get data for user table.
    *   save_setting.php: Save setting.
    *   option_user.php: Get option for user.

## Setup and Installation (General Guidance)

1.  **Server Environment:** You'll need a web server (e.g., Apache, Nginx) with PHP support and a MySQL database.
2.  **Database:** Set up a MySQL database and configure the connection details in the PHP files within the `db/` directory.
3.  **File Placement:** Place the `index.html` file and the `assets/` and `db/` directories in the web server's document root.
4.  **Dependencies:** Ensure that all the JavaScript and CSS dependencies are correctly placed within the `assets/` directory.
5.  **Database Setup:** Create the necessary tables in the MySQL database to store user data, site information, meter data, etc.
6.  **Access:** Access the application through your web browser by navigating to the server's address where you placed the files.

## Usage

1.  **Login:** Users will need to log in to access the application.
2.  **Navigation:** Use the sidebar menu to navigate between different sections (Site, Meter, Dashboard, Setting).
3.  **Dashboard:** View real-time data on the dashboard.
4.  **Site/Meter:** Select a site or meter to view detailed information.
5.  **Charts:** Interact with the charts to view historical data.
6.  **Reports:** Generate data reports for different timeframes.
7.  **User Management:** Administrators can manage user accounts.
8.  **Profile:** Users can manage their own profiles.
9. **Theme:** User can change theme.

## Future Development

*   Add more chart types and customization options.
*   Implement more advanced data analysis features.
*   Improve the user interface and user experience.
*   Add more security features.
*   Add more setting.

## Version

1.0

## Author

Smart Soul PCB
