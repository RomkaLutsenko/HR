const TelegramBot = require('node-telegram-bot-api');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// ===== Кнопка "Открыть приложение" =====
const sendAppLink = async (chatId) => {
  const appUrl = process.env.APP_URL;

  await bot.sendMessage(chatId, '🚀 Отлично! Нажмите кнопку ниже, чтобы открыть ServiceHub:', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: '💼 Открыть ServiceHub',
          web_app: { url: appUrl },
        },
      ]],
    },
  });
};

// ===== /start =====
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id;

  if (!telegramId) {
    console.error("Ошибка: msg.from или msg.from.id отсутствует", { msg });
    return bot.sendMessage(chatId, "⚠️ Не удалось определить ваш Telegram ID. Попробуйте снова.");
  }

  try {
    let user = await prisma.user.findUnique({ where: { telegramId } });

    if (!user) {
      user = await prisma.user.create({ data: { telegramId } });
    }

    if (!user.phoneNumber) {
      return bot.sendMessage(chatId, '📱 Пожалуйста, поделитесь своим номером телефона для входа в ServiceHub:', {
        reply_markup: {
          keyboard: [[{ text: '📱 Поделиться контактом', request_contact: true }]],
          one_time_keyboard: true,
          resize_keyboard: true,
        },
      });
    }

    await sendAppLink(chatId);

  } catch (error) {
    console.error('❌ Ошибка в /start:', error);
    await bot.sendMessage(chatId, '⚠️ Произошла ошибка. Попробуйте позже.');
  }
});

// ===== Обработка контакта =====
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id;

  if (!msg.contact || !msg.contact.phone_number) return;

  try {
    const contact = msg.contact;

    const user = await prisma.user.findUnique({ where: { telegramId } });

    if (!user) {
      return bot.sendMessage(chatId, '⚠️ Пользователь не найден. Нажмите /start для начала.');
    }

    if (!user.phoneNumber) {
      await prisma.user.update({
        where: { telegramId },
        data: {
          phoneNumber: contact.phone_number,
          firstName: contact.first_name || null,
          lastName: contact.last_name || null,
        },
      });
    }

    await bot.sendMessage(chatId, `✅ Контакт сохранён: ${contact.phone_number}`);
    await sendAppLink(chatId);

  } catch (error) {
    console.error('❌ Ошибка при обработке контакта:', error);
    await bot.sendMessage(chatId, '⚠️ Произошла ошибка при сохранении. Попробуйте позже.');
  }
});
