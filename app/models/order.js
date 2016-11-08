var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var orderSchema = Schema({
	customer: {
		type: Schema.Types.ObjectId,
		ref: 'Customer'
	},
	orderDate: {
		type: Date,
		default: Date.now
	},
	isPaid: {
		type: Boolean,
		default: false
	},
	datePaid: {
		type: Date,
		default: null
	},
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
	orderTotal: Number
});

orderSchema.methods.calculateTotal = function(done){
	var items = this.itemsPurchased;
	var total = 0;
	function addToTotal(i, self){
		if(i < items.length){
			total += items[i].itemTotal;
			addToTotal(i + 1, self);
		} else{
			self.orderTotal = total;
			return done(null);
		}
	}
	addToTotal(0, this);
};

orderSchema.methods.markAsPaid = function(datePaid){
	this.isPaid = true;
	if(datePaid)
		this.datePaid = datePaid;
	else
		this.datePaid = Date.now();
};

orderSchema.statics.findWithPopulatedItems = function(filter, done){
	this.db.model('Order').find(filter).populate({
		path: 'itemsPurchased.item',
		populate: {path: 'itemsPurchased.item'}
	}).exec(function(err, orders){
		if(err){
			return done(err);
		}
		return done(null, orders);
	});
};

orderSchema.statics.findOneWithPopulatedItems = function(custId, orderId, done){
	this.db.model('Order').findOne({orderId: orderId, customer: custId}).populate({
		path: 'itemsPurchased.item',
		populate: {path: 'itemsPurchased.item'}
	}).exec(function(err, order){
		if(err)
			return done(err);
		if(!order)
			return done(null, false);
		return done(null, order);
	});
};

module.exports = orderSchema;