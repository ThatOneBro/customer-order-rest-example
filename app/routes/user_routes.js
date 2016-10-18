var User = require('../models/user.js');

module.exports = function(router, passport){
	router.post('/', function(req, res){
		if(!req.body.email || !req.body.password){
			res.json({'success': false, 'error': 'invalid data for new user'});
			return;
		}
		passport.authenticate('local-signup', 
		function(err, user, info){
			if(err){
				res.json({'success': false, 'error': 'error in request'});
				return;
			}
			if(user === false){
				res.json({'success': false, 'error': 'email already in use'});
				return;
			}
			res.json({'success': true});
		})(req, res);
	});
}