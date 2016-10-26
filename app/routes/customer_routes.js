var mongooseQf = require('../../middleware/mongoose_query_filter.js');

module.exports = function(router, Customer){
	router.get('/', function(req, res){
		var acceptableFields = ['firstName', 'lastName', 'company', 'address', 'zipcode', 'phone', 'email', 'custId'];
		var filteredQuery = mongooseQf(acceptableFields, req.query);
		
		if(filteredQuery === null){
			res.status(400).json({'success': false, 'error': 'invalid property or properties in query'});
			return;
		}
		
		Customer.find(filteredQuery, function(err, customers){
			if(err){
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
}