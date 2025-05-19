const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const browserSockets = new Set();
const CSV_FILE = path.join("Data Analysis", "telemetry_data.csv");

// Escreve o cabeçalho do CSV (caso ainda não exista)
if (!fs.existsSync(CSV_FILE)) {
  fs.writeFileSync(CSV_FILE, "timestamp,ax,ay,az\n");
}

app.use(express.static(path.join(__dirname, "public")));

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
    console.log("🟡 Dispositivo (ESP8266) conectado");

    ws.on("message", function incoming(message) {
      const dataStr = message.toString();
      //console.log("📨 Mensagem recebida:", dataStr);

      // Tenta converter a string recebida em JSON
      try {
        const data = JSON.parse(dataStr);

        // Salva no CSV
        const row = `${data.timestamp},${data.ax},${data.ay},${data.az}\n`;
        fs.appendFileSync(CSV_FILE, row);

        // Envia para todos os navegadores conectados
        for (const browser of browserSockets) {
          if (browser.readyState === WebSocket.OPEN) {
            browser.send(dataStr);
          }
        }
      } catch (err) {
        console.error("❌ Erro ao processar JSON:", err.message);
      }
    });

    ws.on("close", () => {
      console.log("🔴 Dispositivo desconectado");
    });
  }
});

server.listen(8080, () => {
  console.log("🌐 Servidor rodando em http://localhost:8080");
});
