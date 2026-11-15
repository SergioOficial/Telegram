🤖 Telegram IA Bot – Libre Pensamiento

Bot de Telegram con inteligencia artificial para conversación libre (sin censura predefinida) y generación de imágenes. Incluye un sistema de planes con límites diarios, pagos con Estrellas de Telegram y un canal de reportes/sugerencias vía WhatsApp.

---

📋 Características principales

· IA conversacional (/ia): responde preguntas, da opiniones, crea historias y mantiene un modo de “libre pensamiento” sin filtros artificiales.
· Generación de imágenes (/imagen): crea imágenes a partir de una descripción usando la API de Pollinations.ai.
· Sistema de planes:
  · Gratis: 999 imágenes/día (límite simbólico).
  · Semipremium: 15 imágenes/día.
  · Premium: 50 imágenes/día.
  · Creador: ilimitado (solo para el dueño o usuarios autorizados).
· Pagos con Estrellas de Telegram (/comprar): permite adquirir planes de 30 días mediante facturas XTR.
· Donaciones (/donate): acepta Estrellas de Telegram para apoyar el proyecto.
· Reportes y sugerencias (/report): envía mensajes directamente al WhatsApp del administrador usando CallMeBot.
· Comandos informativos: /start, /info, /about, /menu, /miplan, /id.
· Servidor keep‑alive: incluye un servidor Express para mantener el bot activo en plataformas como Render.
· Base de datos ligera: los datos de usuarios y planes se guardan en un archivo usuarios.json.

---

🧠 Tecnologías utilizadas

· Node.js (ES Modules)
· Telegraf – framework para bots de Telegram
· Axios – cliente HTTP para la API de IA (luminsesi)
· node-fetch – peticiones HTTP para generación de imágenes y otras APIs
· Express – servidor web para keep‑alive
· JSON – almacenamiento local de usuarios (usuarios.json)

---

📦 Instalación
 ```bash
npm install git && telegraf
```
 Clona el repositorio
   ```bash
   git clone https://github.com/SergioOficial/Telegram.git
   cd Telegram
   ```
Instala las dependencias
   ```bash
   npm install
   ```
Configura el token del bot
   · Abre index.js y reemplaza la constante BOT_TOKEN con el token que te dio @BotFather.
   · También puedes crear un archivo .env y usar process.env.BOT_TOKEN, pero el código actual lo tiene hardcodeado.
 Configura tu ID de dueño
   · Cambia OWNER_ID por tu ID numérico de Telegram (puedes obtenerlo con @userinfobot).
 Ajusta las APIs (opcional)
   · El bot usa https://ai.siputzx.my.id para la IA y https://image.pollinations.ai para imágenes. Si deseas usar otras APIs, modifica las URLs correspondientes.
 Ejecuta el bot
   ```bash
   node index.js
   ```

---

⚙️ Configuración adicional

· CallMeBot (reportes por WhatsApp):
    El bot envía reportes y sugerencias a un número de WhatsApp mediante CallMeBot. Debes configurar CALLMEBOT_PHONE y CALLMEBOT_APIKEY con tus propios datos (actualmente están hardcodeados).
· Archivo usuarios.json:
    Se crea automáticamente al iniciar. Contiene los planes, fechas de expiración y el conteo diario de imágenes de cada usuario.
· Servidor web (keep‑alive):
    El bot levanta un servidor Express en el puerto process.env.PORT (por defecto 3000). Rutas útiles:
  · / → mensaje de estado.
  · /health → respuesta OK para monitoreo.

---

🕹️ Comandos disponibles

Comando Descripción
/start Mensaje de bienvenida y lista de comandos.
/ia [texto] Consulta a la IA con modo de libre pensamiento.
/imagen [descripción] Genera una imagen a partir del texto.
/miplan Muestra tu plan actual y las imágenes restantes del día.
/comprar Compra un plan (Semipremium, Premium o Creador) con Estrellas.
/donate Apoya el proyecto con Estrellas de Telegram.
/report Envía un reporte o sugerencia al administrador (vía WhatsApp).
/info Información técnica del bot (versión, uptime, ping, etc.).
/about Información sobre el creador y el proyecto.
/menu Menú interactivo con botones.
/id Obtiene el ID de un usuario (respondiendo a un mensaje o mencionándolo).

---

💎 Planes y límites

Plan Límite diario de imágenes Precio (Estrellas)
Gratis 999 (simbólico) –
Semipremium 15 50 ★
Premium 50 100 ★
Creador Ilimitado 200 ★ (solo autorizado)

Los límites se reinician cada día automáticamente.

---

🧪 Uso en producción (Render, Railway, etc.)

El bot incluye un servidor HTTP que responde a pings, lo que permite mantenerlo despierto en servicios como Render. Solo asegúrate de:

1. Definir la variable de entorno PORT (si la plataforma la requiere).
2. Configurar el comando de inicio: node index.js.
3. Mantener el archivo usuarios.json en un volumen persistente (si usas almacenamiento efímero, los datos se perderán al reiniciar).

---

🤝 Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar el bot:

1. Haz un fork del repositorio.
2. Crea una rama con tu feature (git checkout -b feature/nueva-funcion).
3. Realiza tus cambios y haz commit.
4. Envía un pull request.

También puedes reportar errores o sugerir ideas usando el comando /report directamente en el bot.

---

📄 Licencia

Este proyecto no especifica una licencia en el repositorio. Si deseas utilizarlo, contacta al autor para aclarar los términos.

---

📬 Contacto

· Creador: Sergio Gómez Gort (@SergioGGort)
· Canal oficial: https://t.me/SergioBotIA
· Grupo de soporte: https://t.me/+KgwV50l8dxIzYmUx
· Repositorio: https://github.com/SergioOficial/Telegram
