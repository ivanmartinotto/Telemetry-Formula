# 🏎️ Projeto de Telemetria - Fórmula SAE

Este projeto coleta dados de um acelerômetro instalado na suspensão do carro de Fórmula SAE e exibe gráficos em tempo real em um dashboard web.

## 🔧 Componentes

- **ESP8266** + **MPU6050**
- **Servidor Node.js** com salvamento de dados em `.csv` (arquivo `telemetry_data.csv` é criado na pasta "Data Analysis")
- **Dashboard HTML/JS** com gráficos ao vivo (Chart.js)
- **Análise offline** futura com Python (`pandas`, `matplotlib`)

## 📡 Fluxo de Dados

ESP8266 → WebSocket → Node.js → Dashboard (e gravação em CSV)

## Como rodar:
```bash
cd Telemetry-Formula
npm init -y
npm install ws express
node server.js
```
Depois, abra http://localhost:8080 no navegador.

**OBS.:** Para emular dados fictícios para fins de teste, rode o código `send_fake_data.py` com:
```bash
python3 send_fake_data.py
```

Os valores fictícios devem aparecer em tempo real no dashboard web.
