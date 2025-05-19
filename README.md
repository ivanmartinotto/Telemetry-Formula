# 🏎️ Projeto de Telemetria - Fórmula SAE

Este projeto coleta dados de um acelerômetro instalado na suspensão do carro de Fórmula SAE e exibe gráficos em tempo real em um dashboard web.

## 🔧 Componentes

- **ESP8266** + **MPU6050**
- **Servidor Node.js** com salvamento de dados em `.csv` (arquivo `telemetry_data.csv` é criado na pasta "Data Analysis")
- **Dashboard HTML/JS** com gráficos ao vivo (Chart.js)
- **Análise offline** futura com Python (`pandas`, `matplotlib`)

## 📡 Fluxo de Dados

ESP8266 → WebSocket → Node.js → Dashboard (e gravação em CSV)


