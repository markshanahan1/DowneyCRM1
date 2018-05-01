const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const ServiceSchema = mongoose.Schema({
    service:{type:String, required:true},
    group: {type:String, required:true}
});
//COMPANIES SERVICE LIST.

const Service = module.exports = mongoose.model('Service', ServiceSchema);
