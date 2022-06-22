const express = require('express');
const router = express.Router({ mergeParams: true });

// ----- Database models
// const PreadvisedTender = require("../models/preadvisedTender.js");

// ----- Ressources required

// const ejs = require("ejs");
// const colors = require("colors");
// const fs = require("fs").promises;
// const { preadviseSchema } = require("../utilities/joischemas.js");
// const nodemailer = require("nodemailer");
// const countriesData = require("../public/ressources/countries.json");
// const monthsData = require("../public/ressources/months.json");
// const tradelanes = require("../public/ressources/tradelanes.json");
// const history = require("../public/ressources/history.json");
// const transportModes = require("../public/ressources/transportModes.json");
// const businessVerticals = require("../public/ressources/businessVerticals.json");

// ----- catchAsync middleware used to handle Async functions errors

const catchAsync = require("../utilities/catchasync.js");


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

// const preadviseTenderEmailConfirmation = require("../utilities/preadviseemail.js");

// ----- Commonly used functions

// const {
//   findCountryName,
//   findcca2,
//   findSubRegion,
//   findResponsibleTenderOffice,
//   currentDateAndTime,
//   formatDate,
//   capitalize
// } = require("../utilities/commonfunctions.js");

// ----- Controllers used for PREADVISE TENDERS ROUTES

const preadviseCtrl = require("../controllers/preadvise_ctrl.js");

// ----- Routes MOONSHOT PREADVISED

router.get("/start", isLoggedIn, preadviseCtrl.renderStartPage);

router.route("/new")
  .get(isLoggedIn, preadviseCtrl.renderNewPage)
  .post(isLoggedIn, validatePreadvise, preadviseCtrl.createPreadvise)

// router.get("/new", isLoggedIn, preadviseCtrl.renderNewPage);

// router.post("/new", isLoggedIn, validatePreadvise, preadviseCtrl.createPreadvise);

router.get("/index", isLoggedIn, preadviseCtrl.renderIndexPage);

router.get("/history", isLoggedIn, preadviseCtrl.renderHistoryPage);

router.route("/:id")
  .get(isLoggedIn, preadviseCtrl.renderShowPage)
  .delete(isLoggedIn, preadviseCtrl.deletePreadvise)

// router.get("/:id", isLoggedIn, preadviseCtrl.renderShowPage);

// router.delete("/:id", isLoggedIn, preadviseCtrl.deletePreadvise);

router.route("/edit/:id")
  .get(isLoggedIn, preadviseCtrl.renderEditPage)
  .patch(isLoggedIn, validatePreadvise, preadviseCtrl.patchPreadvise)

// router.get("/edit/:id", isLoggedIn, preadviseCtrl.renderEditPage);

// router.patch("/edit/:id", isLoggedIn, validatePreadvise, preadviseCtrl.patchPreadvise);

router.get("/launch/:id", isLoggedIn, preadviseCtrl.renderLaunchPage);

router.post("/report/:id", isLoggedIn, preadviseCtrl.postReport);

// router.get("/excelReport", isLoggedIn, catchAsync(async function (req, res) {
//     let fileName = `excelReport_${Date.now()}`
//         generatePreadviseExcelReport(fileName)
//         req.flash("sucess", "The preadvised tender Excel report has been generated.");
//         return res.redirect("/preadvise/start");
//   })
//   );

// ----- Export the router
module.exports = router;