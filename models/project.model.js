const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName:{
        type : String,
        required : [true,'Please enter Project Name'],
    },
    projectLocation:{
        type : String,
        required : [true,'Please enter project location'],
    },
    cost:{
        type : Number,
        required : [true,'Please enter project cost'],
    },
});



module.exports = mongoose.model("Project", projectSchema);