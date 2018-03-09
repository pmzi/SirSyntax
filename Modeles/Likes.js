const mongoose = require("./db");

//let's make the schema

const LikesSchema = new mongoose.Schema({
    status:{
        type:Number,
        default:0
    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    lessenID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
});

const Likes = mongoose.model('Likes', LikesSchema);

module.exports = Likes;