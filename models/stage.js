const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const StageSchema = mongoose.Schema({
    stages:[{
        stage_title:{type:String, required:true},
        services:[{
            title:{type:String, required:true},
            fee:{type:Number, default:0.00},
            complete:{type:Boolean, default:false},
            isActive:{type:Boolean, default:false},
            notes:{type:String, default:"No Notes Yet."}
        }],
        budget:{type:Number, default:0.00},
        completed:{type:Boolean,default:false}
    }],
    compId:{type:mongoose.Schema.Types.ObjectId, required:false}
});

//THIS IS THE SCHEMA FOR THE PROJECTS TO IDENTIFY WHAT SERVICES APPLY TO EACH PROJECT

const Stage = module.exports = mongoose.model('Stage', StageSchema);

module.exports.getStageById = (id,callback) => {
    Stage.findById(id, callback);
}
module.exports.getAllStages = (name,callback) => {
    Stage.find({}, callback);
}
module.exports.addStage = (newStage,callback) =>{
    console.log("-----------");
    console.log(newStage);
    console.log("-----------");

    newStage.save(callback);

}
module.exports.updateStage = (updateProject, callback)=>{
    // console.log(updateProject);
    Stage.findByIdAndUpdate(updateProject._id,updateProject, callback);
}
module.exports.removeStage = (id, callback)=>{
    Stage.remove({ _id: id }, function (err, proj) {
        
    })
}