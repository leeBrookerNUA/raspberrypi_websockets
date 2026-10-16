import asyncio
from websockets.asyncio.server import serve
from websockets.exceptions import ConnectionClosedOK
import json
from gpiozero import LED
from time import sleep

CLIENTS = set()

# will hold all previous chat messages
previousChat = []

led = LED(26)

async def broadcastMessage(data):
    message = ""
    if("name" in data) :
        message = data["name"] + ": "
    else :
        message = "Anonymous User: "
    message = message + data["message"]
    response = {"message": message}

    # save messages after theyre sent
    previousChat.append(response)

    for websocket in CLIENTS.copy():
        try:
            await websocket.send(json.dumps(response))
        except ConnectionClosedOK:
            pass

# broadcasts welcome message to new client, and tells old clients who has joined
async def welcomeClient(data, newClientID):
    newClientReply = "welcome to the chat, " + data["name"] + "!"
    oldClientReply = data["name"] + " has joined the server!"
    
    for websocket in CLIENTS.copy():
        if(websocket.id == newClientID) :
            await websocket.send(json.dumps({"message": newClientReply}))
        else :
            try :
                await websocket.send(json.dumps({"message": oldClientReply}))
            except ConnectionClosedOK:
                pass



async def handler(websocket):
    # before anything, send previous messages when joining
    await websocket.send(json.dumps(previousChat))

    CLIENTS.add(websocket)
    async for data in websocket:
        data = json.loads(data)
        
        if("message" in data) :
            await broadcastMessage(data)
            continue
        
        if("name" in data) :
            await welcomeClient(data, websocket.id)

        if("led" in data) :
            if(data["led"] == "toggle") :
                led.toggle()
 
async def main():
    print("Starting websocket server...")
    server = await serve(handler, "", 8001)
    print("Awaiting connection")
    await server.serve_forever()

asyncio.run(main())