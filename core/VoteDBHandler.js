const fs = require('fs');

class VoteDBHandler{

    constructor(){

        this.data = JSON.parse(fs.readFileSync("db/votes.json"));

    }

    getVotesByTeacher(teacherId){

        return this.data.filter(item=>item.teacherId == teacherId);

    }

    parseVote(votes,teacherName){

        let sum = [];
        let i;
        for(let item of votes){
            i = 0;
            for(let subItem in item.standards){
                if(sum.length <= i){
                    sum.push(parseInt(item.standards[subItem]));
                }else{
                    sum[i] += parseInt(item.standards[subItem]);
                }
                i++;
            }
        }

        for(let item in sum){
            sum[item] /= votes.length;
        }

        let standards = {};
        i=0;
        for(let item in votes[0].standards){
            standards[item] = sum[i];
            i++;
        }


        let text = "نتیجه نظر سنجی استاد "+teacherName+"\n";

        text += "همه‌ی نمرات موارد زیر از 10 می‌باشند.\n";

        text += "حضور و غیاب: "+standards.absent+"\n";

        text += "پرسش و پاسخ سر کلاس: "+standards.quiz+"\n";

        text += "ارایه جزوه: "+standards.handout+"\n";

        text += "توانایی انتقال: "+standards.ability+"\n";

        text += "نمره دادن: "+standards.markStandard+"\n";

        text += "@SirSyntaxBot";

        return text;

    }

}

module.exports = VoteDBHandler;