'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('users', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    agency_id: { type: 'int' },
    firstname: {
      type: 'string',
      notNull: true,
    },
    lastname: {
      type: 'string',
      notNull: true,
    },
    email: {
      type: 'string',
      notNull: true,
      unique: true,
    },
    password: {
      type: 'string',
      notNull: true,
    },
    status: { type: 'string' },
    rooms: { type: 'string' },
    country_code: { type: 'int' },
    device_token: { type: 'string' },
    number: { type: 'double' },
    profile_pic: { type: 'string' },
  });
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  "version": 1
};
