// ----- Database models

const PreadvisedTender = require("../models/preadvisedTender.js");
const RegisteredTender = require("../models/registeredTender.js");

// ----- Ressources required

const colors = require("colors");
const ejs = require("ejs");
const fs = require("fs").promises;
const nodemailer = require("nodemailer");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const { preadviseSchema, registerSchema, decisionSchema } = require("../utilities/joischemas.js");
const countriesData = require("../public/ressources/countries.json");
const monthsData = require("../public/ressources/months.json");
const tradelanes = require("../public/ressources/tradelanes.json");
const decisionCriteria = require("../public/ressources/decisionCriteria.json");
const history = require("../public/ressources/history.json");
const reasonForTender = require("../public/ressources/reasonForTender.json")
const tenderLaunchMethod = require("../public/ressources/tenderLaunchMethod.json");
const transportModes = require("../public/ressources/transportModes.json");
const transportScope = require("../public/ressources/transportScope.json");
const visitHistory = require("../public/ressources/visitHistory.json");
const volumeSplit = require("../public/ressources/volumeSplit.json");
const bidRestrictions = require("../public/ressources/bidRestrictions.json");
const bidRequirements = require("../public/ressources/bidRequirements.json");
const businessVerticals = require("../public/ressources/businessVerticals.json");
const specialHandling = require("../public/ressources/specialHandling.json");
const freightForwarders = require("../public/ressources/freightForwarders.json");
const { uploadFile, downloadFile, deleteFile }  = require("../utilities/s3.js");

// ----- catchAsync middleware used to handle Async functions errors

const catchAsync = require("../utilities/catchasync.js");

// const testSenderName = process.env.testSenderName
// const testReceiverEmail = process.env.testReceiverEmail
// const testSenderEmail = process.env.testSenderEmail
// const testSenderEmailPassword = process.env.testSenderEmailPassword

// ----- Extended error class

const ExpressError = require("../utilities/expresserror.js");

// ----- Middleware used

const {
  // ----- isLoggedIn middleware used to check if the user is properly logged in - Check the value of req.user stored in Express Session
  isLoggedIn,
  // ----- validateRegister middleware used with JOI to validate new registered tenders according to JOI schema
  validateRegister,
  validateDecision
} = require("../utilities/middleware.js");

// ----- generateRegisterReport function used to generate the register pdf report

const generateRegisterReport = require("../utilities/generateregisterreport.js");
const generateRegisterExcelReport = require("../utilities/generateregisterexcelreport.js");

// ----- registerTenderEmailConfirmation function used to send emails related to registered tenders operations

const registerTenderEmailConfirmation = require("../utilities/registeremail.js");

// ----- Commonly used functions
// const currentDateAndTime = function () {
//     return new Date(Date.now());
//   };
const {
  findCountryName,
  findcca2,
  findSubRegion,
  findResponsibleTenderOffice,
  capitalize,
  currentDateAndTime,
  formatDate
} = require("../utilities/commonfunctions.js");

  // ----- ----- The function below is used to retrieve the contents of a folder (typically the document upload folder)
  // ----- ----- the function listFiles() can be called (with await !! It's an async !!) and the result provided would be an array.
  // ----- ----- more informationa available at https://dev.to/sinedied/work-with-files-and-directories-in-a-node-js-app-4kh8
  // ----- ----- refer to the part called "List directories contents"
//   let listFiles = async function (folderId) {
//     try {
//       let id = folderId;
//       let fileList = await fs.readdir(`./uploads/${id}`);
//       if (typeof fileList != "object") {
//         fileList = [fileList];
//       }
//       return fileList;
//     } catch (error) {
//       return null;
//     }
//   };

// ----- Controllers for MOONSHOT REGISTER TENDERS

module.exports.renderStartPage = function (req, res) {
    res.render("register/register_start.ejs");
};

module.exports.renderNewPage = function (req, res) {
    let preadviseTender = null;
    res.render("register/register_new.ejs", {
        countriesData,
        businessVerticals,
        preadviseTender,
    });
};

