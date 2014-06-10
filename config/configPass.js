var GithubStrategy = require('passport-github').Strategy;
var User = require('../models/user');

module.exports = function(passport, aclientID, aclientSecret, acallbackURL) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    // Github Login
    passport.use(new GithubStrategy({
            clientID: aclientID,
            clientSecret: aclientSecret,
            callbackURL: acallbackURL
        },
        function(token, refreshToken, profile, done) {
            process.nextTick(function() {
                User.findOne({
                    'github.id': profile.id
                }, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        console.log(user);
                        return done(null, user);
                    } else {
                        var newUser = new User();
                        newUser.hasProject = false;
                        newUser.github.id = profile.id;
                        newUser.github.token = token;
                        newUser.github.name = profile.username;
                        newUser.save(function(err) {
                            if (err) {
                                throw err;
                            }
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

}