var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var itemSchema = Schema({
	name: String,
	description: {
		type: String,
		default: null
	},
	category: {
		type: String,
		default: null
	},
	unitPrice: Number
});

itemSchema.methods.calculateItemTotal = function(numOfItem, done){
	return done(this.unitPrice * numOfItem);
}

module.exports = itemSchema;