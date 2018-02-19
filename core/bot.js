const TelegramBot = require('node-telegram-bot-api');

const UserDBHandler = require("./UserDBHandler");

class Bot {

    constructor(API) {

        this.bot = new TelegramBot(API, {
            polling: true
        });

        this.UserDBHandler = new UserDBHandler();

        this.initializeCommands();

    }

    initializeCommands() {

        this.bot.onText(/\/start/, (msg) => {

            this.UserDBHandler.addUser(msg.chat.id, msg.chat.username).then(() => {

                this.bot.sendMessage(msg.chat.id, "به بات SirSyntax خوش امدید!", {
                    "reply_markup": {
                        "keyboard": [
                            ["مشاهده اساتید", "نظر دادن به اساتید"],
                            ["پیشنهاد افزودن استاد"],
                            ["درباره ما"]
                        ]
                    }
                });

            });

        });

    }
}

module.exports = Bot;