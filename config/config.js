var path = require('path');
var fs = require('fs');
const { Pool } = require('pg');
var config = JSON.parse(fs.readFileSync(path.join(__dirname, "/config.json"), 'utf8'));
var CONFIG = {};
CONFIG.ENV = (process.env.NODE_ENV || 'development');
CONFIG.PORT = (process.env.VCAP_APP_PORT || config.port);
CONFIG.DB_URL = 'mongodb://' + config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.database;
// CONFIG.DIRECTORY_USERS = config.directory.users;
CONFIG.DIRECTORY_USERS = './uploads/images/users/';
CONFIG.DIRECTORY_CATEGORIES = './uploads/images/categories/';
CONFIG.DIRECTORY_SLIDERS = './uploads/images/sliders/';
CONFIG.DIRECTORY_OTHERS = './uploads/images/others/';
CONFIG.USER_PROFILE_IMAGE_DEFAULT = 'uploads/default/user.jpg';
CONFIG.USER_PROFILE_IMAGE = 'uploads/images/users/';
CONFIG.CATEGORY_DEFAULT_IMAGE = 'uploads/default/category.jpg';
CONFIG.ENCRYPTION_MODE = 0;
CONFIG.SCRIPT_NAME = 'encrption';
CONFIG.GCM_KEY_USER = '';

const pool = new Pool({
    user: config.postgres.user,
    host: config.postgres.host,
    database: config.postgres.database,
    password: config.postgres.password,
    port: config.postgres.port
});

CONFIG.POOL = pool;

pool.connect();

//Export Module
module.exports = CONFIG;
