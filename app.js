// ----- App
const express = require("express")
const app = express()
const fs = require("fs").promises
const colors = require("colors")
const ejs = require("ejs")
const path = require("path")
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override")
const mongoose = require("mongoose")
const nodemailer = require("nodemailer")
const Excel = require("exceljs")
// const Joi = require("joi") // Joi is exported in its own file called joiSchema.js, no need to require it again here.
const fileUpload = require("express-fileupload")
const {preadviseSchema, registerSchema, officeSchema} = require("./utilities/joiSchemas.js")
// ----- Extended error class
const ExpressError = require("./utilities/expressError.js")

// ----- Database models
const PreadvisedTender = require("./models/preadvisedTender.js")
const Office = require("./models/office.js")
const RegisteredTender = require("./models/registeredTender.js")

// ----- Ressources
const countriesData = require('./public/ressources/countries.json')
const monthsData = require('./public/ressources/months.json')
const tradelanes = require('./public/ressources/tradelanes.json')
const history = require('./public/ressources/history.json')
const transportModes = require('./public/ressources/transportModes.json')
const transportScope = require('./public/ressources/transportScope.json')
const bidRestrictions = require('./public/ressources/bidRestrictions.json')
const bidRequirements = require('./public/ressources/bidRequirements.json')
const businessVerticals = require('./public/ressources/businessVerticals.json')
const specialHandling = require('./public/ressources/specialHandling.json')
const freightForwarders = require('./public/ressources/freightForwarders.json')

// ----- Middlewares
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride("_method"))
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.engine("ejs", ejsMate)
app.use(fileUpload({createParentPath: true}))

// ----- catchAsync middleware used to handle Async functions errors
const catchAsync = require('./utilities/catchAsync.js')

// ----- validatePreadvise middleware used with JOI to validate new preavised tenders according to JOI schema
const validatePreadvise = function (req, res, next) {

    const result = preadviseSchema.validate(req.body)
    if (result.error) {
        console.log(`${colors.brightYellow.bgBrightRed('*!* WARNING *!*')} JOI validation failed - validatePreadvise`)
        const errorMsg = result.error.details.map(
            function (element) {
                return element.message
            }
        ).join(",")
        throw new ExpressError(errorMsg, 400)
    }
    else {
        console.log(`${colors.black.bgBrightGreen('* OK *')} JOI validation passed - validatePreadvise`)
        next()
    }
}

const validateRegister = function (req, res, next) {

    const result = registerSchema.validate(req.body)
    if (result.error) {
        console.log(`${colors.brightYellow.bgBrightRed('*!* WARNING *!*')} JOI validation failed - validateRegister`)
        const errorMsg = result.error.details.map(
            function (element) {
                return element.message
            }
        ).join(",")
        throw new ExpressError(errorMsg, 400)
    }
    else {
        console.log(`${colors.black.bgBrightGreen('* OK *')} JOI validation passed - validateRegister`)
        next()
    }
}

const validateOffice = function (req, res, next) {

    const result = officeSchema.validate(req.body)
    if (result.error) {
        console.log(`${colors.brightYellow.bgBrightRed('*!* WARNING *!*')} JOI validation failed - validateOffice`)
        const errorMsg = result.error.details.map(
            function (element) {
                return element.message
            }
        ).join(",")
        throw new ExpressError(errorMsg, 400)
    }
    else {
        console.log(`${colors.black.bgBrightGreen('* OK *')} JOI validation passed - validateOffice`)
        next()
    }
}

