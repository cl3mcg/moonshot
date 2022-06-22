const fs = require("fs").promises;
const Excel = require("exceljs");

const PreadvisedTender = require("../models/preadvisedTender.js");

const {
    findCountryName,
    findcca2,
    findSubRegion,
    findResponsibleTenderOffice,
    currentDateAndTime,
    formatDate,
    capitalize
  } = require("./commonfunctions.js");

let generatePreadviseExcelReport = async function (newFilename) {
  let allPreadvise = await PreadvisedTender.find({}).populate("register");
  const fileName = `${newFilename}.xlsx`;
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
    dataToPush.push(preadvise.id)
    dataToPush.push(preadvise.recordDate)
    if (preadvise.lastModifiedDate) {
      dataToPush.push(preadvise.lastModifiedDate)
    } else {
      dataToPush.push("Not modified")
    }
    if (preadvise.register) {
      dataToPush.push("Yes")
      dataToPush.push(preadvise.register.recordDate)
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

module.exports = generatePreadviseExcelReport