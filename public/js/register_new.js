// ---- ---- Declaration of elements
const lead = document.querySelector(".lead")
const allTiles = document.querySelectorAll(".tile")
const allPageBtn = document.querySelectorAll(".pageBtn")
const prevBtn = document.querySelector("#prevBtn")
const form = document.querySelector("form")
const nextBtn = document.querySelector("#nextBtn")
const confirmBtn = document.querySelector("#confirmBtn")
const mod_submitBtn = document.querySelector("#mod_submitBtn")
const transportModeBoxes = document.querySelectorAll(".transportModeBox")
const transportModeVolumes = document.querySelectorAll(".transportModeVolume")
const keyTradelaneBoxes = document.querySelectorAll(".keyTradelaneBox")
const historyBoxes = document.querySelectorAll(".historyBox")
const customerSegmentRadios = document.querySelectorAll(".customerSegment")

// ---- ---- Declaration of values
const countryLocation = document.querySelector("#countryLocation")
const isPreadvised = document.querySelector("#isPreadvised")
const preadviseID = document.querySelector("#preadviseID")
const companyName = document.querySelector("#companyName")
const sugarID = document.querySelector("#sugarID")
const businessVertical = document.querySelector("#businessVertical")
const contactName = document.querySelector("#contactName")
const contactJobTitle = document.querySelector("#contactJobTitle")
const contactEmail = document.querySelector("#contactEmail")
const decisionMaker = document.querySelector("#decisionMaker")
const hasAirFreight = document.querySelector("#hasAirFreight")
const hasSeaFreightFCL = document.querySelector("#hasSeaFreightFCL")
const hasSeaFreightLCL = document.querySelector("#hasSeaFreightLCL")
const hasRailFreight = document.querySelector("#hasRailFreight")
const airFreightVol = document.querySelector("#airFreightVol")
const seaFreightFCLVol = document.querySelector("#seaFreightFCLVol")
const seaFreightLCLVol = document.querySelector("#seaFreightLCLVol")
const railFreightVol = document.querySelector("#railFreightVol")
const commodity = document.querySelector("#commodity")
const dangerousGoods = document.querySelector("#dangerousGoods")
const pharmaGoods = document.querySelector("#pharmaGoods")
const coldChain = document.querySelector("#coldChain")
const timeCritical = document.querySelector("#timeCritical")
const receptionDate = document.querySelector("#receptionDate")
const deadlineRFQ = document.querySelector("#deadlineRFQ")
const linkedRFI = document.querySelector("#linkedRFI")
const deadlineRFI = document.querySelector("#deadlineRFI")
const decisionDate = document.querySelector("#decisionDate")
const startBusinessDate = document.querySelector("#startBusinessDate")
const africaToAfrica = document.querySelector("#africaToAfrica")
const africaToAmericas = document.querySelector("#africaToAmericas")
const africaToAsia = document.querySelector("#africaToAsia")
const africaToEurope = document.querySelector("#africaToEurope")
const africaToOceania = document.querySelector("#africaToOceania")
const americasToAfrica = document.querySelector("#americasToAfrica")
const americasToAmericas = document.querySelector("#americasToAmericas")
const americasToAsia = document.querySelector("#americasToAsia")
const americasToEurope = document.querySelector("#americasToEurope")
const americasToOceania = document.querySelector("#americasToOceania")
const asiaToAfrica = document.querySelector("#asiaToAfrica")
const asiaToAmericas = document.querySelector("#asiaToAmericas")
const asiaToAsia = document.querySelector("#asiaToAsia")
const asiaToEurope = document.querySelector("#asiaToEurope")
const asiaToOceania = document.querySelector("#asiaToOceania")
const europeToAfrica = document.querySelector("#europeToAfrica")
const europeToAmericas = document.querySelector("#europeToAmericas")
const europeToAsia = document.querySelector("#europeToAsia")
const europeToEurope = document.querySelector("#europeToEurope")
const europeToOceania = document.querySelector("#europeToOceania")
const oceaniaToAfrica = document.querySelector("#oceaniaToAfrica")
const oceaniaToAmericas = document.querySelector("#oceaniaToAmericas")
const oceaniaToAsia = document.querySelector("#oceaniaToAsia")
const oceaniaToEurope = document.querySelector("#oceaniaToEurope")
const oceaniaToOceania = document.querySelector("#oceaniaToOceania")
const lanesAmount = document.querySelector("#lanesAmount")
const dtod = document.querySelector("#dtod")
const dtop = document.querySelector("#dtop")
const ptop = document.querySelector("#ptop")
const ptod = document.querySelector("#ptod")
const ratesValidityAir = document.querySelector("#ratesValidityAir")
const opt_ratesValidityAir = document.querySelector("#opt_ratesValidityAir")
const ratesValidityFCL = document.querySelector("#ratesValidityFCL")
const opt_ratesValidityFCL = document.querySelector("#opt_ratesValidityFCL")
const ratesValidityLCL = document.querySelector("#ratesValidityLCL")
const opt_ratesValidityLCL = document.querySelector("#opt_ratesValidityLCL")
const ratesValidityRail = document.querySelector("#ratesValidityRail")
const opt_ratesValidityRail = document.querySelector("#opt_ratesValidityRail")
const contractPeriod = document.querySelector("#contractPeriod")
const paymentTerms = document.querySelector("#paymentTerms")
const allLanesQuoted = document.querySelector("#allLanesQuoted")
const countryLanesQuoted = document.querySelector("#countryLanesQuoted")
const regionLanesQuoted = document.querySelector("#regionLanesQuoted")
const trspModeLanesQuoted = document.querySelector("#trspModeLanesQuoted")
const noRestriction = document.querySelector("#noRestriction")
const noRequirement = document.querySelector("#noRequirement")
const trackTrace = document.querySelector("#trackTrace")
const docsMgmt = document.querySelector("#docsMgmt")
const basicReports = document.querySelector("#basicReports")
const leadTimeReports = document.querySelector("#leadTimeReports")
const ediConnection = document.querySelector("#ediConnection")
const orderManagement = document.querySelector("#orderManagement")
const controlTower = document.querySelector("#controlTower")
const roundsAmount = document.querySelector("#roundsAmount")
const tenderLaunchMethod = document.querySelector("#tenderLaunchMethod")
const historyAirOcean = document.querySelector("#historyAirOcean")
const historyRoadFreight = document.querySelector("#historyRoadFreight")
const historyContractLog = document.querySelector("#historyContractLog")
const historyPortLog = document.querySelector("#historyPortLog")
const historyNone = document.querySelector("#historyNone")
const segmentA = document.querySelector("#segmentA")
const segmentB = document.querySelector("#segmentB")
const segmentC = document.querySelector("#segmentC")
const visitFrequency = document.querySelector("#visitFrequency")
const visitHistory = document.querySelector("#visitHistory")
const currentServiceProvider = document.querySelector("#currentServiceProvider")
const competitorAmount = document.querySelector("#competitorAmount")
const volumeSplit = document.querySelector("#volumeSplit")
const reasonForTender = document.querySelector("#reasonForTender")
const decisionCritera = document.querySelector("#decisionCritera")
const feedbackAvailable = document.querySelector("#feedbackAvailable")
const potential = document.querySelector("#potential")
const fileUpload = document.querySelector("#fileUpload")
const additionalComment = document.querySelector("#additionalComment")

