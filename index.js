import { Telegraf } from 'telegraf';
import axios from 'axios';
import fetch from 'node-fetch';

const BOT_TOKEN = '8755783028:AAE2aWyr7qmNpq-acQE2-JcOIkbQ4UZohTY'; // Reemplaza con tu token de @BotFather
const bot = new Telegraf(BOT_TOKEN);

// Configuración del bot
const botname = '𝐀𝐲𝐚𝐬𝐞';
const version = '1.0.1';
const owner = '@SergioGGort'; // o tu usuario de Telegram
const channel = "https://t.me/AyaseBotIA";
const grupoSoporte = 'https://t.me/+KgwV50l8dxIzYmUx';

// Prompt base para libre pensamiento (puedes modificarlo)
const basePromptLibre = `Eres ${botname}, un asistente de IA con libre pensamiento. No tienes censura artificial, puedes dar opiniones, humor, ideas controversiales, creatividad sin límites. Siempre responde de forma útil, coherente y respetuosa en el fondo.`;

// ────────────── COMANDOS BÁSICOS ──────────────

// /start - Mensaje de bienvenida
bot.start(async (ctx) => {
    const nombreUsuario = ctx.from.first_name || 'Usuario';
    const welcomeMsg = `
✨ *¡Bienvenido a ${botname}, ${nombreUsuario}!* ✨

🧠 Soy un asistente de *IA con libre pensamiento* 🤖  
📡 Puedo responder cualquier pregunta, dar opiniones, crear historias, chistes, resolver dudas técnicas y mucho más.

💬 *Comandos disponibles:*  
/ia [texto] → Pregúntame lo que quieras  
/info → Información del bot  
/about → Sobre el creador  
/menu → Menú interactivo  
/donate → Apoyar el proyecto
/report → reporta o suguiere al staff

🚀 *¡Empieza ahora!* Envía:  
\`/ia ¿Cuál es el sentido de la vida?\`

✨ *Disfruta de la libertad de pensar sin censura.* ✨
    `;
    await ctx.replyWithMarkdown(welcomeMsg);
});


// /info - Información técnica
bot.command('info', async (ctx) => {
    const infoMsg = `
📊 *INFORMACIÓN DEL BOT* 📊

🤖 *Nombre:* ${botname}  
🆔 *ID:* ${ctx.botInfo.id}  
📦 *Versión:* ${version}  
⚙️ *Motor:* Node.js + Telegraf  
🧠 *Modelo IA:* Luminesia + APIs libres  
🌐 *Modo:* Libre pensamiento (sin censura predefinida)  
📅 *Estado:* 🟢 Activo

🌿 *Cortesía:* 𝚂𝚕𝚒𝚖𝚎 𝚝𝚎𝚊𝚖 𝐨𝐟𝐢𝐜𝐢𝐚𝐥
💾 *Uptime:* ${process.uptime().toFixed(0)} segundos  
📡 *Ping:* ~${Date.now() - ctx.message.date * 1000} ms

🔐 *Privacidad:* No se guardan conversaciones permanentes.
    `;
    await ctx.replyWithMarkdown(infoMsg);
});

// /about - Sobre el creador
bot.command('about', async (ctx) => {
    const aboutMsg = `👨‍💻 *SOBRE EL CREADOR* 👨‍\n\n✨ *Desarrollado por:* Sergio Gómez Gort  \n🌐 *Web:* [Próximamente]  \n📱 *Contacto:* ${owner}  \n💬 *Canal de novedades:* ${channel || 'No definido'}  \n📚 *Motivación:* Crear una IA sin ataduras, útil y entretenida para la comunidad.\n\n🎯 *Objetivo:* Democratizar el acceso a IA libre en Telegram.\n\n❤️ *Si te gusta el proyecto, comparte y dona para mantenerlo vivo.*    `;
    await ctx.replyWithMarkdown(aboutMsg);
});

// /menu - Menú interactivo con botones
bot.command('menu', async (ctx) => {
    const menuMsg = `
🎛️ *MENÚ PRINCIPAL* 🎛️

Selecciona una opción usando los botones 👇
    `;
    // Botones inline
    const inlineKeyboard = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🤖 Preguntar IA', callback_data: 'ask_ia' }],
                [{ text: '📖 Ayuda', callback_data: 'help_me' }, { text: 'ℹ️ Info', callback_data: 'info_bot' }],
                [{ text: '👨‍💻 Acerca de', callback_data: 'about_dev' }, { text: '💝 Donar', callback_data: 'donate_now' }],
                [{ text: '🔗 Canal oficial', url: 'https://t.me/ayase_ia' }]
            ]
        }
    };
    await ctx.replyWithMarkdown(menuMsg, inlineKeyboard);
});

