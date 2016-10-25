var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var customerSchema = Schema({
	firstName: String,
	lastName: String,
	company: String,
	address: String,
	zipcode: String,
	phone: String,
	email: String
});

module.exports = customerSchema;