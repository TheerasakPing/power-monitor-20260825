<?php
    require "connectdb.php";

    $user_id = $_POST['user_id'];
    $level = $_POST['level'];
    $selSite = $_POST['selSite'];

    if($level == 1){
        $stmt = $dbcon->prepare("SELECT
            tb_user_st.userST_id,
            tb_user_st.userST_siteID,
            tb_user_st.userST_houseID,
            tb_account.account_img,
            tb_account.account_user,
            tb_account.account_pass,
            tb_account.account_suspend,
            tb_site.site_name,
            tb_house.house_name,
            tb_user_st.userST_level,
            tb_account.account_main,
            (SELECT account_user FROM tb_account WHERE account_id = tb_user_st.userST_main LIMIT 1) AS main_account_user,
            tb_user_st.userST_timestamp,
            tb_account.account_id
        FROM tb_user_st
        INNER JOIN tb_account ON tb_user_st.userST_accountID = tb_account.account_id
        INNER JOIN tb_site ON tb_user_st.userST_siteID = tb_site.site_id
        INNER JOIN tb_house ON tb_user_st.userST_houseID = tb_house.house_id
        WHERE tb_user_st.userST_siteID = :selSite
        ORDER BY tb_account.account_id");
        $stmt->execute([
            ':selSite' => $selSite
        ]);
    }else{
        $stmt = $dbcon->prepare("SELECT
            tb_user_st.userST_id,
            tb_user_st.userST_siteID,
            tb_user_st.userST_houseID,
            tb_account.account_img,
            tb_account.account_user,
            tb_account.account_pass,
            tb_account.account_suspend,
            tb_site.site_name,
            tb_house.house_name,
            tb_user_st.userST_level,
            tb_account.account_main,
            (SELECT account_user FROM tb_account WHERE account_id = tb_user_st.userST_main LIMIT 1) AS main_account_user,
            tb_user_st.userST_timestamp,
            tb_account.account_id
        FROM tb_user_st
        INNER JOIN tb_account ON tb_user_st.userST_accountID = tb_account.account_id
        INNER JOIN tb_site ON tb_user_st.userST_siteID = tb_site.site_id
        INNER JOIN tb_house ON tb_user_st.userST_houseID = tb_house.house_id
        WHERE (tb_account.account_main = :user_id AND tb_user_st.userST_siteID = :selSite)
           OR (tb_user_st.userST_accountID = :user_id AND tb_user_st.userST_siteID = :selSite)
        ORDER BY tb_account.account_id");

        $stmt->execute([
            ':user_id' => $user_id,
            ':selSite' => $selSite
        ]);
    }
    $count = $stmt->rowCount();

    $inc = 1;

    $data = [];
    while($row = $stmt->fetch(PDO::FETCH_BOTH)) {
        $data[] = $row;
    }
    echo $data ? json_encode(array(
            'data' => $data,
            'status' => 'success'
        )) : json_encode(null);
