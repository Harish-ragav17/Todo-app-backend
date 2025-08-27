const mongoose = require("mongoose");

const todo = mongoose.Schema({
  text: {
    type: String,
    require: true,
  },
  checked: Boolean,
  deadline: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Todo", todo);
