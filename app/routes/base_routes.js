var User = require('../models/user.js');

module.exports = function(router, passport){
	router.get('/', function(req, res){
		res.send('This is the homepage.');
	});
	
	router.get('/token', function(req, res){
		if(!req.query.email || !req.query.password){
			res.json({'success': false, 'error': 'invalid login data'});
			return;
		}
		passport.authenticate('local-login',
		function(err, user, info){
			if(user === false){
				if(err){
					console.log(err);
					res.json({'success': false, 'error': 'error in request'});
					return;
				}
				res.json({'success': false, 'error': info});
				return;
			}
			User.findById(user._id, function(err, user){
				if(err){
					console.log(err);
					res.json({'success': false, 'error': 'error in request'});
					return;
				}
				if(!user){
					res.json({'success': false, 'error': 'error in request'});
					return;
				}
				res.json({'success': true, 'data': {'token': user.generateToken()}});
			});
		})(req, res);
	});
}