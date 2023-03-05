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
  await db.createTable('tags', {
    id: { type: 'int', primaryKey: true, autoIncrement: true, unsigned: true},
    name: { type: 'string', length: 100 },
  });

  await db.insert('tags', ['name'], ['sweet']);
  await db.insert('tags', ['name'], ['processed']);
  await db.insert('tags', ['name'], ['home-made']);
  await db.insert('tags', ['name'], ['gluten-free']);
};

exports.down = function(db) {
  return db.dropTable('tags');
};

exports._meta = {
  "version": 1
};
