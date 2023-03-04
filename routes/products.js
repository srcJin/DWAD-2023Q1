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
router.post("/create",  function(req,res){
  // recreate the form object first
  const productForm = createProductForm();

  // handle will process the form for us
  // first parameter: req
  // second parameter: object with three functions
  productForm.handle(req, {
    "success": async function(form) {
       // will be called if the form has no user errors

       // one instance of Products will represent one row
       // in the Products table
       const product = new Products();
       product.set("name", form.data.name);
       product.set("cost", form.data.cost);
       product.set("description", form.data.description);

       // remember to save the newly created product
       await product.save();

       console.log(form.data);
       res.redirect("/products");
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


// display the form for modifying a product
router.get("/update/:product_id", async function(req,res){
  const productId = req.params.product_id;
  // SELECT * where products where id = '1'
  const product = await Products.where({
    "id": productId
  }).fetch({
    "require": true
  });

  // create product form
  const productForm = createProductForm();
  // set the initial value for each field
  productForm.fields.name.value = product.get('name');
  productForm.fields.cost.value = product.get('cost');
  productForm.fields.description.value = product.get('description');

  res.render("products/update", {
    "form": productForm.toHTML(bootstrapField),
    "product": product.toJSON()  //  convert the Product bookshelf object to the JSON format so hbs files can use it
  })

})

// update the product
router.post("/update/:product_id",  async function(req,res){
  const productForm = createProductForm();

  // fetch the product that we want to edit
  const productId = req.params.product_id;
  const product = await Products.where({
    "id": productId
  }).fetch({
    "require": true
  });
  productForm.handle(req, {
    "success": async function(form) {
      // product.set("name", form.data.name);
      // product.set("cost", form.data.cost);
      // product.set("description", form.data.description);

      product.set(form.data);  // save everything in form.data to the product
                               // IMPORTANT: all the keys in form.data must exist
                               // as columns in the products table for this shortcut to work
      await product.save();

      res.redirect("/products");


    },
    "error": function(form) {
      res.render("/products/update", {
        "form": form,
        "prodct": product.toJSON()
      })
    },
    "empty": function(form) {
      res.render("/products/update", {
        "form": form,
        "prodct": product.toJSON()
      })
    }
  })
})

// delete the product
router.get("/delete/:product_id", async function(req,res){
  const productId = req.params.product_id;
  // SELECT * where products where id = '1'
  const product = await Products.where({
    "id": productId
  }).fetch({
    "require": true
  });

  res.render("products/delete",{
    "product": product.toJSON()
  })
})

router.post("/delete/:product_id", async function(req,res){
  const productId = req.params.product_id;
  // SELECT * where products where id = '1'
  const product = await Products.where({
    "id": productId
  }).fetch({
    "require": true
  });

  await product.destroy();
  res.redirect("/products");
})

module.exports = router;