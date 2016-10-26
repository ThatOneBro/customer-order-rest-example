var mongooseQf = require('../../middleware/mongoose_query_filter.js');

module.exports = function(router, Item){
	router.get('/', function(req, res){
		var acceptableFields = ['name', 'description', 'category', 'unitPrice', 'itemId'];
		var filteredQuery = mongooseQf(acceptableFields, req.query);
		
		if(filteredQuery === null){
			res.status(400).json({'success': false, 'error': 'invalid property or properties in query'});
			return;
		}
		
		Item.find(filteredQuery, function(err, items){
			if(err){
				console.log(err);
				res.status(500).json({'success': false, 'error': 'unexpected server error'});
				return;
			}
			if(!items[0]){
				res.status(404).json({'success': false, 'error': 'no items found'});
				return;
			}
			res.status(200).json({'success': true, 'items': items});
		});
	});
	
	router.post('/', function(req, res){
		var newItem = new Item({
			name: req.body.name,
			unitPrice: req.body.unitPrice
		});
		if(req.body.description) {newItem.description = req.body.description;}
		if(req.body.category) {newItem.category = req.body.category;}
		newItem.save(function(err){
			if(err){
				console.log(err);
				res.status(500).json({'success': false, 'error': 'unexpected server error'});
				return;
			}
			res.status(201).json({'success': true});
		});
	});
}