var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
	repo : String,
	repoApi : String,
	developers : [String]
});

module.exports = mongoose.model('Project', projectSchema);