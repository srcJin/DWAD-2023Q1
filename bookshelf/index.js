const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'foo', // TODO: Put these into env
    password: 'bar',
    database: 'organic'
  }
});
const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;