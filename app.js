const path = require("path");
const express = require("express")
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const connectEnsureLogin = require('connect-ensure-login');
const flash = require('connect-flash');
const User = require('./conn.js');
require("dotenv").config();
const port = process.env.PORT || 8000
const app = express();

require('./config/passport')(passport);


// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express session middleware
app.use(session({
    secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

app.use(passport.initialize());
app.use(passport.session());

// flash
app.use(flash());
// views
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(express.static('public'))

// global vars
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
})

app.use('/', require('./routes/index'));
app.use('/', require('./routes/users'));

app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});
