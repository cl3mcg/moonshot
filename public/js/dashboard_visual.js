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
            backgroundColor: 'rgba(28, 63, 96, 0.2)',
            borderColor: 'rgba(28, 63, 96, 1)',
            borderWidth: 1,
            data: [],
        },
        {
            label: 'Registrations recorded',
            backgroundColor: 'rgba(28, 63, 96, 0.6)',
            borderColor: 'rgba(28, 63, 96, 1)',
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

let chartOpportunitiesNum = new Chart(
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
            backgroundColor: 'rgba(77, 11, 108, 0.4)',
            borderColor: 'rgba(77, 11, 108, 1)',
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
        plugins: {
            legend: {
                display: true
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
        plugins: {
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
            borderColor: 'rgba(70, 75, 150, 1)',
            backgroundColor: 'rgba(70, 75, 150, 1)',
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
        plugins: {
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
            borderColor: 'rgba(70, 75, 150, 1)',
            backgroundColor: 'rgba(70, 75, 150, 1)',
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
        plugins: {
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
            borderColor: 'rgba(70, 75, 150, 1)',
            backgroundColor: 'rgba(70, 75, 150, 1)',
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
        plugins: {
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
            borderColor: 'rgba(70, 75, 150, 1)',
            backgroundColor: 'rgba(70, 75, 150, 1)',
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
        plugins: {
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
    // Axios function to fetch the data from the server and update the charts
    axios
        .post("/api/numRecords")
        .then(function (response) {
            let results = response.data;
            console.log(results);
            // Logic allowing to populate data to chartOpportunitiesNum for preadvised tenders
            if (results.preadvise[2022]) {
                let newData = []
                pushMonthlyData(results.preadvise[2022], newData);
                for (let i = 0; i < newData.length; i++) {
                    addData(chartOpportunitiesNum, newData[i], 0);
                }
            }
            // Logic allowing to populate data to chartOpportunitiesNum for registered tenders
            if (results.register[2022]) {
                let newData = []
                pushMonthlyData(results.register[2022], newData);
                for (let i = 0; i < newData.length; i++) {
                    addData(chartOpportunitiesNum, newData[i], 1);
                }
            }
            // Logic allowing to populate the value of noPreadviseValue for the number of tenders that were not preadvised prior to launch
            if (results.noPreadvise[2022]) {
                if (results.noPreadvise[2022] < 10) {
                    document.querySelector("#noPreadviseValue").innerText = `0${results.noPreadvise[2022]}`
                } else {
                    document.querySelector("#noPreadviseValue").innerText = results.noPreadvise[2022]
                }
            } else {
                document.querySelector("#noPreadviseValue").innerText = "00";
            }
            // Logic allowing to populate the value of preadviseLeadTimeValue for the average days between a preadvise an a tender launch
            if (results.preadviseLeadTimeValue[2022]) {
                if (results.preadviseLeadTimeValue[2022] < 10) {
                    document.querySelector("#preadviseLeadTimeValue").innerText = `0${results.preadviseLeadTimeValue[2022]}`
                } else {
                    document.querySelector("#preadviseLeadTimeValue").innerText = Math.ceil(results.preadviseLeadTimeValue[2022])
                }
            }
            // Logic allowing to populate the value of tenderPreparationTimeValue for the average days between a registration and the RFQ deadline
            if (results.averageTenderPrepTime[2022]) {
                if (results.averageTenderPrepTime[2022] < 10) {
                    document.querySelector("#tenderPreparationTimeValue").innerText = `0${Math.ceil(results.averageTenderPrepTime[2022])}`;
                } else {
                    document.querySelector("#tenderPreparationTimeValue").innerText = Math.ceil(results.averageTenderPrepTime[2022]);
                }
            } else {
                document.querySelector("#tenderPreparationTimeValue").innerText = "";
                document.querySelector("#tenderPreparationTimeValue").parentElement.innerText = "No data";
            }
            // Logic allowing to populate data to chartTenderDeskNum for amount of tenders per desk
            if (results.tenderDesk.AM[2022]) {
                let newData = []
                pushMonthlyData(results.tenderDesk.AM[2022], newData);
                for (let i = 0; i < newData.length; i++) {
                    addData(chartTenderDeskNum, newData[i], 0);
                }
            }
            if (results.tenderDesk.AP[2022]) {
                let newData = []
                pushMonthlyData(results.tenderDesk.AP[2022], newData);
                for (let i = 0; i < newData.length; i++) {
                    addData(chartTenderDeskNum, newData[i], 1);
                }
            }
            if (results.tenderDesk.EU[2022]) {
                let newData = []
                pushMonthlyData(results.tenderDesk.EU[2022], newData);
                for (let i = 0; i < newData.length; i++) {
                    addData(chartTenderDeskNum, newData[i], 2);
                }
            }
            // Logic behind the evolution of the volumes for the charts chartAirfreightVolumeEvol, chartChartSeafreightFCLVolumeEvol, chartChartSeafreightLCLVolumeEvol and chartChartRailfreightFCLVolumeEvol.
            if (results.evolVolume.airfreight[2022]) {
                let newData = []
                pushMonthlyData(results.evolVolume.airfreight[2022], newData);
                for (let i = 0; i < newData.length; i++) {
                    addData(chartAirfreightVolumeEvol, newData[i], 0);
                }
            }
            if (results.evolVolume.seafreightFCL[2022]) {
                let newData = []
                pushMonthlyData(results.evolVolume.seafreightFCL[2022], newData);
                for (let i = 0; i < newData.length; i++) {
                    addData(chartChartSeafreightFCLVolumeEvol, newData[i], 0);
                }
            }
            if (results.evolVolume.seafreightLCL[2022]) {
                let newData = []
                pushMonthlyData(results.evolVolume.seafreightLCL[2022], newData);
                for (let i = 0; i < newData.length; i++) {
                    addData(chartChartSeafreightLCLVolumeEvol, newData[i], 0);
                }
            }
            if (results.evolVolume.railfreightFCL[2022]) {
                let newData = []
                pushMonthlyData(results.evolVolume.railfreightFCL[2022], newData);
                for (let i = 0; i < newData.length; i++) {
                    addData(chartChartRailfreightFCLVolumeEvol, newData[i], 0);
                }
            }
            // Logic used to update the charts data of the registration of opportunities per transportation mode.
            if (results.numMode.airfreight[2022]) {
                let newData = []
                pushMonthlyData(results.numMode.airfreight[2022], newData);
                for (let i = 0; i < newData.length; i++) {
                    addData(chartChartModeNum, newData[i], 0);
                }
            }
            if (results.numMode.seafreightFCL[2022]) {
                let newData = []
                pushMonthlyData(results.numMode.seafreightFCL[2022], newData);
                for (let i = 0; i < newData.length; i++) {
                    addData(chartChartModeNum, newData[i], 1);
                }
            }
            if (results.numMode.seafreightLCL[2022]) {
                let newData = []
                pushMonthlyData(results.numMode.seafreightLCL[2022], newData);
                for (let i = 0; i < newData.length; i++) {
                    addData(chartChartModeNum, newData[i], 2);
                }
            }
            if (results.numMode.railfreightFCL[2022]) {
                let newData = []
                pushMonthlyData(results.numMode.railfreightFCL[2022], newData);
                for (let i = 0; i < newData.length; i++) {
                    addData(chartChartModeNum, newData[i], 2);
                }
            }

            // Logic behind the update of the chart data for the number of opportunities registered by country.
            for (let countryCode of results.countryData.countryCode) {
                dataChartCountryLaunch.labels.push(countryCode)
            }
            for (let numOpportunity of results.countryData.numOpportunity) {
                dataChartCountryLaunch.datasets[0].data.push(numOpportunity)
            }
            chartCountryLaunch.update();

        })
        .catch(function (error) {
            console.log(error);
        })

});