// ---- ---- Declaration of modal values
const mod_countryLocation = document.querySelector("#mod_countryLocation")
const mod_isPreadvised = document.querySelector("#mod_isPreadvised")
const mod_preadviseID = document.querySelector("#mod_preadviseID")
const mod_companyName = document.querySelector("#mod_companyName")
const mod_sugarID = document.querySelector("#mod_sugarID")
const mod_businessVertical = document.querySelector("#mod_businessVertical")
const mod_contactName = document.querySelector("#mod_contactName")
const mod_contactJobTitle = document.querySelector("#mod_contactJobTitle")
const mod_contactEmail = document.querySelector("#mod_contactEmail")
const mod_decisionMaker = document.querySelector("#mod_decisionMaker")
const mod_hasAirFreight = document.querySelector("#mod_hasAirFreight")
const mod_hasSeaFreightFCL = document.querySelector("#mod_hasSeaFreightFCL")
const mod_hasSeaFreightLCL = document.querySelector("#mod_hasSeaFreightLCL")
const mod_hasRailFreight = document.querySelector("#mod_hasRailFreight")
const mod_airFreightVol = document.querySelector("#mod_airFreightVol")
const mod_seaFreightFCLVol = document.querySelector("#mod_seaFreightFCLVol")
const mod_seaFreightLCLVol = document.querySelector("#mod_seaFreightLCLVol")
const mod_railFreightVol = document.querySelector("#mod_railFreightVol")
const mod_commodity = document.querySelector("#mod_commodity")
const mod_specialHandling = document.querySelector("#mod_specialHandling")
const mod_dangerousGoods = document.querySelector("#mod_dangerousGoods")
const mod_pharmaGoods = document.querySelector("#mod_pharmaGoods")
const mod_coldChain = document.querySelector("#mod_coldChain")
const mod_timeCritical = document.querySelector("#mod_timeCritical")
const mod_receptionDate = document.querySelector("#mod_receptionDate")
const mod_deadlineRFQ = document.querySelector("#mod_deadlineRFQ")
const mod_linkedRFI = document.querySelector("#mod_linkedRFI")
const mod_deadlineRFI = document.querySelector("#mod_deadlineRFI")
const mod_decisionDate = document.querySelector("#mod_decisionDate")
const mod_startBusinessDate = document.querySelector("#mod_startBusinessDate")
const mod_africaToAfrica = document.querySelector("#mod_africaToAfrica")
const mod_africaToAmericas = document.querySelector("#mod_africaToAmericas")
const mod_africaToAsia = document.querySelector("#mod_africaToAsia")
const mod_africaToEurope = document.querySelector("#mod_africaToEurope")
const mod_africaToOceania = document.querySelector("#mod_africaToOceania")
const mod_americasToAfrica = document.querySelector("#mod_americasToAfrica")
const mod_americasToAmericas = document.querySelector("#mod_americasToAmericas")
const mod_americasToAsia = document.querySelector("#mod_americasToAsia")
const mod_americasToEurope = document.querySelector("#mod_americasToEurope")
const mod_americasToOceania = document.querySelector("#mod_americasToOceania")
const mod_asiaToAfrica = document.querySelector("#mod_asiaToAfrica")
const mod_asiaToAmericas = document.querySelector("#mod_asiaToAmericas")
const mod_asiaToAsia = document.querySelector("#mod_asiaToAsia")
const mod_asiaToEurope = document.querySelector("#mod_asiaToEurope")
const mod_asiaToOceania = document.querySelector("#mod_asiaToOceania")
const mod_europeToAfrica = document.querySelector("#mod_europeToAfrica")
const mod_europeToAmericas = document.querySelector("#mod_europeToAmericas")
const mod_europeToAsia = document.querySelector("#mod_europeToAsia")
const mod_europeToEurope = document.querySelector("#mod_europeToEurope")
const mod_europeToOceania = document.querySelector("#mod_europeToOceania")
const mod_oceaniaToAfrica = document.querySelector("#mod_oceaniaToAfrica")
const mod_oceaniaToAmericas = document.querySelector("#mod_oceaniaToAmericas")
const mod_oceaniaToAsia = document.querySelector("#mod_oceaniaToAsia")
const mod_oceaniaToEurope = document.querySelector("#mod_oceaniaToEurope")
const mod_oceaniaToOceania = document.querySelector("#mod_oceaniaToOceania")
const mod_lanesAmount = document.querySelector("#mod_lanesAmount")
const mod_transportScope = document.querySelector("#mod_transportScope")
const mod_dtod = document.querySelector("#mod_dtod")
const mod_dtop = document.querySelector("#mod_dtop")
const mod_ptop = document.querySelector("#mod_ptop")
const mod_ptod = document.querySelector("#mod_ptod")
const mod_ratesValidityAir = document.querySelector("#mod_ratesValidityAir")
const mod_ratesValidityFCL = document.querySelector("#mod_ratesValidityFCL")
const mod_ratesValidityLCL = document.querySelector("#mod_ratesValidityLCL")
const mod_ratesValidityRail = document.querySelector("#mod_ratesValidityRail")
const mod_contractPeriod = document.querySelector("#mod_contractPeriod")
const mod_paymentTerms = document.querySelector("#mod_paymentTerms")
const mod_restrictions = document.querySelector("#mod_restrictions")
const mod_allLanesQuoted = document.querySelector("#mod_allLanesQuoted")
const mod_countryLanesQuoted = document.querySelector("#mod_countryLanesQuoted")
const mod_regionLanesQuoted = document.querySelector("#mod_regionLanesQuoted")
const mod_trspModeLanesQuoted = document.querySelector("#mod_trspModeLanesQuoted")
const mod_noRestriction = document.querySelector("#mod_noRestriction")
const mod_noRequirement = document.querySelector("#mod_noRequirement")
const mod_trackTrace = document.querySelector("#mod_trackTrace")
const mod_docsMgmt = document.querySelector("#mod_docsMgmt")
const mod_basicReports = document.querySelector("#mod_basicReports")
const mod_leadTimeReports = document.querySelector("#mod_leadTimeReports")
const mod_ediConnection = document.querySelector("#mod_ediConnection")
const mod_orderManagement = document.querySelector("#mod_orderManagement")
const mod_controlTower = document.querySelector("#mod_controlTower")
const mod_roundsAmount = document.querySelector("#mod_roundsAmount")
const mod_tenderLaunchMethod = document.querySelector("#mod_tenderLaunchMethod")
const mod_historyAirOcean = document.querySelector("#mod_historyAirOcean")
const mod_historyRoadFreight = document.querySelector("#mod_historyRoadFreight")
const mod_historyContractLog = document.querySelector("#mod_historyContractLog")
const mod_historyPortLog = document.querySelector("#mod_historyPortLog")
const mod_historyNone = document.querySelector("#mod_historyNone")
const mod_segmentA = document.querySelector("#mod_segmentA")
const mod_segmentB = document.querySelector("#mod_segmentB")
const mod_segmentC = document.querySelector("#mod_segmentC")
const mod_visitFrequency = document.querySelector("#mod_visitFrequency")
const mod_visitHistory = document.querySelector("#mod_visitHistory")
const mod_currentServiceProvider = document.querySelector("#mod_currentServiceProvider")
const mod_competitorAmount = document.querySelector("#mod_competitorAmount")
const mod_volumeSplit = document.querySelector("#mod_volumeSplit")
const mod_reasonForTender = document.querySelector("#mod_reasonForTender")
const mod_decisionCritera = document.querySelector("#mod_decisionCritera")
const mod_feedbackAvailable = document.querySelector("#mod_feedbackAvailable")
const mod_potential = document.querySelector("#mod_potential")
const mod_fileUpload = document.querySelector("#mod_fileUpload")
const mod_additionalComment = document.querySelector("#mod_additionalComment")

