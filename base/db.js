const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/todo',{useNewUrlParser: true});
const ObjectId = mongoose.Types.ObjectId;

module.exports = {mongoose, ObjectId};
