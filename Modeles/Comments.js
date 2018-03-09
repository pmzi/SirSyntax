const mongoose = require("./db");

//let's make the schema

const CommentsSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    lessenID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:Number,
        default:0
    },
    time:{
        type:Date,
        default:Date.now()
    }
});

const Comments = mongoose.model('Comments', CommentsSchema);

module.exports = Comments;