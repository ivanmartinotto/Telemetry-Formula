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
                "ax": round(random.uniform(-2.0, 2.0), 3), # aceleracao em x (G)
                "ay": round(random.uniform(-2.0, 2.0), 3), # aceleracao em y (G)
                "az": round(random.uniform(0.0, 2.0), 3),  # aceleracao em z (G)
                "rpm": round(random.uniform(1500, 10000), 0), # Simulando o RPM do motor XJ 600
                "engineTemp": round(random.uniform(25, 120), 0), # temperatura do motor (graus celsius)
                "oilPress": round(random.uniform(29, 75),1), # Pressao de oleo (psi)
                "speed": round(random.uniform(0, 120), 1), # Velocidade (km/h)
                "gear": round(random.uniform(1, 5), 0), # marcha atual
                "fuelPress": round(random.uniform(14, 15), 2), # pressao de combustivel (psi)
                "lambda": round(random.uniform(0.8,1.2), 3), # lambda (proporcao ar/combustivel)
                "battery": round(random.uniform(10, 13), 1), # nivel da bateria (voltagem)
                "accelPress": round(random.uniform(0, 100),1), # pressao no acelerador (%)
                "brakePress": round(random.uniform(0, 50), 2), # pressao de freio (psi)
                "frontLeftBrake": round(random.uniform(25, 800), 1), # temperatura do freio (graus celsius)
                "frontRightBrake": round(random.uniform(25, 800), 1), # temperatura do freio (graus celsius)
                "rearLeftBrake": round(random.uniform(25, 800), 1), # temperatura do freio (graus celsius)
                "rearRightBrake": round(random.uniform(25, 800), 1), # temperatura do freio (graus celsius)
                "frontLeftTire":round(random.uniform(25, 100), 1), # temperatura pneu dianteiro esquerdo (graus celsius)
                "frontRightTire":round(random.uniform(25, 100), 1), # temperatura pneu dianteiro direito (graus celsius)
                "rearLeftTire":round(random.uniform(25, 100), 1), # temperatura pneu traseiro esquerdo (graus celsius)
                "rearRightTire":round(random.uniform(25, 100), 1), # temperatura pneu traseiro direito (graus celsius)
            }
            await websocket.send(json.dumps(data))
            print("🔼 Enviado:", data)
            await asyncio.sleep(0.5)  # envia a cada 0.1 segundo

asyncio.run(send_fake_data())
