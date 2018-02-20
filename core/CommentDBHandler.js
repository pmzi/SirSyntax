const fs = require("fs");

class CommentDBHandler{

    constructor(){

        this.comments = JSON.parse(fs.readFileSync("db/comments.json"));

    }

    addComment(text,teacherId,chatId){

        if(!this._checkUserExistance(chatId,teacherId)){

            this.comments.push({
                chatId:chatId,
                teacherId:teacherId,
                date:Date.now(),
                text:text,
                approve:0
            });

            this._save();

            return true;

        }else{
            return false;
        }

    }

    getCommentsByTeacherId(id){

        return this.comments.filter(comment=>comment.teacherId == id && comment.approve == 1);

    }

    _save(){

        fs.writeFileSync("db/comments.json",JSON.stringify(this.comments));

    }

    _checkUserExistance(chatId,teacherId){

        let comment = this.comments.filter(comment=>comment.chatId == chatId && comment.teacherId == teacherId);

        if(comment.length>=1){
            return true;
        }
        return false;
    }

}

module.exports = CommentDBHandler;