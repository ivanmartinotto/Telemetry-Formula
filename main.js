const { app, BrowserWindow } = require('electron');
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const fs = require("fs");

const browserSockets = new Set();
const CSV_FILE = path.join("Data Analysis", "telemetry_data.csv"); // cria arquivo csv na pasta 'Data Analysis'

// cria o servidor http para servir o frontend
const express = require('express');
const expressApp = express();
const server = http.createServer(expressApp);
const wss = new WebSocket.Server({ server });

let csvHeaderWritten = false; // indica se o cabecalho do csv foi escrito ou não
let csvColumns = [];
const messageBuffer = []; 
const MAX_BUFFER_SIZE = 100000; // tamanho maximo do buffer

// servir arquivos estaticos (html, js, css)
expressApp.use(express.static(path.join(__dirname, "public","index.html")));

// redireciona rota raiz para o dashboard (index)
expressApp.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
});

// WebSocket recebe dados do ESP e envia para o dashboard
wss.on("connection", function connection(ws, req) {
  const isBrowser = req.headers["user-agent"]?.includes("Mozilla");

  if (isBrowser) {
    console.log("🟢 Navegador conectado");
    browserSockets.add(ws);

    ws.on("close", () => {
      browserSockets.delete(ws);
      console.log("🔴 Navegador desconectado");
    });
  } else {
    console.log("🟡 Dispositivo (ESP32/ESP8266) conectado");

    ws.on("message", function incoming(message) {
      if (messageBuffer.length < MAX_BUFFER_SIZE){
        messageBuffer.push(message.toString())
      } else {
        console.warn("⚠️ Buffer cheio! Mensagem descartada.")
      }
    });

    ws.on("close", () => {
      console.log("🔴 Dispositivo desconectado");
    });
  }
});

// Processando as mensagens do buffer (a cada 50ms)
setInterval(() => {
  while (messageBuffer.length > 0){
    const dataStr = messageBuffer.shift();

    try {
      const data = JSON.parse(dataStr);

      // Gera cabecalho CSV se ainda nao foi feito
      if (!csvHeaderWritten) {
        csvColumns = Object.keys(data);
        const headerLine = csvColumns.join(",") + "\n";
        fs.writeFileSync(CSV_FILE, headerLine);
        csvHeaderWritten = true;
        console.log("✅ Cabeçalho CSV criado:", csvColumns);
      }

      // Salva linha no CSV
      const rowValues = csvColumns.map(col => data[col] !== undefined ? data[col] : "");
      const rowLine = rowValues.join(",") + "\n";
      fs.appendFileSync(CSV_FILE, rowLine);

      // Envia o JSON para todos os navegadores conectados
      for (const browser of browserSockets){
        if (browser.readyState === WebSocket.OPEN){
          browser.send(dataStr);
        }
      }
    } catch (err) {
      console.error("❌ Erro ao processar item do buffer:", err.message);
    }
  }
}, 50);

// inicia o servidor websocket + http
server.listen(8080, () => {
  console.log("🌐 Backend rodando na porta 8080");
});

// implementando janela do electron
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  win.loadURL('http://localhost:8080');
}

app.whenReady().then(createWindow); // cria janela ao iniciar

//fechando o app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});