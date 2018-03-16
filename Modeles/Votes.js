const mongoose = require("./db");

//let's make the schema

const VotesSchema = new mongoose.Schema({
    answer:{
        type:[{}],
        required:false
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