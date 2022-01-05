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
const mod_rhenusHistory = document.querySelector("#mod_rhenusHistory")
const mod_existingCustomerSegment = document.querySelector("#mod_existingCustomerSegment")
const mod_additionalComment = document.querySelector("#mod_additionalComment")

// Declaration of Arrays
const transportModesCheckboxes = [hasAirFreight, hasSeaFreightFCL, hasSeaFreightLCL, hasRailFreight]
const transportModesVolumes = [airFreightVol, seaFreightFCLVol, seaFreightLCLVol, railFreightVol]
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

// ---- ---- Declaration of reusable functions
// ---- Function to get the filds .value or the checkbox .checked
const getValue = function(element){
    if (element.type === "checkbox" || element.type === "radio") {
        return element.checked
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
        return "-"}
}


// ---- ---- App functions
const launchModal = function () {
    const addingModalTriggers = function () {
        confirmBtn.setAttribute("data-bs-toggle", "modal")
        confirmBtn.setAttribute("data-bs-target","#staticBackdrop")
    }

    const addingModalFields = function () {
        mod_companyName.innerText = getValue(companyName)
        mod_sugarID.innerText = getValue(sugarID)
        mod_expectedReceiveDate.innerText = getValue(expectedReceiveDate)
        if(getValue(hasAirFreight)){mod_hasAirFreight.innerHTML = "✅"} else {mod_hasAirFreight.innerText = "-"}
        if(getValue(hasSeaFreightFCL)){mod_hasSeaFreightFCL.innerText = "✅"} else {mod_hasSeaFreightFCL.innerText = "-"}
        if(getValue(hasSeaFreightLCL)){mod_hasSeaFreightLCL.innerText = "✅"} else {mod_hasSeaFreightLCL.innerText = "-"}
        if(getValue(hasRailFreight)){mod_hasRailFreight.innerText = "✅"} else {mod_hasRailFreight.innerText = "-"}
        mod_airFreightVol.innerText = getVolume(airFreightVol, "Tons")
        mod_seaFreightFCLVol.innerText = getVolume(seaFreightFCLVol, "TEUs")
        mod_seaFreightLCLVol.innerText = getVolume(seaFreightLCLVol, "CBMs")
        mod_railFreightVol.innerText = getVolume(railFreightVol, "TEUs")
        if(getValue(africaToAfrica)){mod_africaToAfrica.innerText = "✅"} else {mod_africaToAfrica.innerText = "-"}
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
        if(getValue(segmentA)) {mod_existingCustomerSegment.innerText = "A-customer"} else if (getValue(segmentB)) {mod_existingCustomerSegment.innerText = "B-customer"} else if (getValue(segmentC)) {mod_existingCustomerSegment.innerText = "C-customer"} else {mod_existingCustomerSegment.innerText = "-"}
        if(getValue(additionalComment)) {mod_additionalComment.innerText = getValue(additionalComment)} else {mod_additionalComment.innerText = "-"}

// ---- Special display for Country registering the pre-advise

        const adjustmod_countryLocation = async function () { 
                try { 
                        const result = await axios.get("../../ressources/countries.json")
                    const countriesData = result.data
                    let matchingCountry = null
                    for (let country of countriesData) {
                        if (country.cca2 === getValue(countryLocation)) {
                            mod_countryLocation.innerText =  `${country.cca2} - ${country.name.common} ${country.flag}`
                        }
                    }
                    }
                catch (err) {
                    console.log("Oh no ! There's an error !", err) 
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
    let forms = document.querySelectorAll('.needs-validation')
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
            console.log("The form is validated.")
        } else {
            console.log("The form is not validated.")
            confirmBtn.classList.remove("btn-primary")
            confirmBtn.classList.add("btn-danger", "animate__animated", "animate__shakeX", "animate__faster")
            setTimeout(() => {
                confirmBtn.classList.remove("btn-danger", "animate__animated", "animate__shakeX", "animate__faster")
                confirmBtn.classList.add("btn-primary") 
            }, 250);
        }
    }
}

confirmBtn.addEventListener("click", function (event) {event.preventDefault(), formValidation()})

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
// ---- NOTE: In practice it is working, but I noticed some descrpencies in the way the requiered attribute is set. In practice this should note lead to bugs.
const validationArray1 = []

for (let transportModesCheckbox of transportModesCheckboxes) {
    transportModesCheckbox.addEventListener("click", function () {
        let index = transportModesCheckboxes.indexOf(transportModesCheckbox)
        if (transportModesCheckbox.checked){
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
            validationArray1.splice(indexToDelete,1)
            if(validationArray1.length === 0) {
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
                    if (transportModesCheckbox2.check) {
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
        transportModesCheckbox.checked = false
    }
    for (let transportModesVolume of transportModesVolumes) {
        transportModesVolume.value = null
        transportModesVolume.setAttribute("disabled", true)
    }
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
            if (lanesBoxCheckedAmount > 0) {route.removeAttribute("required")}
            else {route.setAttribute("required", true)}
        }
    })
}

window.addEventListener("load", function () {
    for (let route of routes) {
        route.checked = false
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
            if (historyBoxCheckedAmount > 0) {history.removeAttribute("required")}
            else {history.setAttribute("required", true)}
        }
    })
}

window.addEventListener("load", function () {
    for (let history of histories) {
        history.checked = false
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


// ---- Controling the availability of customer segment radio depending on the customer history
const validationArray2 = []
const hasHistoryArray = ["historyAirOcean","historyRoadFreight","historyContractLog","historyPortLog"]

for (let historyBox of historyBoxes) {
    historyBox.addEventListener("click", function () {
        if (historyBox.checked && hasHistoryArray.includes(historyBox.value)) {
            validationArray2.push(historyBox.value)
            if (validationArray2.length > 0) {document.querySelector("#historyNone").setAttribute("disabled", "true"), document.querySelector("#historyNone").checked = false}
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
            if (validationArray2.length === 0) {document.querySelector("#historyNone").removeAttribute("disabled")}
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
    for (let customerSegmentRadio of customerSegmentRadios) {
            customerSegmentRadio.setAttribute("disabled", "true")
    }
    for (let historyBox of historyBoxes) {
        historyBox.checked = false
    }
    for (let historyBox of historyBoxes) {
        historyBox.checked = false
    }
    for (let radio of customerSegmentRadios) {
        radio.checked = false
    }
})

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