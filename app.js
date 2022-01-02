// App
const express = require("express")
const app = express()
const ejs = require("ejs")
const path = require("path")
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override")
const mongoose = require("mongoose")
const nodemailer = require("nodemailer")
const axios = require("axios")

// Database models
const PreadvisedTender = require("./models/preadvisedTender.js")
const Office = require("./models/office.js")

// Ressources
const countriesData = require('./public/ressources/countries.json')
const monthsData = require('./public/ressources/months.json')

// Middlewares
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride("_method"))
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.engine("ejs", ejsMate)

// Database connection
mongoose.connect("mongodb://localhost:27017/moonshot", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(function () {
        console.log("MOONSHOT PROJECT - Database connection OK (Mongoose)")
    })
    .catch(function (err) {
        console.log("MOONSHOT PROJECT - Database connection ERROR (Mongoose)")
        console.log(err)
    })

// Commonly used functions
const currentTimeAndDate = function () {return new Date(Date.now())}
const findCountryName = function (cca2) {for (country of countriesData) {if (country.cca2 === cca2) {return country.name.common}}}
const findcca2 = function (countryName) {for (country of countriesData) {if (country.common.name === countryName) {return country.cca2}}}

// Routes MOONSHOT HOME & START
app.get("/", function(req, res){
    res.send("Hello world !")
})

app.get("/moonshot", function (req, res) {
    res.render("indexHome.ejs")
})

app.get("/moonshot/start", function (req, res){
    res.render("indexStart.ejs")
})

// Routes MOONSHOT PREADVISED

app.get("/moonshot/preadvised/index", function(req, res){
    res.render("preadvised_index.ejs")
})

app.get("/moonshot/preadvised/start", function(req, res){
    res.render("preadvised_start.ejs")
})

app.get("/moonshot/preadvised/new", function (req, res) {
    res.render("preadvised_new.ejs", {countriesData})
})

app.post("/moonshot/preadvised/new", async function(req,res){
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
        relashionship,
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
        history: relashionship,
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
    
})


app.get("/moonshot/preadvised", async function (req, res) {
    let allPreadvisedTenders = await PreadvisedTender.find({})
    res.render("preadvised_index.ejs", {countriesData, monthsData, allPreadvisedTenders})
})

app.get("/moonshot/preadvised/:id", async function (req, res) {
    let matchingId = req.params.id
    let matchingTender = await PreadvisedTender.findById(matchingId)
    console.log(matchingTender)
    res.render("preadvised_show.ejs", {countriesData, monthsData, matchingTender})
})

app.delete("/moonshot/preadvised/:id", async function (req, res) {
    let matchingId = req.params.id
    let matchingTender = await PreadvisedTender.findById(matchingId)
    console.log("A TENDER PRE-ADVISE has been selected for deletion...")
    console.log(matchingTender)
    await PreadvisedTender.findByIdAndDelete(matchingId)
    console.log("... and has been deleted.")
    res.redirect("/moonshot/preadvised")
})

app.get("/moonshot/preadvised/edit/:id", async function (req, res){
    let matchingId = req.params.id
    let matchingTender = await PreadvisedTender.findById(matchingId)
    res.render("preadvised_edit.ejs", {countriesData, monthsData, matchingTender})
})

app.patch("/moonshot/preadvised/edit/:id", async function (req, res){
    let matchingId = req.params.id
    let {
        newCompanyName,
        newSugarID,
        newExpectedReceiveDate,
        newTransportMode,
        newAirFreightVolume,
        newSeaFreightFCLVolume,
        newSeaFreightLCLVolume,
        newRailFreightVolume,
        newKeyTradelanes,
        newRelashionship,
        newExistingCustomerSegment,
        newAdditionalComment,
        newCountryLocation
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

    let matchingTender = await PreadvisedTender.findByIdAndUpdate(matchingId, {
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
})

// Routes MOONSHOT OFFICES

app.get("/moonshot/office/start", function (req, res){
    res.render("office_start.ejs")
})

app.get("/moonshot/office/index", async function (req, res){
    let allOffices = await Office.find({})
    res.render("office_index.ejs", {countriesData, monthsData, allOffices})
})

app.get("/moonshot/office/new", function (req, res) {
res.render("office_new.ejs", {countriesData, monthsData})
})

app.post("/moonshot/office/new", async function (req, res) {
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
})

app.get("/moonshot/office/:id", async function (req, res){
    let matchingId = req.params.id
    let matchingOffice = await Office.findById(matchingId)
    console.log(matchingOffice)
    res.render("office_show.ejs", {countriesData, monthsData, matchingOffice})
})

app.get("/moonshot/office/edit/:id", async function (req, res){
    let matchingId = req.params.id
    let matchingOffice = await Office.findById(matchingId)
    console.log(matchingOffice)
    res.render("office_edit.ejs", {countriesData, monthsData, matchingOffice})
})

app.patch("/moonshot/office/edit/:id", async function (req, res){
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
})

app.listen(3000, function () {
    console.log("MOONSHOT PROJECT - App is listening on port 3000")
})