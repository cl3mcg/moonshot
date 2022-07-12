// Declaration of page variables

const axiosBtn_preadvise = document.querySelector('#axiosBtn_preadvise');

// Declaration of variables

const thisYear = new Date().getFullYear();

// Declaration of reused function

const addData = function (chart, data, datasetIndex) {
    chart.data.datasets[datasetIndex].data.push(data)
    chart.update();
}

const removeData = function (chart) {
    // chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

const removeAllData = function (chart) {
    // chart.data.labels = [];
    chart.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });
    chart.update();
}

const pushMonthlyData = function (object, destinationArray) {
    for (let i = 0; i < 12; i++) {
        if (!object[i]) {
            destinationArray.push(0);
        } else {
            destinationArray.push(object[i]);
        }
    }
}

// Declaration of Monthly labels

    let labelsMonths = [
        `Jan-${thisYear}`,
        `Feb-${thisYear}`,
        `Mar-${thisYear}`,
        `Apr-${thisYear}`,
        `May-${thisYear}`,
        `Jun-${thisYear}`,
        `Jul-${thisYear}`,
        `Aug-${thisYear}`,
        `Sep-${thisYear}`,
        `Oct-${thisYear}`,
        `Nov-${thisYear}`,
        `Dec-${thisYear}`
    ];

// Declaration for the chart of the number of records by month based on the recordDate

    let dataPreadviseNum = {
    labels: labelsMonths,
    datasets: [
        {
            label: 'Pre-advise recorded',
            backgroundColor: 'rgba(141, 151, 151, 0.2)',
            borderColor: 'rgba(141, 151, 151, 1)',
            borderWidth: 1,
            data: [],
        },
        {
            label: 'Registrations recorded',
            backgroundColor: 'rgba(141, 151, 151, 0.5)',
            borderColor: 'rgba(141, 151, 151, 1)',
            borderWidth: 1,
            data: [],
        }
    ]
    };

    let configPreadviseNum = {
        type: 'bar',
        data: dataPreadviseNum,
        options: {
            responsive: true,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 20
                }
            }
        }
    };

    let chartPreadviseNum = new Chart(
        document.getElementById('chartOpportunitiesNum'),
        configPreadviseNum
    );

// Declaration for the chart of the number of records per tender desk

let dataTenderDeskNum = {
    labels: labelsMonths,
    datasets: [
        {
            label: 'Americas',
            backgroundColor: 'rgba(28, 63, 96, 0.2)',
            borderColor: 'rgba(28, 63, 96, 1)',
            borderWidth: 1,
            data: [],
        },
        {
            label: 'Asia-Pacific',
            backgroundColor: 'rgba(28, 63, 96, 0.4)',
            borderColor: 'rgba(28, 63, 96, 1)',
            borderWidth: 1,
            data: [],
        },
        {
            label: 'Europe & RoW',
            backgroundColor: 'rgba(28, 63, 96, 0.6)',
            borderColor: 'rgba(28, 63, 96, 1)',
            borderWidth: 1,
            data: [],
        }
    ]
    };

let configTenderDeskNum = {
    type: 'bar',
    data: dataTenderDeskNum,
    options: {
        responsive: true,
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                max: 16
            }
        }
    }
};

let chartTenderDeskNum = new Chart(
    document.getElementById('chartTenderDeskNum'),
    configTenderDeskNum
);

// Declaration for the chart of the number of records per transport mode

let dataChartModeNum = {
    labels: labelsMonths,
    datasets: [
        {
            label: 'Airfreight',
            backgroundColor: 'rgba(28, 63, 96, 0.2)',
            borderColor: 'rgba(28, 63, 96, 1)',
            borderWidth: 1,
            data: [],
        },
        {
            label: 'Seafreight FCL',
            backgroundColor: 'rgba(28, 63, 96, 0.4)',
            borderColor: 'rgba(28, 63, 96, 1)',
            borderWidth: 1,
            data: [],
        },
        {
            label: 'Seafreight LCL',
            backgroundColor: 'rgba(28, 63, 96, 0.6)',
            borderColor: 'rgba(28, 63, 96, 1)',
            borderWidth: 1,
            data: [],
        },
        {
            label: 'Railfreight FCL',
            backgroundColor: 'rgba(28, 63, 96, 0.6)',
            borderColor: 'rgba(28, 63, 96, 1)',
            borderWidth: 1,
            data: [],
        }
    ]
    };

let configChartModeNum = {
    type: 'bar',
    data: dataChartModeNum,
    options: {
        responsive: true,
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                max: 16
            }
        },
        plugins:{
            legend: {
             display: false
            }
        }
    }
};