module.exports.createRegister = catchAsync(async function (req, res) {
    console.log(`${colors.black.bgBrightCyan("* ATTEMPT *")} A new TENDER REGISTRATION submit has been attempted`);
    console.log(req.body);
    console.log(req.files);

    let preadvise = null;
    if (req.body.isPreadvised === "yes") {
        let checkingPreadvise = await PreadvisedTender.findById(req.body.preadviseID);
        if (checkingPreadvise) {
        preadvise = checkingPreadvise;
        await PreadvisedTender.findByIdAndUpdate(req.body.preadviseID, {
            launched: true,
            launchedTime: currentDateAndTime(),
            });
    }

    let companyName = req.body.companyName;
    let sugarID = req.body.sugarID;
    let businessVertical = req.body.businessVertical;
    let contactName = req.body.contactName;
    let contactJobTitle = req.body.contactJobTitle;
    let contactEmail = req.body.contactEmail;
    let decisionMaker = req.body.decisionMaker;
    let transportMode = req.body.transportMode;
    if (typeof transportMode != "object") {
        transportMode = [transportMode];
    }
    let airFreightVol;
    if (!req.body.airFreightVol) {
        airFreightVol = 0;
    } else {
        airFreightVol = req.body.airFreightVol;
    }
    let seaFreightFCLVol;
    if (!req.body.seaFreightFCLVol) {
        seaFreightFCLVol = 0;
    } else {
        seaFreightFCLVol = req.body.seaFreightFCLVol;
    }
    let seaFreightLCLVol;
    if (!req.body.seaFreightLCLVol) {
        seaFreightLCLVol = 0;
    } else {
        seaFreightLCLVol = req.body.seaFreightLCLVol;
    }
    let railFreightVol;
    if (!req.body.railFreightVol) {
        railFreightVol = 0;
    } else {
        railFreightVol = req.body.railFreightVol;
    }
    let keyTradelanes = req.body.keyTradelanes;
    if (typeof keyTradelanes != "object") {
        keyTradelanes = [keyTradelanes];
    }
    let commodity = req.body.commodity;
    let specialHandling;
    if (!req.body.specialHandling) {
        specialHandling = [null];
    } else {
        specialHandling = req.body.specialHandling;
        if (typeof specialHandling != "object") {
        specialHandling = [specialHandling];
        }
    }
    let linkedRFI = req.body.linkedRFI;
    let deadlineRFI;
    if (linkedRFI === "yes") {
        linkedRFI = true;
        deadlineRFI = req.body.deadlineRFI;
    } else {
        linkedRFI = false;
        deadlineRFI = null;
    }
    let receptionDate = req.body.receptionDate;
    let deadlineRFQ = req.body.deadlineRFQ;
    let decisionDate = req.body.decisionDate;
    let startBusinessDate = req.body.startBusinessDate;
    if (typeof keyTradelanes != "object") {
        keyTradelanes = [keyTradelanes];
    }
    let lanesAmount = req.body.lanesAmount;
    let transportationScope = req.body.transportationScope;
    if (typeof transportationScope != "object") {
        transportationScope = [transportationScope];
    }
    let ratesValidityAir;
    if (airFreightVol === 0) {
        ratesValidityAir = null;
    } else {
        ratesValidityAir = req.body.ratesValidityAir;
    }
    let ratesValidityFCL;
    if (seaFreightFCLVol === 0) {
        ratesValidityFCL = null;
    } else {
        ratesValidityFCL = req.body.ratesValidityFCL;
    }
    let ratesValidityLCL;
    if (seaFreightLCLVol === 0) {
        ratesValidityLCL = null;
    } else {
        ratesValidityLCL = req.body.ratesValidityLCL;
    }
    let ratesValidityRail;
    if (railFreightVol === 0) {
        ratesValidityRail = null;
    } else {
        ratesValidityRail = req.body.ratesValidityRail;
    }
    let contractPeriod = req.body.contractPeriod;
    let paymentTerms = req.body.paymentTerms;
    let bidRestrictions = req.body.bidRestrictions;
    if (typeof bidRestrictions != "object") {
        bidRestrictions = [bidRestrictions];
    }
    let bidRequirements = req.body.bidRequirements;
    if (typeof bidRequirements != "object") {
        bidRequirements = [bidRequirements];
    }
    let roundsAmount = req.body.roundsAmount;
    let tenderLaunchMethod = req.body.tenderLaunchMethod;
    let history = req.body.history;
    let existingCustomerSegment;
    if (!req.body.existingCustomerSegment) {
        existingCustomerSegment = null;
    } else {
        existingCustomerSegment = req.body.existingCustomerSegment;
    }
    let visitFrequency = req.body.visitFrequency;
    let visitHistory = req.body.visitHistory;
    let currentServiceProvider = req.body.currentServiceProvider;
    let competitorAmount = req.body.competitorAmount;
    let volumeSplit = req.body.volumeSplit;
    let reasonForTender = req.body.reasonForTender;
    let decisionCritera = req.body.decisionCritera;
    let feedbackAvailable = req.body.feedbackAvailable;
    let potential = req.body.potential;
    let additionalComment = req.body.additionalComment;
    let countryLocation = req.body.countryLocation;
    let documentUpload = [];

    let filesUploaded = req.files
    console.log(`Files uploaded: ${filesUploaded}`);
    for (let file of filesUploaded) {
        documentUpload.push(file);
    }
    for (let file of filesUploaded) {
        const s3Results = await uploadFile(file);
        console.log(s3Results)
        console.log(`${file.originalname} has been uploaded to S3`)
        fs.unlink(`./${file.path}`, function (err) {
            if (err) {
            console.error(err)
            return
            }
        })
        console.log(`${file.originalname} was deleted from the server`)
    }
    
    let newEntry = new RegisteredTender({
        recordDate: currentDateAndTime(),
        author: req.user._id,
        lastModifiedDate: null,
        preadvise: preadvise,
        companyName: companyName,
        sugarID: sugarID,
        businessVertical: businessVertical,
        contactName: contactName,
        contactJobTitle: contactJobTitle,
        contactEmail: contactEmail,
        decisionMaker: decisionMaker,
        transportMode: transportMode,
        airFreightVolume: airFreightVol,
        seaFreightFCLVolume: seaFreightFCLVol,
        seaFreightLCLVolume: seaFreightLCLVol,
        railFreightVolume: railFreightVol,
        commodity: commodity,
        specialHandling: specialHandling,
        linkedRFI: linkedRFI,
        deadlineRFI: deadlineRFI,
        receptionDate: receptionDate,
        deadlineRFQ: deadlineRFQ,
        decisionDate: decisionDate,
        startBusinessDate: startBusinessDate,
        keyTradelanes: keyTradelanes,
        lanesAmount: lanesAmount,
        transportationScope: transportationScope,
        ratesValidityAir: ratesValidityAir,
        ratesValidityFCL: ratesValidityFCL,
        ratesValidityLCL: ratesValidityLCL,
        ratesValidityRail: ratesValidityRail,
        contractPeriod: contractPeriod,
        paymentTerms: paymentTerms,
        bidRestrictions: bidRestrictions,
        bidRequirements: bidRequirements,
        roundsAmount: roundsAmount,
        tenderLaunchMethod: tenderLaunchMethod,
        history: history,
        existingCustomerSegment: existingCustomerSegment,
        visitFrequency: visitFrequency,
        visitHistory: visitHistory,
        currentServiceProvider: currentServiceProvider,
        competitorAmount: competitorAmount,
        volumeSplit: volumeSplit,
        reasonForTender: reasonForTender,
        decisionCritera: decisionCritera,
        feedbackAvailable: feedbackAvailable,
        documentUpload: documentUpload,
        potential: potential,
        additionalComment: additionalComment,
        countryLocation: countryLocation,
    });

    await newEntry.save();

    if (checkingPreadvise) {
        await PreadvisedTender.findByIdAndUpdate(req.body.preadviseID, {
        register: newEntry
        });
    }

    if (req.body.isPreadvised === "yes") {
        preadviseID = req.body.preadviseID;
        try {
        let updatedEntry = {
            launched: true,
            launchedTime: currentDateAndTime(),
        };
        await PreadvisedTender.findByIdAndUpdate(preadviseID, updatedEntry);
        } catch (err) {
        return res.status(500).send(err);
        }
    }

    console.log(newEntry);
    console.log(`${colors.black.bgBrightGreen("* OK *")} A new TENDER has been registered in the database: ${companyName}`);
    req.flash("success", "Tender is successfully registered !");
    res.redirect("/register/start");

    let fileIdentifier = Date.now();
    await generateRegisterReport(newEntry.id, fileIdentifier);
    await registerTenderEmailConfirmation(newEntry.id, fileIdentifier)

    fs.unlink(`./reports/reportsGenerated/${newEntry.companyName}_${fileIdentifier}.pdf`, function (err) {
        if (err) {
        console.error(err)
        return
        }
})
    console.log(`${colors.black.bgBrightGreen("* OK *")} The PDF report related to the registration of ${companyName} has been deleted from the server`);
}
});