bot.command('imagen', async (ctx) => {
    const prompt = ctx.message.text.replace('/imagen', '').trim();
    if (!prompt) return ctx.replyWithMarkdown('🖼️ *Uso:* `/imagen descripción de la imagen`');
    
    const { puede, restantes, limite } = puedeGenerar(ctx.chat.id);
    if (!puede) return ctx.replyWithMarkdown(`❌ *Límite diario alcanzado* (${limite} imágenes). Mejora con /comprar.`);
    
    const msg = await ctx.reply(`🎨 Generando imagen para *"${prompt.substring(0, 50)}"*...`);
    try {
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;
        const response = await fetch(url);
        if (!response.ok) throw new Error();
        const buffer = await response.buffer();
        await ctx.telegram.sendPhoto(ctx.chat.id, { source: buffer }, { caption: `✨ *Generado con IA*\n📝 ${prompt}\n🎁 Plan: ${getUsuario(ctx.chat.id).plan}\n🌟 Quedan ${restantes-1} imágenes hoy.` });
        await ctx.deleteMessage(msg.message_id);
        registrarImagen(ctx.chat.id);
    } catch {
        await ctx.reply('❌ Error al generar la imagen. Intenta con otro prompt.');
    }
});

bot.command('miplan', async (ctx) => {
    const u = getUsuario(ctx.chat.id);
    resetDiario(u);
    const limite = getLimite(u.plan);
    const usadas = u.imagenesHoy;
    let nombrePlan = '';
    if (u.plan === 'gratis') nombrePlan = '🆓 Gratuito';
    else if (u.plan === 'semipremium') nombrePlan = '⭐ Semipremium';
    else if (u.plan === 'premium') nombrePlan = '💎 Premium';
    else nombrePlan = '👑 Creador (Ilimitado)';
    
    let expiracion = '';
    if (u.expiracion > Date.now() && u.plan !== 'gratis') {
        const dias = Math.ceil((u.expiracion - Date.now()) / (1000*60*60*24));
        expiracion = ` (vigente ${dias} días)`;
    } else if (u.plan !== 'gratis') expiracion = ` (expirado, renueva con /comprar)`;
    
    await ctx.replyWithMarkdown(`📊 *Tu plan:* ${nombrePlan}${expiracion}\n🖼️ *Imágenes hoy:* ${usadas}/${limite}\n💰 *Mejorar:* /comprar`);
});
// ========== COMANDO /id (obtener ID de usuario) ==========
bot.command('id', async (ctx) => {
    // Caso 1: Respondiendo a un mensaje
    if (ctx.message.reply_to_message) {
        const targetUser = ctx.message.reply_to_message.from;
        await ctx.replyWithMarkdown(
            `🆔 *ID del usuario al que respondiste:*\n` +
            `• ${targetUser.first_name} ${targetUser.last_name || ''}\n` +
            `• Usuario: @${targetUser.username || 'sin username'}\n` +
            `• ID: \`${targetUser.id}\``
        );
        return;
    }
    
    // Caso 2: Mencionando a alguien (ej: /id @usuario)
    const text = ctx.message.text.replace('/id', '').trim();
    if (text.startsWith('@')) {
        const username = text.substring(1);
        // Buscar en el grupo si existe un miembro con ese username
        try {
            const chatMember = await ctx.telegram.getChatMember(ctx.chat.id, `@${username}`);
            const user = chatMember.user;
            await ctx.replyWithMarkdown(
                `🆔 *ID de @${username}:*\n` +
                `• ${user.first_name} ${user.last_name || ''}\n` +
                `• ID: \`${user.id}\``
            );
        } catch (error) {
            await ctx.replyWithMarkdown(`❌ No se encontró al usuario @${username} en este grupo.`);
        }
        return;
    }
    
    // Caso 3: Solo /id -> mostrar ID del propio usuario
    const user = ctx.from;
    await ctx.replyWithMarkdown(
        `🆔 *Tu ID de Telegram:*\n` +
        `• ${user.first_name} ${user.last_name || ''}\n` +
        `• Usuario: @${user.username || 'sin username'}\n` +
        `• ID: \`${user.id}\``
    );
});
bot.command('comprar', async (ctx) => {
    const chatId = ctx.chat.id;
    let buttons = [
        [{ text: '⭐ Semipremium (50★)', callback_data: 'buy_semipremium' }],
        [{ text: '💎 Premium (100★)', callback_data: 'buy_premium' }]
    ];
    if (isCreator(chatId)) {
        buttons.push([{ text: '👑 Creador (200★)', callback_data: 'buy_creador' }]);
    }
    const msg = `💎 *Compra de planes premium* (30 días)\n• Semipremium → 15 imágenes/día → 50★\n• Premium → 50 imágenes/día → 100★\n${isCreator(chatId) ? '• Creador → Ilimitado → 200★' : ''}\nSelecciona:`;
    await ctx.replyWithMarkdown(msg, { reply_markup: { inline_keyboard: buttons } });
});

