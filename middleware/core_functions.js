////////////////////////////////
/*---Core Functions---*/
//////////////////////////////

/*---This is a helper function to populate the items contained in the items array of order object---*/

//We pass in the Item schema in order to call methods from it, the items array of Mongo Object IDs, and the callback function(done)
function populateItems(Item, items, done){
	
	//We create an empty array to populate with our populated items (see what I did there?)
	var populatedItems = [];
	
	//This is the actual function that will populate the items, we call it recursively until we have populated all of the items
	function populateItem(i){
		//Each time the function is called, we check if we've gone over the entire array yet
		if( i < items.length){
			//We find the current item by the itemID property
			Item.findOne({itemId: items[i].itemId}, function(err, item){
				if(err)
					return done(err);
				//If we can't find one of the items, then we terminate the function and give an error
				if(!item)
					return done(null, false, 'invalid item ID in itemsPurchased field');
				//If no error and we have the item, we call the calculateItemTotal method on it
				item.calculateItemTotal(items[i].quantity, function(total){
					//We take the quantity, MongoObjID, and total for that item and put them in our array
					var values = {
						quantity: items[i].quantity,
						item: item._id,
						itemTotal: total
					};
					populatedItems[i] = values;
					populateItem(i + 1);
				});
			});
			//If we have gone over the entire array (i >= items.length), then we return our populatedItems array
		} else {
			return done(null, populatedItems);
		}
	}
	//We have defined our populateItem function, now we initialize it with the value 0 to kick it off
	populateItem(0);
}

//We export our module as object containing our populatedItems function, so we can call package_name.populateItems()
module.exports = {populateItems: populateItems};