const config = require("../Config/Config");

const Bot = require("./Bot");

const bot = new Bot(config.general.API, config.general.ID);

// Modeles

const Users = require("../Modeles/Users");

const Unies = require("../Modeles/Universities");

const Teachers = require("../Modeles/Teachers");

const Cats = require("../Modeles/Cats");

/**
 * 
 * @param {Object} msg
 * 
 * @description checks if user exists in DB. if it doesn't, it will add him/her to the DB.
 * 
 */

bot.auth = (msg) => {

    msg = msg.chat || msg.message.chat;

    return new Promise((resolve) => {
        Users.findOne({
            chatID: msg.id
        }).then((data) => {
            if (data === null) {
                // Make new user

                let newUser = new Users({
                    username: msg.username,
                    name: msg.first_name,
                    lastName: msg.last_name,
                    chatID: msg.id
                });

                newUser.save().then(() => {
                    resolve();
                })

            } else {
                resolve();
            }
        })
    })
}

// Adding middlewares

bot.addMiddleWare("university", function (msg) {
    return new Promise((resolve, reject) => {
        Users.findOne({
            chatID: msg.chat.id
        }).then((user) => {
            if (user.university === null) {
                this["cmd_selectUniversity"](msg);
                reject();
            } else {
                // good to go
                resolve();
            }
        });
    })
});

// commands

bot.addCommand("selectUniversity", "انتخاب دانشگاه", (msg) => {

    Unies.find({}, "name").then((data) => {

        const keyboard = bot.createInlineKeyboard(data, "select-uni", 1);

        bot.sendMessage(msg, "دانشگاه مورد نظر خود را انتخاب کنید.", {
            reply_markup: {
                inline_keyboard: keyboard
            }
        }, {
            sign: false
        })

    });
})

// CallBacks

bot.addCallBack("cb_select_uni", /select-uni-(\d+)/i, (data) => {

});

bot.addCallBack("cb_cat", /lessen-cat-(\d+)/i, (data) => {

});