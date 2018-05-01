const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Company = require('../models/company');
require('../config/passport')(passport) // as strategy in ./passport.js needs passport object

router.post('/register',(req,res,next)=>{
    console.log(req.body);
    let newCompany = new Company({
            name:           req.body.name,
            title:          req.body.title,
            street:         req.body.street,
            town:           req.body.town,
            county:         req.body.country,
            country:        req.body.country,
            website:        req.body.website,
            email:          req.body.email,
            companyRegNum:  req.body.companyRegNum,
            phone:          req.body.phone,
            password:       req.body.password,
            
        })
    
    
    console.log(newCompany);  
    Company.addCompany(newCompany, (err, company) => {
        if (err)    res.json({success:false, msg:'Failed to register company!! '+err,company:company});
        else        res.json({success: true, msg:'Company registered!!'})
    })
});

router.post('/authenticate',(req,res,next)=>{
    const username = req.body.username;
    const password = req.body.password;

    Company.getCompanyByName(username, (err,company) =>{
        console.log(company);
        if (err) throw res.json({success: false, msg: 'Error:' + err})
         console.log(company);
        if(!company){
            return res.json({success: false, msg: 'User not found'})
        }
        // console.log("just about to compare password");
        Company.comparePassword(password,company.password,(err, isMatch)=>{
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign({data: company}, config.secret, {
                    expiresIn:604800
                });
                res.json({
                    success: true,
                    token: 'JWT '+ token,
                    company:{
                        title:company.title,
                        name: company.name,
                        email: company.email,
                        username: company.username,
                        dob:company.dob,
                        street:company.street,
                        town:company.town,
                        county:company.county,
                        country:company.country,
                        phone:company.phone,
                        website:company.website,
                        password:company.password,
                        employees:[{
                            empName:company.employees.empName,
                            empEmail:company.employees.empEmail,
                            empUsername:company.employees.empUsername,
                            empPosition:company.employees.empPosition,
                            empHrRate:company.employees.empHrRate,
                            empDob:company.employees.empDob,
                            empPhone:company.employees.empPhone,
                            empPassword:company.employees.empPassword
                            
                        }]
                    }
                });
            } else {
                return res.json({success: false, msg:'Wrong Password'});
            }
        });
    });
});
router.get('/searchCompanies', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    console.log(req.query.name);
    Company.find({name: new RegExp(req.query.name)},function(err, company) {
        if (err) res.json({success:false, message:'it didnt work'});
        else res.json({success:true, company:company});
    });
});
router.get('/getCompany', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    console.log(req);
    Company.getCompanyByName({name:req.body.name},(err,company)=>{
        if (err) throw err;
        else res.json({company:company}); 
    });
});
router.get('/getCompanyEmpsbyId', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    let id = req._parsedUrl.search.split("=");
    console.log(req._parsedUrl.search);
    Company.getCompanyById(id[1],(err,company)=>{
        if (err) throw err;
        else res.json({company:company.employees}); 
    });
});

router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({company: req.user});
});
router.post('/employees', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  Company.findById(req.body.companyid, function (err,company) {
  // handle errors ..
  company.employees.push({ empId: empId, empName: empName, empType: empType});
  company.save(callback);
})
});
router.put('/addEmployeetoCompany', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    console.log(req.user._id);


});
router.put('/removeEmp',(req,res,next)=>{
    let update = {
        name:           req.body.name,
        title:          req.body.title,
        street:         req.body.street,
        town:           req.body.town,
        county:         req.body.country,
        country:        req.body.country,
        website:        req.body.website,
        email:          req.body.email,
        companyRegNum:  req.body.companyRegNum,
        phone:          req.body.phone,
        password:       req.body.password,
        employees:      req.body.employees
    }
    console.log('made into companies.js');
    

    Company.updateCompanyEmp(update, (err, company) => {
        if (err)    res.json({success:false, msg:'Failed to update company!'});
        else        res.json({success: true, msg:'Company Updated!! ',err:err,company:company})
    })
});

module.exports = router;