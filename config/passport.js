const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose'); //we need it because we'll search for a user in db
const User = mongoose.model('users');
const keys = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            User.findById(jwt_payload.id)
                .then(user => {
                    //if user is found
                    if (user) {
                        //first parameter is error, if we don't have error and user was found we return user
                        return done(null, user);
                    }
                    //if user wasn't found
                    //first parameter is error which there is none, fals stand for no found user
                    return done(null, false)
                })
                .catch(err => console.log(err))
        }))
};