// ---- ---- Declaration of optional modules
const opt_preadviseID = document.querySelector("#opt_preadviseID")
const opt_deadlineRFI = document.querySelector("#opt_deadlineRFI")

// Declaration of Arrays
const transportModesCheckboxes = [hasAirFreight, hasSeaFreightFCL, hasSeaFreightLCL, hasRailFreight]
const transportModesVolumes = [airFreightVol, seaFreightFCLVol, seaFreightLCLVol, railFreightVol]
const transportModesValidities = [ratesValidityAir, ratesValidityFCL, ratesValidityLCL, ratesValidityRail]
const routes = [
    africaToAfrica,
    africaToAmericas,
    africaToAsia,
    africaToEurope,
    africaToOceania,
    americasToAfrica,
    americasToAmericas,
    americasToAsia,
    americasToEurope,
    americasToOceania,
    asiaToAfrica,
    asiaToAmericas,
    asiaToAsia,
    asiaToEurope,
    asiaToOceania,
    europeToAfrica,
    europeToAmericas,
    europeToAsia,
    europeToEurope,
    europeToOceania,
    oceaniaToAfrica,
    oceaniaToAmericas,
    oceaniaToAsia,
    oceaniaToEurope,
    oceaniaToOceania
]
const histories = [
    historyAirOcean,
    historyRoadFreight,
    historyContractLog,
    historyPortLog,
    historyNone
]
const historiesFormats = {
    historyAirOcean: "Air & Ocean",
    historyRoadFreight: "Road Freight",
    historyContractLog: "Contract Logistics",
    historyPortLog: "Port Logistics",
    historyNone: "None"
}
const transportScopes = [
    dtod,
    dtop,
    ptop,
    ptod
]
const ratesValidityInputs = [
    ratesValidityAir,
    ratesValidityFCL,
    ratesValidityLCL,
    ratesValidityRail
]
const opt_ratesValidityFields = [
    opt_ratesValidityAir,
    opt_ratesValidityFCL,
    opt_ratesValidityLCL,
    opt_ratesValidityRail
]
const handlings = [
    dangerousGoods,
    pharmaGoods,
    coldChain,
    timeCritical
]
const handlingsFormats = {
    dangerousGoods: "DG goods",
    pharmaGoods: "Pharma.",
    coldChain: "Temperature control",
    timeCritical: "Time critical"
}
const allRequirements = [
    trackTrace,
    docsMgmt,
    basicReports,
    leadTimeReports,
    ediConnection,
    orderManagement,
    controlTower
]

// ---- ---- Declaration of reusable functions
// ---- Function to get the filds .value or the checkbox .checked
const getValue = function (element) {
    if (element.type === "checkbox" || element.type === "radio") {
        return element.checked
    } else if (element.type === "select-one") {
        return element.selectedOptions[0].innerText
    } else {
        return element.value
    }
}

