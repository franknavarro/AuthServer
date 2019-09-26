const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create a local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  let matchingUser = undefined;
  const noMatchError = 'Incorrect email or password';
  User.findOne({ email: email })
    .then(user => {
      if (!user) throw Error(noMatchError);
      matchingUser = user;
      return matchingUser.comparePassword(password);
    })
    .then(isMatch => {
      if (!isMatch) throw Error(noMatchError);
      done(null, matchingUser);
    })
    .catch(err => {
      if (err.message === noMatchError) {
        return done(null, false);
      }
      done(err);
    });
});

// set up option for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret,
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub)
    .then(user => {
      // Call done with no error and found user
      if (user) return done(null, user);
      // Call done with no error and no found user
      done(null, false);
    })
    // Call done with error and no user found
    .catch(err => done(err, false));
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
