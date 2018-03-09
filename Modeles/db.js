const mongoose = require('mongoose');

const config = require('../config/config');

const url = `${config.db.host}${config.db.DBName}`;

mongoose.connect(url);

mongoose.Promise = global.Promise;

module.exports = mongoose;