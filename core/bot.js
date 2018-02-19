const TelegramBot = require('node-telegram-bot-api');

const UserDBHandler = require("./UserDBHandler");

const TeacherDBHandler = require("./TeacherDBHandler");

const VoteDBHandler = require("./VoteDBHandler");

class Bot {

    constructor(API) {

        this.bot = new TelegramBot(API, {
            polling: true
        });

        this.UserDBHandler = new UserDBHandler();

        this.TeacherDBHandler = new TeacherDBHandler();

        this.VoteDBHandler = new VoteDBHandler();

        this.initializeCommands();

    }

    initializeCommands() {

        this.bot.onText(/\/start/, (msg) => {

            this.UserDBHandler.addUser(msg.chat.id, msg.chat.username).then(() => {

                this.bot.sendMessage(msg.chat.id, "به بات SirSyntax خوش امدید!", {
                    reply_markup: {
                        "keyboard": [["مشاهده اساتید", "نظر دادن به اساتید"],   ["پیشنهاد افزودن استاد"], ["درباره ما"]]
                    }
                })
            });

        });

        this.bot.onText(/مشاهده اساتید/,(msg)=>{
            
            this.sendCats(msg.chat.id)
            
        })

        this.bot.onText(/نظر دادن به اساتید/,(msg)=>{

            this.bot.sendMessage(msg.chat.id,"BITCH")

        })

        this.bot.onText(/پیشنهاد افزودن استاد/,(msg)=>{

            this.bot.sendMessage(msg.chat.id,"BITCH")

        })

        this.bot.onText(/درباره ما/,(msg)=>{

            this.bot.sendMessage(msg.chat.id,"BITCH")

        })

        //////

        this.bot.on("callback_query",response=>{

            if(/cat-\d+/i.test(response.data)){

                let result = /cat-(\d)+/i.exec(response.data);

                let catId = parseInt(result[1]);
                
                this.sendTeachers(response.message.chat.id,catId,response.id);

            }else if(/teacher-\d+/i.test(response.data)){

                let result = /teacher-(\d)+/i.exec(response.data);

                let teacherId = parseInt(result[1]);
                
                this.sendResult(response.message.chat.id,teacherId,response.id);

            }

        })

    }

    sendCats(chatId){
        
        let keyboards = this._createKeyboardFromObject(this.TeacherDBHandler.cats,"cat");

        this.bot.sendMessage(chatId,"گروه آموزشی مورد نظر خود را انتخاب کنید.",{
            reply_markup: {
                inline_keyboard: keyboards
            }
        });
    }

    sendTeachers(chatId,catId,callBackId){

        let teachers = this.TeacherDBHandler.filterByCat(catId);

        let keyboards = this._createKeyboardFromObject(this.TeacherDBHandler.teachers,"teacher");

        this.bot.sendMessage(chatId,"استاد مورد نظر خود را انتخاب کنید.",{
            reply_markup: {
                inline_keyboard: keyboards
            }
        });

        this.bot.answerCallbackQuery(callBackId);

    }

    sendResult(chatId,teacherId,callBackId){

        let teacherVote = this.VoteDBHandler.getVotesByTeacher(teacherId);

        let parsedVote = this.VoteDBHandler.parseVote(teacherVote,this.TeacherDBHandler.getTeacherNameById(teacherId));

        this.bot.sendMessage(chatId,parsedVote);

        this.bot.answerCallbackQuery(callBackId);

    }

    ///

    _createKeyboardFromObject(items,prefix){
        let keyboards = [];
        let temp = [];
        let i =0;

        for(let item of items){
            if((i%2==0 && i!=0)){
                keyboards.push(temp);
                temp = [];
            }

            temp.push({text:item.name,callback_data:prefix+"-"+item.id});

            if(i == items.length-1){
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