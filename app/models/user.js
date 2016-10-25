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

/* userSchema.methods.getUserData = function(property){
	var userData = {};
	if(!property){
		var thisInJson = this.toJSON();
		for(var prop in thisInJson) {
			if(!thisInJson.hasOwnProperty(prop)){
				continue;
			}
			if(prop == 'passwordHash' || prop == '__v'){
				continue;
			}
			else {
				userData[prop] = thisInJson[prop];
			}
		}
	}
	else if(property == 'passwordHash'){
		userData.password = 'unauthorized';
	}
	else {
		userData[property] = this[property];
	}
	return userData;
}; */

userSchema.methods.updateUserData = function(data, done){
	for(var prop in data){
		if(!data.hasOwnProperty(prop)){
			continue;
		}
		if(prop == 'passwordHash' || prop == '__v'){
			continue;
		}
		if(prop == 'password'){
			this.passwordHash = this.generateHash(data.password);
			continue;
		}
		this[prop] = data[prop];
	}
	
	this.save(function(err, user){
		if(err){
			console.log(err);
			return done(err);
		}
		return done(null, user);
	});
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