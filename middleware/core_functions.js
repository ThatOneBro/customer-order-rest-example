function populateItems(Item, items, done){
	var populatedItems = [];
	function populateItem(i){
		if( i < items.length){
			Item.findOne({itemId: items[i].itemId}, function(err, item){
				if(err)
					return done(err);
				if(!item)
					return done(null, false, 'invalid item ID in itemsPurchased');
				item.calculateItemTotal(items[i].quantity, function(total){
					var values = {
						quantity: items[i].quantity,
						item: item._id,
						itemTotal: total
					};
					populatedItems[i] = values;
					populateItem(i + 1);
				});
			});
		} else {
			return done(null, populatedItems);
		}
	}
	populateItem(0);
}

module.exports = {populateItems: populateItems};