const express = require("express");
const router = express.Router();

const {
  createRegistrationForm,
  createLoginForm,
  bootstrapField,
} = require("../forms");
const { checkIfAuthenticated } = require("../middlewares");

const { verify, createUser } = require("../dal/users");

router.get("/login", (req, res) => {
  if (req.session.user) {
    // Already logged in, redirect to profile
    return res.redirect("/users/profile");
  }

  const loginForm = createLoginForm();
  res.renderForm("users/login")(loginForm);
});

router.post("/login", (req, res) => {
  const loginForm = createLoginForm();
  loginForm.handle(req, {
    success: async (form) => {
      const user = await verify(form.data.username, form.data.password);
      if (!user) {
        req.flash("error_messages", "Invalid credentials");
        return res.redirect("/users/login");
      }

      // add to the session that login succeeded
      req.session.user = {
        id: user.get("id"),
        username: user.get("username"),
        email: user.get("email"),
      };

      req.flash("success_messages", "Welcome back, " + user.get("username"));
      res.redirect("/users/profile");
    },
    empty: res.renderForm("users/login"),
    error: res.renderForm("users/login"),
  });
});

router.get("/profile", checkIfAuthenticated, (req, res) => {
  const user = req.session.user;
  res.render("users/profile", {
    user,
  });
});

router.get("/register", (req, res) => {
  const registerForm = createRegistrationForm();
  res.renderForm("users/register")(registerForm);
});

router.post("/register", (req, res) => {
  const registerForm = createRegistrationForm();
  registerForm.handle(req, {
    success: async (form) => {
      await createUser(form.data.username, form.data.password, form.data.email);

      req.flash("success_messages", "User signed up successfully");
      res.redirect("/users/login");
    },
    empty: res.renderForm("users/register"),
    error: res.renderForm("users/register"),
  });
});

function renderForm(res) {
  return function (form) {
    // will be called if the form is submitted with errors
    res.render("users/login", {
      form: form.toHTML(bootstrapField),
    });
  };
}

router.get("/logout", (req, res) => {
  if (req.session.user) {
    req.session.user = null;
    req.flash("success_messages", "You have successfully logged out");
  }
  res.redirect("/users/login");
});

module.exports = router;