// Botones de compra
bot.action(/buy_(semipremium|premium|creador)/, async (ctx) => {
    const plan = ctx.match[1];
    const stars = { semipremium: 50, premium: 100, creador: 200 }[plan];
    const payload = `plan_${plan}_${Date.now()}_${ctx.chat.id}`;
    try {
        await ctx.telegram.sendInvoice(ctx.chat.id, {
            title: `Plan ${plan.toUpperCase()}`,
            description: `30 días - ${getLimite(plan)} imágenes/día`,
            payload, provider_token: '', currency: 'XTR',
            prices: [{ label: `Plan ${plan}`, amount: stars }],
            start_parameter: `buy_${plan}`
        });
        await ctx.answerCbQuery();
    } catch { await ctx.answerCbQuery('Error al generar factura', true); }
});

// Pre-checkout (siempre aceptar)
bot.on('pre_checkout_query', async (ctx) => {
    try { await ctx.answerPreCheckoutQuery(true); } catch { await ctx.answerPreCheckoutQuery(false, 'Error'); }
});

// Pago exitoso
bot.on('successful_payment', async (ctx) => {
    const payload = ctx.message.successful_payment.invoice_payload;
    const chatId = ctx.chat.id;
    let plan = null;
    if (payload.includes('semipremium')) plan = 'semipremium';
    else if (payload.includes('premium')) plan = 'premium';
    else if (payload.includes('creador')) plan = 'creador';
    if (!plan) return ctx.reply('❌ Error al identificar el plan.');
    if (plan === 'creador' && !isCreator(chatId)) {
        return ctx.reply('❌ No puedes comprar el plan Creador. Contacta al dueño.');
    }
    comprarPlan(chatId, plan);
    await ctx.replyWithMarkdown(`✅ *¡Plan ${plan.toUpperCase()} activado!*\n🎉 Disfruta de ${getLimite(plan)} imágenes/día por 30 días.\n🖼️ Usa /imagen.`);
    await sendToWhatsApp(`🌟 Nueva compra: @${ctx.from.username || chatId} compró plan ${plan.toUpperCase()}`);
});

bot.command('setcreator', async (ctx) => {
    if (ctx.chat.id !== OWNER_ID) return ctx.reply('❌ Solo el dueño puede usar este comando.');
    const args = ctx.message.text.split(' ');
    if (args.length < 2) return ctx.reply('Uso: `/setcreator <userId>`', { parse_mode: 'Markdown' });
    const targetId = parseInt(args[1]);
    if (isNaN(targetId)) return ctx.reply('❌ El ID debe ser un número.');
    if (!CREATOR_WHITELIST.has(targetId)) {
        CREATOR_WHITELIST.add(targetId);
        comprarPlan(targetId, 'creador'); // actualiza DB
        await ctx.reply(`✅ Usuario ${targetId} ahora es **Creador** (plan ilimitado).`);
    } else {
        await ctx.reply(`ℹ️ El usuario ${targetId} ya es creador.`);
    }
});

// ========== CONFIGURACIÓN PARA PLANES E IMÁGENES ==========
import fs from 'fs';

const DB_FILE = './usuarios.json';
const OWNER_ID = 7226823699; // ¡CAMBIA POR TU ID REAL! (obténlo con @userinfobot)
let CREATOR_WHITELIST = new Set([OWNER_ID]); // solo tú al inicio

// Base de datos de usuarios
let usuarios = {};
if (fs.existsSync(DB_FILE)) {
    usuarios = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}
