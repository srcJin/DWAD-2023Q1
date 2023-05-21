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

exports.up = function(db) {
  // CREATE TABLE
  // id integer unsigned primary key auto_increment,
  // name varchar(255) not null
  // cost integer not null
  // description text
  // engine = innodb
  // first argument to db.createTable is the name of the table
  // second argument is an object
  // each KEY will be one column
  // each VALUE will describe the properties of the column

  return db.createTable('product_rooms',{
    room_id: { type: 'int', primaryKey:true, autoIncrement:true, unsigned: true},
    name: { type: 'string', length:255, notNull:true},
    // cost is int because we store money in cents
    cost: {type: 'int', unsigned:false, notNull: false},
    description:'text',
    image_url:'text',
    size:'text',
    style:'text',
    category_id:'int',
})
};

exports.down = function(db) {
  return db.dropTable('product_rooms');};

exports._meta = {
  "version": 1
};
