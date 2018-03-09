const mongoose = require("./db");

//let's make the schema

const TeachersSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null,
        require:true
    },
    uCat:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    gCat: {
        type: mongoose.Schema.Types.ObjectId,
        require:true
    }
});

const Teachers = mongoose.model('Teachers', TeachersSchema);

Teachers.findTeacherName = (teacherID)=>{

    return new Promise((resolve,reject)=>{
        Teachers.findOne({_id:teacherID},"name").then((data)=>{
            resolve(data.name)
        })
    })

};

module.exports = Teachers;