// ----- Ressources required

const colors = require("colors");

// ----- Database models

const PreadvisedTender = require("../models/preadvisedTender.js");
const RegisteredTender = require("../models/registeredTender.js");

// ----- Ressources required

const { preadviseSchema, registerSchema, decisionSchema, officeSchema } = require("../utilities/joischemas.js");

// ----- Extended error class

const ExpressError = require("../utilities/expresserror.js");

// ----- Middleware functions

const validatePreadvise = function (req, res, next) {
    const result = preadviseSchema.validate(req.body);
    if (result.error) {
      console.log(`${colors.brightYellow.bgBrightRed("*!* WARNING *!*")} JOI validation failed - validatePreadvise`);
      const errorMsg = result.error.details
        .map(function (element) {
          return element.message;
        })
        .join(",");
      throw new ExpressError(errorMsg, 400);
    } else {
      console.log(`${colors.black.bgBrightGreen("* OK *")} JOI validation passed - validatePreadvise`);
      next();
    }
  };

const validateRegister = function (req, res, next) {
    const result = registerSchema.validate(req.body);
    if (result.error) {
      console.log(`${colors.brightYellow.bgBrightRed("*!* WARNING *!*")} JOI validation failed - validateRegister`);
      const errorMsg = result.error.details
        .map(function (element) {
          return element.message;
        })
        .join(",");
      throw new ExpressError(errorMsg, 400);
    } else {
      console.log(`${colors.black.bgBrightGreen("* OK *")} JOI validation passed - validateRegister`);
      next();
    }
  };

const validateDecision = function (req, res, next) {
const result = decisionSchema.validate(req.body);
if (result.error) {
    console.log(`${colors.brightYellow.bgBrightRed("*!* WARNING *!*")} JOI validation failed - validateDecision`);
    const errorMsg = result.error.details
    .map(function (element) {
        return element.message;
    })
    .join(",");
    throw new ExpressError(errorMsg, 400);
} else {
    console.log(`${colors.black.bgBrightGreen("* OK *")} JOI validation passed - validateDecision`);
    next();
}
};

const validateOffice = function (req, res, next) {
const result = officeSchema.validate(req.body);
if (result.error) {
    console.log(
    `${colors.brightYellow.bgBrightRed("*!* WARNING *!*")} JOI validation failed - validateOffice`);
    const errorMsg = result.error.details
    .map(function (element) {
        return element.message;
    })
    .join(",");
    throw new ExpressError(errorMsg, 400);
} else {
    console.log(
    `${colors.black.bgBrightGreen("* OK *")} JOI validation passed - validateOffice`);
    next();
}
};

  
const isLoggedIn = function (req, res, next) {
    // console.log(`The req.user is: ${req.user}`);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("warning", "You must be logged in.")
        return res.redirect("/user/login")
    }
    next()
}

const isAdmin = function (req, res, next) {
  // console.log(`The req.user is: ${req.user}`);
  if (!req.user.isAdmin) {
      req.session.returnTo = req.originalUrl;
      req.flash("warning", "You do not have admin privileges.")
      return res.redirect("/user/login")
  }
  next()
}

const isTenderTeam = function (req, res, next) {
  // console.log(`The req.user is: ${req.user}`);
  if (!req.user.isTenderTeam) {
      req.session.returnTo = req.originalUrl;
      req.flash("warning", "Only the tender team has access to this module.")
      return res.redirect("/user/login")
  }
  next()
}

const isAuthor = async function (req, res, next) {
    const id = req.params.id
    const matchingPreadvise = await PreadvisedTender.findById(id)
    const matchingRegister = await RegisteredTender.findById(id)
    if (!matchingPreadvise && !matchingRegister) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "Nothing matches this id.")
        return res.redirect(req.originalUrl)
    }
    if (!matchingPreadvise.author.equals(req.user._id)) {
        req.flash("error", "You are not authorized to do that !")
        return res.redirect(`/preadvise/${id}`)
    }
    if (!matchingRegister.author.equals(req.user._id)) {
      req.flash("error", "You are not authorized to do that !")
      return res.redirect(`/register/${id}`)
    }
    next()
}

module.exports = {
    validatePreadvise,
    validateRegister,
    validateDecision,
    validateOffice,
    isLoggedIn,
    isAuthor,
    isAdmin,
    isTenderTeam
}
