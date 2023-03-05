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
  await db.createTable('categories', {
    id: { type: 'int', unsigned: true, primaryKey: true, autoIncrement: true },
    name: { type: 'string', length: 100 },
  });

  // create some dummy categories
  // https://db-migrate.readthedocs.io/en/latest/API/SQL/#inserttablename-columnnamearray-valuearray-callback
  await db.insert('categories', ['name'], ['vegetables']);
  await db.insert('categories', ['name'], ['starch']);
  await db.insert('categories', ['name'], ['milk']);
};

exports.down = function(db) {
  // No need to remove each category because dropping the table removes everything lmao
  return db.dropTable('categories');
};

exports._meta = {
  "version": 1
};
