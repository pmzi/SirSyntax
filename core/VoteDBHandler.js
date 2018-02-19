const fs = require('fs');

const standards = require("../config/standards");

class VoteDBHandler {

    constructor() {

        this.data = JSON.parse(fs.readFileSync("db/votes.json"));

        this.standards = standards;

    }

    getVotesByTeacher(teacherId) {

        return this.data.filter(item => item.teacherId == teacherId);

    }

    addVote(teacherId, chatId) {

        if (!this._checkVoteExistane(teacherId,chatId)) {
            let defaultStandards = {};

            for (let item in this.standards) {
                defaultStandards[this.standards[item]] = 0;
            }

            this.data.push({
                teacherId: teacherId,
                chatId: chatId,
                date: Date.now(),
                standards: defaultStandards
            });

            this._save();
            return true;
        } else {
            return false;
        }

    }

    editVote(questionId, mark, teacherId, chatId) {

        let temp = this.data.filter(item => item.teacherId == teacherId && item.chatId == chatId)[0];

        let i = 0;

        for(let item in temp.standards){
            if(i == questionId-1){
                temp.standards[item] = mark;
                break;
            }
            i++;
        }

        this._save();

    }

    parseVote(votes, teacherName) {

        if(votes.length == 0){
            return "نظری برای مشاهده وجود دارد.";
        }

        let sum = [];
        let i;
        for (let item of votes) {
            i = 0;
            for (let subItem in item.standards) {
                if (sum.length <= i) {
                    sum.push(parseInt(item.standards[subItem]));
                } else {
                    sum[i] += parseInt(item.standards[subItem]);
                }
                i++;
            }
        }

        for (let item in sum) {
            sum[item] /= votes.length;
            sum[item] = sum[item].toFixed(2);
        }

        let standards = {};
        i = 0;
        for (let item in votes[0].standards) {
            standards[item] = sum[i];
            i++;
        }


        let text = "نتیجه نظر سنجی استاد " + teacherName + "\n";

        text += "همه‌ی نمرات موارد زیر از 10 می‌باشند.\n";

        text += "حضور و غیاب: " + standards.absent + "\n";

        text += "پرسش و پاسخ سر کلاس: " + standards.quiz + "\n";

        text += "ارایه جزوه: " + standards.handout + "\n";

        text += "توانایی انتقال: " + standards.ability + "\n";

        text += "نمره دادن: " + standards.markStandard + "\n";

        text += "@SirSyntaxBot";

        return text;

    }

    //////

    _checkVoteExistane(teacherId,chatId){
        let temp = this.data.filter(item=>item.teacherId == teacherId&& item.chatId == chatId);
        if(temp.length == 0){
            return false;
        }else{
            return true;
        }
    }

    _save() {
        fs.writeFileSync("db/votes.json", JSON.stringify(this.data));
    }

}

module.exports = VoteDBHandler;