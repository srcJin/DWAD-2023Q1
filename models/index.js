const bookshelf = require('../bookshelf');

// one Model class represents one table
const Products = bookshelf.model('Product', {
  tableName: 'products',
  category() {
    return this.belongsTo('Category');
  },
});

const Categories = bookshelf.model('Category', {
  tableName: 'categories',
  products() {
    // Conventionally, bookshelf will determine the foreign key column in the products table
    // by taking taking the singular form of the referenced table name and appending '_id',
    // ie, category_id (which is what we have set up in the products table).
    //
    // In this case, the 2nd parameter 'category_id' is optional.
    return this.hasMany('Product', 'category_id');
  }
})

module.exports = {
  Products,
  Categories,
};