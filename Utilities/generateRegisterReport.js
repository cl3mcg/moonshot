const PreadvisedTender = require("../models/preadvisedTender.js");
const RegisteredTender = require("../models/registeredTender.js");
const fs = require("fs").promises;
const PDFDocument = require("pdf-lib").PDFDocument;
// const StandardFonts = require("pdf-lib").StandardFonts;
const fontkit = require("@pdf-lib/fontkit")

// ----- Ressources
const countriesData = require("../public/ressources/countries.json");
const daysData = require("../public/ressources/days.json");
const monthsData = require("../public/ressources/months.json");
const tenderLaunchMethodData = require("../public/ressources/tenderLaunchMethod.json");
const competitorAmountData = require("../public/ressources/competitorAmount.json");
const volumeSplitData = require("../public/ressources/volumeSplit.json");
const decisionCriteriaData = require("../public/ressources/decisionCriteria.json");

// ----- Commonly used functions

const {
    findCountryName,
    findcca2,
    findSubRegion,
    findResponsibleTenderOffice,
    currentDateAndTime,
    formatDate,
    capitalize
  } = require("./commonFunctions.js");

// ----- Report generation functions

const generateRegisterReport = async function (registeredId, fileIdentifier) {
    const matchingTender = await RegisteredTender.findById(registeredId);
    const pdfContent = await fs.readFile("./reports/templates/reportTemplate_register.pdf");
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

    const registerIdField = form.getTextField("registerID")
    registerIdField.setText(`${matchingTender.id}`)
    registerIdField.updateAppearances(customFont)
    if (matchingTender.isPreadvised) {
        form.getCheckBox("isPreadvised").check()
        const preadviseIDField = form.getTextField("preadviseID")
        preadviseIDField.setText(`${matchingTender.preadviseID}`)
        preadviseIDField.updateAppearances(customFont)
    } else {
        const preadviseIDField = form.getTextField("preadviseID")
        preadviseIDField.setText("---")
        preadviseIDField.updateAppearances(customFont)
    }
    if (matchingTender.linkedRFI) {
        form.getCheckBox("linkedRFI").check()
        const deadlineRFIField = form.getTextField("deadlineRFI")
        deadlineRFIField.setText(`${formatDate(matchingTender.deadlineRFI)}`)
        deadlineRFIField.updateAppearances(customFont)
    } else {
        const deadlineRFIField = form.getTextField("deadlineRFI")
        deadlineRFIField.setText("---")
        deadlineRFIField.updateAppearances(customFont)
    }
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
    sugarIDField.updateAppearances(customFont)
    const businessVerticalField = form.getTextField("businessVertical")
    businessVerticalField.setText(`${matchingTender.businessVertical}`)
    businessVerticalField.updateAppearances(customFont)
    const reasonForTenderField = form.getTextField("reasonForTender")
    reasonForTenderField.setText(`${matchingTender.reasonForTender}`)
    reasonForTenderField.updateAppearances(customFont)
    const contactNameField = form.getTextField("contactName")
    contactNameField.setText(`${matchingTender.contactName}`)
    contactNameField.updateAppearances(customFont)
    const contactJobTitleField = form.getTextField("contactJobTitle")
    contactJobTitleField.setText(`${matchingTender.contactJobTitle}`)
    contactJobTitleField.updateAppearances(customFont)
    const contactEmailField = form.getTextField("contactEmail")
    contactEmailField.setText(`${matchingTender.contactEmail}`)
    contactEmailField.updateAppearances(customFont)
    const decisionMakerField = form.getTextField("decisionMaker")
    decisionMakerField.setText(`${capitalize(matchingTender.decisionMaker)}`)
    decisionMakerField.updateAppearances(customFont)
    const tenderLaunchMethodField = form.getTextField("tenderLaunchMethod")
    tenderLaunchMethodField.setText(`${tenderLaunchMethodData[matchingTender.tenderLaunchMethod]}`)
    tenderLaunchMethodField.updateAppearances(customFont)
    const tenderReceptionDateField = form.getTextField("receptionDate")
    tenderReceptionDateField.setText(`${formatDate(matchingTender.receptionDate)}`)
    tenderReceptionDateField.updateAppearances(customFont)
    const recordDateField = form.getTextField("recordDate")
    recordDateField.setText(`${formatDate(matchingTender.recordDate)}`)
    recordDateField.updateAppearances(customFont)
    const deadlineRFQField = form.getTextField("deadlineRFQ")
    deadlineRFQField.setText(`${formatDate(matchingTender.deadlineRFQ)}`)
    deadlineRFQField.updateAppearances(customFont)
    const decisionDateField = form.getTextField("decisionDate")
    decisionDateField.setText(`${formatDate(matchingTender.decisionDate)}`)
    decisionDateField.updateAppearances(customFont)
    const startBusinessDateField = form.getTextField("startBusinessDate")
    startBusinessDateField.setText(`${formatDate(matchingTender.startBusinessDate)}`)
    startBusinessDateField.updateAppearances(customFont)
    const contractPeriodField = form.getTextField("contractPeriod")
    contractPeriodField.setText(`${matchingTender.contractPeriod} month(s)`)
    contractPeriodField.updateAppearances(customFont)
    const paymentTermsField = form.getTextField("paymentTerms")
    paymentTermsField.setText(`${matchingTender.paymentTerms*30} day(s)`)
    paymentTermsField.updateAppearances(customFont)
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
    if (matchingTender.airFreightVolume) {
        airFreightVolumeField.setText(`${matchingTender.airFreightVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)
        airFreightVolumeField.updateAppearances(customFont)
    } else {
        airFreightVolumeField.setText("---")
        airFreightVolumeField.updateAppearances(customFont)
    }
    const seaFreightFCLVolumeField = form.getTextField("seaFreightFCLVolume")
    if (matchingTender.seaFreightFCLVolume) {
        seaFreightFCLVolumeField.setText(`${matchingTender.seaFreightFCLVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)
        seaFreightFCLVolumeField.updateAppearances(customFont)
    } else {
        seaFreightFCLVolumeField.setText("---")
        seaFreightFCLVolumeField.updateAppearances(customFont)
    }
    const seaFreightLCLVolumeField = form.getTextField("seaFreightLCLVolume")
    if (matchingTender.seaFreightLCLVolume) {
        seaFreightLCLVolumeField.setText(`${matchingTender.seaFreightLCLVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)
        seaFreightLCLVolumeField.updateAppearances(customFont)
    } else {
        seaFreightLCLVolumeField.setText("---")
        seaFreightLCLVolumeField.updateAppearances(customFont)
    }
    const railFreightVolumeField = form.getTextField("railFreightVolume")
    if (matchingTender.railFreightVolume) {
        railFreightVolumeField.setText(`${matchingTender.railFreightVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)
        railFreightVolumeField.updateAppearances(customFont)
    } else {
        railFreightVolumeField.setText("---")
        railFreightVolumeField.updateAppearances(customFont)
    }
    
    const lanesAmountField = form.getTextField("lanesAmount")
    lanesAmountField.setText(`${matchingTender.lanesAmount} lane(s)`)

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

    if(matchingTender.transportationScope.includes("dtod")){
        const dtodBox = form.getCheckBox("dtod")
        dtodBox.check()
    }
    if(matchingTender.transportationScope.includes("dtop")){
        const dtopBox = form.getCheckBox("dtop")
        dtopBox.check()
    }
    if(matchingTender.transportationScope.includes("ptp")){
        const ptpBox = form.getCheckBox("ptp")
        ptpBox.check()
    }
    if(matchingTender.transportationScope.includes("ptod")){
        const ptodBox = form.getCheckBox("ptod")
        ptodBox.check()
    }

    const airFreightRatesValidityField = form.getField("airFreightRatesValidity")
    if (matchingTender.airFreightRatesValidity) {
        airFreightRatesValidityField.setText(`${matchingTender.airFreightRatesValidity}`)
        airFreightRatesValidityField.updateAppearances(customFont)
    } else {
        airFreightRatesValidityField.setText("---")
        airFreightRatesValidityField.updateAppearances(customFont)
    }
    const seaFreightFCLRatesValidityField = form.getField("seaFreightFCLRatesValidity")
    if (matchingTender.seaFreightFCLRatesValidity) {
        seaFreightFCLRatesValidityField.setText(`${matchingTender.seaFreightFCLRatesValidity}`)
        seaFreightFCLRatesValidityField.updateAppearances(customFont)
    } else {
        seaFreightFCLRatesValidityField.setText("---")
        seaFreightFCLRatesValidityField.updateAppearances(customFont)
    }
    const seaFreightLCLRatesValidityField = form.getField("seaFreightLCLRatesValidity")
    if (matchingTender.seaFreightLCLRatesValidity) {
        seaFreightLCLRatesValidityField.setText(`${matchingTender.seaFreightLCLRatesValidity}`)
        seaFreightLCLRatesValidityField.updateAppearances(customFont)
    } else {
        seaFreightLCLRatesValidityField.setText("---")
        seaFreightLCLRatesValidityField.updateAppearances(customFont)
    }
    const railFreightRatesValidityField = form.getField("railFreightRatesValidity")
    if (matchingTender.railFreightRatesValidity) {
        railFreightRatesValidityField.setText(`${matchingTender.railFreightRatesValidity}`)
        railFreightRatesValidityField.updateAppearances(customFont)
    } else {
        railFreightRatesValidityField.setText("---")
        railFreightRatesValidityField.updateAppearances(customFont)
    }

    if(matchingTender.bidRestrictions.includes("noRestriction")){
        const noRestrictionBox = form.getCheckBox("noRestriction")
        noRestrictionBox.check()
    }
    if(matchingTender.bidRestrictions.includes("allLanesQuoted")){
        const allLanesQuotedBox = form.getCheckBox("allLanesQuoted")
        allLanesQuotedBox.check()
    }
    if(matchingTender.bidRestrictions.includes("countryLanesQuoted")){
        const countryLanesQuotedBox = form.getCheckBox("countryLanesQuoted")
        countryLanesQuotedBox.check()
    }
    if(matchingTender.bidRestrictions.includes("regionLanesQuoted")){
        const regionLanesQuotedBox = form.getCheckBox("regionLanesQuoted")
        regionLanesQuotedBox.check()
    }
    if(matchingTender.bidRestrictions.includes("trspModeLanesQuoted")){
        const trspModeLanesQuotedBox = form.getCheckBox("trspModeLanesQuoted")
        trspModeLanesQuotedBox.check()
    }

    if(matchingTender.bidRequirements.includes("noRequirement")){
        const noRequirementBox = form.getCheckBox("noRequirement")
        noRequirementBox.check()
    }
    if(matchingTender.bidRequirements.includes("trackTrace")){
        const trackTraceBox = form.getCheckBox("trackTrace")
        trackTraceBox.check()
    }
    if(matchingTender.bidRequirements.includes("docsMgmt")){
        const docsMgmtBox = form.getCheckBox("docsMgmt")
        docsMgmtBox.check()
    }
    if(matchingTender.bidRequirements.includes("basicReports")){
        const basicReportsBox = form.getCheckBox("basicReports")
        basicReportsBox.check()
    }
    if(matchingTender.bidRequirements.includes("leadTimeReports")){
        const leadTimeReportsBox = form.getCheckBox("leadTimeReports")
        leadTimeReportsBox.check()
    }
    if(matchingTender.bidRequirements.includes("ediConnection")){
        const ediConnectionBox = form.getCheckBox("ediConnection")
        ediConnectionBox.check()
    }
    if(matchingTender.bidRequirements.includes("orderManagement")){
        const orderManagementBox = form.getCheckBox("orderManagement")
        orderManagementBox.check()
    }
    if(matchingTender.bidRequirements.includes("controlTower")){
        const controlTowerBox = form.getCheckBox("controlTower")
        controlTowerBox.check()
    }


    if(matchingTender.history.length || matchingTender.history === null || matchingTender.history.includes("historyNone")){
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
    
    switch (matchingTender.visitHistory) {
        case "less6months":
        const less6monthsBox = form.getCheckBox("less6months")
        less6monthsBox.check()
        break;
        case "6to12months":
        const from6to12monthsBox = form.getCheckBox("6to12months")
        from6to12monthsBox.check()
        break;
        case "1to2years":
        const from1to2yearsBox = form.getCheckBox("1to2years")
        from1to2yearsBox.check()
        break;
        case "more2years":
        const more2yearsBox = form.getCheckBox("more2years")
        more2yearsBox.check()
        break;
        case "more5years":
        const more5yearsBox = form.getCheckBox("more5years")
        more5yearsBox.check()
        break;
    }

    switch (matchingTender.visitFrequency) {
        case "weekly":
        const weeklyBox = form.getCheckBox("weekly")
        weeklyBox.check()
        break;
        case "monthly":
        const monthlyBox = form.getCheckBox("monthly")
        monthlyBox.check()
        break;
        case "quarterly":
        const quarterlyBox = form.getCheckBox("quarterly")
        quarterlyBox.check()
        break;
        case "yearly":
        const yearlyBox = form.getCheckBox("yearly")
        yearlyBox.check()
        break;
    }

    const currentServiceProviderField = form.getField("currentServiceProvider")
    currentServiceProviderField.setText(`${matchingTender.currentServiceProvider}`)
    currentServiceProviderField.updateAppearances(customFont)

    const competitorAmountField = form.getField("competitorAmount")
    competitorAmountField.setText(`${competitorAmountData[matchingTender.competitorAmount]}`)
    competitorAmountField.updateAppearances(customFont)

    const volumeSplitField = form.getField("volumeSplit")
    volumeSplitField.setText(`${volumeSplitData[matchingTender.volumeSplit]}`)
    volumeSplitField.updateAppearances(customFont)

    const decisionCriteraField = form.getField("decisionCritera")
    decisionCriteraField.setText(`${decisionCriteriaData[matchingTender.decisionCritera]}`)
    decisionCriteraField.updateAppearances(customFont)

    const feedbackAvailableField = form.getField("feedbackAvailable")
    feedbackAvailableField.setText(`${capitalize(matchingTender.feedbackAvailable)}`)
    feedbackAvailableField.updateAppearances(customFont)

    let docAttachedFields = [
        form.getField("doc01"),
        form.getField("doc02"),
        form.getField("doc03"),
        form.getField("doc04"),
        form.getField("doc05"),
        form.getField("doc06"),
        form.getField("doc07"),
        form.getField("doc08"),
        form.getField("doc09"),
        form.getField("doc10")
    ]

    if (!matchingTender.documentUpload) {
        for (let docAttachedField of docAttachedFields) {
            docAttachedField.setText("---")
            docAttachedField.updateAppearances(customFont)
        }
    } else {
        let attachedDocsNameArray = matchingTender.documentUpload
        for (let i = 0; i < attachedDocsNameArray.length; i++) {
            docAttachedFields[i].setText(`${attachedDocsNameArray[i]}`)
            docAttachedFields[i].updateAppearances(customFont)
        }
        for (let docAttachedField of docAttachedFields) {
            if (!docAttachedField.getText()) {
                docAttachedField.setText("---")
                docAttachedField.updateAppearances(customFont)
            }
        }
    }

    const potentialField = form.getField("potential")
    potentialField.setText(`${matchingTender.potential}`)
    potentialField.updateAppearances(customFont)

    if(matchingTender.additionalComment){
    const additionalCommentField = form.getTextField("additionalComment")
    additionalCommentField.setText(`${matchingTender.additionalComment}`)
    }

    const reportIssueDateField = form.getTextField("reportIssueDate")
    reportIssueDateField.setText(`${formatDate(currentDateAndTime())}`)
    reportIssueDateField.updateAppearances(customFont)

    const awardField = form.getField("award")
    awardField.setText("To be set in future...")
    // awardField.setText(`${matchingTender.award}`)
    awardField.updateAppearances(customFont)

    const feedbackProvidedField = form.getField("feedbackProvided")
    feedbackProvidedField.setText("To be set in future...")
    // feedbackProvidedField.setText(`${matchingTender.award}`)
    feedbackProvidedField.updateAppearances(customFont)

    for (let field of fields) {
    field.enableReadOnly()
    }

    const newReportContent = await pdfDoc.save()
    await fs.writeFile(`./reports/reportsGenerated/${matchingTender.companyName}_${fileIdentifier}.pdf`, newReportContent, (err) => {
        if (err) throw err;
        console.log("The pdf report was succesfully created !");
    });
}

module.exports = generateRegisterReport