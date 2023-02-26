const express = require('express');
const router = express.Router();

const {
  Products
} = require('../models');

router.get('/', async (req, res) => {
  // SELECT * FROM products;
  let products = await Products.collection().fetch();
  res.render('products/index', {
    products: products.toJSON(),
  });
})

module.exports = router;