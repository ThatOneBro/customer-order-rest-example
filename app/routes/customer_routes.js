module.exports = function(router, Customer){
	router.get('/', function(req, res){
		Customer.find({}, function(err, customers){
			if(err){
				res.json({'success': false, 'error': 'error in request'});
				return;
			}
			if(!customers[0]){
				res.json({'success': false, 'error': 'no customers found'});
				return;
			}
			res.json({'success': true, 'customers': customers});
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
				res.json({'success': false, 'error': 'error saving customer to db'});
				return;
			}
			res.json({'success': true});
		});
	});
	
	router.get('/:custId', function(req, res){
		var customerId = req.params.custId;
		
		Customer.findOne({custId: customerId}, function(err, customer){
			if(err){
				res.json({'success': false, 'error': 'error in request'});
				return;
			}
			if(!customer){
				res.json({'success': false, 'error': 'no customer found'});
				return;
			}
			res.json({'success': true, 'customer': customer});
		});
	});
}