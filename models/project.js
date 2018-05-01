const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const StageSchema = require('mongoose').model('Stage').schema
const ProjectSchema = mongoose.Schema({
    ref:{type:String,required:true,unique:true},
    createdBy:[{type:String, required:true}],
    creationDate:{type:Date, default:Date.now()},
    title: {type:String, required:true},
    clientId:{type:mongoose.Schema.Types.ObjectId},
    companyId:{type:mongoose.Schema.Types.ObjectId},
    SiteAddress: {type:String, required:true},
    Services:StageSchema,
 // files:[DocumentSch]
    EmpInvolved:[{type:String}],
    projectProgress:{type:Number, default:0},
    projectComplete:{type:Boolean, default:false},
    projectCompleteDate:{type:Date}
});

const Project = module.exports = mongoose.model('Project', ProjectSchema);

module.exports.getProjById = (id,callback) => {
    Project.find({ref:id}, callback);
}
module.exports.getProjByComp = (id,callback) => {
    Project.find({companyId:id}, callback);
}
module.exports.getProjByUser = (user,callback) => {
    Project.find({createdBy:user}, callback);
}
module.exports.getProjByClient = (id,callback) => {
    Project.find({clientId:id}, callback);
}
module.exports.addProject = (newProject,callback) =>{
    console.log("-----------");
    console.log(newProject);
    console.log("-----------");
    newProject.save(callback);
}
module.exports.updateProject = (updateProject, callback)=>{
    // console.log(updateProject);
    Project.findByIdAndUpdate(updateProject._id,updateProject, callback);
}
module.exports.removeProject = (id, callback)=>{
    Project.remove({ _id: id[1] }, function (err, proj) {
        if (err) throw err; 
    })
}