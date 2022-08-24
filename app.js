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
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

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
  store = MongoStore.create({
    mongoUrl: process.env.MONGODB_ADDON_URI,
    touchAfter: 7 * 24 * 60 * 60,
    crypto: {
      secret: process.env.SESSION_SECRET
    }
  });
} else {
  store = new MongoStore({
    mongoUrl: "mongodb://localhost:27017/moonshot",
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
    store: store,
    name: `_${Math.floor(Math.random() * 1000000000000000)}`,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: "lax",
      // The "secure" attribute is removed otherwise, the cookies cannot be read and all goes breaking
      // secure: true,
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  }
} else {
  sessionConfig = {
    name: `_${Math.floor(Math.random() * 1000000000000000)}`,
    secret: "placeholder",
    resave: false,
    saveUninitialized: true,
    cookie: {
      // The "samesite" and "secure" attributes are removed for , the cookies cannot be read and all goes breaking
      sameSite: "lax",
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
  "https://twemoji.maxcdn.com/",
  "https://fonts.bunny.net/"
];
const connectSrcUrls = [
  "https://twemoji.maxcdn.com/",
  // "https://api.mapbox.com/",
];
const fontSrcUrls = [
  "https://cdn.jsdelivr.net/",
  "https://twemoji.maxcdn.com/",
  "https://fonts.bunny.net/"
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
        // "https://images.unsplash.com/",
        "https://twemoji.maxcdn.com/"
        // "https://res.cloudinary.com/THECLOUDINARYACCOUNTNAME/",
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

// ----- Middleware used
const {
  // ----- isLoggedIn middleware used to check if the user is properly logged in - Check the value of req.user stored in Express Session
  isLoggedIn
} = require("./utilities/middleware.js");

// ----- Database connection

if (process.env.NODE_ENV !== "production") {
  mongoose.connect("mongodb://localhost:27017/moonshot", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(function () {
      console.log(`${colors.black.bgBrightGreen("* OK *")} MOONSHOT PROJECT (Dev.) - Database connection OK (Mongoose)`);
    })
    .catch(function (err) {
      console.log(`${colors.brightYellow.bgBrightRed("*!* WARNING *!*")} MOONSHOT PROJECT (Dev.) - Database connection ERROR (Mongoose)`);
      console.log(err);
    });
} else {
  mongoose.connect(process.env.MONGODB_ADDON_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(function () {
      console.log(`${colors.black.bgBrightGreen("* OK *")} MOONSHOT PROJECT (Prod.) - Database connection OK (Mongoose)`);
    })
    .catch(function (err) {
      console.log(`${colors.brightYellow.bgBrightRed("*!* WARNING *!*")} MOONSHOT PROJECT (Prod.) - Database connection ERROR (Mongoose)`);
      console.log(err);
    });
}

// ----- Initialization functions

const initEmailScheduler = require("./utilities/croninitdelayemail.js");
initEmailScheduler();


// ----- Routes MOONSHOT HOME & START
app.get("/", function (req, res) {
  res.render("index/homepage.ejs");
});

// Below is an unused route used for development only
app.get("/moonshot", function (req, res) {
  if (process.env.NODE_ENV !== "production") {
    return res.render("index/indexHome.ejs");
  }
  res.redirect("/")
});

app.get("/start", isLoggedIn, function (req, res) {
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
app.use("/user", user)

// ----- Routes MOONSHOT API

const api = require("./routes/api.js")
app.use("/api", api)

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
    console.log(`${colors.black.bgBrightGreen("* OK *")} MOONSHOT PROJECT (Prod.) - App is listening on port ${process.env.PORT}`);
  });
} else {
  app.listen(3000, function () {
    console.log(`${colors.black.bgBrightGreen("* OK *")} MOONSHOT PROJECT (Dev.) - App is listening on port 3000`);
  });
}