let chartChartModeNum = new Chart(
    document.getElementById('chartModeNum'),
    configChartModeNum
);

// Declaration for the chart of registered opportunities per country

let dataChartCountryLaunch = {
    labels: [],
    datasets: [
        {
            label: 'Tender launched',
            backgroundColor: 'rgba(28, 63, 96, 0.2)',
            borderColor: 'rgba(28, 63, 96, 1)',
            borderWidth: 1,
            data: [],
        },
    ]
    };

let configChartCountryLaunch = {
    type: 'bar',
    data: dataChartCountryLaunch,
    options: {
        responsive: true,
        indexAxis: 'y',
        scales: {
            x: {
                grid: {
                    display: false
                },
                max: 16
            },
            y: {
                beginAtZero: true
            }
        },
        plugins:{
            legend: {
                display: false
            }
        }
    }
};

let chartCountryLaunch = new Chart(
    document.getElementById('chartCountryLaunch'),
    configChartCountryLaunch
);

// Declaration for the chart of the evolution of AIRFREIGHT volumes

let dataChartAirfreightVolumeEvol = {
    labels: labelsMonths,
    datasets: [
        {
            label: 'Airfreight',
            fill: false,
            borderColor: 'rgba(60, 145, 230, 1)',
            tension: 0.05,
            data: [],
        }
    ]
    };

let configChartAirfreightVolumeEvol = {
    type: 'line',
    data: dataChartAirfreightVolumeEvol,
    options: {
        responsive: true,
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
            }
        },
        plugins:{
            legend: {
             display: false
            }
        }
    }
};

let chartAirfreightVolumeEvol = new Chart(
    document.getElementById('chartModeVolumeEvolAirfreight'),
    configChartAirfreightVolumeEvol
);

// Declaration for the chart of the evolution of SEAFREIGHT FCL volumes

let dataChartSeafreightFCLVolumeEvol = {
    labels: labelsMonths,
    datasets: [
        {
            label: 'Seafreight FCL',
            fill: false,
            borderColor: 'rgba(60, 145, 230, 1)',
            tension: 0.05,
            data: [],
        }
    ]
    };

let configChartSeafreightFCLVolumeEvol = {
    type: 'line',
    data: dataChartSeafreightFCLVolumeEvol,
    options: {
        responsive: true,
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
            }
        },
        plugins:{
            legend: {
             display: false
            }
        }
    }
};

let chartChartSeafreightFCLVolumeEvol = new Chart(
    document.getElementById('chartModeVolumeEvolSeafreightFCL'),
    configChartSeafreightFCLVolumeEvol
);

// Declaration for the chart of the evolution of SEAFREIGHT LCL volumes

let dataChartSeafreightLCLVolumeEvol = {
    labels: labelsMonths,
    datasets: [
        {
            label: 'Seafreight LCL',
            fill: false,
            borderColor: 'rgba(60, 145, 230, 1)',
            tension: 0.05,
            data: [],
        }
    ]
    };

let configChartSeafreightLCLVolumeEvol = {
    type: 'line',
    data: dataChartSeafreightLCLVolumeEvol,
    options: {
        responsive: true,
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
            }
        },
        plugins:{
            legend: {
             display: false
            }
        }
    }
};

let chartChartSeafreightLCLVolumeEvol = new Chart(
    document.getElementById('chartModeVolumeEvolSeafreightLCL'),
    configChartSeafreightLCLVolumeEvol
);

// Declaration for the chart of the evolution of RAILFREIGHT FCL volumes

let dataChartRailfreightFCLVolumeEvol = {
    labels: labelsMonths,
    datasets: [
        {
            label: 'Railfreight FCL',
            fill: false,
            borderColor: 'rgba(60, 145, 230, 1)',
            tension: 0.05,
            data: [],
        }
    ]
    };

let configChartRailfreightFCLVolumeEvol = {
    type: 'line',
    data: dataChartRailfreightFCLVolumeEvol,
    options: {
        responsive: true,
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
            }
        },
        plugins:{
            legend: {
             display: false
            }
        }
    }
};

let chartChartRailfreightFCLVolumeEvol = new Chart(
    document.getElementById('chartModeVolumeEvolRailfreightFCL'),
    configChartRailfreightFCLVolumeEvol
);

// Declaration for the chart initialization function onload

