// ----- Database models

const PreadvisedTender = require("../models/preadvisedTender.js");

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

// ----- catchAsync middleware used to handle Async functions errors

const catchAsync = require("../utilities/catchasync.js");

// ----- Extended error class

// const ExpressError = require("../utilities/expresserror.js");

// const testSenderName = process.env.testSenderName
// const testReceiverEmail = process.env.testReceiverEmail
// const testSenderEmail = process.env.testSenderEmail
// const testSenderEmailPassword = process.env.testSenderEmailPassword

// ----- Middleware used

const {
      // ----- isLoggedIn middleware used to check if the user is properly logged in - Check the value of req.user stored in Express Session
    isLoggedIn,
    // ----- validatePreadvise middleware used with JOI to validate new preavised tenders according to JOI schema
    validatePreadvise
} = require("../utilities/middleware.js");


// ----- generatePreadviseReport function used to generate the preadvise pdf report

const generatePreadviseReport = require("../utilities/generatepreadvisereport.js");
const generatePreadviseExcelReport = require("../utilities/generatepreadviseexcelreport.js");

// ----- preadviseTenderEmailConfirmation function used to send emails related to preadvise tenders operations

const {
    preadviseTenderEmailConfirmation,
    preadviseTenderEmailCancellation,
    preadviseTenderNotice,
    preadviseCancelTenderNotice
  } = require("../utilities/preadviseemail.js");

// const preadviseTenderEmailConfirmation = require("../utilities/preadviseemail.js");
// const preadviseTenderEmailCancellation = require("../utilities/preadviseemail.js");

// ----- Commonly used functions

const {
  findCountryName,
  findcca2,
  findSubRegion,
  findResponsibleTenderOffice,
  currentDateAndTime,
  formatDate,
  capitalize
} = require("../utilities/commonfunctions.js");

// ----- Controllers for MOONSHOT PREADVISED TENDERS

module.exports.renderStartPage = function (req, res) {
    res.render("preadvise/preadvised_start.ejs");
}

module.exports.renderNewPage = function (req, res) {
    res.render("preadvise/preadvised_new.ejs", { countriesData });
}

module.exports.createPreadvise = catchAsync(async function (req, res, next) {
    console.log(`${colors.black.bgBrightCyan("* ATTEMPT *")} A new TENDER PRE-ADVISE submit has been attempted with the following data:`);
    console.log(req.body);
    let companyName = req.body.companyName;
    let sugarID = req.body.sugarID;
    let expectedReceiveDate = req.body.expectedReceiveDate;
    let transportMode = req.body.transportMode;
    if (typeof transportMode != "object") {
    transportMode = [transportMode];
    }
    let airFreightVolume;
    if (!req.body.airFreightVol) {
    airFreightVolume = 0;
    } else {
    airFreightVolume = req.body.airFreightVol;
    }
    let seaFreightFCLVolume;
    if (!req.body.seaFreightFCLVol) {
    seaFreightFCLVolume = 0;
    } else {
    seaFreightFCLVolume = req.body.seaFreightFCLVol;
    }
    let seaFreightLCLVolume;
    if (!req.body.seaFreightLCLVol) {
    seaFreightLCLVolume = 0;
    } else {
    seaFreightLCLVolume = req.body.seaFreightLCLVol;
    }
    let railFreightVolume;
    if (!req.body.railFreightVol) {
    railFreightVolume = 0;
    } else {
    railFreightVolume = req.body.railFreightVol;
    }
    let keyTradelanes = req.body.keyTradelanes;
    if (typeof keyTradelanes != "object") {
    keyTradelanes = [keyTradelanes];
    }
    let history = req.body.history;
    let existingCustomerSegment;
    if (!req.body.existingCustomerSegment) {
    existingCustomerSegment = null;
    } else {
    existingCustomerSegment = req.body.existingCustomerSegment;
    }
    let additionalComment;
    if (!req.body.additionalComment) {
    additionalComment = null;
    } else {
    additionalComment = req.body.additionalComment;
    }
    let countryLocation = req.body.countryLocation;

    let newEntry = new PreadvisedTender({
    recordDate: currentDateAndTime(),
    author: req.user._id,
    lastModifiedDate: null,
    launched: false,
    launchedTime: null,
    companyName: companyName,
    sugarID: sugarID,
    expectedReceiveDate: expectedReceiveDate,
    transportMode: transportMode,
    airFreightVolume: airFreightVolume,
    seaFreightFCLVolume: seaFreightFCLVolume,
    seaFreightLCLVolume: seaFreightLCLVolume,
    railFreightVolume: railFreightVolume,
    keyTradelanes: keyTradelanes,
    history: history,
    existingCustomerSegment: existingCustomerSegment,
    additionalComment: additionalComment,
    countryLocation: countryLocation,
    });
    await newEntry.save();
    console.log(`${colors.black.bgBrightGreen("* OK *")} A new TENDER PRE-ADVISE has been registered in the database: ${companyName}`);
    req.flash("success", "Preadvise tender is successfully saved !");
    res.redirect(`/preadvise/${newEntry.id}`);

  let fileIdentifier = Date.now();
  await generatePreadviseReport(newEntry.id, fileIdentifier);
  await preadviseTenderEmailConfirmation(newEntry.id, fileIdentifier)
  await preadviseTenderNotice(newEntry.id, fileIdentifier)

  fs.unlink(`./reports/reportsGenerated/${newEntry.companyName}_${fileIdentifier}.pdf`, function (err) {
    if (err) {
      console.error(err)
      return
    }
  })
  console.log(`${colors.black.bgBrightGreen("* OK *")} The PDF report related to the preadvise of ${companyName} has been deleted from the server`);

})

