const TelegramBot = require('node-telegram-bot-api');
const { PrismaClient } = require('./generated/prisma');
const { encode } = require('next-auth/jwt');
require('dotenv').config();

const prisma = new PrismaClient();
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

const SEVEN_DAYS = 7 * 24 * 60 * 60; // в секундах (для encode, не миллисекундах)

// Обработка команды /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id;

  try {
    let user = await prisma.user.findUnique({ where: { telegramId } });

    if (!user) {
      user = await prisma.user.create({ data: { telegramId } });
    }

    if (!user.phoneNumber) {
      return bot.sendMessage(chatId, '📱 Пожалуйста, поделитесь контактом для входа:', {
        reply_markup: {
          keyboard: [[{ text: '📱 Поделиться контактом', request_contact: true }]],
          one_time_keyboard: true,
          resize_keyboard: true,
        },
      });
    }

    const now = new Date();
    let token = user.jwtToken;
    if (!token || !user.jwtTokenExpiresAt || user.jwtTokenExpiresAt < now) {
      token = await encode({
        secret: process.env.JWT_SECRET,
        token: {
          id: user.id,
          telegramId: user.telegramId,
        },
        maxAge: SEVEN_DAYS,
      });

      await prisma.user.update({
        where: { id: user.id },
        data: {
          jwtToken: token,
          jwtTokenExpiresAt: new Date(now.getTime() + SEVEN_DAYS * 1000),
        },
      });
    }

    const appUrlWithToken = `${process.env.APP_URL}`;

    await bot.sendMessage(chatId, '👋 Добро пожаловать! Нажмите кнопку ниже, чтобы открыть приложение:', {
      reply_markup: {
        inline_keyboard: [[
          {
            text: '🚀 Открыть приложение',
            web_app: { url: appUrlWithToken },
          },
        ]],
      },
    });

  } catch (error) {
    console.error('❌ Ошибка в /start:', error);
    bot.sendMessage(chatId, 'Произошла ошибка. Попробуйте позже.');
  }
});

// Обработка контакта
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  if (!msg.contact) return;

  try {
    const contact = msg.contact;
    const telegramId = msg.from.id;

    if (!contact.phone_number) {
      return bot.sendMessage(chatId, 'Пожалуйста, поделитесь номером телефона.');
    }

    console.log('📲 Получен контакт:', contact);

    let user = await prisma.user.upsert({
      where: { telegramId },
      update: {
        phoneNumber: contact.phone_number,
        firstName: contact.first_name || null,
        lastName: contact.last_name || null,
      },
      create: {
        telegramId,
        phoneNumber: contact.phone_number,
        firstName: contact.first_name || null,
        lastName: contact.last_name || null,
      },
    });

    console.log('✅ Пользователь сохранён в БД:', user);

    const now = new Date();
    let token = user.jwtToken;
    if (!token || !user.jwtTokenExpiresAt || user.jwtTokenExpiresAt < now) {
      token = await encode({
        secret: process.env.JWT_SECRET,
        token: {
          id: user.id,
          telegramId: user.telegramId,
        },
        maxAge: SEVEN_DAYS,
      });

      await prisma.user.update({
        where: { id: user.id },
        data: {
          jwtToken: token,
          jwtTokenExpiresAt: new Date(now.getTime() + SEVEN_DAYS * 1000),
        },
      });
    }

    const appUrlWithToken = `${process.env.APP_URL}`;

    await bot.sendMessage(chatId, '✅ Контакт сохранён. Нажмите кнопку ниже, чтобы запустить приложение:', {
      reply_markup: {
        inline_keyboard: [[
          {
            text: '🚀 Открыть приложение',
            web_app: { url: appUrlWithToken }
          },
        ]],
      },
    });

  } catch (error) {
    console.error('❌ Ошибка при сохранении контакта:', error);
    await bot.sendMessage(chatId, 'Произошла ошибка при сохранении. Попробуйте позже.');
  }
});