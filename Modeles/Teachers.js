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
    },
    like:{
        type:Number,
        default:0
    },
    disLike:{
        type:Number,
        default:0
    }
});

const Teachers = mongoose.model('Teachers', TeachersSchema);

module.exports = Teachers;