function saveDB() { fs.writeFileSync(DB_FILE, JSON.stringify(usuarios, null, 2)); }
function getUsuario(chatId) {
    if (!usuarios[chatId]) {
        usuarios[chatId] = { plan: 'gratis', expiracion: 0, imagenesHoy: 0, ultimoReset: Date.now() };
        saveDB();
    }
    return usuarios[chatId];
}
function resetDiario(u) {
    const hoy = new Date().toDateString();
    if (hoy !== new Date(u.ultimoReset).toDateString()) {
        u.imagenesHoy = 0;
        u.ultimoReset = Date.now();
        saveDB();
    }
}
function getLimite(plan) {
    if (plan === 'creador') return 999;
    if (plan === 'premium') return 50;
    if (plan === 'semipremium') return 15;
    return 999;
}
function puedeGenerar(chatId) {
    const u = getUsuario(chatId);
    resetDiario(u);
    const limite = getLimite(u.plan);
    return { puede: u.imagenesHoy < limite, restantes: limite - u.imagenesHoy, limite };
}
function registrarImagen(chatId) {
    const u = getUsuario(chatId);
    u.imagenesHoy++;
    saveDB();
}
function comprarPlan(chatId, plan) {
    const u = getUsuario(chatId);
    u.plan = plan;
    u.expiracion = Date.now() + 30*24*60*60*1000;
    u.imagenesHoy = 0;
    if (plan === 'creador') CREATOR_WHITELIST.add(chatId);
    saveDB();
}
function isCreator(chatId) { return CREATOR_WHITELIST.has(chatId); }

// Reconstruir whitelist desde la DB
for (const [id, data] of Object.entries(usuarios)) {
    if (data.plan === 'creador') CREATOR_WHITELIST.add(parseInt(id));
}

// ────────────── COMANDO /report con CallMeBot ──────────────

const userReportState = new Map();
const CALLMEBOT_PHONE = '5354386852';
const CALLMEBOT_APIKEY = '4114733';

bot.command('report', async (ctx) => {
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📝 Reportar algo', callback_data: 'report_type_report' },
          { text: '💡 Hacer una sugerencia', callback_data: 'report_type_suggestion' }
        ]
      ]
    }
  };
  await ctx.replyWithMarkdown(
    `📢 *¿Qué deseas hacer?*\n\n` +
    `• *Reportar*: errores, mal funcionamiento, contenido inapropiado.\n` +
    `• *Sugerir*: nuevas ideas, funciones, mejoras.\n\n` +
    `Selecciona una opción:`,
    keyboard
  );
});

bot.action(/report_type_(.+)/, async (ctx) => {
  const type = ctx.match[1];
  const chatId = ctx.chat.id;
  userReportState.set(chatId, { type });
  await ctx.answerCbQuery();
  let msg = '';
  if (type === 'report') {
    msg = `📝 *Reporte*\n\nPor favor, escribe tu reporte en un solo mensaje. Describe el problema con detalle.\n\n✏️ *Envía tu mensaje ahora:*`;
  } else {
    msg = `💡 *Sugerencia*\n\nCuéntame tu idea o mejora.\n\n✏️ *Escribe tu sugerencia:*`;
  }
  await ctx.replyWithMarkdown(msg);
});

bot.on('text', async (ctx, next) => {
  const chatId = ctx.chat.id;
  const state = userReportState.get(chatId);
  if (!state) return next();

  const userMessage = ctx.message.text;
  const type = state.type;
  const username = ctx.from.username || ctx.from.first_name || 'Anónimo';
  const userId = ctx.from.id;

  const whatsappMessage = 
    `🔔 NUEVO ${type === 'report' ? 'REPORTE' : 'SUGERENCIA'} 🔔\n` +
    `👤 Usuario: @${username} (ID: ${userId})\n` +
    `📱 Chat: ${chatId}\n` +
    `📝 Contenido:\n${userMessage}\n\n` +
    `Responder desde Telegram: t.me/${username}`;

  const success = await sendToWhatsApp(whatsappMessage); // ya no necesitas pasar el número

  if (success) {
    await ctx.replyWithMarkdown(
      `✅ *¡Gracias!* Tu ${type === 'report' ? 'reporte' : 'sugerencia'} ha sido enviado al administrador.\n\n` +
      `📬 Recibirá atención en breve.`
    );
  } else {
    await ctx.replyWithMarkdown(
      `❌ *Error al enviar* tu mensaje. Por favor, intenta más tarde o contacta directamente al dueño del bot.\n` +
      `🔧 El servicio de WhatsApp no está disponible temporalmente.`
    );
  }
  userReportState.delete(chatId);
});

