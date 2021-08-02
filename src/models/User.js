const mongoose = require('mongoose');

const UserSchema= new mongoose.Schema({
    profilepic: {
        type: String
    },
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    phonenumber: {
        type: String
    },
    dateofbirth: {
        type: Date
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

const User= mongoose.model('User',UserSchema);
module.exports = User;