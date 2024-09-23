document.addEventListener('DOMContentLoaded', function(){
    const form = document.querySelector('.login-form');
    var x = document.getElementById('error-message');

    form.addEventListener('submit',async function(event){
        event.preventDefault(); // Prevent empty form submission (?)

        // Picking up form inputs to a Json body for endpoint.
        const formData = {
            emailAddress: form.emailAddress.value,
            password: form.password.value
        }
        try {
            const response = await fetch('http://localhost:8080/users/login', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Extract JWT token as plain text
                const jwtToken = await response.text(); // The token is received as plain text
                setCookie("JwtToken", jwtToken)
                window.location.href = 'chatroom.html'; 
            } else {
                x.innerHTML = 'Invalid username or password';
            }
        } catch (error) {
            console.error('Error:', error);
            x.innerHTML = 'An error occurred. Please try again later.';
        }
    });
});


function setCookie(name, value) {
    let date = new Date();
    // Set the cookie to expire in 7 days
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days in milliseconds
    let expires = "; expires=" + date.toUTCString();
    
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}