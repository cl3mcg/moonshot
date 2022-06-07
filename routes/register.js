const express = require('express');
const router = express.Router({ mergeParams: true });

// ----- Database models
const PreadvisedTender = require("../models/preadvisedTender.js");
const RegisteredTender = require("../models/registeredTender.js");

// ----- Ressources required

const colors = require("colors");
const ejs = require("ejs");
const fs = require("fs").promises;
const nodemailer = require("nodemailer");
const { preadviseSchema, registerSchema, decisionSchema } = require("../utilities/joiSchemas.js");
const countriesData = require("../public/ressources/countries.json");
const monthsData = require("../public/ressources/months.json");
const tradelanes = require("../public/ressources/tradelanes.json");
const history = require("../public/ressources/history.json");
const transportModes = require("../public/ressources/transportModes.json");
const transportScope = require("../public/ressources/transportScope.json");
const bidRestrictions = require("../public/ressources/bidRestrictions.json");
const bidRequirements = require("../public/ressources/bidRequirements.json");
const businessVerticals = require("../public/ressources/businessVerticals.json");
const specialHandling = require("../public/ressources/specialHandling.json");
const freightForwarders = require("../public/ressources/freightForwarders.json");

// ----- catchAsync middleware used to handle Async functions errors

const catchAsync = require("../utilities/catchAsync.js");
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

// ----- Extended error class

const ExpressError = require("../utilities/expressError.js");

// ----- Middleware used

const {
  // ----- isLoggedIn middleware used to check if the user is properly logged in - Check the value of req.user stored in Express Session
  isLoggedIn,
  // ----- validateRegister middleware used with JOI to validate new registered tenders according to JOI schema
  validateRegister,
  validateDecision
} = require("../utilities/middleware.js");

// ----- generateRegisterReport function used to generate the register pdf report

const generateRegisterReport = require("../utilities/generateRegisterReport.js");
const generateRegisterExcelReport = require("../utilities/generateRegisterExcelReport.js");

// ----- registerTenderEmailConfirmation function used to send emails related to registered tenders operations

const { registerTenderEmailConfirmation } = require("../utilities/registerEmail.js");

// ----- Commonly used functions
// const currentDateAndTime = function () {
//     return new Date(Date.now());
//   };
const {
  findCountryName,
  findcca2,
  findSubRegion,
  findResponsibleTenderOffice,
  currentDateAndTime,
  formatDate
} = require("../utilities/commonFunctions.js");

  // ----- ----- The function below is used to retrieve the contents of a folder (typically the document upload folder)
  // ----- ----- the function listFiles() can be called (with await !! It's an async !!) and the result provided would be an array.
  // ----- ----- more informationa available at https://dev.to/sinedied/work-with-files-and-directories-in-a-node-js-app-4kh8
  // ----- ----- refer to the part called "List directories contents"
  let listFiles = async function (folderId) {
    try {
      let id = folderId;
      let fileList = await fs.readdir(`./uploads/${id}`);
      if (typeof fileList != "object") {
        fileList = [fileList];
      }
      return fileList;
    } catch (error) {
      return null;
    }
  };

// ----- Controllers used for REGISTER TENDERS ROUTES

const registerCtrl = require("../controllers/register_ctrl.js");

// ----- Routes MOONSHOT REGISTER

router.get("/start", isLoggedIn, registerCtrl.renderStartPage);

router.route("/new")
  .get(isLoggedIn, registerCtrl.renderNewPage)
  .post(isLoggedIn, validateRegister, registerCtrl.createRegister)

router.get("/index", isLoggedIn, registerCtrl.renderIndexPage);

router.get("/history", isLoggedIn, registerCtrl.renderHistoryPage);

router.route("/:id")
  .get(isLoggedIn, registerCtrl.renderShowPage)
  .delete(isLoggedIn, registerCtrl.deleteRegister)

router.post("/:id/participation/:decision", isLoggedIn, validateDecision, registerCtrl.tenderTeamDecision);

router.route("/edit/:id")
  .get(isLoggedIn, registerCtrl.renderEditPage)
  .patch(isLoggedIn, validateRegister, registerCtrl.patchRegister)

router.get("/excelReport", isLoggedIn, catchAsync(async function (req, res) {
  let fileName = `excelReport_${Date.now()}`
      generateRegisterExcelReport(fileName)
      req.flash("success", "The registered tender Excel report has been generated.");
      return res.redirect("/register/start");
  })
);

// ----- Export the router
module.exports = router;