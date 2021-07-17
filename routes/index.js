const express = require('express')
const router = express.Router();
const {ensureAuthenticated}=require('../config/auth')

router.get("/", (req, res) => {
    res.render('home', {
        title: 'Home'
    });
});

router.get("/about", (req, res) => {
    res.render('about', {
        title: 'About'
    });
});
router.get('/dashboard',(req,res)=>{
    res.render('dashboard',{
        user: req.user.name
    })
    res.render('dashboard');
})

module.exports = router;