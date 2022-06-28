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
const priviledgeEmailRequest = require("../utilities/priviledgerequest.js");
const welcomeEmailDistribution = require("../utilities/welcomeemail.js");

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
    if (req.user) {
        return res.redirect(`/user/${req.user.id}`)
    }
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
    await welcomeEmailDistribution(registeredUser.id)
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

module.exports.renderUserPage = catchAsync(async function (req, res) {
    const userId = req.params.id
    const matchingUser = await User.findById(userId)
    if (req.user.id !== matchingUser.id && !matchingUser.isAdmin) {
        req.flash("error", "You can't access this page")
        res.redirect("/start")
    }
    res.render("user/user_show.ejs")
})

module.exports.requestAccess = catchAsync(async function (req, res) {
    const userId = req.params.id
    const matchingUser = await User.findById(userId)
    if (!matchingUser){
        req.flash("error", "The ID provided does not match")
        res.redirect("/start")
    }
    if (req.user.id !== matchingUser.id || req.user.id !== userId) {
        req.flash("error", "You can't access this page")
        res.redirect(`/user/${userId}`)
    }
    let {userRequest, requestComment} = req.body
    if (typeof userRequest != "object") {
        userRequest = [userRequest]
    }
    let request = {
        userRequest: userRequest,
        requestComment: requestComment
    }
    priviledgeEmailRequest(matchingUser.id, request)
    req.flash("success", "You request has been sent to an admin.")
    res.redirect(`/user/${userId}`)
})

module.exports.changePassword = catchAsync(async function (req, res) {
    const userId = req.params.id
    const matchingUser = await User.findById(userId)
    const currentUserId = req.user.id
    let {currentPassword, newPassword1, newPassword2} = req.body
    if (!currentUserId) {
        req.flash("error", "The ID provided does not match")
        return res.redirect("/start")
    }
    if (userId !== currentUserId && !matchingUser.isAdmin) {
        req.flash("error", "You can't change the password of another user !")
        return res.redirect(`/user/${userId}`)
    }
    if (newPassword1 !== newPassword2) {
        req.flash("error", "Passwords are not matching")
        return res.redirect(`/user/${userId}`)
    }
    await matchingUser.changePassword(currentPassword, newPassword1, function(err) {
        if(err) {
            if(err.name === 'IncorrectPasswordError'){
            req.flash("error", "The current password provided is incorrect")
            return res.redirect(`/user/${userId}`)
            }else {
            req.flash("error", "There's been an error")
            return res.redirect(`/user/${userId}`)
            }
       } else {
            req.logout();
            req.flash("success", "Password changed successfully, you can login again with your new password")
            return res.redirect(`/user/login`)
        }
      })
})

module.exports.changeEmail = catchAsync(async function (req, res) {
    const userId = req.params.id
    const matchingUser = await User.findById(userId)
    const currentUserId = req.user.id
    let {newEmail1, newEmail2} = req.body
    if (!currentUserId) {
        req.flash("error", "The ID provided does not match")
        return res.redirect("/start")
    }
    if (userId !== currentUserId && !matchingUser.isAdmin) {
        req.flash("error", "You can't change the email of another user !")
        return res.redirect(`/user/${userId}`)
    }
    if (newEmail1 !== newEmail2) {
        req.flash("error", "Emails are not matching")
        return res.redirect(`/user/${userId}`)
    }

    let updatedEntry = {
        email: newEmail1
    }
    
    try {
        await User.findByIdAndUpdate(userId, updatedEntry)
        req.flash("success", "The email address has been updated")
        return res.redirect(`/user/${userId}`)
    } catch (error) {
        req.flash("error", "There's been an error, the email has not been updated")
        console.log(error)
        return res.redirect(`/user/${userId}`)
    }

})