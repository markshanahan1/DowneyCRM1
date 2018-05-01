const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');



const EmployeeSchema = mongoose.Schema({
    empName:{ type: String},
    empEmail:{ type:String},
    empUsername:{ type:String, unique:true},
    empPosition:{type:String},
    empDob:{ type:String},
    empPhone:{ type:Number },
    empHrRate:{type:Number },
    empPassword:{type:String}
});


//Company Schema
const companySchema = mongoose.Schema({
    name:{type: String, required:true, unique:true},
    title:{type:String, required:true},
    street:{type:String, required:true},
    town:{type:String,required:true},
    county:{type:String,required:true},
    country:{type:String,required:true},
    website:{type:String,required:true},
    email:{type:String,required:true},
    companyRegNum:{type:Number,required:true},
    phone:{type:Number,required:true},
    projects:[mongoose.Schema.Types.ObjectId],
    password:{ type:String, required:true},
    employees:[EmployeeSchema]
});
const Employee = module.exports = mongoose.model('Employee', EmployeeSchema);
const Company = module.exports = mongoose.model('Company',companySchema);


/*/////////////////////////////////////////////
                    COMPANY
////////////////////////////////////////////*/

module.exports.getCompanyById = (id,callback) => {
    Company.findById(id, callback);
}
module.exports.getCompanyByName = (name,callback) => {
    Company.findOne({name:name}, callback);
}

module.exports.addCompany = (newCompany, callback) => {
    console.log(newCompany);
    bcrypt.genSalt((err,salt)=>{
        bcrypt.hash(newCompany.password, salt, (err,hash)=>{

            if(err) throw err;
            newCompany.password = hash;
            console.log()
            if(newCompany.employees.length >0){    
                
                bcrypt.genSalt((err1,salt1)=>{
                    bcrypt.hash(newCompany.employees[0].empPassword, salt1, (err1,hash1)=>{
                        newCompany.employees[0].empPassword = hash;
                        newCompany.save(callback);
                    });
                });
            }
            else
                newCompany.save(callback);
            
            
        });
    });
 //   console.log('in serverside' + newCompany+'\n employee'+newCompany.employees);
    
}
module.exports.updateCompanyEmp = (newCompany,callback) => {
    console.log(newCompany);
    Company.update(
        { 
          "_id" : newCompany.compId, 
          "employees._id" : newCompany.emp._id
        },
        { 
          $set: { 
              employees: { 
              empUsername : newCompany.emp.empUsername, 
              empName : newCompany.emp.empName,
              empPosition : newCompany.emp.empPosition,
              empEmail : newCompany.emp.empEmail,
              empDob : newCompany.emp.empDob,
              empPhone : newCompany.emp.empPhone,
              empHrRate : newCompany.emp.empHrRate,
             empPassword : newCompany.emp.empPassword
            }
            }
        },
        false,
        true
      )
    //Company.findOneAndUpdate({_id:newCompany._id},newCompany,callback);
}
module.exports.comparePassword = (candidatePassword, hash, callback)=>{
    bcrypt.compare(candidatePassword, hash,(err,isMatch)=>{
        if(err) throw err;
        callback(null,isMatch);
    });
}

/*/////////////////////////////////////////////
                    EMPLOYEE
////////////////////////////////////////////*/
module.exports.removeEmployee = (id,callback) => {
    Company.update(
        { },
        { $pull: { employees: { _id: id } } },
        { multi: true}
      )
}

module.exports.getEmployeeById = (id,callback) => {
    User.findById(id, callback);
}
module.exports.updateEmployeeProfile = (updateEmployee, callback)=>{
    var myquery = { ObjectId: updateEmployee.ObjectId };
 
    User.updateOne(myquery, updateUser, function(err, res) {
        if (err) throw err;
    });
}
module.exports.addEmployee = (newEmployee, id,callback) => {
    newEmployee
    console.log(newEmployee.employees);
    bcrypt.genSalt((err,salt)=>{
        bcrypt.hash(newEmployee.employees[0].empPassword, salt, (err,hash)=>{
            Company.findOne({_id:id}, function (err,company) {
                if(err) throw err;
                // handle errors ..
                console.log("last stop 2:"+newEmployee.employees[0]);
                newEmployee.employees[0].empPassword = hash;
                company.employees.push(newEmployee.employees[0]);
                company.save(callback);
            });
            
            
            
        });
    });
}
module.exports.getEmployeeByUsername = (name,callback) => {
    Company.find({},function(err, company) {
        if (err) throw err;
     //   console.log('in company.js: '+company);
        for(let i = 0 ; i<= company.length;i++){
            for(let k = 0 ; k<= company[i].employees.length;k++){
                     
                if(company[i].employees[k].empUsername == name) {
           //         console.log('selected employee:'+company[i].employees[k]);
                    return {success:true, employee:company[i].employees[k], compId:company[i]._id};
                }
                    
            }
        }
        return {success:false, message:'it didnt work'};
        // if (err) res.json({success:false, message:'it didnt work'});
        // else res.json({success:true, company:company});
    });
}

/*/////////////////////////////////////////////
                    TIMESHEETS
////////////////////////////////////////////*/


