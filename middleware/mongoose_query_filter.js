/////////////////////////////////////////
/*---Mongoose Query Filter---*/
////////////////////////////////////////

//Takes 3 params: acceptable: array of strings,  query: query object (req.query), done(callback function)
function filter(acceptable, query, done){
	//We create a throwTypeException function to break when the function is given invalid input for acceptable
	function throwTypeException(){
		throw new TypeError('MongooseQueryFilter requires you to pass in an array of strings');
	}
	
	//Throw type exception if acceptable isn't an array
	if(!Array.isArray(acceptable))
		throwTypeException();
	
	//If the array is empty (index 0 of acceptable is undefined), throw an error about that too
	if(!acceptable[0])
		throw new Error('MongooseQueryFilter requires passed array to contain at least one value');

	//Throw another type error if the query object isn't an object (just in case, stuff happens)
	if(typeof query !== 'object')
		throw new TypeError('MongooseQueryFilter requires object as second param');
	
	//If no query passed in, or query is empty, return an empty Mongoose filter
	if(!query || query == {})
		return done(null, {});
	
	//Our queries from req.query will be all lowercase but our properties in acceptable are camelcase, so we create an array of our properties to compare with the query object
	var acceptableToLower = [];
	acceptable.forEach(function(field){
		acceptableToLower.push(field.toLowerCase());
	});
	//We check if the query contains parameters that are not in our acceptable properties array
	for(var field in query){
		if(!acceptableToLower.includes(field))
			//Return null if an invalid property exists in the query
			return done(null, null);
	}
	
	//We create a filter to pass to the Mongoose object find function
	var filteredQuery = {};
	acceptable.forEach(function(field){
		//If one of the fields in the acceptable array is not a string, throw a type exception
		if(!(typeof field === 'string') && !(field instanceof String))
			throwTypeException();
		//We create a variable that represents the field in lowercase characters and then check if the query object contains those properties
		var lowerCaseField = field.toLowerCase();
		//If a property exists in a field, we put the camelcase version from acceptalbe in the filter query
		if(query[lowerCaseField])
			filteredQuery[field] = query[lowerCaseField];
	});
	//Return the filter in the callback
	return done(null, filteredQuery);
}

//Export our module with our filter function
module.exports = {filter: filter};