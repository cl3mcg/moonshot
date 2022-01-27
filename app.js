// ----- App
const express = require("express")
const app = express()
const colors = require('colors')
const ejs = require("ejs")
const path = require("path")
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override")
const mongoose = require("mongoose")
const nodemailer = require("nodemailer")
const Joi = require("joi")

// ----- Extended error class
const ExpressError = require('./Utilities/ExpressError.js')

// ----- Database models
const PreadvisedTender = require("./models/preadvisedTender.js")
const Office = require("./models/office.js")

// ----- Ressources
const countriesData = require('./public/ressources/countries.json')
const monthsData = require('./public/ressources/months.json')
const tradelanes = require('./public/ressources/tradelanes.json')
const history = require('./public/ressources/history.json')
const transportModes = require('./public/ressources/transportModes.json')

// ----- Middlewares
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride("_method"))
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.engine("ejs", ejsMate)

// ----- catchAsync middleware used to handle Async functions errors
const catchAsync = require('./Utilities/catchAsync.js')

// ----- validatePreadvised middleware used with JOI to validate new preavised tenders according to JOI schema
const validatePreadvised = function (req, res, next) {

    const preadvisedSchema = Joi.object({
        companyName: Joi.string().required(),
        sugarID: Joi.string().required(),
        expectedReceiveDate: Joi.date().required(),
        keyTradelanes: Joi.alternatives().try(Joi.string().required(), Joi.array().required()),
        transportMode: Joi.alternatives().try(Joi.string().required(), Joi.array().required()),
        history: Joi.alternatives().try(Joi.string().required(), Joi.array().required()),
        existingCustomerSegment: Joi.optional(),
        additionalComment: Joi.optional(),
        countryLocation: Joi.string().required()
        })

    const result = preadvisedSchema.validate(req.body)
    if (result.error) {
        const errorMsg = result.error.details.map(
            function (element) {
                return element.message
            }
        ).join(",")
        throw new ExpressError(errorMsg, 400)
    }
    else {
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
const currentTimeAndDate = function () {return new Date(Date.now())}
const findCountryName = function (cca2) {for (country of countriesData) {if (country.cca2 === cca2) {return country.name.common}}}
const findcca2 = function (countryName) {for (country of countriesData) {if (country.common.name === countryName) {return country.cca2}}}

// ----- Routes MOONSHOT HOME & START
app.get("/", function(req, res){
    res.send("Hello world !")
})

app.get("/moonshot", function (req, res) {
    res.render("indexHome.ejs")
})

app.get("/moonshot/start", function (req, res){
    res.render("indexStart.ejs")
})

// ----- Routes MOONSHOT PREADVISED

app.get("/moonshot/preadvised/start", function(req, res){
    res.render("preadvised_start.ejs")
})

app.get("/moonshot/preadvised/new", function (req, res) {
    res.render("preadvised_new.ejs", {countriesData})
})

app.post("/moonshot/preadvised/new", validatePreadvised, catchAsync(async function(req,res, next){
        
    console.log(`A new TENDER PRE-ADVISE submit has been done with the following data:`)
    console.log(req.body)
    let {
        companyName,
        sugarID,
        expectedReceiveDate,
        transportMode,
        airFreightVolume,
        seaFreightFCLVolume,
        seaFreightLCLVolume,
        railFreightVolume,
        keyTradelanes,
        history,
        existingCustomerSegment,
        additionalComment,
        countryLocation
    } = req.body
    let volValidation = [
        airFreightVolume,
        seaFreightFCLVolume,
        seaFreightLCLVolume,
        railFreightVolume]
        for (let entry of volValidation) {if (!entry) {entry = 0}}
    let arrayValidation = [transportMode,
        keyTradelanes]
    for (let entry of arrayValidation) {if (typeof(entry) != "object") {entry = [entry]}}
    let newEntry = new PreadvisedTender({
        recordDate: currentTimeAndDate(),
        lastModifiedDate: null,
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
    console.log(`A new TENDER PRE-ADVISE has been registered in the database: ${companyName}`)
    res.redirect("/moonshot/preadvised/new")

        let from = '"Tender registration" <appareil_en_ligne@outlook.com>'
        let subject = "Your tender has been pre-advised"
        let attachement = null
        // let attachement = [{
        //     filename: 'Jean-Marie.jpg',
        //     path: 'public/data/dummyAttachements/jm.jpg'
        // }]
        let emailBody = "<b>Hello world?</b><br><p>J'ai une rage incroyable</p>"
    
    const send = async function () {

        let transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "appareil_en_ligne@outlook.com", // generated ethereal user
                pass: "XxXxXxXxXxXxXx", // generated ethereal password
            },
        });

        let info = await transporter.sendMail({
            from: from, // sender address
            to: selectedEmail, // list of receivers
            subject: subject, // Subject line
            html: emailBody, // html body
            attachments: attachement
        });

    }

    // Nodemailer launch function - Uncomment below to enable to email launch.
    // try {
    //     send()
    //     console.log(`An email with the information related to the TENDER PRE-ADVISE of the company ${companyName}, has been sent`)
    // } catch (error) {
    //     console.log(error)
    //     res.send("ERROR ! Check console...")
    // }
    
}))


app.get("/moonshot/preadvised", catchAsync(async function (req, res) {
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

app.get("/moonshot/preadvised/:id", catchAsync(async function (req, res) {
    let matchingId = req.params.id
    let matchingTender = await PreadvisedTender.findById(matchingId)
    // ----- For debugging purposes
    // console.log(matchingTender)
    res.render("preadvised_show.ejs", {countriesData, monthsData, tradelanes, transportModes, history, matchingTender})
}))

app.delete("/moonshot/preadvised/:id", catchAsync(async function (req, res) {
    let matchingId = req.params.id
    let matchingTender = await PreadvisedTender.findById(matchingId)
    console.log("A TENDER PRE-ADVISE has been selected for deletion...")
    console.log(matchingTender)
    await PreadvisedTender.findByIdAndDelete(matchingId)
    console.log("... and has been deleted.")
    res.redirect("/moonshot/preadvised")
}))

app.get("/moonshot/preadvised/edit/:id", catchAsync(async function (req, res){
    let matchingId = req.params.id
    let matchingTender = await PreadvisedTender.findById(matchingId)
    res.render("preadvised_edit.ejs", {countriesData, monthsData, matchingTender})
}))

app.patch("/moonshot/preadvised/edit/:id", catchAsync(async function (req, res){
    let matchingId = req.params.id

    let newCompanyName = req.body.companyName
    let newSugarID = req.body.sugarID
    let newExpectedReceiveDate = req.body.expectedReceiveDate
    let newTransportMode = req.body.transportMode
    let newAirFreightVolume = req.body.airFreightVolume
    let newSeaFreightFCLVolume = req.body.seaFreightFCLVolume
    let newSeaFreightLCLVolume = req.body.seaFreightLCLVolume
    let newRailFreightVolume = req.body.railFreightVolume
    let newKeyTradelanes = req.body.keyTradelanes
    let newRelashionship = req.body.relashionship
    let newExistingCustomerSegment = req.body.existingCustomerSegment
    let newAdditionalComment = req.body.additionalComment
    let newCountryLocation = req.body.countryLocation
   
    console.log(req.body)
    console.log(newExpectedReceiveDate)

    let volValidation = [
        newAirFreightVolume,
        newSeaFreightFCLVolume,
        newSeaFreightLCLVolume,
        newRailFreightVolume]
        for (let entry of volValidation) {if (!entry) {entry = 0}}
    let arrayValidation = [newTransportMode, newKeyTradelanes]
    for (let entry of arrayValidation) {if (typeof(entry) != "object") {entry = [entry]}}

    await PreadvisedTender.findByIdAndUpdate(matchingId, {
        lastModifiedDate: currentTimeAndDate(),
        companyName: newCompanyName,
        sugarID: newSugarID,
        expectedReceiveDate: newExpectedReceiveDate,
        transportMode: newTransportMode,
        airFreightVolume: newAirFreightVolume,
        seaFreightFCLVolume: newSeaFreightFCLVolume,
        seaFreightLCLVolume: newSeaFreightLCLVolume,
        railFreightVolume: newRailFreightVolume,
        keyTradelanes: newKeyTradelanes,
        history: newRelashionship,
        existingCustomerSegment: newExistingCustomerSegment,
        additionalComment: newAdditionalComment,
        countryLocation: newCountryLocation
    })
    console.log(`The tender related to the company ${newCompanyName} has been UPDATED`)
    res.redirect(`/moonshot/preadvised/${matchingId}`)
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

app.post("/moonshot/office/new", catchAsync(async function (req, res) {
    let {
        countryLocation,
        officeSetup,
        companyName,
        address,
        postCode,
        city,
        countryName,
        latlng,
        tenderDesk,
    } = req.body
    console.log(req.body)
    console.log(`Maching country is ${findCountryName(req.body.countryLocation)}`)
    let newEntry = new Office({
        recordDate: currentTimeAndDate(),
        lastModifiedDate: null,
        officeRelatedCountry: findCountryName(countryLocation),
        cca2: countryLocation,
        officeSetup: officeSetup,
        companyName: companyName,
        address: address,
        address_postCode: postCode,
        address_city: city,
        address_cca2: countryName,
        tenderDesk: tenderDesk,
        latlng: latlng
    })
    await newEntry.save()
    res.redirect(`/moonshot/office/${newEntry._id}`)
}))

app.get("/moonshot/office/:id", catchAsync(async function (req, res){
    let matchingId = req.params.id
    let matchingOffice = await Office.findById(matchingId)
    console.log(matchingOffice)
    res.render("office_show.ejs", {countriesData, monthsData, matchingOffice})
}))

app.get("/moonshot/office/edit/:id", catchAsync(async function (req, res){
    let matchingId = req.params.id
    let matchingOffice = await Office.findById(matchingId)
    console.log(matchingOffice)
    res.render("office_edit.ejs", {countriesData, monthsData, matchingOffice})
}))

app.patch("/moonshot/office/edit/:id", catchAsync(async function (req, res){
    let matchingId = req.params.id
    console.log(req.body)
    let {
        newCountryLocation,
        newOfficeSetup,
        newCompanyName,
        newAddress,
        newPostCode,
        newCity,
        newCountryName,
        newLatlng,
        newTenderDesk,
    } = req.body
    let updateOffice = await Office.findByIdAndUpdate(matchingId, {
        lastModifiedDate: currentTimeAndDate(),
        cca2: newCountryLocation,
        officeSetup: newOfficeSetup,
        companyName: newCompanyName,
        address: newAddress,
        address_postCode: newPostCode,
        address_city: newCity,
        address_cca2: newCountryName,
        tenderDesk: newTenderDesk,
        latlng: newLatlng
    })
    console.log(`The office related to the company ${newCompanyName} has been UPDATED`)
    res.redirect(`/moonshot/office/${matchingId}`)
}))

// ----- Routes for ERROR HANDLING

app.all("*", function (req, res, next) {
    next(new ExpressError("Page not found", 404))
})

app.use(function (err, req, res, next) {
    const {statusCode = 500, message = "Something went wrong"} = err
    res.status(statusCode).send(message)
    console.log(`ERROR - Status Code ${statusCode} - Message ${message}`)
    console.log(err)
})

// ----- Port listening

app.listen(3000, function () {
    console.log(`${colors.black.bgBrightGreen('* OK *')} MOONSHOT PROJECT - App is listening on port 3000`)
})