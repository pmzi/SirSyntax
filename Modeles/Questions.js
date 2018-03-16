const mongoose = require("./db");

//let's make the schema

const QuestionsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    questions:{
        type:[{}],
        required:true
    }
});

const Questions = mongoose.model('Questions', QuestionsSchema);

module.exports = Questions;