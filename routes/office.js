const express = require('express');
const router = express.Router({ mergeParams: true });

// ----- Database models
const Office = require("../models/office.js");

// ----- Ressources required

const ejs = require("ejs");
const colors = require("colors");
const { officeSchema } = require("../utilities/joiSchemas.js");
const nodemailer = require("nodemailer");
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

// ----- validateOffice middleware used with JOI to validate new offices according to JOI schema

const { validateOffice } = require("../utilities/middleware.js");

// ----- Controllers used for OFFICE ROUTES

const officeCtrl = require("../controllers/office_ctrl.js");

router.get("/start", officeCtrl.renderStartPage);

router.get("/index", officeCtrl.renderindexPage);

router.route("/new")
  .get(officeCtrl.renderNewPage)
  .post(validateOffice, officeCtrl.createOffice)

router.route("/:id")
  .get(officeCtrl.renderShowPage)
  .delete(officeCtrl.deleteOffice)

router.route("/edit/:id")
  .get(officeCtrl.renderEditPage)
  .patch(validateOffice, officeCtrl.patchOffice)

// ----- Export the router
module.exports = router;