window.addEventListener('load', () => {
// Axios function to get the number of preadvise and registration records per month
    axios
    .post("/api/numRecords")
    .then(function (response) {
        let results = response.data;
        if(results.preadvise[2022]) {
            let newData = []
            pushMonthlyData(results.preadvise[2022], newData);
            for(let i = 0; i < newData.length; i++) {	
                addData(chartPreadviseNum, newData[i], 0);
            }
        }
        if(results.register[2022]) {
            let newData = []
            pushMonthlyData(results.register[2022], newData);
            for(let i = 0; i < newData.length; i++) {	
                addData(chartPreadviseNum, newData[i], 1);
            }
        }
    })
    .catch(function (error) {
        console.log(error);
    })

// Axios function to get the number of tender launch per month
    axios
    .post("/api/numTenderDesk")
    .then(function (response) {
        let results = response.data;
        if(results.AM[2022]) {
            let newData = []
            pushMonthlyData(results.AM[2022], newData);
            for(let i = 0; i < newData.length; i++) {	
                addData(chartTenderDeskNum, newData[i], 0);
            }
        }
        if(results.AP[2022]) {
            let newData = []
            pushMonthlyData(results.AP[2022], newData);
            for(let i = 0; i < newData.length; i++) {	
                addData(chartTenderDeskNum, newData[i], 1);
            }
        }
        if(results.EU[2022]) {
            let newData = []
            pushMonthlyData(results.EU[2022], newData);
            for(let i = 0; i < newData.length; i++) {	
                addData(chartTenderDeskNum, newData[i], 2);
            }
        }
    })
    .catch(function (error) {
        console.log(error);
    })

// Axios function to get the number of tender launch per transportation mode per month
    axios
    .post("/api/numMode")
    .then(function (response) {
        let results = response.data;
        if(results.airfreight[2022]) {
            let newData = []
            pushMonthlyData(results.airfreight[2022], newData);
            for(let i = 0; i < newData.length; i++) {	
                addData(chartChartModeNum, newData[i], 0);
            }
        }
        if(results.seafreightFCL[2022]) {
            let newData = []
            pushMonthlyData(results.seafreightFCL[2022], newData);
            for(let i = 0; i < newData.length; i++) {	
                addData(chartChartModeNum, newData[i], 1);
            }
        }
        if(results.seafreightLCL[2022]) {
            let newData = []
            pushMonthlyData(results.seafreightLCL[2022], newData);
            for(let i = 0; i < newData.length; i++) {	
                addData(chartChartModeNum, newData[i], 2);
            }
        }
        if(results.railfreightFCL[2022]) {
            let newData = []
            pushMonthlyData(results.railfreightFCL[2022], newData);
            for(let i = 0; i < newData.length; i++) {	
                addData(chartChartModeNum, newData[i], 2);
            }
        }
    })
    .catch(function (error) {
        console.log(error);
    })

    // Axios function to get the evolution of volumes per transportation mode per month
    axios
    .post("/api/evolVolume")
    .then(function (response) {
        let results = response.data;
        if(results.airfreight[2022]) {
            let newData = []
            pushMonthlyData(results.airfreight[2022], newData);
            for(let i = 0; i < newData.length; i++) {	
                addData(chartAirfreightVolumeEvol, newData[i], 0);
            }
        }
        if(results.seafreightFCL[2022]) {
            let newData = []
            pushMonthlyData(results.seafreightFCL[2022], newData);
            for(let i = 0; i < newData.length; i++) {	
                addData(chartChartSeafreightFCLVolumeEvol, newData[i], 0);
            }
        }
        if(results.seafreightLCL[2022]) {
            let newData = []
            pushMonthlyData(results.seafreightLCL[2022], newData);
            for(let i = 0; i < newData.length; i++) {	
                addData(chartChartSeafreightLCLVolumeEvol, newData[i], 0);
            }
        }
        if(results.railfreightFCL[2022]) {
            let newData = []
            pushMonthlyData(results.railfreightFCL[2022], newData);
            for(let i = 0; i < newData.length; i++) {	
                addData(chartChartRailfreightFCLVolumeEvol, newData[i], 0);
            }
        }
    })
    .catch(function (error) {
        console.log(error);
    })

    // Axios function to get the number of tender registered per country
    axios
    .post("/api/numCountryOpportunity")
    .then(function (response) {
        let results = response.data;
        for (let countryCode of results.countryCode) {
            dataChartCountryLaunch.labels.push(countryCode)
        }
        for (let numOpportunity of results.numOpportunity) {
            dataChartCountryLaunch.datasets[0].data.push(numOpportunity)
        }
        chartCountryLaunch.update();
    })

    .catch(function (error) {
        console.log(error);
    })

});