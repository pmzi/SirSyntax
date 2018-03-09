const TelegramAPI = require("node-telegram-bot-api");

class Bot {

    constructor(API, ID) {

        // ID --> @...Bot

        this.ID = ID;

        // Making new bot

        this.bot = new TelegramAPI(API, {
            polling: true
        });

        // Commands

        this.cmds = [];

        // CallBacks 

        this.callBacks = [];

        // Default keyboard

        this.keyboard = {
            "reply_markup": {
                "keyboard": [
                    ["مشاهده اساتید", "نظر دادن به اساتید"],
                    ["پیشنهاد افزودن استاد"],
                    ["درباره ما"]
                ]
            }
        };

        // Let's start

        this.init();


    }

    /**
     * 
     * @description listens on events
     * 
     */

    init() {

        // Receives every message and searches for the related commands
        this.bot.on("message", (msg) => {
            this.auth(msg).then(()=>{
                this.findTask(msg.chat.id).then((task)=>{
                    if(task == "false"){
                        this.run(msg);
                    }else{
                        let args = /(.+):(.+)/i.exec(task);
                        this[args[1]](msg,args);
                        this.clearTask(msg.chat.id);
                    }
                })
            });
        })

        // Receives callbacks and directs them to the proper callback method

        this.bot.on("callback_query", (msg) => {
            this.auth(msg).then(()=>{
                this.answerCallBackQuery(msg);
            });
        })
    }

    /**
     * 
     * @description authentication middleware
     * 
     */

    auth(){
        return false;
    }

    /**
     * 
     * @param {String} name
     * 
     * @param {String} pattern
     * 
     * @param {Function} cb
     * 
     * @param {String} middleware
     * 
     */

    addCommand(name, pattern, cb, middleware) {
        this.cmds.push({
            name: name,
            pattern: pattern,
            middleware:middleware || null
        });

        this["cmd_" + name] = cb;
    }

    /**
     * 
     * @param {String} name
     * 
     * @param {RegEx} pattern
     * 
     * @param {Function} cb
     * 
     */

    addCallBack(name, pattern, cb) {
        this.callBacks.push({
            name: name,
            pattern: new RegExp(pattern,"i")
        });

        this["clb_" + name] = cb;

    }

    /**
     * 
     * @param {String} name
     * 
     * @param {Function} cb
     * 
     */

    addMiddleWare(name,cb){
        this["middle_" + name] = cb;
    }

    /**
     * 
     * @param {Number} chatID
     * 
     * @param {String} cmdName
     * 
     */

    addTaskToUser(chatID, cmdName){
        return false;
    }

    /**
     * 
     * @param {Number} chatID
     * 
     */

    clearTask(chatID){
        return false;
    }

    /**
     * 
     * @param {Number} chatID
     * 
     */

    findTask(chatID){
        return false;
    }

    /**
     * 
     * @param {Object} msg
     * 
     * @param {String} text
     * 
     * @param {Object} keyboard
     * 
     * @param {Object} options
     * 
     */

    sendMessage(msg, text, keyboard, options = {
        sign: true
    }) {

        if(options.sign){
            text += "\n\n"+this.ID;
        }

        this.bot.sendMessage(msg.chat.id, text, keyboard || this.keyboard);
    }

    /**
     * 
     * @param {Object} msg
     * 
     */

    commandNotFound(msg) {
        this.sendMessage(msg, "دستور مورد نظر یافت نشد.");
    }

    /**
     * 
     * @param {Object} msg
     * 
     */

    run(msg) {

        let messageText = msg.text;

        for (let command of this.cmds) {
            if (messageText == command.pattern) {
                if(command.middleware){

                    this["middle_" + command.middleware](msg).then(()=>{
                        // Let's execute the command
                        this["cmd_" + command.name](msg);
                    }).catch(()=>{
                        // catch
                    });

                }else{
                    // Let's execute the command
                    this["cmd_" + command.name](msg);
                }

                return true;

            }
        }

        // Command not found!

        this.commandNotFound(msg);

    }

    /**
     * 
     * @param {Object} response
     * 
     */

    answerCallBackQuery(response) {

        let data = response.data;

        for(let callBack of this.callBacks){
            if(callBack.pattern.test(data)){
                this["clb_" + callBack.name](callBack.pattern.exec(data),response.message);
            }
        }

        // ِDeleting last message


        this.bot.deleteMessage(response.message.chat.id,response.message.message_id)

        this.bot.answerCallbackQuery(response.id);

    }

    /**
     * 
     * @param {Array Of Objects} items
     * 
     * @param {String} prefix
     * 
     * @param {Number} perRow
     * 
     */

    createInlineKeyboard(items, prefix,perRow,textKey,callbackDataKey) {
        let keyboards = [];
        let temp = [];
        let i = 0;

        for (let item of items) {
            if ((i % (perRow || 2) == 0 && i != 0)) {
                keyboards.push(temp);
                temp = [];
            }
            temp.push({
                text: (item[textKey] || item.name),
                callback_data: prefix + "-" + (item[callbackDataKey] || item._id)
            });

            if (i == items.length - 1) {
                //the end
                keyboards.push(temp);
                temp = [];
            }

            i++;

        }

        return keyboards;
    }

}

module.exports = Bot;