const express = require('express');
const router = express.Router({ mergeParams: true });

// ----- Database models
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

// ----- Controllers used for DASHBOARD ROUTES

const dashboardCtrl = require("../controllers/dashboard_ctrl.js");

// ----- Routes MOONSHOT DASHBOARD

router.get("/start", isLoggedIn, isTenderTeam, dashboardCtrl.renderStartPage);

router.get("/reporting", isLoggedIn, isTenderTeam, dashboardCtrl.renderReportsPage);

router.post("/issueReport/:type", isLoggedIn, isTenderTeam, dashboardCtrl.issueReport);

router.get("/visual", isLoggedIn, isTenderTeam, dashboardCtrl.renderVisualPage);

// ----- Export the router
module.exports = router;