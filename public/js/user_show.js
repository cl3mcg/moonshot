// Declaration of variables
const inputNewPassword1 = document.querySelector("#newPassword1")
const inputNewPassword2 = document.querySelector("#newPassword2")
const inputNewEmail1 = document.querySelector("#newEmail1")
const inputNewEmail2 = document.querySelector("#newEmail2")
const submitChangePasswordBtn = document.querySelector("#submitChangePasswordBtn")
const submitChangeEmailBtn = document.querySelector("#submitChangeEmailBtn")

// ---- ---- Declaration of reusable functions
// ---- Function to get the filds .value or the checkbox .checked
const getValue = function(element){
    if (element.type === "checkbox" || element.type === "radio") {
        return element.checked
    } else {
        return element.value
    }
}

// Function to check if the passwords are matching
let allInputsNewPassword = [
    inputNewPassword1,
    inputNewPassword2
]

for (let input of allInputsNewPassword) {
    input.addEventListener("input", function () {
        if (!getValue(inputNewPassword1) || !getValue(inputNewPassword2)) {
            inputNewPassword1.classList.remove("border", "border-danger", "bg-danger", "text-danger", "bg-opacity-10")
            inputNewPassword2.classList.remove("border", "border-danger", "bg-danger", "text-danger", "bg-opacity-10")
            inputNewPassword1.classList.remove("border", "border-success", "bg-success", "text-success", "bg-opacity-10")
            inputNewPassword2.classList.remove("border", "border-success", "bg-success", "text-success", "bg-opacity-10")
            submitChangePasswordBtn.setAttribute("disabled", "true")
        } else {
            if(getValue(inputNewPassword1) !== getValue(inputNewPassword2)){
                inputNewPassword1.classList.remove("border", "border-success", "bg-success", "text-success", "bg-opacity-10")
                inputNewPassword2.classList.remove("border", "border-success", "bg-success", "text-success", "bg-opacity-10")
                inputNewPassword1.classList.add("border", "border-danger", "bg-danger", "text-danger", "bg-opacity-10")
                inputNewPassword2.classList.add("border", "border-danger", "bg-danger", "text-danger", "bg-opacity-10")
                submitChangePasswordBtn.setAttribute("disabled", "true")
            } else {
                inputNewPassword1.classList.remove("border", "border-danger", "bg-danger", "text-danger", "bg-opacity-10")
                inputNewPassword2.classList.remove("border", "border-danger", "bg-danger", "text-danger", "bg-opacity-10")
                inputNewPassword1.classList.add("border", "border-success", "bg-success", "text-success", "bg-opacity-10")
                inputNewPassword2.classList.add("border", "border-success", "bg-success", "text-success", "bg-opacity-10")
                submitChangePasswordBtn.removeAttribute("disabled")
            }
        }
    })
}

// Function to check if the emails are matching

let allInputsNewEmails = [
    inputNewEmail1,
    inputNewEmail2
]

for (let input of allInputsNewEmails) {
    input.addEventListener("input", function () {
        if (!getValue(inputNewEmail1) || !getValue(inputNewEmail2)) {
            inputNewEmail1.classList.remove("border", "border-danger", "bg-danger", "text-danger", "bg-opacity-10")
            inputNewEmail2.classList.remove("border", "border-danger", "bg-danger", "text-danger", "bg-opacity-10")
            inputNewEmail1.classList.remove("border", "border-success", "bg-success", "text-success", "bg-opacity-10")
            inputNewEmail2.classList.remove("border", "border-success", "bg-success", "text-success", "bg-opacity-10")
            submitChangeEmailBtn.setAttribute("disabled", "true")
        } else {
            if(getValue(inputNewEmail1) !== getValue(inputNewEmail2)){
                inputNewEmail1.classList.remove("border", "border-success", "bg-success", "text-success", "bg-opacity-10")
                inputNewEmail2.classList.remove("border", "border-success", "bg-success", "text-success", "bg-opacity-10")
                inputNewEmail1.classList.add("border", "border-danger", "bg-danger", "text-danger", "bg-opacity-10")
                inputNewEmail2.classList.add("border", "border-danger", "bg-danger", "text-danger", "bg-opacity-10")
                submitChangeEmailBtn.setAttribute("disabled", "true")
            } else {
                inputNewEmail1.classList.remove("border", "border-danger", "bg-danger", "text-danger", "bg-opacity-10")
                inputNewEmail2.classList.remove("border", "border-danger", "bg-danger", "text-danger", "bg-opacity-10")
                inputNewEmail1.classList.add("border", "border-success", "bg-success", "text-success", "bg-opacity-10")
                inputNewEmail2.classList.add("border", "border-success", "bg-success", "text-success", "bg-opacity-10")
                submitChangeEmailBtn.removeAttribute("disabled")
            }
        }
    })
}