var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var jwtConfig = require('../../config/jwt_config.js');
var Schema = mongoose.Schema;

var userSchema = Schema({
	email: String,
	passwordHash: String
});

var tokenConfig = {
	expireTime: 24 * 60 * 60
};

userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
};

userSchema.methods.compareHash = function(password){
	return bcrypt.compareSync(password, this.passwordHash);
};

userSchema.methods.generateToken = function(){
	var tempUser = {
		'id': this._id,
		'email': this.email
	};
	const token = jwt.sign(tempUser, jwtConfig.secret, {
		expiresIn: tokenConfig.expireTime
	});
	return token;
};

module.exports = mongoose.model('User', userSchema);