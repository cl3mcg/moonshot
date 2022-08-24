// Declaration of variables
const inputPassword1 = document.querySelector("#password")
const inputPassword2 = document.querySelector("#password2")
const submitBtn = document.querySelector("#submitBtn")

// ---- ---- Declaration of reusable functions
// ---- Function to get the filds .value or the checkbox .checked
const getValue = function (element) {
  if (element.type === "checkbox" || element.type === "radio") {
    return element.checked
  } else {
    return element.value
  }
}

// Function to check if the passwords are matching
let allInputsNewPassword = [
  inputPassword1,
  inputPassword2
]

for (let input of allInputsNewPassword) {
  input.addEventListener("input", function () {
    if (!getValue(inputPassword1) || !getValue(inputPassword2)) {
      inputPassword1.classList.remove("border", "border-danger", "bg-danger", "text-danger", "bg-opacity-10")
      inputPassword2.classList.remove("border", "border-danger", "bg-danger", "text-danger", "bg-opacity-10")
      inputPassword1.classList.remove("border", "border-success", "bg-success", "text-success", "bg-opacity-10")
      inputPassword2.classList.remove("border", "border-success", "bg-success", "text-success", "bg-opacity-10")
    } else {
      if (getValue(inputPassword1) !== getValue(inputPassword2)) {
        inputPassword1.classList.remove("border", "border-success", "bg-success", "text-success", "bg-opacity-10")
        inputPassword2.classList.remove("border", "border-success", "bg-success", "text-success", "bg-opacity-10")
        inputPassword1.classList.add("border", "border-danger", "bg-danger", "text-danger", "bg-opacity-10")
        inputPassword2.classList.add("border", "border-danger", "bg-danger", "text-danger", "bg-opacity-10")
      } else {
        inputPassword1.classList.remove("border", "border-danger", "bg-danger", "text-danger", "bg-opacity-10")
        inputPassword2.classList.remove("border", "border-danger", "bg-danger", "text-danger", "bg-opacity-10")
        inputPassword1.classList.add("border", "border-success", "bg-success", "text-success", "bg-opacity-10")
        inputPassword2.classList.add("border", "border-success", "bg-success", "text-success", "bg-opacity-10")
      }
    }
  })
}

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
          // console.log("The form is not validated.")
          form.classList.add('was-validated')
          submitBtn.classList.remove("btn-primary")
          submitBtn.classList.add("btn-danger", "animate__animated", "animate__shakeX", "animate__faster")
          setTimeout(() => {
            submitBtn.classList.remove("btn-danger", "animate__animated", "animate__shakeX", "animate__faster")
            submitBtn.classList.add("btn-primary")
          }, 250);
        } else {
          submitBtn.classList.remove("btn-primary")
          submitBtn.classList.add("btn-success")
          setTimeout(() => {
            submitBtn.classList.remove("btn-success")
            submitBtn.classList.add("btn-primary")
          }, 250);
          // console.log("The form is validated.")
          form.classList.add('was-validated')
        }
      }, false)
    })
}

submitBtn.addEventListener("click", bootsrapValidation())

