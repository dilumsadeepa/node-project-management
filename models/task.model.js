const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    project:{
        type : String,
        required : [true,'Please select Project Name'],
    },
    employee:{
        type : String,
        required : [true,'Please select employee'],
    },
    taskstatus:{
        type : String,
        required : true,
    },
    description:{
        type: String,
        required : true,
    }
});



module.exports = mongoose.model("Task", taskSchema);