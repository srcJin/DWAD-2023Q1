const express = require('express');
const router = express.Router();

router.get('/', (_, res) => {
  res.render('landing/index');
});

router.get('/about-us', (_, res) => {
  res.render('landing/about-us');
});

router.get('/contact-us', (_, res) => {
  res.render('landing/contact-us');
});

module.exports = router;