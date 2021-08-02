const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport= require('passport')
const local=require('../config/passport')

// User model
const User = require('../src/models/User')

// Login page
router.get("/login", (req, res) => {
    res.render('login', {
        title: 'Login'
    });
});

// Signup page
router.get("/signup", (req, res) => {
    res.render('signup', {
        title: 'Signup'
    });
});

// Register Handle
router.post('/signup',(req, res)=> {
    const {name, email, password,password2}=req.body;
    let errors=[];

    // Check required
    if(!name || !email || !password || !password2){
        errors.push({ msg: "Please fill in all fields"});
    }

    // Check passwords match
    if(password !== password2){
        errors.push({ msg:'Passwords do not match'})

    }

    // Check pass length
    if(password.length<6){
        errors.push({ msg: 'Password should be at least 6 characteres'});
    }

    if(errors.length > 0){
        res.render('signup',{
            errors,
            name, 
            email,
            password,
            password2
        });
    }
    
    else{
        // Validation passed
        User.findOne({email: email})
        .then(user => {
            if(user){
                // if user exists
                errors.push({msg: 'Email is already registered'});
                res.render('signup',{
                    errors,
                    name, 
                    email,
                    password,
                    password2
                });
            } 
            
            else
            {
                const newUser = new User({
                    name,
                    email,
                    password
                });
                
                
                // Hash Password
                bcrypt.genSalt(10, (err, salt)=> 
                    bcrypt.hash(newUser.password,salt,(err, hash)=> {
                        if(err) throw err;
                        
                        // Set password to hash
                        newUser.password=hash;
                        
                        // Save user
                        newUser.collection.insertOne(newUser)
                        .then(user => {
                            req.flash('success_msg',"You are successfully registered! Login Now")
                            res.redirect('/login')
                            })
                        .catch(err => console.log(err));
                    })
                )
            }
        });
    }
    
});


router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req,res,next);
});

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are successfully logged out');
    res.redirect('/login');
})
router.get('/forgot', function(req, res) {
    res.render('forgot', {
      user: req.user
    });
});

router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport('SMTP', {
          service: 'SendGrid',
          auth: {
            user: '!!! YOUR SENDGRID USERNAME !!!',
            pass: '!!! YOUR SENDGRID PASSWORD !!!'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'dscctae@gmail.com',
          subject: 'DSC Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });


module.exports=router;