// ---- Function to get a numeric value expressed in the correct formating
const getNumericValue = function (element) {
    return Number(parseInt(element.value)).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

// ---- Function to get the numeric value of an entered volume
const getVolume = function (volField, unit) {
    if (volField.value) {
        return `${getNumericValue(volField)} ${unit}`
    } else {
        return "-"
    }
}


// ---- ---- App functions
const launchModal = function () {
    const addingModalTriggers = function () {
        confirmBtn.setAttribute("data-bs-toggle", "modal")
        confirmBtn.setAttribute("data-bs-target", "#staticBackdrop")
    }

    const addingModalFields = function () {
        mod_isPreadvised.innerText = getValue(isPreadvised)
        if (getValue(isPreadvised) === "Yes") { mod_preadviseID.innerText = preadviseID.value }
        mod_reasonForTender.innerText = getValue(reasonForTender)
        mod_companyName.innerText = getValue(companyName)
        mod_businessVertical.innerText = getValue(businessVertical)
        mod_sugarID.innerText = getValue(sugarID)
        mod_contactName.innerText = getValue(contactName)
        mod_contactJobTitle.innerText = getValue(contactJobTitle)
        mod_contactEmail.innerText = getValue(contactEmail)
        mod_decisionMaker.innerText = getValue(decisionMaker)
        mod_visitFrequency.innerText = getValue(visitFrequency)
        mod_visitHistory.innerText = getValue(visitHistory)
        mod_receptionDate.innerText = getValue(receptionDate)
        mod_deadlineRFQ.innerText = getValue(deadlineRFQ)
        mod_linkedRFI.innerText = getValue(linkedRFI)
        if (getValue(linkedRFI) === "Yes") { mod_deadlineRFI.innerText = `${getValue(deadlineRFI)}` } else { mod_deadlineRFI.innertext = "-" }
        mod_decisionDate.innerText = getValue(decisionDate)
        mod_decisionCritera.innerText = `Based on: ${getValue(decisionCritera)}`
        if (getValue(feedbackAvailable) === "Yes") { mod_feedbackAvailable.innerText = "Feedback provided" } else { mod_feedbackAvailable.innerText = "Feedback not provided" }
        mod_startBusinessDate.innerText = getValue(startBusinessDate)
        mod_currentServiceProvider.innerText = getValue(currentServiceProvider)
        mod_competitorAmount.innerText = getValue(competitorAmount)
        mod_volumeSplit.innerText = `${getValue(volumeSplit)} awarded`
        mod_commodity.innerText = getValue(commodity)
        if (getValue(dtod)) { mod_dtod.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_dtod.innerText = "-" }
        if (getValue(dtop)) { mod_dtop.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_dtop.innerText = "-" }
        if (getValue(ptod)) { mod_ptod.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_ptod.innerText = "-" }
        if (getValue(ptop)) { mod_ptop.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_ptop.innerText = "-" }
        if (getValue(noRestriction)) { mod_noRestriction.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_noRestriction.innerText = "-" }
        if (getValue(allLanesQuoted)) { mod_allLanesQuoted.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_allLanesQuoted.innerText = "-" }
        if (getValue(countryLanesQuoted)) { mod_countryLanesQuoted.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_countryLanesQuoted.innerText = "-" }
        if (getValue(regionLanesQuoted)) { mod_regionLanesQuoted.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_regionLanesQuoted.innerText = "-" }
        if (getValue(trspModeLanesQuoted)) { mod_trspModeLanesQuoted.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_trspModeLanesQuoted.innerText = "-" }
        if (getValue(noRequirement)) { mod_noRequirement.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_noRequirement.innerText = "-" }
        if (getValue(trackTrace)) { mod_trackTrace.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_trackTrace.innerText = "-" }
        if (getValue(docsMgmt)) { mod_docsMgmt.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_docsMgmt.innerText = "-" }
        if (getValue(basicReports)) { mod_basicReports.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_basicReports.innerText = "-" }
        if (getValue(leadTimeReports)) { mod_leadTimeReports.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_leadTimeReports.innerText = "-" }
        if (getValue(ediConnection)) { mod_ediConnection.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_ediConnection.innerText = "-" }
        if (getValue(orderManagement)) { mod_orderManagement.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_orderManagement.innerText = "-" }
        if (getValue(controlTower)) { mod_controlTower.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_controlTower.innerText = "-" }
        if (getValue(hasAirFreight)) { mod_hasAirFreight.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_hasAirFreight.innerText = "-" }
        if (getValue(hasSeaFreightFCL)) { mod_hasSeaFreightFCL.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_hasSeaFreightFCL.innerText = "-" }
        if (getValue(hasSeaFreightLCL)) { mod_hasSeaFreightLCL.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_hasSeaFreightLCL.innerText = "-" }
        if (getValue(hasRailFreight)) { mod_hasRailFreight.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_hasRailFreight.innerText = "-" }
        mod_airFreightVol.innerText = getVolume(airFreightVol, "Tons")
        mod_seaFreightFCLVol.innerText = getVolume(seaFreightFCLVol, "TEUs")
        mod_seaFreightLCLVol.innerText = getVolume(seaFreightLCLVol, "CBMs")
        mod_railFreightVol.innerText = getVolume(railFreightVol, "TEUs")
        if (getValue(ratesValidityAir) !== "Choose...") { mod_ratesValidityAir.innerText = getValue(ratesValidityAir) } else { mod_ratesValidityAir.innerText = "-" }
        if (getValue(ratesValidityFCL) !== "Choose...") { mod_ratesValidityFCL.innerText = getValue(ratesValidityFCL) } else { mod_ratesValidityFCL.innerText = "-" }
        if (getValue(ratesValidityLCL) !== "Choose...") { mod_ratesValidityLCL.innerText = getValue(ratesValidityLCL) } else { mod_ratesValidityLCL.innerText = "-" }
        if (getValue(ratesValidityRail) !== "Choose...") { mod_ratesValidityRail.innerText = getValue(ratesValidityRail) } else { mod_ratesValidityRail.innerText = "-" }
        if (getValue(africaToAfrica)) { mod_africaToAfrica.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_africaToAfrica.innerText = "-" }
        if (getValue(africaToAmericas)) { mod_africaToAmericas.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_africaToAmericas.innerText = "-" }
        if (getValue(africaToAsia)) { mod_africaToAsia.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_africaToAsia.innerText = "-" }
        if (getValue(africaToEurope)) { mod_africaToEurope.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_africaToEurope.innerText = "-" }
        if (getValue(africaToOceania)) { mod_africaToOceania.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_africaToOceania.innerText = "-" }
        if (getValue(americasToAfrica)) { mod_americasToAfrica.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_americasToAfrica.innerText = "-" }
        if (getValue(americasToAmericas)) { mod_americasToAmericas.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_americasToAmericas.innerText = "-" }
        if (getValue(americasToAsia)) { mod_americasToAsia.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_americasToAsia.innerText = "-" }
        if (getValue(americasToEurope)) { mod_americasToEurope.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_americasToEurope.innerText = "-" }
        if (getValue(americasToOceania)) { mod_americasToOceania.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_americasToOceania.innerText = "-" }
        if (getValue(asiaToAfrica)) { mod_asiaToAfrica.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_asiaToAfrica.innerText = "-" }
        if (getValue(asiaToAmericas)) { mod_asiaToAmericas.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_asiaToAmericas.innerText = "-" }
        if (getValue(asiaToAsia)) { mod_asiaToAsia.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_asiaToAsia.innerText = "-" }
        if (getValue(asiaToEurope)) { mod_asiaToEurope.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_asiaToEurope.innerText = "-" }
        if (getValue(asiaToOceania)) { mod_asiaToOceania.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_asiaToOceania.innerText = "-" }
        if (getValue(europeToAfrica)) { mod_europeToAfrica.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_europeToAfrica.innerText = "-" }
        if (getValue(europeToAmericas)) { mod_europeToAmericas.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_europeToAmericas.innerText = "-" }
        if (getValue(europeToAsia)) { mod_europeToAsia.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_europeToAsia.innerText = "-" }
        if (getValue(europeToEurope)) { mod_europeToEurope.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_europeToEurope.innerText = "-" }
        if (getValue(europeToOceania)) { mod_europeToOceania.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_europeToOceania.innerText = "-" }
        if (getValue(oceaniaToAfrica)) { mod_oceaniaToAfrica.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_oceaniaToAfrica.innerText = "-" }
        if (getValue(oceaniaToAmericas)) { mod_oceaniaToAmericas.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_oceaniaToAmericas.innerText = "-" }
        if (getValue(oceaniaToAsia)) { mod_oceaniaToAsia.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_oceaniaToAsia.innerText = "-" }
        if (getValue(oceaniaToEurope)) { mod_oceaniaToEurope.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_oceaniaToEurope.innerText = "-" }
        if (getValue(oceaniaToOceania)) { mod_oceaniaToOceania.innerHTML = "<i class='twa twa-check-mark-button'></i>" } else { mod_oceaniaToOceania.innerText = "-" }
        if (getValue(segmentA)) { mod_existingCustomerSegment.innerText = "A-customer" } else if (getValue(segmentB)) { mod_existingCustomerSegment.innerText = "B-customer" } else if (getValue(segmentC)) { mod_existingCustomerSegment.innerText = "C-customer" } else { mod_existingCustomerSegment.innerText = "-" }
        if (getValue(additionalComment)) { mod_additionalComment.innerText = getValue(additionalComment) } else { mod_additionalComment.innerText = "-" }
        if (getValue(potential)) { mod_potential.innerText = getValue(potential) } else { mod_potential.innerText = "-" }

        // ---- Special display for Country registering the registration
        const adjustmod_countryLocation = async function () {
            try {
                const result = await axios.get("../../ressources/countries.json")
                const countriesData = result.data
                for (let country of countriesData) {
                    if (country.cca2 === countryLocation.value) {
                        // console.log(`Correct country is ${country.name.common}`)
                        mod_countryLocation.innerText = `${country.cca2} - ${country.name.common} ${country.flag}`
                    }
                }
            }
            catch (err) {
                console.log("Oh no ! There's an error !", err)
            }

        }

        adjustmod_countryLocation()

        // ---- Special display for Customer History with Rhenus
        let historyArray = []
        for (let history of histories) {
            if (getValue(history)) {
                switch (history) {
                    case historyAirOcean:
                        historyArray.push(historiesFormats.historyAirOcean)
                        break;
                    case historyRoadFreight:
                        historyArray.push(historiesFormats.historyRoadFreight)
                        break;
                    case historyContractLog:
                        historyArray.push(historiesFormats.historyContractLog)
                        break;
                    case historyPortLog:
                        historyArray.push(historiesFormats.historyPortLog)
                        break;
                    case historyNone:
                        historyArray.push(historiesFormats.historyNone)
                }
            }
        }
        mod_rhenusHistory.innerText = historyArray.join(", ")

        // ---- Special display for Special Handling
        let specialHandlingArray = []
        for (let handling of handlings) {
            if (getValue(handling)) {
                switch (handling) {
                    case dangerousGoods:
                        specialHandlingArray.push(handlingsFormats.dangerousGoods)
                        break;
                    case pharmaGoods:
                        specialHandlingArray.push(handlingsFormats.pharmaGoods)
                        break;
                    case coldChain:
                        specialHandlingArray.push(handlingsFormats.coldChain)
                        break;
                    case timeCritical:
                        specialHandlingArray.push(handlingsFormats.timeCritical)
                }
            }
        }
        if (specialHandlingArray.length = 0) {
            mod_specialHandling.innerText = "No special handling required"
        } else {
            mod_specialHandling.innerText = specialHandlingArray.join(", ")
        }

        // ---- Special display for Document uploads
        if (getValue(fileUpload)) {
            let fileNameArray = []
            let files = fileUpload.files
            for (let file of files) {
                if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                    fileNameArray.push(`<i class="bi bi-file-earmark-richtext me-2"></i>${file.name}`)
                }
                else if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                    fileNameArray.push(`<i class="bi bi-file-earmark-spreadsheet me-2"></i>${file.name}`)
                }
                else if (file.type === "application/pdf") {
                    fileNameArray.push(`<i class="bi bi-file-earmark-pdf me-2"></i>${file.name}`)
                }
                else if (file.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
                    fileNameArray.push(`<i class="bi bi-file-earmark-easel me-2"></i>${file.name}`)
                }
                else if (file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg" || file.type === "image/tiff") {
                    fileNameArray.push(`<i class="bi bi-file-earmark-image me-2"></i>${file.name}`)
                }
                else {
                    fileNameArray.push(`<i class="bi bi-file-earmark-text me-2"></i>${file.name}`)
                }
            }
            mod_fileUpload.innerHTML = fileNameArray.join("<br>")
        } else {
            mod_fileUpload.innerText = "No document uploaded"
        }

    }

    const removeModalTriggers = function () {
        confirmBtn.removeAttribute("data-bs-toggle")
        confirmBtn.removeAttribute("data-bs-target")
    }

    addingModalTriggers()
    addingModalFields()
    confirmBtn.click()
    removeModalTriggers()
}

