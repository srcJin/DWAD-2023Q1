const express = require('express');
const { createProductForm, bootstrapField } = require("../forms")
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

// display the form for creating a new product
router.get("/create", function(req,res){
  const productForm = createProductForm();
  res.render("products/create", {
    "form": productForm.toHTML(bootstrapField)
  })
})

// process the submitted form
router.post("/create", async function(req,res){
  // recreate the form object first
  const productForm = createProductForm();

  // handle will process the form for us
  // first parameter: req
  // second parameter: object with three functions
  productForm.handle(req, {
    "success": function(form) {
       // will be called if the form has no user errors
       console.log(form.data);
       res.send("form recieved");
    },
    "empty": function(form) {
      // will be called if the form is submitted with no input
      res.render("products/create",{
        "form": form.toHTML(bootstrapField)
      })
    },
    "error": function(form) {
      // the form has user errors (i.e validation errors)
      res.render("products/create",{
        "form": form.toHTML(bootstrapField)
      })
    }
  })
})

module.exports = router;