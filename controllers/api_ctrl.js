// ----- Database models

const PreadvisedTender = require("../models/preadvisedTender.js");
const RegisteredTender = require("../models/registeredTender.js");

// ----- Ressources required

const ejs = require("ejs");
const colors = require("colors");
const fs = require("fs").promises;
const { preadviseSchema } = require("../utilities/joischemas.js");
const nodemailer = require("nodemailer");
const countriesData = require("../public/ressources/countries.json");
const monthsData = require("../public/ressources/months.json");
const tradelanes = require("../public/ressources/tradelanes.json");
const history = require("../public/ressources/history.json");
const transportModes = require("../public/ressources/transportModes.json");
const businessVerticals = require("../public/ressources/businessVerticals.json");
const tenderLaunchMethod = require("../public/ressources/tenderLaunchMethod.json");
const decisionCriteria = require("../public/ressources/decisionCriteria.json");

// ----- Middleware used

const {
    // ----- isLoggedIn middleware used to check if the user is properly logged in - Check the value of req.user stored in Express Session
    isLoggedIn,
    isTenderTeam
} = require("../utilities/middleware.js");

// ----- catchAsync middleware used to handle Async functions errors

const catchAsync = require("../utilities/catchasync.js");

// ----- Extended error class

const ExpressError = require("../utilities/expresserror.js");

// const testSenderName = process.env.testSenderName
// const testReceiverEmail = process.env.testReceiverEmail
// const testSenderEmail = process.env.testSenderEmail
// const testSenderEmailPassword = process.env.testSenderEmailPassword

// ----- generatePreadviseReport function used to generate the preadvise reports in pdf and Excel

const generatePreadviseReport = require("../utilities/generatepreadvisereport.js");
const generatePreadviseExcelReport = require("../utilities/generatepreadviseexcelreport.js");

// ----- generateRegisterExcelReport function used to generate the register Excel report

const generateRegisterExcelReport = require("../utilities/generateregisterexcelreport.js");

// ----- Commonly used functions

const {
    findCountryName,
    findcca2,
    findSubRegion,
    findResponsibleTenderOffice,
    currentDateAndTime,
    formatDate,
    capitalize,
    deleteFile
} = require("../utilities/commonfunctions.js");

// ----- Controllers for MOONSHOT API

