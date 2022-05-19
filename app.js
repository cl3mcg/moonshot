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
const session = require("express-session");
const flash = require("connect-flash");
const nodemailer = require("nodemailer");
const Excel = require("exceljs");
const PDFDocument = require("pdf-lib").PDFDocument;
const StandardFonts = require("pdf-lib").StandardFonts;
const fontkit = require("@pdf-lib/fontkit")
// const Joi = require("joi") // Joi is exported in its own file called joiSchema.js, no need to require it again here.
const fileUpload = require("express-fileupload");
const {
  preadviseSchema,
  registerSchema,
  officeSchema,
} = require("./utilities/joiSchemas.js");
// ----- Extended error class
const ExpressError = require("./utilities/expressError.js");

// ----- Database models
const PreadvisedTender = require("./models/preadvisedTender.js");
const Office = require("./models/office.js");
const RegisteredTender = require("./models/registeredTender.js");

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
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(fileUpload({ createParentPath: true }));

// ----- Session & Flash middleware
const sessionConfig = {
  secret: "placeholder",
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig))

app.use(flash())

app.use(function (req, res, next) {
  res.locals.success = req.flash("success")
  res.locals.warning = req.flash("warning")
  res.locals.error = req.flash("error")
  res.locals.info = req.flash("info")
  next()
})

// ----- catchAsync middleware used to handle Async functions errors
const catchAsync = require("./utilities/catchAsync.js");

// ----- Database connection
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

// ----- Commonly used functions

const findSubRegion = require("./utilities/commonFunctions.js");
const findResponsibleTenderOffice = require("./utilities/commonFunctions.js");

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

const preadvise = require("./routes/preadvise")
app.use("/preadvise", preadvise)


// ----- Routes MOONSHOT REGISTRATION

const register = require("./routes/register")
app.use("/register", register)



// ----- Routes MOONSHOT OFFICES

const office = require("./routes/office")
app.use("/office", office)


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

// app.get("/test/:fileName", async function (req, res) {
//   const fileName = `${req.params.fileName}.xlsx`;
//   console.log(fileName);
//   const wb = new Excel.Workbook();
//   const ws = wb.addWorksheet("My Sheet");
//   ws.getCell("A1").value = "John Doe";
//   ws.getCell("B1").value = "gardener";
//   ws.getCell("C1").value = new Date().toLocaleString();

//   let createFile = async function () {
//     await wb.xlsx.writeFile(fileName);
//     console.log("File created");
//     try {
//       fs.mkdir(`./uploads/test/${req.params.fileName}`, { recursive: true });
//       fs.rename(
//         `./${fileName}`,
//         `./uploads/test/${req.params.fileName}/${fileName}`
//       );
//     } catch (err) {
//       console.log("File not moved");
//       console.log(err.message);
//     }
//   };

//   try {
//     createFile();
//   } catch (err) {
//     console.log("File not created");
//     console.log(err.message);
//   }
// });

// app.get("/test/:fileName/:id", async function (req, res) {
//   const fileName = `${req.params.fileName}.xlsx`;
//   const matchingTender = await PreadvisedTender.findById(req.params.id);
//     const wb = new Excel.Workbook();
//     await wb.xlsx.readFile("./reports/templates/reportTemplate_preadvise.xlsx")
//     const ws = wb.getWorksheet("Sheet1");
//     ws.getCell("E4").value = "Jean-Marie DOE";
//     ws.getCell("E5").value = `${matchingTender.countryLocation} - ${findCountryName(matchingTender.countryLocation)}`;
//     ws.getCell("E6").value = matchingTender.companyName;
//     ws.getCell("E7").value = matchingTender.sugarID;
//     ws.getCell("E10").value = matchingTender.expectedReceiveDate;
//     if (matchingTender.transportMode.includes("hasAirFreight")) {
//       ws.getCell("A17").value = "✓";
//       ws.getCell("G17").value = matchingTender.airFreightVolume;
//     } else {
//       ws.getCell("A17").value = "╳";
//       ws.getCell("A17").font = {
//         color: { argb: 'FF0B1320' }
//       }; 
//     }
//     if (matchingTender.transportMode.includes("hasSeaFreightFCL")) {
//       ws.getCell("B17").value = "✓";
//       ws.getCell("H17").value = matchingTender.seaFreightFCLVolume;
//     } else {
//       ws.getCell("B17").value = "╳";
//       ws.getCell("B17").font = {
//         color: { argb: 'FF0B1320' }
//       }; 
//     }
//     if (matchingTender.transportMode.includes("hasSeaFreightLCL")) {
//       ws.getCell("C17").value = "✓";
//       ws.getCell("I17").value = matchingTender.seaFreightLCLVolume;
//     } else {
//       ws.getCell("C17").value = "╳";
//       ws.getCell("C17").font = {
//         color: { argb: 'FF0B1320' }
//       }; 
//     }
//     if (matchingTender.transportMode.includes("hasRailFreight")) {
//       ws.getCell("D17").value = "✓";
//       ws.getCell("J17").value = matchingTender.railFreightVolume;
//     } else {
//       ws.getCell("D17").value = "╳";
//       ws.getCell("D17").font = {
//         color: { argb: 'FF0B1320' }
//       }; 
//     }

