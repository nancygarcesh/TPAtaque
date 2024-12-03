// se importan los módulos necesarios: express para el servidor, mqtt para la comunicación mqtt, y body-parser para manejar el cuerpo de las solicitudes
const express = require('express');
const mqtt = require('mqtt');
const bodyParser = require('body-parser');

// se crea la aplicación express
const app = express();
// se define el puerto en el que el servidor escuchará
const PORT = 3000;
// se define la dirección del broker mqtt al que se conectará
const MQTT_BROKER = 'mqtt://research.upb.edu'; 
// se define el topic para enviar comandos a los dispositivos esp32
const MQTT_TOPIC_CONTROL = 'upb/control';
// se define el topic para recibir datos de los dispositivos esp32
const MQTT_TOPIC_DATA = 'upb/data/#';
// se define el puerto en el que se está ejecutando el broker mqtt
const MQTT_PORT = 21602;

// lista para almacenar los dispositivos esp32 conectados
let esp32List = [];  

// se utiliza bodyParser para poder leer los datos JSON en las solicitudes HTTP
app.use(bodyParser.json());

// se conecta al broker mqtt con la configuración especificada
const mqttClient = mqtt.connect(MQTT_BROKER, {
  port: MQTT_PORT
});

// se maneja el evento de conexión al broker mqtt
mqttClient.on('connect', () => {
  console.log(`conectado al broker mqtt en el puerto: ${MQTT_PORT}`);
  // se suscribe al topic para recibir los mensajes de los dispositivos esp32
  mqttClient.subscribe(MQTT_TOPIC_DATA, (err) => {
    if (err) {
      // si ocurre un error al suscribirse, se muestra en la consola
      console.error('error al suscribirse:', err);
    } else {
      // si la suscripción es exitosa, se muestra el mensaje de éxito
      console.log('suscrito al topic: upb/data/#');
    }
  });
});

// se maneja el evento cuando se recibe un mensaje en un topic al que se está suscrito
mqttClient.on('message', (topic, message) => {
  try {
    // se convierte el mensaje a objeto JSON
    const data = JSON.parse(message.toString());
    console.log(`mensaje recibido en ${topic}:`, data);

    // si el esp32 no está en la lista de dispositivos, se agrega
    if (!esp32List.includes(data.esp32)) {
      esp32List.push(data.esp32);
      console.log(`${data.esp32} agregado a la lista.`);
    } 
  } catch (err) {
    // si hay un error al procesar el mensaje, se muestra un mensaje de error
    console.error('error procesando mensaje mqtt:', err);
  }
});




// ruta para controlar los dispositivos esp32
app.post('/control', (req, res) => {
  // se extraen los valores de esp32 y el comando desde el cuerpo de la solicitud
  const { esp32, comando } = req.body;

  // validar que el comando sea "atacar"
  if (comando !== 'atacar') {
    return res.status(400).json({ error: 'El comando debe ser "atacar"' });
  }

  // se define el mensaje de control
  const controlMessage = JSON.stringify({ comando });

  // si no se proporciona un esp32, se envía el mensaje a todos los dispositivos en la lista
  if (!esp32) {
    esp32List.forEach((device) => {
      const deviceMessage = JSON.stringify({ esp32: device, comando });
      // se publica el mensaje en el topic de control
      mqttClient.publish(MQTT_TOPIC_CONTROL, deviceMessage);
    });

    // se responde con un mensaje indicando que se envió a todos los dispositivos
    return res.json({ message: 'Comando "atacar" enviado a todos los dispositivos' });
  }

  // si el esp32 está en la lista, se envía el mensaje solo a ese dispositivo
  if (esp32List.includes(esp32)) {
    const deviceMessage = JSON.stringify({ esp32, comando });
    // se publica el mensaje en el topic de control
    mqttClient.publish(MQTT_TOPIC_CONTROL, deviceMessage);
    // se responde con un mensaje indicando que se envió al dispositivo específico
    return res.json({ message: `Comando "atacar" enviado al esp32 ${esp32}` });
  } else {
    // si el esp32 no está en la lista, se devuelve un error
    return res.status(404).json({ error: `esp32 ${esp32} no encontrado` });
  }
});





// se hace que el servidor escuche en el puerto definido
app.listen(PORT, () => {
  console.log(`servidor escuchando en http://research.upb.edu:${PORT}`);
});
