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

// ----- generatePreadviseReport function used to generate the preadvise pdf report

const generatePreadviseReport = require("../utilities/generatepreadvisereport.js");
const generatePreadviseExcelReport = require("../utilities/generatepreadviseexcelreport.js");

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

// ----- Routes MOONSHOT PREADVISED

router.get("/start", isLoggedIn, isTenderTeam, function (req, res) {
    res.render("dashboard/dashboard_start.ejs");
  });

// ----- Export the router
module.exports = router;