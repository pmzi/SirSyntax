const fs = require("fs");

class UserDBHandler{

    constructor(){

        this.newTeachers = JSON.parse(fs.readFileSync("db/newTeachers.json"));

    }

    addTecher(name,catId,chatId){

        if(!this._checkUserExistance(name,catId)){

            this.newTeachers.push({
                name:name.trim(),
                cat:catId,
                chatId: chatId
            });

            this._save();

            return true;

        }else{
            return false;
        }
    }

    _save(){

        fs.writeFileSync("db/newTeachers.json",JSON.stringify(this.newTeachers));

    }

    _checkUserExistance(name,catId){
        console.log(this.newTeachers)
        let teacher = this.newTeachers.filter(teacher=>teacher.cat == catId && teacher.name == name.trim());
        console.log(teacher)
        if(teacher.length>=1){
            return true;
        }
        return false;
    }

}

module.exports = UserDBHandler;