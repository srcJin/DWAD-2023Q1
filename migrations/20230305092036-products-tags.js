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
  await db.createTable('products_tags', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    product_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
    },
    tag_id: {
      type: 'int',
      notNul: true,
      unsigned: true,
    },
  });

  await db.addForeignKey('products_tags', 'products', 'products_tags_product_fk', {
    'product_id': 'id', // { 'column_in_current_table_name': 'referenced_column_name' }
  }, {
    onDelete: 'CASCADE', // If a category is deleted, then all related products are deleted (cascade the deletion)
    onUpdate: 'RESTRICT', // Disallow updates on the categories table, if the category id is ever referenced
  });

  await db.addForeignKey('products_tags', 'tags', 'products_tags_tag_fk', {
    'tag_id': 'id', // { 'column_in_current_table_name': 'referenced_column_name' }
  }, {
    onDelete: 'CASCADE', // If a category is deleted, then all related products are deleted (cascade the deletion)
    onUpdate: 'RESTRICT', // Disallow updates on the categories table, if the category id is ever referenced
  });
};

exports.down = async function(db) {
  await db.dropTable('products_tags');
};

exports._meta = {
  "version": 1
};