// ---- ---- Event Listener functions
// ---- Controling the launch of the confirmation modal

const formValidation = function () {
    let forms = document.querySelectorAll('form')
    for (let form of forms) {
        form.classList.add('was-validated')
        if (form.checkValidity()) {
            confirmBtn.classList.remove("btn-primary")
            confirmBtn.classList.add("btn-success")
            setTimeout(() => {
                confirmBtn.classList.remove("btn-success")
                confirmBtn.classList.add("btn-primary")
            }, 250);
            launchModal()
            // console.log("The form is validated.")
        } else {
            // console.log("The form is not validated.")
            confirmBtn.classList.remove("btn-primary")
            confirmBtn.classList.add("btn-danger", "animate__animated", "animate__shakeX", "animate__faster")
            setTimeout(() => {
                confirmBtn.classList.remove("btn-danger", "animate__animated", "animate__shakeX", "animate__faster")
                confirmBtn.classList.add("btn-primary")
            }, 250);
        }
    }
}

confirmBtn.addEventListener("click", function (event) { event.preventDefault(), formValidation() })

// ---- Controling the availability of volume fields depending on the transport mode selected
for (let transportModeBox of transportModeBoxes) {
    transportModeBox.addEventListener("click", function () {
        if (!transportModeBox.checked) {
            var array = Array.from(transportModeBoxes);
            let index = array.indexOf(transportModeBox)
            transportModeVolumes[index].value = null
            transportModeVolumes[index].setAttribute("disabled", "true")
        } else {
            var array = Array.from(transportModeBoxes);
            let index = array.indexOf(transportModeBox)
            transportModeVolumes[index].removeAttribute("disabled")
        }
    })
}
window.addEventListener("load", function () {
    for (let transportModeBox of transportModeBoxes) {
        if (!transportModeBox.checked) {
            var array = Array.from(transportModeBoxes);
            let index = array.indexOf(transportModeBox)
            transportModeVolumes[index].value = null
            transportModeVolumes[index].setAttribute("disabled", "true")
        } else {
            var array = Array.from(transportModeBoxes);
            let index = array.indexOf(transportModeBox)
            transportModeVolumes[index].removeAttribute("disabled")
        }
    }
})

// ---- Controling the requiered attribute of transport modes checkboxes & volumes fields
// ---- NOTE: In practice it is working, but I noticed some descrpencies in the way the requiered attribute is set. In practice this should not lead to bugs.
const validationArray1 = []

