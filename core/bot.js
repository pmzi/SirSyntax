const TelegramBot = require('node-telegram-bot-api');

const UserDBHandler = require("./UserDBHandler");

const TeacherDBHandler = require("./TeacherDBHandler");

const VoteDBHandler = require("./VoteDBHandler");

const NewTeacherDBHandler = require("./NewTeacherDBHandler");

const questions = require('../config/questions');

class Bot {

    constructor(API) {

        this.bot = new TelegramBot(API, {
            polling: true
        });

        this.UserDBHandler = new UserDBHandler();

        this.TeacherDBHandler = new TeacherDBHandler();

        this.VoteDBHandler = new VoteDBHandler();

        this.NewTeacherDBHandler = new NewTeacherDBHandler();

        this.questions = questions;

        this.initializeCommands();

    }

    initializeCommands() {

        this.bot.onText(/\/start/, (msg) => {

            this.UserDBHandler.addUser(msg.chat.id, msg.chat.username).then(() => {

                this.bot.sendMessage(msg.chat.id, "به بات SirSyntax خوش امدید!", {
                    reply_markup: {
                        "keyboard": [
                            ["مشاهده اساتید", "نظر دادن به اساتید"],
                            ["پیشنهاد افزودن استاد"],
                            ["درباره ما"]
                        ]
                    }
                })
            });

        });

        this.bot.onText(/مشاهده اساتید/, (msg) => {

            this.sendCats(msg.chat.id, 1)

        })

        this.bot.onText(/نظر دادن به اساتید/, (msg) => {

            this.sendCats(msg.chat.id, 2);

        })

        this.bot.onText(/پیشنهاد افزودن استاد/, (msg) => {

            this.sendCats(msg.chat.id,3);

        })

        this.bot.onText(/درباره ما/, (msg) => {

            console.log(msg);

            this.bot.sendMessage(msg.chat.id, "BITCH")

        })

        //////

        this.bot.on("callback_query", response => {

            //deleting bot's message
            this.bot.deleteMessage(response.message.chat.id,response.message.message_id);

            if (/cat-get-\d+/i.test(response.data)) {

                let result = /cat-get-(\d)+/i.exec(response.data);

                let catId = parseInt(result[1]);

                this.sendTeachers(response.message.chat.id, catId, response.id);

            } else if (/teacher-get-\d+/i.test(response.data)) {

                let result = /teacher-get-(\d)+/i.exec(response.data);

                let teacherId = parseInt(result[1]);

                this.sendResult(response.message.chat.id, teacherId, response.id);
            } else if (/cat-vote-\d+/i.test(response.data)) {
                let result = /cat-vote-(\d)+/i.exec(response.data);

                let catId = parseInt(result[1]);

                this.sendTeachers(response.message.chat.id, catId, response.id, 2);
            }else if (/cat-newTeacher-\d+/i.test(response.data)) {

                let result = /cat-newTeacher-(\d)+/i.exec(response.data);

                let catId = parseInt(result[1]);

                this.addNewTeacher(catId,response.message.chat.id)

            } else if (/teacher-vote-\d+/i.test(response.data)) {

                let result = /teacher-vote-(\d)+/i.exec(response.data);

                let teacherId = parseInt(result[1]);

                if(this.VoteDBHandler.addVote(teacherId,response.message.chat.id)){

                    this.askQuestion(1, response.message.chat.id,teacherId);

                }else{

                    this.bot.sendMessage(response.message.chat.id,"شما قبلا به این استاد نظر داده‌اید.");

                }

            } else if (/\d+-question-\d+-\d+/i.test(response.data)) {

                let result = /(\d+)-question-(\d+)-(\d+)/i.exec(response.data);

                let questionId = parseInt(result[1]);

                let questionMark = parseInt(result[2]);

                let teacherId = parseInt(result[3]);

                console.log(questionId)

                this.VoteDBHandler.editVote(questionId,questionMark,teacherId,response.message.chat.id);
                
                if(this.questions.length != questionId){
                    this.askQuestion(questionId + 1, response.message.chat.id,teacherId);
                }else{
                    this.bot.sendMessage(response.message.chat.id,"ممنون بابت پاسخگویی به سوالات.");
                }

            }

        })

    }

