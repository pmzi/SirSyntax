const mongoose = require("./db");

//let's make the schema

const LessensSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    teacherID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
});

const Lessens = mongoose.model('Lessens', LessensSchema);

Lessens.findTeacherID = (lessenID)=>{
    return new Promise((resolve,reject)=>{
        Lessens.findOne({_id:lessenID},"teacherID").then((data)=>{
            resolve(data.teacherID);
        })
    })
}

module.exports = Lessens;