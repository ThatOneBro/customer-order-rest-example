var mqf = require('../../middleware/mongoose_query_filter.js');

module.exports = function(router, Order){
	router.get('/', function(req, res){
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
			Order.find(filter, function(err, orders){
				if(err){
					console.log(err);
					res.status(500).json({'success': false, 'error': 'unexpected server error'});
					return;
				}
				if(!orders[0]){
					res.status(404).json({'success': false, 'error': 'no orders found'});
					return;
				}
				res.status(200).json({'success': true, 'orders': orders});
			});
		});
	});
}