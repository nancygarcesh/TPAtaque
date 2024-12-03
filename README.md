# Trabajo Práctico #4

## Materia:  
**Sistemas Distribuidos**  

## Docente:  
**Villazón Torrico Alex**  

## Estudiantes:  
- Adriana Claros Salazar  
- Nancy Garces Hazou  
- Diana Grajeda Hidalgo  

---

## Descripción

Este proyecto implementa un sistema IoT utilizando **ESP32**, un servicio backend en **NodeJS** y un **broker MQTT** desplegado con **Docker Compose**. Permite controlar la frecuencia de parpadeo de LEDs en los dispositivos ESP32 de manera individual o grupal, mediante comandos enviados al servidor.

---

## Instrucciones Básicas  

### Localmente:
1. Clonar el repositorio:  
   ```bash
   git clone https://github.com/nancygarcesh/TP4.git
   cd TP4
   ```
2. Construir y levantar los servicios con Docker Compose:  
   ```bash
   docker-compose up --build
   ```
3. Verificar que los contenedores están corriendo:  
   ```bash
   docker ps
   ```
4. Comprobar los logs del servidor MQTT:  
   ```bash
   docker logs mqtt_server
   ```
5. Comprobar los logs del servidor NodeJS:  
   ```bash
   docker logs nodejs_server
   ```

### En los ESP32:
1. Cargar el archivo `main.py` correspondiente a cada estudiante en la plataforma **Thonny**.
2. Conectar el ESP32 al WiFi de **UPB**.  
3. Observar los logs de conexión y mensajes MQTT en la consola.  

---

## Enlace del Repositorio  
[https://github.com/nancygarcesh/TP4.git](https://github.com/nancygarcesh/TP4.git)  