module.exports.renderIndexPage = catchAsync(async function (req, res) {
    const d = new Date();
    const today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const d30 = new Date(d.setDate(d.getDate() + 30));
    const next30days = new Date(
    d30.getFullYear(),
    d30.getMonth(),
    d30.getDate()
    );
    const d90 = new Date(d30.setDate(d30.getDate() + 60));
    const next90days = new Date(
    d90.getFullYear(),
    d90.getMonth(),
    d90.getDate()
    );

    // const preadvised_past = await PreadvisedTender.find({"expectedReceiveDate": {$lt: today}})
    // const preadvised_inM = await PreadvisedTender.find({"expectedReceiveDate": {$gte: today, $lte: next30days}})
    // const preadvised_inQ = await PreadvisedTender.find({"expectedReceiveDate": {$gt: next30days, $lte: next90days}})
    // const preadvised_inY = await PreadvisedTender.find({"expectedReceiveDate": {$gt: next90days}})
    // let allPreadvisedTenders = await PreadvisedTender.find({})

    // ----- Function below is used to sort an array containing objects according to a defined attribute.
    // ----- Function below has been copied from https://stackoverflow.com/questions/10123953/how-to-sort-an-object-array-by-date-property
    var sortBy = (function () {
    var toString = Object.prototype.toString,
        // default parser function
        parse = function (x) {
        return x;
        },
        // gets the item to be sorted
        getItem = function (x) {
        var isObject = x != null && typeof x === "object";
        var isProp = isObject && this.prop in x;
        return this.parser(isProp ? x[this.prop] : x);
        };

    /**
     * Sorts an array of elements.
     *
     * @param {Array} array: the collection to sort
     * @param {Object} cfg: the configuration options
     * @property {String}   cfg.prop: property name (if it is an Array of objects)
     * @property {Boolean}  cfg.desc: determines whether the sort is descending
     * @property {Function} cfg.parser: function to parse the items to expected type
     * @return {Array}
     */
    return function sortby(array, cfg) {
        if (!(array instanceof Array && array.length)) return [];
        if (toString.call(cfg) !== "[object Object]") cfg = {};
        if (typeof cfg.parser !== "function") cfg.parser = parse;
        cfg.desc = !!cfg.desc ? -1 : 1;
        return array.sort(function (a, b) {
        a = getItem.call(cfg, a);
        b = getItem.call(cfg, b);
        return cfg.desc * (a < b ? -1 : +(a > b));
        });
    };
    })();

    const allPreadvisedTenders = sortBy(await PreadvisedTender.find({}), {
    prop: "expectedReceiveDate",
    });
    const preadvised_past = sortBy(
    await PreadvisedTender.find({ expectedReceiveDate: { $lt: today } }),
    { prop: "expectedReceiveDate" }
    );
    const preadvised_inM = sortBy(
    await PreadvisedTender.find({
        expectedReceiveDate: { $gte: today, $lte: next30days },
    }),
    { prop: "expectedReceiveDate" }
    );
    const preadvised_inQ = sortBy(
    await PreadvisedTender.find({
        expectedReceiveDate: { $gt: next30days, $lte: next90days },
    }),
    { prop: "expectedReceiveDate" }
    );
    const preadvised_inY = sortBy(
    await PreadvisedTender.find({ expectedReceiveDate: { $gt: next90days } }),
    { prop: "expectedReceiveDate" }
    );
    const preadvised_inAM = [];
    const preadvised_inAP = [];
    const preadvised_inEU = [];

    for (let preadvise of allPreadvisedTenders) {
    for (let country of countriesData) {
        if (country.cca2 === preadvise.countryLocation) {
        if (
            country.region === "Europe" ||
            country.region === "Africa" ||
            country.subregion === "Central Asia" ||
            country.subregion === "Western Asia"
        ) {
            preadvised_inEU.push(preadvise);
        } else if (
            country.region === "Asia" ||
            country.region === "Oceania"
        ) {
            preadvised_inAP.push(preadvise);
        } else if (country.region === "Americas") {
            preadvised_inAM.push(preadvise);
        } else preadvised_inEU.push(preadvise);
        }
    }
    }

    // ----- For debugging purposes
    // console.log(`"today" is registered as ${today}`)
    // console.log(`"next30days" is registered as ${next30days}`)
    // console.log(`"next90days" is registered as ${next90days}`)
    // console.log(`"preadvised_inM" results are ${preadvised_inM}`)
    // console.log(`"preadvised_inQ" results are ${preadvised_inQ}`)
    // console.log(`"preadvised_inY" results are ${preadvised_inY}`)
    // console.log(`"preadvised_inAM" results are ${preadvised_inAM}`)
    // console.log(`"preadvised_inAP" results are ${preadvised_inAP}`)
    // console.log(`"preadvised_inEU" results are ${preadvised_inEU}`)

    res.render("preadvise/preadvised_index.ejs", {
        countriesData,
        monthsData,
        today,
        next30days,
        next90days,
        allPreadvisedTenders,
        preadvised_past,
        preadvised_inM,
        preadvised_inQ,
        preadvised_inY,
        preadvised_inAM,
        preadvised_inAP,
        preadvised_inEU,
    });
})

