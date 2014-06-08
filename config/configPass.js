var GithubStrategy = require('passport-github').Strategy;
var User = require('../models/user');
var configAuth = require('./auth');

module.exports = function(passport) {
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
        clientID : configAuth.githubAuth.clientID,
        clientSecret: configAuth.githubAuth.clientSecret,
        callbackURL: configAuth.githubAuth.callbackURL    	
    },
	function(token, refreshToken, profile, done){
		process.nextTick(function(){
			User.findOne({'github.id' : profile.id}, function(err, user){
				if (err) {return done(err);}
				if (user) {return done(null, user);}
				else {
					var newUser            = new User();
					newUser.hasProject   = false;
					newUser.github.id    = profile.id;
					newUser.github.token = token;
					newUser.github.name  = profile.username;
					newUser.save(function(err){
						if (err) {throw err;}
						return done(null, newUser);
					});
				}
			});
		});
	}));

}