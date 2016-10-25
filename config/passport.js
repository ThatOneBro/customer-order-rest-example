var LocalStrategy = require('passport-local');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;


var jwtConfig = require('./jwt_config.js');
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