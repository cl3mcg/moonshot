const express = require('express');
const router = express.Router({ mergeParams: true });

// ----- Database models
const PreadvisedTender = require("../models/preadvisedTender.js");

// ----- Ressources required

const colors = require("colors");
const { preadviseSchema } = require("../utilities/joiSchemas.js");
const countriesData = require("../public/ressources/countries.json");
const monthsData = require("../public/ressources/months.json");
const tradelanes = require("../public/ressources/tradelanes.json");
const history = require("../public/ressources/history.json");
const transportModes = require("../public/ressources/transportModes.json");
const businessVerticals = require("../public/ressources/businessVerticals.json");

// ----- catchAsync middleware used to handle Async functions errors

const catchAsync = require("../utilities/catchAsync.js");

// ----- Extended error class

const ExpressError = require("../utilities/expressError.js");

// ----- validatePreadvise middleware used with JOI to validate new preavised tenders according to JOI schema

const validatePreadvise = function (req, res, next) {
    const result = preadviseSchema.validate(req.body);
    if (result.error) {
      console.log(`${colors.brightYellow.bgBrightRed("*!* WARNING *!*")} JOI validation failed - validatePreadvise`);
      const errorMsg = result.error.details
        .map(function (element) {
          return element.message;
        })
        .join(",");
      throw new ExpressError(errorMsg, 400);
    } else {
      console.log(`${colors.black.bgBrightGreen("* OK *")} JOI validation passed - validatePreadvise`);
      next();
    }
  };

// ----- Commonly used functions
const currentDateAndTime = function () {
    return new Date(Date.now());
  };

// ----- Routes MOONSHOT PREADVISED

router.get("/start", function (req, res) {
    res.render("preadvised_start.ejs");
  });

router.get("/new", function (req, res) {
res.render("preadvised_new.ejs", { countriesData });
});

router.post("/new",validatePreadvise,catchAsync(async function (req, res, next) {
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
    console.log(
    `${colors.black.bgBrightGreen(
        "* OK *"
    )} A new TENDER PRE-ADVISE has been registered in the database: ${companyName}`
    );
    req.flash("success", "Preadvise tender is successfully saved !");
    res.redirect(`/preadvise/${newEntry.id}`);

//   let from = '"Tender registration" <appareil_en_ligne@outlook.com>';
//   let selectedEmail = "clement.chaibgalli@eu.rhenus.com"; // Enter the recipient email here
//   let subject = "Your tender has been preadvised";
//   let attachement = null;
//   // let attachement = [{
//   //     filename: 'Jean-Marie.jpg',
//   //     path: 'public/data/dummyAttachements/jm.jpg'
//   // }]
//   let emailBody = await ejs.renderFile("./emails/preadviseConfirm.ejs", {
//     userName: "Jean-Marie", // Enter the user name here
//     companyName: companyName, // Enter the company name here, it should be gathered from the form
//     preadviseId: newEntry.id, // Enter the preadvise ID here, it should be gathered after being saved in the database
//   });

//   const send = async function () {
//     let transporter = nodemailer.createTransport({
//       host: "smtp.office365.com",
//       port: 587,
//       secure: false, // true for 465, false for other ports
//       auth: {
//         user: "appareil_en_ligne@outlook.com", // generated ethereal user
//         pass: "xxxemailPasswordxxx", // generated ethereal password
//       },
//     });

//     let info = await transporter.sendMail({
//       from: from, // sender address
//       to: selectedEmail, // list of receivers
//       subject: subject, // Subject line
//       html: emailBody, // html body
//       attachments: attachement,
//     });
//   };

// //   Nodemailer launch function - Uncomment below to enable to email launch.
//   try {
//     await send();
//     console.log(
//       `An email with the information related to the TENDER PRE-ADVISE of the company ${companyName}, has been sent`
//     );
//   } catch (error) {
//     console.log(error);
//     res.send("ERROR ! Check console...");
//   }
})
);

router.get("/index",catchAsync(async function (req, res) {
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

    res.render("preadvised_index.ejs", {
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
);

router.get("/:id",catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let matchingTender = await PreadvisedTender.findById(matchingId);
    if (!matchingTender) {
        req.flash("error", "The preadvised tender with the given ID was not found.");
        return res.redirect("/preadvise/start");
    } else {
        res.render("preadvised_show.ejs", {
            countriesData,
            monthsData,
            tradelanes,
            transportModes,
            history,
            matchingTender,
        });
    }
})
);

router.delete("/:id",catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let matchingTender = await PreadvisedTender.findById(matchingId);
    let matchingTenderName = matchingTender.companyName;
    console.log(`${colors.black.bgBrightCyan("* ATTEMPT *")} A TENDER PRE-ADVISE has been selected for deletion: ${matchingTenderName}`);
    console.log(matchingTender);
    await PreadvisedTender.findByIdAndDelete(matchingId);
    console.log(`${colors.black.bgBrightGreen("* OK *")} The TENDER PRE-ADVISE related to "${matchingTenderName}" has been deleted`);
    req.flash("success", "Preadvise tender has been deleted !");
    res.redirect("/preadvise/start");
})
);

router.get("/edit/:id",catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let matchingTender = await PreadvisedTender.findById(matchingId);
    if (!matchingTender) {
        req.flash("error", "The preadvised tender with the given ID was not found.");
        return res.redirect("/preadvise/start");
    } else {
        res.render("preadvised_edit.ejs", {
            countriesData,
            monthsData,
            matchingTender,
        });
    }
})
);

router.get("/launch/:id",catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let preadviseTender = await PreadvisedTender.findById(matchingId);
    if (!preadviseTender) {
        req.flash("error", "The preadvised tender with the given ID was not found.");
        return res.redirect("/preadvise/start");
    } else {
        res.render("register_new.ejs", {
            countriesData,
            businessVerticals,
            preadviseTender,
        });
    }
})
);

router.patch("/edit/:id",validatePreadvise, catchAsync(async function (req, res) {
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
);

// ----- Export the router
module.exports = router;