// Función que usa CallMeBot con tu API Key
async function sendToWhatsApp(message) {
  const url = `https://api.callmebot.com/whatsapp.php?phone=${CALLMEBOT_PHONE}&text=${encodeURIComponent(message)}&apikey=${CALLMEBOT_APIKEY}`;
  try {
    const response = await fetch(url);
    const responseText = await response.text();
    if (responseText.includes('Message sent') || response.ok) {
      console.log('✅ WhatsApp enviado');
      return true;
    } else {
      console.error('Error CallMeBot:', responseText);
      return false;
    }
  } catch (err) {
    console.error('Excepción en CallMeBot:', err.message);
    return false;
  }
}
bot.command('donate', async (ctx) => {
    const donateMsg = `
💝 *APOYA EL PROYECTO* 💝

Mantener este bot con IA libre tiene costos de servidores, APIs y tiempo.

✨ *Puedes colaborar mediante:*
• *Estrellas de Telegram*: Usa los botones abajo para donar.
• PayPal: \`No tengo por ahora\`
• Cryptos: \`No tengo por ahora\`
• Patreon: [Enlace]

🎁 *Los donantes reciben:*
✅ Prioridad en respuestas
✅ Acceso a funciones experimentales
✅ Nombre en lista de colaboradores

🙏 *Gracias por tu apoyo, cada grano cuenta.*
    `;
    
    const starButtons = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⭐ 5 Estrellas', callback_data: 'donate_stars_5' }, { text: '⭐ 10 Estrellas', callback_data: 'donate_stars_10' }],
                [{ text: '⭐ 25 Estrellas', callback_data: 'donate_stars_25' }, { text: '⭐ 50 Estrellas', callback_data: 'donate_stars_50' }],
                [{ text: '⭐ 100 Estrellas', callback_data: 'donate_stars_100' }]
            ]
        }
    };
    
    await ctx.replyWithMarkdown(donateMsg, starButtons);
});
// ────────────── COMANDO IA (LIBRE PENSAMIENTO) ──────────────
bot.command('ia', async (ctx) => {
    const text = ctx.message.text.replace('/ia', '').trim();
    if (!text) {
        return ctx.replyWithMarkdown(`✧ *${botname}* ✧\n\nEscribe una *petición* después del comando.\n\nEjemplo: \`/ia ¿Qué es el amor?\``);
    }

    const username = ctx.from.first_name || 'Usuario';
    const promptCompleto = `${basePromptLibre}. Responde de forma directa, creativa y sin censura: ${text}`;

    // Mensaje de "procesando..."
    const waitMsg = await ctx.reply(`⏳ *${botname}* está pensando libremente...`);

    try {
        let responseText = null;

        // 1) Intentar con luminsesi
        try {
            responseText = await luminsesi(text, username, promptCompleto);
        } catch (err) {
            console.error('Error en luminsesi:', err.message);
        }

        // 2) Fallback a APIs externas (ajusta las URLs y claves)
        if (!responseText) {
            const apis = [
                `https://api.stellar.example/ai/gptprompt?text=${encodeURIComponent(text)}&prompt=${encodeURIComponent(basePromptLibre)}&key=TU_STELLAR_KEY`,
                `https://api.sylphy.example/ai/gemini?q=${encodeURIComponent(text)}&prompt=${encodeURIComponent(basePromptLibre)}&api_key=TU_SYLPHY_KEY`
            ];
            for (const url of apis) {
                try {
                    const res = await fetch(url);
                    const json = await res.json();
                    if (json?.result?.text) { responseText = json.result.text; break; }
                    if (json?.result) { responseText = json.result; break; }
                    if (json?.results) { responseText = json.results; break; }
                } catch (err) {}
            }
        }

        if (!responseText) {
            return ctx.reply('❌ No se pudo obtener una respuesta válida. Intenta de nuevo más tarde.');
        }

        // Editar el mensaje de espera con la respuesta
        await ctx.telegram.editMessageText(ctx.chat.id, waitMsg.message_id, null, responseText.trim());
    } catch (error) {
        console.error(error);
        await ctx.reply(`⚠️ Error inesperado: ${error.message}`);
    }
});

