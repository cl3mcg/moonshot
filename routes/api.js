const express = require('express');
const router = express.Router({ mergeParams: true });

// ----- Middleware used

const {
  // ----- isLoggedIn middleware used to check if the user is properly logged in - Check the value of req.user stored in Express Session
  isLoggedIn,
  isTenderTeam
} = require("../utilities/middleware.js");


// ----- Controllers used for API ROUTES

const apiCtrl = require("../controllers/api_ctrl.js");

// ----- Routes MOONSHOT API

router.post("/numRecords", isLoggedIn, isTenderTeam, apiCtrl.sendNumRecords);

// ----- Export the router
module.exports = router;