const bookshelf = require('../bookshelf');

const Products = bookshelf.model('Product', {
  tableName: 'products',
});

module.exports = {
  Products
};