    sendCats(chatId, type = 1) { // type = 2 --> vote, type = 3 --> add teacher request

        let prefix = "-get";

        if (type == 2) {

            prefix = "-vote";

        }else if(type == 3){
            prefix = "-newTeacher";
        }

        let keyboards = this._createKeyboardFromObject(this.TeacherDBHandler.cats, "cat" + prefix);

        this.bot.sendMessage(chatId, "گروه آموزشی مورد نظر خود را انتخاب کنید.", {
            reply_markup: {
                inline_keyboard: keyboards
            }
        });
    }

    sendTeachers(chatId, catId, callBackId, type = 1) { // type = 2 --> add vote

        let prefix = "-get";

        if (type == 2) {

            prefix = "-vote";

        }

        let teachers = this.TeacherDBHandler.filterByCat(catId);

        let keyboards = this._createKeyboardFromObject(teachers, "teacher" + prefix);

        this.bot.sendMessage(chatId, "استاد مورد نظر خود را انتخاب کنید.", {
            reply_markup: {
                inline_keyboard: keyboards
            }
        });

        this.bot.answerCallbackQuery(callBackId);

    }

    sendResult(chatId, teacherId, callBackId) {

        let teacherVote = this.VoteDBHandler.getVotesByTeacher(teacherId);

        let parsedVote = this.VoteDBHandler.parseVote(teacherVote, this.TeacherDBHandler.getTeacherNameById(teacherId));

        this.bot.sendMessage(chatId, parsedVote);

        this.bot.answerCallbackQuery(callBackId);

    }

    askQuestion(index, chatId,teacherId) {

        //crateKeyboard

        let keyboards = this._createKeyboardForQuestion(index,teacherId);

        console.log(this.questions)

        this.bot.sendMessage(chatId, this.questions[index - 1].text, {
            reply_markup: {
                inline_keyboard: keyboards
            }
        });

    }

    addNewTeacher(catId,chatId){

        this.bot.sendMessage(chatId,"با reply کردن این پیام، نام استاد را بنویسید.").then((msg)=>{

            this.bot.onReplyToMessage(chatId,msg.message_id,(response)=>{

                let name = response.text;

                if(!this.TeacherDBHandler._checkTeacherExistance(name,catId)){
                    console.log("a")
                    if(this.NewTeacherDBHandler.addTecher(name,catId,chatId)){
                        console.log("b")
                        this.bot.sendMessage(chatId,"استاد پس از تایید، ثبت خواهد شد. \n با تشکر از همکاری شما.")

                    }else{
                        console.log("c")
                        this.bot.sendMessage(chatId,"این بات در لیست انتظار افزوده شدن می باشد.");

                    }

                }else{
                    console.log("d")
                    this.bot.sendMessage(chatId,"این استاد در حال حاضر در بات می باشد.");

                }

            });



        });

    }

    ///

    _createKeyboardFromObject(items, prefix) {
        let keyboards = [];
        let temp = [];
        let i = 0;

        for (let item of items) {
            if ((i % 2 == 0 && i != 0)) {
                keyboards.push(temp);
                temp = [];
            }

            temp.push({
                text: item.name,
                callback_data: prefix + "-" + item.id
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

    _createKeyboardForQuestion(questionId, teacherId) {
        let keyboards = [];
        let temp = [];
        console.log("s")
        for (let i = 0; i < 11; i++) {
            if ((i % 2 == 0 && i != 0)) {
                keyboards.push(temp);
                temp = [];
            }

            temp.push({
                text: i,
                callback_data: questionId + "-question-" + i + "-" + teacherId
            });

        }

        keyboards.push(temp);
        temp = [];

        return keyboards;
    }

}

module.exports = Bot;