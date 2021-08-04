const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const UserSchema= new mongoose.Schema({
    profilepic: {
        data: Buffer,
        contentType: String
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
    mobileno: {
        type: String
    },
    dateofbirth: {
        type: String
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