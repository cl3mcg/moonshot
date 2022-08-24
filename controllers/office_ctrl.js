// ----- Database models

const Office = require("../models/office.js");

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

// ----- catchAsync middleware used to handle Async functions errors

const catchAsync = require("../utilities/catchasync.js");

// ----- Extended error class

const ExpressError = require("../utilities/expresserror.js");

// ----- validateOffice middleware used with JOI to validate new offices according to JOI schema

const { validateOffice } = require("../utilities/middleware.js");

// ----- Commonly used functions

const {
    findCountryName,
    findcca2,
    findSubRegion,
    findResponsibleTenderOffice,
    currentDateAndTime,
    formatDate
} = require("../utilities/commonfunctions.js");

// ----- Controllers for MOONSHOT OFFICE

module.exports.renderStartPage = function (req, res) {
    res.render("office/office_start.ejs");
};

module.exports.renderindexPage = catchAsync(async function (req, res) {
    let allOffices = await Office.find({});
    res.render("office/office_index.ejs", { countriesData, monthsData, allOffices });
});

module.exports.renderNewPage = function (req, res) {
    res.render("office/office_new.ejs", { countriesData, monthsData });
};

module.exports.createOffice = catchAsync(async function (req, res) {
    console.log(`${colors.black.bgBrightCyan("* ATTEMPT *")} A new OFFICE submit has been attempted with the following data:`);
    // console.log(req.body);

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
    req.flash("success", "Office is successfully created !");
    res.redirect(`/office/${newEntry._id}`);
});

module.exports.renderShowPage = catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let matchingOffice = await Office.findById(matchingId);
    if (!matchingOffice) {
        req.flash("error", "The office with the given ID was not found.");
        res.redirect("/office/start");
    } else {
        res.render("office/office_show.ejs", {
            countriesData,
            monthsData,
            matchingOffice
        })
    }
});

module.exports.renderEditPage = catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let matchingOffice = await Office.findById(matchingId);
    if (!matchingOffice) {
        req.flash("error", "The office with the given ID was not found.");
        res.redirect("/office/start");
    } else {
        res.render("office/office_edit.ejs", {
            countriesData,
            monthsData,
            matchingOffice
        })
    }
});

module.exports.patchOffice = catchAsync(async function (req, res) {
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
    req.flash("success", "Office is successfully modified !");
    res.redirect(`/office/${matchingId}`);
});

module.exports.deleteOffice = catchAsync(async function (req, res) {
    let matchingId = req.params.id;
    let matchingOffice = await Office.findById(matchingId);
    console.log(`An OFFICE has been selected for deletion... - ${matchingOffice.companyName}, ${matchingOffice.cca2}`);
    // console.log(matchingOffice);
    await Office.findByIdAndDelete(matchingId);
    console.log("... and has been deleted.");
    req.flash("success", "Office has been deleted.");
    res.redirect("/office/index");
});