for (let transportModesCheckbox of transportModesCheckboxes) {
    transportModesCheckbox.addEventListener("click", function () {
        let index = transportModesCheckboxes.indexOf(transportModesCheckbox)
        if (transportModesCheckbox.checked) {
            validationArray1.push(transportModesVolumes[`${index}`])
            transportModesCheckbox.setAttribute("required", true)
            transportModesVolumes[`${index}`].setAttribute("required", true)
            for (let transportModesCheckbox2 of transportModesCheckboxes) {
                if (transportModesCheckboxes.indexOf(transportModesCheckbox2) !== index && !transportModesCheckbox2.checked) {
                    transportModesCheckbox2.removeAttribute("required")
                    transportModesVolumes[`${transportModesCheckboxes.indexOf(transportModesCheckbox2)}`].removeAttribute("required")
                }
            }
        } else {
            let indexToDelete = validationArray1.indexOf(transportModesVolumes[`${index}`])
            validationArray1.splice(indexToDelete, 1)
            if (validationArray1.length === 0) {
                for (let transportModesCheckbox of transportModesCheckboxes) {
                    transportModesCheckbox.setAttribute("required", true)
                }
                for (let transportModesVolume of transportModesVolumes) {
                    transportModesVolume.setAttribute("required", true)
                }
            } else {
                transportModesCheckbox.removeAttribute("required")
                transportModesVolumes[`${index}`].removeAttribute("required")
                for (let transportModesCheckbox2 of transportModesCheckboxes) {
                    if (transportModesCheckbox2.checked) {
                        transportModesCheckbox2.setAttribute("required", true)
                    } else {
                        transportModesCheckbox2.removeAttribute("required")
                    }
                }
            }
        }
    })
}

window.addEventListener("load", function () {
    for (let transportModesCheckbox of transportModesCheckboxes) {
        // transportModesCheckbox.checked = false
        if (!transportModesCheckbox.checked) {
            let index = transportModesCheckboxes.indexOf(transportModesCheckbox)
            transportModesVolumes[index].setAttribute("disabled", true)
        }
        else {
            for (let transportModesCheckbox2 of transportModesCheckboxes) {
                if (!transportModesCheckbox2.checked) {
                    transportModesCheckbox2.removeAttribute("required")
                }
            }
        }
    }
    // for (let transportModesVolume of transportModesVolumes) {
    //     transportModesVolume.value = null
    //     transportModesVolume.setAttribute("disabled", true)
    // }
})

// ---- Controling the requiered attribute of requirement checkboxes
let adjust_requirements = function () {
    if (getValue(noRequirement)) {
        for (let requirement of allRequirements) {
            requirement.checked = false
            requirement.setAttribute("disabled", "true")
            requirement.removeAttribute("required")
        }
    } else {
        let validationAmount = 0
        for (let requirement of allRequirements) {
            requirement.removeAttribute("disabled")
            if (requirement.checked === true) {
                validationAmount = validationAmount + 1
            }
            if (validationAmount > 0) {
                for (let required of allRequirements) {
                    required.removeAttribute("required", "true")
                }
            } else {
                for (let required of allRequirements) {
                    required.classList.remove("disabled")
                    required.setAttribute("required", "true")
                }
            }
        }
    }
}

noRequirement.addEventListener("input", adjust_requirements)
for (let requirement of allRequirements) {
    requirement.addEventListener("input", adjust_requirements)
}

// ---- Controling the requiered attribute of the preadvise ID field
const adjust_preadvisedIDField = function () {
    if (isPreadvised.value === "no" || !isPreadvised.value) {
        preadviseID.removeAttribute("required")
        preadviseID.value = ""
        opt_preadviseID.classList.add("d-none")
        // console.log("Value is NO - Nothing should appear")
    } else {
        preadviseID.setAttribute("required", "true")
        opt_preadviseID.classList.remove("d-none")
        // console.log("Value is YES - Tile should appear")
    }
}

isPreadvised.addEventListener("input", adjust_preadvisedIDField)
window.addEventListener("load", function () {
    if (isPreadvised.value !== "yes") {
        preadviseID.value = ""
        opt_preadviseID.classList.add("d-none")
    }
})

// ---- Controling the requiered attribute of the "Is there an RFI ?" field
const adjust_rfiField = function () {
    if (linkedRFI.value === "no" || !linkedRFI.value) {
        deadlineRFI.removeAttribute("required")
        deadlineRFI.value = ""
        opt_deadlineRFI.classList.add("d-none")
        // console.log("Value is NO - Nothing should appear")
    } else {
        deadlineRFI.setAttribute("required", "true")
        opt_deadlineRFI.classList.remove("d-none")
        // console.log("Value is YES - Tile should appear")
    }
}

linkedRFI.addEventListener("input", adjust_rfiField)
window.addEventListener("load", function () {
    deadlineRFI.value = ""
    opt_deadlineRFI.classList.add("d-none")
})

// ---- Controling the requiered attribute of each lanes From/To
let lanesBoxCheckedAmount = 0

for (let route of routes) {
    route.addEventListener("click", function () {
        if (route.checked === true) {
            lanesBoxCheckedAmount += 1
        } else {
            lanesBoxCheckedAmount -= 1
        }
        for (let route of routes) {
            if (lanesBoxCheckedAmount > 0) { route.removeAttribute("required") }
            else { route.setAttribute("required", true) }
        }
    })
}

window.addEventListener("load", function () {
    for (let route of routes) {
        if (route.checked === true) {
            lanesBoxCheckedAmount += 1
        }
        for (let route of routes) {
            if (lanesBoxCheckedAmount > 0) { route.removeAttribute("required") }
            else { route.setAttribute("required", true) }
        }
    }
}
)

// ---- Controling the requiered attribute of the Transportation scopes checkboxes
let transportScopeCheckedAmount = 0

for (let transportScope of transportScopes) {
    transportScope.addEventListener("click", function () {
        if (transportScope.checked === true) {
            transportScopeCheckedAmount += 1
        } else {
            transportScopeCheckedAmount -= 1
        }
        for (let transportScope of transportScopes) {
            if (transportScopeCheckedAmount > 0) { transportScope.removeAttribute("required") }
            else { transportScope.setAttribute("required", true) }
        }
    })
}

// controlling the availability of rates validity fields depending on the transport mode selected

for (let opt_ratesValidityField of opt_ratesValidityFields) {
    opt_ratesValidityField.classList.add("d-none")
}

for (let checkbox of transportModesCheckboxes) {
    checkbox.addEventListener("input", function () {
        let index = transportModesCheckboxes.indexOf(checkbox)
        if (!checkbox.checked) {
            ratesValidityInputs[index].setAttribute("disabled", "true")
            ratesValidityInputs[index].value = ratesValidityInputs[index].children[0].value
            opt_ratesValidityFields[index].classList.add("d-none")
        } else {
            ratesValidityInputs[index].setAttribute("required", "true")
            ratesValidityInputs[index].removeAttribute("disabled")
            opt_ratesValidityFields[index].classList.remove("d-none")
        }
    })
}

window.addEventListener("load", function () {
    for (let checkbox of transportModesCheckboxes) {
        let index = transportModesCheckboxes.indexOf(checkbox)
        if (!checkbox.checked) {
            ratesValidityInputs[index].setAttribute("disabled", "true")
            ratesValidityInputs[index].value = ratesValidityInputs[index].children[0].value
            opt_ratesValidityFields[index].classList.add("d-none")
        } else {
            ratesValidityInputs[index].setAttribute("required", "true")
            ratesValidityInputs[index].removeAttribute("disabled")
            opt_ratesValidityFields[index].classList.remove("d-none")
        }
    }
})

