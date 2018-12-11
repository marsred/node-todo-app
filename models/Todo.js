const db = require('../base/db');
const mongoose = db.mongoose;

var Todo = mongoose.model('Todo',{
  text: String,
  completed: { type: Boolean, default: false }
});

module.exports = {Todo};
