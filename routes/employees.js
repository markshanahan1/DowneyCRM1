const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Company = require('../models/company');
require('../config/passport')(passport) // as strategy in ./passport.js needs passport object

router.post('/register',(req,res,next)=>{
   // console.log(req.body);
    let newEmployee = new Company({employees:[{
            empName: req.body.empName,
            empEmail: req.body.empEmail,
            empUsername: req.body.empUsername,
            empDob:req.body.empDob,
            empPhone:req.body.empPhone,
            empPosition:req.body.empPosition,
            empHrRate:req.body.empHrRate,
            empPassword:req.body.empPassword
            }]

    });
    console.log(req.body.details._id);
    Company.addEmployee(newEmployee,  req.body.details._id, (err, employee) => {
        if (err)    res.json({success:false, msg:'Failed to register Employee!' + err});
        else        res.json({success: true, msg:'Employee registered!!'})
    })
});

router.post('/authenticate',(req,res,next)=>{
    let isUser = false; 
    const username = req.body.username;
    const password = req.body.password;
    let employee;
    Company.find({},function(err, company) {
       
        if (err) throw res.json({success: false, msg:'Username/Password is Incorrect, Please try again.'});
     //    console.log('in employees.js: '+company.employees);
        else{
          for(let i = 0 ; i< company.length;i++){
        //    console.log('IN FIRST LEVEL: '+company);
           // if(err) res.json({success: false, msg:'No Employee Found'});
            for(let k = 0 ; k< company[i].employees.length && company[i] !== undefined; k++){
            //    if(err) res.json({success: false, msg:'No Employee Found'});
                //console.log('selected employee:'+company[i].employees[k]);
                 if(company[i].employees[k].empUsername === username) {
                  ///  if(err) return res.json({success: false, msg:' Username/Password is Incorrect, Please try again.'});
            //         console.log('selected employee:'+company[i].employees[k]);
                     employee = company[i].employees[k];
                     employee.compId = company[i]._id;
                    console.log("me:"+employee);
                     Company.comparePassword(password,employee.empPassword,(err, isMatch)=>{
                       if(err)  res.json({success: false, msg:'Username/Password is Incorrect, Please try again.'});
                        if(isMatch){
                            const token = jwt.sign({data: employee}, config.secret, {
                                expiresIn:302400
                            });
                            res.json({
                                success: true,
                                token: 'JWT '+ token,
                                employee:{
                                    empName: employee.empName,
                                    empEmail: employee.empEmail,
                                    empUsername: employee.empUsername,
                                    empDob:employee.empDob,
                                    empPhone:employee.empPhone,
                                    empHrRate:employee.empHrRate,
                                    empPosition:employee.empPosition,
                                    empPassword:employee.empPassword,
                                    compId:company[i]._id
                                }
                            });
 
                        } else {
                            
                            return res.json({success: false, msg:'Username/Password is Incorrect, Please try again.'});
                            
                        }
                    });
                }
     
            }
        }  
        }
        
       
      //  return res.json({success:false, msg:'The Username is not valid!'});
    });

});
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    //console.log(req);
    res.json({employee: req.user});
});

// router.put('/putCompanyintoUser',(req,res,next)=>{

//     let search=JSON.parse(JSON.stringify({compid:mongoose.Types.ObjectId(req.body.comid),userid:req.body.userid}|| null ));
//    console.log(search);
//     User.findOne({_id:search.userid}, function(err,user) {
//          if (err) throw res.json({success:false, msg:'Failed to Update user!' + err});
//          else user.companyid.push({companyid:search.compid},(err, callback)=>{
//              if (err) res.json({success:false, msg:'Failed to inset company id into user!' + err});
//             user.save(callback);
//          });
          
//     });
//  });

router.put('/update',(req,res,next)=>{
   
    let d = req.body;
    
    console.log(d.emp)
   
    Company.findById(d.compId, function (err, company) {
        if (!err) {
            
            for(let i =0;i<company.employees.length;i++){
                console.log("WERE IN HERE2");
                if(company.employees[i]._id == d.emp._id){
                    console.log("WERE IN HERE");
                    company.employees[i].empName=d.emp.empName;
                    company.employees[i].empUsername=d.emp.empUsername;
                    company.employees[i].empPhone=d.emp.empPhone;
                    company.employees[i].empPosition=d.emp.empPosition;
                    company.employees[i].empHrRate=d.emp.empHrRate;
                    company.employees[i].empEmail=d.emp.empEmail;
                    company.employees[i].empDob=d.emp.empDob;
                }
            }
            console.log(company);
          company.save(function (err,callback) {
            // do something
            if (err) throw res.json(err);
            else res.json(callback);
          });
        }
      });
});
router.delete('/removeEmp',(req,res,next)=>{
     let id = req._parsedUrl.search.split("=");
     let d = id[1].split("///");
    console.log(d);
   
    Company.findById(d[1], function (err, company) {
        if (!err) {
            

            
                company.employees.id(d[0]).remove();
        
            console.log(company.employees.id(d[0]));
          company.save(function (err,callback) {
            // do something
            if (err) throw res.json(err);
            else res.json(err);
          });
        }
      });
});
module.exports = router;