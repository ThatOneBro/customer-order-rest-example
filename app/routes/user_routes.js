var User = require('../models/user.js');

module.exports = function(router, passport){
	router.post('/', function(req, res){
		if(!req.body.email || !req.body.password){
			res.status(400).json({'success': false, 'error': 'invalid data for new user'});
			return;
		}
		passport.authenticate('local-signup', 
		function(err, user, info){
			if(err){
				console.log(err);
				res.status(500).json({'success': false, 'error': 'unexpected server error'});
				return;
			}
			if(user === false){
				res.status(409).json({'success': false, 'error': 'email already in use'});
				return;
			}
			res.status(201).json({'success': true});
		})(req, res);
	});
}