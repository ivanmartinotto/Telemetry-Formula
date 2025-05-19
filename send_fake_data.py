import asyncio
import websockets
import random
import time
import json

async def send_fake_data():
    uri = "ws://localhost:8080"  # Altere para o IP da sua máquina se for testar de outro dispositivo
    async with websockets.connect(uri) as websocket:
        while True:
            data = {
                "timestamp": int(time.time() * 1000),  # Em milissegundos
                "ax": round(random.uniform(-2.0, 2.0), 3),
                "ay": round(random.uniform(-2.0, 2.0), 3),
                "az": round(random.uniform(0.0, 2.0), 3)  # Geralmente az fica positivo, gravidade
            }
            await websocket.send(json.dumps(data))
            print("🔼 Enviado:", data)
            await asyncio.sleep(0.5)  # envia a cada 0.1 segundo

asyncio.run(send_fake_data())
