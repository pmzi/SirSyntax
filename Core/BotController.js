const config = require("../Config/Config");

const Bot = require("./Bot");

const bot = new Bot(config.general.API, config.general.ID);

// Datas

const questions = require("../Config/Questions");

// Modeles

const Users = require("../Modeles/Users");

const Unies = require("../Modeles/Universities");

const Teachers = require("../Modeles/Teachers");

const Cats = require("../Modeles/Cats");

const Lessens = require("../Modeles/Lessens");

const Votes = require("../Modeles/Votes");

const Likes = require("../Modeles/Likes");

const Comments = require("../Modeles/Comments");

// Helpers

const VoteParser = require("../Helpers/VoteParser");

const CommentParser = require("../Helpers/CommentParser");

const voteParser = new VoteParser();

const commentParser = new CommentParser();

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

bot.addTaskToUser = function (chatID, cmdName) {
    Users.update({
        chatID: chatID
    }, {
        task: cmdName
    }).then(() => {
        console.log("Task Updated.");
    })
}

bot.clearTask = function (chatID) {
    Users.update({
        chatID: chatID
    }, {
        task: "false"
    }).then(() => {
        console.log("Task Cleared!")
    })
}

bot.findTask = function (chatID) {
    return new Promise((resolve) => {
        Users.findOne({
            chatID: chatID
        }, "task").then((data) => {
            resolve(data.task);
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

bot.addCommand("viewTeachers", "مشاهده اساتید", (msg) => {

    Cats.find({}).then((cats) => {

        const keyboard = bot.createInlineKeyboard(cats, "group-cat");

        bot.sendMessage(msg, "گروه آموزشی مورد نظر خود را انتخاب کنید.", {
            reply_markup: {
                inline_keyboard: keyboard
            }
        }, {
            sign: false
        });

    })

}, "university");

bot.addCommand("viewTeachers", "نظر دادن به اساتید", (msg) => {

    Cats.find({}).then((cats) => {

        const keyboard = bot.createInlineKeyboard(cats, "group-cat-v");

        bot.sendMessage(msg, "گروه آموزشی مورد نظر خود را انتخاب کنید.", {
            reply_markup: {
                inline_keyboard: keyboard
            }
        }, {
            sign: false
        });

    })

}, "university");


// commands with afterwards

bot.addCommand("addCommand", null, (msg, args) => {
    Users.findOne({
        chatID: msg.chat.id
    }, "_id").then((u) => {
        new Comments({
            text: msg.text,
            userID: u._id,
            lessenID: args[2]
        }).save().then(() => {
            bot.sendMessage(msg, "نظر شما با موفقیت افزوده شد. با تشکر.")
        })
    })
});



// CallBacks

bot.addCallBack("cb_select_uni", /^select-uni-([\d\w]+)$/i, (data, msg) => {
    Users.update({
        chatID: msg.chat.id
    }, {
        university: data[1]
    }).then(() => {
        console.log("University Updated!");
    })
});

// For seeing techers section

bot.addCallBack("cb_cat", /^group-cat-([\d\w]+)$/i, (data, msg) => {

    //showing the teachers in the cat

    let catID = data[1];

    Teachers.find({
        gCat: catID
    }).then((ts) => {
        const keyboard = bot.createInlineKeyboard(ts, "teacher");

        bot.sendMessage(msg, "استاد مورد نظر خود را انتخاب کنید.", {
            reply_markup: {
                inline_keyboard: keyboard
            }
        }, {
            sign: false
        });
    });

});

bot.addCallBack("cb_teacher", /^teacher-([\d\w]+)$/i, (data, msg) => {

    //showing the lessens that the teacher have thought


    let teacherID = data[1];

    Lessens.find({
        teacherID: teacherID
    }).then((ls) => {
        const keyboard = bot.createInlineKeyboard(ls, "lessen");

        bot.sendMessage(msg, "درس مورد نظری که استاد ارایه می‌دهد را انتخاب کنید:", {
            reply_markup: {
                inline_keyboard: keyboard
            }
        }, {
            sign: false
        });
    });


});

bot.addCallBack("cb_lessen", /^lessen-([\d\w]+)$/i, (data, msg) => {

    //showing the lessens that the teacher have thought

    let lessenID = data[1];

    Votes.find({
        lessenID: lessenID
    }).then((vs) => {

        Likes.find({
            lessenID: lessenID
        }).then((lks) => {

            let result = voteParser.parse(vs, lks);

            const keyboard = bot.createInlineKeyboard([{
                name: "پیشنهاد می‌دهم",
                _id: 0 + "-" + lessenID
            }, {
                name: "پیشنهاد نمی‌دهم",
                _id: 1 + "-" + lessenID
            }, {
                name: "مشاهده نظرات",
                _id: 2 + "-" + lessenID
            }, {
                name: "ثبت نظر",
                _id: 3 + "-" + lessenID
            }], "vote-see");

            bot.sendMessage(msg, result, {
                reply_markup: {
                    inline_keyboard: keyboard
                }
            });

        });


    });


});

bot.addCallBack("cb_vote_see", /^vote-see-([\d\w]+)-([\w\d]+)$/i, (data, msg) => {

    //let's handle the options

    let optionID = parseInt(data[1]);

    let lessenID = data[2];

    // First Let's Find The user's ID

    Users.findOne({
        chatID: msg.chat.id
    }, "_id").then((u) => {
        switch (optionID) {
            case 0:
                Likes.find({
                    userID: u._id,
                    lessenID: lessenID
                }).then((lks) => {
                    if (lks.length == 0) {
                        new Likes({
                            status: 1,
                            userID: u._id,
                            lessenID: lessenID
                        }).save();
                        bot.sendMessage(msg, "پیشنهاد شما با موفقیت ثبت شد. با تشکر.");
                    } else {
                        bot.sendMessage(msg, "شما قبلا پیشنهاد خود را درباره این استاد ثبت کرده‌اید.");
                    }
                })

                break;
            case 1:
                Likes.find({
                    userID: u._id,
                    lessenID: lessenID
                }).then((lks) => {
                    if (lks.length == 0) {
                        new Likes({
                            status: 0,
                            userID: u._id,
                            lessenID: lessenID
                        }).save();
                        bot.sendMessage(msg, "پیشنهاد شما با موفقیت ثبت شد. با تشکر.");
                    } else {
                        bot.sendMessage(msg, "شما قبلا پیشنهاد خود را درباره این استاد ثبت کرده‌اید.");
                    }
                })
                break;
            case 2: //see comments
                Comments.find({
                    lessenID: lessenID,
                    status: 1
                }, "text").then((data) => {
                    Lessens.findTeacherID(lessenID).then((tID) => {
                        Teachers.findTeacherName(tID).then((teacherName) => {
                            let result = commentParser.parse(data, teacherName);
                            bot.sendMessage(msg, result);
                        })
                    })

                });
                break;
            case 3:
                Comments.find({}).then((cms) => {
                    if (cms.length == 0) {
                        bot.sendMessage(msg, "لطفا نظر خود را بنویسید.");
                        bot.addTaskToUser(msg.chat.id, "cmd_addCommand:" + lessenID);
                    } else {
                        bot.sendMessage(msg, "شما قبلا درباره این درس از این استاد نظر ثبت کرده‌اید.")
                    }
                })

                break;
        }
    })


});

//For giving votes

bot.addCallBack("cb_cat_v", /^group-cat-v-([\d\w]+)$/i, (data, msg) => {

    //showing the teachers in the cat

    let catID = data[1];

    Teachers.find({
        gCat: catID
    }).then((ts) => {
        const keyboard = bot.createInlineKeyboard(ts, "teacher-v");

        bot.sendMessage(msg, "استاد مورد نظر خود را انتخاب کنید.", {
            reply_markup: {
                inline_keyboard: keyboard
            }
        }, {
            sign: false
        });
    });

});

bot.addCallBack("cb_teacher_v", /^teacher-v-([\d\w]+)$/i, (data, msg) => {

    //showing the lessens that the teacher have thought


    let teacherID = data[1];

    Lessens.find({
        teacherID: teacherID
    }).then((ls) => {
        const keyboard = bot.createInlineKeyboard(ls, "lessen-v");

        bot.sendMessage(msg, "درس مورد نظری که استاد ارایه می‌دهد را انتخاب کنید:", {
            reply_markup: {
                inline_keyboard: keyboard
            }
        }, {
            sign: false
        });
    });


});

// Let's handle first question

bot.addCallBack("cb_lessen_v", /^lessen-v-([\d\w]+)$/i, (data, msg) => {

    //Let's ask some questions!

    let lessenID = data[1];

    //check if user has voted so far

    Users.findOne({
        chatID: msg.chat.id
    }).then((u) => {
        Votes.findOne({
            userID: u._id
        }).then((v) => {
            if (v.length != 0) {
                bot.sendMessage(msg, "شما قبلا به این درس از این استاد نظر داده اید.");
            } else {
                let up = {
                    q1: -1,
                    q2: -1,
                    q3: -1,
                    q4: -1,
                    q5: -1,
                    lessenID: lessenID
                }

                //let's create the vote

                Users.findOne({
                    chatID: msg.chat.id
                }).then((u) => {
                    up.userID = u._id;
                    new Votes(up).save().then((v) => {
                        const keyboard = bot.createInlineKeyboard(questions[0].options, "question-1-" + lessenID, null, "text", "value");
                        bot.sendMessage(msg, questions[0].text, {
                            reply_markup: {
                                inline_keyboard: keyboard
                            }
                        }, {
                            sign: false
                        });
                    })
                })
            }
        })
    })
});

// Let's add cllbck for each question

for (let i = 1; i < questions.length; i++) {

    bot.addCallBack("cb_question_" + i, "^question-" + i + "-([\\d\\w]+)-(\\d+)$", (data, msg) => {

        //Let's ask some questions!

        let lessenID = data[1];

        let answer = data[2];

        let up = {};

        up["q" + i] = answer;

        //updating the vote 

        Users.findOne({
            chatID: msg.chat.id
        }).then((u) => {
            Votes.update({
                userID: u._id
            }, up).then((v) => {
                const keyboard = bot.createInlineKeyboard(questions[i].options, "question-" + (i + 1) + "-" + lessenID, null, "text", "value");

                bot.sendMessage(msg, questions[i].text, {
                    reply_markup: {
                        inline_keyboard: keyboard
                    }
                }, {
                    sign: false
                });
            })
        })






    });

}

bot.addCallBack("cb_question_" + (questions.length), "^question-" + (questions.length) + "-([\\d\\w]+)-(\\d+)$", (data, msg) => {

    //Let's ask some questions!

    let lessenID = data[1];

    let answer = data[2];

    let up = {};

    up["q" + questions.length] = answer;

    Users.findOne({
        chatID: msg.chat.id
    }).then((u) => {
        Votes.update({
            userID: u._id
        }, up).then((v) => {
            bot.sendMessage(msg, "مرسی ");
        })
    })




});