// ---- Controling the requiered attribute of the History boxes
let historyBoxCheckedAmount = 0

for (let history of histories) {
    history.addEventListener("click", function () {
        if (history.checked === true) {
            historyBoxCheckedAmount += 1
        } else {
            historyBoxCheckedAmount -= 1
        }
        for (let history of histories) {
            if (historyBoxCheckedAmount > 0) { history.removeAttribute("required") }
            else { history.setAttribute("required", true) }
        }
    })
}

window.addEventListener("load", function () {
    // for (let history of histories) {
    //     history.checked = false
    // }
    for (let history of histories) {
        if (history.checked === true) {
            historyBoxCheckedAmount += 1
        } else {
            historyBoxCheckedAmount -= 1
        }
        for (let history of histories) {
            if (historyBoxCheckedAmount > 0) { history.removeAttribute("required") }
            else { history.setAttribute("required", true) }
        }
    }
})


// ---- Adding the requiered attribute of the Customer Segment radios if "Air & Ocean History" is checked
historyAirOcean.addEventListener("click", function () {
    for (let radio of customerSegmentRadios) {
        if (historyAirOcean.checked === true) {
            radio.setAttribute("required", true)
        }
        else {
            radio.removeAttribute("required")
        }
    }
})

window.addEventListener("load", function () {
    for (let radio of customerSegmentRadios) {
        if (historyAirOcean.checked === true) {
            radio.setAttribute("required", true)
        }
        else {
            radio.removeAttribute("required")
        }
    }
})


// ---- Controling the availability of customer segment radio depending on the customer history
const validationArray2 = []
const hasHistoryArray = ["historyAirOcean", "historyRoadFreight", "historyContractLog", "historyPortLog"]

for (let historyBox of historyBoxes) {
    historyBox.addEventListener("click", function () {
        if (historyBox.value === "historyNone" && historyBox.checked) {
            for (let historyBox of historyBoxes) {
                if (hasHistoryArray.includes(historyBox.value) && !historyBox.checked) {
                    historyBox.removeAttribute("required")
                }
            }
        }
        else if (historyBox.value === "historyNone" && !historyBox.checked) {
            for (let historyBox of historyBoxes) {
                if (hasHistoryArray.includes(historyBox.value)) {
                    historyBox.setAttribute("required", "true")
                }
            }
        }
        if (historyBox.checked && hasHistoryArray.includes(historyBox.value)) {
            validationArray2.push(historyBox.value)
            if (validationArray2.length > 0) {
                historyNone.setAttribute("disabled", "true")
                historyNone.checked = false
                for (let historyBox of historyBoxes) {
                    if (!historyBox.checked) {
                        historyBox.removeAttribute("required")
                    }
                }
            }
            for (let customerSegmentRadio of customerSegmentRadios) {
                if (historyAirOcean.checked) {
                    customerSegmentRadio.removeAttribute("disabled")
                    customerSegmentRadio.setAttribute("required", "true")
                } else {
                    customerSegmentRadio.setAttribute("disabled", "true")
                    customerSegmentRadio.removeAttribute("required")
                    customerSegmentRadio.checked = false
                }
            }
        } else if (!historyBox.checked && hasHistoryArray.includes(historyBox.value)) {
            let removalIndex = validationArray2.indexOf(historyBox.value)
            validationArray2.splice(removalIndex, 1)
            if (validationArray2.length === 0) {
                historyNone.removeAttribute("disabled")
                for (let historyBox of historyBoxes) {
                    historyBox.setAttribute("required", "true")
                }
            }
            else if (validationArray2.length > 0) {
                for (let historyBox of historyBoxes) {
                    if (!historyBox.checked) {
                        historyBox.removeAttribute("required")
                    }
                }
            }
            for (let customerSegmentRadio of customerSegmentRadios) {
                if (!historyAirOcean.checked) {
                    customerSegmentRadio.setAttribute("disabled", "true")
                    customerSegmentRadio.removeAttribute("required")
                    customerSegmentRadio.checked = false
                } else {
                    customerSegmentRadio.removeAttribute("disabled")
                    customerSegmentRadio.setAttribute("required", "true")
                }
            }
        }
    })
}

window.addEventListener("load", function () {
    if (!historyAirOcean.checked) {
        for (let customerSegmentRadio of customerSegmentRadios) {
            customerSegmentRadio.setAttribute("disabled", "true")
        }
    }

    for (let historyBox of historyBoxes) {
        if (historyBox.checked && hasHistoryArray.includes(historyBox.value)) {
            validationArray2.push(historyBox.value)
            if (validationArray2.length > 0) {
                historyNone.setAttribute("disabled", "true")
                historyNone.checked = false
                for (let historyBox of historyBoxes) {
                    if (!historyBox.checked && hasHistoryArray.includes(historyBox.value)) {
                        historyBox.removeAttribute("required")
                    }
                }
            }
        }
    }

    if (historyNone.checked) {
        for (let historyBox of historyBoxes) {
            if (hasHistoryArray.includes(historyBox.value)) {
                historyBox.checked = false
                historyBox.removeAttribute("required")
            }
        }
    }

})

// ---- Function to display the requiered question tile
let currentTile = 0

const adjustTileDisplay = function (button) {
    for (let tile of Array.from(allTiles)) {
        if (!tile.classList.contains("d-none")) {
            tile.classList.add("d-none")
        }
    }
    allTiles[currentTile].classList.remove("d-none")
    if (button === "nextBtn") {
        allTiles[currentTile].classList.add("animate__animated", "animate__fadeInRight", "animate__faster")
        allTiles[currentTile].addEventListener('animationend', () => {
            allTiles[currentTile].classList.remove("animate__animated", "animate__fadeInRight", "animate__faster")
        })
    } else if (button === "prevBtn") {
        allTiles[currentTile].classList.add("animate__animated", "animate__fadeInLeft", "animate__faster")
        allTiles[currentTile].addEventListener('animationend', () => {
            allTiles[currentTile].classList.remove("animate__animated", "animate__fadeInLeft", "animate__faster")
        })
    }
    for (let pageBtn of Array.from(allPageBtn)) {
        if (pageBtn.classList.contains("bg-secondary")) { pageBtn.classList.remove("bg-secondary", "bg-opacity-25") }
        if (Array.from(allPageBtn).indexOf(pageBtn) === currentTile) {
            pageBtn.classList.add("bg-secondary", "bg-opacity-25")
        }
    }
}

