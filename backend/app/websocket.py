from fastapi import WebSocket

connections = []

async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connections.append(websocket)

    try:
        while True:
            await websocket.receive_text()
    except:
        connections.remove(websocket)