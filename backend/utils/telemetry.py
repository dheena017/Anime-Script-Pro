from typing import List
from fastapi import WebSocket
import asyncio

class TelemetryManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, log_entry: dict):
        if not self.active_connections:
            return
        
        # Create tasks for all connections to send in parallel
        tasks = []
        for connection in self.active_connections:
            tasks.append(connection.send_json(log_entry))
        
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

# Global instance
telemetry_manager = TelemetryManager()
