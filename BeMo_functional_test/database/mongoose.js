const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URL || 'mongodb://localhost:27017/BeMo';
// connect to database
mongoose.connect(mongoURI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

module.exports = { mongoose };