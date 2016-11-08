module.exports = {
	'200': {
		noPayload: function(res){
			res.status(200).json({'success': true});
		},
		payload: function(res, payload){
			res.status(200).json({'success': true, payload});
		}
	},
	'201': function(res){
		res.status(201).json({'success': true});
	},
	'400': {
		invalidQuery: function(res){
			res.status(400).json({'success': false, 'error': 'invalid property or properties in query'});
		},
		missingFields: function(res){
			res.status(400).json({'success': false, 'error': 'expected field(s) missing in query'});
		},
		other: function(res, error){
			res.status(400).json({'success': false, 'error': error});
		}
	},
	'401': function(res, error){
		res.status(401).json({'success': false, 'error': error});
	},
	'404': function(res, resource){
		res.status(404).json({'success': false, 'error': 'no '+ resource + ' found'});
	},
	'custom404': function(res, error){
		res.status(404).json({'success': false, 'error': error});
	},
	'409': function(res, error){
		res.status(409).json({'success': false, 'error': error});
	},
	'500': function(res){
		res.status(500).json({'success': false, 'error': 'unexpected server error'});
	}
}