// ----- Database connection
mongoose.connect("mongodb://localhost:27017/moonshot", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(function () {
        console.log(`${colors.black.bgBrightGreen('* OK *')} MOONSHOT PROJECT - Database connection OK (Mongoose)`)
    })
    .catch(function (err) {
        console.log(`${colors.brightYellow.bgBrightRed('*!* WARNING *!*')} MOONSHOT PROJECT - Database connection ERROR (Mongoose)`)
        console.log(err)
    })

// ----- Commonly used functions
const currentDateAndTime = function () {return new Date(Date.now())}
const findCountryName = function (cca2) {for (country of countriesData) {if (country.cca2 === cca2) {return country.name.common}}}
const findcca2 = function (countryName) {for (country of countriesData) {if (country.common.name === countryName) {return country.cca2}}}
// ----- ----- The function below is used to retrieve the contents of a folder (typically the document upload folder)
// ----- ----- the function listFiles() can be called (with await !! It's an async !!) and the result provided would be an array.
// ----- ----- more informationa available at https://dev.to/sinedied/work-with-files-and-directories-in-a-node-js-app-4kh8
// ----- ----- refer to the part called "List directories contents"
let listFiles = async function (folderId) {
    try {
        let id = folderId
        let fileList = await fs.readdir(`./uploads/${id}`)
        if (typeof(fileList) != "object") {fileList = [fileList]}
        return fileList
    } catch (error) {
        return null
    }
}

// ----- Routes MOONSHOT HOME & START
app.get("/", function(req, res){
    res.render("homepage.ejs")
})

app.get("/moonshot", function (req, res) {
    res.render("indexHome.ejs")
})

app.get("/start", function (req, res){
    res.render("indexStart.ejs")
})

// ----- Routes MOONSHOT PREADVISED

app.get("/preadvise/start", function(req, res){
    res.render("preadvised_start.ejs")
})

app.get("/preadvise/new", function (req, res) {
    res.render("preadvised_new.ejs", {countriesData})
})

app.post("/preadvise/new", validatePreadvise, catchAsync(async function(req,res, next){
        
    console.log(`${colors.black.bgBrightCyan('* ATTEMPT *')} A new TENDER PRE-ADVISE submit has been attempted with the following data:`)
    console.log(req.body)

    let companyName = req.body.companyName
    let sugarID = req.body.sugarID
    let expectedReceiveDate = req.body.expectedReceiveDate
    let transportMode = req.body.transportMode
    if (typeof(transportMode) != "object") {transportMode = [transportMode]}
    let airFreightVolume
    if(!req.body.airFreightVol) {airFreightVolume = 0} else {airFreightVolume = req.body.airFreightVol}
    let seaFreightFCLVolume
    if(!req.body.seaFreightFCLVol) {seaFreightFCLVolume = 0} else {seaFreightFCLVolume = req.body.seaFreightFCLVol}
    let seaFreightLCLVolume
    if(!req.body.seaFreightLCLVol) {seaFreightLCLVolume = 0} else {seaFreightLCLVolume = req.body.seaFreightLCLVol}
    let railFreightVolume
    if(!req.body.railFreightVol) {railFreightVolume = 0} else {railFreightVolume = req.body.railFreightVol}
    let keyTradelanes = req.body.keyTradelanes
    if (typeof(keyTradelanes) != "object") {keyTradelanes = [keyTradelanes]}
    let history = req.body.history
    let existingCustomerSegment
    if(!req.body.existingCustomerSegment) {existingCustomerSegment = null} else {existingCustomerSegment = req.body.existingCustomerSegment}
    let additionalComment
    if(!req.body.additionalComment) {additionalComment = null} else {additionalComment = req.body.additionalComment}
    let countryLocation = req.body.countryLocation

    let newEntry = new PreadvisedTender({
        recordDate: currentDateAndTime(),
        lastModifiedDate: null,
        launched: false,
        launchedTime: null,
        companyName: companyName,
        sugarID: sugarID,
        expectedReceiveDate: expectedReceiveDate,
        transportMode: transportMode,
        airFreightVolume: airFreightVolume,
        seaFreightFCLVolume: seaFreightFCLVolume,
        seaFreightLCLVolume: seaFreightLCLVolume,
        railFreightVolume: railFreightVolume,
        keyTradelanes: keyTradelanes,
        history: history,
        existingCustomerSegment: existingCustomerSegment,
        additionalComment: additionalComment,
        countryLocation: countryLocation,
    })
    await newEntry.save()
    console.log(`${colors.black.bgBrightGreen('* OK *')} A new TENDER PRE-ADVISE has been registered in the database: ${companyName}`)
    res.redirect(`/preadvise/${newEntry.id}`)


    // let from = '"Tender registration" <appareil_en_ligne@outlook.com>'
    // let selectedEmail = "TESTrecipientemail@outlook.com" // Enter the recipient email here
    // let subject = "Your tender has been preadvised"
    // let attachement = null
    // // let attachement = [{
    // //     filename: 'Jean-Marie.jpg',
    // //     path: 'public/data/dummyAttachements/jm.jpg'
    // // }]
    // let emailBody = await ejs.renderFile("./emails/preadviseConfirm.ejs", {
    //     userName: "Jean-Marie", // Enter the user name here
    //     companyName: companyName, // Enter the company name here, it should be gathered from the form
    //     preadviseId: newEntry.id // Enter the preadvise ID here, it should be gathered after being saved in the database
    // });
    
    // const send = async function () {

    //     let transporter = nodemailer.createTransport({
    //         host: "smtp.office365.com",
    //         port: 587,
    //         secure: false, // true for 465, false for other ports
    //         auth: {
    //             user: "appareil_en_ligne@outlook.com", // generated ethereal user
    //             pass: "XXXXXXXX", // generated ethereal password
    //         },
    //     });

    //     let info = await transporter.sendMail({
    //         from: from, // sender address
    //         to: selectedEmail, // list of receivers
    //         subject: subject, // Subject line
    //         html: emailBody, // html body
    //         attachments: attachement
    //     });

    // }

    // // Nodemailer launch function - Uncomment below to enable to email launch.
    // try {
    //     send()
    //     console.log(`An email with the information related to the TENDER PRE-ADVISE of the company ${companyName}, has been sent`)
    // } catch (error) {
    //     console.log(error)
    //     res.send("ERROR ! Check console...")
    // }
    
}))


app.get("/preadvise/index", catchAsync(async function (req, res) {
    const d = new Date()
    const today = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const d30 = new Date (d.setDate(d.getDate() + 30))
    const next30days = new Date(d30.getFullYear(), d30.getMonth(), d30.getDate())
    const d90 = new Date (d30.setDate(d30.getDate() + 60))
    const next90days = new Date(d90.getFullYear(), d90.getMonth(), d90.getDate())
 

    // const preadvised_past = await PreadvisedTender.find({"expectedReceiveDate": {$lt: today}})
    // const preadvised_inM = await PreadvisedTender.find({"expectedReceiveDate": {$gte: today, $lte: next30days}})
    // const preadvised_inQ = await PreadvisedTender.find({"expectedReceiveDate": {$gt: next30days, $lte: next90days}})
    // const preadvised_inY = await PreadvisedTender.find({"expectedReceiveDate": {$gt: next90days}})
    // let allPreadvisedTenders = await PreadvisedTender.find({})

    // ----- Function below is used to sort an array containing objects according to a defined attribute.
    // ----- Function below has been copied from https://stackoverflow.com/questions/10123953/how-to-sort-an-object-array-by-date-property
    var sortBy = (function () {
        var toString = Object.prototype.toString,
            // default parser function
            parse = function (x) { return x; },
            // gets the item to be sorted
            getItem = function (x) {
              var isObject = x != null && typeof x === "object";
              var isProp = isObject && this.prop in x;
              return this.parser(isProp ? x[this.prop] : x);
            };
            
        /**
         * Sorts an array of elements.
         *
         * @param {Array} array: the collection to sort
         * @param {Object} cfg: the configuration options
         * @property {String}   cfg.prop: property name (if it is an Array of objects)
         * @property {Boolean}  cfg.desc: determines whether the sort is descending
         * @property {Function} cfg.parser: function to parse the items to expected type
         * @return {Array}
         */
        return function sortby (array, cfg) {
          if (!(array instanceof Array && array.length)) return [];
          if (toString.call(cfg) !== "[object Object]") cfg = {};
          if (typeof cfg.parser !== "function") cfg.parser = parse;
          cfg.desc = !!cfg.desc ? -1 : 1;
          return array.sort(function (a, b) {
            a = getItem.call(cfg, a);
            b = getItem.call(cfg, b);
            return cfg.desc * (a < b ? -1 : +(a > b));
          });
        };
        
      }());

      const allPreadvisedTenders = sortBy(await PreadvisedTender.find({}), { prop: "expectedReceiveDate" })
      const preadvised_past = sortBy(await PreadvisedTender.find({"expectedReceiveDate": {$lt: today}}), { prop: "expectedReceiveDate" })
      const preadvised_inM = sortBy(await PreadvisedTender.find({"expectedReceiveDate": {$gte: today, $lte: next30days}}), { prop: "expectedReceiveDate" })
      const preadvised_inQ = sortBy(await PreadvisedTender.find({"expectedReceiveDate": {$gt: next30days, $lte: next90days}}), { prop: "expectedReceiveDate" })
      const preadvised_inY = sortBy(await PreadvisedTender.find({"expectedReceiveDate": {$gt: next90days}}), { prop: "expectedReceiveDate" })
      const preadvised_inAM = []
      const preadvised_inAP = []
      const preadvised_inEU = []

      for (let preadvise of allPreadvisedTenders) {
          for (let country of countriesData) {
              if (country.cca2 === preadvise.countryLocation) {
                  if (country.region === "Europe" || country.region === "Africa" || country.subregion === "Central Asia" || country.subregion === "Western Asia") {
                    preadvised_inEU.push(preadvise)
                  } else if (country.region === "Asia" || country.region === "Oceania") {
                    preadvised_inAP.push(preadvise)
                  } else if (country.region === "Americas") {
                    preadvised_inAM.push(preadvise)
                  } else (preadvised_inEU.push(preadvise))
              }
          }
      }

    // ----- For debugging purposes
    // console.log(`"today" is registered as ${today}`)
    // console.log(`"next30days" is registered as ${next30days}`)
    // console.log(`"next90days" is registered as ${next90days}`)
    // console.log(`"preadvised_inM" results are ${preadvised_inM}`)
    // console.log(`"preadvised_inQ" results are ${preadvised_inQ}`)
    // console.log(`"preadvised_inY" results are ${preadvised_inY}`)
    // console.log(`"preadvised_inAM" results are ${preadvised_inAM}`)
    // console.log(`"preadvised_inAP" results are ${preadvised_inAP}`)
    // console.log(`"preadvised_inEU" results are ${preadvised_inEU}`)

    res.render("preadvised_index.ejs", {countriesData, monthsData, today, next30days, next90days, allPreadvisedTenders, preadvised_past, preadvised_inM, preadvised_inQ, preadvised_inY, preadvised_inAM, preadvised_inAP, preadvised_inEU})
}))

app.get("/preadvise/:id", catchAsync(async function (req, res) {
    let matchingId = req.params.id
    let matchingTender = await PreadvisedTender.findById(matchingId)
    // ----- For debugging purposes
    // console.log(matchingTender)
    res.render("preadvised_show.ejs", {countriesData, monthsData, tradelanes, transportModes, history, matchingTender})
}))

app.delete("/preadvise/:id", catchAsync(async function (req, res) {
    let matchingId = req.params.id
    let matchingTender = await PreadvisedTender.findById(matchingId)
    let matchingTenderName = matchingTender.companyName
    console.log(`${colors.black.bgBrightCyan('* ATTEMPT *')} A TENDER PRE-ADVISE has been selected for deletion: ${matchingTenderName}`)
    console.log(matchingTender)
    await PreadvisedTender.findByIdAndDelete(matchingId)
    console.log(`${colors.black.bgBrightGreen('* OK *')} The TENDER PRE-ADVISE related to "${matchingTenderName}" has been deleted`)
    res.redirect("/preadvise/start")
}))

app.get("/preadvise/edit/:id", catchAsync(async function (req, res){
    let matchingId = req.params.id
    let matchingTender = await PreadvisedTender.findById(matchingId)
    res.render("preadvised_edit.ejs", {countriesData, monthsData, matchingTender})
}))

app.get("/preadvise/launch/:id", catchAsync(async function (req, res){
    let matchingId = req.params.id
    let preadviseTender = await PreadvisedTender.findById(matchingId)
    res.render("register_new.ejs", {countriesData, businessVerticals, preadviseTender})
}))

app.patch("/preadvise/edit/:id", validatePreadvise, catchAsync(async function (req, res){
    console.log(`${colors.black.bgBrightCyan('* ATTEMPT *')} A TENDER PRE-ADVISE has been selected for update: ${req.body.companyName}`)

    let matchingId = req.params.id
    let newCompanyName = req.body.companyName
    let newSugarID = req.body.sugarID
    let newExpectedReceiveDate = req.body.expectedReceiveDate
    let newTransportMode = req.body.transportMode
    if (typeof(newTransportMode) != "object") {newTransportMode = [newTransportMode]}
    let newAirFreightVolume
    if(!req.body.airFreightVol) {newAirFreightVolume = 0} else {newAirFreightVolume = req.body.airFreightVol}
    let newSeaFreightFCLVolume
    if(!req.body.seaFreightFCLVol) {newSeaFreightFCLVolume = 0} else {newSeaFreightFCLVolume = req.body.seaFreightFCLVol}
    let newSeaFreightLCLVolume
    if(!req.body.seaFreightLCLVol) {newSeaFreightLCLVolume = 0} else {newSeaFreightLCLVolume = req.body.seaFreightLCLVol}
    let newRailFreightVolume
    if(!req.body.railFreightVol) {newRailFreightVolume = 0} else {newRailFreightVolume = req.body.railFreightVol}
    let newKeyTradelanes = req.body.keyTradelanes
    if (typeof(newKeyTradelanes) != "object") {newKeyTradelanes = [newKeyTradelanes]}
    let newHistory = req.body.history
    let newExistingCustomerSegment
    if(!req.body.existingCustomerSegment) {newExistingCustomerSegment = null} else {newExistingCustomerSegment = req.body.existingCustomerSegment}
    let newAdditionalComment
    if(!req.body.additionalComment) {newAdditionalComment = null} else {newAdditionalComment = req.body.additionalComment}
    let newCountryLocation = req.body.countryLocation

    await PreadvisedTender.findByIdAndUpdate(matchingId, {
        lastModifiedDate: currentDateAndTime(),
        launched: false,
        launchedTime: null,
        companyName: newCompanyName,
        sugarID: newSugarID,
        expectedReceiveDate: newExpectedReceiveDate,
        transportMode: newTransportMode,
        airFreightVolume: newAirFreightVolume,
        seaFreightFCLVolume: newSeaFreightFCLVolume,
        seaFreightLCLVolume: newSeaFreightLCLVolume,
        railFreightVolume: newRailFreightVolume,
        keyTradelanes: newKeyTradelanes,
        history: newHistory,
        existingCustomerSegment: newExistingCustomerSegment,
        additionalComment: newAdditionalComment,
        countryLocation: newCountryLocation
    })
    console.log(`${colors.black.bgBrightGreen('* OK *')} The TENDER PRE-ADVISE related to "${newCompanyName}" has been updated`)
    res.redirect(`/preadvise/${matchingId}`)
}))

// ----- Routes MOONSHOT REGISTRATION

app.get("/register/start", function (req, res) {
    res.render("register_start.ejs")
})

app.get("/register/new", function (req, res) {
    let preadviseTender = null
    res.render("register_new.ejs", {countriesData, businessVerticals, preadviseTender})
})

app.post("/register/new", validateRegister, async function (req, res) {
    console.log(`${colors.black.bgBrightCyan('* ATTEMPT *')} A new TENDER REGISTRATION submit has been attempted`)
    console.log(req.body)
    console.log(req.files)

    let isPreadvised = req.body.isPreadvised
    let preadviseID
    if (isPreadvised === "yes") {
        isPreadvised = true
        preadviseID = req.body.preadviseID
    } else {
        isPreadvised = false
        preadviseID = null
    }
    let companyName = req.body.companyName
    let sugarID = req.body.sugarID
    let businessVertical = req.body.businessVertical
    let contactName = req.body.contactName
    let contactJobTitle = req.body.contactJobTitle
    let contactEmail = req.body.contactEmail
    let decisionMaker = req.body.decisionMaker
    let transportMode = req.body.transportMode
    if (typeof(transportMode) != "object") {transportMode = [transportMode]}
    let airFreightVol
    if(!req.body.airFreightVol) {airFreightVol = 0} else {airFreightVol = req.body.airFreightVol}
    let seaFreightFCLVol
    if(!req.body.seaFreightFCLVol) {seaFreightFCLVol = 0} else {seaFreightFCLVol = req.body.seaFreightFCLVol}
    let seaFreightLCLVol
    if(!req.body.seaFreightLCLVol) {seaFreightLCLVol = 0} else {seaFreightLCLVol = req.body.seaFreightLCLVol}
    let railFreightVol
    if(!req.body.railFreightVol) {railFreightVol = 0} else {railFreightVol = req.body.railFreightVol}
    let keyTradelanes = req.body.keyTradelanes
    if (typeof(keyTradelanes) != "object") {keyTradelanes = [keyTradelanes]}
    let commodity = req.body.commodity
    let specialHandling
    if (!req.body.specialHandling) {
        specialHandling = null
    } else {
        specialHandling = req.body.specialHandling
        if (typeof(specialHandling) != "object") {specialHandling = [specialHandling]}
    }
    let linkedRFI = req.body.linkedRFI
    let deadlineRFI
    if (linkedRFI === "yes") {
        linkedRFI = true
        deadlineRFI = req.body.deadlineRFI
    } else {
        linkedRFI = false
        deadlineRFI = null
    }
    let receptionDate = req.body.receptionDate
    let deadlineRFQ = req.body.deadlineRFQ
    let decisionDate = req.body.decisionDate
    let startBusinessDate = req.body.startBusinessDate
    if (typeof(keyTradelanes) != "object") {keyTradelanes = [keyTradelanes]}
    let lanesAmount = req.body.lanesAmount
    let transportationScope = req.body.transportationScope
    if (typeof(transportationScope) != "object") {transportationScope = [transportationScope]}
    let ratesValidityAir
    if (airFreightVol === 0) {ratesValidityAir = null} else {ratesValidityAir = req.body.ratesValidityAir}
    let ratesValidityFCL
    if (seaFreightFCLVol === 0) {ratesValidityFCL = null} else {ratesValidityFCL = req.body.ratesValidityFCL}
    let ratesValidityLCL
    if (seaFreightLCLVol === 0) {ratesValidityLCL = null} else {ratesValidityLCL = req.body.ratesValidityLCL}
    let ratesValidityRail
    if (railFreightVol === 0) {ratesValidityRail = null} else {ratesValidityRail = req.body.ratesValidityRail}
    let contractPeriod = req.body.contractPeriod
    let paymentTerms = req.body.paymentTerms
    let bidRestrictions = req.body.bidRestrictions
    if (typeof(bidRestrictions) != "object") {bidRestrictions = [bidRestrictions]}
    let bidRequirements = req.body.bidRequirements
    if (typeof(bidRequirements) != "object") {bidRequirements = [bidRequirements]}
    let roundsAmount = req.body.roundsAmount
    let tenderLaunchMethod = req.body.tenderLaunchMethod
    let history = req.body.history
    let existingCustomerSegment
    if(!req.body.existingCustomerSegment) {existingCustomerSegment = null} else {existingCustomerSegment = req.body.existingCustomerSegment}
    let visitFrequency = req.body.visitFrequency
    let visitHistory = req.body.visitHistory
    let currentServiceProvider = req.body.currentServiceProvider
    let competitorAmount = req.body.competitorAmount
    let volumeSplit = req.body.volumeSplit
    let reasonForTender = req.body.reasonForTender
    let decisionCritera = req.body.decisionCritera
    let feedbackAvailable = req.body.feedbackAvailable
    let potential = req.body.potential
    let additionalComment = req.body.additionalComment
    let countryLocation = req.body.countryLocation
    let documentUpload = []
    if (!req.files) {documentUpload = null} else {
        filesUploaded = req.files.fileUpload
        if (!filesUploaded.length) {filesUploaded = [filesUploaded]}
        for (let file of filesUploaded) {documentUpload.push(file.name)}
    }

    let newEntry = new RegisteredTender({
        recordDate: currentDateAndTime(),
        lastModifiedDate: null,
        isPreadvised: isPreadvised,
        preadviseID : preadviseID,
        companyName: companyName,
        sugarID: sugarID,
        businessVertical: businessVertical,
        contactName: contactName,
        contactJobTitle: contactJobTitle,
        contactEmail: contactEmail,
        decisionMaker: decisionMaker,
        transportMode: transportMode,
        airFreightVolume: airFreightVol,
        seaFreightFCLVolume: seaFreightFCLVol,
        seaFreightLCLVolume: seaFreightLCLVol,
        railFreightVolume: railFreightVol,
        commodity: commodity,
        specialHandling : specialHandling,
        linkedRFI: linkedRFI,
        deadlineRFI: deadlineRFI,
        receptionDate: receptionDate,
        deadlineRFQ: deadlineRFQ,
        decisionDate: decisionDate,
        startBusinessDate: startBusinessDate,
        keyTradelanes: keyTradelanes,
        lanesAmount: lanesAmount,
        transportationScope: transportationScope,
        ratesValidityAir: ratesValidityAir,
        ratesValidityFCL: ratesValidityFCL,
        ratesValidityLCL: ratesValidityLCL,
        ratesValidityRail: ratesValidityRail,
        contractPeriod: contractPeriod,
        paymentTerms: paymentTerms,
        bidRestrictions: bidRestrictions,
        bidRequirements: bidRequirements,
        roundsAmount: roundsAmount,
        tenderLaunchMethod: tenderLaunchMethod,
        history: history,
        existingCustomerSegment: existingCustomerSegment,
        visitFrequency: visitFrequency,
        visitHistory: visitHistory,
        currentServiceProvider: currentServiceProvider,
        competitorAmount: competitorAmount,
        volumeSplit: volumeSplit,
        reasonForTender: reasonForTender,
        decisionCritera: decisionCritera,
        feedbackAvailable: feedbackAvailable,
        documentUpload: documentUpload,
        potential: potential,
        additionalComment: additionalComment,
        countryLocation: countryLocation
    })

    await newEntry.save()

    if (req.files) {
        filesUploaded = req.files.fileUpload
        if (!filesUploaded.length) {filesUploaded = [filesUploaded]}
        for (let file of filesUploaded) {
        await file.mv(`./uploads/${newEntry._id}/${file.name}`, (err) => {
            if (err) {return res.status(500).send(err)}
            })
        }
    }

    if (isPreadvised === "yes") {
        isPreadvised = true
        preadviseID = req.body.preadviseID
        try {
           let updatedEntry = {
                launched: true,
                launchedTime: currentDateAndTime()
           }
            await PreadvisedTender.findByIdAndUpdate(preadviseID, updatedEntry)
        } catch (err) {
            return res.status(500).send(err)
        }
    }

    console.log(newEntry)
    console.log(`${colors.black.bgBrightGreen('* OK *')} A new TENDER has been registered in the database: ${companyName}`)
    res.redirect("/register/start")

//  let from = '"Tender registration" <appareil_en_ligne@outlook.com>'
//     let selectedEmail = "TESTrecipientemail@outlook.com" // Enter the recipient email here
//     let subject = "Your tender has been registered"
//     let attachement = null
//     // let attachement = [{
//     //     filename: 'Jean-Marie.jpg',
//     //     path: 'public/data/dummyAttachements/jm.jpg'
//     // }]
//     let emailBody = await ejs.renderFile("./emails/registerConfirm.ejs", {
//         userName: "Jean-Marie", // Enter the user name here
//         companyName: companyName, // Enter the company name here, it should be gathered from the form
//         registerId: newEntry.id, // Enter the registered ID here, it should be gathered after being saved in the database
//         isPreadvised: isPreadvised
//     });
    
//     const send = async function () {

//         let transporter = nodemailer.createTransport({
//             host: "smtp.office365.com",
//             port: 587,
//             secure: false, // true for 465, false for other ports
//             auth: {
//                 user: "appareil_en_ligne@outlook.com", // generated ethereal user
//                 pass: "XXXXXXXX", // generated ethereal password
//             },
//         });

//         let info = await transporter.sendMail({
//             from: from, // sender address
//             to: selectedEmail, // list of receivers
//             subject: subject, // Subject line
//             html: emailBody, // html body
//             attachments: attachement
//         });

//     }

//     // Nodemailer launch function - Uncomment below to enable to email launch.
//     try {
//         send()
//         console.log(`An email with the information related to the TENDER REGISTRATION of the company ${companyName}, has been sent`)
//     } catch (error) {
//         console.log(error)
//         res.send("ERROR ! Check console...")
//     }

})

app.get("/register/index", catchAsync(async function (req, res){
    const d = new Date()
    const today = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const d14 = new Date (d.setDate(d.getDate() + 14))
    const next14days = new Date(d14.getFullYear(), d14.getMonth(), d14.getDate())

    // const registered_past = await RegisteredTender.find({"deadlineRFQ": {$lt: today}})
    // const registered_inM = await RegisteredTender.find({"deadlineRFQ": {$gte: today, $lte: next30days}})
    // const registered_inQ = await RegisteredTender.find({"deadlineRFQ": {$gt: next30days, $lte: next90days}})
    // const registered_inY = await RegisteredTender.find({"deadlineRFQ": {$gt: next90days}})
    // let allRegisteredTenders = await RegisteredTender.find({})

    // ----- Function below is used to sort an array containing objects according to a defined attribute.
    // ----- Function below has been copied from https://stackoverflow.com/questions/10123953/how-to-sort-an-object-array-by-date-property
    var sortBy = (function () {
        var toString = Object.prototype.toString,
            // default parser function
            parse = function (x) { return x; },
            // gets the item to be sorted
            getItem = function (x) {
              var isObject = x != null && typeof x === "object";
              var isProp = isObject && this.prop in x;
              return this.parser(isProp ? x[this.prop] : x);
            };
            
        /**
         * Sorts an array of elements.
         *
         * @param {Array} array: the collection to sort
         * @param {Object} cfg: the configuration options
         * @property {String}   cfg.prop: property name (if it is an Array of objects)
         * @property {Boolean}  cfg.desc: determines whether the sort is descending
         * @property {Function} cfg.parser: function to parse the items to expected type
         * @return {Array}
         */
        return function sortby (array, cfg) {
          if (!(array instanceof Array && array.length)) return [];
          if (toString.call(cfg) !== "[object Object]") cfg = {};
          if (typeof cfg.parser !== "function") cfg.parser = parse;
          cfg.desc = !!cfg.desc ? -1 : 1;
          return array.sort(function (a, b) {
            a = getItem.call(cfg, a);
            b = getItem.call(cfg, b);
            return cfg.desc * (a < b ? -1 : +(a > b));
          });
        };
        
      }());

      const allRegisteredTenders = sortBy(await RegisteredTender.find({}), { prop: "deadlineRFQ" })
      const registered_past = sortBy(await RegisteredTender.find({"deadlineRFQ": {$lt: today}}), { prop: "deadlineRFQ" })
      const registered_14d = sortBy(await RegisteredTender.find({"deadlineRFQ": {$gt: today, $lte: next14days}}), { prop: "deadlineRFQ" })
      const registered_after = sortBy(await RegisteredTender.find({"deadlineRFQ": {$gt: next14days}}), { prop: "deadlineRFQ" })
      const registered_inAM = []
      const registered_inAP = []
      const registered_inEU = []

      for (let register of allRegisteredTenders) {
          for (let country of countriesData) {
              if (country.cca2 === register.countryLocation) {
                  if (country.region === "Europe" || country.region === "Africa" || country.subregion === "Central Asia" || country.subregion === "Western Asia") {
                    registered_inEU.push(register)
                  } else if (country.region === "Asia" || country.region === "Oceania") {
                    registered_inAP.push(register)
                  } else if (country.region === "Americas") {
                    registered_inAM.push(register)
                  } else (registered_inEU.push(register))
              }
          }
      }

    // ----- For debugging purposes
    // console.log(`"today" is registered as ${today}`)
    // console.log(`"next30days" is registered as ${next30days}`)
    // console.log(`"next90days" is registered as ${next90days}`)
    // console.log(`"preadvised_inM" results are ${preadvised_inM}`)
    // console.log(`"preadvised_inQ" results are ${preadvised_inQ}`)
    // console.log(`"preadvised_inY" results are ${preadvised_inY}`)
    // console.log(`"preadvised_inAM" results are ${preadvised_inAM}`)
    // console.log(`"preadvised_inAP" results are ${preadvised_inAP}`)
    // console.log(`"preadvised_inEU" results are ${preadvised_inEU}`)

    res.render("register_index.ejs", {countriesData, monthsData, today, next14days, allRegisteredTenders, registered_past, registered_14d, registered_after, registered_inAM, registered_inAP, registered_inEU})
}))

app.get("/register/:id", catchAsync(async function (req, res){
    let matchingId = req.params.id
    let matchingTender = await RegisteredTender.findById(matchingId)
    let filesUploaded = await listFiles(matchingId)
    if (!filesUploaded) {filesUploaded = []}
    res.render("register_show.ejs", {countriesData, monthsData, tradelanes, transportModes, transportScope, bidRestrictions, bidRequirements, history, specialHandling, matchingTender, filesUploaded})
}))

app.get("/register/edit/:id", catchAsync(async function (req, res){
    let matchingId = req.params.id
    let matchingTender = await RegisteredTender.findById(matchingId)
    let filesUploaded = await listFiles(matchingId)
    res.render("register_edit.ejs", {countriesData, monthsData, businessVerticals, matchingTender, filesUploaded})
}))

app.patch("/register/edit/:id", validateRegister, catchAsync(async function (req, res){
    let matchingId = req.params.id
    console.log(`${colors.black.bgBrightCyan('* ATTEMPT *')} A new TENDER REGISTRATION edit has been attempted`)
    console.log(req.body)
    console.log(req.files)

    let newIsPreadvised = req.body.isPreadvised
    let newPreadviseID
    if (newIsPreadvised === "yes") {
        newIsPreadvised = true
        newPreadviseID = req.body.preadviseID
    } else {
        newIsPreadvised = false
        newPreadviseID = null
    }
    let newCompanyName = req.body.companyName
    let newSugarID = req.body.sugarID
    let newBusinessVertical = req.body.businessVertical
    let newContactName = req.body.contactName
    let newContactJobTitle = req.body.contactJobTitle
    let newContactEmail = req.body.contactEmail
    let newDecisionMaker = req.body.decisionMaker
    let newTransportMode = req.body.transportMode
    if (typeof(newTransportMode) != "object") {newTransportMode = [newTransportMode]}
    let newAirFreightVol
    if(!req.body.airFreightVol) {newAirFreightVol = 0} else {newAirFreightVol = req.body.airFreightVol}
    let newSeaFreightFCLVol
    if(!req.body.seaFreightFCLVol) {newSeaFreightFCLVol = 0} else {newSeaFreightFCLVol = req.body.seaFreightFCLVol}
    let newSeaFreightLCLVol
    if(!req.body.seaFreightLCLVol) {newSeaFreightLCLVol = 0} else {newSeaFreightLCLVol = req.body.seaFreightLCLVol}
    let newRailFreightVol
    if(!req.body.railFreightVol) {newRailFreightVol = 0} else {newRailFreightVol = req.body.railFreightVol}
    let newKeyTradelanes = req.body.keyTradelanes
    if (typeof(newKeyTradelanes) != "object") {newKeyTradelanes = [newKeyTradelanes]}
    let newCommodity = req.body.commodity
    let newSpecialHandling
    if (!req.body.specialHandling) {
        newSpecialHandling = null
    } else {
        newSpecialHandling = req.body.specialHandling
        if (typeof(newSpecialHandling) != "object") {newSpecialHandling = [newSpecialHandling]}
    }
    let newLinkedRFI = req.body.linkedRFI
    let newDeadlineRFI
    if (newLinkedRFI === "yes") {
        newLinkedRFI = true
        newDeadlineRFI = req.body.deadlineRFI
    } else {
        newLinkedRFI = false
        newDeadlineRFI = null
    }
    let newReceptionDate = req.body.receptionDate
    let newDeadlineRFQ = req.body.deadlineRFQ
    let newDecisionDate = req.body.decisionDate
    let newStartBusinessDate = req.body.startBusinessDate
    if (typeof(newKeyTradelanes) != "object") {newKeyTradelanes = [newKeyTradelanes]}
    let newLanesAmount = req.body.lanesAmount
    let newTransportationScope = req.body.transportationScope
    if (typeof(newTransportationScope) != "object") {newTransportationScope = [newTransportationScope]}
    let newRatesValidityAir
    if (newAirFreightVol === 0) {newRatesValidityAir = null} else {newRatesValidityAir = req.body.ratesValidityAir}
    let newRatesValidityFCL
    if (newSeaFreightFCLVol === 0) {newRatesValidityFCL = null} else {newRatesValidityFCL = req.body.ratesValidityFCL}
    let newRatesValidityLCL
    if (newSeaFreightLCLVol === 0) {newRatesValidityLCL = null} else {newRatesValidityLCL = req.body.ratesValidityLCL}
    let newRatesValidityRail
    if (newRailFreightVol === 0) {newRatesValidityRail = null} else {newRatesValidityRail = req.body.ratesValidityRail}
    let newContractPeriod = req.body.contractPeriod
    let newPaymentTerms = req.body.paymentTerms
    let newBidRestrictions = req.body.bidRestrictions
    if (typeof(newBidRestrictions) != "object") {newBidRestrictions = [newBidRestrictions]}
    let newBidRequirements = req.body.bidRequirements
    if (typeof(newBidRequirements) != "object") {newBidRequirements = [newBidRequirements]}
    let newRoundsAmount = req.body.roundsAmount
    let newTenderLaunchMethod = req.body.tenderLaunchMethod
    let newHistory = req.body.history
    let newExistingCustomerSegment
    if(!req.body.existingCustomerSegment) {newExistingCustomerSegment = null} else {newExistingCustomerSegment = req.body.existingCustomerSegment}
    let newVisitFrequency = req.body.visitFrequency
    let newVisitHistory = req.body.visitHistory
    let newCurrentServiceProvider = req.body.currentServiceProvider
    let newCompetitorAmount = req.body.competitorAmount
    let newVolumeSplit = req.body.volumeSplit
    let newReasonForTender = req.body.reasonForTender
    let newDecisionCritera = req.body.decisionCritera
    let newFeedbackAvailable = req.body.feedbackAvailable
    let newPotential = req.body.potential
    let newAdditionalComment = req.body.additionalComment
    let newCountryLocation = req.body.countryLocation
    let newDocumentUpload = []
    if (!req.files) {
        let filesUploaded
        try {
           filesUploaded = await listFiles(matchingId)
        } catch (error) {
            filesUploaded = null
        }
        if (!filesUploaded) {
            newDocumentUpload = null
        } else {
            for (file of filesUploaded) {
                newDocumentUpload.push(file.name)
            }
        }
    } else {
        if (req.files.fileUpload) {
            newFilesUploaded = req.files.fileUpload
            if (!newFilesUploaded.length) {newFilesUploaded = [newFilesUploaded]}
            for (let file of newFilesUploaded) {newDocumentUpload.push(file.name)}
        }
        if (req.files.addFileUpload) {
            newFilesUploaded = req.files.addFileUpload
            if (!newFilesUploaded.length) {newFilesUploaded = [newFilesUploaded]}
            for (let file of newFilesUploaded) {newDocumentUpload.push(file.name)}
        }
        if (req.files.newFileUpload) {
            newFilesUploaded = req.files.newFileUpload
            if (!newFilesUploaded.length) {newFilesUploaded = [newFilesUploaded]}
            for (let file of newFilesUploaded) {newDocumentUpload.push(file.name)}
        }
    }

    let updatedEntry = {
        lastModifiedDate: currentDateAndTime(),
        isPreadvised: newIsPreadvised,
        preadviseID : newPreadviseID,
        companyName: newCompanyName,
        sugarID: newSugarID,
        businessVertical: newBusinessVertical,
        contactName: newContactName,
        contactJobTitle: newContactJobTitle,
        contactEmail: newContactEmail,
        decisionMaker: newDecisionMaker,
        transportMode: newTransportMode,
        airFreightVolume: newAirFreightVol,
        seaFreightFCLVolume: newSeaFreightFCLVol,
        seaFreightLCLVolume: newSeaFreightLCLVol,
        railFreightVolume: newRailFreightVol,
        commodity: newCommodity,
        specialHandling : newSpecialHandling,
        linkedRFI: newLinkedRFI,
        deadlineRFI: newDeadlineRFI,
        receptionDate: newReceptionDate,
        deadlineRFQ: newDeadlineRFQ,
        decisionDate: newDecisionDate,
        startBusinessDate: newStartBusinessDate,
        keyTradelanes: newKeyTradelanes,
        lanesAmount: newLanesAmount,
        transportationScope: newTransportationScope,
        ratesValidityAir: newRatesValidityAir,
        ratesValidityFCL: newRatesValidityFCL,
        ratesValidityLCL: newRatesValidityLCL,
        ratesValidityRail: newRatesValidityRail,
        contractPeriod: newContractPeriod,
        paymentTerms: newPaymentTerms,
        bidRestrictions: newBidRestrictions,
        bidRequirements: newBidRequirements,
        roundsAmount: newRoundsAmount,
        tenderLaunchMethod: newTenderLaunchMethod,
        history: newHistory,
        existingCustomerSegment: newExistingCustomerSegment,
        visitFrequency: newVisitFrequency,
        visitHistory: newVisitHistory,
        currentServiceProvider: newCurrentServiceProvider,
        competitorAmount: newCompetitorAmount,
        volumeSplit: newVolumeSplit,
        reasonForTender: newReasonForTender,
        decisionCritera: newDecisionCritera,
        feedbackAvailable: newFeedbackAvailable,
        documentUpload: newDocumentUpload,
        potential: newPotential,
        additionalComment: newAdditionalComment,
        countryLocation: newCountryLocation
    }

    await RegisteredTender.findByIdAndUpdate(matchingId, updatedEntry)

    if (req.files) {
        let filesUploaded
        if (req.files.fileUpload) {
            filesUploaded = req.files.fileUpload
            if (!filesUploaded.length) {filesUploaded = [filesUploaded]}
            for (let file of filesUploaded) {
                await file.mv(`./uploads/${matchingId}/${file.name}`, (err) => {
                    if (err) {return res.status(500).send(err)}
                    })
                }
        }
        if (req.files.addFileUpload) {
            filesUploaded = req.files.addFileUpload
            if (!filesUploaded.length) {filesUploaded = [filesUploaded]}
            for (let file of filesUploaded) {
                await file.mv(`./uploads/${matchingId}/${file.name}`, (err) => {
                    if (err) {return res.status(500).send(err)}
                    })
                }
        }
        if (req.files.newFileUpload) {
            filesUploaded = req.files.newFileUpload
            if (!filesUploaded.length) {filesUploaded = [filesUploaded]}
            await fs.rmdir(`./uploads/${matchingId}`, { recursive: true }, (err) => {
                if (err) {
                    throw err
                }
            })
            for (let file of filesUploaded) {
                await file.mv(`./uploads/${matchingId}/${file.name}`, (err) => {
                    if (err) {return res.status(500).send(err)}
                    })
                }
        }
        
    }

    console.log(updatedEntry)
    console.log(`${colors.black.bgBrightGreen('* OK *')} The TENDER data related to ${newCompanyName} has been updated in the database`)
    res.redirect("/register/start")

}))


// ----- Routes MOONSHOT OFFICES

app.get("/moonshot/office/start", function (req, res){
    res.render("office_start.ejs")
})

app.get("/moonshot/office/index", catchAsync(async function (req, res){
    let allOffices = await Office.find({})
    res.render("office_index.ejs", {countriesData, monthsData, allOffices})
}))

app.get("/moonshot/office/new", function (req, res) {
res.render("office_new.ejs", {countriesData, monthsData})
})

app.post("/moonshot/office/new", validateOffice, catchAsync(async function (req, res) {
    console.log(`${colors.black.bgBrightCyan('* ATTEMPT *')} A new OFFICE submit has been attempted with the following data:`)
    console.log(req.body)

    let cca2 = req.body.countryLocation
    let officeSetup = req.body.officeSetup
    let companyName = req.body.companyName
    let address = req.body.address
    let address_postCode = req.body.postCode
    let address_city = req.body.city
    let address_cca2 = req.body.countryName
    let tenderDesk = req.body.tenderDesk
    let lat = req.body.lat
    let lng = req.body.lng
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
        lng: lng
    })
    await newEntry.save()
    console.log(`${colors.black.bgBrightGreen('* OK *')} A new OFFICE has been registered in the database: ${companyName}`)
    res.redirect(`/moonshot/office/${newEntry._id}`)
}))

