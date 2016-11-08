var mqf = require('../../middleware/mongoose_query_filter.js');
var responses = require('../../config/json_responses.js');

module.exports = function(router, Order){
	router.get('/', function(req, res){
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
			Order.find(filter, function(err, orders){
				if(err){
					console.log(err);
					responses[500](res);
					return;
				}
				if(!orders[0]){
					responses[404](res, 'orders');
					return;
				}
				responses[200].payload(res, {'orders': orders});
			});
		});
	});
}