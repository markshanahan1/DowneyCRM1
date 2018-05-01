const express = require('express');
const router = express.Router();
const passport = require('passport');
const { URL, URLSearchParams } = require('url');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Client = require('../models/client');
require('../config/passport')(passport); // as strategy in ./passport.js needs passport object

router.get('/getClientOne', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    let id = req._parsedUrl.search.split("=");
  
     Client.getClientbyRef(id[1],(err,client)=>{
         if (err) throw err;
         else res.json({client:client});
         }); 
 }); 
 router.get('/getClientbyId', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    let id = req._parsedUrl.search.split("=");
  
     Client.getClientbyId(id[1],(err,client)=>{
         if (err) throw err;
         else res.json({client:client});
         }); 
 });
router.get('/getClients', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    let id = req._parsedUrl.search.split("=");
    Client.getClients(id[1],(err, client)=>{
        if (err) throw err;
        else res.json({client:client});
    });
}); 
 
router.post('/addClient',(req,res,next)=>{
    console.log("Just arrived: "+req.body);

            let newClient = new Client({
                ref:                req.body.ref,
                compId:             req.body.compId,
                Name:               req.body.Name,
                Address:            req.body.Address,
                MobileTel:          req.body.MobileTel,
                OfficeTel:          req.body.OfficeTel,
                Email:              req.body.Email,

            });
            console.log(newClient);  
            Client.addClient(newClient, (err, client) => {
                if (err)    res.json({success:false, msg:'Failed to register Client!! '+err,client:client});
                else        res.json({success: true, msg:'Client now added!!'})
            })
     
    
    
});

 router.put('/updateClient',(req,res,next)=>{
    console.log(req.body._id);
    Client.findByIdAndUpdate(req.body._id,JSON.parse(JSON.stringify(req.body || null )), function(err,client) {
        if (err) throw res.json({success:false, msg:'Failed to update Client!' + err});
        else res.json({success: true, msg:'Client is now updated!!'})
         
   });
});
router.delete('/removeClient',(req,res,next)=>{
    let id = req._parsedUrl.search.split("=");
    Client.remove({ _id: id[1] }, function (err, prod) {
        if (err) {
            res.json({success:false, msg:'Failed to delete Client!' + err});
        }
        res.json({success:true, msg:'Successfully deleted Client!' + err});
    })
});



module.exports = router;