app.get("/moonshot/office/:id", catchAsync(async function (req, res){
    let matchingId = req.params.id
    let matchingOffice = await Office.findById(matchingId)
    // console.log(matchingOffice)
    res.render("office_show.ejs", {countriesData, monthsData, matchingOffice})
}))

app.get("/moonshot/office/edit/:id", catchAsync(async function (req, res){
    let matchingId = req.params.id
    let matchingOffice = await Office.findById(matchingId)
    // console.log(matchingOffice)
    res.render("office_edit.ejs", {countriesData, monthsData, matchingOffice})
}))

app.patch("/moonshot/office/edit/:id", validateOffice, catchAsync(async function (req, res){
    console.log(`${colors.black.bgBrightCyan('* ATTEMPT *')} An OFFICE has been selected for update: ${req.body.companyName}`)
    let matchingId = req.params.id
    let newcca2 = req.body.countryLocation
    let newOfficeSetup = req.body.officeSetup
    let newCompanyName = req.body.companyName
    let newAddress = req.body.address
    let newAddress_postCode = req.body.postCode
    let newAddress_city = req.body.city
    let newAddress_cca2 = req.body.countryName
    let newTenderDesk = req.body.tenderDesk
    let newLat = req.body.lat
    let newLng = req.body.lng
    
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
        lng: newLng
    })
    console.log(`${colors.black.bgBrightGreen('* OK *')} The OFFICE data related to ${newCompanyName} has been UPDATED with the following data: ${updatedOffice}`)
    res.redirect(`/moonshot/office/${matchingId}`)
}))

