const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Stage = require('../models/stage');
require('../config/passport')(passport) // as strategy in ./passport.js needs passport object

router.post('/addStage',(req,res,next)=>{
  
    let newStage = new Stage({
        stages:req.body.stages,
       // compId:req.body.compId
    });
    console.log(newStage);  
    Stage.addStage(newStage, (err, stage) => {
        if (err)    res.json({success:false, msg:'Failed to register Service List!! ',stage:stage});
        else        res.json({success: true, msg:'Service List is now registered!!' +err,stage:stage})
    })
});



router.delete('/removeStage', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    let id = req._parsedUrl.search.split("=");
    Stage.drop((err)=>{
        if (err) {
            res.json({success:false, msg:'Failed to delete Stage!' + err});
        }
        res.json({success:true, msg:'Successfully deleted Stage!' + err});
    })
});


router.get('/getStages', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    let id = req._parsedUrl.search.split("=");
    console.log(id);
        Stage.getAllStages(id[1],(err, stage)=>{
        if (err) throw err;
        else res.json({stage:stage});
    });
}); 

router.put('/updateStage',(req,res,next)=>{
    let upStage = {
        _id: req.body._id,
        color: req.body.color,
        title: req.body.title,
        empId: req.body.empId,
        start: req.body.start,
        end: req.body.end,
        draggable:req.body.draggable
    }
    Stage.updateStage(upStage, (err, calendar) => {
        if (err)    res.json({success:false, msg:'Failed to update calendar! ' + err});
        else        res.json({success: true, msg:'Calendar Updated!!'});
    })
});

module.exports = router;