module.exports.renderIndexPage = catchAsync(async function (req, res) {
    const d = new Date();
    const today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const d14 = new Date(d.setDate(d.getDate() + 14));
    const next14days = new Date(
        d14.getFullYear(),
        d14.getMonth(),
        d14.getDate()
    );

    // const registered_past = await RegisteredTender.find({"deadlineRFQ": {$lt: today}})
    // const registered_inM = await RegisteredTender.find({"deadlineRFQ": {$gte: today, $lte: next30days}})
    // const registered_inQ = await RegisteredTender.find({"deadlineRFQ": {$gt: next30days, $lte: next90days}})
    // const registered_inY = await RegisteredTender.find({"deadlineRFQ": {$gt: next90days}})
    // let allRegisteredTenders = await RegisteredTender.find({})

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

    const allRegisteredTenders = sortBy(await RegisteredTender.find({}), {
        prop: "deadlineRFQ",
    });
    const registered_past = sortBy(
        await RegisteredTender.find({ deadlineRFQ: { $lt: today } }),
        { prop: "deadlineRFQ" }
    );
    const registered_14d = sortBy(
        await RegisteredTender.find({
        deadlineRFQ: { $gt: today, $lte: next14days },
        }),
        { prop: "deadlineRFQ" }
    );
    const registered_after = sortBy(
        await RegisteredTender.find({ deadlineRFQ: { $gt: next14days } }),
        { prop: "deadlineRFQ" }
    );
    const registered_inAM = [];
    const registered_inAP = [];
    const registered_inEU = [];

    for (let register of allRegisteredTenders) {
        for (let country of countriesData) {
        if (country.cca2 === register.countryLocation) {
            if (
            country.region === "Europe" ||
            country.region === "Africa" ||
            country.subregion === "Central Asia" ||
            country.subregion === "Western Asia"
            ) {
            registered_inEU.push(register);
            } else if (
            country.region === "Asia" ||
            country.region === "Oceania"
            ) {
            registered_inAP.push(register);
            } else if (country.region === "Americas") {
            registered_inAM.push(register);
            } else registered_inEU.push(register);
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

    res.render("register/register_index.ejs", {
        countriesData,
        monthsData,
        today,
        next14days,
        allRegisteredTenders,
        registered_past,
        registered_14d,
        registered_after,
        registered_inAM,
        registered_inAP,
        registered_inEU,
    });
});

module.exports.renderHistoryPage = catchAsync(async function (req, res) {
    const d = new Date();
    const today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const d14 = new Date(d.setDate(d.getDate() + 14));
    const next14days = new Date(
        d14.getFullYear(),
        d14.getMonth(),
        d14.getDate()
    );

    // const registered_past = await RegisteredTender.find({"deadlineRFQ": {$lt: today}})
    // const registered_inM = await RegisteredTender.find({"deadlineRFQ": {$gte: today, $lte: next30days}})
    // const registered_inQ = await RegisteredTender.find({"deadlineRFQ": {$gt: next30days, $lte: next90days}})
    // const registered_inY = await RegisteredTender.find({"deadlineRFQ": {$gt: next90days}})
    // let allRegisteredTenders = await RegisteredTender.find({})

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
    });

    const allRegisteredTenders = sortBy(await RegisteredTender.find({author : req.user}), {
        prop: "deadlineRFQ",
    });
    const registered_past = sortBy(
        await RegisteredTender.find({
        deadlineRFQ: { $lt: today },
        author : req.user
        }),
        { prop: "deadlineRFQ" }
    );
    const registered_14d = sortBy(
        await RegisteredTender.find({
        deadlineRFQ: { $gt: today, $lte: next14days },
        author : req.user
        }),
        { prop: "deadlineRFQ" }
    );
    const registered_after = sortBy(
        await RegisteredTender.find({
        deadlineRFQ: { $gt: next14days },
        author : req.user
        }),
        { prop: "deadlineRFQ" }
    );
    const registered_inAM = [];
    const registered_inAP = [];
    const registered_inEU = [];

    for (let register of allRegisteredTenders) {
        for (let country of countriesData) {
        if (country.cca2 === register.countryLocation) {
            if (
            country.region === "Europe" ||
            country.region === "Africa" ||
            country.subregion === "Central Asia" ||
            country.subregion === "Western Asia"
            ) {
            registered_inEU.push(register);
            } else if (
            country.region === "Asia" ||
            country.region === "Oceania"
            ) {
            registered_inAP.push(register);
            } else if (country.region === "Americas") {
            registered_inAM.push(register);
            } else registered_inEU.push(register);
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

    res.render("register/register_history.ejs", {
        countriesData,
        monthsData,
        today,
        next14days,
        allRegisteredTenders,
        registered_past,
        registered_14d,
        registered_after,
        registered_inAM,
        registered_inAP,
        registered_inEU,
    });
});

module.exports.renderShowPage = catchAsync(async function (req, res) {
    const d = new Date();
    const today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    let matchingId = req.params.id;
    let matchingTender = await RegisteredTender.findById(matchingId).populate("preadvise").populate("author");
    if (!matchingTender) {
        req.flash("error", "Tender with the given ID was not found.");
        return res.redirect("/register/start");
    } else {
        //Below is a  function that checks if the decision date is passed
        //If the decision date is passed, the function returns true
        //If the decision date is not passed, the Tender Outcome button is disabled on the "show" page
        const decisionDate = new Date(matchingTender.decisionDate);
        const isDecisionDatePassed = decisionDate <= today;

        let isSubmitted
        if (matchingTender.tenderTeamSubmissionDate) {
        isSubmitted = true
        } else {
        isSubmitted = false
        }

        let priviledge = false;
        if (req.user.isAdmin || req.user.isTenderTeam) {
            priviledge = true;
        }
        let editRestriction = false;
        if (matchingTender.author.id !== req.user.id || matchingTender.tenderTeamDecision || matchingTender.outcome || matchingTender.tenderTeamSubmissionDate) {
            editRestriction = true;
        }
        console.log(matchingTender)
        res.render("register/register_show.ejs", {
        isDecisionDatePassed,
        isSubmitted,
        priviledge,
        editRestriction,
        countriesData,
        decisionCriteria,
        monthsData,
        reasonForTender,
        tenderLaunchMethod,
        tradelanes,
        transportModes,
        transportScope,
        visitHistory,
        volumeSplit,
        bidRestrictions,
        bidRequirements,
        history,
        specialHandling,
        matchingTender,
        capitalize
        });
    }
});

module.exports.tenderTeamDecision = catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let decision = req.params.decision;
    let matchingTender = await RegisteredTender.findById(matchingId);
    if (!matchingTender) {
        req.flash("error", "The tender with the given ID was not found.");
        return res.redirect("/register/start");
    } else if (decision !== "accept" && decision !== "decline") {
        req.flash("error", "The decision doesn't match the criterias");
        return res.redirect(`/register/${matchingId}`);
    } else {
        let updatedEntry = {
        tenderTeamDecision: decision,
        tenderTeamDecisionDate: currentDateAndTime(),
        tenderTeamDecisionMaker: "Tender team member",
        tenderTeamDecisionComment: req.body.tenderTeamDecisionComment,
        };
        console.log(updatedEntry)
        await RegisteredTender.findByIdAndUpdate(matchingId, updatedEntry);
        req.flash("success", "The decision has been updated.");
        return res.redirect("/register/index");
    }
});

module.exports.renderEditPage = catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let matchingTender = await RegisteredTender.findById(matchingId).populate("preadvise");
    if (!matchingTender) {
        req.flash("error", "The tender with the given ID was not found.");
        return res.redirect("/register/start");
    } else {
        // let filesUploaded = await listFiles(matchingId);
        res.render("register/register_edit.ejs", {
        countriesData,
        monthsData,
        businessVerticals,
        matchingTender,
        // filesUploaded,
        });
    }
});

