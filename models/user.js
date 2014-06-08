var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	hasProject : Boolean,
	email : String,
	github : {
		id : String,
		token : String,
		name : String
	}
});

module.exports = mongoose.model('User', userSchema);