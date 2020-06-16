const { Pool } = require('pg');
var CONFIG = {};
console.log(process.env.NODE_ENV, "process.env.NODE_ENV--------------")
CONFIG.ENV = (process.env.NODE_ENV || 'development');
CONFIG.PORT = (process.env.VCAP_APP_PORT || process.env.PORT);
CONFIG.DB_URL = 'mongodb://' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DATABASE;
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
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
});

CONFIG.POOL = pool;

pool.connect();

//Export Module
module.exports = CONFIG;
