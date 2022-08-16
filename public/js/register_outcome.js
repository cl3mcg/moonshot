// Declaration of the page contents variables
const formTile = document.querySelector(".tab-content")
const outcomeNewProviderUnknownCheckBox = document.querySelector("#outcomeNewProviderUnknown")
const allGradeBadges = document.querySelectorAll(".badge")
const allRangeInputs = document.querySelectorAll(".form-range")
const positiveOutcomePill = document.querySelector("#positiveOutcomePill")

// Declaration of Madal trigger confirm buttons
const positiveConfirmBtn = document.querySelector("#positiveConfirmBtn")
const negativeConfirmBtn = document.querySelector("#negativeConfirmBtn")
const unknwownConfirmBtn = document.querySelector("#unknwownConfirmBtn")

// Declaration of the inputs variables
// Related to a Positive outcome form
const pos_partialOutcomeRadio = document.querySelector("#positivePartialOutcomeRadio")
const pos_fullOutcomeRadio = document.querySelector("#positiveFullOutcomeRadio")
const pos_awardVolumeSplitRegion = document.querySelector("#outcomeAwardVolumeSplitRegion")
const pos_awardVolumeSplitCountry = document.querySelector("#outcomeAwardVolumeSplitCountry")
const pos_awardVolumeSplitTransportMode = document.querySelector("#outcomeAwardVolumeSplitTransportMode")
const pos_awardVolumeSplitFlowDirection = document.querySelector("#outcomeAwardVolumeSplitFlowDirection")
const pos_awardVolumeCompanyEntity = document.querySelector("#outcomeAwardVolumeCompanyEntity")
const pos_awardVolumeOthers = document.querySelector("#outcomeAwardVolumeOthers")
const pos_awardReceiveDate = document.querySelector("#awardReceiveDate")
const pos_expectedBusinessStartDate = document.querySelector("#expectedBusinessStartDate")
const pos_outcomeExpectedTurnover = document.querySelector("#outcomeExpectedTurnover")
const pos_outcomeExpectedAirfreightVol = document.querySelector("#outcomeExpectedAirfreightVol")
const pos_outcomeExpectedSeafreightFCLVol = document.querySelector("#outcomeExpectedSeafreightFCLVol")
const pos_outcomeExpectedSeafreightLCLVol = document.querySelector("#outcomeExpectedSeafreightLCLVol")
const pos_outcomeExpectedRailfreightFCLVol = document.querySelector("#outcomeExpectedRailfreightFCLVol")
const pos_outcomeAdditionalComment = document.querySelector("#posOutcomeAdditionalComment")
// Related to the positive outcome modal
const mod_pos_awardResult = document.querySelector("#mod_positive_awardResult")
const mod_pos_volumeSplit = document.querySelector("#mod_positive_volumeSplit")
const mod_pos_expectedReceiveDate = document.querySelector("#mod_positive_expectedReceiveDate")
const mod_pos_expectedBusinessStart = document.querySelector("#mod_positive_expectedBusinessStart")
const mod_pos_expectedTurnover = document.querySelector("#mod_positive_expectedTurnover")
const mod_pos_expectedAirfreightVol = document.querySelector("#mod_positive_expectedAirfreightVol")
const mod_pos_expectedSeafreightFCLVol = document.querySelector("#mod_positive_expectedSeafreightFCLVol")
const mod_pos_expectedSeafreightLCLVol = document.querySelector("#mod_positive_expectedSeafreightLCLVol")
const mod_pos_expectedRailfreightFCLVol = document.querySelector("#mod_positive_expectedRailfreightFCLVol")
const mod_pos_additionalComments = document.querySelector("#mod_positive_additionalComments")
// Related to a negative outcome form
const neg_outcomeChangeProviderTrue = document.querySelector("#outcomeChangeProviderTrue")
const neg_outcomeChangeProviderFalse = document.querySelector("#outcomeChangeProviderFalse")
const neg_outcomeChangeProviderUnknown = document.querySelector("#outcomeChangeProviderUnknown")
const neg_outcomePricingComment = document.querySelector("#outcomePricingComment")
const neg_outcomeITComment = document.querySelector("#outcomeITComment")
const neg_outcomeNetworkComment = document.querySelector("#outcomeNetworkComment")
const neg_outcomeConceptComment = document.querySelector("#outcomeConceptComment")
const neg_outcomeImprovementComment = document.querySelector("#outcomeImprovementComment")
const neg_outcomeNextStepsComment = document.querySelector("#outcomeNextStepsComment")
const neg_outcomePreparationComment = document.querySelector("#outcomePreparationComment")
const neg_outcomePricingPonderation = document.querySelector("#outcomePricingPonderation")
const neg_outcomeTransitTimePonderation = document.querySelector("#outcomeTransitTimePonderation")
const neg_outcomeScopeResponsePonderation = document.querySelector("#outcomeScopeResponsePonderation")
const neg_outcomeRelationshipPonderation = document.querySelector("#outcomeRelationshipPonderation")
const neg_outcomeNetworkCoveragePonderation = document.querySelector("#outcomeNetworkCoveragePonderation")
const neg_outcomeValueAddedServicesPonderation = document.querySelector("#outcomeValueAddedServicesPonderation")
const neg_outcomeITSolutionsPonderation = document.querySelector("#outcomeITSolutionsPonderation")
const neg_outcomeOverallConceptPonderation = document.querySelector("#outcomeOverallConceptPonderation")
const neg_outcomeNewProvider = document.querySelector("#outcomeNewProvider")
const neg_outcomeNewProviderUnknown = document.querySelector("#outcomeNewProviderUnknown")
const neg_outcomeAdditionalComment = document.querySelector("#negOutcomeAdditionalComment")
// Related to the negative outcome modal
const mod_neg_changeProvider = document.querySelector("#mod_negative_changeProvider")
const mod_neg_pricingComment = document.querySelector("#mod_negative_pricingComment")
const mod_neg_ITComment = document.querySelector("#mod_negative_ITComment")
const mod_neg_networkComment = document.querySelector("#mod_negative_networkComment")
const mod_neg_conceptComment = document.querySelector("#mod_negative_conceptComment")
const mod_neg_improvementComment = document.querySelector("#mod_negative_improvementComment")
const mod_neg_nextStepsComment = document.querySelector("#mod_negative_nextStepsComment")
const mod_neg_preparationComment = document.querySelector("#mod_negative_preparationComment")
const mod_neg_pricingPonderationBar = document.querySelector("#mod_negative_pricingPonderationBar")
const mod_neg_pricingPonderation = document.querySelector("#mod_negative_pricingPonderation")
const mod_neg_transitTimePonderationBar = document.querySelector("#mod_negative_transitTimePonderationBar")
const mod_neg_transitTimePonderation = document.querySelector("#mod_negative_transitTimePonderation")
const mod_neg_scopeResponsePonderationBar = document.querySelector("#mod_negative_scopeResponsePonderationBar")
const mod_neg_scopeResponsePonderation = document.querySelector("#mod_negative_scopeResponsePonderation")
const mod_neg_relationshipPonderationBar = document.querySelector("#mod_negative_relationshipPonderationBar")
const mod_neg_relationshipPonderation = document.querySelector("#mod_negative_relationshipPonderation")
const mod_neg_networkCoveragePonderationBar = document.querySelector("#mod_negative_networkCoveragePonderationBar")
const mod_neg_networkCoveragePonderation = document.querySelector("#mod_negative_networkCoveragePonderation")
const mod_neg_valueAddedServicesPonderationBar = document.querySelector("#mod_negative_valueAddedServicesPonderationBar")
const mod_neg_valueAddedServicesPonderation = document.querySelector("#mod_negative_valueAddedServicesPonderation")
const mod_neg_ITSolutionsPonderationBar = document.querySelector("#mod_negative_ITSolutionsPonderationBar")
const mod_neg_ITSolutionsPonderation = document.querySelector("#mod_negative_ITSolutionsPonderation")
const mod_neg_overallConceptPonderationBar = document.querySelector("#mod_negative_overallConceptPonderationBar")
const mod_neg_overallConceptPonderation = document.querySelector("#mod_negative_overallConceptPonderation")
const mod_neg_outcomeNewProvider = document.querySelector("#mod_negative_outcomeNewProvider")
const mod_neg_additionalComments = document.querySelector("#mod_negative_additionalComments")
// Related to the unknown outcome form
const unk_outcomeAdditionalComment = document.querySelector("#unkOutcomeAdditionalComment")
// Related to the unknown outcome modal
const mod_unk_additionalComment = document.querySelector("#mod_unknown_additionalComment")


