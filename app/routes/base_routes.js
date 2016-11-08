var User = require('../models/user.js');
var responses = require('../../config/json_responses.js');

module.exports = function(router, passport){
	router.get('/', function(req, res){
		res.send('This is the homepage.');
	});
	
	router.get('/token', function(req, res){
		if(!req.query.email || !req.query.password){
			responses[400].missingFields(res);
			return;
		}
		passport.authenticate('local-login',
		function(err, user, info){
			if(user === false){
				if(err){
					console.log(err);
					responses[500](res);
					return;
				}
				responses[401](res, info);
				return;
			}
			User.findById(user._id, function(err, user){
				if(err){
					console.log(err);
					responses[500](res);
					return;
				}
				if(!user){
					responses[500](res);
					return;
				}
				responses[200].payload(res, {'token': user.generateToken()});
			});
		})(req, res);
	});
}