window.Apex = {
    chart: {
        foreColor: '#fff',
        toolbar: {
            show: false
        },
    },
    colors: ['#FCCF31', '#17ead9', '#f02fc2'],
    stroke: {
        width: 3
    },
    dataLabels: {
        enabled: false
    },
    grid: {
        borderColor: "#40475D",
    },
    xaxis: {
        axisTicks: {
            color: '#333'
        },
        axisBorder: {
            color: "#333"
        }
    },
    fill: {
        type: 'gradient',
        gradient: {
            gradientToColors: ['#F55555', '#6078ea', '#6094ea']
        },
    },
    tooltip: {
        theme: 'dark',
        x: {
            formatter: function(val) {
                return moment(new Date(val)).format("HH:mm")
            }
        }
    },
    yaxis: {
        decimalsInFloat: 1,
        opposite: false,
        labels: {
            offsetX: -5
        }
    }
};

var trigoStrength = 3
var iteration = 11

function getRandom() {
    var i = iteration;
    return (Math.sin(i / trigoStrength) * (i / trigoStrength) + i / trigoStrength + 1) * (trigoStrength * 2)
}

function getRangeRandom(yrange) {
    return Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
}

function generateMinuteWiseTimeSeries(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
        var x = baseval;
        var y = ((Math.sin(i / trigoStrength) * (i / trigoStrength) + i / trigoStrength + 1) * (trigoStrength * 2))

        series.push([x, y]);
        baseval += 300000;
        i++;
    }
    return series;
}



function getNewData(baseval, yrange) {
    var newTime = baseval + 300000;
    return {
        x: newTime,
        y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
    }
}

var optionsColumn = {
    chart: {
        height: 350,
        type: 'bar',
        animations: {
            enabled: false
        },
        events: {
            animationEnd: function(chartCtx, opts) {
                const newData = chartCtx.w.config.series[0].data.slice()
                newData.shift()
                window.setTimeout(function() {
                    chartCtx.updateOptions({
                        series: [{
                            data: newData
                        }],
                        xaxis: {
                            min: chartCtx.minX,
                            max: chartCtx.maxX
                        },
                        subtitle: {
                            text: parseInt(getRangeRandom({ min: 1, max: 20 })).toString() + '%',
                        }
                    }, false, false)
                }, 300)
            }
        },
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: 0,
    },
    series: [{
        name: 'Load Average',
        data: generateMinuteWiseTimeSeries(new Date("12/12/2016 00:20:00").getTime(), 12, {
            min: 10,
            max: 110
        })
    }],
    // title: {
    //     text: 'Load Average',
    //     align: 'left',
    //     style: {
    //         fontSize: '12px'
    //     }
    // },
    subtitle: {
        text: '(KWh)',
        floating: true,
        align: 'left',
        offsetY: 0,
        style: {
            fontSize: '15px'
        }
    },
    fill: {
        type: 'gradient',
        gradient: {
            shade: 'dark',
            type: 'vertical',
            shadeIntensity: 0.5,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 0.8,
            stops: [0, 100]
        }
    },
    xaxis: {
        type: 'datetime',
        range: 2700000,
        labels: {
            hideOverlappingLabels: true,
            style: { cssClass: "line-chart-xaxis", fontSize: "14px" },
        },

    },
    yaxis: {

        labels: {
            hideOverlappingLabels: true,
            style: { cssClass: "line-chart-yaxis", fontSize: "15px" },
            offsetY: 5,
        },
    },
    legend: {
        show: true
    },
}



var chartColumn = new ApexCharts(
    document.querySelector("#columnchart"),
    optionsColumn
);
chartColumn.render()


// window.setInterval(function() {
//
//     iteration++;
//
//     chartColumn.updateSeries([{
//         data: [...chartColumn.w.config.series[0].data, [
//             chartColumn.w.globals.maxX + 300000,
//             getRandom()
//         ]]
//     }])
//
//
//
//
// }, 10000);
