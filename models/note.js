const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');


const NoteSchema = mongoose.Schema({
    date: {type:Date, required:true},
    note: {type:String, required:true}
});
//THIS IS THE SCHEMA FOR THE PROJECTS TO IDENTIFY WHAT SERVICES APPLY TO EACH PROJECT

const Note = module.exports = mongoose.model('Note', NoteSchema);