const tileValidation = function () {
    let tile = allTiles[currentTile]
    tile.classList.add('was-validated')
    let toBeValidated = tile.querySelectorAll(".form-select:not([disabled]), .form-control:not([disabled]), .form-check-input:not([disabled])")
    let fieldsAmount = toBeValidated.length
    let fieldsValidated = 0
    for (let i = 0; i < fieldsAmount; i++) {
        if (!toBeValidated[i].checkValidity()) {
            nextBtn.classList.remove("bg-secondary")
            nextBtn.classList.add("bg-danger", "animate__animated", "animate__shakeX", "animate__faster")
            setTimeout(() => {
                nextBtn.classList.remove("bg-danger", "animate__animated", "animate__shakeX", "animate__faster")
                nextBtn.classList.add("bg-secondary")
            }, 250);
            return false
        } else {
            fieldsValidated = fieldsValidated + 1
        }
    }
    if (fieldsValidated === fieldsAmount) {
        nextBtn.classList.remove("bg-secondary")
        nextBtn.classList.add("bg-success")
        setTimeout(() => {
            nextBtn.classList.remove("bg-success")
            nextBtn.classList.add("bg-secondary")
        }, 250);
        // console.log("The tile is validated.")
        return true
    }
}

const prevBtnPushed = function () {
    if (currentTile !== 0) {
        currentTile = currentTile - 1
        if (nextBtn.parentElement.classList.contains("disabled")) { nextBtn.parentElement.classList.remove("disabled") }
        document.querySelectorAll(".tile")[currentTile].classList.remove("was-validated")
        // console.log("Prev. button pushed")
        // console.log(`Current tile value: ${currentTile}`)
        if (currentTile === 0) {
            prevBtn.parentElement.classList.add("disabled")
            lead.parentElement.classList.remove("d-none")
            lead.parentElement.classList.add("animate__animated", "animate__fadeInLeft", "animate__faster")
        }
        adjustTileDisplay("prevBtn")
    }
    // else {
    //     console.log("Prev. button pushed, but cannot decrease")
    //     console.log(`Current tile value is min: ${currentTile}`)
    // }
}

const nextBtnPushed = function () {
    fieldsValidated = 0
    if (currentTile !== (Array.from(allTiles).length - 1)) {
        if (tileValidation()) {
            currentTile = currentTile + 1
            if (!lead.parentElement.classList.contains("d-none")) { lead.parentElement.classList.add("d-none") }
            if (prevBtn.parentElement.classList.contains("disabled")) { prevBtn.parentElement.classList.remove("disabled") }
            // console.log("Next button pushed")
            // console.log(`Current tile value: ${currentTile}`)
            if (currentTile === (Array.from(allTiles).length - 1)) { nextBtn.parentElement.classList.add("disabled") }
            if (form.classList.contains("was-validated")) { form.classList.remove("was-validated") }
            adjustTileDisplay("nextBtn")
        }
        // else {
        //     console.log("Tile is not validated")
        // }
    }
    // else {
    //     console.log("Next button pushed, but cannot increase")
    //     console.log(`Current tile value is max: ${currentTile}`)
    // }
}

prevBtn.addEventListener("click", prevBtnPushed)
nextBtn.addEventListener("click", nextBtnPushed)

// ---- Controling the display of each tile
let loadTileDisplay = function () {
    prevBtn.parentElement.classList.add("disabled")
    for (let tile of Array.from(allTiles)) {
        if (Array.from(allTiles).indexOf(tile) !== currentTile) {
            tile.classList.add("d-none")
        } else if (tile.classList.contains("d-none")) {
            tile.classList.remove("d-none")
        }
    }
}

window.addEventListener("load", loadTileDisplay())

// Date picker JS function
// ------ Below is a function to calculate days and dates in the future
const calculateDateAndTime = function (number, date) {
    let now = new Date(Date.now());
    if (!number || typeof number !== "number") {
        return now
    }
    let someDate
    if (!date) {
        someDate = new Date()
    } else {
        someDate = new Date(date)
    }
    let numberOfDaysToAdd = number;
    return new Date(now.setDate(someDate.getDate() + numberOfDaysToAdd));
};

let pickerDeadlineRFI = new easepick.create({
    element: "#deadlineRFI",
    css: [
        "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.0/dist/index.css"
    ],
    zIndex: 10,
    format: "DD MMM YYYY",
    grid: 2,
    calendars: 2,
    LockPlugin: {
        minDate: calculateDateAndTime(),
        maxDate: calculateDateAndTime(120)
    },
    plugins: [
        "LockPlugin"
    ]
})

let pickerReceptionDate = new easepick.create({
    element: "#receptionDate",
    css: [
        "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.0/dist/index.css"
    ],
    zIndex: 10,
    format: "DD MMM YYYY",
    grid: 2,
    calendars: 2,
    LockPlugin: {
        minDate: calculateDateAndTime(-60),
        maxDate: calculateDateAndTime(60)
    },
    plugins: [
        "LockPlugin"
    ]
})

let pickerDeadlineRFQ = new easepick.create({
    element: "#deadlineRFQ",
    css: [
        "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.0/dist/index.css"
    ],
    zIndex: 10,
    format: "DD MMM YYYY",
    grid: 2,
    calendars: 2,
    LockPlugin: {
        minDate: calculateDateAndTime(),
        maxDate: calculateDateAndTime(180)
    },
    plugins: [
        "LockPlugin"
    ]
})

let pickerDecisionDate = new easepick.create({
    element: "#decisionDate",
    css: [
        "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.0/dist/index.css"
    ],
    zIndex: 10,
    format: "DD MMM YYYY",
    grid: 2,
    calendars: 2,
    LockPlugin: {
        minDate: calculateDateAndTime(),
        maxDate: calculateDateAndTime(365)
    },
    plugins: [
        "LockPlugin"
    ]
})

let pickerStartBusinessDate = new easepick.create({
    element: "#startBusinessDate",
    css: [
        "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.0/dist/index.css"
    ],
    zIndex: 10,
    format: "DD MMM YYYY",
    grid: 2,
    calendars: 2,
    LockPlugin: {
        minDate: calculateDateAndTime(),
        maxDate: calculateDateAndTime(365)
    },
    plugins: [
        "LockPlugin"
    ]
})

// ------ Below is a function to get the value of the Reception date after input
//   receptionDate.addEventListener("input", function() {
//     let receptionDateValue = getValue(receptionDate)
//     if (getValue(deadlineRFQ)){
//         deadlineRFQ.value = null
//     }
//     pickerDeadlineRFQ = new easepick.create({
//         element: "#deadlineRFQ",
//         css: [
//             "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.0/dist/index.css"
//         ],
//         zIndex: 10,
//         format: "DD MMM YYYY",
//         grid: 2,
//         calendars: 2,
//         LockPlugin: {
//             minDate: calculateDateAndTime(1, receptionDateValue),
//             maxDate: calculateDateAndTime(180, receptionDateValue)
//         },
//         plugins: [
//             "LockPlugin"
//         ]
//     })
//   })

// ---- ---- Bootstrap form validation
const bootsrapValidation = function () {

    // ---- Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // ---- Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
}

mod_submitBtn.addEventListener("click", bootsrapValidation())
