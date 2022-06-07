const express = require('express');
const router = express.Router({ mergeParams: true });

// ----- Database models
const User = require("../models/user.js");

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
const passport = require('passport');

// ----- catchAsync middleware used to handle Async functions errors

const catchAsync = require("../utilities/catchAsync.js");

// ----- Extended error class

const ExpressError = require("../utilities/expressError.js");

// ----- Controllers used for USER MANAGEMENT ROUTES

const userCtrl = require("../controllers/user_ctrl.js");

// ----- Routes MOONSHOT USER

router.route("/login")
  .get(userCtrl.renderLoginPage)
  .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/user/login' }), userCtrl.loginUser)

router.route("/registration")
  .get(userCtrl.renderRegistrationPage)
  .post(userCtrl.registerUser)

router.get("/logout", userCtrl.logoutUser);

// router.get("/login", userCtrl.renderLoginPage);

// router.post("/login", passport.authenticate('local', { failureFlash: true, failureRedirect: '/user/login' }), userCtrl.loginUser);

// router.get("/registration", userCtrl.renderRegistrationPage);

// router.post("/registration", userCtrl.registerUser);



// ----- Export the router
module.exports = router;