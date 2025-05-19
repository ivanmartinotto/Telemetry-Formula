#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>
#include <Wire.h>
#include <MPU6050.h>

// === CONFIGURAÇÕES DE REDE ===
const char* ssid = "NOME_DA_REDE";
const char* password = "SENHA_DA_REDE";

const char* websocket_host = "192.168.4.1";  // IP do servidor Node.js
const uint16_t websocket_port = 8080;

// === OBJETOS ===
MPU6050 mpu;
WebSocketsClient webSocket;

void setup() {
  Serial.begin(115200);
  Wire.begin(D2, D1);  // SDA, SCL padrão para NodeMCU ESP8266

  // Inicializa o sensor MPU6050
  mpu.initialize();
  if (!mpu.testConnection()) {
    Serial.println("Erro: MPU6050 não encontrado!");
    while (1);
  }

  // Conecta ao Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Conectando ao Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\nWi-Fi conectado");

  // Inicializa o WebSocket
  webSocket.begin(websocket_host, websocket_port, "/");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(3000);
}

void loop() {
  webSocket.loop();

  static unsigned long lastSend = 0;
  if (millis() - lastSend >= 100) {
    lastSend = millis();

    int16_t ax, ay, az;
    mpu.getAcceleration(&ax, &ay, &az);

    float ax_g = ax / 16384.0;
    float ay_g = ay / 16384.0;
    float az_g = az / 16384.0;

    // Monta JSON manualmente (mais leve para o ESP8266)
    String json = "{\"timestamp\":" + String(millis()) +
                  ",\"ax\":" + String(ax_g, 3) +
                  ",\"ay\":" + String(ay_g, 3) +
                  ",\"az\":" + String(az_g, 3) + "}";

    webSocket.sendTXT(json);
    Serial.println(json);
  }
}

// Evento de WebSocket
void webSocketEvent(WStype_t type, uint8_t *payload, size_t length) {
  if (type == WStype_CONNECTED) {
    Serial.println("WebSocket conectado!");
  } else if (type == WStype_DISCONNECTED) {
    Serial.println("WebSocket desconectado!");
  }
}
