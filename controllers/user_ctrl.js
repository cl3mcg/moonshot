// ----- Database models
const User = require("../models/user.js");

// ----- Ressources required

const ejs = require("ejs");
const colors = require("colors");
const { officeSchema } = require("../utilities/joischemas.js");
const nodemailer = require("nodemailer");
const countriesData = require("../public/ressources/countries.json");
const monthsData = require("../public/ressources/months.json");
const tradelanes = require("../public/ressources/tradelanes.json");
const history = require("../public/ressources/history.json");
const transportModes = require("../public/ressources/transportModes.json");
const businessVerticals = require("../public/ressources/businessVerticals.json");
const passport = require('passport');

// ----- catchAsync middleware used to handle Async functions errors

const catchAsync = require("../utilities/catchasync.js");

// ----- Extended error class

const ExpressError = require("../utilities/expresserror.js");

// ----- Commonly used functions

const {
    findCountryName,
    findcca2,
    findSubRegion,
    findResponsibleTenderOffice,
    currentDateAndTime,
    formatDate
  } = require("../utilities/commonfunctions.js");

// ----- Controllers for MOONSHOT USER MANAGEMENT

module.exports.renderLoginPage = function (req, res) {
    res.render("user/user_login.ejs");
};

module.exports.loginUser = function (req, res) {
    const redirectUrl = req.session.returnTo || "/start";
    req.flash("success", "Welcome back !")
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.renderRegistrationPage = function (req, res) {
    res.render("user/user_registration.ejs");
}

module.exports.registerUser = catchAsync(async function (req, res) {
try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password)
    req.login(registeredUser, function(err) {
        if (err) { 
                return next(err);
            }
        });
    req.flash("success", "Welcome to The Moonshot project !")
    res.redirect("/start")
}
catch (error) {
    req.flash('error', error.message);
    res.redirect('/user/registration');
    }
})

module.exports.logoutUser = function (req, res) {
    req.logout();
    req.flash("success", "Logged out ! Bye !")
    res.redirect("/")
}