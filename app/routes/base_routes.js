var User = require('../models/user.js');

module.exports = function(router, passport){
	router.get('/', function(req, res){
		res.send('This is the homepage.');
	});
}