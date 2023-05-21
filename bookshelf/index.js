// Setting up the database connection
const knex = require('knex')({
    client: 'mysql',
    connection: {
      user: { "ENV": "MYSQL_USERNAME" },
      password:{ "ENV": "MYSQL_PASSWORD" },
      database:{ "ENV": "MYSQL_DATABASE" },
      host:{ "ENV": "MYSQL_HOST" }
    }
  })
  const bookshelf = require('bookshelf')(knex)
  
  module.exports = bookshelf;
  