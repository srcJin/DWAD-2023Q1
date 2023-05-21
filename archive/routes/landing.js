const express = require('express');
// use `express.Router()` function to create a new router object
const router = express.Router();

// instead of `app.get` or `app.post` we use `router.get`, `router.post` etc.
router.get('/', (_, res) => {
  res.render('landing/index');
});

router.get('/about-us', (_, res) => {
  res.render('landing/about-us');
});

router.get('/contact-us', (_, res) => {
  res.render('landing/contact-us');
});

// make sure to export our created router object
// whatever we export, other JS files in nodejs can use
module.exports = router;