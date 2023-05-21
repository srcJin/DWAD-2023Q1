const bookshelf = require("../bookshelf");

// one Model class represents one table
const Products = bookshelf.model("Product", {
  tableName: "products",
  category() {
    return this.belongsTo("Category");
  },
  tags() {
    // https://bookshelfjs.org/api.html#Model-instance-belongsToMany
    return this.belongsToMany(
      "Tag", // the model to be referenced
      "products_tags", // joinTableName - The pivot table name
      "product_id", // foreignKey - The column in the pivot table that corresponds to this model's key
      "tag_id", // otherKey - The column in the pivot table that corresponds to the referenced model's key
      "id", // foreignKeyTarget - The column name in this model that corresponds to `foreignKey`
      "id" // otherKeyTarget - The column name in the referenced table that corresponds to `otherKey`
    );

    // The extra parameters are optional as long as the table and column names are set up according to the convention
    // spelled out by bookshelf. Should the names not conform to convention, they can be customised based on the
    // parameter descriptions above.
  },
});

const Categories = bookshelf.model("Category", {
  tableName: "categories",
  products() {
    // Conventionally, bookshelf will determine the foreign key column in the products table
    // by taking taking the singular form of the referenced table name and appending '_id',
    // ie, category_id (which is what we have set up in the products table).
    //
    // In this case, the 2nd parameter 'category_id' is optional.
    return this.hasMany("Product", "category_id");
  },
});

const Tags = bookshelf.model("Tag", {
  tableName: "tags",
  products() {
    return this.belongsToMany("Product");
  },
});

const Users = bookshelf.model("User", {
  tableName: "users",
});

const CartItems = bookshelf.model("CartItem", {
  tableName: "cart_items",
  user() {
    return this.belongsTo("User");
  },
  product() {
    return this.belongsTo("Product");
  },
});

module.exports = {
  Products,
  Categories,
  Tags,
  Users,
  CartItems,
};