module.exports.renderHistoryPage = catchAsync(async function (req, res) {
    const d = new Date();
    const today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const d30 = new Date(d.setDate(d.getDate() + 30));
    const next30days = new Date(
    d30.getFullYear(),
    d30.getMonth(),
    d30.getDate()
    );
    const d90 = new Date(d30.setDate(d30.getDate() + 60));
    const next90days = new Date(
    d90.getFullYear(),
    d90.getMonth(),
    d90.getDate()
    );

    // const preadvised_past = await PreadvisedTender.find({"expectedReceiveDate": {$lt: today}})
    // const preadvised_inM = await PreadvisedTender.find({"expectedReceiveDate": {$gte: today, $lte: next30days}})
    // const preadvised_inQ = await PreadvisedTender.find({"expectedReceiveDate": {$gt: next30days, $lte: next90days}})
    // const preadvised_inY = await PreadvisedTender.find({"expectedReceiveDate": {$gt: next90days}})
    // let allPreadvisedTenders = await PreadvisedTender.find({})

    // ----- Function below is used to sort an array containing objects according to a defined attribute.
    // ----- Function below has been copied from https://stackoverflow.com/questions/10123953/how-to-sort-an-object-array-by-date-property
    var sortBy = (function () {
    var toString = Object.prototype.toString,
        // default parser function
        parse = function (x) {
        return x;
        },
        // gets the item to be sorted
        getItem = function (x) {
        var isObject = x != null && typeof x === "object";
        var isProp = isObject && this.prop in x;
        return this.parser(isProp ? x[this.prop] : x);
        };

    /**
     * Sorts an array of elements.
     *
     * @param {Array} array: the collection to sort
     * @param {Object} cfg: the configuration options
     * @property {String}   cfg.prop: property name (if it is an Array of objects)
     * @property {Boolean}  cfg.desc: determines whether the sort is descending
     * @property {Function} cfg.parser: function to parse the items to expected type
     * @return {Array}
     */
    return function sortby(array, cfg) {
        if (!(array instanceof Array && array.length)) return [];
        if (toString.call(cfg) !== "[object Object]") cfg = {};
        if (typeof cfg.parser !== "function") cfg.parser = parse;
        cfg.desc = !!cfg.desc ? -1 : 1;
        return array.sort(function (a, b) {
        a = getItem.call(cfg, a);
        b = getItem.call(cfg, b);
        return cfg.desc * (a < b ? -1 : +(a > b));
        });
    };
    })();

    const allPreadvisedTenders = sortBy(await PreadvisedTender.find({author : req.user}), {
    prop: "expectedReceiveDate",
    });
    const preadvised_past = sortBy(
    await PreadvisedTender.find({ 
        expectedReceiveDate: { $lt: today },
        author : req.user
    }),
    { prop: "expectedReceiveDate" }
    );
    const preadvised_inM = sortBy(
    await PreadvisedTender.find({
        expectedReceiveDate: { $gte: today, $lte: next30days },
        author : req.user
    }),
    { prop: "expectedReceiveDate" }
    );
    const preadvised_inQ = sortBy(
    await PreadvisedTender.find({
        expectedReceiveDate: { $gt: next30days, $lte: next90days },
        author : req.user
    }),
    { prop: "expectedReceiveDate" }
    );
    const preadvised_inY = sortBy(
    await PreadvisedTender.find({
        expectedReceiveDate: { $gt: next90days },
        author : req.user
    }),
    { prop: "expectedReceiveDate" }
    );
    const preadvised_inAM = [];
    const preadvised_inAP = [];
    const preadvised_inEU = [];

    let history = await PreadvisedTender.find({author : req.user})

    for (let preadvise of allPreadvisedTenders) {
    for (let country of countriesData) {
        if (country.cca2 === preadvise.countryLocation) {
        if (
            country.region === "Europe" ||
            country.region === "Africa" ||
            country.subregion === "Central Asia" ||
            country.subregion === "Western Asia"
        ) {
            preadvised_inEU.push(preadvise);
        } else if (
            country.region === "Asia" ||
            country.region === "Oceania"
        ) {
            preadvised_inAP.push(preadvise);
        } else if (country.region === "Americas") {
            preadvised_inAM.push(preadvise);
        } else preadvised_inEU.push(preadvise);
        }
    }
    }

    let hasHistory = false
    if(history && history.length){
        hasHistory = true
    }

    // ----- For debugging purposes
    console.log(`"today" is registered as ${today}`)
    console.log(`"next30days" is registered as ${next30days}`)
    console.log(`"next90days" is registered as ${next90days}`)
    console.log(`"preadvised_inM" results are ${preadvised_inM}`)
    console.log(`"preadvised_inQ" results are ${preadvised_inQ}`)
    console.log(`"preadvised_inY" results are ${preadvised_inY}`)
    console.log(`"preadvised_inAM" results are ${preadvised_inAM}`)
    console.log(`"preadvised_inAP" results are ${preadvised_inAP}`)
    console.log(`"preadvised_inEU" results are ${preadvised_inEU}`)

    res.render("preadvise/preadvised_history.ejs", {
        hasHistory,
        countriesData,
        monthsData,
        today,
        next30days,
        next90days,
        allPreadvisedTenders,
        preadvised_past,
        preadvised_inM,
        preadvised_inQ,
        preadvised_inY,
        preadvised_inAM,
        preadvised_inAP,
        preadvised_inEU,
    });
})

