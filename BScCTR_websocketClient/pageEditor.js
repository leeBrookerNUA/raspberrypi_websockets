const messageInput = document.getElementById("message");
const sendMessageButton = document.getElementById("send");
const logDiv = document.getElementById("log");
const submitNameButton = document.getElementById("submit");
const nameInput = document.getElementById("name");
const ledToggle = document.getElementById("ledToggle");

let username = "";
let message = "";

nameInput.oninput = (ev) => username = ev.target.value;
messageInput.oninput = (ev) => message = ev.target.value;


sendMessageButton.onclick = (ev) => {
    ev.preventDefault();
    const data = {message: message};
    if(username.length > 0) data.name = username;
    sendMessageToServer(data);
}

submitNameButton.onclick = (ev) => {
    ev.preventDefault();
    const data = {name: username};
    sendMessageToServer(data);
}

ledToggle.onclick = (event) => {
    event.preventDefault();
    const data = {led : "toggle"};
    sendMessageToServer(data);
}