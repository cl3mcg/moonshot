const fs = require("fs").promises;
const Excel = require("exceljs");

const PreadvisedTender = require("../models/preadvisedTender.js");
const RegisteredTender = require("../models/registeredTender.js");

const tenderLaunchMethod = require("../public/ressources/tenderLaunchMethod.json")
const decisionCriteria = require("../public/ressources/decisionCriteria.json")


const {
    findCountryName,
    findcca2,
    findSubRegion,
    findResponsibleTenderOffice,
    currentDateAndTime,
    formatDate,
    capitalize
  } = require("./commonfunctions.js");

let generateRegisterExcelReport = async function (newFilename) {
  let allRegister = await RegisteredTender.find({}).populate("preadvise");
  const fileName = `${newFilename}.xlsx`;
  console.log(fileName);
  const wb = new Excel.Workbook();
  await wb.xlsx.readFile("./reports/templates/reportTemplate_register.xlsx")
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
      {name: 'Register ID', filterButton: true},
      {name: 'Record date', filterButton: true},
      {name: 'Last modified date', filterButton: true},
      {name: 'Is preadvised', filterButton: true},
      {name: 'Preadvised ID', filterButton: true},
      {name: 'Preadvise record date', filterButton: true},
      {name: 'Country location', filterButton: true},
      {name: 'Tender office', filterButton: true},
      {name: 'World area', filterButton: true},
      {name: 'Company name', filterButton: true},
      {name: 'Sugar ID', filterButton: true},
      {name: 'Business vertical', filterButton: true},
      {name: 'Contact name', filterButton: true},
      {name: 'Contact Job Title', filterButton: true},
      {name: 'Contact email', filterButton: true},
      {name: 'Contact is decision maker', filterButton: true},
      {name: 'Has Airfreight', filterButton: true},
      {name: 'Airfreight volumes', filterButton: true},
      {name: 'Airfreight rates validity requested', filterButton: true},
      {name: 'Has Seafreight FCL', filterButton: true},
      {name: 'Seafreight FCL volumes', filterButton: true},
      {name: 'Seafreight FCL rates validity requested', filterButton: true},
      {name: 'Has Seafreight LCL', filterButton: true},
      {name: 'Seafreight LCL volumes', filterButton: true},
      {name: 'Seafreight LCL rates validity requested', filterButton: true},
      {name: 'Has Railfreight FCL', filterButton: true},
      {name: 'Railfreight FCL volumes', filterButton: true},
      {name: 'Railfreight FCL rates validity requested', filterButton: true},
      {name: 'Has DG goods', filterButton: true},
      {name: 'Has pharma goods', filterButton: true},
      {name: 'Has cold chain', filterButton: true},
      {name: 'Has time critical', filterButton: true},
      {name: 'Has linked RFI', filterButton: true},
      {name: 'RFI deadline', filterButton: true},
      {name: 'Tender reception date', filterButton: true},
      {name: 'Tender deadline', filterButton: true},
      {name: 'Tender decision date', filterButton: true},
      {name: 'Start of business date', filterButton: true},
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
      {name: 'Amount of lanes', filterButton: true},
      {name: 'Has Door-to-Door lanes', filterButton: true},
      {name: 'Has Door-to-Port lanes', filterButton: true},
      {name: 'Has Port-to-Port lanes', filterButton: true},
      {name: 'Has Port-to-Door lanes', filterButton: true},
      {name: 'Contract period', filterButton: true},
      {name: 'Payment terms', filterButton: true},
      {name: 'Restrictions - All lanes must be quoted', filterButton: true},
      {name: 'Restrictions - All lanes per country must be quoted', filterButton: true},
      {name: 'Restrictions - All lanes per region must be quoted', filterButton: true},
      {name: 'Restrictions - All lanes per transport mode must be quoted', filterButton: true},
      {name: 'Restrictions - Cherry picking allowed', filterButton: true},
      {name: 'Requirements - No specific requirement', filterButton: true},
      {name: 'Requirements - Track & Trace', filterButton: true},
      {name: 'Requirements - Documents management', filterButton: true},
      {name: 'Requirements - Basic reporting', filterButton: true},
      {name: 'Requirements - Lead time reports', filterButton: true},
      {name: 'Requirements - EDI connection', filterButton: true},
      {name: 'Requirements - Order management', filterButton: true},
      {name: 'Requirements - Control tower', filterButton: true},
      {name: 'Amount of rounds', filterButton: true},
      {name: 'Tender launch method', filterButton: true},
      {name: 'No history', filterButton: true},
      {name: 'Rhenus Air & Ocean history', filterButton: true},
      {name: 'Rhenus Road history', filterButton: true},
      {name: 'Rhenus Contract Logistics history', filterButton: true},
      {name: 'Rhenus Port Logistics history', filterButton: true},
      {name: 'Customer segment', filterButton: true},
      {name: 'Customer visit frequency', filterButton: true},
      {name: 'Customer visit history', filterButton: true},
      {name: 'Current service provider', filterButton: true},
      {name: 'Amount of competitors', filterButton: true},
      {name: 'Amount of awardee(s)', filterButton: true},
      {name: 'Decision criteria', filterButton: true},
      {name: 'Feedback available', filterButton: true}
    ],
    rows: [],
  });

  const table = ws.getTable('DataTable');
  table.headerRow = true;


  for (let register of allRegister) {
    let dataToPush = []
    dataToPush.push(register.id)
    dataToPush.push(register.recordDate)
    if (register.lastModifiedDate) {
      dataToPush.push(register.lastModifiedDate)
    } else {
      dataToPush.push("Not modified")
    }
    if (register.preadvise) {
      dataToPush.push("Yes")
      dataToPush.push(register.preadvise.id)
      dataToPush.push(register.preadvise.recordDate)
    } else {
      dataToPush.push("No")
      dataToPush.push("None")
      dataToPush.push("None")
    }
    dataToPush.push(register.countryLocation)
    dataToPush.push(findResponsibleTenderOffice(register.countryLocation))
    dataToPush.push(findSubRegion(register.countryLocation))
    dataToPush.push(register.companyName)
    dataToPush.push(register.sugarID)
    dataToPush.push(register.businessVertical)
    dataToPush.push(register.contactName)
    dataToPush.push(register.contactJobTitle)
    dataToPush.push(register.contactEmail)
    dataToPush.push(capitalize(register.decisionMaker))
    if (register.transportMode.includes("hasAirFreight")) {
      dataToPush.push("Yes")
      dataToPush.push(register.airFreightVolume)
      dataToPush.push(register.ratesValidityAir)
    } else {
      dataToPush.push("No")
      dataToPush.push("0")
      dataToPush.push("None")
    }
    if (register.transportMode.includes("hasSeaFreightFCL")) {
      dataToPush.push("Yes")
      dataToPush.push(register.seaFreightFCLVolume)
      dataToPush.push(register.ratesValidityFCL)
    } else {
      dataToPush.push("No")
      dataToPush.push("0")
      dataToPush.push("None")
    }
    if (register.transportMode.includes("hasSeaFreightLCL")) {
      dataToPush.push("Yes")
      dataToPush.push(register.seaFreightLCLVolume)
      dataToPush.push(register.ratesValidityLCL)
    } else {
      dataToPush.push("No")
      dataToPush.push("0")
      dataToPush.push("None")
    }
    if (register.transportMode.includes("hasRailFreight")) {
      dataToPush.push("Yes")
      dataToPush.push(register.railFreightVolume)
      dataToPush.push(register.ratesValidityRail)
    } else {
      dataToPush.push("No")
      dataToPush.push("0")
      dataToPush.push("None")
    }
    if (register.specialHandling && register.specialHandling.includes("dangerousGoods")) {
      dataToPush.push("Yes")
    } else {
      dataToPush.push("No")
    }
    if (register.specialHandling && register.specialHandling.includes("pharmaGoods")) {
      dataToPush.push("Yes")
    } else {
      dataToPush.push("No")
    }
    if (register.specialHandling && register.specialHandling.includes("coldChain")) {
      dataToPush.push("Yes")
    } else {
      dataToPush.push("No")
    }
    if (register.specialHandling && register.specialHandling.includes("timeCritical")) {
      dataToPush.push("Yes")
    } else {
      dataToPush.push("No")
    }
    if (register.linkedRFI) {
      dataToPush.push("Yes")
      dataToPush.push(register.deadlineRFI)
    } else {
      dataToPush.push("No")
      dataToPush.push("None")
    }
    dataToPush.push(register.receptionDate)
    dataToPush.push(register.deadlineRFQ)
    dataToPush.push(register.decisionDate)
    dataToPush.push(register.startBusinessDate)

    if(register.keyTradelanes.includes("africaToAfrica")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("africaToAmericas")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("africaToAsia")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("africaToEurope")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("africaToOceania")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("americasToAfrica")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("americasToAmericas")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("americasToAsia")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("americasToEurope")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("americasToOceania")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("asiaToAfrica")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("asiaToAmericas")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("asiaToAsia")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("asiaToEurope")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("asiaToOceania")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("europeToAfrica")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("europeToAmericas")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("europeToAsia")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("europeToEurope")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("europeToOceania")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("oceaniaToAfrica")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("oceaniaToAmericas")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("oceaniaToAsia")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("oceaniaToEurope")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.keyTradelanes.includes("oceaniaToOceania")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    
    dataToPush.push(register.lanesAmount)

    if (register.transportationScope.includes("dtod")) {
      dataToPush.push("Yes")
    } else {
      dataToPush.push("No")
    }
    if (register.transportationScope.includes("dtop")) {
      dataToPush.push("Yes")
    } else {
      dataToPush.push("No")
    }
    if (register.transportationScope.includes("ptop")) {
      dataToPush.push("Yes")
    } else {
      dataToPush.push("No")
    }
    if (register.transportationScope.includes("ptod")) {
      dataToPush.push("Yes")
    } else {
      dataToPush.push("No")
    }

    dataToPush.push(register.contractPeriod)
    dataToPush.push(register.paymentTerms * 30)

    if (register.bidRestrictions.includes("allLanesQuoted")) {
      dataToPush.push("Yes")
    } else {
      dataToPush.push("No")
    }
    if (register.bidRestrictions.includes("countryLanesQuoted")) {
      dataToPush.push("Yes")
    } else {
      dataToPush.push("No")
    }
    if (register.bidRestrictions.includes("regionLanesQuoted")) {
      dataToPush.push("Yes")
    } else {
      dataToPush.push("No")
    }
    if (register.bidRestrictions.includes("trspModeLanesQuoted")) {
      dataToPush.push("Yes")
    } else {
      dataToPush.push("No")
    }
    if (register.bidRestrictions.includes("noRestriction")) {
      dataToPush.push("Yes")
    } else {
      dataToPush.push("No")
    }

    if (register.bidRequirements.includes("noRequirement")) {
      dataToPush.push("Yes")
    } else {
      dataToPush.push("No")
    }
    if (register.bidRequirements.includes("trackTrace")) {
      dataToPush.push("Yes")
    } else {
      dataToPush.push("No")
    }
    if (register.bidRequirements.includes("docsMgmt")) {
      dataToPush.push("Yes")
    } else {
      dataToPush.push("No")
    }
    if (register.bidRequirements.includes("basicReports")) {
      dataToPush.push("Yes")
    } else {
      dataToPush.push("No")
    }
    if (register.bidRequirements.includes("leadTimeReports")) {
      dataToPush.push("Yes")
    } else {
      dataToPush.push("No")
    }
    if (register.bidRequirements.includes("ediConnection")) {
      dataToPush.push("Yes")
    } else {
      dataToPush.push("No")
    }
    if (register.bidRequirements.includes("orderManagement")) {
      dataToPush.push("Yes")
    } else {
      dataToPush.push("No")
    }
    if (register.bidRequirements.includes("controlTower")) {
      dataToPush.push("Yes")
    } else {
      dataToPush.push("No")
    }

    dataToPush.push(register.roundsAmount)
    dataToPush.push(`${tenderLaunchMethod[register.tenderLaunchMethod]}`)

    if(!register.history || register.history.includes("historyNone")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.history && register.history.includes("historyAirOcean")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.history && register.history.includes("historyRoadFreight")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.history && register.history.includes("historyContractLog")){dataToPush.push("Yes")} else {dataToPush.push("No")}
    if(register.history && register.history.includes("historyPortLog")){dataToPush.push("Yes")} else {dataToPush.push("No")}

    if(!register.existingCustomerSegment){dataToPush.push("No")} else {dataToPush.push(register.existingCustomerSegment)}

    dataToPush.push(capitalize(register.visitFrequency))

    let visitHistory
    switch (register.visitHistory) {
      case "less6months":
        visitHistory = "< 6 months"
        break;
      case "6to12months":
        visitHistory = "6~12 months"
        break;
      case "1to2years":
        visitHistory = "1~2 years"
        break;
      case "more2years":
        visitHistory = "> 2 years"
        break;
      case "more5years":
        visitHistory = "> 5 years"
        break;
    }
    dataToPush.push(visitHistory)

    dataToPush.push(register.currentServiceProvider)

    let competitorAmount
    switch (register.competitorAmount) {
      case "1to3":
        competitorAmount = "1~2"
        break;
      case "4to6":
        competitorAmount = "4~6"
        break;
      case "7to10":
        competitorAmount = "7~10"
        break;
      case "more10":
        competitorAmount = ">10"
        break;
      case "unknown":
        competitorAmount = "Unknown"
        break;
    }
    dataToPush.push(competitorAmount)

    let volumeSplit
    switch (register.volumeSplit) {
      case "1":
        volumeSplit = "1"
        break;
      case "1to2":
        volumeSplit = "1~2"
        break;
      case "2to3":
        volumeSplit = "2~3"
        break;
      case "more3":
        volumeSplit = ">3"
        break;
      case "unknown":
        volumeSplit = "Unknown"
        break;
    }
    dataToPush.push(volumeSplit)

    dataToPush.push(`${decisionCriteria[register.decisionCritera]}`)
    dataToPush.push(capitalize(register.feedbackAvailable))


    table.addRow(dataToPush)
    console.log(`Data for register ${register.companyName} added to table`)
  }

  table.commit();
  console.log(`Data for table has been commited`)
  wb.calcProperties.fullCalcOnLoad = true

  let createFile = async function () {
    await wb.xlsx.writeFile(fileName);
    console.log("File created");
    try {
      await fs.mkdir(`./reports/reportsGenerated`, { recursive: true });
      fs.rename(
        `./${fileName}`,
        `./reports/reportsGenerated/${fileName}`
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
}

module.exports = generateRegisterExcelReport