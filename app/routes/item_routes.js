module.exports = function(router, Item){
	router.get('/', function(req, res){
		Item.find({}, function(err, items){
			if(err){
				console.log(err);
				res.json({'success': false, 'error': 'error in request'});
				return;
			}
			if(!items[0]){
				res.json({'success': false, 'error': 'no items found'});
				return;
			}
			res.json({'success': true, 'items': items});
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
				res.json({'success': false, 'error': 'error saving item to db'});
				return;
			}
			res.json({'success': true});
		});
	});
}