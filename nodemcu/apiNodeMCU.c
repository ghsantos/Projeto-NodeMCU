#include <ESP8266WiFi.h>
#include <ArduinoJson.h>

#include <DHT.h>

#define DHTPIN D1     // what digital pin the DHT22 is conected to
#define DHTTYPE DHT22   // there are multiple kinds of DHT sensors
#define LED1 D5
#define LED2 D7

DHT dht(DHTPIN, DHTTYPE);

const char* ssid = "WIFI UCB";
const char* password = "";

WiFiClient client;
const char* host = "10.60.165.39";

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
}

int timeSinceLastReadSensors = 0;
int timeSinceLastWriteLeds = 0;

void loop() {
    if (timeSinceLastWriteLeds >= 100) {
        Serial.println("timeSinceLastWriteLeds");
        timeSinceLastWriteLeds = 0;
        
        if(client.connect(host, 5000)){
            client.print("GET /api/status HTTP/1.1\n");
            client.println("Host: 192.168.0.16");
            client.println("Connection: close");
            client.print("\n\n");
            
            unsigned long timeout = millis();
            while (client.available() == 0) {
                if (millis() - timeout > 5000) {
                    Serial.println(">>> Client Timeout !");
                    client.stop();
                    return;
                }
            }
            
            // Read all the lines of the reply from server
            // and print them to Serial
            /*  
            resultado
            
            HTTP/1.0 200 OK
            Date: Sun, 08 Apr 2018 01:18:27 GMT
            Server: WSGIServer/0.2 CPython/3.5.2
            Content-Length: 27
            Content-Type: text/html; charset=UTF-8

            {'led1': 'on','led2': 'on'}
            
            */
            String line = "";
            while (client.available()) {
                line = client.readStringUntil('\r');
                Serial.print(line);
            }
            //Serial.print(line);
            char *json = const_cast<char*>(line.c_str());
            
            // Step 3
            StaticJsonBuffer<200> jsonBuffer;

            // Step 4
            JsonObject& root = jsonBuffer.parseObject(json);

            // Step 5
            if (!root.success()) {
                Serial.println("parseObject() failed");
                return;
            }
            
            const int led1on = root["led1on"];
            const int led2on = root["led2on"];
            
            Serial.println(led1on);
            
            if (led1on) {
                digitalWrite(LED1, HIGH);
                Serial.println("HIGH");
            } else {
                digitalWrite(LED1, LOW);
            }
            
            if (led2on) {
                digitalWrite(LED2, HIGH);
            } else {
                digitalWrite(LED2, LOW);
            }

            Serial.println("\nPassou status\n");
        }
    }
    
    if (timeSinceLastReadSensors >= 500) {
        // Read humidity
        float h = dht.readHumidity();
        // Read temperature as Celsius (the default)
        float t = dht.readTemperature();
        
        if (isnan(h) || isnan(t)) {
            Serial.println("Failed to read from DHT sensor!");
            timeSinceLastReadSensors = 800;
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
        
        Serial.println("timeSinceLastReadSensors");
        timeSinceLastReadSensors = 0;
        
        if(client.connect(host, 5000)){
            String postStr = "{\"temperatura\": \"";
            postStr += t;
            postStr += "\", \"umidade\": \"";
            postStr += h;
            postStr += "\", \"luminosidade\": \"";
            postStr += luminosidade;
            postStr += "\"}";

            client.print("POST /api/clima HTTP/1.1\n");
            client.println("Host: 192.168.0.16");
            client.println("Content-Type: application/json");
            client.print("Content-Length: ");
            client.print(postStr.length());
            client.print("\n\n");
            client.println(postStr);
            client.stop();

            Serial.println("\nPassou\n");
        }
    }
    
    delay(500); // 0.5 segundos
    timeSinceLastReadSensors += 10;
    timeSinceLastWriteLeds += 10;
}