module.exports.renderShowPage = catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let matchingTender = await PreadvisedTender.findById(matchingId).populate("register").populate("author");
    if (!matchingTender) {
        req.flash("error", "The preadvised tender with the given ID was not found.");
        return res.redirect("/preadvise/start");
    } else {
        let priviledge = false;
        if (req.user.isAdmin || req.user.isTenderTeam) {
            priviledge = true;
        }
        let editRestriction = false;
        if (matchingTender.author.id !== req.user.id || matchingTender.register) {
            editRestriction = true;
        }
        res.render("preadvise/preadvised_show.ejs", {
            countriesData,
            monthsData,
            tradelanes,
            transportModes,
            history,
            matchingTender,
            priviledge,
            editRestriction
        });
    }
})

module.exports.deletePreadvise = catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let matchingTender = await PreadvisedTender.findById(matchingId);
    let matchingTenderName = matchingTender.companyName;
    console.log(`${colors.black.bgBrightCyan("* ATTEMPT *")} A TENDER PRE-ADVISE has been selected for deletion: ${matchingTenderName}`);
    console.log(matchingTender);
    await preadviseTenderEmailCancellation(matchingId)
    await preadviseCancelTenderNotice(matchingId)
    await PreadvisedTender.findByIdAndDelete(matchingId);
    console.log(`${colors.black.bgBrightGreen("* OK *")} The TENDER PRE-ADVISE related to "${matchingTenderName}" has been deleted`);
    req.flash("success", "Preadvise tender has been deleted !");
    res.redirect("/preadvise/start");
})

