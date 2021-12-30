// ---- ---- Import of country data
// const countriesData = require('./public/ressources/countries.json')

// ---- ---- Declaration of elements
const confirmBtn = document.querySelector("#confirmBtn")
const mod_submitBtn = document.querySelector("#mod_submitBtn")
const mod_cancelBtn = document.querySelector("#mod_cancelBtn")
const transportModeBoxes = document.querySelectorAll(".transportModeBox")
const transportModeVolumes = document.querySelectorAll(".transportModeVolume")
const keyTradelaneBoxes = document.querySelectorAll(".keyTradelaneBox")
const historyBoxes = document.querySelectorAll(".historyBox")
const customerSegmentRadios = document.querySelectorAll(".customerSegment")

// ---- ---- Declaration of values
const countryLocation = document.querySelector("#countryLocation")
const companyName = document.querySelector("#companyName")
const sugarID = document.querySelector("#sugarID")
const expectedReceiveDate = document.querySelector("#expectedReceiveDate")
const hasAirFreight = document.querySelector("#hasAirFreight")
const hasSeaFreightFCL = document.querySelector("#hasSeaFreightFCL")
const hasSeaFreightLCL = document.querySelector("#hasSeaFreightLCL")
const hasRailFreight = document.querySelector("#hasRailFreight")
const airFreightVol = document.querySelector("#airFreightVol")
const seaFreightFCLVol = document.querySelector("#seaFreightFCLVol")
const seaFreightLCLVol = document.querySelector("#seaFreightLCLVol")
const railFreightVol = document.querySelector("#railFreightVol")
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
const historyAirOcean = document.querySelector("#historyAirOcean")
const historyRoadFreight = document.querySelector("#historyRoadFreight")
const historyContractLog = document.querySelector("#historyContractLog")
const historyPortLog = document.querySelector("#historyPortLog")
const historyNone = document.querySelector("#historyNone")
const segmentA = document.querySelector("#segmentA")
const segmentB = document.querySelector("#segmentB")
const segmentC = document.querySelector("#segmentC")
const additionalComment = document.querySelector("#additionalComment")

// ---- ---- Declaration of modal values
const mod_countryLocation = document.querySelector("#mod_countryLocation")
const mod_companyName = document.querySelector("#mod_companyName")
const mod_sugarID = document.querySelector("#mod_sugarID")
const mod_expectedReceiveDate = document.querySelector("#mod_expectedReceiveDate")
const mod_hasAirFreight = document.querySelector("#mod_hasAirFreight")
const mod_hasSeaFreightFCL = document.querySelector("#mod_hasSeaFreightFCL")
const mod_hasSeaFreightLCL = document.querySelector("#mod_hasSeaFreightLCL")
const mod_hasRailFreight = document.querySelector("#mod_hasRailFreight")
const mod_airFreightVol = document.querySelector("#mod_airFreightVol")
const mod_seaFreightFCLVol = document.querySelector("#mod_seaFreightFCLVol")
const mod_seaFreightLCLVol = document.querySelector("#mod_seaFreightLCLVol")
const mod_railFreightVol = document.querySelector("#mod_railFreightVol")
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
const mod_existingCustomerSegment = document.querySelector("#mod_existingCustomerSegment")
const mod_additionalComment = document.querySelector("#mod_additionalComment")

// ---- ---- Declaration of reusable functions
const getValue = function(element){
    if (element.type === "checkbox") {
        return element.checked
    } else {
        return element.value
    }
}

