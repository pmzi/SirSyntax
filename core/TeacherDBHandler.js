const fs = require("fs");

class TeacherDBHandler{

    constructor(){

        this.teachers = JSON.parse(fs.readFileSync("db/teachers.json"));

        this.cats = JSON.parse(fs.readFileSync("db/cats.json"));

    }
    
    addTeacher(name,cat){

        return new Promise((resolve,reject)=>{

            

            resolve();

        })

        

    }

    getTeacherNameById(id){
        return this.teachers.filter(item=>item.id == id)[0].name;
    }

    filterByCat(catId){
        console.log(catId)
        console.log(this.teachers.filter(item=>item.cat == catId))
        return this.teachers.filter(item=>item.cat == catId);
    }

    //

    _save(){

        fs.writeFileSync("db/teachers.json",JSON.stringify(this.users));

    }

    _checkTeacherExistance(name,cat){
        name = name.trim();
        cat = cat.trim();
        let teacher = this.users.filter(teacher=>teacher.name == name && teacher.cat == cat);
        if(teacher.length>=1){
            return true;
        }
        return false;
    }

}

module.exports = TeacherDBHandler;