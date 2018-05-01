const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const CalendarSchema = mongoose.Schema({
    empId:{type:mongoose.Schema.Types.ObjectId,required:true},
    projectId:{type:mongoose.Schema.Types.ObjectId, required:false},
    title: {type:String, required:true},
    start: {type:Date, required:true},
    end: {type:Date, required:true},
    draggable: {type:Boolean, required:true},
    resizable: {
        beforeStart: {type:Boolean,default:true},
        afterEnd:  {type:Boolean,default:true}
      },
    color:{
        primary: {type:String },
        secondary: {type:String}
    }
});

const Calendar = module.exports = mongoose.model('Calendar', CalendarSchema);

module.exports.addCalendar = (newCalendar, callback) => {
    newCalendar.save(callback);
}

module.exports.getCalendars = (id, callback) => {
    // console.log("this real id: "+id);
    Calendar.find({empId:id},callback);
    // console.log("this real callback: "+callback);
 }
 module.exports.updateEvent = (updateEvent, callback)=>{
    // console.log(updateEvent);
    Calendar.findByIdAndUpdate(updateEvent._id,updateEvent, callback);
}