//     if (matchingTender.history.includes("historyAirOcean")) {
//       ws.getCell("A24").value = "✓";
//       if (matchingTender.existingCustomerSegment === "A-customer") {
//         ws.getCell("G24").value = "✓";
//         ws.getCell("H24").value = "╳";
//         ws.getCell("H24").font = {
//           color: { argb: 'FF0B1320' }
//         }; 
//         ws.getCell("I24").value = "╳";
//         ws.getCell("I24").font = {
//           color: { argb: 'FF0B1320' }
//         }; 
//       } else if (matchingTender.existingCustomerSegment === "B-customer") {
//         ws.getCell("G24").value = "╳";
//         ws.getCell("G24").font = {
//           color: { argb: 'FF0B1320' }
//         }; 
//         ws.getCell("H24").value = "✓";
//         ws.getCell("I24").value = "╳";
//         ws.getCell("I24").font = {
//           color: { argb: 'FF0B1320' }
//         }; 
//       } else if (matchingTender.existingCustomerSegment === "C-customer") {
//         ws.getCell("G24").value = "╳";
//         ws.getCell("G24").font = {
//           color: { argb: 'FF0B1320' }
//         }; 
//         ws.getCell("H24").value = "╳";
//         ws.getCell("H24").font = {
//           color: { argb: 'FF0B1320' }
//         }; 
//         ws.getCell("I24").value = "✓";
//       }
//     } else {
//       ws.getCell("A24").value = "╳";
//       ws.getCell("A24").font = {
//         color: { argb: 'FF0B1320' }
//       }; 
//     }
//     if (matchingTender.history.includes("historyRoadFreight")) {
//       ws.getCell("B24").value = "✓";
//     } else {
//       ws.getCell("B24").value = "╳";
//       ws.getCell("B24").font = {
//         color: { argb: 'FF0B1320' }
//       }; 
//     }
//     if (matchingTender.history.includes("historyContractLog")) {
//       ws.getCell("C24").value = "✓";
//     } else {
//       ws.getCell("C24").value = "╳";
//       ws.getCell("C24").font = {
//         color: { argb: 'FF0B1320' }
//       }; 
//     }
//     if (matchingTender.history.includes("historyPortLog")) {
//       ws.getCell("D24").value = "✓";
//     } else {
//       ws.getCell("D24").value = "╳";
//       ws.getCell("D24").font = {
//         color: { argb: 'FF0B1320' }
//       }; 
//     }
//     if (matchingTender.history.includes("historyNone")) {
//       ws.getCell("E24").value = "✓";
//     } else {
//       ws.getCell("E24").value = "╳";
//       ws.getCell("E24").font = {
//         color: { argb: 'FF0B1320' }
//       }; 
//     } ws.getCell("E24").font = {
//         color: { argb: 'FF0B1320' }
//       }; 

