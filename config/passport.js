var LocalStrategy = require('passport-local');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;


var jwtConfig = require('./jwt_config.js');
var User = require('../app/models/user.js');

module.exports= function(passport){
	//Here we create a new passport strategy for signing up
	passport.use('local-signup', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		}, 
		//This is the function called when the strategy is invoked
			function(req, email, password, done){
				//Put this stuff in the next callstack
				process.nextTick(function(){
					//Find a user by email
					User.findOne({'email': email}, function(err, user){
						if(err)
							return done(err);
						//If a user already exists with that email, don't create a new one
						if(user){
							return done(null, false);
						}
						//Create a new object to hold data to update
						var data = {};
						data.email = req.body.email;
						data.password = req.body.password;
						
						//Create a new user and call the updateUserData method on it
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
				//Find a user by email
				User.findOne({'email': email}, function(err, user){
					if(err)
						return done(err);
					//If no user found, return error message
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
	
	//JWT Config
	var opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
	opts.secretOrKey = jwtConfig.secret;
	//finish config
	
	passport.use('jwt-general', new JwtStrategy(opts,
	function(jwt_payload, done){
		User.findById(jwt_payload.id, function(err, user){
			if(err){
				return done(err, false);
			}
			if(!user){
				return done(null, false);
			}
			return done(null, user);
		});
	}));
}