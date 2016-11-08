var mqf = require('../../middleware/mongoose_query_filter.js');
var core = require('../../middleware/core_functions.js');
var responses = require('../../config/json_responses.js');

module.exports = function(router, Customer, Order, Item){
	router.get('/', function(req, res){
		var acceptableFields = ['firstName', 'lastName', 'company', 'address', 'zipcode', 'phone', 'email', 'custId'];
		mqf.filter(acceptableFields, req.query, function(err, filter){
			if(err){
				console.log(err);
				responses[500](res);
				return;
			}
			if(filter === null){
				responses[400].invalidQuery(res);
				return;
			}
			Customer.find(filter, function(err, customers){
				if(err){
					console.log(err);
					responses[500](res);
					return;
				}
				if(!customers[0]){
					responses[404](res, 'customers');
					return;
				}
				responses[200].payload(res, {'customers': customers});
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
				res[500](res);
				return;
			}
			responses[201];
		});
	});
	
	router.get('/:custId', function(req, res){
		var customerId = req.params.custId;
		
		Customer.findOne({custId: customerId}, function(err, customer){
			if(err){
				console.log(err);
				responses[500](res);
				return;
			}
			if(!customer){
				responses[404](res, 'customer');
				return;
			}
			responses[200].payload(res, {'customer': customer});
		});
	});
	
	router.post('/:custId/order', function(req, res){
		var customerId = req.params.custId;
		var itemsPurchased = req.body.itemsPurchased;
		
		Customer.findOne({custId: customerId}, function(err, customer){
			if(err){
				console.log(err);
				responses[500](res);
				return;
			}
			if(!customer){
				responses[404](res, 'customer');
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
					responses[500](res);
					return;
				}
				if(!items){
					responses.custom404(res, info);
					return;
				}
				var newOrder = new Order({
					customer: customer._id,
					itemsPurchased: items
				});
				newOrder.calculateTotal(function(err){
					if(err){
						console.log(err);
						responses[500](res);
						return;
					}
					newOrder.save(function(err){
						if(err){
							console.log(err);
							responses[500](res);
							return;
						}
						responses[201](res);
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
				responses[500](res);
				return;
			}
			if(!customer){
				responses[404](res, 'customer');
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
					responses[500](res);
					return;
				}
				responses[200].noPayload(res);
			});
		});
	});
	
	router.delete('/:custId', function(req, res){
		var customerId = req.params.custId;
		
		Customer.findOneAndRemove({custId: customerId}, function(err){
			if(err){
				console.log(err);
				responses[500](res);
				return;
			}
			responses[200].noPayload(res);
		});
	});
	
	router.get('/:custId/order', function(req, res){
		var customerId = req.params.custId;
		
		Customer.findOne({custId: customerId}, function(err, customer){
			if(err){
				console.log(err);
				responses[500](res);
				return;
			}
			if(!customer){
				responses[404](res, 'customer');
				return;
			}
			var acceptableFields = ['customer', 'orderDate', 'isPaid', 'datePaid', 'orderTotal'];
			
			mqf.filter(acceptableFields, req.query, function(err, filter){
				if(err){
				console.log(err);
				responses[500](res);
				return;
				}
				if(filter === null){
					responses[400].invalidQuery(res);
					return;
				}
				filter.customer = customer._id;
				Order.findWithPopulatedItems(filter, function(err, orders){
					if(err){
						console.log(err);
						responses[500](res);
						return;
					}
					if(!orders[0]){
						responses[404](res, 'orders');
						return;
					}
					responses[200].payload(200, {'orders': orders});
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
				responses[500](res);
				return;
			}
			if(!customer){
				responses[404](res, 'customer');
				return;
			}
			Order.findOneWithPopulatedItems(customer._id, orderId, function(err, order){
				if(err){
					console.log(err);
					responses[500](res);
					return;
				}
				if(!order){
					responses[404](res, 'order');
					return;
				}
				responses[200].payload(res, {'order': order});
			});
		});
	});
	
	router.put('/:custId/order/:orderId', function(req, res){
		var customerId = req.params.custId;
		var orderId = req.params.orderId;
		
		Customer.findOne({custId: customerId}, function(err, customer){
			if(err){
				console.log(err);
				responses[500](res);
				return;
			}
			if(!customer){
				responses[404](res, 'customer');
				return;
			}
			Order.findOne({orderId: orderId}, function(err, order){
				if(err){
					console.log(err);
					responses[500](res);
					return;
				}
				if(!order){
					responses[404](res, 'order');
					return;
				}
				if(req.body.customer) {order.customer = req.body.customer}
				if(req.body.orderDate) {order.orderDate = req.body.orderDate}
				if(req.body.isPaid && !req.body.datePaid) {order.markAsPaid()}
				else if(req.body.isPaid) {order.markAsPaid(req.body.datePaid)}
				order.save(function(err){
					if(err){
						console.log(err);
						responses[500](res);
						return;
					}
					responses[200].noPayload(res);
				});
			});
		});
	});
	
	router.delete('/:custId/order/:orderId', function(req, res){
		var customerId = req.params.custId;
		var orderId = req.params.orderId;
		
		Customer.findOne({custId: customerId}, function(err, customer){
			if(err){
				console.log(err);
				responses[500](res);
				return;
			}
			if(!customer){
				responses[404](res, 'customer');
				return;
			}
			Order.findOneAndRemove({orderId: orderId, customer: customer._id}, function(err){
				if(err){
					console.log(err);
					responses[500](res);
					return;
				}
				responses[200].noPayload(res);
			});
		});
	}); 
}