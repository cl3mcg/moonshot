// ----- .env setup
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// ----- App
const express = require("express");
const app = express();
const fs = require("fs").promises;
const colors = require("colors");
const ejs = require("ejs");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo');
const session = require("express-session");
const flash = require("connect-flash");
const nodemailer = require("nodemailer");
const Excel = require("exceljs");
const PDFDocument = require("pdf-lib").PDFDocument;
const StandardFonts = require("pdf-lib").StandardFonts;
const fontkit = require("@pdf-lib/fontkit")
const passport = require('passport');
const LocalStrategy = require('passport-local');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
// const Joi = require("joi") // Joi is exported in its own file called joiSchema.js, no need to require it again here.
const {
  preadviseSchema,
  registerSchema,
  officeSchema,
} = require("./utilities/joischemas.js");

const delayEmail = require("./utilities/crondelayemail.js");

const { uploadFile, downloadFile, deleteFile }  = require("./utilities/s3.js");

// ----- Extended error class
const ExpressError = require("./utilities/expresserror.js");

// ----- Database models
const PreadvisedTender = require("./models/preadvisedTender.js");
const Office = require("./models/office.js");
const RegisteredTender = require("./models/registeredTender.js");
const User = require("./models/user.js");

// ----- Ressources
// const countriesData = require("./public/ressources/countries.json");
// const monthsData = require("./public/ressources/months.json");
// const tradelanes = require("./public/ressources/tradelanes.json");
// const history = require("./public/ressources/history.json");
// const transportModes = require("./public/ressources/transportModes.json");
// const transportScope = require("./public/ressources/transportScope.json");
// const bidRestrictions = require("./public/ressources/bidRestrictions.json");
// const bidRequirements = require("./public/ressources/bidRequirements.json");
// const businessVerticals = require("./public/ressources/businessVerticals.json");
// const specialHandling = require("./public/ressources/specialHandling.json");
// const freightForwarders = require("./public/ressources/freightForwarders.json");

// ----- Initialization functions

const initEmailScheduler = require("./utilities/croninitdelayemail.js");
initEmailScheduler();

// ----- Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(mongoSanitize());
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
// app.use(fileUpload({ createParentPath: true }));

// ----- Setup of the store variable used to store user's session in MongoDB
// This is only activated when the code is pushed into production
let store
if (process.env.NODE_ENV === "production") {
  store = new MongoStore({
    mongoUrl: process.env.MONGODB_ADDON_URI,
    secret: process.env.SESSION_SECRET,
    touchAfter: 24 * 3600
  })
  store.on('error', function (error) {
    console.log(error);
  });
}

// ----- Session & Flash middleware
// There are 2 versions of sessionConfig, one for production, the other for development.
let sessionConfig
if (process.env.NODE_ENV === "production") {
  sessionConfig = {
    store,
    name: `_${Math.floor(Math.random() * 1000000000000000)}`,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: "lax",
      secure: true,
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  }
} else {
  sessionConfig = {
    // name: `_${Math.floor(Math.random() * 1000000000000000)}`,
    secret: "placeholder",
    resave: false,
    saveUninitialized: true,
    cookie: {
      // sameSite: "lax",
      // secure: true,
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  }
}

app.use(session(sessionConfig))
app.use(flash())

// ----- Helmet configuration and middleware

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net/",
  "https://twemoji.maxcdn.com/"
];
const styleSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://cdn.jsdelivr.net/",
  "https://cdnjs.cloudflare.com/",
  "https://fonts.googleapis.com",
  "https://twemoji.maxcdn.com/"
];
const connectSrcUrls = [
  "https://twemoji.maxcdn.com/"
  // "https://api.mapbox.com/",
  // "https://a.tiles.mapbox.com/",
  // "https://b.tiles.mapbox.com/",
  // "https://events.mapbox.com/",
];
const fontSrcUrls = [
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com/",
  "https://cdn.jsdelivr.net/",
  "https://twemoji.maxcdn.com/"
];
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              // "https://res.cloudinary.com/THECLOUDINARYACCOUNTNAME/",
              // `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
              "https://images.unsplash.com/",
              "https://twemoji.maxcdn.com/"
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
          // The following line is added to avoid having a Content Security Policy error on Mozilla's Firefox
          // More information on this GitHub page: https://github.com/directus/directus/discussions/10928?sort=old
          'script-src-attr': null
      },
  })
);

