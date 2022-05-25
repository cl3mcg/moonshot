const submitBtn = document.querySelector("#submitBtn")

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
                console.log("The form is not validated.")
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
                console.log("The form is validated.")
                form.classList.add('was-validated')
              }
            }, false)
          })
      }
    
submitBtn.addEventListener("click", bootsrapValidation())