module.exports.sendNumRecords = async function (req, res) {
    let allPreadviseTenders = await PreadvisedTender.find();
    let allRegisterTenders = await RegisteredTender.find().populate("preadvise");
    let response = {
        preadvise: {
            2022: [],
        },
        register: {
            2022: [],
        },
        noPreadvise: {
            2022: [],
        },
        preadviseLeadTimeValue: {
            2022: [],
        },
        averageTenderPrepTime: {
            2022: [],
        },
        tenderDesk: {
            AM: {
                2022: [],
            },
            AP: {
                2022: [],
            },
            EU: {
                2022: [],
            }
        },
        evolVolume: {
            airfreight: {
                2022: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            seafreightFCL: {
                2022: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            seafreightLCL: {
                2022: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            railfreightFCL: {
                2022: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            }
        },
        numMode: {
            airfreight: {
                2022: [],
            },
            seafreightFCL: {
                2022: [],
            },
            seafreightLCL: {
                2022: [],
            },
            railfreightFCL: {
                2022: [],
            }
        },
        countryData: {
            countryCode: [],
            numOpportunity: []
        }
    }

    allPreadviseTenders.forEach(tender => {
        let month = tender.recordDate.getMonth();
        let year = tender.recordDate.getFullYear();
        if (response.preadvise[year]) {
            if (response.preadvise[year][month]) {
                response.preadvise[year][month]++;
            } else {
                response.preadvise[year][month] = 1;
            }
        } else {
            response.preadvise[year] = {};
            response.preadvise[year][month] = 1;
        }
    }
        , {});

    allRegisterTenders.forEach(tender => {
        let month = tender.recordDate.getMonth();
        let year = tender.recordDate.getFullYear();
        if (response.register[year]) {
            if (response.register[year][month]) {
                response.register[year][month]++;
            } else {
                response.register[year][month] = 1;
            }
        } else {
            response.register[year] = {};
            response.register[year][month] = 1;
        }
    }
        , {});

    for (let year in response.preadvise) {
        for (let i = 0; i < 12; i++) {
            if (!response.preadvise[year][i]) {
                response.preadvise[year][i] = 0;
            }
            if (!response.register[year][i]) {
                response.register[year][i] = 0;
            }
        }
    }

    // Provides the number of tenders that were not pre-advised and organize it per year in the response.noPreadvise object
    for (let year in response.register) {
        for (let tender of allRegisterTenders) {
            if (!tender.preadvise) {
                if (!response.noPreadvise[year]) {
                    response.noPreadvise[year] = 0;
                }
                response.noPreadvise[year]++;
            }
        }
    }

    // Provides the average time expressed in days between the registered tender recordDate and the registered tender deadlineRFQ
    for (let year in response.register) {
        response.averageTenderPrepTime[year] =
            allRegisterTenders
                .filter(tender => tender.recordDate.getFullYear() == year)
                .map(tender => (tender.deadlineRFQ - tender.recordDate) / (1000 * 3600 * 24))
                .reduce((a, b) => a + b, 0) / allRegisterTenders.filter(tender => tender.recordDate.getFullYear() == year).length;
    }

    // For each tender in the allRegisterTenders, if the tender.preadvise is true, fetch the corresponding tender.preadvise.recordDate and calculate the difference between the tender.preadvise.recordDate and the tender.recordDate
    // Then, calculate the average time expressed in days between the tender.preadvise.recordDate and the tender.recordDate, and store the value in the response.averageTimePreadviseLaunch object
    for (let year in response.register) {
        response.preadviseLeadTimeValue[year] =
            allRegisterTenders
                .filter(tender => tender.preadvise && tender.recordDate.getFullYear() == year)
                .map(tender => (tender.recordDate - tender.preadvise.recordDate) / (1000 * 3600 * 24))
                .reduce((a, b) => a + b, 0) / allRegisterTenders.filter(tender => tender.preadvise && tender.recordDate.getFullYear() == year).length;
    }

    // Logic behind the tender desk object calculations
    allRegisterTenders.forEach(tender => {
        let responsibleDesk = findResponsibleTenderOffice(tender.countryLocation);
        let month = tender.recordDate.getMonth();
        let year = tender.receptionDate.getFullYear();
        switch (responsibleDesk) {
            case "AM":
                if (response.tenderDesk.AM[year]) {
                    if (response.tenderDesk.AM[year][month]) {
                        response.tenderDesk.AM[year][month]++;
                    } else {
                        response.tenderDesk.AM[year][month] = 1;
                    }
                } else {
                    response.tenderDesk.AM[year] = {};
                    response.tenderDesk.AM[year][month] = 1;
                }
                break;
            case "AP":
                if (response.tenderDesk.AP[year]) {
                    if (response.tenderDesk.AP[year][month]) {
                        response.tenderDesk.AP[year][month]++;
                    } else {
                        response.tenderDesk.AP[year][month] = 1;
                    }
                } else {
                    response.tenderDesk.AP[year] = {};
                    response.tenderDesk.AP[year][month] = 1;
                }
                break;
            case "EU":
                if (response.tenderDesk.EU[year]) {
                    if (response.tenderDesk.EU[year][month]) {
                        response.tenderDesk.EU[year][month]++;
                    } else {
                        response.tenderDesk.EU[year][month] = 1;
                    }
                } else {
                    response.tenderDesk.EU[year] = {};
                    response.tenderDesk.EU[year][month] = 1;
                }
                break;
            default:
                break;
        }
    }
        , {});

    for (let i = 0; i < 12; i++) {
        for (let year in response.tenderDesk.AM) {
            if (!response.tenderDesk.AM[year][i]) {
                response.tenderDesk.AM[year][i] = 0;
            }
        }
        for (let year in response.tenderDesk.AP) {
            if (!response.tenderDesk.AP[year][i]) {
                response.tenderDesk.AP[year][i] = 0;
            }
        }
        for (let year in response.tenderDesk.EU) {
            if (!response.tenderDesk.EU[year][i]) {
                response.tenderDesk.EU[year][i] = 0;
            }
        }
    }

    // Logic behind the evolution of the volumes
    allRegisterTenders.forEach(tender => {
        let mode = tender.transportMode;
        let month = tender.recordDate.getMonth();
        let year = tender.receptionDate.getFullYear();
        if (mode.includes("hasAirFreight")) {
            if (response.evolVolume.airfreight[year]) {
                response.evolVolume.airfreight[year][month] += tender.airFreightVolume;
                for (let i = month + 1; i < 12; i++) {
                    response.evolVolume.airfreight[year][i] += tender.airFreightVolume;
                }
            } else {
                response.evolVolume.airfreight[year] = {};
                response.evolVolume.airfreight[year][month] = tender.airFreightVolume;
            }
        }
        if (mode.includes("hasSeaFreightFCL")) {
            if (response.evolVolume.seafreightFCL[year]) {
                response.evolVolume.seafreightFCL[year][month] += tender.seaFreightFCLVolume;
                for (let i = month + 1; i < 12; i++) {
                    response.evolVolume.seafreightFCL[year][i] += tender.seaFreightFCLVolume;
                }
            } else {
                response.evolVolume.seafreightFCL[year] = {};
                response.evolVolume.seafreightFCL[year][month] = tender.seaFreightFCLVolume;
            }
        }
        if (mode.includes("hasSeaFreightLCL")) {
            if (response.evolVolume.seafreightLCL[year]) {
                response.evolVolume.seafreightLCL[year][month] += tender.seaFreightLCLVolume;
                for (let i = month + 1; i < 12; i++) {
                    response.evolVolume.seafreightLCL[year][i] += tender.seaFreightLCLVolume;
                }
            } else {
                response.evolVolume.seafreightLCL[year] = {};
                response.evolVolume.seafreightLCL[year][month] = tender.seaFreightLCLVolume;
            }
        }
        if (mode.includes("hasRailfreightFCL")) {
            if (response.evolVolume.railfreightFCL[year]) {
                response.evolVolume.railfreightFCL[year][month] += tender.railFreightFCLVolume;
                for (let i = month + 1; i < 12; i++) {
                    response.evolVolume.railfreightFCL[year][i] += tender.railFreightFCLVolume;
                }
            } else {
                response.evolVolume.railfreightFCL[year] = {};
                response.evolVolume.railfreightFCL[year][month] = tender.railFreightFCLVolume;
            }
        }
    }
        , {});

    // Logic used to calculate the number of tender per transportation mode.
    allRegisterTenders.forEach(tender => {
        let mode = tender.transportMode;
        let month = tender.recordDate.getMonth();
        let year = tender.receptionDate.getFullYear();
        if (mode.includes("hasAirFreight")) {
            if (response.numMode.airfreight[year]) {
                if (response.numMode.airfreight[year][month]) {
                    response.numMode.airfreight[year][month]++;
                } else {
                    response.numMode.airfreight[year][month] = 1;
                }
            } else {
                response.numMode.airfreight[year] = {};
                response.numMode.airfreight[year][month] = 1;
            }
        } else if (mode.includes("hasSeaFreightFCL")) {
            if (response.numMode.seafreightFCL[year]) {
                if (response.numMode.seafreightFCL[year][month]) {
                    response.numMode.seafreightFCL[year][month]++;
                } else {
                    response.numMode.seafreightFCL[year][month] = 1;
                }
            } else {
                response.numMode.seafreightFCL[year] = {};
                response.numMode.seafreightFCL[year][month] = 1;
            }
        } else if (mode.includes("hasSeaFreightLCL")) {
            if (response.numMode.seafreightLCL[year]) {
                if (response.numMode.seafreightLCL[year][month]) {
                    response.numMode.seafreightLCL[year][month]++;
                } else {
                    response.numMode.seafreightLCL[year][month] = 1;
                }
            } else {
                response.numMode.seafreightLCL[year] = {};
                response.numMode.seafreightLCL[year][month] = 1;
            }
        } else if (mode.includes("hasRailfreightFCL")) {
            if (response.numMode.railfreightFCL[year]) {
                if (response.numMode.railfreightFCL[year][month]) {
                    response.numMode.railfreightFCL[year][month]++;
                } else {
                    response.numMode.railfreightFCL[year][month] = 1;
                }
            } else {
                response.numMode.railfreightFCL[year] = {};
                response.numMode.railfreightFCL[year][month] = 1;
            }
        }
    }
        , {});
    for (let i = 0; i < 12; i++) {
        for (let year in response.numMode.airfreight) {
            if (!response.numMode.airfreight[year][i]) {
                response.numMode.airfreight[year][i] = 0;
            }
        }
        for (let year in response.numMode.seafreightFCL) {
            if (!response.numMode.seafreightFCL[year][i]) {
                response.numMode.seafreightFCL[year][i] = 0;
            }
        }
        for (let year in response.numMode.seafreightLCL) {
            if (!response.numMode.seafreightLCL[year][i]) {
                response.numMode.seafreightLCL[year][i] = 0;
            }
        }
        for (let year in response.numMode.railfreightFCL) {
            if (!response.numMode.railfreightFCL[year][i]) {
                response.numMode.railfreightFCL[year][i] = 0;
            }
        }
    }

    // Logic used to fetch dat related to the number of registration per country.
    // Write a function that populates the response object with the number of opportunities per countryCode. The response object is a list of pairs (countryCode, number of opportunities).
    allRegisterTenders.forEach(tender => {
        let countryCode = tender.countryLocation;
        let index = response.countryData.countryCode.indexOf(countryCode);
        if (index < 0) {
            response.countryData.countryCode.push(countryCode);
            response.countryData.numOpportunity.push(1);
        } else {
            response.countryData.numOpportunity[index] += 1;
        }
    }
        , {});

    // Rearrange the response object in order to have the numOpportunities in descending order. The countryCode should also match the changes in the numOpportunity array.
    let temp = [];
    for (let i = 0; i < response.countryData.countryCode.length; i++) {
        temp.push({
            countryCode: response.countryData.countryCode[i],
            numOpportunity: response.countryData.numOpportunity[i]
        });
    }
    temp.sort((a, b) => {
        return b.numOpportunity - a.numOpportunity;
    }
        , {});
    response.countryData.countryCode = [];
    response.countryData.numOpportunity = [];
    for (let i = 0; i < temp.length; i++) {
        response.countryData.countryCode.push(temp[i].countryCode);
        response.countryData.numOpportunity.push(temp[i].numOpportunity);
    }

    // Send back the response object
    res.json(response);
};

