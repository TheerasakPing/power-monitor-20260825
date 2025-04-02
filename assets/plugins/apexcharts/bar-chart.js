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
                return moment(new Date(val)).format("HH:mm:ss")
            }
        }
    },
    yaxis: {
        decimalsInFloat: 2,
        opposite: false,
        labels: {
            offsetX: -10
        },
    }
};
var options = {
    series: [{
        name: 'Net Profit',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    }, ],
    chart: {
        height: 350,
        type: 'bar',
        animations: {
            enabled: true
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

    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    },

    subtitle: {
        text: '(V)',
        floating: true,
        align: 'left',
        offsetY: 0,
        style: {
            fontSize: '12px'
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

};

var chart = new ApexCharts(document.querySelector("#bar-chart"), options);
chart.render();