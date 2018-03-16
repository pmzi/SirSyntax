const mongoose = require("./db");

//let's make the schema

const CatsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    questionID:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    }
});

const Cats = mongoose.model('Cats', CatsSchema);

module.exports = Cats;