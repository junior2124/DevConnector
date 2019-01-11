const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ForgotEmailSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  token: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = ForgotEmail = mongoose.model("forgotEmail", ForgotEmailSchema);
