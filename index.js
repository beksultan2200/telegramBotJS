const TelegramApi = require("node-telegram-bot-api");
const {gameOptions, againOptions} = require('./options')
const token = "6339606860:AAHYP2qx6iVJL0FRQGlkJV8ygILJ6-v1fOk";

const bot = new TelegramApi(token, { polling: true });

const chats = {};



const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Сейчас я загадаю цифру от 0 до 9, а ты должен её отгодать!"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Информация о пользователе(О вас)" },
    { command: "/game", description: "Игра угадай цифру" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    console.log(msg);
    console.log(chatId);
    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/ec0/cef/ec0cef02-04d5-4091-a18f-fee3aaf0a0b0/1.webp"
      );
      return bot.sendMessage(
        chatId,
        `Добро пожаловать в телеграм бот Frontend разработчика`
      );
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${
          msg.from.last_name === undefined ? "" : msg.from.last_name
        }`
      );
    }
    if (text === "/game") {
      return startGame(chatId)
    }
    return bot.sendMessage(chatId, "Я тебя не понимаю попробуй ещё раз!");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") {
      return startGame(chatId);
    }
    if (data === chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Поздравляю, ты отгодал цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
