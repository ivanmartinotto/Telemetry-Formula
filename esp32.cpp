#include <Wire.h>
#include <MPU6050.h>
#include <WiFi.h>
#include <WebSocketsClient.h>

const char* ssid = ""; // nome da rede
const char* password = ""; // senha da rede

const char* host = "";  // IP do servidor Node.js
const uint16_t port = 8080;

MPU6050 mpu;
WebSocketsClient webSocket;

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Inicializa I2C
  Wire.begin();  // GPIO 21 (SDA), 22 (SCL)

  // Inicializa o sensor
  mpu.initialize();
  if (!mpu.testConnection()) {
    Serial.println("❌ MPU6050 não conectado!");
    while (1);
  }
  Serial.println("✅ MPU6050 conectado.");

  // Conecta ao Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Conectando ao Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\n✅ Conectado! IP: " + WiFi.localIP().toString());

  // Conecta ao WebSocket
  webSocket.begin(host, port, "/");
  webSocket.onEvent([](WStype_t type, uint8_t * payload, size_t length) {
    if (type == WStype_CONNECTED) Serial.println("✅ WebSocket conectado!");
    if (type == WStype_DISCONNECTED) Serial.println("⚠️ WebSocket desconectado!");
  });
  webSocket.setReconnectInterval(3000);
}

void loop() {
  webSocket.loop();

  static unsigned long lastSend = 0;
  if (millis() - lastSend >= 100) {
    lastSend = millis();

    // Lê aceleração
    int16_t ax, ay, az;
    mpu.getAcceleration(&ax, &ay, &az);

    // Converte para g (1g = 16384 na escala ±2g)
    float ax_g = ax / 16384.0;
    float ay_g = ay / 16384.0;
    float az_g = az / 16384.0;

    // Monta JSON
    String json = "{\"timestamp\":" + String(millis()) +
                  ",\"ax\":" + String(ax_g, 3) +
                  ",\"ay\":" + String(ay_g, 3) +
                  ",\"az\":" + String(az_g, 3) + "}";

    // Envia
    webSocket.sendTXT(json);
    Serial.println("🔼 Enviado: " + json);
  }
}
