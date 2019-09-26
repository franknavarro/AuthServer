const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

//Define our user model
const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
});

// On Save Hook, encrypt password
userSchema.pre('save', function(next) {
  const user = this;

  bcrypt
    .hash(user.password, 10)
    .then(hash => {
      user.password = hash;
      next();
    })
    .catch(err => next(err));
});

userSchema.methods.comparePassword = function(candidatePassword) {
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt
      .compare(candidatePassword, user.password)
      .then(isMatch => {
        resolve(isMatch);
      })
      .catch(err => reject(err));
  });
};

// Create the user model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
