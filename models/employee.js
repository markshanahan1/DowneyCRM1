const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');



const EmployeeSchema = mongoose.Schema({
    empId:{ type:mongoose.Schema.Types.ObjectId,   ref: 'User',   required:false},
    empName:{type:String,required:false},
    empPosition:{type:String,required:false},
    empType:{type:String,required:false}
});



const Employee = module.exports = mongoose.model('Employee', EmployeeSchema);


/*/////////////////////////////////////////////
                    EMPLOYEE
////////////////////////////////////////////*/



module.exports.getEmployeeById = (id,callback) => {
    User.findById(id, callback);
}
module.exports.updateEmployeeProfile = (updateEmployee, callback)=>{
    var myquery = { ObjectId: updateEmployee.ObjectId };
 
    User.updateOne(myquery, updateUser, function(err, res) {
        if (err) throw err;
    });
}
module.exports.addEmployee = (newEmployee,callback) => {
    bcrypt.genSalt((err,salt)=>{
        bcrypt.hash(newUser.password, salt, (err,hash)=>{
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}