// ----- Passport setup and middleware

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success")
  res.locals.warning = req.flash("warning")
  res.locals.error = req.flash("error")
  res.locals.info = req.flash("info")
  next()
})

// ----- catchAsync middleware used to handle Async functions errors
const catchAsync = require("./utilities/catchasync.js");

// ----- Database connection

if (process.env.NODE_ENV !== "production") {
  mongoose
  .connect("mongodb://localhost:27017/moonshot", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(function () {
    console.log(`${colors.black.bgBrightGreen("* OK *")} MOONSHOT PROJECT - Database connection OK (Mongoose)`);
  })
  .catch(function (err) {
    console.log(`${colors.brightYellow.bgBrightRed("*!* WARNING *!*")} MOONSHOT PROJECT - Database connection ERROR (Mongoose)`);
    console.log(err);
  });
} else {
  mongoose
  .connect(process.env.MONGODB_ADDON_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(function () {
    console.log(`${colors.black.bgBrightGreen("* OK *")} MOONSHOT PROJECT - Database connection OK (Mongoose)`);
  })
  .catch(function (err) {
    console.log(`${colors.brightYellow.bgBrightRed("*!* WARNING *!*")} MOONSHOT PROJECT - Database connection ERROR (Mongoose)`);
    console.log(err);
  });
}

// ----- Commonly used functions

const findSubRegion = require("./utilities/commonfunctions.js");
const findResponsibleTenderOffice = require("./utilities/commonfunctions.js");

// ----- Routes MOONSHOT HOME & START
app.get("/", function (req, res) {
  res.render("index/homepage.ejs");
});

app.get("/moonshot", function (req, res) {
  res.render("index/indexHome.ejs");
});

app.get("/start", function (req, res) {
  res.render("index/indexStart.ejs");
});


// ----- Routes MOONSHOT PREADVISED

const preadvise = require("./routes/preadvise.js")
app.use("/preadvise", preadvise)


// ----- Routes MOONSHOT REGISTRATION

const register = require("./routes/register.js")
app.use("/register", register)


// ----- Routes MOONSHOT OFFICES

const office = require("./routes/office.js")
app.use("/office", office)

// ----- Routes MOONSHOT DASHBOARD

const dashboard = require("./routes/dashboard.js")
app.use("/dashboard", dashboard)

// ----- Routes MOONSHOT USERS

const user = require("./routes/user.js");
const { NONAME } = require("dns");
app.use("/user", user)


// ----- Routes for TEST PURPOSES


app.get("/test/:fileName", async function (req, res) {
  let allPreadvise = await PreadvisedTender.find({});
  const fileName = `${req.params.fileName}.xlsx`;
  console.log(fileName);
  const wb = new Excel.Workbook();
  await wb.xlsx.readFile("./reports/templates/reportTemplate_preadvise.xlsx")
  const ws = wb.getWorksheet('Data')
  ws.addTable({
    name: 'DataTable',
    ref: 'A1',
    headerRow: true,
    totalsRow: false,
    style: {
      theme: 'TableStyleLight9',
      showRowStripes: true,
    },
    columns: [
      {name: 'Preadvise ID', filterButton: true},
      {name: 'Record date', filterButton: true},
      {name: 'Last modified date', filterButton: true},
      {name: 'Is launched', filterButton: true},
      {name: 'Launched date', filterButton: true},
      {name: 'Country location', filterButton: true},
      {name: 'Tender office', filterButton: true},
      {name: 'World area', filterButton: true},
      {name: 'Company name', filterButton: true},
      {name: 'Sugar ID', filterButton: true},
      {name: 'Expected receive date', filterButton: true},
      {name: 'Has Airfreight', filterButton: true},
      {name: 'Airfreight volumes', filterButton: true},
      {name: 'Has Seafreight FCL', filterButton: true},
      {name: 'Seafreight FCL volumes', filterButton: true},
      {name: 'Has Seafreight LCL', filterButton: true},
      {name: 'Seafreight LCL volumes', filterButton: true},
      {name: 'Has Railfreight FCL', filterButton: true},
      {name: 'Railfreight FCL volumes', filterButton: true},
      {name: 'Africa ➔ Africa', filterButton: true},
      {name: 'Africa ➔ Americas', filterButton: true},
      {name: 'Africa ➔ Asia', filterButton: true},
      {name: 'Africa ➔ Europe', filterButton: true},
      {name: 'Africa ➔ Oceania', filterButton: true},
      {name: 'Americas ➔ Africa', filterButton: true},
      {name: 'Americas ➔ Americas', filterButton: true},
      {name: 'Americas ➔ Asia', filterButton: true},
      {name: 'Americas ➔ Europe', filterButton: true},
      {name: 'Americas ➔ Oceania', filterButton: true},
      {name: 'Asia ➔ Africa', filterButton: true},
      {name: 'Asia ➔ Americas', filterButton: true},
      {name: 'Asia ➔ Asia', filterButton: true},
      {name: 'Asia ➔ Europe', filterButton: true},
      {name: 'Asia ➔ Oceania', filterButton: true},
      {name: 'Europe ➔ Africa', filterButton: true},
      {name: 'Europe ➔ Americas', filterButton: true},
      {name: 'Europe ➔ Asia', filterButton: true},
      {name: 'Europe ➔ Europe', filterButton: true},
      {name: 'Europe ➔ Oceania', filterButton: true},
      {name: 'Oceania ➔ Africa', filterButton: true},
      {name: 'Oceania ➔ Americas', filterButton: true},
      {name: 'Oceania ➔ Asia', filterButton: true},
      {name: 'Oceania ➔ Europe', filterButton: true},
      {name: 'Oceania ➔ Oceania', filterButton: true},
      {name: 'No history', filterButton: true},
      {name: 'Rhenus Air & Ocean history', filterButton: true},
      {name: 'Rhenus Road history', filterButton: true},
      {name: 'Rhenus Contract Logistics history', filterButton: true},
      {name: 'Rhenus Port Logistics history', filterButton: true},
      {name: 'Customer segment', filterButton: true}
    ],
    rows: [],
  });

  const table = ws.getTable('DataTable');
  table.headerRow = true;


  for (let preadvise of allPreadvise) {
    let dataToPush = []
    dataToPush.push(preadvise._id)
    dataToPush.push(preadvise.recordDate)
    if (preadvise.lastModifiedDate) {
      dataToPush.push(preadvise.lastModifiedDate)
    } else {
      dataToPush.push("Not modified")
    }
    if (preadvise.launched) {
      dataToPush.push(preadvise.launched)
      dataToPush.push(preadvise.launchedTime)
    } else {
      dataToPush.push("Not launched")
      dataToPush.push("Not launched")
    }
    dataToPush.push(preadvise.countryLocation)
    dataToPush.push(findResponsibleTenderOffice(preadvise.countryLocation))
    dataToPush.push(findSubRegion(preadvise.countryLocation))
    dataToPush.push(preadvise.companyName)
    dataToPush.push(preadvise.sugarID)
    dataToPush.push(preadvise.expectedReceiveDate)
    if (preadvise.transportMode.includes("hasAirFreight")) {
      dataToPush.push("Yes")
      dataToPush.push(preadvise.airFreightVolume)
    } else {
      dataToPush.push("No")
      dataToPush.push("0")
    }
    if (preadvise.transportMode.includes("hasSeaFreightFCL")) {
      dataToPush.push("Yes")
      dataToPush.push(preadvise.seaFreightFCLVolume)
    } else {
      dataToPush.push("No")
      dataToPush.push("0")
    }
    if (preadvise.transportMode.includes("hasSeaFreightLCL")) {
      dataToPush.push("Yes")
      dataToPush.push(preadvise.seaFreightLCLVolume)
    } else {
      dataToPush.push("No")
      dataToPush.push("0")
    }
    if (preadvise.transportMode.includes("hasRailFreight")) {
      dataToPush.push("Yes")
      dataToPush.push(preadvise.railFreightVolume)
    } else {
      dataToPush.push("No")
      dataToPush.push("0")
    }
    if(preadvise.keyTradelanes.includes("africaToAfrica")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("africaToAmericas")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("africaToAsia")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("africaToEurope")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("africaToOceania")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("americasToAfrica")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("americasToAmericas")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("americasToAsia")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("americasToEurope")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("americasToOceania")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("asiaToAfrica")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("asiaToAmericas")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("asiaToAsia")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("asiaToEurope")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("asiaToOceania")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("europeToAfrica")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("europeToAmericas")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("europeToAsia")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("europeToEurope")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("europeToOceania")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("oceaniaToAfrica")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("oceaniaToAmericas")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("oceaniaToAsia")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("oceaniaToEurope")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.keyTradelanes.includes("oceaniaToOceania")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    
    if(!preadvise.history || preadvise.history.includes("historyNone")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.history && preadvise.history.includes("historyAirOcean")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.history && preadvise.history.includes("historyRoadFreight")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.history && preadvise.history.includes("historyContractLog")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(preadvise.history && preadvise.history.includes("historyPortLog")){dataToPush.push("Yes")} else {dataToPush.push("No")}

    if(!preadvise.existingCustomerSegment){dataToPush.push("No")} else {dataToPush.push(preadvise.existingCustomerSegment)}

    table.addRow(dataToPush)
    console.log(`Data for preadvise ${preadvise.companyName} added to table`)
  }

  table.commit();
  console.log(`Data for table has been commited`)
  wb.calcProperties.fullCalcOnLoad = true

  let createFile = async function () {
    await wb.xlsx.writeFile(fileName);
    console.log("File created");
    try {
      await fs.mkdir(`./reports/test`, { recursive: true });
      fs.rename(
        `./${fileName}`,
        `./reports/test/${fileName}`
      );
    } catch (err) {
      console.log("File not moved");
      console.log(err.message);
    }
  };

  try {
    createFile();
  } catch (err) {
    console.log("File not created");
    console.log(err.message);
  }

  res.redirect("/")
});

app.get("/test/emailDelay/:id", async function (req, res){
let matchingId = req.params.id;
delayEmail(matchingId)
res.redirect("/")
})

app.get("/test/download/:id", async function (req, res) {
  let matchingId = req.params.id;
  let matchingTender = await RegisteredTender.findById(matchingId);
  for (let file of matchingTender.documentUpload) {
    downloadFile(file)
  }
  res.redirect("/")
})

// ----- Routes for ERROR HANDLING

app.all("*", function (req, res, next) {
  next(new ExpressError("Page not found", 404));
});

app.use(function (err, req, res, next) {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error/error500.ejs", { err });
  console.log(`${colors.brightYellow.bgBrightRed("*!* ERROR *!*")} - Status Code: ${statusCode} - Message: ${message}`);
  console.log(err);
});

// ----- Port listening

if (process.env.NODE_ENV === "production") {
  app.listen(process.env.PORT, '0.0.0.0', function () {
    console.log(`${colors.black.bgBrightGreen("* OK *")} MOONSHOT PROJECT - App is listening`);
  });
} else {
  app.listen(3000, function () {
    console.log(`${colors.black.bgBrightGreen("* OK *")} MOONSHOT PROJECT - App is listening on port 3000`);
  });
}
