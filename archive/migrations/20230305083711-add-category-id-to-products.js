'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function(db) {
  // https://db-migrate.readthedocs.io/en/latest/API/SQL/#addcolumntablename-columnname-columnspec-callback
  await db.addColumn('products', 'category_id', {
    type: 'int',
    unsigned: true,
    notNull: true,
  });

  // https://db-migrate.readthedocs.io/en/latest/API/SQL/#addforeignkey
  await db.addForeignKey('products', 'categories', 'product_category_fk', {
    'category_id': 'id', // { 'column_in_current_table_name': 'referenced_column_name' }
  }, {
    onDelete: 'CASCADE', // If a category is deleted, then all related products are deleted (cascade the deletion)
    onUpdate: 'RESTRICT', // Disallow updates on the categories table, if the category id is ever referenced
  })
};

exports.down = async function(db) {
  await db.removeForeignKey('products', 'product_category_fk');
  await db.removeColumn('products', 'category_id');
};

exports._meta = {
  "version": 1
};
