// Helper functions
exports.projectExists = function(projectApi, documents) {
	for (var i=0; i<documents.length; i++) {
		if (projectApi === documents[i].repoApi) {
			return true;
		}
	}
	return false;
}