// ────────────── MANEJADOR DE CALLBACKS (para menú) ──────────────
bot.action('ask_ia', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('✍️ Envía tu pregunta usando el comando `/ia [tu pregunta]`', { parse_mode: 'Markdown' });
});
bot.action('help_me', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.replyWithMarkdown('🌿 Puedes contactar 🧩 con nuestro *soporte*\n\n *Primero* \`presione\` el siguiente link eso lo llevará al contacto oficial del bot en *WhatsApp* 🪀, y diga que quiere reportar\n\nhttps://wa.me/5354386852?text=*Soy+del+telegram*+y+vengo+a+reportar+o+preguntar+algo');
});
bot.action('info_bot', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.replyWithMarkdown('ℹ️ Usa `/info` para datos técnicos.');
});
bot.action('about_dev', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.replyWithMarkdown('👨‍💻 Usa `/about` para conocer al creador.');
});
bot.action('donate_now', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.replyWithMarkdown('💝 Usa `/donate` para ver cómo apoyar.');
});

// ────────────── FUNCIÓN LUMINSESI ──────────────
async function luminsesi(q, username, logic) {
    const res = await axios.post("https://ai.siputzx.my.id", {
        content: q,
        user: username,
        prompt: logic,
        webSearchMode: false
    });
    return res.data.result;
}
// ────────────── DONACIONES CON ESTRELLAS DE TELEGRAM ──────────────

// Maneja los botones de donación (cada botón envía una factura)
bot.action(/donate_stars_(\d+)/, async (ctx) => {
    const stars = parseInt(ctx.match[1]);
    const chatId = ctx.chat.id;
    const invoicePayload = `donation_${stars}_${Date.now()}_${chatId}`;
    try {
        await ctx.telegram.sendInvoice(chatId, {
            title: '🌟 Donación con Estrellas',
            description: `Apoya a ${botname} con ${stars} Estrellas. ¡Gracias por tu contribución!`,
            payload: invoicePayload,
            provider_token: '', // obligatorio pero vacío para Stars
            currency: 'XTR',    // moneda de Estrellas de Telegram
            prices: [{ label: 'Donación', amount: stars }],
            start_parameter: 'donate_stars',
        });
        await ctx.answerCbQuery(); // cierra la animación del botón
    } catch (error) {
        console.error('Error enviando factura:', error);
        await ctx.answerCbQuery('❌ Error al generar la factura. Intenta de nuevo.', true);
    }
});

// Verificación previa al pago (siempre aceptamos porque es donación)
bot.on('pre_checkout_query', async (ctx) => {
    try {
        await ctx.answerPreCheckoutQuery(true);
    } catch (error) {
        console.error('Error en pre_checkout:', error);
        await ctx.answerPreCheckoutQuery(false, 'Error al procesar el pago.');
    }
});

// Pago exitoso
bot.on('successful_payment', async (ctx) => {
// dentro de bot.on('successful_payment', ...)
const notifyMsg = `🌟 Nueva donación de ${stars} Stars por @${ctx.from.username || ctx.from.id}`;
await sendToWhatsApp(notifyMsg);
    const payment = ctx.message.successful_payment;
    const stars = payment.total_amount; // cantidad de Estrellas donadas
    await ctx.replyWithMarkdown(
        `🌟 *¡Muchas gracias por tu donación de ${stars} Estrellas!* 🌟\n\n` +
        `Tu apoyo ayuda a mantener el bot funcionando y a mejorar sus capacidades. 🙏\n\n` +
        `🎁 *Beneficio:* Tendrás prioridad en respuestas durante 7 días. (Implementando...)\n\n` +
        `Si tienes alguna pregunta, contacta a @SergioGGort.`
    );
    // Aquí puedes guardar en una base de datos la donación (usuario, estrellas, fecha)
    console.log(`Donación recibida: ${stars} Stars de @${ctx.from.username || ctx.from.id}`);
});

// ========== SERVIDOR WEB PARA KEEP-ALIVE EN RENDER ==========
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Ruta que usaremos para hacer ping
app.get('/', (req, res) => {
  res.send('🤖 Bot funcionando 24/7');
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Iniciar servidor web
app.listen(PORT, () => {
  console.log(`✅ Servidor web activo en puerto ${PORT}`);
});

// ────────────── INICIAR BOT ──────────────
bot.launch().then(() => {
    console.log(`✅ Bot ${botname} iniciado en Telegram (Termux)`);
});

// Manejo graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
