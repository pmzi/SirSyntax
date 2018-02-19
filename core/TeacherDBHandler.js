const fs = require("fs");

class TeacherDBHandler{

    constructor(){

        this.teachers = JSON.parse(fs.readFileSync("db/teachers.json"));

        this.cats = JSON.parse(fs.readFileSync("db/cats.json"));

    }
    
    addTeacher(name,cat){



        

    }

    search(name){

        let regex = new RegExp(name);

        let filter = this.teachers.filter(item=>regex.test(item.name));

        for(let item of filter){
            item.catName = this._catNameFromId(item.cat);
        }

        return filter;

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

        fs.writeFileSync("db/teachers.json",JSON.stringify(this.teachers));

    }

    _checkTeacherExistance(name,cat){
        name = name.trim();
        let teacher = this.teachers.filter(teacher=>teacher.name == name && teacher.cat == cat);
        if(teacher.length>=1){
            return true;
        }
        return false;
    }

    _catNameFromId(id){
        return this.cats.filter(item=>item.id == id)[0].name;
    }

}

module.exports = TeacherDBHandler;