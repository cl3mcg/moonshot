const express = require('express');
const router = express.Router({ mergeParams: true });

// ----- Database models
const RegisteredTender = require("../models/registeredTender.js");

// ----- Ressources required

const ejs = require("ejs");
const colors = require("colors");
const fs = require("fs").promises;
const { preadviseSchema } = require("../utilities/joiSchemas.js");
const nodemailer = require("nodemailer");
const countriesData = require("../public/ressources/countries.json");
const monthsData = require("../public/ressources/months.json");
const tradelanes = require("../public/ressources/tradelanes.json");
const history = require("../public/ressources/history.json");
const transportModes = require("../public/ressources/transportModes.json");
const businessVerticals = require("../public/ressources/businessVerticals.json");
const tenderLaunchMethod = require("../public/ressources/tenderLaunchMethod.json")
const decisionCriteria = require("../public/ressources/decisionCriteria.json")

// ----- catchAsync middleware used to handle Async functions errors

const catchAsync = require("../utilities/catchAsync.js");

// ----- Extended error class

const ExpressError = require("../utilities/expressError.js");
const {
  testSenderName,
  testReceiverEmail,
  testSenderEmail,
  testSenderEmailPassword
} = require('../secrets.js');
// const testSenderName = process.env.testSenderName
// const testReceiverEmail = process.env.testReceiverEmail
// const testSenderEmail = process.env.testSenderEmail
// const testSenderEmailPassword = process.env.testSenderEmailPassword

// ----- generatePreadviseReport function used to generate the preadvise pdf report

const generatePreadviseReport = require("../utilities/generatePreadviseReport.js");
const generatePreadviseExcelReport = require("../utilities/generatePreadviseExcelReport.js");

// ----- Commonly used functions

const {
  findCountryName,
  findcca2,
  findSubRegion,
  findResponsibleTenderOffice,
  currentDateAndTime,
  formatDate,
  capitalize
} = require("../utilities/commonFunctions.js");

// ----- Routes MOONSHOT PREADVISED

router.get("/start", function (req, res) {
    res.render("dashboard/dashboard_start.ejs");
  });

// ----- Export the router
module.exports = router;