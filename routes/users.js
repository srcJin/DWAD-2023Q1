const express = require('express');
const crypto = require('crypto');
const { createRegistrationForm, bootstrapField, createLoginForm } = require('../forms');
const { checkIfAuthenticated } = require('../middlewares');

const router = express.Router();

// import the User model so we can CRUD some users
const { Users } = require('../models');

// helper method to create a hash of a password
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
}

router.get('/login', (req, res) => {
  if (req.session.user) {
    // Already logged in, redirect to profile
    return res.redirect('/users/profile');
  }

  const loginForm = createLoginForm();
  res.render('users/login', {
    form: loginForm.toHTML(bootstrapField),
  });
});

router.post('/login', (req, res) => {
  const loginForm = createLoginForm();
  loginForm.handle(req, {
    success: async (form) => {
      const user = await Users.where({
        username: form.data.username,
      }).fetch({require: false});

      if (!user) {
        // username does not exist
        req.flash('error_messages', 'Invalid credentials');
        return res.redirect('/users/login');
      }

      if (user.get('password') !== getHashedPassword(form.data.password)) {
        // password does not match
        req.flash('error_messages', 'Invalid credentials');
        return res.redirect('/users/login');
      }

      // add to the session that login succeeded
      req.session.user = {
        id: user.get('id'),
        username: user.get('username'),
        email: user.get('email'),
      };

      req.flash('success_messages', 'Welcome back, ' + user.get('username'));
      res.redirect('/users/profile');
    },
    empty: (form) => {
      // will be called if the form is submitted with no input
      res.render("users/login",{
        form: form.toHTML(bootstrapField),
      });
    },
    error: (form) => {
      // will be called if the form is submitted with errors
      res.render("users/login",{
        form: form.toHTML(bootstrapField),
      });
    },
  });
})

router.get('/profile', checkIfAuthenticated, (req, res) => {
  const user = req.session.user;

  if (!user) {
    req.flash('error_messages', 'You do not have permission to view this page');
    return res.redirect('/users/login');
  }

  res.render('users/profile', {
    user,
  });
});

router.get('/register', (req, res) => {
  const registerForm = createRegistrationForm();
  res.render('users/register', {
    form: registerForm.toHTML(bootstrapField),
  });
});

router.post('/register', (req, res) => {
  const registerForm = createRegistrationForm();
  registerForm.handle(req, {
    success: async (form) => {
      const user = new Users({
        username: form.data.username,
        password: getHashedPassword(form.data.password),
        email: form.data.email,
      });

      // TODO: Hash the user password before saving
      await user.save();

      req.flash('success_messages', 'User signed up successfully');
      res.redirect('/users/login');
    },
    empty: (form) => {
      // will be called if the form is submitted with no input
      res.render("users/register",{
        form: form.toHTML(bootstrapField),
      });
    },
    error: (form) => {
      // will be called if the form is submitted with errors
      res.render("users/register",{
        form: form.toHTML(bootstrapField),
      });
    },
  })
});

router.get('/logout', (req, res) => {
  if (req.session.user){
    req.session.user = null;
    req.flash('success_messages', 'You have successfully logged out');
  }  
  res.redirect('/users/login');
});

module.exports = router;
