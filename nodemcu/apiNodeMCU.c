#include <ESP8266WiFi.h>
#include <SocketIoClient.h>
#include <DHT.h>

#define DHTPIN D1     // what digital pin the DHT22 is conected to
#define DHTTYPE DHT22   // there are multiple kinds of DHT sensors
#define LED1 D5
#define LED2 D7

DHT dht(DHTPIN, DHTTYPE);

const char* ssid = "rede_wifi";
const char* password = "senha";

WiFiClient client;
SocketIoClient webSocket;

const char* host = "192.168.0.106";
const int port = 5000;
const char* socket_path = "/socket.io/?transport=websocket";

void statusEvent(const char* payload, size_t lenght) {
    int led1on = 0, led2on = 0;
    
    sscanf(payload, "{\"led1on\":%d,\"led2on\":%d}", &led1on, &led2on);
    
    if (led1on) {
        digitalWrite(LED1, HIGH);
    } else {
        digitalWrite(LED1, LOW);
    }
    
    if (led2on) {
        digitalWrite(LED2, HIGH);
    } else {
        digitalWrite(LED2, LOW);
    }
}

void readSensors() {
    // Read humidity
    float h = dht.readHumidity();
    // Read temperature as Celsius (the default)
    float t = dht.readTemperature();
    
    if (isnan(h) || isnan(t)) {
        Serial.println("Failed to read from DHT sensor!");
        return;
    }

    Serial.println("");
    Serial.print("Humidity: ");
    Serial.print(h);
    Serial.println(" %");
    Serial.print("Temperature: ");
    Serial.print(t);
    Serial.println(" *C ");
    
    // read the input on analog pin 0:
    int sensorValue = analogRead(A0);
    Serial.print("sensorValue: ");
    Serial.println(sensorValue);

    // Convert the analog reading
    // (which goes from 0 - 1024) to a voltage (0 - 5V):
    float luminosidade = ((1024 - sensorValue) * 100.0) / 1024; 

    Serial.print("luminosidade: ");
    Serial.println(luminosidade);
    Serial.println("");
    
    if(client.connect(host, port)){
        String postStr = "{\"temperatura\": \"";
        postStr += t;
        postStr += "\", \"umidade\": \"";
        postStr += h;
        postStr += "\", \"luminosidade\": \"";
        postStr += luminosidade;
        postStr += "\"}";

        client.print("POST /api/clima HTTP/1.1\n");
        client.println("Content-Type: application/json");
        client.print("Content-Length: ");
        client.print(postStr.length());
        client.print("\n\n");
        client.println(postStr);
        client.stop();

        Serial.println("Post\n");
    }
}

void setup() {
    pinMode ( LED1, OUTPUT );
    pinMode ( LED2, OUTPUT );

    Serial.begin(115200);
    Serial.println("Booting");
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    while (WiFi.waitForConnectResult() != WL_CONNECTED) {
        Serial.println("Connection Failed! Rebooting...");
        delay(500);
        ESP.restart();
    }

    Serial.println("Ready");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    
    webSocket.on("status", statusEvent);
    webSocket.begin(host, port, socket_path);
}

int timeSinceLastReadSensors = 0;

void loop() {
    webSocket.loop();

    if (timeSinceLastReadSensors >= 1000) { // 10 segundos
        readSensors();
        timeSinceLastReadSensors = 0;
    }
    
    delay(10); // 0.01 segundos
    timeSinceLastReadSensors += 1;
}
