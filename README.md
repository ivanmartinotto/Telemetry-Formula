# 🏎️ Projeto de Telemetria - Fórmula SAE

Este projeto coleta dados de um acelerômetro instalado na suspensão do carro de Fórmula SAE e exibe gráficos em tempo real em um dashboard web.

## 🔧 Componentes

- **ESP8266** + **MPU6050**
- **Servidor Node.js** com salvamento de dados em `.csv` (arquivo `telemetry_data.csv` é criado na pasta "Data Analysis")
- **Dashboard HTML/JS** com gráficos ao vivo (Chart.js) e seleção de canais (ax, ay e az)
- **Análise offline** futura com Python (`pandas`, `matplotlib`)

## 📡 Fluxo de Dados

ESP8266 → WebSocket → Node.js → Dashboard (e gravação em CSV)

## Como rodar (NODE.js e Python já instalados):
```bash
cd Telemetry-Formula
npm init -y
npm install ws express
npm install electron --save-dev
```

Para rodar através do Electron, deve-se adicionar `"electron": "electron ."` no "scripts" do arquivo `package.json` ficando da seguinte forma:
```bash
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node main.js",
    "electron": "electron ."
}
```

Por fim, executa-se o seguinte comando:
```bash
npm run electron
```

**OBS.:** Para emular dados fictícios para fins de teste, rode o código `send_fake_data.py` com:
```bash
python3 send_fake_data.py
```

Os valores fictícios devem aparecer em tempo real no dashboard web.


# 📦 Como rodar o ESP32 + MPU6050 no Arduino IDE

Este guia explica como compilar e carregar o código do ESP32 que lê dados do acelerômetro MPU6050 e envia via WebSocket para o servidor Node.js.

---

## ✅ Pré-requisitos

- Placa ESP32 (ex: WROOM-32D)
- Sensor MPU6050
- Arduino IDE (versão 1.8+ ou 2.x)
- Conexão Wi-Fi ativa
- Servidor Node.js rodando no PC

---

## 1️⃣ Configurar a IDE

### 1.1 Instalar suporte ao ESP32

1. Acesse **Arquivo > Preferências**
2. Em **URLs adicionais para Gerenciadores de Placas**, adicione:

https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json


3. Vá em **Ferramentas > Placa > Gerenciador de Placas...**
4. Procure por `esp32` e instale o pacote da **Espressif Systems**

### 1.2 Selecionar a placa correta

- Vá em **Ferramentas > Placa** e selecione: ESP32 Dev Module

---

## 2️⃣ Instalar bibliotecas necessárias

Vá em **Sketch > Incluir Biblioteca > Gerenciar Bibliotecas...**

Instale as seguintes:

- `MPU6050` (por Electronic Cats)
- `arduinoWebSockets` (por Markus Sattler)

---

## 3️⃣ Fazer as conexões

| MPU6050 | ESP32       |
|---------|-------------|
| VCC     | 3.3V        |
| GND     | GND         |
| SDA     | GPIO 21     |
| SCL     | GPIO 22     |

---

## 4️⃣ Subir o código

1. Copie o sketch do ESP32 (`esp32.cpp`)
2. Altere as credenciais Wi-Fi:

```cpp
const char* ssid = "SUA_REDE";
const char* password = "SUA_SENHA";
const char* host = "IP_DO_SERVIDOR_NODE";
