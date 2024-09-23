document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.registration-form');
    var x = document.getElementById('error-message'); // If username or email address already exists display error message in this element.

    form.addEventListener('submit',async function(event){
        event.preventDefault(); // Prevent empty form submission (?)

        // Picking up form inputs to a Json body for endpoint.
        const formData = {
            username: form.username.value,
            emailAddress: form.emailAddress.value,
            password: form.password.value
        }

        try {
            const response = await fetch('http://localhost:8080/users/registration', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            const responseData = await response.text();

            if(!response.ok){
                if (responseData === "Username already exists") {
                    x.innerText = "Username already exists";
                } else if (responseData === "Email already exists") {
                    x.innerText = "Email already exists";
                }
            }else {
                // On successful registration, redirect to login.html
                if (responseData === "success") {
                    alert('Registration successful!')
                    window.location.href = 'login.html';
                }
            }
        } catch (error) {
                // Handle network or unexpected errors
                console.error('Error:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    });
    
    