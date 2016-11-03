var mqf = require('../../middleware/mongoose_query_filter.js');
var core = require('../../middleware/core_functions.js');

module.exports = function(router, Customer, Order, Item){
	router.get('/', function(req, res){
		var acceptableFields = ['firstName', 'lastName', 'company', 'address', 'zipcode', 'phone', 'email', 'custId'];
		mqf.filter(acceptableFields, req.query, function(err, filter){
			if(err){
				console.log(err);
				res.status(500).json({'success': false, 'error': 'unexpected server error'});
				return;
			}
			if(filter === null){
				res.status(400).json({'success': false, 'error': 'invalid property or properties in query'});
				return;
			}
			Customer.find(filter, function(err, customers){
				if(err){
					console.log(err);
					res.status(500).json({'success': false, 'error': 'unexpected server error'});
					return;
				}
				if(!customers[0]){
					res.status(404).json({'success': false, 'error': 'no customers found'});
					return;
				}
				res.status(200).json({'success': true, 'customers': customers});
			});
		});
	});
	
	router.post('/', function(req, res){
		var newCustomer = new Customer({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			company: req.body.company,
			address: req.body.address,
			zipcode: req.body.zipcode,
			phone: req.body.phone,
			email: req.body.email
		});
		newCustomer.save(function(err){
			if(err){
				console.log(err);
				res.status(500).json({'success': false, 'error': 'unexpected server error'});
				return;
			}
			res.status(201).json({'success': true});
		});
	});
	
	router.get('/:custId', function(req, res){
		var customerId = req.params.custId;
		
		Customer.findOne({custId: customerId}, function(err, customer){
			if(err){
				console.log(err);
				res.status(500).json({'success': false, 'error': 'unexpected server error'});
				return;
			}
			if(!customer){
				res.status(404).json({'success': false, 'error': 'no customer found'});
				return;
			}
			res.status(200).json({'success': true, 'customer': customer});
		});
	});
	
	router.post('/:custId/order', function(req, res){
		var customerId = req.params.custId;
		var itemsPurchased = req.body.itemsPurchased;
		
		Customer.findOne({custId: customerId}, function(err, customer){
			if(err){
				console.log(err);
				res.status(500).json({'success': false, 'error': 'unexpected server error'});
				return;
			}
			if(!customer){
				res.status(404).json({'success': false, 'error': 'no customer found'});
				return;
			}
			if(req.body.orderDate){
				newOrder.orderDate = req.body.orderDate;
				if(req.body.isPaid && req.body.datePaid && req.body.datePaid > req.body.orderDate){
					newOrder.isPaid = true;
					newOrder.datePaid = req.body.datePaid;
				}
			}
			core.populateItems(Item, itemsPurchased, function(err, items, info){
				if(err){
					console.log(err);
					res.status(500).json({'success': false, 'error': 'unexpected server error'});
					return;
				}
				if(!items){
					res.status(404).json({'success': false, 'error': info});
					return;
				}
				var newOrder = new Order({
					customer: customer._id,
					itemsPurchased: items
				});
				newOrder.calculateTotal(function(err){
					if(err){
						console.log(err);
						res.status(500).json({'success': false, 'error': 'unexpected server error'});
						return;
					}
					newOrder.save(function(err){
						if(err){
							console.log(err);
							res.status(500).json({'success': false, 'error': 'unexpected server error'});
							return;
						}
						res.status(201).json({'success': true});
					});
				});
			});
		});
	});
	
	router.put('/:custId', function(req, res){
		var customerId = req.params.custId;
		
		Customer.findOne({custId: customerId}, function(err, customer){
			if(err){
				console.log(err);
				res.status(500).json({'success': false, 'error': 'unexpected server error'});
				return;
			}
			if(!customer){
				res.status(404).json({'success': false, 'error': 'no customer found'});
				return;
			}
			if(req.body.firstName) {customer.firstName = req.body.firstName}
			if(req.body.lastName) {customer.lastName = req.body.lastName}
			if(req.body.company) {customer.company = req.body.company}
			if(req.body.address) {customer.address = req.body.address}
			if(req.body.zipcode) {customer.zipcode = req.body.zipcode}
			if(req.body.phone) {customer.phone = req.body.phone}
			if(req.body.email) {customer.email = req.body.email}
			
			customer.save(function(err){
				if(err){
					console.log(err);
					res.status(500).json({'success': false, 'error': 'unexpected server error'});
					return;
				}
				res.status(200).json({'success': true});
			});
		});
	});
	
	router.delete('/:custId', function(req, res){
		var customerId = req.params.custId;
		
		Customer.findOneAndRemove({custId: customerId}, function(err){
			if(err){
				console.log(err);
				res.status(500).json({'success': false, 'error': 'unexpected server error'});
				return;
			}
			res.status(200).json({'success': true});
		});
	});
	
	router.get('/:custId/order', function(req, res){
		var customerId = req.params.custId;
		
		Customer.findOne({custId: customerId}, function(err, customer){
			if(err){
				console.log(err);
				res.status(500).json({'success': false, 'error': 'unexpected server error'});
				return;
			}
			if(!customer){
				res.status(404).json({'success': false, 'error': 'no customer found'});
				return;
			}
			var acceptableFields = ['customer', 'orderDate', 'isPaid', 'datePaid', 'orderTotal'];
			
			mqf.filter(acceptableFields, req.query, function(err, filter){
				if(err){
				console.log(err);
				res.status(500).json({'success': false, 'error': 'unexpected server error'});
				return;
				}
				if(filter === null){
					res.status(400).json({'success': false, 'error': 'invalid property or properties in query'});
					return;
				}
				filter.customer = customer._id;
				Order.findWithPopulatedItems(filter, function(err, orders){
					if(err){
						console.log(err);
						res.status(500).json({'success': false, 'error': 'unexpected server error'});
						return;
					}
					if(!orders[0]){
						res.status(404).json({'success': false, 'error': 'no order found'});
						return;
					}
					res.status(200).json({'success': true, 'orders': orders});
				});
			});
		});
	});
	
	router.get('/:custId/order/:orderId', function(req, res){
		var customerId = req.params.custId;
		var orderId = req.params.orderId;
		
		Customer.findOne({custId: customerId}, function(err, customer){
			if(err){
				console.log(err);
				res.status(500).json({'success': false, 'error': 'unexpected server error'});
				return;
			}
			if(!customer){
				res.status(404).json({'success': false, 'error': 'no customer found'});
				return;
			}
			Order.findOneWithPopulatedItems(customer._id, orderId, function(err, order){
				if(err){
					console.log(err);
					res.status(500).json({'success': false, 'error': 'unexpected server error'});
					return;
				}
				if(!order){
					res.status(404).json({'success': false, 'error': 'no order found'});
					return;
				}
				res.status(200).json({'success': true, 'order': order});
			});
		});
	});
	
	router.delete('/:custId/order/:orderId', function(req, res){
		var customerId = req.params.custId;
		var orderId = req.params.orderId;
		
		Customer.findOne({custId: customerId}, function(err, customer){
			if(err){
				console.log(err);
				res.status(500).json({'success': false, 'error': 'unexpected server error'});
				return;
			}
			if(!customer){
				res.status(404).json({'success': false, 'error': 'customer not found'});
				return;
			}
			Order.findOneAndRemove({orderId: orderId, customer: customer._id}, function(err){
				if(err){
					console.log(err);
					res.status(500).json({'success': false, 'error': 'unexpected server error'});
					return;
				}
				res.status(200).json({'success': true});
			});
		});
	}); 
}