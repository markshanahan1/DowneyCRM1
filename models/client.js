const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const StageSchema = require('mongoose').model('Stage').schema
const ClientSchema = mongoose.Schema({
    ref:{type:Number,required:true},
    compId:{type:mongoose.Schema.Types.ObjectId},
    Name: {type:String, required:true},
    Address: {type:String, required:true},
    MobileTel: {type:Number, required:true},
    OfficeTel: {type:Number, required:true},
    Email: {type:String, required:true, unique:true},
});

const Client = module.exports = mongoose.model('Client', ClientSchema);

module.exports.getClientbyRef = (id,callback) => {
    Client.find({ref:id}, callback);
}
module.exports.getClientbyId = (id,callback) => {
    Client.findById(id, callback);
}
module.exports.getClients = (id,callback) => {
    Client.find({compId:id}, callback);
}
module.exports.addClient = (newClient,callback) =>{

        newClient.save(callback);

}
module.exports.updateClient = (updateClient, callback)=>{
    // console.log(updateProject);
    Client.findByIdAndUpdate(updateClient._id,updateClient, callback);
}
module.exports.removeClient = (id, callback)=>{
    Client.remove({ _id: id[1] }, function (err, proj) {
        if (err) throw err; 
    })
}