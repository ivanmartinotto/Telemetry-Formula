# 🏎️ Projeto de Telemetria - Fórmula SAE

Este projeto cria uma Dashboard interativo para visualização de dados em tempo real provenientes dos sensores do carro **UFS01** desenvolvido pela equipe de Fórmula SAE da Universidade Federal de São Carlos, a **Fórmula Route**.

## 🔧 Componentes

- **Servidor main.js** para recebimento dos dados em JSON, salvamento dos dados em `.csv` (arquivo `telemetry_data.csv` é criado na pasta "Data Analysis") e envio dos dados para o Dashboard.
- **Dashboard HTML/JS** no estilo Assetto Corsa com seleção de gráficos, gauges dinâmicos e boxes com mapas de cor para temperatura.
- **Análise offline** futura com Python (`pandas`, `matplotlib`)

## 📡 Fluxo de Dados

Dados do carro (JSON) → WebSocket → main.js → Dashboard (e gravação em CSV).

O servidor recebe dados no formato JSON. Por exemplo:

```bash
{
    'timestamp': 1751284510059, 
    'ax': 1.834, 
    'ay': 0.716, 
    'az': 0.374, 
    'rpm': 4354.0, 
    'engineTemp': 111.0, 
    'oilPress': 59.4, 
    'speed': 96.8, 
    'gear': 3.0, 
    'fuelPress': 14.99, 
    'lambda': 0.936, 
    'battery': 12.7, 
    'accelPress': 57.6, 
    'brakePress': 41.38, 
    'frontLeftBrake': 290.3, 
    'frontRightBrake': 355.3, 
    'rearLeftBrake': 449.8, 
    'rearRightBrake': 422.7, 
    'frontLeftTire': 78.6, 
    'frontRightTire': 67.7, 
    'rearLeftTire': 48.9, 
    'rearRightTire': 70.8
}
``` 

O servidor escreve as informações num arquivo no formato .csv (`telemetry_data.csv`) e então esses dados são enviados via WebSocket para o Dashboard.

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

**Obs.:** Lap time atualmente está sendo gerado artificialmente.