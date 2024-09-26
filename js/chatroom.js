// Check for the presence of the 'JwtToken' cookie when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const jwtToken = getCookie('JwtToken'); 

    // If the 'JwtToken' is not found, redirect to 'index.html'
    if (!jwtToken) {
        window.location.href = 'login.html'; // Redirect to index.html
    }
});


// Connection
const socket = new SockJS('http://localhost:8080/chat'); 
const stompClient = Stomp.over(socket);

// Display time
stompClient.connect({}, function (frame) {

    stompClient.subscribe('/topic/time', function (message) {
        const data = message.body;

        document.querySelector('.data').textContent = data;
    });

    // Display accounts banned
    stompClient.subscribe('/topic/banned', function (message) {
        const data = message.body;

        document.querySelector('.total-banned-users').textContent = data;
    });

    // Display messages
    stompClient.subscribe('/topic/messages', function (messageOutput) {
        const message = JSON.parse(messageOutput.body);
        displayMessage(message);
    });
    

    // Display online list on connection
    stompClient.subscribe('/topic/onlinelist', function (userListMessage) {
        const userList = JSON.parse(userListMessage.body);
        updateUsersList(userList);
    });
    // Joining the room
    const username = getCookie('username');
    stompClient.send('/app/join', {}, username);
});
document.querySelector('.leaveRoomBtn').addEventListener('click', function() {
    const username = getCookie('username');

    stompClient.send('/app/leave', {}, username);

    stompClient.disconnect(function() {
        window.location.href = "/login.html";
    })
})

// ------------------------- BELOW THIS LINE ONLY FUNCTIONS ---------------------------------------------------------------------------------------------

function sendMessage() {
    const jwtToken = getCookie("JwtToken");
    const messageInput = document.getElementById('messageInput');
    const content = messageInput.value;

    if (content.trim() === "") {
        alert("Please enter a message before sending.");
        return;
    }

    
    stompClient.send("/app/chat", {}, JSON.stringify({
        message: content,
        jwtToken: jwtToken
    }));

    messageInput.value = ''; 
}

// Message display in the chat-room 
function displayMessage(message) {
    const checkUser = getCookie('username');
    const messageElement = document.createElement('p'); 
    messageElement.textContent = `${message.time}  ${message.sender}: ${message.content}`;
    messageElement.style.wordWrap = "break-word";
    messageElement.style.whiteSpace = "normal";

    // If it's my message else if it's other person
    if (message.sender === checkUser) { 
        messageElement.style.textAlign = "right"; 
        messageElement.style.backgroundColor = "#d1e7dd"; 
        messageElement.style.marginLeft = "auto"; 
    }else {
        messageElement.style.textAlign = "left"; 
        messageElement.style.backgroundColor = "#f8d7da"; 
        messageElement.style.marginRight = "auto"; 
    }

    document.getElementById('messageList').appendChild(messageElement);
}

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
function setCookie(name, value) {
    let date = new Date();
    // Set the cookie to expire in 7 days
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days in milliseconds
    let expires = "; expires=" + date.toUTCString();
    
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function updateUsersList(userList) {
    const userList01 = document.querySelector('.left-panel ol');
    userList01.innerHTML = '';

    userList.forEach(function (user) {
        const userItem = document.createElement('li');
        userItem.textContent = user;
        userList01.appendChild(userItem);
    })
}