const getNumericValue = function (element) {
    return Number(element.value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

// ---- ---- App functions
const launchModal = function () {
        mod_countryLocation.innerText = getValue(countryLocation)
        mod_companyName.innerText = getValue(companyName)
        mod_sugarID.innerText = getValue(sugarID)
        mod_expectedReceiveDate.innerText = getValue(expectedReceiveDate)
        if(getValue(hasAirFreight)){mod_hasAirFreight.innerText = "✅"} else {mod_hasAirFreight.innerText = "-"}
        if(getValue(hasSeaFreightFCL)){mod_hasSeaFreightFCL.innerText = "✅"} else {mod_hasSeaFreightFCL.innerText = "-"}
        if(getValue(hasSeaFreightLCL)){mod_hasSeaFreightLCL.innerText = "✅"} else {mod_hasSeaFreightLCL.innerText = "-"}
        if(getValue(hasRailFreight)){mod_hasRailFreight.innerText = "✅"} else {mod_hasRailFreight.innerText = "-"}
        mod_airFreightVol.innerText = `${getNumericValue(airFreightVol)} TEUs`
        mod_seaFreightFCLVol.innerText = `${getNumericValue(seaFreightFCLVol)} TEUs`
        mod_seaFreightLCLVol.innerText = `${getNumericValue(seaFreightLCLVol)} CBMs`
        mod_railFreightVol.innerText = `${getNumericValue(railFreightVol)} TEUs`
        if(getValue(africaToAmericas)){mod_africaToAmericas.innerText = "✅"} else {mod_africaToAfrica.innerText = "-"}
        if(getValue(africaToAmericas)){mod_africaToAmericas.innerText = "✅"} else {mod_africaToAmericas.innerText = "-"}
        if(getValue(africaToAsia)){mod_africaToAsia.innerText = "✅"} else {mod_africaToAsia.innerText = "-"}
        if(getValue(africaToEurope)){mod_africaToEurope.innerText = "✅"} else {mod_africaToEurope.innerText = "-"}
        if(getValue(africaToOceania)){mod_africaToOceania.innerText = "✅"} else {mod_africaToOceania.innerText = "-"}
        if(getValue(americasToAfrica)){mod_americasToAfrica.innerText = "✅"} else {mod_americasToAfrica.innerText = "-"}
        if(getValue(americasToAmericas)){mod_americasToAmericas.innerText = "✅"} else {mod_americasToAmericas.innerText = "-"}
        if(getValue(americasToAsia)){mod_americasToAsia.innerText = "✅"} else {mod_americasToAsia.innerText = "-"}
        if(getValue(americasToEurope)){mod_americasToEurope.innerText = "✅"} else {mod_americasToEurope.innerText = "-"}
        if(getValue(americasToOceania)){mod_americasToOceania.innerText = "✅"} else {mod_americasToOceania.innerText = "-"}
        if(getValue(asiaToAfrica)){mod_asiaToAfrica.innerText = "✅"} else {mod_asiaToAfrica.innerText = "-"}
        if(getValue(asiaToAmericas)){mod_asiaToAmericas.innerText = "✅"} else {mod_asiaToAmericas.innerText = "-"}
        if(getValue(asiaToAsia)){mod_asiaToAsia.innerText = "✅"} else {mod_asiaToAsia.innerText = "-"}
        if(getValue(asiaToEurope)){mod_asiaToEurope.innerText = "✅"} else {mod_asiaToEurope.innerText = "-"}
        if(getValue(asiaToOceania)){mod_asiaToOceania.innerText = "✅"} else {mod_asiaToOceania.innerText = "-"}   
        if(getValue(europeToAfrica)){mod_europeToAfrica.innerText = "✅"} else {mod_europeToAfrica.innerText = "-"}   
        if(getValue(europeToAmericas)){mod_europeToAmericas.innerText = "✅"} else {mod_europeToAmericas.innerText = "-"}   
        if(getValue(europeToAsia)){mod_europeToAsia.innerText = "✅"} else {mod_europeToAsia.innerText = "-"}   
        if(getValue(europeToEurope)){mod_europeToEurope.innerText = "✅"} else {mod_europeToEurope.innerText = "-"}   
        if(getValue(europeToOceania)){mod_europeToOceania.innerText = "✅"} else {mod_europeToOceania.innerText = "-"}   
        if(getValue(oceaniaToAfrica)){mod_oceaniaToAfrica.innerText = "✅"} else {mod_oceaniaToAfrica.innerText = "-"}   
        if(getValue(oceaniaToAmericas)){mod_oceaniaToAmericas.innerText = "✅"} else {mod_oceaniaToAmericas.innerText = "-"}   
        if(getValue(oceaniaToAsia)){mod_oceaniaToAsia.innerText = "✅"} else {mod_oceaniaToAsia.innerText = "-"}
        if(getValue(oceaniaToEurope)){mod_oceaniaToEurope.innerText = "✅"} else {mod_oceaniaToEurope.innerText = "-"}
        if(getValue(oceaniaToOceania)){mod_oceaniaToOceania.innerText = "✅"} else {mod_oceaniaToOceania.innerText = "-"}
        if (getValue(segmentA)) {mod_existingCustomerSegment.innerText = "A-customer"} else if (getValue(segmentB)) {mod_existingCustomerSegment.innerText = "B-customer"} else if (getValue(segmentC)) {mod_existingCustomerSegment.innerText = "C-customer"} else {mod_existingCustomerSegment.innerText = "-"}
        if (getValue(additionalComment)) {mod_additionalComment.innerText = getValue(additionalComment)} else {mod_additionalComment.innerText = "-"}
}


// ---- ---- Event Listener functions
// ---- Controling the launch of the confirmation modal.
confirmBtn.addEventListener("click", function (event) {event.preventDefault(), launchModal()})

// ---- Controling the availability of volume fields depending on the transport mode selected.
for (let transportModeBox of transportModeBoxes) {
    transportModeBox.addEventListener("click", function () {
        if (!transportModeBox.checked) {
            var array = Array.from(transportModeBoxes);
            let index = array.indexOf(transportModeBox)
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
            transportModeVolumes[index].setAttribute("disabled", "true")
        } else {
            var array = Array.from(transportModeBoxes);
            let index = array.indexOf(transportModeBox)
            transportModeVolumes[index].removeAttribute("disabled")
        }
    }
})

// ---- Controling the availability of customer segment radio depending on the customer history.
const validationArray = []
const hasHistoryArray = ["historyAirOcean","historyRoadFreight","historyContractLog","historyPortLog"]

for (let historyBox of historyBoxes) {
    historyBox.addEventListener("click", function () {
        if (historyBox.checked && hasHistoryArray.includes(historyBox.value)) {
            validationArray.push(historyBox.value)
            if (validationArray.length > 0) {document.querySelector("#historyNone").setAttribute("disabled", "true"), document.querySelector("#historyNone").checked = false}
            for (let customerSegmentRadio of customerSegmentRadios) {
                if (historyAirOcean.checked) {
                    customerSegmentRadio.removeAttribute("disabled")
                } else {
                    customerSegmentRadio.setAttribute("disabled", "true")
                    customerSegmentRadio.checked = false
                }
            }
        } else if (!historyBox.checked && hasHistoryArray.includes(historyBox.value)) {
            let removalIndex = validationArray.indexOf(historyBox.value)
            validationArray.splice(removalIndex, 1)
            if (validationArray.length === 0) {document.querySelector("#historyNone").removeAttribute("disabled")}
            for (let customerSegmentRadio of customerSegmentRadios) {
                if (!historyAirOcean.checked) {
                    customerSegmentRadio.setAttribute("disabled", "true")
                    customerSegmentRadio.checked = false
                } else {
                    customerSegmentRadio.removeAttribute("disabled")
                }
            }
        }
    })
}

window.addEventListener("load", function () {
    for (let customerSegmentRadio of customerSegmentRadios) {
            customerSegmentRadio.setAttribute("disabled", "true")
    }
    for (let historyBox of historyBoxes) {
        historyBox.checked = false
    }
})
