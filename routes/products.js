const express = require('express');
const { createProductForm, bootstrapField, createSearchForm } = require("../forms")
const { checkIfAuthenticated } = require('../middlewares');

const router = express.Router();

const {
  Products, Categories, Tags
} = require('../models');

router.get('/', checkIfAuthenticated, async (req, res) => {
  // Get all categories and tags
  let categoryObjects = await Categories.fetchAll();
  let categories = categoryObjects.map((category) => [category.get('id'), category.get('name')]);
  categories.unshift(['0', '----']); // Add empty category to represent no category filter

  let tagObjects = await Tags.fetchAll();
  let tags = tagObjects.map((tag) => [tag.get('id'), tag.get('name')]);

  let searchForm = createSearchForm(categories, tags);
  let query = Products.collection();
  searchForm.handle(req, {
    empty: async (form) => {
      // Empty form submission - we take it as no filter so we fetch everything
      let products = await query.fetch({withRelated: ['category', 'tags']});
      res.render('products/index', {
        form: searchForm.toHTML(bootstrapField),
        products: products.toJSON(),
      });
    },
    error: async (form) => {
      // When there is error, we take it as no filter so we fetch everything
      let products = await query.fetch({withRelated: ['category', 'tags']});
      res.render('products/index', {
        form: searchForm.toHTML(bootstrapField),
        products: products.toJSON(),
      });
    },
    success: async (form) => {
      if (form.data.name) {
        query.where('name', 'like', `%${form.data.name}%`);
      }

      if (form.data.category_id && form.data.category_id !== '0') {
        query.where('category_id', '=', form.data.category_id);
      }

      if (form.data.min_cost) {
        query.where('cost', '>=', form.data.min_cost);
      }

      if (form.data.max_cost) {
        query.where('cost', '>=', form.data.min_cost);
      }

      if (form.data.tags) {
        // knex.query('join', '<JOIN_TABLE_NAME>', '<ORIGINAL_TABLE_COLUMN>', '<JOIN_TABLE_COLUMN>')
        // This creates an "inner join `JOIN_TABLE_NAME` on `ORIGINAL_TABLE_COLUMN` = `<JOIN_TABLE_COLUMN>`" statement
        // `join` is a function exposed by the Knex Query Builder https://knexjs.org/guide/query-builder.html#join
        query.query('join', 'products_tags', 'products.id', 'product_id')
          .where('tag_id', 'in', form.data.tags.split(','));
      }

      let products = await query.fetch({withRelated: ['category', 'tags']});
      res.render('products/index', {
        form: searchForm.toHTML(bootstrapField),
        products: products.toJSON(),
      });
    }
  })
})

// display the form for creating a new product
router.get("/create", checkIfAuthenticated, async function(req,res){
  let categoryObjects = await Categories.fetchAll();
  let categories = categoryObjects.map((category) => [category.get('id'), category.get('name')]);

  let tagObjects = await Tags.fetchAll();
  let tags = tagObjects.map((tag) => [tag.get('id'), tag.get('name')]);

  const productForm = createProductForm(categories, tags);
  res.render("products/create", {
    "form": productForm.toHTML(bootstrapField),
    cloudinaryName: process.env.CLOUDINARY_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
  })
})

// process the submitted form
router.post("/create", checkIfAuthenticated, async function(req,res){
  // recreate the form object first
  let categoryObjects = await Categories.fetchAll();
  let categories = categoryObjects.map((category) => [category.get('id'), category.get('name')]);

  let tagObjects = await Tags.fetchAll();
  let tags = tagObjects.map((tag) => [tag.get('id'), tag.get('name')]);

  const productForm = createProductForm(categories, tags);

  // handle will process the form for us
  // first parameter: req
  // second parameter: object with three functions
  productForm.handle(req, {
    "success": async function(form) {
       // will be called if the form has no user errors

       // one instance of Products will represent one row
       // in the Products table
       const {tags, ...productData} = form.data;
       const product = new Products(productData);

       // remember to save the newly created product
       await product.save();

       if (tags) {
        await product.tags().attach(tags.split(','));
       }

       console.log(form.data);
       req.flash('success_messages', `New Product ${product.get('name')} has been created.`);
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
router.get("/update/:product_id", checkIfAuthenticated, async function(req,res){
  const productId = req.params.product_id;
  // SELECT * where products where id = '1'
  const product = await Products.where({
    "id": productId
  }).fetch({
    "require": true,
    "withRelated": ['tags'],
  });

  // create product form
  let categoryObjects = await Categories.fetchAll();
  let categories = categoryObjects.map((category) => [category.get('id'), category.get('name')]);

  let tagObjects = await Tags.fetchAll();
  let tags = tagObjects.map((tag) => [tag.get('id'), tag.get('name')]);

  const productForm = createProductForm(categories, tags);

  // set the initial value for each field
  productForm.fields.name.value = product.get('name');
  productForm.fields.cost.value = product.get('cost');
  productForm.fields.description.value = product.get('description');
  productForm.fields.category_id.value = product.get('category_id');
  productForm.fields.image_url.value = product.get('image_url');

  // https://bookshelfjs.org/api.html#Collection-instance-pluck - returns an array of values based on the selected column name
  const selectedTags = await product.related('tags').pluck('id');
  productForm.fields.tags.value = selectedTags;

  res.render("products/update", {
    "form": productForm.toHTML(bootstrapField),
    "product": product.toJSON(),  //  convert the Product bookshelf object to the JSON format so hbs files can use it
    "cloudinaryName": process.env.CLOUDINARY_NAME,
    "cloudinaryApiKey": process.env.CLOUDINARY_API_KEY,
    "cloudinaryPreset": process.env.CLOUDINARY_UPLOAD_PRESET,
  })

})

// update the product
router.post("/update/:product_id", checkIfAuthenticated, async function(req,res){
  let categoryObjects = await Categories.fetchAll();
  let categories = categoryObjects.map((category) => [category.get('id'), category.get('name')]);

  let tagObjects = await Tags.fetchAll();
  let tags = tagObjects.map((tag) => [tag.get('id'), tag.get('name')]);

  const productForm = createProductForm(categories, tags);

  // fetch the product that we want to edit
  const productId = req.params.product_id;
  const product = await Products.where({
    "id": productId
  }).fetch({
    "require": true,
    "withRelated": ['tags'],
  });
  productForm.handle(req, {
    "success": async function(form) {
      const {tags, ...productData} = form.data;

      product.set(productData);  // save everything in form.data to the product
                               // IMPORTANT: all the keys in form.data must exist
                               // as columns in the products table for this shortcut to work
      await product.save();

      // update the tags by first removing the unnecessary ones
      const tagIds = tags.split(',');
      const existingTagIds = product.related('tags').pluck('id');
      const toRemove = existingTagIds.filter(tag => !tagIds.includes(tag));

      await product.tags().detach(toRemove);
      await product.tags().attach(tagIds);

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
router.get("/delete/:product_id", checkIfAuthenticated, async function(req,res){
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

router.post("/delete/:product_id", checkIfAuthenticated, async function(req,res){
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