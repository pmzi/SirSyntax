const mongoose = require("./db");

//let's make the schema

const UniversitiesSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
});

const Universities = mongoose.model('Universities', UniversitiesSchema);

module.exports = Universities;