// ----- Declaration of variables of page elements

const displayDateBtn = document.querySelector("#displayDateBtn")
const displayOfficeBtn = document.querySelector("#displayOfficeBtn")
const displayTableBtn = document.querySelector("#displayTableBtn")

const displayDate = document.querySelector("#displayDate")
const displayOffice = document.querySelector("#displayOffice")
const displayTable = document.querySelector("#displayTable")

// ----- Function to set-up display according to user selection

displayDateBtn.addEventListener("click", function () {
    displayDateBtn.firstChild.classList.add("text-dark")
    displayDateBtn.firstChild.classList.remove("text-muted")
    displayOfficeBtn.firstChild.classList.add("text-muted")
    displayOfficeBtn.firstChild.classList.remove("text-dark")
    displayTableBtn.firstChild.classList.add("text-muted")
    displayTableBtn.firstChild.classList.remove("text-dark")
    displayDate.classList.remove("d-none", "d-print-none")
    displayOffice.classList.add("d-none", "d-print-none")
    displayTable.classList.add("d-none", "d-print-none")
})

displayOfficeBtn.addEventListener("click", function () {
    displayDateBtn.firstChild.classList.add("text-muted")
    displayDateBtn.firstChild.classList.remove("text-dark")
    displayOfficeBtn.firstChild.classList.add("text-dark")
    displayOfficeBtn.firstChild.classList.remove("text-muted")
    displayTableBtn.firstChild.classList.add("text-muted")
    displayTableBtn.firstChild.classList.remove("text-dark")
    displayDate.classList.add("d-none", "d-print-none")
    displayOffice.classList.remove("d-none", "d-print-none")
    displayTable.classList.add("d-none", "d-print-none")
})

displayTableBtn.addEventListener("click", function () {
    displayDateBtn.firstChild.classList.add("text-muted")
    displayDateBtn.firstChild.classList.remove("text-dark")
    displayOfficeBtn.firstChild.classList.add("text-muted")
    displayOfficeBtn.firstChild.classList.remove("text-dark")
    displayTableBtn.firstChild.classList.add("text-dark")
    displayTableBtn.firstChild.classList.remove("text-muted")
    displayDate.classList.add("d-none", "d-print-none")
    displayOffice.classList.add("d-none", "d-print-none")
    displayTable.classList.remove("d-none", "d-print-none")
})

window.addEventListener("load", function () {
    displayDateBtn.firstChild.classList.add("text-dark")
    displayOfficeBtn.firstChild.classList.add("text-muted")
    displayTableBtn.firstChild.classList.add("text-muted")
    displayOffice.classList.add("d-none", "d-print-none")
    displayTable.classList.add("d-none", "d-print-none")
})