//     if(matchingTender.keyTradelanes.includes("africaToAfrica")){ws.getCell("C30").value = "✓"} else {ws.getCell("C30").value = "╳" ;ws.getCell("C30").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("africaToAmericas")){ws.getCell("D30").value = "✓"} else {ws.getCell("D30").value = "╳" ;ws.getCell("D30").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("africaToAsia")){ws.getCell("E30").value = "✓"} else {ws.getCell("E30").value = "╳" ;ws.getCell("E30").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("africaToEurope")){ws.getCell("F30").value = "✓"} else {ws.getCell("F30").value = "╳" ;ws.getCell("F30").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("africaToOceania")){ws.getCell("G30").value = "✓"} else {ws.getCell("G30").value = "╳" ;ws.getCell("G30").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("americasToAfrica")){ws.getCell("C31").value = "✓"} else {ws.getCell("C31").value = "╳" ;ws.getCell("C31").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("americasToAmericas")){ws.getCell("D31").value = "✓"} else {ws.getCell("D31").value = "╳" ;ws.getCell("D31").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("americasToAsia")){ws.getCell("E31").value = "✓"} else {ws.getCell("E31").value = "╳" ;ws.getCell("E31").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("americasToEurope")){ws.getCell("F31").value = "✓"} else {ws.getCell("F31").value = "╳" ;ws.getCell("F31").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("americasToOceania")){ws.getCell("G31").value = "✓"} else {ws.getCell("G31").value = "╳" ;ws.getCell("G31").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("asiaToAfrica")){ws.getCell("C32").value = "✓"} else {ws.getCell("C32").value = "╳" ;ws.getCell("C32").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("asiaToAmericas")){ws.getCell("D32").value = "✓"} else {ws.getCell("D32").value = "╳" ;ws.getCell("D32").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("asiaToAsia")){ws.getCell("E32").value = "✓"} else {ws.getCell("E32").value = "╳" ;ws.getCell("E32").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("asiaToEurope")){ws.getCell("F32").value = "✓"} else {ws.getCell("F32").value = "╳" ;ws.getCell("F32").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("asiaToOceania")){ws.getCell("G32").value = "✓"} else {ws.getCell("G32").value = "╳" ;ws.getCell("G32").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("europeToAfrica")){ws.getCell("C33").value = "✓"} else {ws.getCell("C33").value = "╳" ;ws.getCell("C33").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("europeToAsia")){ws.getCell("D33").value = "✓"} else {ws.getCell("D33").value = "╳" ;ws.getCell("D33").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("europeToAmericas")){ws.getCell("E33").value = "✓"} else {ws.getCell("E33").value = "╳" ;ws.getCell("E33").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("europeToEurope")){ws.getCell("F33").value = "✓"} else {ws.getCell("F33").value = "╳" ;ws.getCell("F33").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("europeToOceania")){ws.getCell("G33").value = "✓"} else {ws.getCell("G33").value = "╳" ;ws.getCell("G33").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("oceaniaToAfrica")){ws.getCell("C34").value = "✓"} else {ws.getCell("C34").value = "╳" ;ws.getCell("C34").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("oceaniaToAsia")){ws.getCell("D34").value = "✓"} else {ws.getCell("D34").value = "╳" ;ws.getCell("D34").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("oceaniaToEurope")){ws.getCell("E34").value = "✓"} else {ws.getCell("E34").value = "╳" ;ws.getCell("E34").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("oceaniaToOceania")){ws.getCell("F34").value = "✓"} else {ws.getCell("F34").value = "╳" ;ws.getCell("F34").font = {color: { argb: 'FF0B1320' }}}
//     if(matchingTender.keyTradelanes.includes("oceaniaToOceania")){ws.getCell("G34").value = "✓"} else {ws.getCell("G34").value = "╳" ;ws.getCell("G34").font = {color: { argb: 'FF0B1320' }}}
     
//     if(!matchingTender.additionalComment === null){
//       ws.getCell("A37").value = matchingTender.additionalComment
//     }

//     ws.getCell("E42").value = currentDateAndTime()

//     if(matchingTender.launched){
//       ws.getCell("E37").value = "Yes"
//       ws.getCell("E38").value = matchingTender.launchedTime
//     }

//   let createFile = async function () {
//     await wb.xlsx.writeFile(fileName);
//     console.log("File created");
//     try {
//       let fileTimeStamp = `${new Date().getFullYear()}${new Date().getMonth()+1}${new Date().getDate()}${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}`
//       fs.mkdir(`./reports/${req.params.fileName}_${fileTimeStamp}`, { recursive: true });
//       fs.rename(`./${fileName}`,`./reports/${req.params.fileName}_${fileTimeStamp}/${fileName}`);
//     } catch (err) {
//       console.log("File not moved");
//       console.log(err.message);
//     }
//   };

//   try {
//     createFile();
//   } catch (err) {
//     console.log("File not created");
//     console.log(err.message);
//   }

//   res.redirect("/")

// });


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

app.listen(8080, function () {
  console.log(`${colors.black.bgBrightGreen("* OK *")} MOONSHOT PROJECT - App is listening on port 3000`);
});
