const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

const tokenForUser = user => {
  const timestamp = new Date().getTime() / 1000;
  // Expire token after a day
  const expirationTime = timestamp + 24 * 60 * 60;
  return jwt.encode(
    { sub: user.id, iat: timestamp, exp: expirationTime },
    config.secret,
  );
};

exports.signin = (req, res) => {
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: 'You must provide email and password' });
  }

  User.findOne({ email })
    .then(existingUser => {
      if (existingUser) throw new Error('Email is in use');
      const user = new User({ email, password, name });
      return user.save();
    })
    .then(user => res.json({ token: tokenForUser(user) }))
    .catch(err => {
      if (err === 'Email is in use') {
        return res.status(422).send({ error: err });
      }
      next(err);
    });
};
