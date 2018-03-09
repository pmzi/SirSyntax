const mongoose = require("./db");

//let's make the schema

const VotesSchema = new mongoose.Schema({
    q1:{
        type:Number,
        default:0,
        required:true
    },
    q2:{
        type:Number,
        default:0,
        required:true
    },
    q3:{
        type:Number,
        default:0,
        required:true
    },
    q4:{
        type:Number,
        default:0,
        required:true
    },
    q5:{
        type:Number,
        default:0,
        required:true
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

const Votes = mongoose.model('Votes', VotesSchema);

module.exports = Votes;