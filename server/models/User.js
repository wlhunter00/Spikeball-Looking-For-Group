const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    max: 500,
    min: 1
  },
  email: {
    type: String,
    max: 255,
    min: 1
  },
  password: {
    type: String,
    required: true,
    max: 3000,
    min: 1
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);
