const websocket = new WebSocket("ws://127.0.0.1:8001");

function sendMessageToServer(data) {
    websocket.send(JSON.stringify(data));
}

// created data type constants (pseudo enums) to identify recieved data
const SINGLE_MESSAGE = 0;
const PREVIOUS_CHAT = 1;

// function to identify what data is coming from the server
function identifyData(data) {
    if(data.message) return SINGLE_MESSAGE;
    // if not message there is most likely backog so return previous chats
    return PREVIOUS_CHAT;
}

// adds a single message to the list of messages
function addSignleMessage(data) {
    const newSpan = document.createElement("span");
    newSpan.innerHTML = data.message;
    logDiv.prepend(newSpan);
}

function addListOfMessages(list) {
    for(const data of list) {
        addSignleMessage(data);
    }
}


websocket.addEventListener("message", ({ data }) => {
    const parsedData = JSON.parse(data);

    // for debugging
    console.log(parsedData);

const dataType = identifyData(parsedData);

switch(dataType){
    case SINGLE_MESSAGE :
        addSignleMessage(parsedData)
        break
    case PREVIOUS_CHAT :
        // display previous messages
        addListOfMessages(parsedData)
        break
}


return false;
})