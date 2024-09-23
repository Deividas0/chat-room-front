// Check for the presence of the 'JwtToken' cookie when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const jwtToken = getCookie('JwtToken'); 

    // If the 'JwtToken' is not found, redirect to 'index.html'
    if (!jwtToken) {
        window.location.href = 'login.html'; // Redirect to index.html
    }
});

// Function to get the value of a cookie by name
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}