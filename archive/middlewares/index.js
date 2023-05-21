const { bootstrapField } = require("../forms");

const checkIfAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }

  req.flash("error_messages", "You need to sign in to access this page");
  res.redirect("/users/login");
};

/** Registers a convenience function to `res` to render a form */
const useRenderForm = (req, res, next) => {
  res.renderForm = (view) => (form) => {
    res.render(view, {
      form: form.toHTML(bootstrapField),
    });
  };
  next();
};

module.exports = { checkIfAuthenticated, useRenderForm };
