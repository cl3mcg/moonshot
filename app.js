// App
const express = require("express")
const app = express()
const ejs = require("ejs")
const path = require("path")
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override")
const mongoose = require("mongoose")

// Database models
const PreadvisedTender = require("./models/preadvisedTender.js")

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

// Routes
app.get("/", function(req, res){
    res.send("Hello world !")
})

app.get("/moonshot", function (req, res) {
    res.render("indexHome.ejs")
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
    let registrationDate = function () {return new Date(Date.now())}
    let newEntry = new PreadvisedTender({
        recordDate: registrationDate(),
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

app.listen(3000, function () {
    console.log("MOONSHOT PROJECT - App is listening on port 3000")
})