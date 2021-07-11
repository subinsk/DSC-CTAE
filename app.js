const express = require("express")
const path = require("path");
const app = express();
// const port = 80;
const port = process.env.PORT || 3000

// app.use('static', express.static('static'))

app.set('views',path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')))


app.get("/",(req,res)=>{
    res.render('home',{
        title: 'Home'
    });
});
app.get("/login",(req,res)=>{
    res.render('login',{
        title: 'Login'
    });
});
app.get("/signup",(req,res)=>{
    res.render('signup',{
        title: 'Signup'
    });
});
app.get("/about",(req,res)=>{
    res.render('about',{
        title: 'About'
    });
});
app.get("/dashboard",(req,res)=>{
    res.render('dashboard',{
        title: 'Dashboard'
    });
});



app.listen(port,()=>{
    console.log(`The application started successfully on port ${port}`);
});
