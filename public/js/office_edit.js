// ---- ---- Declaration of elements
// ---- Declaration of form & page elements
const confirmBtn = document.querySelector("#confirmBtn")
const countryLocation = document.querySelector("#countryLocation")
const companyName = document.querySelector("#companyName")
const address = document.querySelector("#address")
const city = document.querySelector("#city")
const postCode = document.querySelector("#postCode")
const countryName = document.querySelector("#countryName")
const lat = document.querySelector("#lat")
const lng = document.querySelector("#lng")
const rhenusSetup = document.querySelector("#rhenusSetup")
const agentSetup = document.querySelector("#agentSetup")
const tenderDesk = document.querySelector("#tenderDesk")
// ---- Declaration of modal elements
const mod_submitBtn = document.querySelector("#mod_submitBtn")
const mod_countryLocationcca2 = document.querySelector("#mod_countryLocationcca2")
const mod_countryLocation = document.querySelector("#mod_countryLocation")
const mod_companyName = document.querySelector("#mod_companyName")
const mod_address = document.querySelector("#mod_address")
const mod_city = document.querySelector("#mod_city")
const mod_postCode = document.querySelector("#mod_postCode")
const mod_countryName = document.querySelector("#mod_countryName")
const mod_coordinates = document.querySelector("#mod_coordinates")
const mod_mapsLink = document.querySelector("#mod_mapsLink")
const mod_officeSetup = document.querySelector("#mod_officeSetup")
const mod_tenderDesk = document.querySelector("#mod_tenderDesk")

// ---- ---- Declaration of reusable objects
const tenderDeskNames = {
    ap: "Asia Pacific tender desk",
    eu: "Europe tender desk",
    am: "Americas tender desk"
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

// ---- ---- App functions
// ---- Modal functions
const launchModal = function () {
    const addingModalTriggers = function () {
        confirmBtn.setAttribute("data-bs-toggle", "modal")
        confirmBtn.setAttribute("data-bs-target","#staticBackdrop")
    }

    const addingModalFields = function () {

        mod_companyName.innerText = getValue(companyName)
        mod_address.innerText = getValue(address)
        mod_city.innerText = getValue(city)
        mod_postCode.innerText = getValue(postCode)
        mod_countryName.innerText = getValue(countryName)
        mod_coordinates.innerText = `${getValue(lat)}, ${getValue(lng)}`
        mod_mapsLink.href = `http://www.google.com/maps/place/${getValue(lat)},${getValue(lng)}`
        if (rhenusSetup.checked) {mod_officeSetup.innerText = "Rhenus office"}
        else if (agentSetup.checked) {mod_officeSetup.innerText = "Agent office"}
        mod_tenderDesk.innerText = tenderDeskNames[`${getValue(tenderDesk)}`]

        // ---- Special display for Country registering the pre-advise
        const adjustmod_countryLocation = async function () { 
                try { 
                    const result = await axios.get("../../../ressources/countries.json")
                    const countriesData = result.data
                    for (let country of countriesData) {
                        if (country.cca2 === getValue(countryLocation)) {
                            mod_countryLocationcca2.innerText = `${country.cca2}`
                            mod_countryLocation.innerText =  `${country.name.common} ${country.flag}`
                        }
                    }
                    }
                catch (err) {
                    console.log("Oh no ! There's an error !", err) 
                } 
        }
        adjustmod_countryLocation()


    }

    const removeModalTriggers = function () {
        confirmBtn.removeAttribute("data-bs-toggle")
        confirmBtn.removeAttribute("data-bs-target")
    }
    
    addingModalTriggers()
    confirmBtn.click()
    addingModalFields()
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
