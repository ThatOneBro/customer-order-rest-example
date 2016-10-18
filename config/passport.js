var LocalStrategy = require('passport-local');

var User = require('../app/models/user.js');

module.exports= function(passport){
	passport.use('local-signup', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		}, 
			function(req, email, password, done){
				process.nextTick(function(){
					User.findOne({'email': email}, function(err, user){
						if(err)
							return done(err);
						if(user){
							return done(null, false);
						}				
						var data = {};
						data.email = req.body.email;
						data.password = req.body.password;
					
						var newUser = new User();
						newUser.updateUserData(data, function(err, user){
							if(err)
								return done(err);
							else if(user)
								return done(null, newUser);
						}); 
					});
				});
			}
	));
	
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
		function(req, email, password, done){
			process.nextTick(function(){
				User.findOne({'email': email}, function(err, user){
					if(err)
						return done(err);
					if(!user)
						return done(null, false, 'invalid email or password');
					if(!user.compareHash(password)){
						return done(null, false, 'invalid email or password');
					}
					return done(null, user);
				});
			});
		}
	));
}