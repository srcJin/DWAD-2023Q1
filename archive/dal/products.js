const { Products, Categories, Tags } = require("../models");

exports.getAllCategories = () =>
  Categories.fetchAll().map((category) => [
    category.get("id"),
    category.get("name"),
  ]);

exports.getAllTags = () =>
  Tags.fetchAll().map((tag) => [tag.get("id"), tag.get("name")]);

exports.getProductByID = (productId) =>
  Products.where({ id: parseInt(productId) }).fetch({
    require: true,
    withRelated: ["tags", "category"],
  });

exports.searchProduct = ({ name, categoryId, minCost, maxCost, tags }) => {
  const query = Products.collection();

  if (name) {
    query.where("name", "like", `%${name}%`);
  }
  if (categoryId && categoryId !== "0") {
    query.where("category_id", "=", categoryId);
  }
  if (minCost) {
    query.where("cost", ">=", minCost);
  }
  if (maxCost) {
    query.where("cost", "<=", maxCost);
  }
  if (tags) {
    // knex.query('join', '<JOIN_TABLE_NAME>', '<ORIGINAL_TABLE_COLUMN>', '<JOIN_TABLE_COLUMN>')
    // This creates an "inner join `JOIN_TABLE_NAME` on `ORIGINAL_TABLE_COLUMN` = `<JOIN_TABLE_COLUMN>`" statement
    // `join` is a function exposed by the Knex Query Builder https://knexjs.org/guide/query-builder.html#join
    query
      .query("join", "products_tags", "products.id", "product_id")
      .where("tag_id", "in", tags.split(","));
  }

  return query.fetch({ withRelated: ["category", "tags"] });
};

exports.createProduct = async (
  name,
  cost,
  description,
  categoryId,
  tags,
  imageUrl
) => {
  const product = new Products({
    name,
    cost,
    description,
    category_id: categoryId,
    image_url: imageUrl,
  });

  // remember to save the newly created product
  await product.save();

  if (tags) {
    await product.tags().attach(tags.split(","));
  }

  return product;
};

exports.updateProductByID = async (productId, updateParams) => {
  const product = await this.getProductByID(productId);
  const { tags, ...productData } = updateParams;

  product.set(productData); // save everything in form.data to the product
  // IMPORTANT: all the keys in form.data must exist
  // as columns in the products table for this shortcut to work
  await product.save();

  // update the tags by first removing the unnecessary ones
  const tagIds = tags.split(",");
  const existingTagIds = product.related("tags").pluck("id");
  const toRemove = existingTagIds.filter((tag) => !tagIds.includes(tag));

  await product.tags().detach(toRemove);
  await product.tags().attach(tagIds);

  return product;
};

exports.deleteProductByID = async (productId) => {
  // SELECT * where products where id = '1'
  const product = await this.getProductByID(productId);
  await product.destroy();
};
