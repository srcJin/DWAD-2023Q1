const bookshelf = require('../bookshelf');

// one Model class represents one table
const Products = bookshelf.model('Product', {
  tableName: 'products',
});

module.exports = {
  Products,
};