const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Calendar = require('../models/calendar');
require('../config/passport')(passport) // as strategy in ./passport.js needs passport object

router.post('/addEvent',(req,res,next)=>{
    console.log(req.body);
    let newCalendar = new Calendar({
       
        title:              req.body.title,
        empId:              req.body.empId,
        projectId:          req.body.projectId,
        start:              req.body.start,
        end:                req.body.end,
        draggable:          req.body.draggable,
        color:              req.body.color
      
    });
    console.log(newCalendar);  
    Calendar.addCalendar(newCalendar, (err, company) => {
        if (err)    res.json({success:false, msg:'Failed to register company!! '+err,company:company});
        else        res.json({success: true, msg:'Company registered!!' +err,company:company})
    })
});



router.delete('/removeEvent', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    let id = req._parsedUrl.search.split("=");
    Calendar.remove({ _id: id[1] }, function (err, prod) {
        if (err) {
            res.json({success:false, msg:'Failed to delete calendar event!' + err});
        }
        res.json({success:true, msg:'Successfully deleted calendar event!' + err});
    })
});


router.get('/getEvents', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    let id = req._parsedUrl.search.split("=");
    console.log(id);
    Calendar.getCalendars(id[1],(err, event)=>{
        if (err) throw err;
        else res.json({event:event});
    });
}); 

router.put('/updateEvent',(req,res,next)=>{
    let upCalendar = {
        _id: req.body._id,
        color: req.body.color,
        title: req.body.title,
        empId: req.body.empId,
        start: req.body.start,
        end: req.body.end,
        draggable:req.body.draggable
    }
    Calendar.updateEvent(upCalendar, (err, calendar) => {
        if (err)    res.json({success:false, msg:'Failed to update calendar! ' + err});
        else        res.json({success: true, msg:'Calendar Updated!!'});
    })
});

module.exports = router;