const PreadvisedTender = require("../models/preadvisedTender.js");
const colors = require("colors");
const fs = require("fs").promises;
const PDFDocument = require("pdf-lib").PDFDocument;
// const StandardFonts = require("pdf-lib").StandardFonts;
const fontkit = require("@pdf-lib/fontkit")

// ----- Ressources
const countriesData = require("../public/ressources/countries.json");
const daysData = require("../public/ressources/days.json");
const monthsData = require("../public/ressources/months.json");

// ----- Commonly used functions

const {
    findCountryName,
    findcca2,
    findSubRegion,
    findResponsibleTenderOffice,
    currentDateAndTime,
    formatDate,
    capitalize
  } = require("./commonfunctions.js");

// ----- Report generation functions
const generatePreadviseReport = async function (preadvisedId, fileIdentifier) {
    const matchingTender = await PreadvisedTender.findById(preadvisedId).populate("register");
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
    expectedReceiveDateField.setText(`${formatDate(matchingTender.expectedReceiveDate)}`)
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
    if (!matchingTender.airFreightVolume) {
        airFreightVolumeField.setText("---")
    } else {
        airFreightVolumeField.setText(`${matchingTender.airFreightVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)
    }
    const seaFreightFCLVolumeField = form.getTextField("seaFreightFCLVolume")
    if (!matchingTender.seaFreightFCLVolume) {
        seaFreightFCLVolumeField.setText("---")
    } else {
        seaFreightFCLVolumeField.setText(`${matchingTender.seaFreightFCLVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)
    }
    const seaFreightLCLVolumeField = form.getTextField("seaFreightLCLVolume")
    if (!matchingTender.seaFreightLCLVolume) {
        seaFreightLCLVolumeField.setText("---")
    } else {
        seaFreightLCLVolumeField.setText(`${matchingTender.seaFreightLCLVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)
    }
    const railFreightVolumeField = form.getTextField("railFreightVolume")
    if (!matchingTender.railFreightVolume) {
        railFreightVolumeField.setText("---")
    }
    else {
        railFreightVolumeField.setText(`${matchingTender.railFreightVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)
    }

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

    if(matchingTender.history === "historyNone" || matchingTender.history.includes("historyNone")){
        const historyNoneBox = form.getCheckBox("historyNone")
        historyNoneBox.check()
    }
    if(matchingTender.history === "historyAirOcean" || matchingTender.history.includes("historyAirOcean")){
        const historyAirOceanBox = form.getCheckBox("historyAirOcean")
        historyAirOceanBox.check()
    }
    if(matchingTender.history === "historyPortLog" || matchingTender.history.includes("historyPortLog")){
        const historyPortLogBox = form.getCheckBox("historyPortLog")
        historyPortLogBox.check()
    }
    if(matchingTender.history === "historyContractLog" || matchingTender.history.includes("historyContractLog")){
        const historyContractLogBox = form.getCheckBox("historyContractLog")
        historyContractLogBox.check()
    }
    if(matchingTender.history === "historyRoadFreight" || matchingTender.history.includes("historyRoadFreight")){
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
    reportIssueDateField.setText(`${formatDate(currentDateAndTime())}`)

    if(matchingTender.register){
        const tenderLaunchField = form.getTextField("tenderLaunch")
        tenderLaunchField.setText("Tender launched")
    } else {
        const tenderLaunchField = form.getTextField("tenderLaunch")
        tenderLaunchField.setText("Tender not yet launched")
    }

    if(matchingTender.register){
        const tenderLaunchDateField = form.getTextField("tenderLaunchDate")
        tenderLaunchDateField.setText(`${formatDate(matchingTender.register.recordDate)}`)
        tenderLaunchDateField.updateAppearances(customFont)
    } else {
        const tenderLaunchDateField = form.getTextField("tenderLaunchDate")
        tenderLaunchDateField.setText("---")
        tenderLaunchDateField.updateAppearances(customFont)
    }

    for (let field of fields) {
    field.enableReadOnly()
    }

    const newReportContent = await pdfDoc.save()

    try {
        await fs.writeFile(`./reports/reportsGenerated/${matchingTender.companyName}_${fileIdentifier}.pdf`, newReportContent)
        console.log(`${colors.black.bgBrightGreen("* OK *")} The PDF report related to TENDER PRE-ADVISE of the company ${matchingTender.companyName}, has been created successfully`);
    } catch (error) {
        console.log(`${colors.brightYellow.bgBrightRed("*!* ERROR *!*")} - Status Code: ${error.statusCode} - Message: ${error.message}`)
    }

}
module.exports = generatePreadviseReport