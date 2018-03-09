const mongoose = require("./db");

//let's make the schema

const LessensSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    TeacherID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
});

const Lessens = mongoose.model('Lessens', LessensSchema);

module.exports = Lessens;