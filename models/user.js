const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define our user model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
});

// Create the user model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