module.exports.patchRegister = catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    console.log(`${colors.black.bgBrightCyan("* ATTEMPT *")} A new TENDER REGISTRATION edit has been attempted`);
    console.log(req.body);
    console.log(req.files);

    let newIsPreadvised = req.body.isPreadvised;
    let newPreadviseID;
    if (newIsPreadvised === "yes") {
        newIsPreadvised = true;
        newPreadviseID = req.body.preadviseID;
    } else {
        newIsPreadvised = false;
        newPreadviseID = null;
    }
    let newCompanyName = req.body.companyName;
    let newSugarID = req.body.sugarID;
    let newBusinessVertical = req.body.businessVertical;
    let newContactName = req.body.contactName;
    let newContactJobTitle = req.body.contactJobTitle;
    let newContactEmail = req.body.contactEmail;
    let newDecisionMaker = req.body.decisionMaker;
    let newTransportMode = req.body.transportMode;
    if (typeof newTransportMode != "object") {
        newTransportMode = [newTransportMode];
    }
    let newAirFreightVol;
    if (!req.body.airFreightVol) {
        newAirFreightVol = 0;
    } else {
        newAirFreightVol = req.body.airFreightVol;
    }
    let newSeaFreightFCLVol;
    if (!req.body.seaFreightFCLVol) {
        newSeaFreightFCLVol = 0;
    } else {
        newSeaFreightFCLVol = req.body.seaFreightFCLVol;
    }
    let newSeaFreightLCLVol;
    if (!req.body.seaFreightLCLVol) {
        newSeaFreightLCLVol = 0;
    } else {
        newSeaFreightLCLVol = req.body.seaFreightLCLVol;
    }
    let newRailFreightVol;
    if (!req.body.railFreightVol) {
        newRailFreightVol = 0;
    } else {
        newRailFreightVol = req.body.railFreightVol;
    }
    let newKeyTradelanes = req.body.keyTradelanes;
    if (typeof newKeyTradelanes != "object") {
        newKeyTradelanes = [newKeyTradelanes];
    }
    let newCommodity = req.body.commodity;
    let newSpecialHandling;
    if (!req.body.specialHandling) {
        newSpecialHandling = [null];
    } else {
        newSpecialHandling = req.body.specialHandling;
        if (typeof newSpecialHandling != "object") {
        newSpecialHandling = [newSpecialHandling];
        }
    }
    let newLinkedRFI = req.body.linkedRFI;
    let newDeadlineRFI;
    if (newLinkedRFI === "yes") {
        newLinkedRFI = true;
        newDeadlineRFI = req.body.deadlineRFI;
    } else {
        newLinkedRFI = false;
        newDeadlineRFI = null;
    }
    let newReceptionDate = req.body.receptionDate;
    let newDeadlineRFQ = req.body.deadlineRFQ;
    let newDecisionDate = req.body.decisionDate;
    let newStartBusinessDate = req.body.startBusinessDate;
    if (typeof newKeyTradelanes != "object") {
        newKeyTradelanes = [newKeyTradelanes];
    }
    let newLanesAmount = req.body.lanesAmount;
    let newTransportationScope = req.body.transportationScope;
    if (typeof newTransportationScope != "object") {
        newTransportationScope = [newTransportationScope];
    }
    let newRatesValidityAir;
    if (newAirFreightVol === 0) {
        newRatesValidityAir = null;
    } else {
        newRatesValidityAir = req.body.ratesValidityAir;
    }
    let newRatesValidityFCL;
    if (newSeaFreightFCLVol === 0) {
        newRatesValidityFCL = null;
    } else {
        newRatesValidityFCL = req.body.ratesValidityFCL;
    }
    let newRatesValidityLCL;
    if (newSeaFreightLCLVol === 0) {
        newRatesValidityLCL = null;
    } else {
        newRatesValidityLCL = req.body.ratesValidityLCL;
    }
    let newRatesValidityRail;
    if (newRailFreightVol === 0) {
        newRatesValidityRail = null;
    } else {
        newRatesValidityRail = req.body.ratesValidityRail;
    }
    let newContractPeriod = req.body.contractPeriod;
    let newPaymentTerms = req.body.paymentTerms;
    let newBidRestrictions = req.body.bidRestrictions;
    if (typeof newBidRestrictions != "object") {
        newBidRestrictions = [newBidRestrictions];
    }
    let newBidRequirements = req.body.bidRequirements;
    if (typeof newBidRequirements != "object") {
        newBidRequirements = [newBidRequirements];
    }
    let newRoundsAmount = req.body.roundsAmount;
    let newTenderLaunchMethod = req.body.tenderLaunchMethod;
    let newHistory = req.body.history;
    let newExistingCustomerSegment;
    if (!req.body.existingCustomerSegment) {
        newExistingCustomerSegment = null;
    } else {
        newExistingCustomerSegment = req.body.existingCustomerSegment;
    }
    let newVisitFrequency = req.body.visitFrequency;
    let newVisitHistory = req.body.visitHistory;
    let newCurrentServiceProvider = req.body.currentServiceProvider;
    let newCompetitorAmount = req.body.competitorAmount;
    let newVolumeSplit = req.body.volumeSplit;
    let newReasonForTender = req.body.reasonForTender;
    let newDecisionCritera = req.body.decisionCritera;
    let newFeedbackAvailable = req.body.feedbackAvailable;
    let newPotential = req.body.potential;
    let newAdditionalComment = req.body.additionalComment;
    let newCountryLocation = req.body.countryLocation;

    let registerToUpdate = await RegisteredTender.findById(matchingId);
    let newDocumentUpload = registerToUpdate.documentUpload;
    console.log("The value newDocumentUpload is:", newDocumentUpload)
    if (!newDocumentUpload || !newDocumentUpload.length) {
        newDocumentUpload = []
    }
    
    let newFilesUploaded = req.files
    if (newFilesUploaded.length) {
        console.log(`Files uploaded: ${newFilesUploaded}`);
        for (let file of newFilesUploaded) {
            newDocumentUpload.push(file);
        }
        for (let file of newFilesUploaded) {
            const s3Results = await uploadFile(file);
            console.log(s3Results)
            console.log(`${file.originalname} has been uploaded to S3`)
            fs.unlink(`./${file.path}`, function (err) {
                if (err) {
                console.error(err)
                return
                }
            })
            console.log(`${file.originalname} was deleted from the server`)
        }
    }

    let updatedEntry = {
        lastModifiedDate: currentDateAndTime(),
        isPreadvised: newIsPreadvised,
        preadviseID: newPreadviseID,
        countryLocation: newCountryLocation,
        companyName: newCompanyName,
        sugarID: newSugarID,
        businessVertical: newBusinessVertical,
        contactName: newContactName,
        contactJobTitle: newContactJobTitle,
        contactEmail: newContactEmail,
        decisionMaker: newDecisionMaker,
        transportMode: newTransportMode,
        airFreightVolume: newAirFreightVol,
        seaFreightFCLVolume: newSeaFreightFCLVol,
        seaFreightLCLVolume: newSeaFreightLCLVol,
        railFreightVolume: newRailFreightVol,
        commodity: newCommodity,
        specialHandling: newSpecialHandling,
        linkedRFI: newLinkedRFI,
        deadlineRFI: newDeadlineRFI,
        receptionDate: newReceptionDate,
        deadlineRFQ: newDeadlineRFQ,
        decisionDate: newDecisionDate,
        startBusinessDate: newStartBusinessDate,
        keyTradelanes: newKeyTradelanes,
        lanesAmount: newLanesAmount,
        transportationScope: newTransportationScope,
        ratesValidityAir: newRatesValidityAir,
        ratesValidityFCL: newRatesValidityFCL,
        ratesValidityLCL: newRatesValidityLCL,
        ratesValidityRail: newRatesValidityRail,
        contractPeriod: newContractPeriod,
        paymentTerms: newPaymentTerms,
        bidRestrictions: newBidRestrictions,
        bidRequirements: newBidRequirements,
        roundsAmount: newRoundsAmount,
        tenderLaunchMethod: newTenderLaunchMethod,
        history: newHistory,
        existingCustomerSegment: newExistingCustomerSegment,
        visitFrequency: newVisitFrequency,
        visitHistory: newVisitHistory,
        currentServiceProvider: newCurrentServiceProvider,
        competitorAmount: newCompetitorAmount,
        volumeSplit: newVolumeSplit,
        reasonForTender: newReasonForTender,
        decisionCritera: newDecisionCritera,
        feedbackAvailable: newFeedbackAvailable,
        documentUpload: newDocumentUpload,
        potential: newPotential,
        additionalComment: newAdditionalComment
    };

    await RegisteredTender.findByIdAndUpdate(matchingId, updatedEntry);


    let matchingRegister = await RegisteredTender.findById(matchingId)
    if (req.body.toDeleteDoc) {
        console.log(`matchingRegister is ${matchingRegister}`)
        let existingUploads = matchingRegister.documentUpload
        console.log(`existingUploads is ${existingUploads}`)
        let toDeleteDocuments = req.body.toDeleteDoc
        if (typeof toDeleteDocuments != 'object') {
            toDeleteDocuments = [toDeleteDocuments]
        }
        console.log(`toDeleteDocuments is ${toDeleteDocuments}`)
        if (toDeleteDocuments) {
            // Remove the documents from the MongoDb database
            for (let doc of toDeleteDocuments) {
                console.log(`doc is ${doc}`)
                await RegisteredTender.findByIdAndUpdate(matchingId, {
                    $pull: {
                        documentUpload: { filename: { $in: req.body.toDeleteDoc } }
                    }
                })
            }
            console.log("Files should have been pulled out of the documentUpload array")
            // Remove the documents from the S3 bucket
            for (let upload of existingUploads) {
                if (toDeleteDocuments.includes(upload.filename)) {
                    await deleteFile(upload);
                    console.log(`${upload.originalname} was deleted from S3`)
                }
            }
        }
    }

    console.log(`${colors.black.bgBrightGreen("* OK *")} The TENDER data related to ${newCompanyName} has been updated in the database`);
    req.flash("success", "Tender is successfully modified !");
    res.redirect("/register/start");
});

