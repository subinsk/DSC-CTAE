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


module.exports=router;
