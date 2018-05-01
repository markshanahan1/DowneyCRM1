const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const DocumentSchema = mongoose.Schema({
    name: {type:String, required:true},
    type: {type:String, required:true},
    src: {type:String, required:true},
    dateAdded: {type:Date, required:true}
});

const DocumentSch = module.exports = mongoose.model('Document', DocumentSchema);

