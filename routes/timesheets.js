const express = require('express');
const router = express.Router();
const passport = require('passport');
const { URL, URLSearchParams } = require('url');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Timesheet = require('../models/timesheet');
require('../config/passport')(passport); // as strategy in ./passport.js needs passport object


router.post('/register',(req,res,next)=>{
    console.log("Just arrived: "+req.body);
    let newTimesheet = new Timesheet({
      
       hourly_ts:req.body.hourly_ts,
       empUsername:req.body.empUsername
    });
    console.log(newTimesheet);  
    Timesheet.addTimesheet(newTimesheet, (err, timesheet) => {
        if (err)    res.json({success:false, msg:'Failed to register Timesheet!! '+err,timesheet:timesheet});
        else        res.json({success: true, msg:'Timesheet now added!!'})
    })
});

router.get('/getbyWeek', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    console.log(req);
    Company.getCompanyByName({name:req.body.name},(err,company)=>{
        if (err) throw err;
        else res.json({company:company});
        });
});
router.get('/getEmployeeTimesheets', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    let id = req._parsedUrl.search.split("=");
    console.log(id[1]);
 
    Timesheet.getEmpTimesheets(id[1],(err,timesheet)=>{
        if (err) throw err;
        else res.json({timesheet:timesheet});
        });
});
router.get('/getProjectBudgetfromTS', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    let id = req._parsedUrl.search.split("=");
    console.log(id[1]);
     Timesheet.getTimesheetsforBudget(id[1],(err,timesheet)=>{
         if (err) throw err;
         else res.json({timesheet:timesheet});
         }); 
 }); 
 router.put('/update',(req,res,next)=>{
    console.log(req.body._id);
    Timesheet.findByIdAndUpdate(req.body._id,JSON.parse(JSON.stringify(req.body || null )), function(err,timesheet) {
        if (err) throw res.json({success:false, msg:'Failed to update timesheet!' + err});
        else res.json({success: true, msg:'Timesheet is now updated!!'})
         
   });
});
router.delete('/remove',(req,res,next)=>{
    let id = req._parsedUrl.search.split("=");
    Timesheet.remove({ _id: id[1] }, function (err, prod) {
        if (err) {
            res.json({success:false, msg:'Failed to delete timesheet!' + err});
        }
        res.json({success:true, msg:'Successfully deleted timesheet!' + err});
    })
});


router.get('/delete', passport.authenticate('jwt', {session:false}), (req, res, next) => {

});
module.exports = router;