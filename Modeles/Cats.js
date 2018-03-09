const mongoose = require("./db");

//let's make the schema

const CatsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    UniversityID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
});

const Cats = mongoose.model('Cats', CatsSchema);

module.exports = Cats;