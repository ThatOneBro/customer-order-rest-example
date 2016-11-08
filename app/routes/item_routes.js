var mqf = require('../../middleware/mongoose_query_filter.js');
var responses = require('../../config/json_responses.js');

module.exports = function(router, Item){
	router.get('/', function(req, res){
		var acceptableFields = ['name', 'description', 'category', 'unitPrice', 'itemId'];
		
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
			Item.find(filter, function(err, items){
				if(err){
					console.log(err);
					responses[500](res);
					return;
				}
				if(!items[0]){
					responses[404](res, 'items');
					return;
				}
				responses[200].payload(res, {'items': items});
			});
		});
	});
	
	router.get('/:itemId', function(req, res){
		var itemId = req.params.itemId;
		
		Item.findOne({itemId: itemId}, function(err, item){
			if(err){
				console.log(err);
				responses[500](res);
				return;
			}
			if(!item){
				responses[404](res, 'item');
				return;
			}
			responses[200].payload(res, {'item': item});
		});
	});
	
	router.put('/:itemId', function(req, res){
		var itemId = req.params.itemId;
		
		Item.findOne({itemId: itemId}, function(err, item){
			if(err){
				console.log(err);
				responses[500](res);
				return;
			}
			if(!item){
				responses[404](res, 'item');
				return;
			}
			if(req.body.name) {item.name = req.body.name}
			if(req.body.description) {item.description = req.body.description}
			if(req.body.category) {item.category = req.body.category}
			if(req.body.unitPrice) {item.unitPrice = req.body.unitPrice}
			
			item.save(function(err){
				if(err){
					console.log(err);
					responses[500](res);
					return;
				}
				responses[201](res);
			});
		});
	});
	
	router.delete('/:itemId', function(req, res){
		var itemId = req.params.itemId;
		
		Item.findOneAndRemove({itemId: itemId}, function(err){
			if(err){
				console.log(err);
				responses[500](res);
				return;
			}
			responses[200].noPayload(res);
		});
	});
	
	router.post('/', function(req, res){
		var newItem = new Item({
			name: req.body.name,
			unitPrice: req.body.unitPrice
		});
		if(req.body.description) {newItem.description = req.body.description}
		if(req.body.category) {newItem.category = req.body.category}
		newItem.save(function(err){
			if(err){
				console.log(err);
				responses[500](res);
				return;
			}
			responses[201](res);
		});
	});
}