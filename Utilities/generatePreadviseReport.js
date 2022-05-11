const PreadvisedTender = require("../models/preadvisedTender.js");
const fs = require("fs").promises;
const PDFDocument = require("pdf-lib").PDFDocument;
// const StandardFonts = require("pdf-lib").StandardFonts;
const fontkit = require("@pdf-lib/fontkit")

// ----- Ressources
const countriesData = require("../public/ressources/countries.json");
const daysData = require("../public/ressources/days.json");
const monthsData = require("../public/ressources/months.json");

// ----- Commonly used functions
const currentDateAndTime = function () {
    return new Date(Date.now());
  };

  const findCountryName = function (cca2) {
    for (country of countriesData) {
      if (country.cca2 === cca2) {
        return country.name.common;
      }
    }
  };

// ----- Report generation functions
const generatePreadviseReport = async function (preadvisedId, fileIdentifier) {
    const matchingTender = await PreadvisedTender.findById(preadvisedId);
    const pdfContent = await fs.readFile("./reports/templates/reportTemplate_preadvise.pdf");
    const pdfDoc = await PDFDocument.load(pdfContent);
    pdfDoc.registerFontkit(fontkit);
    const fontBytes = await fs.readFile("./public/css/common/fonts/FiraMono-Regular.ttf");
    const customFont = await pdfDoc.embedFont(fontBytes);
    // const zapfDingbatsFont = await pdfDoc.embedFont(StandardFonts.ZapfDingbats)
    const form = pdfDoc.getForm()
    const fields = form.getFields()

    const rawUpdateFieldAppearances = form.updateFieldAppearances.bind(form);
    form.updateFieldAppearances = function () {
        return rawUpdateFieldAppearances(customFont);
    };

    // customSetupFields = ["hasAirFreight", "hasSeaFreightFCL", "hasSeaFreightLCL", "hasRailFreight",  "africaToAfrica", "africaToAmericas", "africaToAsia", "africaToEurope", "africaToOceania", "americasToAfrica", "americasToAmericas", "americasToAsia", "americasToEurope", "americasToOceania", "asiaToAfrica", "asiaToAmericas", "asiaToAsia", "asiaToEurope", "asiaToOceania", "europeToAfrica", "europeToAmericas", "europeToAsia", "europeToEurope", "europeToOceania", "oceaniaToAfrica", "oceaniaToAmericas", "oceaniaToAsia", "oceaniaToEurope", "oceaniaToOceania", "historyAirOcean", "historyPortLog", "historyContractLog", "historyRoadFreight", "reportIssueDate", "tenderLaunch", "tenderLaunchDate"]

    // fields.forEach(field => {
    //   const fieldName = field.getName()
    //   if (!customSetupFields.includes(fieldName)){
    //     let fieldToFill = form.getTextField(fieldName)
    //     let valueToFill = matchingTender[`${fieldName}`]
    //     console.log(`${matchingTender[`${fieldName}`]} is of type: ${typeof(valueToFill)}`)
    //     if (typeof(valueToFill) !== "String") {
    //       valueToFill = `${valueToFill}`
    //     }
    //     fieldToFill.setText(valueToFill)
    //     fieldToFill.enableReadOnly()
    //     // console.log('Field name:', fieldName)
    //   }
    // })

    const preadvideIdField = form.getTextField("preadviseID")
    preadvideIdField.setText(matchingTender.id)
    preadvideIdField.updateAppearances(customFont)
    const userNameField = form.getTextField("userName")
    userNameField.setText("Test User")
    // userNameField.setText(`${matchingTender.userName}`)
    userNameField.updateAppearances(customFont)
    const countryLocationField = form.getTextField("countryLocation")
    let countryName = findCountryName(matchingTender.countryLocation)
    countryLocationField.setText(`${matchingTender.countryLocation} - ${countryName}`)
    countryLocationField.updateAppearances(customFont)
    const companyNameField = form.getTextField("companyName")
    companyNameField.setText(`${matchingTender.companyName}`)
    companyNameField.updateAppearances(customFont)
    const sugarIDField = form.getTextField("sugarID")
    sugarIDField.setText(`${matchingTender.sugarID}`)
    const expectedReceiveDateField = form.getTextField("expectedReceiveDate")
    let expectedReceiveDateField_format
    if (matchingTender.expectedReceiveDate.getDate() < 10) {
        expectedReceiveDateField_format = `0${matchingTender.expectedReceiveDate.getDate()}-${monthsData[matchingTender.expectedReceiveDate.getMonth()+1]}-${matchingTender.expectedReceiveDate.getFullYear()} (${daysData[matchingTender.expectedReceiveDate.getDay()]}.)`
    } else {
        expectedReceiveDateField_format = `${matchingTender.expectedReceiveDate.getDate()}-${monthsData[matchingTender.expectedReceiveDate.getMonth()+1]}-${matchingTender.expectedReceiveDate.getFullYear()} (${daysData[matchingTender.expectedReceiveDate.getDay()]}.)`
    }
    expectedReceiveDateField.setText(expectedReceiveDateField_format)
    if (matchingTender.transportMode.includes("hasAirFreight")) {
        form.getCheckBox("hasAirFreight").check()
    }
    if (matchingTender.transportMode.includes("hasSeaFreightFCL")) {
        form.getCheckBox("hasSeaFreightFCL").check()
    }
    if (matchingTender.transportMode.includes("hasSeaFreightLCL")) {
        form.getCheckBox("hasSeaFreightLCL").check()
    }
    if (matchingTender.transportMode.includes("hasRailFreight")) {
        form.getCheckBox("hasRailFreight").check()
    }
    const airFreightVolumeField = form.getTextField("airFreightVolume")
    airFreightVolumeField.setText(`${matchingTender.airFreightVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)
    const seaFreightFCLVolumeField = form.getTextField("seaFreightFCLVolume")
    seaFreightFCLVolumeField.setText(`${matchingTender.seaFreightFCLVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)
    const seaFreightLCLVolumeField = form.getTextField("seaFreightLCLVolume")
    seaFreightLCLVolumeField.setText(`${matchingTender.seaFreightLCLVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)
    const railFreightVolumeField = form.getTextField("railFreightVolume")
    railFreightVolumeField.setText(`${matchingTender.railFreightVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)

        if(matchingTender.keyTradelanes.includes("africaToAfrica")){
        const africaToAfricaBox = form.getCheckBox("africaToAfrica")
        africaToAfricaBox.check()
        }
        if(matchingTender.keyTradelanes.includes("africaToAmericas")){
        const africaToAmericasBox = form.getCheckBox("africaToAmericas")
        africaToAmericasBox.check()
        }
        if(matchingTender.keyTradelanes.includes("africaToAsia")){
        const africaToAsiaBox = form.getCheckBox("africaToAsia")
        africaToAsiaBox.check()
        }
        if(matchingTender.keyTradelanes.includes("africaToEurope")){
        const africaToEuropeBox = form.getCheckBox("africaToEurope")
        africaToEuropeBox.check()
        }
        if(matchingTender.keyTradelanes.includes("africaToOceania")){
        const africaToOceaniaBox = form.getCheckBox("africaToOceania")
        africaToOceaniaBox.check()
        }
        if(matchingTender.keyTradelanes.includes("americasToAfrica")){
        const americasToAfricaBox = form.getCheckBox("americasToAfrica")
        americasToAfricaBox.check()
        }
        if(matchingTender.keyTradelanes.includes("americasToAmericas")){
        const americasToAmericasBox = form.getCheckBox("americasToAmericas")
        americasToAmericasBox.check()
        }
        if(matchingTender.keyTradelanes.includes("americasToAsia")){
        const americasToAsiaBox = form.getCheckBox("americasToAsia")
        americasToAsiaBox.check()
        }
        if(matchingTender.keyTradelanes.includes("americasToEurope")){
        const americasToEuropeBox = form.getCheckBox("americasToEurope")
        americasToEuropeBox.check()
        }
        if(matchingTender.keyTradelanes.includes("americasToOceania")){
        const americasToOceaniaBox = form.getCheckBox("americasToOceania")
        americasToOceaniaBox.check()
        }
        if(matchingTender.keyTradelanes.includes("asiaToAfrica")){
        const asiaToAfricaBox = form.getCheckBox("asiaToAfrica")
        asiaToAfricaBox.check()
        }
        if(matchingTender.keyTradelanes.includes("asiaToAmericas")){
        const asiaToAmericasBox = form.getCheckBox("asiaToAmericas")
        asiaToAmericasBox.check()
        }
        if(matchingTender.keyTradelanes.includes("asiaToAsia")){
        const asiaToAsiaBox = form.getCheckBox("asiaToAsia")
        asiaToAsiaBox.check()
        }
        if(matchingTender.keyTradelanes.includes("asiaToEurope")){
        const asiaToEuropeBox = form.getCheckBox("asiaToEurope")
        asiaToEuropeBox.check()
        }
        if(matchingTender.keyTradelanes.includes("asiaToOceania")){
        const asiaToOceaniaBox = form.getCheckBox("asiaToOceania")
        asiaToOceaniaBox.check()
        }
        if(matchingTender.keyTradelanes.includes("europeToAfrica")){
        const europeToAfricaBox = form.getCheckBox("europeToAfrica")
        europeToAfricaBox.check()
        }
        if(matchingTender.keyTradelanes.includes("europeToAmericas")){
        const europeToAmericasBox = form.getCheckBox("europeToAmericas")
        europeToAmericasBox.check()
        }
        if(matchingTender.keyTradelanes.includes("europeToAsia")){
        const europeToAsiaBox = form.getCheckBox("europeToAsia")
        europeToAsiaBox.check()
        }
        if(matchingTender.keyTradelanes.includes("europeToEurope")){
        const europeToEuropeBox = form.getCheckBox("europeToEurope")
        europeToEuropeBox.check()
        }
        if(matchingTender.keyTradelanes.includes("europeToOceania")){
        const europeToOceaniaBox = form.getCheckBox("europeToOceania")
        europeToOceaniaBox.check()
        }
        if(matchingTender.keyTradelanes.includes("oceaniaToAfrica")){
        const oceaniaToAfricaBox = form.getCheckBox("oceaniaToAfrica")
        oceaniaToAfricaBox.check()
        }
        if(matchingTender.keyTradelanes.includes("oceaniaToAmericas")){
        const oceaniaToAmericasBox = form.getCheckBox("oceaniaToAmericas")
        oceaniaToAmericasBox.check()
        }
        if(matchingTender.keyTradelanes.includes("oceaniaToAsia")){
        const oceaniaToAsiaBox = form.getCheckBox("oceaniaToAsia")
        oceaniaToAsiaBox.check()
        }
        if(matchingTender.keyTradelanes.includes("oceaniaToEurope")){
        const oceaniaToEuropeBox = form.getCheckBox("oceaniaToEurope")
        oceaniaToEuropeBox.check()
        }
        if(matchingTender.keyTradelanes.includes("oceaniaToOceania")){
        const oceaniaToOceaniaBox = form.getCheckBox("oceaniaToOceania")
        oceaniaToOceaniaBox.check()
        }

        if(!matchingTender.history.length > 0 || matchingTender.history === null){
        const historyNoneBox = form.getCheckBox("historyNone")
        historyNoneBox.check()
        }
        if(matchingTender.history.includes("historyAirOcean")){
        const historyAirOceanBox = form.getCheckBox("historyAirOcean")
        historyAirOceanBox.check()
        }
        if(matchingTender.history.includes("historyPortLog")){
        const historyPortLogBox = form.getCheckBox("historyPortLog")
        historyPortLogBox.check()
        }
        if(matchingTender.history.includes("historyContractLog")){
        const historyContractLogBox = form.getCheckBox("historyContractLog")
        historyContractLogBox.check()
        }
        if(matchingTender.history.includes("historyRoadFreight")){
        const historyRoadFreightBox = form.getCheckBox("historyRoadFreight")
        historyRoadFreightBox.check()
        }
        
        if(matchingTender.existingCustomerSegment){
        switch (matchingTender.existingCustomerSegment) {
            case "A-customer":
            const customerSegmentABox = form.getCheckBox("customerSegmentA")
            customerSegmentABox.check()
            break;
            case "B-customer":
            const customerSegmentBBox = form.getCheckBox("customerSegmentB")
            customerSegmentBBox.check()
            break;
            case "C-customer":
            const customerSegmentCBox = form.getCheckBox("customerSegmentC")
            customerSegmentCBox.check()
            break;
        }
        } else {
        const customerSegmentNoBox = form.getCheckBox("customerSegmentNo")
        customerSegmentNoBox.check()
        }

        if(matchingTender.additionalComment){
        const additionalCommentField = form.getTextField("additionalComment")
        additionalCommentField.setText(`${matchingTender.additionalComment}`)
        }

        const reportIssueDateField = form.getTextField("reportIssueDate")
        let reportIssueDate_format
        if (currentDateAndTime().getDate() < 10) {
            reportIssueDate_format = `0${currentDateAndTime().getDate()}-${monthsData[currentDateAndTime().getMonth()+1]}-${currentDateAndTime().getFullYear()} (${daysData[currentDateAndTime().getDay()]}.)`
        } else {
            reportIssueDate_format = `${currentDateAndTime().getDate()}-${monthsData[currentDateAndTime().getMonth()+1]}-${currentDateAndTime().getFullYear()} (${daysData[currentDateAndTime().getDay()]}.)`
        }
        reportIssueDateField.setText(reportIssueDate_format)
        if(matchingTender.launched){
        const tenderLaunchField = form.getTextField("tenderLaunch")
        tenderLaunchField.setText("Tender launched")
        } else {
        const tenderLaunchField = form.getTextField("tenderLaunch")
        tenderLaunchField.setText("Tender not yet launched")
        }
        if(matchingTender.launchedTime){
            let tenderLaunchDate_format
            if (matchingTender.launchedTime.getDate() < 10) {
                tenderLaunchDate_format = `0${matchingTender.launchedTime.getDate()}-${monthsData[matchingTender.launchedTime.getMonth()+1]}-${matchingTender.launchedTime.getFullYear()} (${daysData[matchingTender.launchedTime.getDay()]}.)`
            } else {
                tenderLaunchDate_format = `${matchingTender.launchedTime.getDate()}-${monthsData[matchingTender.launchedTime.getMonth()+1]}-${matchingTender.launchedTime.getFullYear()} (${daysData[matchingTender.launchedTime.getDay()]}.)`
            }
            const tenderLaunchDateField = form.getTextField("tenderLaunch")
            tenderLaunchDateField.setText(tenderLaunchDate_format)
        }

        for (let field of fields) {
        field.enableReadOnly()
        }

    const newReportContent = await pdfDoc.save()
    await fs.writeFile(`./reports/reportsGenerated/${matchingTender.companyName}_${fileIdentifier}.pdf`, newReportContent, (err) => {
        if (err) throw err;
        console.log("The pdf report was succesfully created !");
    });
}
module.exports = generatePreadviseReport