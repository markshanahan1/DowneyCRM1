    const express = require('express');
const router = express.Router();
const passport = require('passport');
const { URL, URLSearchParams } = require('url');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Project = require('../models/project');
require('../config/passport')(passport); // as strategy in ./passport.js needs passport object


router.post('/addProject',(req,res,next)=>{
    Project.count({clientId:req.body.clientId},(err,count)=>{
        console.log("---------------------");
        console.log(req.body);
        console.log("---------------------");
        
        let i = ("000" + (count+1)).slice(-3);
        let u = ("0000" + req.body.ref).slice(-4);
        if(i=="000"){
            i="001"
        }
        if(u=="0000"){
            u="0001"
        }
        let newProject = new Project({
            ref:u+"-"+i,
           companyId: req.body.compId,
            createdBy:req.body.createdBy,
            title:req.body.title,
            clientId:req.body.clientId,
            SiteAddress:req.body.SiteAddress,
            Services:req.body.Services
        }); 
        //console.log(newProject);
        Project.addProject(newProject, (err, project) => {
            if (err)    res.json({success:false, msg:'Failed to register Project!! '+err,project:project});
            else        res.json({success: true, msg:'Project now added!!'})
        })
    });



    
}); 

router.get('/getProjectsbyId', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    let id = req._parsedUrl.search.split("=");
    console.log(id);
    Project.getProjById(id[1],(err, project)=>{
        if (err) throw err;
        else res.json({project:project});
    });
});
router.get('/getProjectsbyComp', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    let id = req._parsedUrl.search.split("=");
    console.log(id);
    Project.getProjByComp(id[1],(err, project)=>{
        if (err) throw err;
        else res.json({project:project});
    });
});
router.get('/getProjectsbyUser', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    let id = req._parsedUrl.search.split("=");
    console.log(req._parsedUrl);
    Project.getProjByUser(id[1],(err, project)=>{
        if (err) throw err;
        else res.json({project:project});
    });
}); 
router.get('/getProjectsbyClient', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    let id = req._parsedUrl.search.split("=");
    console.log(id);
    Project.getProjByClient(id[1],(err, project)=>{
        if (err) throw err;
        else res.json({project:project});
    });
}); 
router.put('/updateBudget',(req,res,next)=>{
    console.log(req.body._id);
    Project.findByIdAndUpdate(req.body._id,JSON.parse(JSON.stringify(req.body || null )), function(err,project) {
        if (err) throw res.json({success:false, msg:'Failed to update Project!' + err});
        else res.json({success: true, msg:'Project is now updated!!'})
   });
});
 router.put('/updateProject',(req,res,next)=>{
    console.log(req.body._id);
    Project.findByIdAndUpdate(req.body._id,JSON.parse(JSON.stringify(req.body || null )), function(err,project) {
        if (err) throw res.json({success:false, msg:'Failed to update Project!' + err});
        else res.json({success: true, msg:'Project is now updated!!'})
   });
});
router.delete('/removeProject',(req,res,next)=>{
    let id = req._parsedUrl.search.split("=");
    Project.remove({ _id: id[1] }, function (err, prod) {
        if (err) {
            res.json({success:false, msg:'Failed to delete Project!' + err});
        }
        res.json({success:true, msg:'Successfully deleted Project!' + err});
    })
});



module.exports = router;