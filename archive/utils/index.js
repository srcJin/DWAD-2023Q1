const crypto = require("crypto");

exports.hash = (plaintext) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(plaintext).digest("base64");
  return hash;
};

exports.renderForm = (res, view) => (form) => {
  res.render(view, {
    form: form.toHTML(bootstrapField),
  });
};
