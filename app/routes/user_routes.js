var User = require('../models/user.js');
var responses = require('../../config/json_responses.js');

module.exports = function(router, passport){
	router.post('/', function(req, res){
		if(!req.body.email || !req.body.password){
			responses[400].missingFields(res);
			return;
		}
		passport.authenticate('local-signup', 
		function(err, user, info){
			if(err){
				console.log(err);
				responses[500](res);
				return;
			}
			if(user === false){
				responses[409](res, 'email already in use');
				return;
			}
			responses[201](res);
		})(req, res);
	});
}