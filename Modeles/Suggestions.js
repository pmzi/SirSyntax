const mongoose = require("./db");

//let's make the schema

const SuggestionsSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
});

const Suggestions = mongoose.model('Suggestions', SuggestionsSchema);

module.exports = Suggestions;