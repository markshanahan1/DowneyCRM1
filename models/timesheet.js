const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const TimesheetSchema = mongoose.Schema({
    hourly_ts:[{
        client: {
            clId:{type:mongoose.Schema.Types.ObjectId},
            clTitle:{type:String}
        },
        project:{
            prId:{type:mongoose.Schema.Types.ObjectId},
            prTitle:{type:String}
        },
        stage:{
            stId:{type:mongoose.Schema.Types.ObjectId},
            stTitle:{type:String}
        },
        entryType:{type:String},
        hour:{type:Number, required:true},
        Details:{type:String,required:true},
        empUsername:{type:String, required:true},
        date:{type:Date, required:true}
    }]
});

const Timesheet = module.exports = mongoose.model('Timesheet', TimesheetSchema);


module.exports.addTimesheet = (newTimesheet, callback) => {
    newTimesheet.save(callback);
    console.log('in serverside' + newTimesheet);
}


module.exports.getTimesheetsforBudget = (id, callback) => {
    // console.log("this real id: "+id);
     Timesheet.find({"hourly_ts.project.prId":id},callback);
    // console.log("this real callback: "+callback);
 }
 module.exports.getEmpTimesheets = (id, callback) => {
    // console.log("this real id: "+id);
     Timesheet.find({"hourly_ts.empUsername":id},callback);
    // console.log("this real callback: "+callback);
 }