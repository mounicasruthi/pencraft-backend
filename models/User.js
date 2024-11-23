const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String }, // Optional field for storing profile picture URL
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
     