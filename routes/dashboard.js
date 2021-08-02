const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport= require('passport')
const local=require('../config/passport')

// User model
const User = require('../src/models/User')

router.get('/dashboard',(req,res)=>{
    res.render('dashboard/dashboard',{
        user: req.user.name,
        email: req.user.email,
        password: req.user.password,
        navbarHeading: 'Dashboard'
    })
});


router.post('/dashboard',(req,res)=>{
    let {name, email, password}=req.body;
    const dbEmail = req.user.email;
    
    // Hash Password
    bcrypt.genSalt(10, (err, salt)=>
        bcrypt.hash(password,salt,(err, hash)=> {
            if(err) throw err;
            
            // Set password to hash
            password=hash;
            
            // Update user
            User.updateOne({ email: dbEmail},{name: name,email: email,password: password},(err,result)=>{
                if(err){
                    res.send(err);
                }
                else{
                    res.send('Your account is successfully updated');
                }
            });
        })
    );
});

router.post('/checkfields',(req,res)=>{
    const email = req.body.email;
    // Checking for pre-existing email if any
    let errors='';
    User.findOne({email: email})
    .then(user => {
        if(user){
            // if user exists
            errors = 'Email is already registered';
        }

        res.send(errors);
    });
});

router.get('/dashboard/myprojects',(req,res)=>{
    res.sendStatus(200).render('updateprofile',{
        navbarHeading: 'myprojects'
    });
});

router.get('/dashboard/mycontestsubmissions',(req,res)=>{
    res.sendStatus(200).render('mycontestsubmissions',{
        navbarHeading: 'mycontestsubmissions'
    });
});

module.exports = router;