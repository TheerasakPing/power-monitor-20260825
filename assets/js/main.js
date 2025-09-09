// async function getSession() {
//   try {
//     const newData = await $.ajax({
//       type: "GET",
//       url: "203.150.107.116/powermeter/test_cloudflare/db/session.php",
//       dataType: "json",
//     });
//     return await newData;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

let partURL = "api/"; //"https://api.smartsoul-pcb.com/powermeter/";

function toggleTheme(val) {
  // alert(val)
  if (val === true) {
    $("html").addClass("dark-theme");
    theme = "dark-theme";
  } else {
    $("html").removeClass("dark-theme").addClass("light-theme"); //attr("class", "color-sidebar sidebarcolor2 color-header headercolor2")
    theme = "light-theme";
  }
  let parse = JSON.parse(sessionStorage.getItem("sessionLog"));
  parse.theme = theme;
  sessionStorage.setItem("sessionLog", JSON.stringify(parse));
  $.ajax({
    url: partURL+"setting_theme.php", // "https://powermeter.smartsoul-pcb.com/db/setting_theme.php",
    method: "post",
    data: {
      theme: theme,
      acc_id: account.id,
    },
    // dataType: "json",
    success: function (res) {
      // console.log(res);
      // if (res === 'light-theme') {
      //     $('.mm-active').css({
      //         'background': '#E6E6FA',
      //         'color': '#000000'
      //     });
      // }
    },
  });
  // console.log(dataLog);
  if (dataLog.length > 0) {
    // หลังจากเปลี่ยนธีมแล้ว รีเฟรชกราฟเพื่อใช้สีข้อความใหม่
    if (typeof updateMainChart === "function") {
      updateMainChart(dataLog);
    }
  }
}
function logout() {
  sessionStorage.removeItem("sessionLog");
  mainPage(null)
  // window.location.reload()
  // $.ajax({
  //   url: "203.150.107.116/powermeter/test_cloudflare/db/session.php",
  //   type: "POST",
  //   dataType: "json",
  //   data: {
  //     logout: "logout",
  //     // siteID: msg.sn['siteID']
  //   },
  //   success: function (ress) {
  //     if (ress === "logout_succress") {
  //       window.location = "page_login.html";
  //     }
  //   },
  // });
}
function countPhaseWithJquery(data, name, number) {
  return $(data).filter(function () {
    return this[name] === number;
  }).length;
}

async function getHouse(data, loadData) {
  await $("#load_pages").html("");
  await $("#load_pages").empty();
  // console.log("getHouse");
  // console.log(data);

  const rowDiv = $("<div>", {
    class: "row",
  });
  const dataLength = data.length;
  const phase3Length = countPhaseWithJquery(data, "house_phase", 3);
  
  // alert(phase3Length)
  $.each(data, function (index, key) {
    // console.log(key);
    const cardHtmlBig3 = `
                    <div class="col-12 col-lg-3 col-md-3">
                        <a href="javaScript:;" class="selectHouse" data-loop-id="${index}">
                            <div class="card radius-10 border-3 border-info card-equal-height mt-2 mb-2">
                                <div class="card-body d-flex flex-column">
                                    <div class="col-12"><br>
                                        <div class="row">
                                            <div class="col-4 text-center">
                                                <h3 class="mb-1"><b>${
                                                  key.house_name
                                                }</b></h3>
                                            </div>
                                            <div class="col-4 text-center">
                                                ${
                                                  key.house_temp > 0
                                                    ? `<h5 class="mb-1"> <i class="text-primary" data-feather="thermometer"></i> <b class="t_` +
                                                      key.house_id +
                                                      `"></b> °C</h5>`
                                                    : ""
                                                }
                                            </div>
                                            <div class="col-4 text-center">
                                                <b class="status_${
                                                  key.house_id
                                                }" style="font-size:18px;"></b>
                                            </div>
                                        </div>
                                    </div><br>
                                    <table class="display" style="width:100%">
                                        <thead>
                                            <tr class="mt-5">
                                                <td class="text-center"> </td>
                                                <td class="text-center">
                                                    <h6><b>Phase A</b></h6
                                                </td>
                                                <td class="text-center">
                                                    <h6><b>Phase B</b></h6>
                                                </td>
                                                <td class="text-center">
                                                    <h6><b>Phase C</b></h6>
                                                </td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${(() => {
                                              const data = [
                                                {
                                                  title: "VOLTAGE",
                                                  img: "voltage.png",
                                                  unit: "V",
                                                  prefix: "v_",
                                                  phases: ["AN", "BN", "CN"],
                                                },
                                                {
                                                  title: "CURRENT",
                                                  img: "current.png",
                                                  unit: "A",
                                                  prefix: "c_",
                                                  phases: ["A", "B", "C"],
                                                },
                                                {
                                                  title: "POWER",
                                                  img: "power.png",
                                                  unit: "KW",
                                                  prefix: "atp_",
                                                  phases: ["A", "B", "C"],
                                                },
                                              ];

                                              return data.map(item => `
                                                <tr class="mt-5">
                                                  <td class="text-center">
                                                    <h6><b>${item.title}</b></h6>
                                                    <img src="assets/images/status/${item.img}" style="width:30%" alt="">
                                                    <br><br>
                                                  </td>
                                                  ${item.phases.map(phase => `
                                                    <td class="text-center">
                                                      <h6><b class="${item.prefix}${phase}_${key.house_id}"></b> ${item.unit}</h6>
                                                    </td>
                                                  `).join('')}
                                                </tr>
                                              `).join('');
                                            })()};
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
    const cardHtmlBig1 = `
                    <div class="col-12 col-lg-3 col-md-3">
                        <a href="javaScript:;" class="selectHouse" data-loop-id="${index}">
                            <div class="card radius-10 border-3 border-info card-equal-height mt-2 mb-2">
                                <div class="card-body d-flex flex-column">
                                    <div class="col-12"><br>
                                        <div class="row">
                                            <div class="col-6 text-center">
                                                <h4 class="mb-1"><b>${
                                                  key.house_name
                                                }</b></h4>
                                            </div>
                                            <div class="col-6 text-center">
                                                <b class="status_${key.house_id}" style="font-size:15px;"></b>
                                                ${
                                                  key.house_temp > 0
                                                    ? `<h6 class="mb-1"> <i class="text-primary" data-feather="thermometer"></i> <b class="t_` +
                                                      key.house_id +
                                                      `"></b> °C</h6>`
                                                    : ""
                                                }
                                            </div>
                                        </div>
                                    </div><br>
                                    <table class="display" style="width:100%">
                                        <thead>
                                            ${(() => {
                                              let result = "",
                                                imgs = "",
                                                ph = "",
                                                unit = "";
                                              for (let i = 1; i < 4; i++) {
                                                if (i == 1) {
                                                  ph = "v_LN_" + key.house_id;
                                                  unit = "V";
                                                  imgs = `<h6><b>VOLTAGE</b></h6>
                                                        <img src="assets/images/status/voltage.png" style="width:50%" alt="">`;
                                                } else if (i == 2) {
                                                  ph = "c_AVG_" + key.house_id;
                                                  unit = "A";
                                                  imgs = `<h6><b>CURRENT</b></h6>
                                                        <img src="assets/images/status/current.png" style="width:50%" alt="">`;
                                                } else if (i == 3) {
                                                  ph =
                                                    "atp_Total_" + key.house_id;
                                                  unit = "Kw";
                                                  imgs = `<h6><b>POWER</b></h6>
                                                        <img src="assets/images/status/power.png" style="width:50%" alt="">`;
                                                }
                                                result += `
                                                    <tr class="mt-5">
                                                        <td class="text-center" width="50%">
                                                            ${imgs}<br><br>
                                                        </td>
                                                        <td class="text-center" width="50%">
                                                            <h6><b class="${ph}"></b> A</h6>
                                                        </td>
                                                    </tr>`;
                                              }
                                              return result;
                                            })()}
                                        </thead>
                                    </table>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
    const cardHtmlsmall = `
                    <div class="col-12 col-lg-4 col-md-4">
                        <a href="javaScript:;" class="selectHouse" data-loop-id="${index}">
                            <div class="card radius-10 border-3 border-info card-equal-height mt-2 mb-2">
                                <div class="card-body d-flex flex-column">
                                    <div class="row">
                                        <div class="col-12"><br>
                                            <div class="row">
                                                <div class="col-4 text-center">
                                                    <h5 class="mb-1"><b>${
                                                      key.house_name
                                                    }</b></h5>
                                                </div>
                                                <div class="col-4 text-center">
                                                    ${
                                                      key.house_temp > 0
                                                        ? '<h5 class="mb-1"> <i class="text-primary" data-feather="thermometer"></i> <b class="t_' +
                                                          key.house_id +
                                                          '"></b></h5>'
                                                        : ""
                                                    }
                                                </div>
                                                <div class="col-4 text-center">
                                                    <b class="status_${
                                                      key.house_id
                                                    }" style="font-size:20px;"></b>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12"><br>
                                            <div class="row">
                                                <div class="col-4 text-center">
                                                    <h5 class="mb-1"><b>VOLTAGE</b></h5>
                                                    <img src="assets/images/status/voltage.png" style="width:80%" alt="">
                                                    <br>
                                                    <b class="mb-1 v_LN_${key.house_id}" style="font-size:25px; color:#f25a02"></b>
                                                    <b class="mb-0 text-secondary font-20">V</b>
                                                </div>
                                                <div class="col-4 text-center">
                                                    <h5 class="mb-1"><b>CURRENT</b></h5>
                                                    <img src="assets/images/status/current.png" style="width:80%" alt="">
                                                    <br>
                                                    <b class="mb-1 c_AVG_${key.house_id}" style="font-size:25px; color:#f25a02"></b>
                                                    <b class="mb-0 text-secondary font-20">A</b>
                                                </div>
                                                <div class="col-4 text-center">
                                                    <h5 class="mb-1"><b>POWER</b></h5>
                                                    <img src="assets/images/status/power.png" style="width:80%" alt="">
                                                    <br>
                                                    <b class="mb-1 atp_Total_${key.house_id}" style="font-size:25px; color:#f25a02"></b>
                                                    <b class="mb-0 text-secondary font-20">KW</b>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
    if (phase3Length === 0) {
      rowDiv.append(cardHtmlsmall);
    } else {//console.log(key.house_phase);
    
      if (index === 0) {
        if (key.house_phase === 3) {
          rowDiv.append(cardHtmlBig3);
        } else {
          rowDiv.append(cardHtmlsmall);
        }
      }
      if (dataLength === 2) {
        if (index > 0) {
          if (key.house_phase === 3) {
            rowDiv.append(cardHtmlBig3);
          } else {
            rowDiv.append(cardHtmlsmall);
          }
        }
      } else if (dataLength === 3) {
        if (index > 0) {
          if (key.house_phase === 3) {
            rowDiv.append(cardHtmlBig3);
          } else {
            rowDiv.append(cardHtmlBig1);
          }
        }
      } else if (dataLength > 3) {
        if (index > 0) {
          if (key.house_phase === 3) {
            rowDiv.append(cardHtmlBig3);
          } else {
            rowDiv.append(cardHtmlBig1);
          }
        }
      }
    }
    // rowDiv.append(cardHtml);
    $("#load_pages").append(rowDiv);
  });
  //  console.log(loadData);
}

async function getSite(data, select) {
  await $("#load_pages").html("");
  await $("#load_pages").empty();
  let logSite = groupBySite(data);
  // console.log(logSite);

  const rowDiv = $("<div>", {
    class: "row",
  });
  $.each(logSite, function (index, site) {
    const cardHtml = `
                    <div class="col-12 col-lg-3 col-md-3">
                        <a href="javaScript:;" class="selectSite" data-loop-id="${index}">
                            <div class="card radius-10 border-3 border-info card-equal-height mt-2">
                                <div class="card-body d-flex flex-column">
                                    <div class="col-12"><br>
                                        <h3 class="mb-1 text-center"><b>${site.site_name}</b></h3>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
    rowDiv.append(cardHtml);
    $("#load_pages").append(rowDiv);
  });
}

function statusMenu(display, mode, lengthSite) {
  const select = display.select;
  const countMeter = [];
  // console.log(lengthSite);

  if (mode === "") {
    if (display.countSite == 1){
      // site = 1 House > 1
      if (display.countHouse > 1) {
        $(".memu_site").hide();
        $(".title_memu1").html("Meter");
        if (select.houseID === "") {
          $(".memu_meter").show().addClass("mm-active");
          $(".memu_dash").hide();
        } else {
          $(".memu_meter").show().removeClass("mm-active");
          $(".memu_dash").show().addClass("mm-active");
          $(".title_memu2").html(select.houseName);
        }
      }
      else  {
        // site = 1 House = 1
        $(".memu_site").hide();
        $(".memu_meter").hide();
        $(".memu_dash").show().addClass("mm-active");
        $(".title_memu2").html("Dashboard");
      }
    }
    // site > 1
    else {
      if (select.siteID === "" && select.houseID === "") {
        $(".memu_site").show().addClass("mm-active");
        $(".memu_meter").hide();
        $(".memu_dash").hide();
      } else if (select.siteID !== "" && select.houseID === "") {
        $(".memu_site").show().removeClass("mm-active");
        $(".memu_meter").show().addClass("mm-active");
        $(".title_memu1").html(select.siteName);
        $(".memu_dash").hide();
      } else {
        // alert(lengthSite)
        if (lengthSite < 2) {
          $(".memu_site").removeClass("mm-active");
          $(".memu_meter").hide();
          $(".memu_dash").show().addClass("mm-active");
          $(".title_memu2").html(select.siteName);
        } else {
          if (select.houseName === "") {
            $(".memu_meter").hide();
            $(".memu_dash").show().addClass("mm-active");
            $(".title_memu2").html(select.siteName);
          } else {
            $(".memu_site").removeClass("mm-active");
            $(".memu_meter").removeClass("mm-active");
            $(".title_memu1").html(select.siteName);
            $(".memu_dash").show().addClass("mm-active");
            $(".title_memu2").html(select.houseName);
          }
        }
      }
    }
  }

  // select
  else {
    $(".memu_dashsetting").hide();
    if (mode === "memu_site") {
      if (select.houseID !== "" && select.houseName == "") {
        $(".memu_meter").hide();
      } else {
        $(".memu_meter").removeClass("mm-active");
      }
      $(".memu_dash").removeClass("mm-active");
      $(".bar_name").hide();
    }
    if (mode === "selectSite") {
      $(".memu_site").removeClass("mm-active");
      if (lengthSite === 1) {
        $(".memu_meter").hide();
        $(".memu_dash").show().addClass("mm-active");
        $(".title_memu2").html(select.siteName);
      } else {
        $(".memu_meter").show().addClass("mm-active");
        $(".title_memu1").html(select.siteName);
        if (select.houseName !== "") {
          $(".memu_dash").removeClass("mm-active");
          $(".title_memu2").html(select.houseName);
        } else {
          $(".memu_dash").hide();
        }
      }
      $(".bar_name").hide();
    }
    if (mode === "memu_meter") {
      $(".memu_site").removeClass("mm-active");
      $(".memu_dash").removeClass("mm-active");
      $(".bar_name").hide();
    }
    if (mode === "memu_dash") {
      $(".memu_site").removeClass("mm-active");
      if (select.selH1 === 1) {
        $(".memu_meter").hide();
      } else {
        $(".memu_meter").removeClass("mm-active");
      }
    }
    if (mode === "menu_profile1") {
      $(".memu_site").removeClass("mm-active");
      $(".memu_meter").removeClass("mm-active");
      $(".memu_dash").removeClass("mm-active");
      $(".memu_dashsetting").show().addClass("mm-active");
      $(".bar_name ").hide();
    }
  }
}

