document.addEventListener('DOMContentLoaded', function(){
    const form = document.querySelector('.forgotpassword');
    var x = document.getElementById('error-message');

    form.addEventListener('submit',async function(event){
        event.preventDefault(); // Prevent empty form submission (?)

        // Picking up form inputs to a Json body for endpoint.
        const formData = {
            emailAddress: form.emailAddress.value
        }
        try {
            const response = await fetch('http://localhost:8080/users/forgotpassword', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            // Handle text response instead of JSON
            const responseData = await response.text();

            if (!response.ok) {
                // Handle specific error messages in the text response
                if (responseData === "Invalid email address") {
                    x.innerText = "Invalid email address";
                }
            } else {
                // On successful registration, redirect to login.html
                if (responseData === "success") {
                    alert("We have sent you an email address");
                    window.location.href = 'login.html';
                }
            }
        } catch (error) {
            console.error('Error:', error);
            x.innerHTML = 'An error occurred. Please try again later.';
        }
    });
});