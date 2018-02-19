const fs = require("fs");

class UserDBHandler{

    constructor(){

        this.users = JSON.parse(fs.readFileSync("db/users.json"));

    }
    
    addUser(chatId,userName){

        return new Promise((resolve,reject)=>{

            if(!this._checkUserExistance(chatId,userName)){
                let tempUser = {
                    "chatId":chatId,
                    "userName":userName,
                    "start":Date.now(),
                    "vote":0
                };
        
                this.users.push(tempUser);
    
                this._save();
            }

            resolve();

        })

        

    }

    plusVote(chatId,userName){

    }

    _addToFile(chaId,userName){

        

    }

    _save(){

        fs.writeFileSync("db/users.json",JSON.stringify(this.users));

    }

    _checkUserExistance(chatId,userName){
        let user = this.users.filter(user=>user.chatId == chatId && user.userName == userName);
        if(user.length>=1){
            return true;
        }
        return false;
    }

}

module.exports = UserDBHandler;