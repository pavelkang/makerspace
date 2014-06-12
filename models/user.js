var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	repo : String,
	repoApi : String,
	email : String,
	github : {
		id : String,
		token : String,
		name : String
	}
});

module.exports = mongoose.model('User', userSchema);