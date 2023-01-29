const router = require('express').Router();
const User = require('../models/user.model');
const Task = require('../models/task.model');

router.get('/profile', async (req, res, next) => {
  // console.log(req.user);
  const person = req.user;
  res.render('profile', { person });
});


router.get('/dashboard', (req, res, next) => {
  res.render('dashboard');
});


router.get('/tasks', async (req, res, next) => {
  try {
    const person = req.user;

    const tasks = await Task.find({employee:person.email});
    
    res.render('user_tasks', { tasks });
  } catch (error) {
    next(error);
  }
});



router.post('/update-status', async (req, res, next) => {
  try {
    const { id, taskstatus } = req.body;

    // Checking for id and roles in req.body
    if ( !taskstatus) {
      req.flash('error', 'Invalid request');
      return res.redirect('back');
    }

    // Finally update the user
    const task = await Task.findByIdAndUpdate(
      id,
      { taskstatus },
      { new: true, runValidators: true }
    );

    //req.flash('info', `updated role for ${user.email} to ${user.role}`);
    res.redirect('back');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
