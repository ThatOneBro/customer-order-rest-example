var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var orderSchema = Schema({
	customer: {
		type: Schema.Types.ObjectId,
		ref: 'Customer'
	},
	orderDate: {
		type: Date
		default: Date.now
	},
	isPaid: {
		type: Boolean,
		default: false
	},
	datePaid: {
		type: Date,
		default: null
	}
	itemsPurchased: {
		type: [{
			item: {
				type: Schema.Types.ObjectId,
				ref: 'Item'
			},
			quantity: Number,
			itemTotal: Number
		}]
	},
	orderTotal: {
		type: Number//,
		//default: (total of all item)
	}
});

module.exports = mongoose.model('Order', orderSchema);