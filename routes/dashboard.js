const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// User model
const User = require('../src/models/User')

// Image Uploader
const upload = require('../src/scripts/imageUploader')

router.get('/dashboard',(req,res)=>{
    res.render('dashboard/dashboard',{
        profilepic: req.user.profilepic,
        name: req.user.name,
        username: req.user.username,
        email: req.user.email,
        gender: req.user.gender,
        mobileno: req.user.mobileno,
        dob: req.user.dateofbirth,
        password: req.user.password,
        navbarHeading: 'Dashboard'
    })
});


router.post('/dashboard',(req,res)=>{
    let {name, username, email, gender, mobileno, dob, password} = req.body;
    const dbEmail = req.user.email;
    const dbPassword = req.user.password;
    
    if(dbPassword===password){
        // Hash Password
        bcrypt.genSalt(10, (err, salt)=>
            bcrypt.hash(password,salt,(err, hash)=> {
                if(err) throw err;
                
                // Set password to hash
                password=hash;
            })
        );
    }       
    // Update user
    User.updateOne({ email: dbEmail},{name: name, username: username, email: email,gender: gender,mobileno: mobileno,dateofbirth: dob,password: password},(err,result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send('Your account is successfully updated');
        }
    });
});

router.post('/checkfields',(req,res)=>{
    const email = req.body.email;
    const username = req.body.username;

    // Checking for pre-existing email if any
    let errors='';
    User.findOne({email: email})
    .then(user => {
        if(user){
            // if email exists
            errors = 'Email is already registered';
        }
        
        else{
            User.findOne({ username: username})
                .then(user => {
                    if(user){
                        // if useranme exists
                        errors = 'Username is already registered';
                    }
                });
        }
    });
    res.send(errors);
});

router.post('/profilepic',upload.single('profilepic'),(req,res)=>{
    let img= {
        data: fs.readFileSync(path.join(path.dirname(__dirname),'uploads/',req.file.filename)),
        contentType: req.file.mimetype
    };

    let dbEmail = req.user.email;

    // Update profile pic
    User.updateOne({ email: dbEmail},{profilepic: img},(err,result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.redirect('/dashboard');
            fs.unlink(path.join(path.dirname(__dirname),'uploads/',req.file.filename),(err)=>{
                if(err){
                    throw err;
                }
            });
        }
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