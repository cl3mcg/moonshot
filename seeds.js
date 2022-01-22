// ----- App
const express = require("express")
const app = express()
const colors = require('colors')
const ejs = require("ejs")
const path = require("path")
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override")
const mongoose = require("mongoose")

// ----- Database models
const PreadvisedTender = require("./models/preadvisedTender.js")
const Office = require("./models/office.js")

// ----- Ressources
const countriesData = require('./public/ressources/countries.json')
const monthsData = require('./public/ressources/months.json')

// ----- Middlewares
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride("_method"))
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.engine("ejs", ejsMate)

// ----- Database connection
mongoose.connect("mongodb://localhost:27017/moonshot", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(function () {
        console.log(`${colors.brightYellow.bgBrightRed('*!* WARNING *!*')} ${colors.yellow('SEEDS')} MOONSHOT PROJECT - Database connection OK (Mongoose)`)
})
    .catch(function (err) {
        console.log(`${colors.brightYellow.bgBrightRed('*!* WARNING *!*')} ${colors.yellow('SEEDS')} - Database connection ERROR (Mongoose)`)
        console.log(err)
})

// ----- Random generator

const fakeCompanies = [
    {"Company Name": "McClure LLC", "Description": "Future-Proofed Well-Modulated Encryption", "Tagline": "Repurpose Leading-Edge Paradigms", "Company Email": "rosemarie.feil@bradtke.com", "Ein": "90-1131547"},
    {"Company Name": "Rippin, Braun and Prosacco", "Description": "Balanced Motivating Adapter", "Tagline": "Deliver Mission-Critical Bandwidth", "Company Email": "stark.braden@ankunding.com", "Ein": "12-1476666"},
    {"Company Name": "Wolf-Sauer", "Description": "Multi-Lateral Intermediate Artificialintelligence", "Tagline": "Drive Compelling Web-Readiness", "Company Email": "kraig34@leuschke.com", "Ein": "45-5513480"},
    {"Company Name": "Kerluke, Gibson and Considine", "Description": "Multi-Channelled Bifurcated Architecture", "Tagline": "Synergize Ubiquitous Markets", "Company Email": "lowe.neoma@hamill.info", "Ein": "73-4422523"},
    {"Company Name": "Trantow Ltd", "Description": "Adaptive Real-Time Framework", "Tagline": "Empower Mission-Critical Platforms", "Company Email": "whalvorson@koss.com", "Ein": "55-3294891"},
    {"Company Name": "Mitchell Group", "Description": "Customer-Focused Assymetric Task-Force", "Tagline": "Drive Virtual Webservices", "Company Email": "beatty.brycen@spinka.com", "Ein": "80-1425531"},
    {"Company Name": "Tromp, Walter and Turcotte", "Description": "Cross-Platform Analyzing Help-Desk", "Tagline": "Drive Transparent Systems", "Company Email": "bennie68@langworth.org", "Ein": "11-6319775"},
    {"Company Name": "Prohaska-Kemmer", "Description": "Streamlined Multi-State Encryption", "Tagline": "Redefine B2C Infrastructures", "Company Email": "ifritsch@sawayn.com", "Ein": "87-1436653"},
    {"Company Name": "Schuster, Raynor and Hermann", "Description": "Polarised Discrete Intranet", "Tagline": "Drive Out-Of-The-Box Users", "Company Email": "sauer@kiehn.com", "Ein": "58-3813326"},
    {"Company Name": "Bosco-Brekke", "Description": "Implemented Reciprocal Concept", "Tagline": "Synthesize Killer Infrastructures", "Company Email": "ogrant@willms.net", "Ein": "55-2033954"},
    {"Company Name": "Grady-Lubowitz", "Description": "Advanced Reciprocal Challenge", "Tagline": "Drive Wireless Partnerships", "Company Email": "fbrekke@effertz.info", "Ein": "51-9846030"},
    {"Company Name": "Grimes and Sons", "Description": "Centralized Uniform Intranet", "Tagline": "Expedite Rich Networks", "Company Email": "jadyn31@hackett.com", "Ein": "06-1873700"},
    {"Company Name": "Ritchie, Kirlin and Bailey", "Description": "Function-Based Value-Added Graphicaluserinterface", "Tagline": "Disintermediate World-Class Webservices", "Company Email": "pascale89@kreiger.net", "Ein": "62-1623348"},
    {"Company Name": "Reynolds Ltd", "Description": "Managed Stable Openarchitecture", "Tagline": "Optimize Efficient Content", "Company Email": "langworth.randall@bins.info", "Ein": "10-4700481"},
    {"Company Name": "Will PLC", "Description": "Extended Context-Sensitive Leverage", "Tagline": "Optimize Sticky Vortals", "Company Email": "harry53@sanford.biz", "Ein": "42-5306953"},
    {"Company Name": "Gulgowski-Durgan", "Description": "Fundamental Static Graphicaluserinterface", "Tagline": "Reinvent Proactive Niches", "Company Email": "danielle40@armstrong.net", "Ein": "34-9614230"},
    {"Company Name": "Frami, Streich and Murphy", "Description": "Re-Contextualized 3Rdgeneration Project", "Tagline": "Empower Revolutionary Functionalities", "Company Email": "okutch@steuber.com", "Ein": "20-5092279"},
    {"Company Name": "Breitenberg-Stamm", "Description": "Networked Tangible Algorithm", "Tagline": "Harness 24/365 Deliverables", "Company Email": "weimann.una@aufderhar.com", "Ein": "60-6484991"},
    {"Company Name": "Thompson, Parker and Walker", "Description": "Extended Discrete Opensystem", "Tagline": "Deploy Enterprise Webservices", "Company Email": "valentina.larkin@stehr.org", "Ein": "91-7365743"},
    {"Company Name": "Ratke Group", "Description": "Down-Sized Multimedia Application", "Tagline": "Recontextualize Distributed Schemas", "Company Email": "tkris@shanahan.biz", "Ein": "33-6591147"},
    {"Company Name": "Hintz, Harris and Rau", "Description": "Realigned Discrete Benchmark", "Tagline": "Evolve Intuitive Mindshare", "Company Email": "emery.fadel@schamberger.net", "Ein": "55-1927558"},
    {"Company Name": "Frami and Sons", "Description": "Open-Architected Reciprocal Paradigm", "Tagline": "Revolutionize Virtual Content", "Company Email": "xfunk@bahringer.com", "Ein": "05-7120671"},
    {"Company Name": "Kozey, Armstrong and Gibson", "Description": "Ameliorated Content-Based Challenge", "Tagline": "Drive Cutting-Edge Schemas", "Company Email": "jaden65@gleason.org", "Ein": "06-9923258"},
    {"Company Name": "Gutmann PLC", "Description": "Switchable Needs-Based Time-Frame", "Tagline": "Revolutionize Cross-Media Applications", "Company Email": "lyda88@kris.com", "Ein": "10-8402043"},
    {"Company Name": "Barton, Rempel and Hudson", "Description": "Open-Source Clear-Thinking Info-Mediaries", "Tagline": "Matrix Leading-Edge Supply-Chains", "Company Email": "yasmeen.tromp@herman.info", "Ein": "32-5549035"},
    {"Company Name": "Bednar, Gulgowski and Davis", "Description": "Upgradable Interactive Solution", "Tagline": "Recontextualize Integrated Mindshare", "Company Email": "lexie.bogan@langworth.info", "Ein": "74-2160070"},
    {"Company Name": "Gislason-Klocko", "Description": "Profit-Focused Real-Time Utilisation", "Tagline": "Enable User-Centric E-Business", "Company Email": "alessandro.dach@strosin.org", "Ein": "73-8235403"},
    {"Company Name": "Yundt, D'Amore and Blick", "Description": "Monitored Zeroadministration Migration", "Tagline": "Aggregate Cutting-Edge Niches", "Company Email": "rau.ivory@mclaughlin.info", "Ein": "31-9144563"},
    {"Company Name": "Kshlerin-Hansen", "Description": "Persevering Tangible Architecture", "Tagline": "Architect Viral Technologies", "Company Email": "ozulauf@breitenberg.com", "Ein": "11-8364987"},
    {"Company Name": "Borer, Reynolds and Yost", "Description": "Quality-Focused Attitude-Oriented Project", "Tagline": "Disintermediate Innovative Vortals", "Company Email": "bergnaum.judd@rippin.com", "Ein": "77-8139029"},
    {"Company Name": "Greenholt Ltd", "Description": "Advanced Object-Oriented Data-Warehouse", "Tagline": "Benchmark B2B Architectures", "Company Email": "greenholt.amara@spinka.info", "Ein": "36-9007924"},
    {"Company Name": "Wyman, Witting and Christiansen", "Description": "Re-Contextualized Logistical Protocol", "Tagline": "Innovate Killer Methodologies", "Company Email": "ethan.boyle@hettinger.com", "Ein": "88-1373781"},
    {"Company Name": "Hand-Hyatt", "Description": "Compatible Mission-Critical Graphicinterface", "Tagline": "Engineer Seamless Eyeballs", "Company Email": "jacobson.wanda@ortiz.com", "Ein": "74-1958689"},
    {"Company Name": "Marquardt, Schulist and Gutmann", "Description": "Persistent Non-Volatile Pricingstructure", "Tagline": "Extend Robust Infrastructures", "Company Email": "fhaag@veum.com", "Ein": "75-5240519"},
    {"Company Name": "Olson Ltd", "Description": "Right-Sized 4Thgeneration Contingency", "Tagline": "Visualize 24/7 Infrastructures", "Company Email": "cdouglas@nikolaus.com", "Ein": "82-9539396"},
    {"Company Name": "Kessler-Bosco", "Description": "Proactive Zeroadministration Software", "Tagline": "Redefine Dynamic Schemas", "Company Email": "kaitlyn.walsh@cole.org", "Ein": "67-6341509"},
    {"Company Name": "Ratke Group", "Description": "Down-Sized Multimedia Application", "Tagline": "Recontextualize Distributed Schemas", "Company Email": "tkris@shanahan.biz", "Ein": "33-6591147"},
    {"Company Name": "Cummerata-Schumm", "Description": "Configurable User-Facing Middleware", "Tagline": "Orchestrate Synergistic Metrics", "Company Email": "khalid.feest@langosh.com", "Ein": "95-3466619"},
    {"Company Name": "Schmitt-Koch", "Description": "Fully-Configurable Logistical Capacity", "Tagline": "Streamline Virtual E-Tailers", "Company Email": "lehner.margot@mclaughlin.com", "Ein": "66-5880694"},
    {"Company Name": "Jenkins, Jakubowski and Welch", "Description": "Enhanced 4Thgeneration Access", "Tagline": "Enhance Transparent Content", "Company Email": "mkihn@fahey.net", "Ein": "41-1550096"},
]

const transportModeOptions = ["hasAirFreight", "hasSeaFreightFCL", "hasSeaFreightLCL", "hasRailFreight"]
const tradelanesOptions = ["americasToAfrica","americasToAmericas","americasToAsia","americasToEurope","americasToOceania","asiaToAfrica","asiaToAmericas","asiaToAsia","asiaToEurope","asiaToOceania","europeToAmericas","europeToAsia","europeToEurope","europeToOceania","europeToAfrica","oceaniaToAmericas","oceaniaToAsia","oceaniaToEurope","africaToEurope","africaToAsia","africaToAmericas"]
const historyOptions = ["historyAirOcean", "historyRoadFreight", "historyContractLog", "historyPortLog", "historyNone"]
const countryOptions = ["CA", "US", "MX", "CO", "BR", "AR", "CL", "AR", "GB", "IE", "FR", "ES", "PT", "DE", "IT", "PL", "CZ", "AT", "CH", "NL", "BE", "RU", "CN", "JP", "KR", "TW", "VN", "TH", "MM", "PH", "SG", "IN", "ID", "AU", "NZ", "DZ", "KZ", "AE", "MA", "ZA", "IL"]

let amountofSeeds = 0

// ----- Commonly used functions
const currentTimeAndDate = function () {return new Date(Date.now())}
const findCountryName = function (cca2) {for (country of countriesData) {if (country.cca2 === cca2) {return country.name.common}}}
const findcca2 = function (countryName) {for (country of countriesData) {if (country.common.name === countryName) {return country.cca2}}}

var randomDate = function (start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
  
var randomIndex = function (array) {
return Math.floor(Math.random()*array.length)
}


// ----- Routes MOONSHOT SEEDS - Seeds for preadvised tenders
app.get("/", async function(req, res){

for (let i = 0; i < 25; i++){
let seed_recordDate = randomDate(new Date(2021, 9, 1), new Date(2022, 3, 30));
let seed_lastModifiedDate = null;
let seed_companyName = fakeCompanies[Math.floor(Math.random()*40)]["Company Name"];
let seed_sugarID = fakeCompanies[Math.floor(Math.random()*40)]["Ein"];
let seed_expectedReceiveDate = randomDate(seed_recordDate, new Date(2022, 2, 30));
let seed_transportMode = [];
let transportModeRand = function () {for (let i = 0; i < randomIndex(transportModeOptions)+1; i++) {
    let randomNum = Math.floor(Math.random()*10)+1
    if (randomNum === 10 && !seed_transportMode.includes("hasRailFreight")) {seed_transportMode.push("hasRailFreight")}
    else if (randomNum >= 8 && !seed_transportMode.includes("hasSeaFreightLCL")) {seed_transportMode.push("hasSeaFreightLCL")}
    else if (randomNum >= 7 && !seed_transportMode.includes("hasAirFreight")) {seed_transportMode.push("hasAirFreight")}
    else if (!seed_transportMode.includes("hasSeaFreightFCL")) {seed_transportMode.push("hasSeaFreightFCL")}
}};
transportModeRand();

let seed_airFreightVolume = 0;
let seed_seaFreightFCLVolume = 0;
let seed_seaFreightLCLVolume = 0;
let seed_railFreightVolume = 0;
let volumesRand = function () {
if (seed_transportMode.includes("hasAirFreight")) {seed_airFreightVolume = Math.floor(Math.random()*2000)}
if (seed_transportMode.includes("hasSeaFreightFCL")) {seed_seaFreightFCLVolume = Math.floor(Math.random()*20000)}
if (seed_transportMode.includes("hasSeaFreightLCL")) {seed_seaFreightLCLVolume = Math.floor(Math.random()*2000)}
if (seed_transportMode.includes("hasRailFreight")) {seed_railFreightVolume = Math.floor(Math.random()*2000)}
};
volumesRand();

let seed_keyTradelanes = [];
let keyTradelanesRand = function () {
    let randomAmount = Math.floor(Math.random()*4)+1
    for (let i = 0; i <= randomAmount; i++) {
        let randIndex = Math.floor(Math.random()*randomIndex(tradelanesOptions))
        seed_keyTradelanes.push(tradelanesOptions[randIndex])
    }
};
keyTradelanesRand();

let seed_history = [];
let historyRand = function () {for (let i = 0; i < randomIndex(transportModeOptions)+1; i++) {
    let randomNum = Math.floor(Math.random()*10)+1
    if (randomNum === 10 && !seed_history.includes("historyNone")) {seed_history.push("historyNone")}
    else if (randomNum >= 9 && !seed_history.includes("historyPortLog")) {seed_history.push("historyPortLog")}
    else if (randomNum >= 8 && !seed_history.includes("historyContractLog")) {seed_history.push("historyContractLog")}
    else if (randomNum >= 8 && !seed_history.includes("historyRoadFreight")) {seed_history.push("historyRoadFreight")}
    else if (!seed_history.includes("historyAirOcean")) {seed_history.push("historyAirOcean")}
}};
historyRand();

let seed_existingCustomerSegment = null;
if (seed_history.includes("historyAirOcean") && (seed_airFreightVolume >= 1000 || seed_seaFreightFCLVolume >= 1000 || seed_seaFreightLCLVolume >= 1000 || seed_railFreightVolume >= 1000)) {
    seed_existingCustomerSegment = "A-customer"
} else if (seed_history.includes("historyAirOcean") && (seed_airFreightVolume >= 500 || seed_seaFreightFCLVolume >= 500 || seed_seaFreightLCLVolume >= 500 || seed_railFreightVolume >= 500)) {
    seed_existingCustomerSegment = "B-customer"
} else if (seed_history.includes("historyAirOcean")) {
    seed_existingCustomerSegment = "C-customer"
}

let seed_additionalComment = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam culpa, aliquid atque ea, sed officiis commodi iusto et quibusdam suscipit totam rerum!"

let seed_countryLocation = countryOptions[randomIndex(countryOptions)]

amountofSeeds = amountofSeeds + 1

let newEntry = new PreadvisedTender({
    recordDate: seed_recordDate,
    lastModifiedDate: seed_lastModifiedDate,
    companyName: seed_companyName,
    sugarID: seed_sugarID,
    expectedReceiveDate: seed_expectedReceiveDate,
    transportMode: seed_transportMode,
    airFreightVolume: seed_airFreightVolume,
    seaFreightFCLVolume: seed_seaFreightFCLVolume,
    seaFreightLCLVolume: seed_seaFreightLCLVolume,
    railFreightVolume: seed_railFreightVolume,
    keyTradelanes: seed_keyTradelanes,
    history: seed_history,
    existingCustomerSegment: seed_existingCustomerSegment,
    additionalComment: seed_additionalComment,
    countryLocation: seed_countryLocation,
})
await newEntry.save()
console.log(`${colors.bgBrightGreen('* SEED *')} A new TENDER PRE-ADVISE has been registered in the database: ${seed_companyName}`)
}

res.send(`Preadvise Tender database has been seeded with ${amountofSeeds} randomly generated objects... To revert the operation, run in MongoDB shell the following command >>> db.preadvisedtenders.deleteMany({"additionalComment":"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam culpa, aliquid atque ea, sed officiis commodi iusto et quibusdam suscipit totam rerum!"})`)
})


app.listen(3000, function () {
console.log(`${colors.brightYellow.bgBrightRed('*!* WARNING *!*')} ${colors.yellow('SEEDS')} MOONSHOT PROJECT - App is listening on port 3000`)
})