// Useful functions
// Function that takes a string or a number and returns a string with the number formatted with commas
const formatNumber = function (number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Function used to get the value of an text input field
const valueOf = function (inputField) {
    if (!inputField.value) {
        return null
    }
    return inputField.value
}

// Function to provide the value of the "Total win" or "Partial win" radio buttons
const pos_outcomeTenderValue = function () {
    if (positivePartialOutcomeRadio.checked) {
        return "Partial win"
    } else if (positiveFullOutcomeRadio.checked) {
        return "Total win"
    } else {
        return false
    }
}

// Function used to display confetti animation when user clicks on positive outcome
positiveOutcomePill.addEventListener("click", function () {
    party.confetti(this, {
        count: 80,
        spread: 50,
        size: 1.3,
    });
});

// Function used to display the award split method
const displayVolSplit = function () {
    let awardVolSplitDisplay = []
    let awardSplitMethodsInputs = [
        pos_awardVolumeSplitRegion,
        pos_awardVolumeSplitCountry,
        pos_awardVolumeSplitTransportMode,
        pos_awardVolumeSplitFlowDirection,
        pos_awardVolumeCompanyEntity,
        pos_awardVolumeOthers
    ]
    for (let input of awardSplitMethodsInputs) {
        if (input.checked) {
            awardVolSplitDisplay.push(input.nextElementSibling.innerText)
        }
    }
    // console.log(awardVolSplitDisplay)
    return awardVolSplitDisplay.join(", ")
}

// Function to set the progress bar filled with the poderation value
const setProgressBar = function (ponderationBar, ponderationInput) {
    ponderationBar.removeAttribute("style")
    ponderationBar.setAttribute("style", `width: ${valueOf(ponderationInput) * 10}%`)
    ponderationBar.firstElementChild.innerText = `${valueOf(ponderationInput)}/10`
}

// Function used on page load
document.addEventListener("DOMContentLoaded", function () {
    // Function used to hide the various outcome tiles on page load
    formTile.classList.add("visually-hidden")

    let pills = document.querySelectorAll(".navPill")

    if (formTile.classList.contains("visually-hidden")) {
        for (let pill of pills) {
            pill.addEventListener("click", function () {
                let formTile = document.querySelector(".tab-content")
                formTile.classList.remove("visually-hidden")
            })
        }
    }
    // Function used setup the negative outcome grading on page load
    for (let rangeInput of allRangeInputs) {
        if (rangeInput.value < 10) {
            rangeInput.previousElementSibling.innerText = `0${rangeInput.value}/10`
        } else {
            rangeInput.previousElementSibling.innerText = `${rangeInput.value}/10`
        }
    }

})

// Function used to control the required attribute of the volume split checkboxes
const volSplitBoxes = [
    pos_awardVolumeSplitRegion,
    pos_awardVolumeSplitCountry,
    pos_awardVolumeSplitTransportMode,
    pos_awardVolumeSplitFlowDirection,
    pos_awardVolumeCompanyEntity,
    pos_awardVolumeOthers
]

let volSplitBoxCheckedAmount = 0

for (let box of volSplitBoxes) {
    box.addEventListener("click", function () {
        if (box.checked === true) {
            volSplitBoxCheckedAmount += 1
        } else {
            volSplitBoxCheckedAmount -= 1
        }
        for (let box of volSplitBoxes) {
            if (volSplitBoxCheckedAmount > 0) { box.removeAttribute("required") }
            else { box.setAttribute("required", true) }
        }
    })
}

// Function used to control the required attribute of the volume awarded fields
const checkVolAwardFields = function () {
    const volAwardFields = [
        pos_outcomeExpectedAirfreightVol,
        pos_outcomeExpectedSeafreightFCLVol,
        pos_outcomeExpectedSeafreightLCLVol,
        pos_outcomeExpectedRailfreightFCLVol
    ]

    let volAwardFieldsAmount = 0

    for (let field of volAwardFields) {
        if (field.value !== "") {
            volAwardFieldsAmount += 1
        }
        for (let field of volAwardFields) {
            if (volAwardFieldsAmount > 0) { field.removeAttribute("required") }
            else { field.setAttribute("required", true) }
        }
    }
}


// Function used to disble the "Service Provider Awarded" input in the "Unknown" checkbox is checked
outcomeNewProviderUnknownCheckBox.addEventListener("input", function () {
    if (outcomeNewProviderUnknownCheckBox.checked) {
        document.querySelector("#outcomeNewProvider").setAttribute("disabled", true)
    } else {
        document.querySelector("#outcomeNewProvider").removeAttribute("disabled")
    }
})
// Function used to adjust the negative outlook grading
for (let rangeInput of allRangeInputs) {
    rangeInput.addEventListener("input", function () {
        if (rangeInput.value < 10) {
            rangeInput.previousElementSibling.innerText = `0${rangeInput.value}/10`
        } else {
            rangeInput.previousElementSibling.innerText = `${rangeInput.value}/10`
        }
    })
}

//Function used to launch the modal
const launchModal = function (confirmBtn) {
    const addingModalTriggers = function () {
        confirmBtn.setAttribute("data-bs-toggle", "modal")
        switch (confirmBtn.id) {
            case "positiveConfirmBtn":
                confirmBtn.setAttribute("data-bs-target", "#positiveOutcomeConfirmModal")
                break;
            case "negativeConfirmBtn":
                confirmBtn.setAttribute("data-bs-target", "#negativeOutcomeConfirmModal")
                break;
            case "unknwownConfirmBtn":
                confirmBtn.setAttribute("data-bs-target", "#unknownOutcomeConfirmModal")
                break;
        }
    }
    const removeModalTriggers = function () {
        confirmBtn.removeAttribute("data-bs-toggle")
        confirmBtn.removeAttribute("data-bs-target")
    }
    addingModalTriggers()
    confirmBtn.click()
    removeModalTriggers()
}

//Function used to check the form validation
const formValidation = function (confirmBtn) {
    let form = confirmBtn.parentElement.previousElementSibling
    form.classList.add('was-validated')
    if (form.checkValidity()) {
        confirmBtn.classList.remove("btn-primary")
        confirmBtn.classList.add("btn-success")
        setTimeout(() => {
            confirmBtn.classList.remove("btn-success")
            confirmBtn.classList.add("btn-primary")
        }, 250);
        // console.log("The form is validated.")
        launchModal(confirmBtn)
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

// Function used to trigger the positive outcome modal
positiveConfirmBtn.addEventListener("click", function () {
    checkVolAwardFields()
    formValidation(this)
    mod_pos_awardResult.innerText = pos_outcomeTenderValue()
    mod_pos_volumeSplit.innerText = displayVolSplit()
    // Format the date valueOf(pos_awardReceiveDate) under the format dd-MMM-yyyy
    let date = new Date(valueOf(pos_awardReceiveDate))
    let dateFormatted = `${date.getDate()}-${date.toLocaleString("en-US", { month: "short" })}-${date.getFullYear()}`
    mod_pos_expectedReceiveDate.innerText = dateFormatted
    // Format the date valueOf(pos_expectedBusinessStartDate) under the format dd-MMM-yyyy
    let date2 = new Date(valueOf(pos_expectedBusinessStartDate))
    let dateFormatted2 = `${date2.getDate()}-${date2.toLocaleString("en-US", { month: "short" })}-${date2.getFullYear()}`
    mod_pos_expectedBusinessStart.innerText = dateFormatted2
    mod_pos_expectedTurnover.innerText = valueOf(pos_outcomeExpectedTurnover)
    if (!valueOf(pos_outcomeExpectedAirfreightVol)) { mod_pos_expectedAirfreightVol.innerText = "None" } else { mod_pos_expectedAirfreightVol.innerText = `${formatNumber(valueOf(pos_outcomeExpectedAirfreightVol))} Tons` }
    if (!valueOf(pos_outcomeExpectedSeafreightFCLVol)) { mod_pos_expectedSeafreightFCLVol.innerText = "None" } else { mod_pos_expectedSeafreightFCLVol.innerText = `${formatNumber(valueOf(pos_outcomeExpectedSeafreightFCLVol))} TEUs` }
    if (!valueOf(pos_outcomeExpectedSeafreightLCLVol)) { mod_pos_expectedSeafreightLCLVol.innerText = "None" } else { mod_pos_expectedSeafreightLCLVol.innerText = `${formatNumber(valueOf(pos_outcomeExpectedSeafreightLCLVol))} CBMs` }
    if (!valueOf(pos_outcomeExpectedRailfreightFCLVol)) { mod_pos_expectedRailfreightFCLVol.innerText = "None" } else { mod_pos_expectedRailfreightFCLVol.innerText = `${formatNumber(valueOf(pos_outcomeExpectedRailfreightFCLVol))} TEUs` }
    mod_pos_additionalComments.innerText = valueOf(pos_outcomeAdditionalComment)
})
// Function used to trigger the negative outcome modal
negativeConfirmBtn.addEventListener("click", function () {
    formValidation(this)
    switch (document.querySelector('input[name="outcomeChangeProvider"]:checked').value) {
        case "yes":
            mod_negative_changeProvider.innerText = "Yes"
            break;
        case "no":
            mod_negative_changeProvider.innerText = "No"
            break;
        case "unknown":
            mod_negative_changeProvider.innerText = "Unknown"
            break;
    }
    mod_neg_pricingComment.innerText = valueOf(neg_outcomePricingComment)
    mod_neg_ITComment.innerText = valueOf(neg_outcomeITComment)
    mod_neg_networkComment.innerText = valueOf(neg_outcomeNetworkComment)
    mod_neg_conceptComment.innerText = valueOf(neg_outcomeConceptComment)
    mod_neg_improvementComment.innerText = valueOf(neg_outcomeImprovementComment)
    mod_neg_nextStepsComment.innerText = valueOf(neg_outcomeNextStepsComment)
    mod_neg_preparationComment.innerText = valueOf(neg_outcomePreparationComment)
    mod_neg_preparationComment.innerText = valueOf(neg_outcomePreparationComment)
    setProgressBar(mod_neg_pricingPonderationBar, neg_outcomePricingPonderation)
    setProgressBar(mod_neg_transitTimePonderationBar, neg_outcomeTransitTimePonderation)
    setProgressBar(mod_neg_scopeResponsePonderationBar, neg_outcomeScopeResponsePonderation)
    setProgressBar(mod_neg_relationshipPonderationBar, neg_outcomeRelationshipPonderation)
    setProgressBar(mod_neg_networkCoveragePonderationBar, neg_outcomeNetworkCoveragePonderation)
    setProgressBar(mod_neg_valueAddedServicesPonderationBar, neg_outcomeValueAddedServicesPonderation)
    setProgressBar(mod_neg_valueAddedServicesPonderationBar, neg_outcomeValueAddedServicesPonderation)
    setProgressBar(mod_neg_ITSolutionsPonderationBar, neg_outcomeITSolutionsPonderation)
    setProgressBar(mod_neg_overallConceptPonderationBar, neg_outcomeOverallConceptPonderation)
    setProgressBar(mod_neg_overallConceptPonderationBar, neg_outcomeOverallConceptPonderation)
    if (neg_outcomeNewProviderUnknown.checked) { mod_neg_outcomeNewProvider.innerText = "Unknown" } else { mod_neg_outcomeNewProvider.innerText = valueOf(neg_outcomeNewProvider) }
    mod_neg_additionalComments.innerText = valueOf(neg_outcomeAdditionalComment)
})
// Function used to trigger the unknown outcome modal
unknwownConfirmBtn.addEventListener("click", function () {
    formValidation(this)
    mod_unk_additionalComment.innerText = valueOf(unk_outcomeAdditionalComment)
})
