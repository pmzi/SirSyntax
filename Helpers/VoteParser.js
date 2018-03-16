class VoteParser {

    parse(votes, questions, likes, teacherName) {

        let text = "نتیجه نظر سنجی درباره استاد " + teacherName + "📣\n\n";

        let average = 0;

        for (let i = 0; i < questions.questions.length; i++) {
            average = 0;
            for (let vote of votes) {
                average += parseInt(vote.answer[i].value);
            }
            average = average / votes.length;
            if (average < 0) {
                // Option is JIZZZ!
                continue;
            } else if (average % 1 >= 5) {
                average = parseInt(average) + 1;
            } else {
                average = parseInt(average);
            }

            // get the text of the value == average

            let optionText = "";

            optionText = "❓"+questions.questions[i].options.filter(option => option.value == average)[0].text;

            text += questions.questions[i].text + "\n💬" + optionText + "\n";

        }

        // Let's include likes

        text += "\n\n-----------\n\n"+this.parseLikes(likes);

        return text;

    }

    parseLikes(likes){

        let text = "تعداد افرادی که این استاد را پیشنهاد کرده‌اند : ";

        let negatives = 0;
        let positives = 0;

        negatives = likes.filter(like=>like.status == 0).length;

        positives = likes.filter(like=>like.status == 1).length;

        let negativePercent = (100*negatives/(negatives+positives)).toFixed(2);
        
        let positivePercent = 100 - negativePercent;

        if(positivePercent < 50){
            text += "زیر 50% ";
        }else if(positivePercent>=50 && positivePercent <70){
            text += "بین 50% تا 70%";
        }else if(positivePercent>=70 && positivePercent <80){
            text += "بین 70% تا 80%";
        }else if(positivePercent>=80 && positivePercent <90){
            text += "بین 80% تا 90%";
        }else if(positivePercent>=90 && positivePercent <=100){
            text += "بین 90% تا 100%";
        }

        return text;
    }

}

module.exports = VoteParser;