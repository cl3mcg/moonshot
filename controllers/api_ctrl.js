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
const tenderLaunchMethod = require("../public/ressources/tenderLaunchMethod.json")
const decisionCriteria = require("../public/ressources/decisionCriteria.json")

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
    let allRegisterTenders = await RegisteredTender.find();
    let response = {
        preadvise : {
            2022 : [],
        },
        register : {
            2022 : [],
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

    for(let year in response.preadvise) {
        for(let i = 0; i < 12; i++) {
            if (!response.preadvise[year][i]) {
                response.preadvise[year][i] = 0;
            }
            if (!response.register[year][i]) {
                response.register[year][i] = 0;
            }
        }
    }
// Send back the response object
res.json(response);
};

module.exports.sendNumTenderDesk = async function (req, res) {
    let allRegisterTenders = await RegisteredTender.find();
    let response = {
        AM : {
            2022 : [],
        },
        AP : {
            2022 : [],
        },
        EU : {
            2022 : [],
        }
    }

// A function that would populate the response object with the number of register tenders by month and year receptionDate
    allRegisterTenders.forEach(tender => {
        let responsibleDesk = findResponsibleTenderOffice(tender.countryLocation);
        let month = tender.recordDate.getMonth();
        let year = tender.receptionDate.getFullYear();
        switch (responsibleDesk) {
            case "AM":
                if (response.AM[year]) {
                    if (response.AM[year][month]) {
                        response.AM[year][month]++;
                    } else {
                        response.AM[year][month] = 1;
                    }
                } else {
                    response.AM[year] = {};
                    response.AM[year][month] = 1;
                }
                break;
            case "AP":
                if (response.AP[year]) {
                    if (response.AP[year][month]) {
                        response.AP[year][month]++;
                    } else {
                        response.AP[year][month] = 1;
                    }
                } else {
                    response.AP[year] = {};
                    response.AP[year][month] = 1;
                }
                break;
            case "EU":
                if (response.EU[year]) {
                    if (response.EU[year][month]) {
                        response.EU[year][month]++;
                    } else {
                        response.EU[year][month] = 1;
                    }
                } else {
                    response.EU[year] = {};
                    response.EU[year][month] = 1;
                }
                break;
            default:
                break;
        }
    }
    , {});

    for(let i = 0; i < 12; i++) {
        for(let year in response.AM) {
            if (!response.AM[year][i]) {
                response.AM[year][i] = 0;
            }
        }
        for(let year in response.AP) {
            if (!response.AP[year][i]) {
                response.AP[year][i] = 0;
            }
        }
        for(let year in response.EU) {
            if (!response.EU[year][i]) {
                response.EU[year][i] = 0;
            }
        }
    }

// Send back the response object
res.json(response);
};

module.exports.sendNumMode = async function (req, res) {
    let allRegisterTenders = await RegisteredTender.find();
    let response = {
        airfreight : {
            2022 : [],
        },
        seafreightFCL : {
            2022 : [],
        },
        seafreightLCL : {
            2022 : [],
        },
        railfreightFCL : {
            2022 : [],
        }
    }

// A function that would populate the response object with the number of register tenders ranked by transportation mode by month and year receptionDate
    allRegisterTenders.forEach(tender => {
        let mode = tender.transportMode;
        let month = tender.recordDate.getMonth();
        let year = tender.receptionDate.getFullYear();
        if (mode.includes("hasAirFreight")) {
            if (response.airfreight[year]) {
                if (response.airfreight[year][month]) {
                    response.airfreight[year][month]++;
                } else {
                    response.airfreight[year][month] = 1;
                }
            } else {
                response.airfreight[year] = {};
                response.airfreight[year][month] = 1;
            }
        } else if (mode.includes("hasSeaFreightFCL")) {
            if (response.seafreightFCL[year]) {
                if (response.seafreightFCL[year][month]) {
                    response.seafreightFCL[year][month]++;
                } else {
                    response.seafreightFCL[year][month] = 1;
                }
            } else {
                response.seafreightFCL[year] = {};
                response.seafreightFCL[year][month] = 1;
            }
        } else if (mode.includes("hasSeaFreightLCL")) {
            if (response.seafreightLCL[year]) {
                if (response.seafreightLCL[year][month]) {
                    response.seafreightLCL[year][month]++;
                } else {
                    response.seafreightLCL[year][month] = 1;
                }
            } else {
                response.seafreightLCL[year] = {};
                response.seafreightLCL[year][month] = 1;
            }
        } else if (mode.includes("hasRailfreightFCL")) {
            if (response.railfreightFCL[year]) {
                if (response.railfreightFCL[year][month]) {
                    response.railfreightFCL[year][month]++;
                } else {
                    response.railfreightFCL[year][month] = 1;
                }
            } else {
                response.railfreightFCL[year] = {};
                response.railfreightFCL[year][month] = 1;
            }
        }
    }
    , {});


    for(let i = 0; i < 12; i++) {
        for(let year in response.airfreight) {
            if (!response.airfreight[year][i]) {
                response.airfreight[year][i] = 0;
            }
        }
        for(let year in response.seafreightFCL) {
            if (!response.seafreightFCL[year][i]) {
                response.seafreightFCL[year][i] = 0;
            }
        }
        for(let year in response.seafreightLCL) {
            if (!response.seafreightLCL[year][i]) {
                response.seafreightLCL[year][i] = 0;
            }
        }
        for(let year in response.railfreightFCL) {
            if (!response.railfreightFCL[year][i]) {
                response.railfreightFCL[year][i] = 0;
            }
        }
    }

// Send back the response object
res.json(response);
};

module.exports.sendEvolVolume = async function (req, res) {
    let allRegisterTenders = await RegisteredTender.find();
    let response = {
        airfreight : {
            2022 : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        seafreightFCL : {
            2022 : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        seafreightLCL : {
            2022 : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        railfreightFCL : {
            2022 : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        }
    }

// Write a function that populate the response object with the evolution of the airFreightVolume, seaFreightFCLVolume, seaFreightlCLVolume and railFreightFCLVolume of register tenders ranked by transportation mode by month and year receptionDate. Each entry from a new month is added to the previous entry.
    allRegisterTenders.forEach(tender => {
        let mode = tender.transportMode;
        let month = tender.recordDate.getMonth();
        let year = tender.receptionDate.getFullYear();
        if (mode.includes("hasAirFreight")) {
            if (response.airfreight[year]) {
                response.airfreight[year][month] += tender.airFreightVolume;
                for (let i = month+1; i < 12; i++) {
                    response.airfreight[year][i] += tender.airFreightVolume;
                }
            } else {
                response.airfreight[year] = {};
                response.airfreight[year][month] = tender.airFreightVolume;
            }
        }
        if (mode.includes("hasSeaFreightFCL")) {
            if (response.seafreightFCL[year]) {
                response.seafreightFCL[year][month] += tender.seaFreightFCLVolume;
                for (let i = month+1; i < 12; i++) {
                    response.seafreightFCL[year][i] += tender.seaFreightFCLVolume;
                }
            } else {
                response.seafreightFCL[year] = {};
                response.seafreightFCL[year][month] = tender.seaFreightFCLVolume;
            }
        }
        if (mode.includes("hasSeaFreightLCL")) {
            if (response.seafreightLCL[year]) {
                response.seafreightLCL[year][month] += tender.seaFreightLCLVolume;
                for (let i = month+1; i < 12; i++) {
                    response.seafreightLCL[year][i] += tender.seaFreightLCLVolume;
                }
            } else {
                response.seafreightLCL[year] = {};
                response.seafreightLCL[year][month] = tender.seaFreightLCLVolume;
            }
        }
        if (mode.includes("hasRailfreightFCL")) {
            if (response.railfreightFCL[year]) {
                response.railfreightFCL[year][month] += tender.railFreightFCLVolume;
                for (let i = month+1; i < 12; i++) {
                    response.railfreightFCL[year][i] += tender.railFreightFCLVolume;
                }
            } else {
                response.railfreightFCL[year] = {};
                response.railfreightFCL[year][month] = tender.railFreightFCLVolume;
            }
        }
    }
    , {});

// Send back the response object
res.json(response);
};

module.exports.sendNumCountryOpportunity = async function (req, res) {
    let allRegisterTenders = await RegisteredTender.find();
    let response = {
        countryCode : [],
        numOpportunity : []
    }
    // Write a function that populates the response object with the number of opportunities per countryCode. The response object is a list of pairs (countryCode, number of opportunities).
    allRegisterTenders.forEach(tender => {
        let countryCode = tender.countryLocation;
        let index = response.countryCode.indexOf(countryCode);
        if (index < 0) {
            response.countryCode.push(countryCode);
            response.numOpportunity.push(1);
        } else {
            response.numOpportunity[index] += 1;
        }
    }
    , {});
    // Rearrange the response object in order to have the numOpportunities in ascending order. The countryCode should also match the changes in the numOpportunity array.
    // let temp = [];
    // for (let i = 0; i < response.countryCode.length; i++) {
    //     temp.push({
    //         countryCode : response.countryCode[i],
    //         numOpportunity : response.numOpportunity[i]
    //     });
    // }
    // temp.sort((a, b) => {
    //     return a.numOpportunity - b.numOpportunity;
    // }
    // , {});
    // response.countryCode = [];
    // response.numOpportunity = [];
    // for (let i = 0; i < temp.length; i++) {
    //     response.countryCode.push(temp[i].countryCode);
    //     response.numOpportunity.push(temp[i].numOpportunity);
    // }
    
    // Rearrange the response object in order to have the numOpportunities in descending order. The countryCode should also match the changes in the numOpportunity array.
    let temp = [];
    for (let i = 0; i < response.countryCode.length; i++) {
        temp.push({
            countryCode : response.countryCode[i],
            numOpportunity : response.numOpportunity[i]
        }); 
    }
    temp.sort((a, b) => {
        return b.numOpportunity - a.numOpportunity;
    }
    , {});
    response.countryCode = [];
    response.numOpportunity = [];
    for (let i = 0; i < temp.length; i++) {
        response.countryCode.push(temp[i].countryCode);
        response.numOpportunity.push(temp[i].numOpportunity);
    }


// Send back the response object
res.json(response);
}
