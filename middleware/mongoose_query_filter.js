function filter(acceptable, query, done){
	function throwTypeException(){
		throw new TypeError('MongooseQueryFilter requires you to pass in an array of strings');
	}
	
	if(!Array.isArray(acceptable))
		throwTypeException();
	
	if(!acceptable[0])
		throw new Error('MongooseQueryFilter requires passed array to contain at least one value');

	if(typeof query !== 'object')
		throw new TypeError('MongooseQueryFilter requires object as second param');
	
	if(!query || query == {})
		return done(null, {});
	
	var acceptableToLower = [];
	acceptable.forEach(function(field){
		acceptableToLower.push(field.toLowerCase());
	});
	for(var field in query){
		if(!acceptableToLower.includes(field))
			return done(null, null);
	}
	
	var filteredQuery = {};
	acceptable.forEach(function(field){
		if(!(typeof field === 'string') && !(field instanceof String))
			throwTypeException();
		var lowerCaseField = field.toLowerCase();
		if(query[lowerCaseField])
			filteredQuery[field] = query[lowerCaseField];
	});
	return done(null, filteredQuery);
}

module.exports = {filter: filter};