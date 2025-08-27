const mongoose = require("mongoose");
const todo = require("./Todoschema");
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  points:{
    type: Number,
    default: 0
  },
  todos: [{type : mongoose.Schema.Types.ObjectId, ref: todo}]
});

module.exports = mongoose.model("User", userSchema);
