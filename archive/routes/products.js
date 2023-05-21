const express = require("express");
const {
  createProductForm,
  bootstrapField,
  createSearchForm,
} = require("../forms");
const {
  searchProduct,
  getAllCategories,
  getAllTags,
  createProduct,
  getProductByID,
  updateProductByID,
  deleteProductByID,
} = require("../dal/products");
const { checkIfAuthenticated } = require("../middlewares");

const router = express.Router();

router.get("/", checkIfAuthenticated, async (req, res) => {
  // Get all categories and tags
  let categories = await getAllCategories();
  categories.unshift(["0", "----"]); // Add empty category to represent no category filter

  let tags = await getAllTags();

  let searchForm = createSearchForm(categories, tags);
  searchForm.handle(req, {
    empty: async (form) => {
      // Empty form submission - we take it as no filter so we fetch everything
      let products = await searchProduct({});
      res.render("products/index", {
        form: form.toHTML(bootstrapField),
        products: products.toJSON(),
      });
    },
    error: async (form) => {
      // When there is error, we take it as no filter so we fetch everything
      let products = await searchProduct({});
      res.render("products/index", {
        form: form.toHTML(bootstrapField),
        products: products.toJSON(),
      });
    },
    success: async (form) => {
      let products = await searchProduct({
        name: form.data.name,
        categoryId: form.data.category_id,
        minCost: form.data.min_cost,
        maxCost: form.data.max_cost,
        tags: form.data.tags,
      });
      res.render("products/index", {
        form: searchForm.toHTML(bootstrapField),
        products: products.toJSON(),
      });
    },
  });
});

// display the form for creating a new product
router.get("/create", checkIfAuthenticated, async function (req, res) {
  let categories = await getAllCategories();
  let tags = await getAllTags();

  const productForm = createProductForm(categories, tags);
  res.render("products/create", {
    form: productForm.toHTML(bootstrapField),
  });
});

// process the submitted form
router.post("/create", checkIfAuthenticated, async function (req, res) {
  // recreate the form object first
  let categories = await getAllCategories();
  let tags = await getAllTags();

  const productForm = createProductForm(categories, tags);

  // handle will process the form for us
  // first parameter: req
  // second parameter: object with three functions
  productForm.handle(req, {
    success: async function (form) {
      // will be called if the form has no user errors

      // one instance of Products will represent one row
      // in the Products table
      let product = await createProduct(
        form.data.name,
        form.data.cost,
        form.data.description,
        form.data.category_id,
        form.data.tags,
        form.data.image_url
      );

      req.flash(
        "success_messages",
        `New Product ${product.get("name")} has been created.`
      );
      res.redirect("/products");
    },
    empty: function (form) {
      // will be called if the form is submitted with no input
      res.render("products/create", {
        form: form.toHTML(bootstrapField),
      });
    },
    error: function (form) {
      // the form has user errors (i.e validation errors)
      res.render("products/create", {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

// display the form for modifying a product
router.get(
  "/update/:product_id",
  checkIfAuthenticated,
  async function (req, res) {
    const productId = req.params.product_id;
    let product = await getProductByID(productId);

    // create product form
    let categories = await getAllCategories();
    let tags = await getAllTags();
    const productForm = createProductForm(categories, tags);

    // set the initial value for each field
    productForm.fields.name.value = product.get("name");
    productForm.fields.cost.value = product.get("cost");
    productForm.fields.description.value = product.get("description");
    productForm.fields.category_id.value = product.get("category_id");
    productForm.fields.image_url.value = product.get("image_url");

    // https://bookshelfjs.org/api.html#Collection-instance-pluck - returns an array of values based on the selected column name
    const selectedTags = await product.related("tags").pluck("id");
    productForm.fields.tags.value = selectedTags;

    res.render("products/update", {
      form: productForm.toHTML(bootstrapField),
      product: product.toJSON(), //  convert the Product bookshelf object to the JSON format so hbs files can use it
    });
  }
);

// update the product
router.post(
  "/update/:product_id",
  checkIfAuthenticated,
  async function (req, res) {
    const productId = req.params.product_id;

    let categories = await getAllCategories();
    let tags = await getAllTags();
    const productForm = createProductForm(categories, tags);

    productForm.handle(req, {
      success: async function (form) {
        await updateProductByID(productId, form.data);
        res.redirect("/products");
      },
      error: function (form) {
        res.render("/products/update", {
          form: form,
          product: product.toJSON(),
        });
      },
      empty: function (form) {
        res.render("/products/update", {
          form: form,
          product: product.toJSON(),
        });
      },
    });
  }
);

// delete the product
router.get(
  "/delete/:product_id",
  checkIfAuthenticated,
  async function (req, res) {
    const product = await getProductByID(req.params.product_id);

    res.render("products/delete", {
      product: product.toJSON(),
    });
  }
);

router.post(
  "/delete/:product_id",
  checkIfAuthenticated,
  async function (req, res) {
    await deleteProductByID(req.params.product_id);
    res.redirect("/products");
  }
);

module.exports = router;