module.exports.deleteRegister = catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let matchingTender = await RegisteredTender.findById(matchingId);
    if (!matchingTender) {
        req.flash("error", "The tender with the given ID was not found.");
        res.redirect("/register/start");
    } else {
        console.log(matchingTender);
        let matchingTenderName = matchingTender.companyName;
        console.log(`${colors.black.bgBrightCyan("* ATTEMPT *")} A TENDER REGISTRATION has been selected for deletion: ${matchingTenderName}`);
        console.log(matchingTender);
        await RegisteredTender.findByIdAndDelete(matchingId);
        console.log(
        `${colors.black.bgBrightGreen("* OK *")} The TENDER REGISTRATION related to "${matchingTenderName}" has been deleted`
        );
        if (matchingTender.documentUpload.length > 0) {
            // Remove all the documents from the S3 bucket
            for (let upload of matchingTender.documentUpload) {
                await deleteFile(upload);
                console.log(`${upload.originalname} was deleted from S3`)
            }
        }
        req.flash("success", "Tender has been deleted !");
        res.redirect("/register/start");
    }
});

module.exports.downloadDocument = catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let docId = req.params.docId;
    let matchingTender = await RegisteredTender.findById(matchingId);
    if (!matchingTender) {
        req.flash("error", "The tender with the given ID was not found.");
        res.redirect("/register/start");
    } else {
        let matchingTenderDocs = matchingTender.documentUpload
        if (!matchingTenderDocs) {
            req.flash("error", "The document with the given ID was not found.");
            res.redirect("/register/start");
        } else {
            let matchingTenderDoc = await matchingTenderDocs.find(doc => doc.filename == docId);
            if (!matchingTenderDoc) {
                req.flash("error", "The document with the given ID was not found.");
                res.redirect("/register/start");
            } else {
                await downloadFile(matchingTenderDoc);
                const file = `./downloads/${matchingTenderDoc.originalname}`;
                res.download(file);
            }
        }
    }
})

