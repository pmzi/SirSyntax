const mongoose = require("./db");

//let's make the schema

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    chatID: {
        type: String,
        default: null,
        require: true
    },
    time: {
        type: Date,
        default: Date.now
    },
    group:{
        type:Number,
        default:1
    },
    name: {
        type: String,
        default: "",
        required: true
    },
    task: {
        type: String,
        default: "false",
        required: false
    },
    university: {
        type: mongoose.Schema.Types.ObjectId,
        default:null,
        required: false
    }

});

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;