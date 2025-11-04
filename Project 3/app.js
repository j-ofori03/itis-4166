// require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const itemRoutes = require('./routes/itemRoutes'); 

// create app
const app = express();

// configure app
let port = 3000;
let host = 'localhost';
let url = 'mongodb://localhost:27017/project3';
app.set('view engine', 'ejs');
const mongUri = 'mongodb+srv://joforibo:JesusChrist11***@cluster0.pimsc.mongodb.net/project3?retryWrites=true&w=majority&appName=Cluster0';

// connect to MongoDB
mongoose.connect(mongUri)
.then (()=>{
    // start the server
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    })
})
.catch(err=>console.log(err.message))

// mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// setup routes
app.get('/', (req, res) => {
    console.log(`${req.method} ${req.url}`);
    res.render('index'); 
});

// item routes for '/items'
app.use('/items', itemRoutes);

// error handling for routes not found (404)
app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url); 
    err.status = 404;
    next(err);
});

// error handler for all errors
app.use((err, req, res, next) => {
    console.log(err.stack);
    if (!err.status) {
        err.status = 500;
        err.message = "Internal Server Error";
    }
    res.status(err.status);
    res.render('error', {error: err}); // Render the error view
});
