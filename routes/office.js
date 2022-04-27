const express = require('express');
const router = express.Router({ mergeParams: true });

// ----- Database models
const Office = require("../models/office.js");

// ----- Ressources required

const colors = require("colors");
const { officeSchema } = require("../utilities/joiSchemas.js");
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


// ----- Routes MOONSHOT OFFICES

router.get("/start", function (req, res) {
  res.render("office_start.ejs");
});

router.get("/index",catchAsync(async function (req, res) {
    let allOffices = await Office.find({});
    res.render("office_index.ejs", { countriesData, monthsData, allOffices });
  })
);

router.get("/new", function (req, res) {
  res.render("office_new.ejs", { countriesData, monthsData });
});

router.post("/new",validateOffice,catchAsync(async function (req, res) {
    console.log(`${colors.black.bgBrightCyan("* ATTEMPT *")} A new OFFICE submit has been attempted with the following data:`);
    console.log(req.body);

    let cca2 = req.body.countryLocation;
    let officeSetup = req.body.officeSetup;
    let companyName = req.body.companyName;
    let address = req.body.address;
    let address_postCode = req.body.postCode;
    let address_city = req.body.city;
    let address_cca2 = req.body.countryName;
    let tenderDesk = req.body.tenderDesk;
    let lat = req.body.lat;
    let lng = req.body.lng;
    let newEntry = new Office({
      recordDate: currentDateAndTime(),
      lastModifiedDate: null,
      cca2: cca2,
      officeSetup: officeSetup,
      companyName: companyName,
      address: address,
      address_postCode: address_postCode,
      address_city: address_city,
      address_cca2: address_cca2,
      tenderDesk: tenderDesk,
      lat: lat,
      lng: lng,
    });
    await newEntry.save();
    console.log(`${colors.black.bgBrightGreen("* OK *")} A new OFFICE has been registered in the database: ${companyName}`);
    res.redirect(`/moonshot/office/${newEntry._id}`);
  })
);

router.get("/:id",catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let matchingOffice = await Office.findById(matchingId);
    // console.log(matchingOffice)
    res.render("office_show.ejs", {
      countriesData,
      monthsData,
      matchingOffice,
    });
  })
);

router.get("/edit/:id",catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let matchingOffice = await Office.findById(matchingId);
    // console.log(matchingOffice)
    res.render("office_edit.ejs", {
      countriesData,
      monthsData,
      matchingOffice,
    });
  })
);

router.patch("/edit/:id",validateOffice,catchAsync(async function (req, res) {
    console.log(`${colors.black.bgBrightCyan("* ATTEMPT *")} An OFFICE has been selected for update: ${req.body.companyName}`);
    let matchingId = req.params.id;
    let newcca2 = req.body.countryLocation;
    let newOfficeSetup = req.body.officeSetup;
    let newCompanyName = req.body.companyName;
    let newAddress = req.body.address;
    let newAddress_postCode = req.body.postCode;
    let newAddress_city = req.body.city;
    let newAddress_cca2 = req.body.countryName;
    let newTenderDesk = req.body.tenderDesk;
    let newLat = req.body.lat;
    let newLng = req.body.lng;

    let updatedOffice = await Office.findByIdAndUpdate(matchingId, {
      lastModifiedDate: currentDateAndTime(),
      cca2: newcca2,
      officeSetup: newOfficeSetup,
      companyName: newCompanyName,
      address: newAddress,
      address_postCode: newAddress_postCode,
      address_city: newAddress_city,
      address_cca2: newAddress_cca2,
      tenderDesk: newTenderDesk,
      lat: newLat,
      lng: newLng,
    });
    console.log(`${colors.black.bgBrightGreen("* OK *")} The OFFICE data related to ${newCompanyName} has been UPDATED with the following data: ${updatedOffice}`);
    res.redirect(`/moonshot/office/${matchingId}`);
  })
);

router.delete("/:id",catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let matchingOffice = await Office.findById(matchingId);
    console.log("An OFFICE has been selected for deletion...");
    console.log(matchingOffice);
    await Office.findByIdAndDelete(matchingId);
    console.log("... and has been deleted.");
    res.redirect("/moonshot/office/index");
  })
);

// ----- Export the router
module.exports = router;