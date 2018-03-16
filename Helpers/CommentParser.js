class CommentParser{
    parse(comments,teacherName){
        let text = "نظرات دانشجویان درباره استاد "+teacherName+":\n\n--------\n";
        for(let comment of comments){
            text += comment.text+"\n--------\n";
        }
        return text;
    }
}

module.exports = CommentParser;