app.delete("/moonshot/office/:id", catchAsync(async function (req, res) {
    let matchingId = req.params.id
    let matchingOffice = await Office.findById(matchingId)
    console.log("An OFFICE has been selected for deletion...")
    console.log(matchingOffice)
    await Office.findByIdAndDelete(matchingId)
    console.log("... and has been deleted.")
    res.redirect("/moonshot/office/index")
}))

// ----- Routes for TEST PURPOSES
app.get("/test/:fileName", async function (req,res) {

    const fileName = `${req.params.fileName}.xlsx`
    console.log(fileName)
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet('My Sheet');
    ws.getCell('A1').value = 'John Doe';
    ws.getCell('B1').value = 'gardener';
    ws.getCell('C1').value = new Date().toLocaleString();

    let createFile = async function () {
        await wb.xlsx.writeFile(fileName)
        console.log("File created");
        try {
            fs.mkdir(`./uploads/test/${req.params.fileName}`, { recursive: true })
            fs.rename(`./${fileName}`,`./uploads/test/${req.params.fileName}/${fileName}`)
        } catch (err) {
            console.log("File not moved")
            console.log(err.message);
        }
    }

    try {
       createFile()
        
    } catch (err) {
        console.log("File not created")
        console.log(err.message);
    }

})

// ----- Routes for ERROR HANDLING

app.all("*", function (req, res, next) {
    next(new ExpressError("Page not found", 404))
})

app.use(function (err, req, res, next) {
    const {statusCode = 500, message = "Something went wrong"} = err
    res.status(statusCode).render("error500.ejs", {err})
    console.log(`${colors.brightYellow.bgBrightRed('*!* ERROR *!*')} - Status Code: ${statusCode} - Message: ${message}`)
    console.log(err)
})

// ----- Port listening

app.listen(3000, function () {
    console.log(`${colors.black.bgBrightGreen('* OK *')} MOONSHOT PROJECT - App is listening on port 3000`)
})