module.exports.postReport = catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let matchingTender = await RegisteredTender.findById(matchingId);
    let fileIdentifier = Date.now();
    await generateRegisterReport(matchingId, fileIdentifier);
    await registerTenderEmailConfirmation(matchingId, fileIdentifier)

    fs.unlink(`./reports/reportsGenerated/${matchingTender.companyName}_${fileIdentifier}.pdf`, function (err) {
    if (err) {
        console.error(err)
        return
    }
    })
    console.log(`${colors.black.bgBrightGreen("* OK *")} The PDF report related to the register of ${matchingTender.companyName} has been deleted from the server`);

    req.flash("success", "The report has been sent by email.");
    res.redirect(`/register/${matchingId}`);
})

module.exports.renderOutcomePage = catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let matchingTender = await RegisteredTender.findById(matchingId);
    if (!matchingTender) {
        req.flash("error", "The tender with the given ID was not found.");
        res.redirect("/register/start");
    } else {
        res.render("register/register_outcome.ejs", { 
            matchingTender,
            countriesData
        });
    }
})

module.exports.registerOutcome = catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let matchingTender = await RegisteredTender.findById(matchingId);
    if (!matchingTender) {
        req.flash("error", "The tender with the given ID was not found.");
        res.redirect("/register/start");
    }
    let result = req.params.result;
    const rangeOfValidResults = ["positive", "negative", "unknown"]
    if (!rangeOfValidResults.includes(result)){
        req.flash("error", "The result provided is not valid.");
        res.redirect("/register/start");
    }
    let updatedEntry
    if (result === "positive") {
            let awardResults = req.body.outcomeTenderResult
            let awardVolumeSplit
            if (typeof req.body.awardVolumeSplit != "object") {
                awardVolumeSplit = [req.body.awardVolumeSplit]
            } else {
                awardVolumeSplit = req.body.awardVolumeSplit
            }
            let awardReceiveDate = new Date(req.body.outcomeAwardReceiveDate)
            let expectedBusinessStartDate = new Date(req.body.outcomeExpectedBusinessStartDate)
            let expectedTurnover = Number(req.body.outcomeExpectedTurnover)
            let expectedAirfreightVol = Number(req.body.outcomeExpectedAirfreightVol)
            let expectedSeafreightFCLVol = Number(req.body.outcomeExpectedSeafreightFCLVol)
            let expectedSeafreightLCLVol = Number(req.body.outcomeExpectedSeafreightLCLVol)
            let expectedRailfreightFCLVol = Number(req.body.outcomeExpectedRailfreightFCLVol)
            let outcomeAdditionalComment = req.body.outcomeAdditionalComment

            updatedEntry = {
                outcome: "positive",
                outcomeDetails : {
                    awardResults: awardResults,
                    awardVolumeSplit: awardVolumeSplit,
                    awardReceiveDate: awardReceiveDate,
                    expectedBusinessStartDate: expectedBusinessStartDate,
                    expectedTurnover: expectedTurnover,
                    expectedAirfreightVol : expectedAirfreightVol,
                    expectedSeafreightFCLVol: expectedSeafreightFCLVol,
                    expectedSeafreightLCLVol: expectedSeafreightLCLVol,
                    expectedRailfreightFCLVol: expectedRailfreightFCLVol,
                    outcomeAdditionalComment: outcomeAdditionalComment
                }
            }
    } else if (result === "negative") {
        let changeProvider = req.body.outcomeChangeProvider
        let pricingComment = req.body.outcomePricingComment
        let ITComment = req.body.outcomeITComment
        let networkComment = req.body.outcomeNetworkComment
        let conceptComment = req.body.outcomeConceptComment
        let improvementComment = req.body.outcomeImprovementComment
        let nextStepsComment = req.body.outcomeNextStepsComment
        let preparationComment = req.body.outcomePreparationComment
        let pricingPonderation = Number(req.body.outcomePricingPonderation)
        let transitTimePonderation = Number(req.body.outcomeTransitTimePonderation)
        let scopeResponsePonderation = Number(req.body.outcomeScopeResponsePonderation)
        let relationshipPonderation = Number(req.body.outcomeRelationshipPonderation)
        let networkCoveragePonderation = Number(req.body.outcomeNetworkCoveragePonderation)
        let valueAddedServicesPonderation = Number(req.body.outcomeValueAddedServicesPonderation)
        let ITSolutionsPonderation = Number(req.body.outcomeITSolutionsPonderation)
        let overallConceptPonderation = Number(req.body.outcomeOverallConceptPonderation)

        let newProvider
        if (req.body.outcomeNewProviderUnknown && !req.body.outcomeNewProvider) {
            newProvider = "unknown"
        } else if (req.body.outcomeNewProvider) {
            newProvider = req.body.outcomeNewProvider
        } else {
            newProvider = null
        }

        let additionalComment = req.body.outcomeAdditionalComment

        updatedEntry = {
            outcome: "negative",
            outcomeDetails : {
                changeProvider: changeProvider,
                pricingComment: pricingComment,
                ITComment: ITComment,
                networkComment: networkComment,
                conceptComment: conceptComment,
                improvementComment: improvementComment,
                nextStepsComment: nextStepsComment,
                preparationComment: preparationComment,
                pricingPonderation: pricingPonderation,
                transitTimePonderation: transitTimePonderation,
                scopeResponsePonderation: scopeResponsePonderation,
                relationshipPonderation: relationshipPonderation,
                networkCoveragePonderation: networkCoveragePonderation,
                valueAddedServicesPonderation: valueAddedServicesPonderation,
                ITSolutionsPonderation: ITSolutionsPonderation,
                overallConceptPonderation: overallConceptPonderation,
                newProvider: newProvider,
                outcomeAdditionalComment: additionalComment
            }
        }
    } else if (result === "unknown") {
        updatedEntry = {
            outcome: "unknown",
            outcomeDetails : {
                outcomeAdditionalComment: req.body.outcomeAdditionalComment
            }
        }
    }

    await RegisteredTender.findByIdAndUpdate(matchingId, updatedEntry);

    console.log(updatedEntry)
    req.flash("success", "The tender outcome has been registered.");
    res.redirect(`/register/${matchingId}`)
})

module.exports.registerSubmitted = catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let matchingTender = await RegisteredTender.findById(matchingId);
    if (!matchingTender) {
        req.flash("error", "The tender with the given ID was not found.");
        res.redirect("/register/start");
    }
    let today = currentDateAndTime()
    let updatedEntry = {
        tenderTeamSubmissionDate: today
    }
    await RegisteredTender.findByIdAndUpdate(matchingId, updatedEntry);
    console.log(`${colors.black.bgBrightGreen("* OK *")} The TENDER related to ${matchingTender.companyName} has been marked as submitted`);
    req.flash("success", "Tender is marked as submitted !");
    res.redirect(`/register/${matchingId}`);
})