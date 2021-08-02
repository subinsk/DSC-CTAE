const mongoose = require('mongoose');

const ProjectSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    projectname:{
        type: String,
        required: true
    },
    projecturl:{
        type: String, 
        required: true
    },
    projectgivendate:{
        type: Date,
        default: Date.now,
        required: true
    },
    projectsubmitdate:{
        type: Date,
        default: Date.now,
        required: true
    }
});

const Project= mongoose.model('Projects',ProjectSchema);
module.exports = Project;