module.exports.renderEditPage = catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let matchingTender = await PreadvisedTender.findById(matchingId);
    if (!matchingTender) {
        req.flash("error", "The preadvised tender with the given ID was not found.");
        return res.redirect("/preadvise/start");
    } else {
        res.render("preadvise/preadvised_edit.ejs", {
            countriesData,
            monthsData,
            matchingTender,
        });
    }
})

module.exports.renderLaunchPage = catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let preadviseTender = await PreadvisedTender.findById(matchingId);
    if (!preadviseTender) {
        req.flash("error", "The preadvised tender with the given ID was not found.");
        return res.redirect("/preadvise/start");
    } else {
        res.render("register/register_new.ejs", {
            countriesData,
            businessVerticals,
            preadviseTender,
        });
    }
})

module.exports.patchPreadvise = catchAsync(async function (req, res) {
    console.log(`${colors.black.bgBrightCyan("* ATTEMPT *")} A TENDER PRE-ADVISE has been selected for update: ${req.body.companyName}`);
    let matchingId = req.params.id;
    let newCompanyName = req.body.companyName;
    let newSugarID = req.body.sugarID;
    let newExpectedReceiveDate = req.body.expectedReceiveDate;
    let newTransportMode = req.body.transportMode;
    if (typeof newTransportMode != "object") {
    newTransportMode = [newTransportMode];
    }
    let newAirFreightVolume;
    if (!req.body.airFreightVol) {
    newAirFreightVolume = 0;
    } else {
    newAirFreightVolume = req.body.airFreightVol;
    }
    let newSeaFreightFCLVolume;
    if (!req.body.seaFreightFCLVol) {
    newSeaFreightFCLVolume = 0;
    } else {
    newSeaFreightFCLVolume = req.body.seaFreightFCLVol;
    }
    let newSeaFreightLCLVolume;
    if (!req.body.seaFreightLCLVol) {
    newSeaFreightLCLVolume = 0;
    } else {
    newSeaFreightLCLVolume = req.body.seaFreightLCLVol;
    }
    let newRailFreightVolume;
    if (!req.body.railFreightVol) {
    newRailFreightVolume = 0;
    } else {
    newRailFreightVolume = req.body.railFreightVol;
    }
    let newKeyTradelanes = req.body.keyTradelanes;
    if (typeof newKeyTradelanes != "object") {
    newKeyTradelanes = [newKeyTradelanes];
    }
    let newHistory = req.body.history;
    let newExistingCustomerSegment;
    if (!req.body.existingCustomerSegment) {
    newExistingCustomerSegment = null;
    } else {
    newExistingCustomerSegment = req.body.existingCustomerSegment;
    }
    let newAdditionalComment;
    if (!req.body.additionalComment) {
    newAdditionalComment = null;
    } else {
    newAdditionalComment = req.body.additionalComment;
    }
    let newCountryLocation = req.body.countryLocation;

    await PreadvisedTender.findByIdAndUpdate(matchingId, {
    lastModifiedDate: currentDateAndTime(),
    launched: false,
    launchedTime: null,
    companyName: newCompanyName,
    sugarID: newSugarID,
    expectedReceiveDate: newExpectedReceiveDate,
    transportMode: newTransportMode,
    airFreightVolume: newAirFreightVolume,
    seaFreightFCLVolume: newSeaFreightFCLVolume,
    seaFreightLCLVolume: newSeaFreightLCLVolume,
    railFreightVolume: newRailFreightVolume,
    keyTradelanes: newKeyTradelanes,
    history: newHistory,
    existingCustomerSegment: newExistingCustomerSegment,
    additionalComment: newAdditionalComment,
    countryLocation: newCountryLocation,
    });
    console.log(`${colors.black.bgBrightGreen("* OK *")} The TENDER PRE-ADVISE related to "${newCompanyName}" has been updated`);
    req.flash("success", "Preadvise tender is successfully modified !");
    res.redirect(`/preadvise/${matchingId}`);
})

module.exports.postReport = catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let matchingTender = await PreadvisedTender.findById(matchingId);
    let fileIdentifier = Date.now();
    await generatePreadviseReport(matchingId, fileIdentifier);
    await preadviseTenderEmailConfirmation(matchingId, fileIdentifier)

    fs.unlink(`./reports/reportsGenerated/${matchingTender.companyName}_${fileIdentifier}.pdf`, function (err) {
    if (err) {
        console.error(err)
        return
    }
    })
    console.log(`${colors.black.bgBrightGreen("* OK *")} The PDF report related to the preadvise of ${matchingTender.companyName} has been deleted from the server`);

    req.flash("success", "The report has been sent by email.");
    res.redirect(`/preadvise/${matchingId}`);
})