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

// ----- validateUser middleware used with JOI to validate new offices according to JOI schema

// const validateOffice = function (req, res, next) {
//     const result = officeSchema.validate(req.body);
//     if (result.error) {
//       console.log(
//         `${colors.brightYellow.bgBrightRed("*!* WARNING *!*")} JOI validation failed - validateOffice`);
//       const errorMsg = result.error.details
//         .map(function (element) {
//           return element.message;
//         })
//         .join(",");
//       throw new ExpressError(errorMsg, 400);
//     } else {
//       console.log(
//         `${colors.black.bgBrightGreen("* OK *")} JOI validation passed - validateOffice`);
//       next();
//     }
//   };


// ----- Routes MOONSHOT USER

router.get("/login", function (req, res) {
  res.render("user/user_login.ejs");
});

router.post("/login", passport.authenticate('local', { failureFlash: true, failureRedirect: 'user/login' }), function (req, res) {
  console.log("Route hit")
  const redirectUrl = req.session.returnTo || "/start";
  req.flash("success", "Welcome back !")
  delete req.session.returnTo
  res.redirect(redirectUrl)
});

router.get("/registration", function (req, res) {
    res.render("user/user_registration.ejs");
  });

  router.post("/registration", catchAsync(async function (req, res) {
    try {
      const { username, email, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password)
      req.login(registeredUser, function(err) {
          if (err) { 
                  return next(err);
              }
          });
      req.flash("success", "Welcome to The Moonshot project!")
      res.redirect("/start")
  } catch (error) {
      req.flash('error', error.message);
      res.redirect('/user/registration');
  }
  }));

router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "Logged out ! Bye !")
  res.redirect("/")
})

// ----- Export the router
module.exports = router;