const User = require('../models/user.model');
const Project = require('../models/project.model');
const Task = require('../models/task.model');
const router = require('express').Router();
const bodyParser = require('body-parser');
const {body,validationResult, check}=require('express-validator');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const mongoose = require('mongoose');
const { roles } = require('../utils/constants');

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find();

    res.render('users', { users });
  } catch (error) {
    next(error);
  }
});

router.get('/project_list', async (req, res, next) => {
  try {
    const projects = await Project.find();
    
    res.render('project_list', { projects });
  } catch (error) {
    next(error);
  }
});

router.get('/task_list', async (req, res, next) => {
  try {
    const tasks = await Task.find();
    
    res.render('task_list', { tasks });
  } catch (error) {
    next(error);
  }
});

router.get('/add_project', async (req, res, next) => {
  try {
    res.render('add_project');
  } catch (error) {
    next(error);
  }
});

router.get('/add_task', async (req, res, next) => {
  try {
    const projects = await Project.find();
    const users = await User.find();

    res.render('add_task', { projects, users });
  } catch (error) {
    next(error);
  }
});


//Adding project
router.post('/addproject',(req,res)=>{
  const project = new Project({
      projectName: req.body.projectname,
      projectLocation: req.body.projectlocation,
      cost: req.body.cost,
  });

  project.save((err)=>{
      if (err) {
          res.json({ message: err.message, type: 'danger'}); 
      }else{
          req.session.message = {
              type : 'success',
              message : 'Project added success',
          };
          
      res.redirect("/admin/project_list");     
      }
  }) 

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          const alert = errors.array()
      res.render('/admin/add_project', {
          alert
          })   
      }else{
          
      }        

});


//Edit project
router.get('/edit_project/:id',async(req,res)=>{
  let id = req.params.id;
    Project.findById(id,(err,project)=>{
        if (err) {
            res.redirect('/')
        }else{
            if (project == null) {
                res.redirect('/')
            }else{
                res.render("edit_project",{
                    project : project,
                });
            }
        }
    })
});

//Update project
router.post('/updateproject/:id',async(req,res,)=>{
  let id=req.params.id;
  Project.findByIdAndUpdate(id,{
    projectName:req.body.projectname,
    projectLocation:req.body.projectlocation,
    cost:req.body.cost,
  
},(err,result)=>{
    if (err) {
        res.json({ message: err.message, type:'danger'});
    }else{
        req.session.message = {
            type : 'success',
            message : 'Update project success',
        }
        res.redirect("/admin/project_list");
    }
})
});


//Delete project
router.get('/delete_project/:id',(req,res,)=>{
  let id=req.params.id;
  Project.findByIdAndRemove(id,(err,result)=>{
    if (err) {
        res.json({ message: err.message, type:'danger'});
    }else{
        req.session.message = {
            type : 'success',
            message : 'Delete project success',
        }
        res.redirect("/admin/project_list");
    }
  })
});



// Adding task
router.post('/addtask',(req,res)=>{
  const task = new Task({
    project: req.body.project,
    employee: req.body.empname,
    taskstatus: req.body.taskstatus,
    description: req.body.description,
  });

  task.save((err)=>{
      if (err) {
          res.json({ message: err.message, type: 'danger'}); 
      }else{
          req.session.message = {
              type : 'success',
              message : 'Project added success',
          };
          
      res.redirect("/admin/add_task");     
      }
  }) 

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          const alert = errors.array()
      res.render('/admin/add_task', {
          alert
          })   
      }else{
          
      }        

});

// Edit Task
router.get('/edit_task/:id',async(req,res)=>{
  let id = req.params.id;
  try {
    const projects = await Project.find();
    const users = await User.find();
    const task = await Task.findById(id);

    res.render('edit_task', { projects , users , task });
  } catch (error) {
    next(error);
  }

});




// User
router.get('/user/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid id');
      res.redirect('/admin/users');
      return;
    }
    const person = await User.findById(id);
    res.render('profile', { person });
  } catch (error) {
    next(error);
  }
});

router.post('/update-role', async (req, res, next) => {
  try {
    const { id, role } = req.body;

    // Checking for id and roles in req.body
    if (!id || !role) {
      req.flash('error', 'Invalid request');
      return res.redirect('back');
    }

    // Check for valid mongoose objectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid id');
      return res.redirect('back');
    }

    // Check for Valid role
    const rolesArray = Object.values(roles);
    if (!rolesArray.includes(role)) {
      req.flash('error', 'Invalid role');
      return res.redirect('back');
    }

    // Admin cannot remove himself/herself as an admin
    if (req.user.id === id) {
      req.flash(
        'error',
        'Admins cannot remove themselves from Admin, ask another admin.'
      );
      return res.redirect('back');
    }

    // Finally update the user
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    );

    req.flash('info', `updated role for ${user.email} to ${user.role}`);
    res.redirect('back');
  } catch (error) {
    next(error);
  }
});


module.exports = router;
