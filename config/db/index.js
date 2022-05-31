const mongoose = require('mongoose');

const {
  DB_CONN_STR,
} = process.env;

mongoose.connect(DB_CONN_STR, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;
