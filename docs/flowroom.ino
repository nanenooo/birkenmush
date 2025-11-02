#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "DHT.h"
#include <WiFiS3.h>
#include <WiFiSSLClient.h>
#include <ArduinoHttpClient.h>

#define DHTPIN  2
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

LiquidCrystal_I2C lcd(0x27, 16, 2);

const char WIFI_SSID[]     = "Thiarawit_2.4G";
const char WIFI_PASSWORD[] = "0924951004";

const char HOST[]       = "script.google.com";
const int  PORT         = 443;
const char PATH[]       = "/macros/s/AKfycbwzr8405rwhLs9fOYd1htASi-cbierpXk-ZdhTvC-xgc0iu89JvKIRKl9cDVNiJO3LD/exec";
const char API_KEY[]    = "ohmlnwza";
WiFiSSLClient net;
HttpClient http(net, HOST, PORT);
unsigned long lastSend = 0;
void connectWiFi() {
  if (WiFi.status() == WL_CONNECTED) return;
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 10000) {
    delay(200);
  }
}

bool sendToSheet(float tempC, float humi) {
  if (WiFi.status() != WL_CONNECTED) connectWiFi();
  if (WiFi.status() != WL_CONNECTED) return false;

  String url = String(PATH) + "?temp=" + String(tempC, 2) + "&moi="  + String(humi, 2) + "&key="  + API_KEY;

  http.beginRequest();
  http.get(url);
  http.sendHeader("Connection", "close");
  http.endRequest();

  int status = http.responseStatusCode();
  http.responseBody();
  http.stop();

  return (status >= 200 && status < 400);
}

// ===== Setup =====
void setup() {
  Serial.begin(115200);
  dht.begin();
  lcd.init();
  lcd.backlight();

  lcd.setCursor(0,0);
  lcd.print("Connecting...");
  connectWiFi();

  lcd.clear();
  if (WiFi.status() == WL_CONNECTED) {
    lcd.print("WiFi Connected");
    lcd.setCursor(0,1);
    lcd.print(WiFi.localIP());
  } else {
    lcd.print("WiFi Failed");
  }
  delay(1500);
  lcd.clear();
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    lcd.clear();
    lcd.print("Sensor Error");
    delay(2000);
    return;
  }

  lcd.clear();
  lcd.setCursor(0,0); lcd.print("Temp: "); lcd.print(t,1); lcd.print("C");
  lcd.setCursor(0,1); lcd.print("Humi: "); lcd.print(h,1); lcd.print("%");

  if (millis() - lastSend > 5000) {
    lastSend = millis();
    bool ok = sendToSheet(t, h);
    Serial.print("Sent → ");
    Serial.print(t, 1);
    Serial.print("C / ");
    Serial.print(h, 1);
    Serial.println(ok ? " OK" : " FAIL");
  }

  delay(500);
}
