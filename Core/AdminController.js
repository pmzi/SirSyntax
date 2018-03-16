module.exports = function (bot) {
    //libraries

    const fs = require("fs");

    // Modeles

    const Users = require("../Modeles/Users");

    const Unies = require("../Modeles/Universities");

    const Teachers = require("../Modeles/Teachers");

    const Cats = require("../Modeles/Cats");

    const Lessens = require("../Modeles/Lessens");

    const Votes = require("../Modeles/Votes");

    const Likes = require("../Modeles/Likes");

    const Comments = require("../Modeles/Comments");

    const Suggestions = require("../Modeles/Suggestions");

    const Questions = require("../Modeles/Questions");

    // MiddleWares

    bot.addMiddleWare("admin", (msg) => {
        return new Promise((resolve, reject) => {
            Users.findOne({
                chatID: msg.chat.id
            }, "group").then((u) => {
                if (u.group == 2) { //admin
                    resolve();
                } else {
                    reject();
                }
            });
        })
    });

    // Commands

    bot.addCommand("showAddGroup", "افزودن گروه", function (msg) {

        bot.addTaskToUser(msg.chat.id, "cmd_addGroup");

        bot.sendMessage(msg, "نام گروه را وارد نمایید.");

    }, "admin");

    bot.addCommand("addGroup", null, function (msg) {

        Cats.findOne({
            name: msg.text.trim()
        }, "_id").then((c) => {
            if (c && c.length != 0) {
                bot.sendMessage(msg, "گروه مورد نظر موجود می‌باشد.");
            } else {
                new Cats({
                    name: msg.text.trim(),
                    questionID: "5aab928c689100266cef92c0"
                }).save().then(() => {
                    console.log("New Group Added");
                    bot.sendMessage(msg, "گروه مورد نظر افزوده شد.");
                })
            }
        })

    }, "admin");

    bot.addCommand("showAddTeacher", "افزودن استاد", function (msg) {

        bot.addTaskToUser(msg.chat.id, "cmd_addTeacher");

        bot.sendMessage(msg, "نام استاد را وارد نمایید.");

    }, "admin");

    bot.addCommand("addTeacher", null, function (msg) {

        Teachers.findOne({
            name: msg.text.trim()
        }, "_id").then((t) => {
            if (t && t.length != 0) {
                bot.sendMessage(msg, "استاد مورد نظر موجود می‌باشد.");
            } else {
                new Teachers({
                    name: msg.text.trim()
                }).save().then(() => {
                    console.log("New Teacher Added");
                    bot.sendMessage(msg, "استاد مورد نظر افزوده شد.");
                })
            }
        })

    }, "admin");

    bot.addCommand("showAddLessen", "افزودن درس", function (msg) {

        bot.addTaskToUser(msg.chat.id, "cmd_addLessen");

        bot.sendMessage(msg, "نام درس را وارد نمایید.");

    }, "admin");

    bot.addCommand("addLessen", null, function (msg) {

        Lessens.findOne({
            name: msg.text.trim()
        }, "_id").then((l) => {
            if (l && l.length != 0) {
                bot.sendMessage(msg, "درس مورد نظر موجود می‌باشد.");
            } else {
                new Lessens({
                    name: msg.text.trim()
                }).save().then(() => {
                    console.log("New Lessen Added");
                    bot.sendMessage(msg, "درس مورد نظر افزوده شد.");
                })
            }
        })

    }, "admin");

    bot.addCommand("showUnApprovedComments", "نظرات", function (msg) {

        Comments.find({
            status: 0
        }, "text").then((cs) => {

            bot.sendMessage(msg,"نظرات تعریف نشده:");

            if(cs.length == 0){
                bot.sendMessage(msg,"نظری یافت نشد.");
            }else{
                for (let comment of cs) {
                    bot.sendMessage(msg, comment.text, {
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: 'تایید',
                                    callback_data: 'approve-'+comment._id
                                },{
                                    text: 'رد',
                                    callback_data: 'deny-'+comment._id
                                }]
                            ]
                        }
                    })
                }
            }
            
        })

    }, "admin");

    bot.addCommand("showSuggestions", "پیشنهادات", function (msg) {

        Suggestions.find({}, "text").then((ss) => {

            if(ss.length == 0){
                bot.sendMessage(msg,"پیشنهادی یافت نشد.");
            }else{
                for (let comment of ss) {
                    bot.sendMessage(msg, comment.text, {
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: 'حذف',
                                    callback_data: 'suggestion-delete-'+comment._id
                                }]
                            ]
                        }
                    })
                }
            }
            
        })

    }, "admin");

    // CallBacks

    bot.addCallBack("cb_approve",/approve-([\d\w]+)/i,(data,msg)=>{

        let commentID = data[1];

        Comments.update({_id:commentID},{status:1}).then(()=>{
            console.log("Comment Approved!");
            bot.sendMessage(msg,"نظر تایید شد.");
        })

    });

    bot.addCallBack("cb_deny",/deny-([\d\w]+)/i,(data,msg)=>{

        let commentID = data[1];

        Comments.update({_id:commentID},{status:-1}).then(()=>{
            console.log("Comment Denied!");
            bot.sendMessage(msg,"نظر رد شد.");
        })

    });

    bot.addCallBack("cb_suggest_delete",/suggestion-delete-([\d\w]+)/i,(data,msg)=>{

        let suggestionID = data[1];

        Suggestions.remove({_id:suggestionID}).then(()=>{
            console.log("Suggestion Removed!");
            bot.sendMessage(msg,"پیشنهاد با موفقیت حذف شد!");
        })

    });

}