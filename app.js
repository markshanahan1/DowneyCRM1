const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const config = require('./config/database');
const router = express.Router();
// Connect To Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});

const app = express();


const companies = require('./routes/companies');
 const employees = require('./routes/employees');
 const timesheets = require('./routes/timesheets');
 const calendars = require('./routes/calendars');
 const stages = require('./routes/stages');
 const projects = require('./routes/projects');
 const clients = require('./routes/clients');
 const uploads = require('./routes/uploads');
// Port Number
const port = process.env.PORT || 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//require('./config/passport')(passport);



app.use('/companies', companies);
 app.use('/employees', employees);
 app.use('/stages', stages);
 app.use('/timesheets', timesheets);
 app.use('/calendars', calendars);
 app.use('/projects', projects);
 app.use('/clients', clients);

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start Server
app.listen(port, () => {
  console.log('Server started on port '+port);
});