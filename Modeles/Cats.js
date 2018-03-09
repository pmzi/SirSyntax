const mongoose = require("./db");

//let's make the schema

const CatsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    universityID:{
        type:mongoose.Schema.Types.ObjectId,
        required:false
    }
});

const Cats = mongoose.model('Cats', CatsSchema);

module.exports = Cats;