async function dashboard(select) {
  await $("#load_pages").html("");
  await $("#load_pages").empty();

  const rowDiv = $("<div>", {
    class: "row",
  });
  // $.each(logSite, function(index, site) {
  // alert(select.phase)
  // return false
  // console.log(select);
  // let index = select.loopHouse
  // console.log(select.temp +' === 1')
  
  const cardHtml = `
                <div class="col-12 ${
                  select.temp > 0
                    ? "col-lg-3 col-md-3"
                    : "col-lg-4 col-md-4"
                }">
                    <div class="card radius-10 border-3 border-info card-equal-height">
                        <div class="card-body d-flex flex-column">
                            <div class="row">
                                <div class="col-12 text-center">
                                    <h5 class="mb-1"><b>VOLTAGE</b></h5>
                                    <img src="assets/images/status/voltage.png" class="card-image-50" alt="Voltage Icon">
                                </div>
                                ${
                                  select.phase !== 3
                                    ? `
                                    <div class="col-12 text-center">
                                        <b class="v_LN_${select.houseID} d-block" style="font-size: 40px; color: #f25a02"></b>
                                        <b class="text-secondary font-20">V</b>
                                    </div>
                                `
                                    : `
                                    <div class="d-flex2">
                                        ${(() => {
                                          let result = "",
                                            phase = "",
                                            ph = "";
                                          for (let i = 1; i < 5; i++) {
                                            if (i === 1) {
                                              phase = "Phase A";
                                              ph = "A";
                                            } else if (i === 2) {
                                              phase = "Phase B";
                                              ph = "B";
                                            } else if (i === 3) {
                                              phase = "Phase C";
                                              ph = "C";
                                            } else {
                                              phase = "Average";
                                              ph = "L";
                                            }
                                            result += `
                                                    <div class="d-flex">
                                                        <div class="flex-grow-1">
                                                            <b class="text-secondary" style="font-size: 25px;">${phase}</b>
                                                        </div>
                                                        <div class="avatar-sm">
                                                            <b class="v_${ph}N_${select.houseID}" style="font-size: 30px; color: #f25a02"></b>
                                                            <b class="text-secondary font-30"> V</b>
                                                        </div>
                                                    </div>
                                                `;
                                          }
                                          return result;
                                        })()}
                                    </div>
                                `
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 ${
                  select.temp > 0 ? "col-lg-3 col-md-3" : "col-lg-4 col-md-4"
                }">
                    <div class="card radius-10 border-3 border-info card-equal-height">
                        <div class="card-body d-flex flex-column">
                            <div class="row">
                                <div class="col-12 text-center">
                                    <h5 class="mb-1"><b>CURRENT</b></h5>
                                    <img src="assets/images/status/current.png" class="card-image-50" alt="Current Icon">
                                </div>
                                ${
                                  select.phase !== 3
                                    ? `
                                    <div class="col-12 text-center">
                                        <b class="c_AVG_${select.houseID} d-block" style="font-size: 40px; color: #f25a02"></b>
                                        <b class="text-secondary font-20">A</b>
                                    </div>
                                `
                                    : `
                                    <div class="d-flex2">
                                        ${(() => {
                                          let result = "",
                                            phase = "",
                                            ph = "";
                                          for (let i = 1; i < 5; i++) {
                                            if (i === 1) {
                                              phase = "Phase A";
                                              ph = "A";
                                            } else if (i === 2) {
                                              phase = "Phase B";
                                              ph = "B";
                                            } else if (i === 3) {
                                              phase = "Phase C";
                                              ph = "C";
                                            } else {
                                              phase = "Average";
                                              ph = "AVG";
                                            }
                                            result += `
                                                    <div class="d-flex">
                                                        <div class="flex-grow-1">
                                                            <b class="text-secondary" style="font-size: 25px;">${phase}</b>
                                                        </div>
                                                        <div class="avatar-sm">
                                                            <b class="c_${ph}_${select.houseID}" style="font-size: 30px; color: #f25a02"></b>
                                                            <b class="text-secondary font-30"> A</b>
                                                        </div>
                                                    </div>
                                                `;
                                          }
                                          return result;
                                        })()}
                                    </div>
                                `
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 ${
                  select.temp > 0 ? "col-lg-3 col-md-3" : "col-lg-4 col-md-4"
                }">
                    <div class="card radius-10 border-3 border-info card-equal-height">
                        <div class="card-body d-flex flex-column">
                            <div class="row">
                                <div class="col-12 text-center">
                                    <h5 class="mb-1"><b>POWER</b></h5>
                                    <img src="assets/images/status/power.png" class="card-image-50" alt="Power Icon">
                                </div>
                                ${
                                  select.phase != 3
                                    ? `
                                    <div class="col-12 text-center">
                                        <b class="atp_Total_${select.houseID} d-block" style="font-size: 40px; color: #f25a02"></b>
                                        <b class="text-secondary font-20 atp_unit">KW</b>
                                    </div>
                                `
                                    : `
                                    <div class="d-flex2">
                                        ${(() => {
                                          let result = "",
                                            phase = "",
                                            ph = "";
                                          for (let i = 1; i < 5; i++) {
                                            if (i === 1) {
                                              phase = "Phase A";
                                              ph = "A";
                                            } else if (i === 2) {
                                              phase = "Phase B";
                                              ph = "B";
                                            } else if (i === 3) {
                                              phase = "Phase C";
                                              ph = "C";
                                            } else {
                                              phase = "Total";
                                              ph = "Total";
                                            }
                                            result += `
                                                    <div class="d-flex">
                                                        <div class="flex-grow-1">
                                                            <b class="text-secondary" style="font-size: 25px;">${phase}</b>
                                                        </div>
                                                        <div class="avatar-sm">
                                                            <b class="atp_${ph}_${select.houseID}" style="font-size: 30px; color: #f25a02"></b>
                                                            <b class="text-secondary font-30"> KW</b>
                                                        </div>
                                                    </div>
                                                `;
                                          }
                                          return result;
                                        })()}
                                    </div>
                                `
                                }
                            </div>
                        </div>
                    </div>
                </div>
                ${
                  select.temp > 0
                    ? `
                    <div class="col-12 col-lg-3 col-md-3">
                        <div class="card radius-10 border-3 border-info card-equal-height">
                            <div class="card-body d-flex flex-column">
                                <div class="row text-center">
                                    ${
                                      select.phase !== 3
                                        ? `
                                        <div class="col-12">
                                            <h5 class="mb-1"><b>TEMPERATURE</b></h5>
                                            <img src="assets/images/status/temp.png" class="card-image-50" alt="Temperature Icon">
                                            <b class="t_${select.houseID} d-block" style="font-size: 40px; color: #f25a02"></b>
                                            <b class="text-secondary font-20">°C</b>
                                        </div>
                                        `
                                        : `
                                        <div class="d-flex2">
                                            <h5 class="mb-1"><b>TEMPERATURE</b></h5>
                                            <br><br>
                                            <img src="assets/images/status/temp.png" class="card-image-50" alt="Temperature Icon">
                                            <b class="t_${select.houseID} d-block" style="font-size: 40px; color: #f25a02"></b>
                                            <b class="text-secondary font-30">°C</b>
                                        </div>
                                    `
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                `
                    : ``
                }
                    <div class="col-12">
                        <div class="card radius-10 border-3 border-info">
                            <div class="card-body">
                                <div class="d-sm-flex">
                                    <div class="col-lg-6 col-xl-6 col-sm-12 mb-2 ">
                                        <ul class="nav nav-pills mode_sn" role="tablist">
                                            <li class="nav-item" role="presentation">
                                                <a class="nav-link active btn-custom" data-type="ENERGY" href="javascript:;" style="border: 1px solid transparent; border-color: #6c757d;">
                                                    ENERGY
                                                </a>
                                            </li>
                                            <li class="nav-item" role="presentation">
                                                <a class="nav-link btn-custom" data-type="VOLTAGE" href="javascript:;" style="border: 1px solid transparent; border-color: #6c757d;">
                                                VOLTAGE
                                                </a>
                                            </li>
                                            <li class="nav-item" role="presentation">
                                                <a class="nav-link btn-custom" data-type="CURRENT" href="javascript:;" style="border: 1px solid transparent; border-color: #6c757d;">
                                                CURRENT
                                                </a>
                                            </li>
                                            <li class="nav-item" role="presentation">
                                                <a class="nav-link btn-custom" data-type="POWER" href="javascript:;" style="border: 1px solid transparent; border-color: #6c757d;">
                                                POWER
                                                </a>
                                            </li>
                                            <li class="nav-item" role="presentation">
                                                <a class="nav-link btn-custom" data-type="TEMPERATURE" href="javascript:;" style="border: 1px solid transparent; border-color: #6c757d;">
                                                    TEMPERATURE
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <input type="hidden" class="ch_mode" value="energy">
                                    <div class="ms-auto ">
                                        <ul class="nav nav-pills" role="tablist">
                                            <li class="nav-item" role="presentation">
                                                <a class="nav-link btn-custom" data-time="realtime" href="javascript:;" style="display:none; border: 1px solid transparent; border-color: #6c757d;">
                                                    Realtime
                                                </a>
                                            </li>
                                            <li class="nav-item" role="presentation">
                                                <a class="nav-link active btn-custom" data-time="day" href="javascript:;" style="border: 1px solid transparent; border-color: #6c757d;">
                                                    24 Hour
                                                </a>
                                            </li>
                                            <li class="nav-item" role="presentation">
                                                <a class="nav-link btn-custom" data-time="week" href="javascript:;" style="border: 1px solid transparent; border-color: #6c757d;">
                                                7 Day
                                                </a>
                                            </li>
                                            <li class="nav-item" role="presentation">
                                                <select class="nav-link btn btn-custom2" data-time="month" style="border: 1px solid transparent; border-color: #6c757d;">
                                                    ${(() => {
                                                      const monthNames = [
                                                        "Month",
                                                        "January",
                                                        "February",
                                                        "March",
                                                        "April",
                                                        "May",
                                                        "June",
                                                        "July",
                                                        "August",
                                                        "September",
                                                        "October",
                                                        "November",
                                                        "December",
                                                      ];
                                                      let result = "";
                                                      monthNames.forEach(
                                                        (name, index) => {
                                                          const value =
                                                            index === 0
                                                              ? ""
                                                              : index
                                                                  .toString()
                                                                  .padStart(
                                                                    2,
                                                                    "0"
                                                                  );
                                                          const text =
                                                            index === 0
                                                              ? name
                                                              : `${index} ${name}`;
                                                          result += `<option class="text-dark text-left" value="${value}">${text}</option>`;
                                                        }
                                                      );
                                                      return result;
                                                    })()}
                                                </select>
                                            </li>
                                            <li class="nav-item" role="presentation">
                                                <select class="nav-link btn btn-custom2" data-time="year" style="border: 1px solid transparent; border-color: #6c757d;">
                                                    ${(() => {
                                                      const currentYear =
                                                        new Date().getFullYear();
                                                      const startYear = 2024;
                                                      let result = "";
                                                      for (
                                                        let year = currentYear;
                                                        year >= startYear;
                                                        year--
                                                      ) {
                                                        result += `<option class="text-dark text-left" value="${year}">${year}</option>`;
                                                      }
                                                      return result;
                                                    })()}
                                                </select>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="card">
                                    <div class="card-body">
                                        <div id="chart" style="width:100%; height:400px;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="card radius-10 border-3 border-info">
                            <div class="card-body">
                                <div class="d-sm-flex">
                                    <div class="col-lg-6 col-xl-6 col-sm-12 mb-2 ">
                                        <h4><b>DATA REPORT</b></h4>
                                    </div>
                                    <div class="ms-auto ">
                                        <ul class="nav nav-pills mode_sn" role="tablist">
                                            <li class="nav-item" role="presentation">
                                                <a class="nav-link active btn-report" data-time="realtime" href="javascript:;" style="border: 1px solid transparent; border-color: #6c757d;">
                                                    Realtime
                                                </a>
                                            </li>
                                            <li class="nav-item" role="presentation">
                                                <a class="nav-link btn-report" data-time="day" href="javascript:;" style="border: 1px solid transparent; border-color: #6c757d;">
                                                24 Hour
                                                </a>
                                            </li>
                                            <li class="nav-item" role="presentation">
                                                <a class="nav-link btn-report" data-time="week" href="javascript:;" style="border: 1px solid transparent; border-color: #6c757d;">
                                                7 Day
                                                </a>
                                            </li>
                                            <li class="nav-item" role="presentation">
                                                <select class="nav-link btn btn-report2" data-time="month" style="border: 1px solid transparent; border-color: #6c757d;">
                                                    ${(() => {
                                                      const monthNames = [
                                                        "Month",
                                                        "January",
                                                        "February",
                                                        "March",
                                                        "April",
                                                        "May",
                                                        "June",
                                                        "July",
                                                        "August",
                                                        "September",
                                                        "October",
                                                        "November",
                                                        "December",
                                                      ];
                                                      let result = "";
                                                      monthNames.forEach(
                                                        (name, index) => {
                                                          const value =
                                                            index === 0
                                                              ? ""
                                                              : index
                                                                  .toString()
                                                                  .padStart(
                                                                    2,
                                                                    "0"
                                                                  );
                                                          const text =
                                                            index === 0
                                                              ? name
                                                              : `${index} ${name}`;
                                                          result += `<option class="text-dark text-left" value="${value}">${text}</option>`;
                                                        }
                                                      );
                                                      return result;
                                                    })()}
                                                </select>
                                            </li>
                                            <li class="nav-item" role="presentation">
                                                <select class="nav-link btn btn-report2" data-time="year" style="border: 1px solid transparent; border-color: #6c757d;">
                                                    ${(() => {
                                                      const currentYear =
                                                        new Date().getFullYear();
                                                      const startYear = 2024;
                                                      let result = "";
                                                      for (
                                                        let year = currentYear;
                                                        year >= startYear;
                                                        year--
                                                      ) {
                                                        result += `<option class="text-dark text-left" value="${year}">${year}</option>`;
                                                      }
                                                      return result;
                                                    })()}
                                                </select>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="card">
                                    <div class="card-body">
                                        <div class="table-responsive m-t-10">
                                            <table id="table_1" class="table table-striped table-bordered dataTable" style="width:100%">
                                                <thead>
                                                    <tr>
                                                        <th class="text-center">Time Stamp</th>
                                                        <th class="text-center">Date</th>
                                                        <th class="text-center">Time</th>
                                                        <th class="text-center">Voltage (V)</th>
                                                        <th class="text-center">Current (A)</th>
                                                        <th class="text-center">Power (KW)</th>
                                                        <th class="text-center">Energy (KWh)</th>
                                                        <th class="text-center th_temp">Temp (°C)</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                            <table id="table_2" class="table table-striped table-bordered dataTable" style="width:100%">
                                                <thead>
                                                    <tr>
                                                        <th class="text-center">Time Stamp</th>
                                                        <th class="text-center">Date</th>
                                                        <th class="text-center">Time</th>
                                                        <th class="text-center">Voltage A-N (V)</th>
                                                        <th class="text-center">Voltage B-N (V)</th>
                                                        <th class="text-center">Voltage C-N (V)</th>
                                                        <th class="text-center">Voltage Avg (V)</th>
                                                        <th class="text-center">Current A (A)</th>
                                                        <th class="text-center">Current B (A)</th>
                                                        <th class="text-center">Current C (A)</th>
                                                        <th class="text-center">Current Avg (A)</th>
                                                        <th class="text-center">Power A (KW)</th>
                                                        <th class="text-center">Power B (KW)</th>
                                                        <th class="text-center">Power C (KW)</th>
                                                        <th class="text-center">Power Total (KW)</th>
                                                        <th class="text-center">Energy_Delivered (KWh)</th>
                                                        <th class="text-center th_temp">Temp (°C)</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

  rowDiv.append(cardHtml);
  await $("#load_pages").append(rowDiv);
}

// Function to group data by site
function groupBySite(data) {
  const groupedData = {};

  // Group data by site_id
  $.each(data, function (index, item) {
    const siteId = item.site_id;
    if (!groupedData[siteId]) {
      groupedData[siteId] = {
        site_id: item.site_id,
        site_name: item.site_name,
        houses: [],
      };
    }
    groupedData[siteId].houses.push(item);
  });

  // Convert to array
  return Object.values(groupedData);
}
// -------------------------
async function mainPage(msg){
  // console.log(msg);
  
  if (msg === null) {
    $("body").addClass("bg-login");
    $("#page-login").show();
    $("#page-index").hide();
    $("html").attr("class", 'light-theme');
    $(".l_err").hide();
    return false;
  }
  else {
    $("body").removeClass("bg-login");
    $("#page-login").hide();
    $("#page-index").show();

    // let msg = await getSession();
    // msg = JSON.parse(sessionStorage.getItem("sessionLog"));
    theme = msg.theme;

    // theme & Loading ----------------------
    if (theme === "dark-theme") {
      $("#toggleTheme").attr("checked", true);
    } else {
      $("#toggleTheme").attr("checked", false);
    }
    $("html").attr("class", theme);

    
    account = msg.account;
    display = msg.display;
    logSite = display.logSite;
    select = display.select;
    // console.log(select);
    
    // loadingOut(loading);
    if (account.level < 3) {
      $(".menu_setting").show();
    } else {
      $(".menu_setting").hide();
    }
    $(".memu_dashsetting").hide();

    $(".user-img").attr("src", "assets/images/users/" + account.img);
    $(".user_name").html(account.user);
    $(".INuser_name").val(account.user);
    // console.log(msg.pages);
    statusMenu(display, "");
    if (select.siteID === "") {
      getSite(logSite, display.select);
      // return false
    } 
    else {
      const groupSite = groupBySite(logSite);
      // console.log(logSite);
      // console.log(groupSite);
      // console.log(select);
      
      
      $.each(groupSite[select.loop].houses, function (index, key) {
        loadDataHouse.push({
          siteID: key.site_id,
          houseID: key.house_id,
          sn: key.house_sn,
          phase: key.house_phase,
        });
      });
      // console.log(loadDataHouse);
      
      statusMenu(display, "", loadDataHouse.length);
      if (display.select.houseID === "") {
        getHouse(groupSite[display.select.loop].houses, loadDataHouse);
        startRealtime(loadDataHouse, display.select);
        // alert('a')
      } else {
        // return false
        await dashboard(display.select, loadDataHouse);
        // console.log(loadDataHouse);
        await startRealtime(loadDataHouse, display.select);

        const masterData = await getDataChart(select);
        // console.log(masterData);
        await updateMainChart(masterData);
        // await updateChart('ENERGY', 'day', mockData);
        const masterData2 = await getDataTable(select);
        await renderTable(masterData2, "realtime");
      }
    }
  }
}

function updateSensorValues(data, Dashselect) {
  for (var i = 0; i < data.length - 1; i++) {
    // console.log(data[i]);
    // console.log(res[i-1]['v_AN_'.house_id+'_'+i]+" ++ "+(count(res) - 1));
    if (
      data[i].date.substring(0, data[i].date.length - 3) >=
      data[data.length - 1]
    ) {
      $(".v_AN_" + data[i].houseID).html(data[i]["v_AN"]);
      $(".v_BN_" + data[i].houseID).html(data[i]["v_BN"]);
      $(".v_CN_" + data[i].houseID).html(data[i]["v_CN"]);
      $(".v_LN_" + data[i].houseID).html(data[i]["v_LN"]);
      $(".c_A_" + data[i].houseID).html(data[i]["c_A"]);
      $(".c_B_" + data[i].houseID).html(data[i]["c_B"]);
      $(".c_C_" + data[i].houseID).html(data[i]["c_C"]);
      $(".c_AVG_" + data[i].houseID).html(data[i]["c_AVG"]);
      $(".atp_A_" + data[i].houseID).html(data[i]["atp_A"]);
      $(".atp_B_" + data[i].houseID).html(data[i]["atp_B"]);
      $(".atp_C_" + data[i].houseID).html(data[i]["atp_C"]);
      $(".atp_Total_" + data[i].houseID).html(data[i]["atp_Total"]);
      $(".t_" + data[i].houseID).html(data[i]["temp"]);
    } else {
      $(".v_AN_" + data[i].houseID).html(0);
      $(".v_BN_" + data[i].houseID).html(0);
      $(".v_CN_" + data[i].houseID).html(0);
      $(".v_LN_" + data[i].houseID).html(0);
      $(".c_A_" + data[i].houseID).html(0);
      $(".c_B_" + data[i].houseID).html(0);
      $(".c_C_" + data[i].houseID).html(0);
      $(".c_AVG_" + data[i].houseID).html(0);
      $(".atp_A_" + data[i].houseID).html(0);
      $(".atp_B_" + data[i].houseID).html(0);
      $(".atp_C_" + data[i].houseID).html(0);
      $(".atp_Total_" + data[i].houseID).html(0);
      $(".t_" + data[i].houseID).html(0);
      //     $('.das_t_'+ res[i-1].site_id+'_'+res[i-1].house_id).html(0);
    }
    // console.log(data[i]['date']);
    if (data[i]["date"] === "-") {
      $(".status_" + data[i].houseID)
        .addClass("text-warning")
        .html("NOT DEVICE");
    } else {
      if (
        data[i].date.substring(0, data[i].date.length - 3) >=
        data[data.length - 1]
      ) {
        // ONLINE
        if (data[i].siteID === 5) {
          // หอโหวด 1 master หลาย meter
          if (data[i].v_LN > 0) {
            $(".status_" + data[i].houseID)
              .removeClass("text-danger")
              .addClass("text-success")
              .html("ONLINE");
          } else {
            $(".status_" + data[i].houseID)
              .removeClass("text-success")
              .addClass("text-danger")
              .html("OFFLINE");
          }
        } else {
          // site อื่นๆ
          $(".status_" + data[i].houseID)
            .removeClass("text-danger")
            .addClass("text-success")
            .html("ONLINE");
        }
      } else {
        $(".status_" + data[i].houseID)
          .removeClass("text-success")
          .addClass("text-danger")
          .html("OFFLINE");
      }
    }
    // console.log(Dashselect['sn']);
    
    if ($(".memu_dash").hasClass("mm-active") === true) {
      if(Dashselect['sn'] === data[i].sn){
        if (
          data[i].date.substring(0, data[i].date.length - 3) >=
          data[data.length - 1]
        ) {
          // ONLINE
          if (data[i].siteID === 5) {
            // หอโหวด 1 master หลาย meter
            if (data[i].v_LN > 0) {
              $(".bar_name")
                .show()
                .removeClass("text-danger")
                .addClass("text-success")
                .html(
                  moment(data[i].date, "YYYY/MM/DD - HH:mm:ss").format(
                    "HH:mm, DD MMM YYYY"
                  )
                );
            } else {
              $(".bar_name")
                .show()
                .removeClass("text-success")
                .addClass("text-danger")
                .html(
                  moment(data[i].date, "YYYY/MM/DD - HH:mm:ss").format(
                    "HH:mm, DD MMM YYYY"
                  )
                );
            }
          } else {
            $(".bar_name")
              .show()
              .removeClass("text-danger")
              .addClass("text-success")
              .html(
                moment(data[i].date, "YYYY/MM/DD - HH:mm:ss").format(
                  "HH:mm, DD MMM YYYY"
                )
              );
          }
        } else {
          $(".bar_name")
            .show()
            .removeClass("text-success")
            .addClass("text-danger")
            .html(
              moment(data[i].date, "YYYY/MM/DD - HH:mm:ss").format(
                "HH:mm, DD MMM YYYY"
              )
            ); //data[i].date.substring(0,data[i].date.length-3)+' '+moment( new Date( data[i].date.substring(0,data[i].date.length-11) ) ).format('DD MMM YYYY'))
        }
      }
    } else {
      $(".bar_name").hide();
    }
    feather.replace();
  }
}
async function startRealtime(val, Dashselect) {
  try {
    showLoading();
    let newData = await loadData(val, Dashselect);
    // console.log(newData);
    // console.log(Dashselect);
    // setTimeout(() => {
        updateSensorValues(newData, Dashselect);
    //     console.log('22');
    // }, 300);
     
    stopRealtime("loadData");
    realtimeInterLoadData = setInterval(async () => {
      newData = await loadData(val);
      // console.log(newData);
      updateSensorValues(newData, Dashselect);
      addArray(newData);
    }, 60000);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    hideLoading();
  }
}
function stopRealtime(mode) {
  if (mode === "loadData") {
    if (realtimeInterLoadData) {
      clearInterval(realtimeInterLoadData);
      realtimeInterLoadData = null;
    }
  } else if (mode === "loadChart") {
    if (realtimeInterChart) {
      clearInterval(realtimeInterChart);
      realtimeInterChart = null;
    }
  } else if (mode === "loadTable") {
    if (realtimeDataTable) {
      clearInterval(realtimeDataTable);
      realtimeDataTable = null;
    }
  }
}
function loadData(val) {
  try {
    const newData = $.ajax({
      type: "POST",
      url: partURL+"getData.php",
      data: {
        val: val,
      },
      dataType: "json",
    });

    // console.log(newData);
    return newData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
function addArray(newData) {
  // console.log(select.phase);
  // console.log($('.btn-report[data-time="realtime"]').hasClass('active'));
  // console.log(realtimeDataTable.length);
  // Chart
  if (
    $('.btn-custom[data-time="realtime"]').hasClass("active") === true
  ) {
    // console.log(dataLog);
    // console.log(dataLog[0].minuteTimes[dataLog[0].minuteTimes.length-1]);
    if (dataLog[0].minuteTimes.length !== 0) {
      if (
        dataLog[0].timestamps[dataLog[0].timestamps.length - 1] !==
        moment(newData[0].date, "YYYY/MM/DD - HH:mm:ss").format(
          "YYYY/MM/DD HH:mm"
        )
      ) {
        if (select.phase === "3") {
          // dataLog[0].minuteTimes.shift();
          // dataLog[0].minuteTimes.push(newData[0].ts * 1000)
          // console.log(newData[0]);
          // console.log(dataLog[0].timestamps);

          dataLog[0].timestamps.shift();
          dataLog[0].voltageA.shift();
          dataLog[0].voltageB.shift();
          dataLog[0].voltageC.shift();
          dataLog[0].voltageAvg.shift();
          dataLog[0].currentA.shift();
          dataLog[0].currentB.shift();
          dataLog[0].currentC.shift();
          dataLog[0].currentAvg.shift();
          dataLog[0].powerA.shift();
          dataLog[0].powerB.shift();
          dataLog[0].powerC.shift();
          dataLog[0].powerTotal.shift();
          dataLog[0].temperature.shift();

          dataLog[0].timestamps.push(
            moment(newData[0].date, "YYYY/MM/DD - HH:mm:ss").format(
              "YYYY/MM/DD HH:mm"
            )
          );
          dataLog[0].voltageA.push(newData[0].v_AN);
          dataLog[0].voltageB.push(newData[0].v_BN);
          dataLog[0].voltageC.push(newData[0].v_CN);
          dataLog[0].voltageAvg.push(newData[0].v_LN);
          dataLog[0].currentA.push(newData[0].c_A);
          dataLog[0].currentB.push(newData[0].c_B);
          dataLog[0].currentC.push(newData[0].c_C);
          dataLog[0].currentAvg.push(newData[0].c_AVG);
          dataLog[0].powerA.push(newData[0].atp_A);
          dataLog[0].powerB.push(newData[0].atp_B);
          dataLog[0].powerC.push(newData[0].atp_C);
          dataLog[0].powerTotal.push(newData[0].atp_Total);
          dataLog[0].temperature.push(newData[0].temp);
          // console.log(dataLog[0].timestamps);
        } else {
          dataLog[0].timestamps.shift();
          dataLog[0].voltageAvg.shift();
          dataLog[0].currentAvg.shift();
          dataLog[0].powerTotal.shift();
          dataLog[0].temperature.shift();

          dataLog[0].timestamps.push(
            moment(newData[0].date, "YYYY/MM/DD - HH:mm:ss").format(
              "YYYY/MM/DD HH:mm"
            )
          );
          dataLog[0].voltageAvg.push(newData[0].v_LN);
          dataLog[0].currentAvg.push(newData[0].c_AVG);
          dataLog[0].powerTotal.push(newData[0].atp_Total);
          dataLog[0].temperature.push(newData[0].temp);
        }
      }
    }
  }

  // Table
  if (
    $('.btn-report[data-time="realtime"]').hasClass("active") === true
  ) {
    if (realtimeDataTable.length !== 0) {
      if (
        realtimeDataTable[realtimeDataTable.length - 1][0] !==
        newData[0].ts
      ) {
        if (select.phase === 3) {
          realtimeDataTable.shift();
          // console.log(realtimeDataTable);
          realtimeDataTable.push([
            newData[0].ts,
            newData[0].v_AN,
            newData[0].v_BN,
            newData[0].v_CN,
            newData[0].v_LN,
            newData[0].c_A,
            newData[0].c_B,
            newData[0].c_C,
            newData[0].c_AVG,
            newData[0].atp_A,
            newData[0].atp_B,
            newData[0].atp_C,
            newData[0].atp_Total,
            newData[0].e,
            newData[0].temp,
          ]);
          // console.log(realtimeDataTable);
        } else {
          realtimeDataTable.shift();
          // console.log(realtimeDataTable);
          realtimeDataTable.push([
            newData[0].ts,
            newData[0].v_LN,
            newData[0].c_AVG,
            newData[0].atp_Total,
            newData[0].e,
            newData[0].temp,
          ]);
        }
      }
    }
  }
  // console.log(newData[0].date.slice(0, 18));
  // console.log({time: moment(newData[0].date.slice(0, 18), 'YYYY/MM/dd - HH:mm').unix()});
}
// ---------------------------
function showLoading() {
  // สร้างฟังก์ชันเพื่อแสดง loading
  // ตัวอย่าง: เพิ่ม class 'active' ให้กับ element ที่มี loading icon
  $('#loading-overlay').addClass('active');
}

function hideLoading() {
  // สร้างฟังก์ชันเพื่อซ่อน loading
  // ตัวอย่าง: ลบ class 'active' ออกจาก element
  $('#loading-overlay').removeClass('active');
}
// setting page
async function getSetting(menu) {
  const msg = JSON.parse(sessionStorage.getItem("sessionLog"));
  const account = msg.account;
  const display = msg.display;
  await $("#load_pages").html("");
  await $("#load_pages").empty();
  // console.log(msg);
  // console.log(menu);
  let logSite = groupBySite(display.logSite),
    newLogSite = [];
  // console.log(logSite);
  $.each(logSite, function (index, key) {
    newLogSite.push({
      siteID: key.site_id,
      siteName: key.site_name,
    });
  });
  const rowDiv = $("<div>", {
    class: "row",
  });
  const cardHtml = `
              <div class="row">
                  <div class="col-12 col-lg-2 col-xl-2 d-flex">
                      <div class="card w-100 radius-10 border-3 border-info">
                          <div class="card-body">
                              <ul class="nav nav-pills flex-column" role="tablist">
                                  <li class="nav-item" role="presentation">
                                      <a class="nav-link text-center ${
                                        menu === 1 ? "active" : ""
                                      } btn-subMenu" data-type="1" href="javascript:;" style="border: 1px solid transparent; border-color: #6c757d;">
                                          Profile
                                      </a>
                                  </li>
                                  ${
                                    account.level <= 2
                                      ? `
                                      <li class="nav-item6" role="presentation">
                                          <a class="nav-link text-center ${
                                            menu === 2 ? "active" : ""
                                          } btn-subMenu" data-type="2" href="javascript:;" style="border: 1px solid transparent; border-color: #6c757d;">
                                              User Management
                                          </a>
                                      </li>`
                                      : ``
                                  }
                              </ul>
                          </div>
                      </div>
                  </div>
                  <div class="col-12 col-lg-10 col-xl-10">
                      <div class="card radius-10 border-3 border-info shadow-none">
                          <div class="card-body tab-content">
                              ${
                                menu === 1
                                  ? `
                                  <div class="row g-3 p-5">
                                      <div class="d-flex flex-column align-items-center text-center">
                                          <img class="rounded-circle p-1 bg-primary pt_img2" src="assets/images/users/${account.img}" width="110">
                                          <input type="hidden" class="pt_img" value="${account.img}">
                                      </div>
                                      <hr>
                                      <div class="col-12">
                                          <label for="Username" class="form-label">Username</label>
                                          <div class="input-group input-group-lg">
                                              <span class="input-group-text bg-transparent"><i class="bx bxs-user"></i></span>
                                              <input type="text" class="form-control pt_name" placeholder="ชื่อผู้ใช้งาน" value="${account.user}" disabled>
                                          </div>
                                      </div>
                                      <div class="text-center">
                                          <button type="button" class="btn btn-info px-5 edit_p"><i class="fadeIn animated bx bx-message-square-edit"></i>Edit</button>
                                      </div>
                                  </div>`
                                  : // table user
                                    (() => {
                                      let result = "";
                                      if (account.level <= 2) {
                                        result += `
                                          <div class="d-flex justify-content-end">
                                              <div class="mb-1 col col-lg-3 col-md-3">
                                                  <input type="hidden" id="count_site" value="${newLogSite.length}">`;
                                        if (newLogSite.length > 1) {
                                          result +=
                                            '<select class="form-select mt-1" id="userSite" required="">';

                                          for (
                                            let i = 0;
                                            i < newLogSite.length;
                                            i++
                                          ) {
                                            const site = newLogSite[i];
                                            result += `<option value="${site.siteID}">${site.siteName}</option>`;
                                          }
                                          result += "</select>";
                                        }
                                        result += `
                                              </div>
                                              <button class="btn btn-outline-success me-1 s_add mb-3 ms-auto"><i class="bi bi-plus-square"></i> เพิ่มผู้ใช้งานใหม่</button>
                                              <button class="btn btn-outline-success me-1 s_manage mb-3 "><i class="bi bi-plus-square"></i> เพิ่มผู้ใช้งานจากที่มี</button>
                                          </div>
                                          <div class="table-responsive">
                                              <table id="table_user" class="table table-striped table-bordered dataTable" style="width:100%">
                                                  <thead>
                                                      <tr>
                                                          <th class="text-center">#</th>
                                                          <th class="text-center">Images</th>
                                                          <th class="text-center">Username</th>
                                                          <th class="text-center">Password</th>
                                                          ${
                                                            newLogSite.length >
                                                            1
                                                              ? '<th class="text-center">Site</th>'
                                                              : ""
                                                          }
                                                          <th class="text-center">Meter</th>
                                                          <th class="text-center">Status</th>
                                                          <th class="text-center">Suspend</th>
                                                          <th class="text-center">Adder</th>
                                                          <th class="text-center">Time Update</th>
                                                          <th class="text-center">Action</th>
                                                      </tr>
                                                  </thead>
                                              </table>
                                          </div>`;
                                      }
                                      return result;
                                    })()
                              }
                          </div>
                      </div>
                  </div>
              </div>
              <div class="modal fade" id="modal_profile" tabindex="-1" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered">
                      <div class="modal-content">
                          <div class="modal-header">
                              <h5 class="modal-title title_mod"></h5>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                              <form class="row g-3" id="profile_from" enctype="multipart/form-data" onSubmit="return false;">
                                  <div class="col-12 hid_se_name">
                                      <label for="Password" class="form-label">Select User</label>
                                      <div class="input-group input-group-lg">
                                          <span class="input-group-text bg-transparent"><i class="bx bx-id-card"></i></span>
                                          <select class="form-control sel_name" name="sel_name"></select>
                                          <div class="invalid-feedback bp_sel_name"></div>
                                      </div>
                                  </div>
                                  <div class="d-flex flex-column align-items-center text-center">
                                      <img class="rounded-circle p-1 bg-primary p_img" width="110">
                                      <div class="mt-3 input-group">
                                          <input type="file" class="form-control" name="p_img" id="p_img_input" onchange="Showimg_profile(this)">
                                          <input type="hidden" name="mode_insert" class="mode_insert">
                                      </div>
                                  </div>
                                  <hr>
                                  <div class="col-12 hid_name">
                                      <label for="Username" class="form-label">Username<span class="text-danger">*</span></label>
                                      <div class="input-group input-group-lg"> <span class="input-group-text bg-transparent"><i class="bx bxs-user"></i></span>
                                          <input type="text" class="form-control border-start-0 p_name" name="p_name" placeholder="Username">
                                          <div class="invalid-feedback bp_name"></div>
                                      </div>
                                  </div>
                                  <div class="col-12 hid_pass">
                                      <label for="Password" class="form-label">Password</label>
                                      <div class="input-group input-group-lg" id="show_hide_password"> <span class="input-group-text bg-transparent"><i class="bx bxs-lock-open"></i></span>
                                          <input type="password" class="form-control border-end-0 p_pass" name="p_pass" placeholder="Password" /> <a href="javascript:;" class="input-group-text bg-transparent"><i class='bx bx-hide'></i></a>
                                          <!-- <input type="password" class="form-control border-start-0 p_pass" name="p_pass" placeholder="Password"> -->
                                          <div class="invalid-feedback bp_pass"></div>
                                      </div>
                                  </div>

                                  <div class="col-12 lev_us">
                                      ${
                                        account.level <= 2
                                          ? (() => {
                                              let result = `
                                                  <label for="Password" class="form-label">Site</label>
                                                  <div class="input-group input-group-lg">
                                                      <span class="input-group-text bg-transparent"><i class="bx bx-id-card"></i></span>
                                                      <select class="form-control mode_site" name="mode_site" onchange="loadMeter($(this).val(), logSite)">`;
                                              for (let i = 0; i < newLogSite.length; i++) {
                                                const site = newLogSite[i];
                                                result += `<option value="${site.siteID}">${site.siteName}</option>`;
                                              }
                                              result += `
                                                      </select>
                                                  </div>`;
                                              return result;
                                            })()
                                          : ``
                                      }
                                  </div>

                                  <div class="col-12 lev_us">
                                      <label for="Password" class="form-label">Meter</label>
                                      <div class="input-group input-group-lg">
                                          <span class="input-group-text bg-transparent"><i class="bx bx-id-card"></i></span>
                                          <select class="form-control mode_house" name="mode_house"></select>
                                          <div class="invalid-feedback bp_mode_house"></div>
                                      </div>
                                  </div>

                                  <div class="col-12 lev_us">
                                      <label for="Level" class="form-label">Level User</label>
                                      <div class="input-group input-group-lg"> <span class="input-group-text bg-transparent"><i class="bx bx-id-card"></i></span>
                                          <select name="p_status" class="form-control p_status">
                                              <option value="3">User</option>
                                              ${
                                                account.level === 0
                                                  ? '<option value="2">Admin</option><option value="1">Super Admin</option>'
                                                  : ""
                                              }
                                          </select>
                                          <input type="hidden" name="p_id" class="p_id">
                                          <input type="hidden" name="asid" class="asid">
                                      </div>
                                  </div>
                                  <div class="col-12 suspendStatus">
                                      <label for="Suspend" class="form-label">Suspend User</label>
                                      <div class="input-group input-group-lg"> <span class="input-group-text bg-transparent"><i class="bx bx-id-card"></i></span>
                                          <select name="p_suspend" class="form-control p_suspend">
                                              <option value="0">ระงับการใช้งาน</option>
                                              <option value="1">อนุญาตให้ใช้งาน</option>
                                          </select>
                                      </div>
                                  </div>
                              </form>
                          </div>
                          <div class="modal-footer">
                              <button type="button" class="btn btn-success submit_p"><i class="fadeIn animated bx bx-save"></i>บันทึก</button>
                              <button type="button" class="btn btn-danger" data-bs-dismiss="modal" aria-label="Close"><i class="fadeIn animated bx bx-window-close"></i>ยกเลิก</button>
                          </div>
                      </div>
                  </div>
              </div>
          `;
  rowDiv.append(cardHtml);
  $("#load_pages").append(rowDiv);
  // // });
  if (menu === 2) {
    fetchUserData(account, newLogSite);
  }
}
function loadMeter(siteID, logSite) {
  // console.log(logSite);
  // console.log(siteID);
  let result = "";
  $.each(logSite, function (index, key) {
    if (parseInt(key.site_id) === parseInt(siteID)) {
      result += `<option value="${key.house_id}">${key.house_name}</option>`;
    }
  });
  $(".mode_house").html(result);
}
// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้
function fetchUserData(account, newLogSite) {
  // สมมติว่าเราใช้ AJAX เพื่อดึงข้อมูลจาก API
  let selSite = null;
  if (display.countSite === 1) {
    selSite = display.select.siteID;
  } else {
    selSite = $("#userSite").val();
  }
  // alert(selSite)
  // return false
  $.ajax({
    url: partURL+"getTableUsers.php",
    type: "POST",
    data: {
      level: account.level,
      user_id: account.id,
      selSite: selSite,
    },
    dataType: "json",
    success: function (response) {
      // console.log(response);
      if (response.status === "success") {
        renderUserTable(response.data, newLogSite);
      } else {
        console.error("Error fetching user data:", response.message);
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", error);
    },
  });
}
// ฟังก์ชันสำหรับแสดงข้อมูลในตาราง
function renderUserTable(userData, newLogSite) {
  // สร้างข้อมูลสำหรับ DataTables
  let newData = [];
  // console.log(userData);
  userData.forEach((user, index) => {
    let rowData = [];

    // ลำดับ
    rowData.push(index + 1);

    // รูปภาพ
    let imgSrc = user.account_img
      ? `assets/images/users/${user.account_img}`
      : "assets/images/users/user.png";
    rowData.push(
      `<img src="${imgSrc}" width="50" height="50" alt="...">`
    );

    // Username
    rowData.push(user.account_user);

    // Password
    rowData.push(user.account_pass);

    // Site (แสดงเฉพาะเมื่อมีไซต์มากกว่า 1)
    if (newLogSite.length > 1) {
      rowData.push(user.site_name);
    }

    // Meter
    rowData.push(user.house_name);

    // Status
    let statusBadge = "";
    if (user.userST_level == 1) {
      statusBadge = '<span class="badge bg-success"> Super Admin </span>';
    } else if (user.userST_level == 2) {
      statusBadge = '<span class="badge bg-info"> Admin </span>';
    } else {
      statusBadge = '<span class="badge bg-warning"> User </span>';
    }
    rowData.push(statusBadge);

    // account_suspend
    if (user.account_suspend === 1) {
      rowData.push(
        '<span class="badge bg-success"> อนุญาตใช้งาน </span>'
      );
    } else {
      rowData.push(
        '<span class="badge bg-danger"> ระงับการใช้งาน </span>'
      );
    }

    rowData.push(user.main_account_user);

    // Time Update
    rowData.push(user.account_timestamp);

    // Action Buttons
    let actionButtons = `<div class="buttons">`;

    if (user.account_id == 1) {
      actionButtons = `
                          <a href="javascript:void(0)" class="text-info edit_user"
                          data-id="${user.userST_id}"
                          data-asid="${user.account_id}"
                          data-img="${user.account_img}"
                          data-name="${user.account_user}"
                          data-pass="${user.account_pass}"
                          data-suspend="${user.account_suspend}"
                          data-siteid="${user.userST_siteID}"
                          data-houseid="${user.userST_houseID}"
                          data-level="${user.userST_level}">
                              <i class="fadeIn animated bx bx-message-square-edit"></i>
                          </a>`;
      actionButtons +=
        '<a class="text-secondary" onclick="return false;"><i class="fadeIn animated bx bx-trash"></i></a>';
    } else {
      if (account.id == user.account_id) {
        actionButtons +=
          '<a class="text-secondary"><i class="fadeIn animated bx bx-trash"></i></a>';
      } else {
        actionButtons = `
                          <a href="javascript:void(0)" class="text-info edit_user"
                          data-id="${user.userST_id}"
                          data-asid="${user.account_id}"
                          data-img="${user.account_img}"
                          data-name="${user.account_user}"
                          data-pass="${user.account_pass}"
                          data-suspend="${user.account_suspend}"
                          data-siteid="${user.userST_siteID}"
                          data-houseid="${user.userST_houseID}"
                          data-level="${user.userST_level}">
                              <i class="fadeIn animated bx bx-message-square-edit"></i>
                          </a>`;
        actionButtons += `
                          <a href="javascript:void(0)" class="text-danger delete_user"
                             data-id="${user.userST_id}"
                             data-acid="${user.account_id}"
                             data-img="${user.account_img}"
                             data-s_name="${user.house_name}"
                             data-name="${user.account_user}"
                             data-level="${user.userST_level}"
                             data-siteid="${newLogSite.length}">
                              <i class="fadeIn animated bx bx-trash"></i>
                          </a>`;
      }
    }

    actionButtons += "</div>";
    rowData.push(actionButtons);

    newData.push(rowData);
  });

  // กำหนดค่า DataTables options
  const dtOptions = {
    responsive: false, // เปลี่ยนเป็น false เพื่อป้องกันการขัดแย้งกับ scrollX
    lengthChange: false,
    autoWidth: false,
    scrollY: "330px", // ระบุหน่วยเป็น px ให้ชัดเจน
    scrollX: true,
    scrollCollapse: true, // เพิ่มตัวเลือกนี้เพื่อปรับความสูงของตารางเมื่อข้อมูลน้อย
    paging: false,
    searching: false,
    ordering: true,
    info: true,
    language: {
      info: "แสดงทั้งหมด _TOTAL_ รายการ",
      infoEmpty: "ไม่มีข้อมูล",
      infoFiltered: "(กรองจากทั้งหมด _MAX_ รายการ)",
    },
  };

  // สร้างหรืออัพเดท DataTable
  if ($.fn.DataTable.isDataTable("#table_user")) {
    let table = $("#table_user").DataTable();
    table.clear().rows.add(newData).draw();
  } else {
    $("#table_user").DataTable(dtOptions).rows.add(newData).draw();
  }

  // เพิ่ม Event Listeners สำหรับปุ่ม Edit และ Delete
  // setupEventListeners();
}
// ฟังก์ชันสำหรับตั้งค่า Event Listeners
function setupEventListeners() {
  // Event สำหรับปุ่ม Edit
  $(document).on("click", ".edit_user", async function () {
    // alert('ss')
    const userId = $(this).data("id");
    const accountId = $(this).data("asid");
    const img = $(this).data("img");
    const name = $(this).data("name");
    const pass = $(this).data("pass");
    const siteId = $(this).data("siteid");
    const houseId = $(this).data("houseid");
    const level = $(this).data("level");
    const suspend = $(this).data("suspend");

    $(".hid_se_name").hide();
    $(".title_mod").html("Edit : " + name);
    $(".mode_insert").val("edit_user");
    $(".lev_us").show();
    $(".hid_name").show();
    $(".hid_pass").show();
    if (img === "") {
      $(".p_img").attr("src", "assets/images/users/user.png");
    } else {
      $(".p_img").attr("src", "assets/images/users/" + img);
    }
    $("#p_img_input").val("").hide();
    $(".p_name").val(name).prop("disabled", false);
    $(".p_pass").val(pass).prop("disabled", false);
    $(".p_id").val(userId);
    $(".p_status").val(level);
    // alert(siteId)
    $(".mode_site").val(siteId);
    await loadMeter(siteId, logSite); // mode_house
    await $(".mode_house").val(houseId).removeClass("is-invalid");
    $(".bp_mode_house").html("");
    $(".asid").val(accountId);
    $(".suspendStatus").show();
    $(".p_suspend").val(suspend);
    $("#modal_profile").modal("show");
  });

  // Event สำหรับปุ่ม Delete
  $(document).on("click", ".delete_user", function () {
    const userId = $(this).data("id");
    const accountId = $(this).data("acid");
    const img = $(this).data("img");
    const siteName = $(this).data("s_name");
    const name = $(this).data("name");
    const level = $(this).data("level");
    const siteCount = $(this).data("siteid");

    swal({
      title: "ลบผู้ใช้งาน !",
      text:
        "คุณต้องการลบ : " + name + " ออกจาก " + siteName + " หรือไม่ ?",
      type: "warning",
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: "#00CC33",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value) {
        $.ajax({
          url: partURL+"save_setting.php",
          type: "POST",
          data: {
            id: userId,
            acid: accountId,
            mode_insert: "delete_user",
          },
          dataType: "json",
          success: function (data) {
            if (data.status == "Insert_Error") {
              swal({
                title: "เกิดข้อผลิดพลาด !",
                text: "บันทึกไม่สำเร็จ !!!",
                type: "error",
                allowOutsideClick: false,
                confirmButtonColor: "#32CD32",
              }).then((result) => {
                if (result.value) {
                  location.reload();
                }
              });
              return false;
            }
            if (data.status == "Delete_success") {
              let logSite = groupBySite(display.logSite),
                newLogSite = [];
              // console.log(logSite);
              $.each(logSite, function (index, key) {
                newLogSite.push({
                  siteID: key.site_id,
                  siteName: key.site_name,
                });
              });
              fetchUserData(account, newLogSite);
              swal({
                title: "ลบข้อมูลสำเร็จ",
                type: "success",
                allowOutsideClick: false,
                confirmButtonColor: "#32CD32",
              }).then((result2) => {
                if (result2.value) {
                  if (data.user_id != "No") {
                    swal({
                      title: "ลบข้อมูลผู้ใช้ออกจากระบบ !",
                      text:
                        "คุณต้องการลบ : " + name + " ออกจากระบบหรือไม่ ?",
                      type: "warning",
                      allowOutsideClick: false,
                      showCancelButton: true,
                      confirmButtonColor: "#00CC33",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Yes",
                      cancelButtonText: "Cancel",
                    }).then((result) => {
                      if (result.value) {
                        $.ajax({
                          url: partURL+"save_setting.php",
                          type: "POST",
                          data: {
                            id: data.user_id,
                            mode_insert: "delete_user_system",
                            img: img,
                          },
                          dataType: "json",
                          success: function (data) {
                            if (data.status == "Insert_Error") {
                              swal({
                                title: "เกิดข้อผลิดพลาด !",
                                text: "บันทึกไม่สำเร็จ !!!",
                                type: "error",
                                allowOutsideClick: false,
                                confirmButtonColor: "#32CD32",
                              }).then((result) => {
                                if (result.value) {
                                  location.reload();
                                }
                              });
                              return false;
                            }
                            if (data.status == "Delete_success") {
                              swal({
                                title: "ลบข้อมูลสำเร็จ.",
                                type: "success",
                                allowOutsideClick: false,
                                confirmButtonColor: "#32CD32",
                              });
                            }
                          },
                        });
                      }
                    });
                  }
                }
              });
            }
          },
        });
      }
    });
  });

  // เลือก Site Reload tableUser
  $(document).on("change", "#userSite", async function () {
    let nlogSite = groupBySite(display.logSite),
      newLogSite = [];
    // console.log(nlogSite);
    $.each(nlogSite, function (index, key) {
      newLogSite.push({
        siteID: key.site_id,
        siteName: key.site_name,
      });
    });
    await fetchUserData(account, newLogSite);
  });
  // Edit Profile
  $(document).on("click", ".edit_p", function () {
    $(".hid_se_name").hide();
    $(".title_mod").html("Edit Profile");
    $(".mode_insert").val("edit_profile");
    $(".p_img").attr("src", "assets/images/users/" + $(".pt_img").val());
    $("#p_img_input").show().val("");
    $(".p_name").val($(".pt_name").val()).prop("disabled", false);
    $(".p_pass").val("").prop("disabled", false);
    $(".hid_name").show();
    $(".hid_pass").show();
    $(".lev_us").hide();
    $(".p_id").val("");
    $(".suspendStatus").hide();
    $("#modal_profile").modal("show");
  });
  // เพิ่มผู้ใช้งาน
  $(document).on("click", ".s_add", function () {
    $(".hid_se_name").hide();
    $(".title_mod").html("เพิ่มผู้ใช้งานใหม่");
    $(".mode_insert").val("add_user");
    $(".lev_us").show();
    $(".hid_name").show();
    $(".hid_pass").show();
    $(".p_img").attr("src", "assets/images/default.jpg");
    $("#p_img_input").show().val("");
    $(".p_name")
      .val("")
      .prop("disabled", false)
      .removeClass("is-invalid");
    $(".p_pass").val("").prop("disabled", false);
    $(".p_id").val("");
    $(".p_status").val("3");
    $(".mode_site").val(logSite[0].site_id);
    loadMeter(logSite[0].site_id, logSite);
    $(".mode_house").removeClass("is-invalid");
    $(".bp_mode_house").html("");
    $(".suspendStatus").hide();
    $("#modal_profile").modal("show");
  });
  // เพิ่มผู้ใช้งานที่มีอยู่แล้ว
  $(document).on("click", ".s_manage", function () {
    $(".hid_se_name").show();
    $(".sel_name").load("db/option_user.php").removeClass("is-invalid");
    $(".title_mod").html("เพิ่มผู้ใช้งานที่มีอยู่แล้ว");
    $(".mode_insert").val("add_user_e");
    $(".lev_us").show();
    $(".hid_name").hide();
    $(".hid_pass").hide();
    $(".p_img").attr("src", "assets/images/default.jpg");
    $("#p_img_input").hide();
    $(".p_id").val("");
    $(".p_status").val("3");
    loadMeter(logSite[0].site_id, logSite);
    // $('.mode_house').load('config/option_meter.php?s='+$('.mode_site').val()+'&m=add_user_e');
    $(".mode_house").removeClass("is-invalid");
    $(".bp_mode_house").html("");
    $(".suspendStatus").hide();
    $("#modal_profile").modal("show");
  });
  $(document).on("change", ".sel_name", function () {
    let imgu = $(".sel_name option:selected").attr("img");
    if (imgu === "") {
      $(".p_img").attr("src", "assets/images/users/user.png");
    } else {
      $(".p_img").attr("src", "assets/images/users/" + imgu);
    }
    $(".sel_name").removeClass("is-invalid");
    $(".bp_sel_name").html("");
  });
  // Sumbit modal
  $(document).on("click", ".submit_p", function () {
    if ($(".mode_insert").val() == "add_user_e") {
      if ($(".sel_name").val() == "0") {
        $(".sel_name").addClass("is-invalid");
        $(".bp_sel_name").html("กรถณาเลือกผู้ใช้งาน");
        return false;
      } else {
        $(".sel_name").removeClass("is-invalid");
        $(".bp_sel_name").html("");
      }
      if ($(".mode_house").val() == "") {
        $(".mode_house").addClass("is-invalid");
        $(".bp_mode_house").html("กรถณาเลือก Meter");
        return false;
      } else {
        $(".mode_house").removeClass("is-invalid");
        $(".bp_mode_house").html("");
      }
      // alert($(".mode_house").val())
      n_name = $(".sel_name option:selected").attr("iname");
    } else {
      if ($(".p_name").val() === "") {
        $(".p_name").addClass("is-invalid");
        $(".bp_name").html("กรถณาระบุชื่อผู้ใช้งาน");
        return false;
      } else {
        $(".p_name").removeClass("is-invalid");
      }
      if (
        $(".mode_insert").val() == "add_user" ||
        $(".mode_insert").val() == "edit_user"
      ) {
        if ($(".mode_insert").val() == "add_user") {
          if ($(".p_pass").val() === "") {
            $(".p_pass").addClass("is-invalid");
            $(".bp_pass").html("กรถณาระบุรหัสผ่าน");
            return false;
          } else {
            $(".p_pass").removeClass("is-invalid");
          }
        }
        if ($(".mode_house").val() == "") {
          $(".mode_house").addClass("is-invalid");
          $(".bp_mode_house").html("กรถณาเลือก Meter");
          return false;
        } else {
          $(".mode_house").removeClass("is-invalid");
          $(".bp_mode_house").html("");
        }
      }
      n_name = $(".p_name").val();
    }
    // console.log($('.mode_insert').val());
    // console.log(new FormData($("#profile_from")[0]));
    // return false
    // let loading = verticalNoTitle();
    $.ajax({
      type: "POST",
      url: "https://iot.smartsoul-pcb.com/db/save_setting.php",
      data: new FormData($("#profile_from")[0]),
      contentType: false,
      cache: false,
      processData: false,
      success: function (res) {
        // loadingOut(loading);
        var parseJSON = $.parseJSON(res);
        // console.log(parseJSON.data)
        // return false
        if (parseJSON.status === "มีรายชื่อนี้แล้ว") {
          swal({
            title: "มีรายชื่อนี้แล้ว !",
            // text: "" + sw_name + " ?",
            type: "warning",
            allowOutsideClick: false,
            confirmButtonColor: "#32CD32",
          });
          $(".p_name").addClass("is-invalid");
          $(".bp_name").html("Please enter a new username.");
          return false;
        }
        if (parseJSON.status === "สกุลไฟล์ไม่ถูกต้อง") {
          swal({
            title: "The picture is not correct !",
            text: "Please select a file extension gif, jpeg, jpg, png or svg",
            type: "warning",
            allowOutsideClick: false,
            confirmButtonColor: "#32CD32",
          });
          return false;
        }
        if (parseJSON.status === "Limit") {
          swal({
            title: "จำกัดผู้ใช้งาน 5 บัญชี !",
            text: "คุณเพิ่มบัญชีผู้ใช้งานถึงจำนวนสูงสุดแล้ว",
            type: "warning",
            allowOutsideClick: false,
            confirmButtonColor: "#32CD32",
          });
          // $(".p_name").addClass("is-invalid");
          // $(".bp_name").html("Please enter a new username.");
          return false;
        }
        if (parseJSON.status === "yes_h") {
          swal({
            title: n_name + " เข้าถึงอยู่แล้ว !",
            // text: "" + sw_name + " ?",
            type: "warning",
            allowOutsideClick: false,
            confirmButtonColor: "#32CD32",
          });
          if ($(".mode_insert").val() == "add_user_e") {
            $(".sel_name").addClass("is-invalid");
            $(".bp_sel_name").html("กรถณาเลือกผู้ใช้งานอื่น");
            return false;
          } else {
            $(".mode_house").addClass("is-invalid");
            $(".bp_mode_house").html("กรุณาเลือก Meter อื่น");
            return false;
          }
        }
        if (parseJSON.status == "Insert_Error") {
          swal({
            title: "Error !",
            text: "Failed to save !!!",
            type: "error",
            allowOutsideClick: false,
            confirmButtonColor: "#32CD32",
          }).then((result) => {
            if (result.value) {
              location.reload();
            }
          });
          return false;
        }
        if (parseJSON.status == "Insert_success") {
          if ($(".mode_insert").val() === "edit_profile") {
            $(".user-img").attr(
              "src",
              "assets/images/users/" + parseJSON.data.image
            );
            $(".user_name").html(parseJSON.data.user);

            $(".pt_img").val(parseJSON.data.image);
            $(".pt_img2").attr(
              "src",
              "assets/images/users/" + parseJSON.data.image
            );
            $(".pt_name").val(parseJSON.data.user);
          } else {
            let logSite = groupBySite(display.logSite),
              newLogSite = [];
            // console.log(logSite);
            $.each(logSite, function (index, key) {
              newLogSite.push({
                siteID: key.site_id,
                siteName: key.site_name,
              });
            });
            fetchUserData(account, newLogSite);
          }
          swal({
            title: "Successfully.",
            // text: "" + sw_name + " ?",
            type: "success",
            allowOutsideClick: false,
            confirmButtonColor: "#32CD32",
          });
          $("#modal_profile").modal("hide");
        }
      },
    });
  });
  $(document).on("click", "#show_hide_password a", function (event) {
    event.preventDefault();
    if ($("#show_hide_password input").attr("type") == "text") {
      $("#show_hide_password input").attr("type", "password");
      $("#show_hide_password i").addClass("bx-hide");
      $("#show_hide_password i").removeClass("bx-show");
    } else if (
      $("#show_hide_password input").attr("type") == "password"
    ) {
      $("#show_hide_password input").attr("type", "text");
      $("#show_hide_password i").removeClass("bx-hide");
      $("#show_hide_password i").addClass("bx-show");
    }
  });
}
// // ฟังก์ชันเปลี่ยน active button สำหรับ mode และ time
function setActiveButton(selector, value) {
  $(selector).each(function () {
    if (
      $(this).data("type") === value ||
      $(this).data("time") === value
    ) {
      $(this).addClass("active");
    } else {
      $(this).removeClass("active");
    }
  });
}
function Showimg_profile(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $(".p_img").attr("src", e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  }
}
// exit setting page

// Table----------------
async function getDataTable(select) {
  try {
    let month = $('select.btn-report2[data-time="month"]').val();
    let status = "";
    if (month === "") {
      status = $(".btn-report[data-time].active").data("time");
    } else {
      status = "month";
    }
    let val = {
      sn: select.sn,
      // mode: $('.btn-report[data-type].active').data('type'),
      phase: select.phase,
      status: status,
      month: month,
      year: $('select.btn-report2[data-time="year"]').val(),
    };
    // if (val.mode !== 'ENERGY') {
    // console.log(val);
    //     return false
    // }
    const masterData = await $.ajax({
      type: "POST",
      url: partURL+"getTable.php",
      data: val,
      dataType: "json",
    });
    // console.log(masterData);
    return await masterData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
function renderTable(masterData, mode) {
  showTableLoading();
  // Determine which table to show/hide based on the phase.
  let tableNumber;
  if (select.phase === 3) {
    tableNumber = 2;
    $("#table_1").hide();
    $("#table_2").show();
  } else {
    tableNumber = 1;
    $("#table_1").show();
    $("#table_2").hide();
  }

  // Build the base DataTable options.
  let dtOptions = {
    scrollY: 330,
    scrollX: true,
    scrollCollapse: false,
    destroy: true,
    order: [[0, "desc"]],
    columnDefs: [
      {
        targets: [0],
        visible: false,
        searchable: false,
      },
    ],
    // เพิ่ม callback functions สำหรับ events
    drawCallback: function () {
      hideTableLoading();
    },
    language: {
      emptyTable: "ไม่มีข้อมูล",
      info: "แสดง _START_ ถึง _END_ จาก _TOTAL_ รายการ",
      infoEmpty: "แสดง 0 ถึง 0 จาก 0 รายการ",
      loadingRecords: "กำลังโหลด...",
      processing: `<div class="spinner-border text-primary" role="status">
                                  <span class="visually-hidden">กำลังโหลด...</span>
                              </div>`,
      zeroRecords: "ไม่พบข้อมูล",
    },
  };

  if (mode === "realtime") {
    realtimeDataTable = masterData;
    dtOptions.paging = false;
    dtOptions.searching = false;
  } else {
    let currentdate = new Date();
    let datetime =
      currentdate.getFullYear() +
      "-" +
      (currentdate.getMonth() + 1) +
      "-" +
      currentdate.getDate() +
      "_" +
      currentdate.getHours() +
      "." +
      currentdate.getMinutes();

    dtOptions.paging = true; // required for Scroller
    dtOptions.deferRender = true;
    dtOptions.scroller = true;
    dtOptions.searching = false;
    dtOptions.scrollY = "50vh";
    dtOptions.language = {
      processing:
        "<span class='fa-stack fa-lg'>\n\
                      <i class='fa fa-spinner fa-spin fa-stack-2x fa-fw'></i>\n\
                  </span>&emsp;Processing ...",
    };
    dtOptions.dom = "<'floatRight'B><'clear'>frtip";
    dtOptions.buttons = [
      {
        text: "Export csv",
        title: "Power Monitoring",
        charset: "utf-8",
        extension: ".csv",
        className: "btn btn-outline-success px-5 btnexport0",
        extend: "csv",
        format: "YYYY/MM/dd",
        filename: "power-monitoring_" + datetime,
        bom: true,
      },
    ];
  }

  // Initialize (or reinitialize) the DataTable with the specified options.
  let table = $("#table_" + tableNumber).DataTable(dtOptions);
  table.button(".btnexport0").nodes().css("display", "none");
  // console.log(masterData)
  if (masterData === null) {
    table.clear().rows.add([]).draw();
    $("#table_" + tableNumber + "_paginate").css("display", "none");
    return;
  }
  // Transform the masterData into the new format expected by DataTable.
  const newData = [];
  masterData.forEach((row) => {
    const minuteKey = row[0];
    const ts = formatDate(minuteKey * 1000);
    newData.push([
      ts, // full timestamp
      ts.slice(0, 10), // date portion
      ts.slice(11, 16), // time portion
      ...row.slice(1), // additional data columns
    ]);
  });

  // Clear any existing data and then add the new data.
  table.clear().rows.add(newData).draw();

  // สำหรับ mode ที่ไม่ใช่ realtime ซ่อน pagination controls
  if (mode !== "realtime") {
    if (newData.length > 0) {
      table.button(".btnexport0").nodes().css("display", "block");
    }
    $("#table_" + tableNumber + "_paginate").css("display", "none");
  } else {
    // ควร clearInterval ก่อนถ้ามีการตั้งค่าอยู่แล้ว
    if (window.realtimeInterTable) {
      clearInterval(window.realtimeInterTable);
    }
    window.realtimeInterTable = setInterval(function () {
      let updatedData = [];
      if (realtimeDataTable !== null) {
        realtimeDataTable.forEach((row) => {
          const minuteKey = row[0];
          const ts = formatDate(minuteKey * 1000);
          updatedData.push([
            ts,
            ts.slice(0, 10),
            ts.slice(11, 16),
            ...row.slice(1),
          ]);
        });
        table.clear().rows.add(updatedData).draw();
        // บังคับให้ซ่อน column 0 หลังจากการ update
        table.column(0).visible(false);
      }
    }, 30000);
  }

  // Optionally, handle any loading indicator removal here.
  // if (loading !== null) {
  //   loadingOut(loading);
  //   loading = null;
  // }
}
function showTableLoading() {
  const loadingHtml = `
              <div id="table-loading" style="
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background: rgba(255, 255, 255, 0.8);
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  z-index: 9999;">
                  <div style="text-align: center;">
                      <div class="spinner-border text-primary" role="status">
                          <span class="visually-hidden">กำลังโหลด...</span>
                      </div>
                      <div class="mt-2">กำลังโหลดข้อมูล...</div>
                  </div>
              </div>
          `;

  // ถ้ายังไม่มี loading overlay ให้สร้างใหม่
  if (!document.getElementById("table-loading")) {
    document.body.insertAdjacentHTML("beforeend", loadingHtml);
  } else {
    document.getElementById("table-loading").style.display = "flex";
  }

  // ปรับสีพื้นหลังตาม theme
  if (document.body.classList.contains("dark-theme")) {
    document.getElementById("table-loading").style.background =
      "rgba(0, 0, 0, 0.8)";
    document.querySelector("#table-loading .mt-2").style.color =
      "#ffffff";
  }
}

// ฟังก์ชันสำหรับซ่อน loading
function hideTableLoading() {
  const loadingElement = document.getElementById("table-loading");
  if (loadingElement) {
    loadingElement.style.display = "none";
  }
}
// exit table ----------------

// chart ---------------------
async function getDataChart(select) {
  try {
    let month = $('select.btn-custom2[data-time="month"]').val();
    let status = "";
    if (month === "") {
      status = $(".btn-custom[data-time].active").data("time");
    } else {
      status = "month";
    }
    let val = {
      sn: select.sn,
      mode: $(".btn-custom[data-type].active").data("type"),
      phase: select.phase,
      status: status,
      month: month,
      year: $('select.btn-custom2[data-time="year"]').val(),
    };
    // if (val.mode !== 'ENERGY') {
    // console.log(val);
    //     return false
    // }
    const masterData = await $.ajax({
      type: "POST",
      url: partURL+"getChart.php",
      data: val,
      dataType: "json",
    });

    // ----------------------------------------
    let isEnergyMode =
      $(".btn-custom[data-type].active").data("type") === "ENERGY";
    // let rawTimestamp = [], rawEnergy = [], aa = [];

    let timestamps = [],
      minuteTimes = [],
      voltageA = [],
      voltageB = [],
      voltageC = [],
      voltageAvg = [],
      currentA = [],
      currentB = [],
      currentC = [],
      currentAvg = [],
      powerA = [],
      powerB = [],
      powerC = [],
      powerTotal = [],
      energy = [],
      temperature = [];
    // console.log(masterData);

    const hourlyLabels = [];
    const hourlyTimes = [];
    const hourlyVoltageA = [],
      hourlyVoltageB = [],
      hourlyVoltageC = [],
      hourlyVoltageAvg = [];
    const hourlyCurrentA = [],
      hourlyCurrentB = [],
      hourlyCurrentC = [],
      hourlyCurrentAvg = [];
    const hourlyPowerA = [],
      hourlyPowerB = [],
      hourlyPowerC = [],
      hourlyPowerTotal = [];
    const hourlyTemperature = [],
      hourlyEnergy = [];

    const dailyLabels = [];
    const dailyTimes = [];
    const dailyVoltageA = [],
      dailyVoltageB = [],
      dailyVoltageC = [],
      dailyVoltageAvg = [];
    const dailyCurrentA = [],
      dailyCurrentB = [],
      dailyCurrentC = [],
      dailyCurrentAvg = [];
    const dailyPowerA = [],
      dailyPowerB = [],
      dailyPowerC = [],
      dailyPowerTotal = [];
    const dailyTemperature = [],
      dailyEnergy = [];

    // console.log(moment.unix(masterData[1]).format('YYYY/MM/DD HH:mm'));
    // console.log(new Date(masterData[2] / 3600) * 3600));

    if (masterData !== null) {
      const newData = masterData[0]; //arr_data(newData.data, newData.start, newData.stop, "YYYY/MM/DD - HH:mm", 'hour')
      const startTime = masterData[1]; // Math.floor(newData[0][0] / 60) * 60;
      const endTime = masterData[2]; // Math.floor(newData[newData.length - 1][0] / 60) * 60;
      // console.log(newData)
      const dataMap = {};
      newData.forEach((row) => {
        const minuteKey = row[0]; // Math.floor(row[0] / 60) * 60;
        dataMap[minuteKey] = row;
        // rawTimestamp.push(minuteKey)
        // rawEnergy.push(row[1])
        // aa.push(formatDate(minuteKey* 1000, isEnergyMode))
      });
      // console.log({'m1' : rawTimestamp, 'm2': aa, 'm3': rawEnergy, start:formatDate(startTime* 1000, isEnergyMode)})
      // console.log(aggregateData(rawTimestamp, rawEnergy, startTime, endTime));

      // return false
      if (currentType !== "ENERGY") {
        //     for (let t = startTime; t <= endTime; t += 3600) {
        //         const timeMs = t * 1000;
        //         minuteTimes.push(timeMs);
        //         timestamps.push(formatDate(timeMs, isEnergyMode));
        //         const row = dataMap[t];
        //         // console.log(t)
        //         if (row) {
        //             energy.push(row[1]);
        //         } else {
        //             energy.push(null);
        //         }
        //     }
        //     // console.log(timestamps)
        //     // console.log(energy)
        // }
        // else{
        for (let t = startTime; t <= endTime; t += 60) {
          const timeMs = t * 1000;
          minuteTimes.push(timeMs);
          timestamps.push(formatDate(timeMs, isEnergyMode));
          const row = dataMap[t];
          if (select.phase === 3) {
            if (row) {
              voltageA.push(row[1]);
              voltageB.push(row[2]);
              voltageC.push(row[3]);
              voltageAvg.push(row[4]);
              currentA.push(row[5]);
              currentB.push(row[6]);
              currentC.push(row[7]);
              currentAvg.push(row[8]);
              powerA.push(row[9]);
              powerB.push(row[10]);
              powerC.push(row[11]);
              powerTotal.push(row[12]);
              temperature.push(row[13]);
            } else {
              voltageA.push(null);
              voltageB.push(null);
              voltageC.push(null);
              voltageAvg.push(null);
              currentA.push(null);
              currentB.push(null);
              currentC.push(null);
              currentAvg.push(null);
              powerA.push(null);
              powerB.push(null);
              powerC.push(null);
              powerTotal.push(null);
              temperature.push(null);
            }
          } else {
            //if (select.phase === '1') {
            if (row) {
              voltageAvg.push(row[1]);
              currentAvg.push(row[2]);
              powerTotal.push(row[3]);
              temperature.push(row[4]);
            } else {
              voltageAvg.push(null);
              currentAvg.push(null);
              powerTotal.push(null);
              temperature.push(null);
            }
          }
          // else if (select.phase === '2') {
          //     // alert(2)
          // }
        }
      }
      // console.log(minuteTimes, voltageA);

      // return false
      // --- Aggregate data hourly ---
      const hourStart = startTime; //Math.floor(data[0][0] / 3600) * 3600;
      const hourEnd = endTime; //Math.floor(data[data.length - 1][0] / 3600) * 3600;
      for (let h = hourStart; h <= hourEnd; h += 3600) {
        // const startMs = h * 1000;
        // const endMs = (h + 3600) * 1000;
        const startMs =
          moment.unix(h).set({ minute: 0, second: 0 }).unix() * 1000;
        const endMs =
          moment.unix(h).set({ minute: 59, second: 59 }).unix() * 1000;
        hourlyLabels.push(formatDate(startMs, isEnergyMode));
        hourlyTimes.push(startMs);
        if (currentType === "ENERGY") {
          const row = dataMap[h];
          minuteTimes.push(startMs);
          if (row) {
            hourlyEnergy.push(row[1]);
          } else {
            hourlyEnergy.push(null);
          }
        } else {
          if (select.phase === 3) {
            hourlyVoltageA.push(
              aggregateData(minuteTimes, voltageA, startMs, endMs)
            );
            hourlyVoltageB.push(
              aggregateData(minuteTimes, voltageB, startMs, endMs)
            );
            hourlyVoltageC.push(
              aggregateData(minuteTimes, voltageC, startMs, endMs)
            );
            hourlyVoltageAvg.push(
              aggregateData(minuteTimes, voltageAvg, startMs, endMs)
            );
            hourlyCurrentA.push(
              aggregateData(minuteTimes, currentA, startMs, endMs)
            );
            hourlyCurrentB.push(
              aggregateData(minuteTimes, currentB, startMs, endMs)
            );
            hourlyCurrentC.push(
              aggregateData(minuteTimes, currentC, startMs, endMs)
            );
            hourlyCurrentAvg.push(
              aggregateData(minuteTimes, currentAvg, startMs, endMs)
            );
            hourlyPowerA.push(
              aggregateData(minuteTimes, powerA, startMs, endMs)
            );
            hourlyPowerB.push(
              aggregateData(minuteTimes, powerB, startMs, endMs)
            );
            hourlyPowerC.push(
              aggregateData(minuteTimes, powerC, startMs, endMs)
            );
            hourlyPowerTotal.push(
              aggregateData(minuteTimes, powerTotal, startMs, endMs)
            );
            hourlyTemperature.push(
              aggregateData(minuteTimes, temperature, startMs, endMs)
            );
          } else {
            hourlyVoltageAvg.push(
              aggregateData(minuteTimes, voltageAvg, startMs, endMs)
            );
            hourlyCurrentAvg.push(
              aggregateData(minuteTimes, currentAvg, startMs, endMs)
            );
            hourlyPowerTotal.push(
              aggregateData(minuteTimes, powerTotal, startMs, endMs)
            );
            hourlyTemperature.push(
              aggregateData(minuteTimes, temperature, startMs, endMs)
            );
          }
        }
      }
      // console.log({'h0':minuteTimes,'h1':hourlyLabels,'h2':hourlyEnergy})

      // --- Aggregate data daily ---
      const dayStart = startTime; // Math.floor(data[0][0] / 86400) * 86400;
      const dayEnd = endTime; // Math.floor(data[data.length - 1][0] / 86400) * 86400;
      for (let d = dayStart; d <= dayEnd; d += 86400) {
        if (currentType === "ENERGY") {
          const startMs = moment.unix(d).startOf("day").unix() * 1000;
          const endMs = moment.unix(d).endOf("day").unix() * 1000; //.set({hour: 23, minute: 59, second: 0 }).unix()//(d + 86400) * 1000;
          dailyLabels.push(
            formatDate(startMs, isEnergyMode).slice(0, 10)
          ); //.push(new Date(startMs).toLocaleDateString() + " 00.00");
          dailyTimes.push(startMs);
          if (currentType === "ENERGY") {
            dailyEnergy.push(
              aggregateData(minuteTimes, hourlyEnergy, startMs, endMs)
            );
            // console.log(formatDate(startMs, isEnergyMode), formatDate(endMs, isEnergyMode), startMs, endMs)
          } else {
            if (select.phase === 3) {
              dailyVoltageA.push(
                aggregateData(minuteTimes, voltageA, startMs, endMs)
              );
              dailyVoltageB.push(
                aggregateData(minuteTimes, voltageB, startMs, endMs)
              );
              dailyVoltageC.push(
                aggregateData(minuteTimes, voltageC, startMs, endMs)
              );
              dailyVoltageAvg.push(
                aggregateData(minuteTimes, voltageAvg, startMs, endMs)
              );
              dailyCurrentA.push(
                aggregateData(minuteTimes, currentA, startMs, endMs)
              );
              dailyCurrentB.push(
                aggregateData(minuteTimes, currentB, startMs, endMs)
              );
              dailyCurrentC.push(
                aggregateData(minuteTimes, currentC, startMs, endMs)
              );
              dailyCurrentAvg.push(
                aggregateData(minuteTimes, currentAvg, startMs, endMs)
              );
              dailyPowerA.push(
                aggregateData(minuteTimes, powerA, startMs, endMs)
              );
              dailyPowerB.push(
                aggregateData(minuteTimes, powerB, startMs, endMs)
              );
              dailyPowerC.push(
                aggregateData(minuteTimes, powerC, startMs, endMs)
              );
              dailyPowerTotal.push(
                aggregateData(minuteTimes, powerTotal, startMs, endMs)
              );
              dailyTemperature.push(
                aggregateData(minuteTimes, temperature, startMs, endMs)
              );
            } else {
              dailyVoltageAvg.push(
                aggregateData(minuteTimes, voltageAvg, startMs, endMs)
              );
              dailyCurrentAvg.push(
                aggregateData(minuteTimes, currentAvg, startMs, endMs)
              );
              dailyPowerTotal.push(
                aggregateData(minuteTimes, powerTotal, startMs, endMs)
              );
              dailyTemperature.push(
                aggregateData(minuteTimes, temperature, startMs, endMs)
              );
            }
          }
        }
        // console.log({'d1':dailyLabels,'d2':dailyEnergy})
        // console.log(dailyEnergy)
        // return false
      }
    }
    dataLog = [];
    dataLog.push({
      timestamps: timestamps,
      minuteTimes: minuteTimes,
      voltageA: voltageA,
      voltageB: voltageB,
      voltageC: voltageC,
      voltageAvg: voltageAvg,
      currentA: currentA,
      currentB: currentB,
      currentC: currentC,
      currentAvg: currentAvg,
      powerA: powerA,
      powerB: powerB,
      powerC: powerC,
      powerTotal: powerTotal,
      energy: energy,
      temperature: temperature,
      hourlyLabels: hourlyLabels,
      hourlyTimes: hourlyTimes,
      hourlyVoltageA: hourlyVoltageA,
      hourlyVoltageB: hourlyVoltageB,
      hourlyVoltageC: hourlyVoltageC,
      hourlyVoltageAvg: hourlyVoltageAvg,
      hourlyCurrentA: hourlyCurrentA,
      hourlyCurrentB: hourlyCurrentB,
      hourlyCurrentC: hourlyCurrentC,
      hourlyCurrentAvg: hourlyCurrentAvg,
      hourlyPowerA: hourlyPowerA,
      hourlyPowerB: hourlyPowerB,
      hourlyPowerC: hourlyPowerC,
      hourlyPowerTotal: hourlyPowerTotal,
      hourlyTemperature: hourlyTemperature,
      hourlyEnergy: hourlyEnergy,
      dailyLabels: dailyLabels,
      dailyTimes: dailyTimes,
      dailyVoltageA: dailyVoltageA,
      dailyVoltageB: dailyVoltageB,
      dailyVoltageC: dailyVoltageC,
      dailyVoltageAvg: dailyVoltageAvg,
      dailyCurrentA: dailyCurrentA,
      dailyCurrentB: dailyCurrentB,
      dailyCurrentC: dailyCurrentC,
      dailyCurrentAvg: dailyCurrentAvg,
      dailyPowerA: dailyPowerA,
      dailyPowerB: dailyPowerB,
      dailyPowerC: dailyPowerC,
      dailyPowerTotal: dailyPowerTotal,
      dailyTemperature: dailyTemperature,
      dailyEnergy: dailyEnergy,
    });
    // console.log(dataLog);
    // console.log(masterData);
    return await dataLog;

    // return false
    // // --- Determine initial aggregation mode based on full range ---
    // const fullRange = minuteTimes[minuteTimes.length - 1] - minuteTimes[0];
    //
    //
    // let currentAggregation;
    // if (fullRange > 30 * 86400000) {
    //     currentAggregation = "daily";
    // } else if (fullRange > 86400000) {
    //     currentAggregation = "hourly";
    // } else {
    //     if (currentType === 'ENERGY') {
    //         currentAggregation = "hourly";
    //     }else{
    //         currentAggregation = "minute";
    //     }
    // }//console.log(currentAggregation);
    // alert(currentAggregation)
    // Pick used data based on the current aggregation.

    // if (currentAggregation === "minute") {
    //     usedLabels     = timestamps;
    //     usedVoltageA   = voltageA;
    //     usedVoltageB   = voltageB;
    //     usedVoltageC   = voltageC;
    //     usedVoltageAvg = voltageAvg;
    //     usedCurrentA   = currentA;
    //     usedCurrentB   = currentB;
    //     usedCurrentC   = currentC;
    //     usedCurrentAvg = currentAvg;
    //     usedPowerA     = powerA;
    //     usedPowerB     = powerB;
    //     usedPowerC     = powerC;
    //     usedPowerTotal = powerTotal;
    //     usedTemperature= temperature;
    // } else if (currentAggregation === "hourly") {
    //     if (currentType === 'ENERGY') {
    //         usedLabels = hourlyLabels;
    //         usedData = hourlyEnergy;
    //     }else{
    //         usedLabels     = hourlyLabels;
    //         usedVoltageA   = hourlyVoltageA;
    //         usedVoltageB   = hourlyVoltageB;
    //         usedVoltageC   = hourlyVoltageC;
    //         usedVoltageAvg = hourlyVoltageAvg;
    //         usedCurrentA   = hourlyCurrentA;
    //         usedCurrentB   = hourlyCurrentB;
    //         usedCurrentC   = hourlyCurrentC;
    //         usedCurrentAvg = hourlyCurrentAvg;
    //         usedPowerA     = hourlyPowerA;
    //         usedPowerB     = hourlyPowerB;
    //         usedPowerC     = hourlyPowerC;
    //         usedPowerTotal = hourlyPowerTotal;
    //         usedTemperature= hourlyTemperature;
    //     }
    // } else if (currentAggregation === "daily") {
    //     if (currentType === 'ENERGY') {
    //         usedLabels = dailyLabels;
    //         usedData = dailyEnergy;
    //     }else{
    //         usedLabels     = dailyLabels;
    //         usedVoltageA   = dailyVoltageA;
    //         usedVoltageB   = dailyVoltageB;
    //         usedVoltageC   = dailyVoltageC;
    //         usedVoltageAvg = dailyVoltageAvg;
    //         usedCurrentA   = dailyCurrentA;
    //         usedCurrentB   = dailyCurrentB;
    //         usedCurrentC   = dailyCurrentC;
    //         usedCurrentAvg = dailyCurrentAvg;
    //         usedPowerA     = dailyPowerA;
    //         usedPowerB     = dailyPowerB;
    //         usedPowerC     = dailyPowerC;
    //         usedPowerTotal = dailyPowerTotal;
    //         usedTemperature= dailyTemperature;
    //     }
    // }
    // return false
    // สร้าง instance สำหรับกราฟหลัก
    // --------------------------------------

    // function mainRenderChart(){
    //     mainChart.clear(); // เคลียร์กราฟก่อน
    //     // let usedLabels = [];
    //     let option = {
    //         tooltip: { trigger: "axis" },
    //         toolbox: { feature: { saveAsImage: {} } },
    //         grid: {
    //             // ปรับพื้นที่แสดงกราฟ
    //             top: '10%',      // ระยะห่างจากด้านบน
    //             bottom: '17%',   // เพิ่มระยะด้านล่างให้ legend
    //             left: '3%',      // ระยะห่างจากด้านซ้าย
    //             right: '4%',     // ระยะห่างจากด้านขวา
    //             containLabel: true  // รวมพื้นที่สำหรับ label ด้วย
    //         },
    //     };

    //     // สำหรับ ENERGY mode จะใช้ข้อมูลแบบ "day" (ชั่วโมง)
    //     if (currentType === "ENERGY") {
    //         // console.log(usedLabels);
    //         // console.log(usedData);
    //         // if(currentTimeFrame === "day") {
    //             usedLabels = hourlyLabels;
    //             usedData = hourlyEnergy;
    //         // } else if(currentTimeFrame === "week") {
    //         //     usedLabels = dailyLabels;
    //         //     usedData = dailyEnergy;
    //         // }
    //         // usedLabels = hourlyLabels;
    //         // หากต้องการคำนวณ Energy จากค่าพลังงาน (powerTotal) อาจคูณด้วยชั่วโมง (1 ชม.) แต่ที่นี่ใช้ค่าโดยตรง
    //         option = Object.assign(option, {
    //             title: { text: "Energy", left: "left" },
    //             xAxis: { type: "category", data: usedLabels },
    //             yAxis: { type: "value", scale: true },
    //             series: [{
    //                 name: "Energy",
    //                 type: "bar",
    //                 data: usedData,
    //                 itemStyle: { color: "#f39c12" }
    //             }],
    //             dataZoom: [
    //                 { type: "slider", start: 0, end: 100 },
    //                 { type: "inside", start: 0, end: 100 }
    //             ]
    //         });
    //     }
    //     // สำหรับ VOLTAGE, CURRENT, POWER, TEMPERATURE ให้เลือก aggregation ตาม currentTimeFrame:
    //     else {
    //         // if(currentTimeFrame === "realtime" || currentTimeFrame === "day") {
    //             usedLabels     = timestamps;
    //             usedVoltageA   = voltageA;
    //             usedVoltageB   = voltageB;
    //             usedVoltageC   = voltageC;
    //             usedVoltageAvg = voltageAvg;
    //             usedCurrentA   = currentA;
    //             usedCurrentB   = currentB;
    //             usedCurrentC   = currentC;
    //             usedCurrentAvg = currentAvg;
    //             usedPowerA     = powerA;
    //             usedPowerB     = powerB;
    //             usedPowerC     = powerC;
    //             usedPowerTotal = powerTotal;
    //             usedTemperature= temperature;
    //         // // } else if(currentTimeFrame === "day") {
    //         // // usedLabels = hourlyLabels;
    //         // } else { // if(currentTimeFrame === "week")
    //         //     usedLabels     = hourlyLabels;
    //         //     usedVoltageA   = hourlyVoltageA;
    //         //     usedVoltageB   = hourlyVoltageB;
    //         //     usedVoltageC   = hourlyVoltageC;
    //         //     usedVoltageAvg = hourlyVoltageAvg;
    //         //     usedCurrentA   = hourlyCurrentA;
    //         //     usedCurrentB   = hourlyCurrentB;
    //         //     usedCurrentC   = hourlyCurrentC;
    //         //     usedCurrentAvg = hourlyCurrentAvg;
    //         //     usedPowerA     = hourlyPowerA;
    //         //     usedPowerB     = hourlyPowerB;
    //         //     usedPowerC     = hourlyPowerC;
    //         //     usedPowerTotal = hourlyPowerTotal;
    //         //     usedTemperature= hourlyTemperature;
    //         // }

    //         // ตั้งค่าการตอบสนองต่อขนาดหน้าจอ
    //         option.media = [
    //             {
    //                 query: {
    //                     maxWidth: 768
    //                 },
    //                 option: {
    //                     legend: {
    //                         padding: [60, 10],
    //                         itemGap: 10,
    //                         itemWidth: 25
    //                     },
    //                     grid: {
    //                         bottom: '30%' // เพิ่มพื้นที่ด้านล่างสำหรับจอมือถือ
    //                     }
    //                 }
    //             }
    //         ];
    //         // เตรียม options ตามประเภทข้อมูล
    //         if(currentType === "VOLTAGE") {
    //             option.title = { text: "Voltage", left: "left" };
    //             option.legend= {
    //                 data: ["Voltage A", "Voltage B", "Voltage C", "Voltage Avg"],
    //                 // orient: 'horizontal',
    //                 left: 'center',
    //                 top: 'bottom',
    //                 padding: [50, 0],
    //                 // bottom: 0, // วาง legend ไว้ด้านล่าง
    //                 // type: 'scroll', // เพิ่ม scroll สำหรับ legend ยาว
    //                 // orient: 'horizontal',
    //                 // textStyle: {
    //                 //     fontSize: 12
    //                 // },
    //             };
    //             option.xAxis = { type: "category", data: usedLabels };
    //             option.yAxis = { type: "value", scale: true };
    //             option.series = [
    //                 { name: "Voltage A", type: "line", data: usedVoltageA, itemStyle: { color: getRandomColor() } },
    //                 { name: "Voltage B", type: "line", data: usedVoltageB, itemStyle: { color: getRandomColor() } },
    //                 { name: "Voltage C", type: "line", data: usedVoltageC, itemStyle: { color: getRandomColor() } },
    //                 { name: "Voltage Avg", type: "line", data: usedVoltageAvg, itemStyle: { color: getRandomColor() } }
    //             ];
    //         }
    //         else if (currentType === "CURRENT") {
    //             option.title = { text: "Current", left: "left" };
    //             option.legend= { data: ["Current A", "Current B", "Current C", "Current Avg"]};
    //             option.xAxis = { type: "category", data: usedLabels };
    //             option.yAxis = { type: "value", scale: true };
    //             option.series = [
    //                 { name: "Current A", type: "line", data: usedCurrentA, itemStyle: { color: getRandomColor() } },
    //                 { name: "Current B", type: "line", data: usedCurrentB, itemStyle: { color: getRandomColor() } },
    //                 { name: "Current C", type: "line", data: usedCurrentC, itemStyle: { color: getRandomColor() } },
    //                 { name: "Current Avg", type: "line", data: usedCurrentAvg, itemStyle: { color: getRandomColor() } }
    //             ];
    //         }
    //         else if (currentType === "POWER") {
    //             option.title = { text: "Power", left: "left" };
    //             option.legend= { data: ["Power A", "Power B", "Power C", "Power Total"] };
    //             option.xAxis = { type: "category", data: usedLabels };
    //             option.yAxis = { type: "value", scale: true };
    //             option.series = [
    //                 { name: "Power A", type: "line", data: usedPowerA, itemStyle: { color: getRandomColor() } },
    //                 { name: "Power B", type: "line", data: usedPowerB, itemStyle: { color: getRandomColor() } },
    //                 { name: "Power C", type: "line", data: usedPowerC, itemStyle: { color: getRandomColor() } },
    //                 { name: "Power Total", type: "line", data: usedPowerTotal, itemStyle: { color: getRandomColor() } }
    //             ];
    //         }
    //         else if (currentType === "TEMPERATURE") {
    //             option.title = { text: "Temperature", left: "left" };
    //             option.xAxis = { type: "category", data: usedLabels };
    //             option.yAxis = { type: "value", scale: true };
    //             option.series = [
    //                 { name: "Temperature", type: "line", data: usedTemperature, itemStyle: { color: getRandomColor() } }
    //             ];
    //         }
    //         option.dataZoom = [
    //             { type: "slider", start: 0, end: 100 },
    //             { type: "inside", start: 0, end: 100 }
    //         ];
    //     }
    //     mainChart.setOption(option, { notMerge: true });
    // }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
// ฟังก์ชันสำหรับแปลง timestamp เป็นรูปแบบวันที่ตามเงื่อนไข
function formatDate(timestamp, isEnergy) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getHours().toString().padStart(2, "0");
  if (isEnergy) {
    // Format "YYYY/MM/dd HH"
    return `${year}/${month}/${day} ${hour}:00`;
  } else {
    const minute = date.getMinutes().toString().padStart(2, "0");
    // Format "YYYY/MM/dd HH:mm"
    return `${year}/${month}/${day} ${hour}:${minute}`;
  }
}
// --- Aggregation helper: average function (rounded to 2 decimals) ---
function aggregateData(minuteTimes, series, startMs, endMs) {
  let sum = 0,
    count = 0;
  for (let i = 0; i < minuteTimes.length; i++) {
    if (minuteTimes[i] >= startMs && minuteTimes[i] < endMs) {
      const val = series[i];
      if (val !== null) {
        sum += val;
        count++;
      }
    }
  }
  return count > 0 ? Math.round((sum / count) * 100) / 100 : null;
}
// Utility: generate a random hex color.
function getRandomColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}
function updateMainChart(dataLog) {
  // showLoading();
  // console.log(window.mainChart);
  window.mainChart = null;
  if (!window.mainChart) {
    window.mainChart = echarts.init(document.getElementById("chart"));
    window.addEventListener("resize", () => {
      window.mainChart.resize();
    });
  }
  const mainChart = window.mainChart;
  // สร้าง instance ของกราฟแบบ global หากยังไม่มี
  if (dataLog[0].minuteTimes.length === 0) {
    showEmptyChart();
    // console.log(dataLog[0].minuteTimes.length);
    // hideLoading();
    return;
  }
  // ดึงข้อมูลจาก dataLog
  let {
    timestamps,
    minuteTimes,
    voltageA,
    voltageB,
    voltageC,
    voltageAvg,
    currentA,
    currentB,
    currentC,
    currentAvg,
    powerA,
    powerB,
    powerC,
    powerTotal,
    energy,
    temperature,
    hourlyLabels,
    hourlyTimes,
    hourlyVoltageA,
    hourlyVoltageB,
    hourlyVoltageC,
    hourlyVoltageAvg,
    hourlyCurrentA,
    hourlyCurrentB,
    hourlyCurrentC,
    hourlyCurrentAvg,
    hourlyPowerA,
    hourlyPowerB,
    hourlyPowerC,
    hourlyPowerTotal,
    hourlyTemperature,
    hourlyEnergy,
    dailyLabels,
    dailyTimes,
    dailyVoltageA,
    dailyVoltageB,
    dailyVoltageC,
    dailyVoltageAvg,
    dailyCurrentA,
    dailyCurrentB,
    dailyCurrentC,
    dailyCurrentAvg,
    dailyPowerA,
    dailyPowerB,
    dailyPowerC,
    dailyPowerTotal,
    dailyTemperature,
    dailyEnergy,
  } = dataLog[0];

  // กำหนดสีข้อความตาม theme
  let textColor = theme === "dark-theme" ? "#ffffff" : "#000000";

  // สร้าง option เริ่มต้น
  let option = {
    tooltip: {
      trigger: "axis",
      textStyle: { color: "#000000" },
    },
    toolbox: {
      // feature: { saveAsImage: {} }
      feature: {
        saveAsImage: {
          backgroundColor: theme === "dark-theme" ? "#0e0747" : "#ffffff", // พื้นหลังตาม theme
          textColor: theme === "dark-theme" ? "#ffffff" : "#000000", // ข้อความตาม theme
          name: "chart_export",
          pixelRatio: 2,
        },
        // saveAsImage: {
        //     backgroundColor: '#ffffff',  // พื้นหลังสีขาว
        //     textColor: '#000000',        // ข้อความสีดำ
        //     name: 'chart_export',
        //     pixelRatio: 2,
        //     title: 'Save as Image',
        //     // ใช้ callback function ก่อนบันทึก
        //     onclick: function () {
        //         // ดึง option ปัจจุบัน
        //         const currentOption = mainChart.getOption();
        //
        //         // ซ่อน dataZoom ชั่วคราว
        //         const tempOption = JSON.parse(JSON.stringify(currentOption)); // Clone option
        //         tempOption.dataZoom = []; // ลบ dataZoom ออกจาก option
        //
        //         // ตั้งค่า option ใหม่ (ซ่อน dataZoom)
        //         mainChart.setOption(tempOption);
        //
        //         // บันทึกรูปภาพ
        //         mainChart.saveAsImage();
        //
        //         // คืนค่า option เดิม (แสดง dataZoom กลับมา)
        //         mainChart.setOption(currentOption);
        //     }
        // }
      },
    },
    grid: {
      top: "10%",
      bottom: "17%",
      left: "3%",
      right: "4%",
      containLabel: true,
    },
    textStyle: {
      color: textColor,
    },
  };

  let usedLabels,
    usedData,
    usedVoltageA,
    usedVoltageB,
    usedVoltageC,
    usedVoltageAvg,
    usedCurrentA,
    usedCurrentB,
    usedCurrentC,
    usedCurrentAvg,
    usedPowerA,
    usedPowerB,
    usedPowerC,
    usedPowerTotal,
    usedTemperature;

  if (currentType === "ENERGY") {
    usedLabels = hourlyLabels;
    // console.log(usedLabels);
    usedData = hourlyEnergy;
    option = Object.assign(option, {
      title: {
        text: "Energy",
        left: "left",
        textStyle: { color: textColor },
      },
      xAxis: {
        type: "category",
        data: usedLabels,
        axisLabel: { color: textColor },
      },
      yAxis: {
        type: "value",
        scale: true,
        axisLabel: { color: textColor },
      },
      series: [
        {
          name: "Energy",
          type: "bar",
          data: usedData,
          itemStyle: { color: "#f39c12" },
        },
      ],
      dataZoom: [
        { type: "slider", start: 0, end: 100 },
        { type: "inside", start: 0, end: 100 },
      ],
    });
  } else {
    // สำหรับตัวกราฟ VOLTAGE, CURRENT, POWER, TEMPERATURE
    usedLabels = timestamps;
    usedVoltageA = voltageA;
    usedVoltageB = voltageB;
    usedVoltageC = voltageC;
    usedVoltageAvg = voltageAvg;
    usedCurrentA = currentA;
    usedCurrentB = currentB;
    usedCurrentC = currentC;
    usedCurrentAvg = currentAvg;
    usedPowerA = powerA;
    usedPowerB = powerB;
    usedPowerC = powerC;
    usedPowerTotal = powerTotal;
    usedTemperature = temperature;

    option.media = [
      {
        query: { maxWidth: 768 },
        option: {
          legend: {
            padding: [60, 10],
            itemGap: 10,
            itemWidth: 25,
            textStyle: { color: textColor },
          },
          grid: { bottom: "30%" },
        },
      },
    ];

    if (currentType === "VOLTAGE") {
      option.title = {
        text: "Voltage",
        left: "left",
        textStyle: { color: textColor },
      };
      option.legend = {
        data: ["Voltage A", "Voltage B", "Voltage C", "Voltage Avg"],
        left: "center",
        top: "bottom",
        padding: [50, 0],
        textStyle: { color: textColor },
      };
      option.xAxis = {
        type: "category",
        data: usedLabels,
        axisLabel: { color: textColor },
      };
      option.yAxis = {
        type: "value",
        scale: true,
        axisLabel: { color: textColor },
      };
      if (select.phase === 3) {
        option.series = [
          {
            name: "Voltage A",
            type: "line",
            data: usedVoltageA,
            itemStyle: { color: getRandomColor() },
          },
          {
            name: "Voltage B",
            type: "line",
            data: usedVoltageB,
            itemStyle: { color: getRandomColor() },
          },
          {
            name: "Voltage C",
            type: "line",
            data: usedVoltageC,
            itemStyle: { color: getRandomColor() },
          },
          {
            name: "Voltage Avg",
            type: "line",
            data: usedVoltageAvg,
            itemStyle: { color: getRandomColor() },
          },
        ];
      } else {
        option.series = [
          {
            name: "Voltage",
            type: "line",
            data: usedVoltageAvg,
            itemStyle: { color: getRandomColor() },
          },
        ];
      }
    } else if (currentType === "CURRENT") {
      option.title = {
        text: "Current",
        left: "left",
        textStyle: { color: textColor },
      };
      option.legend = {
        data: ["Current A", "Current B", "Current C", "Current Avg"],
        textStyle: { color: textColor },
      };
      option.xAxis = {
        type: "category",
        data: usedLabels,
        axisLabel: { color: textColor },
      };
      option.yAxis = {
        type: "value",
        scale: true,
        axisLabel: { color: textColor },
      };
      if (select.phase === 3) {
        option.series = [
          {
            name: "Current A",
            type: "line",
            data: usedCurrentA,
            itemStyle: { color: getRandomColor() },
          },
          {
            name: "Current B",
            type: "line",
            data: usedCurrentB,
            itemStyle: { color: getRandomColor() },
          },
          {
            name: "Current C",
            type: "line",
            data: usedCurrentC,
            itemStyle: { color: getRandomColor() },
          },
          {
            name: "Current Avg",
            type: "line",
            data: usedCurrentAvg,
            itemStyle: { color: getRandomColor() },
          },
        ];
      } else {
        option.series = [
          {
            name: "Current",
            type: "line",
            data: usedCurrentAvg,
            itemStyle: { color: getRandomColor() },
          },
        ];
      }
    } else if (currentType === "POWER") {
      option.title = {
        text: "Power",
        left: "left",
        textStyle: { color: textColor },
      };
      option.legend = {
        data: ["Power A", "Power B", "Power C", "Power Total"],
        textStyle: { color: textColor },
      };
      option.xAxis = {
        type: "category",
        data: usedLabels,
        axisLabel: { color: textColor },
      };
      option.yAxis = {
        type: "value",
        scale: true,
        axisLabel: { color: textColor },
      };
      if (select.phase === 3) {
        option.series = [
          {
            name: "Power A",
            type: "line",
            data: usedPowerA,
            itemStyle: { color: getRandomColor() },
          },
          {
            name: "Power B",
            type: "line",
            data: usedPowerB,
            itemStyle: { color: getRandomColor() },
          },
          {
            name: "Power C",
            type: "line",
            data: usedPowerC,
            itemStyle: { color: getRandomColor() },
          },
          {
            name: "Power Total",
            type: "line",
            data: usedPowerTotal,
            itemStyle: { color: getRandomColor() },
          },
        ];
      } else {
        option.series = [
          {
            name: "Power",
            type: "line",
            data: usedPowerTotal,
            itemStyle: { color: getRandomColor() },
          },
        ];
      }
    } else if (currentType === "TEMPERATURE") {
      option.title = {
        text: "Temperature",
        left: "left",
        textStyle: { color: textColor },
      };
      option.xAxis = {
        type: "category",
        data: usedLabels,
        axisLabel: { color: textColor },
      };
      option.yAxis = {
        type: "value",
        scale: true,
        axisLabel: { color: textColor },
      };
      option.series = [
        {
          name: "Temperature",
          type: "line",
          data: usedTemperature,
          itemStyle: { color: getRandomColor() },
        },
      ];
    }
    option.dataZoom = [
      { type: "slider", start: 0, end: 100 },
      { type: "inside", start: 0, end: 100 },
    ];
  }

  // ประกาศ option ให้กับกราฟ (ใช้ notMerge: true ในครั้งแรก)
  mainChart.setOption(option, { notMerge: true });
  mainChart.on("rendered", function () {
    // hideLoading();
  });
  // ส่วน realtime update (เฉพาะกรณีที่ปุ่ม realtime active)
  if ($('.btn-custom[data-time="realtime"]').hasClass("active")) {
    // เคลียร์ interval เก่า (ถ้ามี)
    if (realtimeInterChart) {
      clearInterval(realtimeInterChart);
    }
    // ตั้งค่า interval ใหม่
    realtimeInterChart = setInterval(function () {
      console.log(realtimeInterChart);
      if (dataLog[0].minuteTimes.length === 0) {
        showEmptyChart();
        // console.log(dataLog[0].minuteTimes.length);
        // hideLoading();
        return;
      }
      if (currentType === "VOLTAGE") {
        // console.log("Realtime update timestamps:", dataLog[0].timestamps);
        if (select.phase === 3) {
          // Merge การอัพเดทข้อมูลเข้ากับ option เดิม (notMerge:false)
          mainChart.setOption(
            {
              xAxis: {
                data: dataLog[0].timestamps,
              },
              series: [
                { data: dataLog[0].voltageA },
                { data: dataLog[0].voltageB },
                { data: dataLog[0].voltageC },
                { data: dataLog[0].voltageAvg },
              ],
            },
            false
          );
        } else {
          mainChart.setOption(
            {
              xAxis: {
                data: dataLog[0].timestamps,
              },
              series: [{ data: dataLog[0].voltageAvg }],
            },
            false
          );
        }
      } else if (currentType === "CURRENT") {
        console.log("Realtime update timestamps:", dataLog[0].timestamps);
        if (select.phase === 3) {
          // Merge การอัพเดทข้อมูลเข้ากับ option เดิม (notMerge:false)
          mainChart.setOption(
            {
              xAxis: {
                data: dataLog[0].timestamps,
              },
              series: [
                { data: dataLog[0].currentA },
                { data: dataLog[0].currentB },
                { data: dataLog[0].currentC },
                { data: dataLog[0].currentAvg },
              ],
            },
            false
          );
        } else {
          mainChart.setOption(
            {
              xAxis: {
                data: dataLog[0].timestamps,
              },
              series: [{ data: dataLog[0].currentAvg }],
            },
            false
          );
        }
      } else if (currentType === "POWER") {
        console.log("Realtime update timestamps:", dataLog[0].timestamps);
        if (select.phase === 3) {
          // Merge การอัพเดทข้อมูลเข้ากับ option เดิม (notMerge:false)
          mainChart.setOption(
            {
              xAxis: {
                data: dataLog[0].timestamps,
              },
              series: [
                { data: dataLog[0].powerA },
                { data: dataLog[0].powerB },
                { data: dataLog[0].powerC },
                { data: dataLog[0].powerTotal },
              ],
            },
            false
          );
        } else {
          mainChart.setOption(
            {
              xAxis: {
                data: dataLog[0].timestamps,
              },
              series: [{ data: dataLog[0].powerTotal }],
            },
            false
          );
        }
      } else if (currentType === "TEMPERATURE") {
        console.log("Realtime update timestamps:", dataLog[0].timestamps);
        // Merge การอัพเดทข้อมูลเข้ากับ option เดิม (notMerge:false)
        mainChart.setOption(
          {
            xAxis: {
              data: dataLog[0].timestamps,
            },
            series: [{ data: dataLog[0].temperature }],
          },
          false
        );
      }
    }, 30000);
  }
}
function showEmptyChart() {
  if (!window.mainChart) {
    window.mainChart = echarts.init(document.getElementById("chart"));
    window.addEventListener("resize", () => {
      window.mainChart.resize();
    });
  }
  const mainChart = window.mainChart;
  // const mainChart = echarts.init(document.getElementById("chart"));
  const textColor = theme === "dark-theme" ? "#ffffff" : "#000000";
  mainChart.clear();
  mainChart.setOption({
    title: {
      text: currentType,
      left: "left",
      textStyle: { color: textColor },
    },
    tooltip: {
      show: false, // ซ่อน tooltip เมื่อไม่มีข้อมูล
    },
    graphic: [
      {
        type: "text",
        left: "center",
        top: "middle",
        style: {
          text: "ไม่มีข้อมูล",
          fontSize: 24,
          fontWeight: "bold",
          fill: textColor,
        },
      },
    ],
  });
}
// end chart ---------------------