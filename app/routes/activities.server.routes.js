'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var activities = require('../../app/controllers/activities.server.controller');

	// Activities Routes
	app.route('/activities')
		.get(users.requiresLogin, activities.hasAuthorization, activities.list)
		.post(activities.create);

	app.route('/activities/:activityId')
		.get(users.requiresLogin, activities.hasAuthorization, activities.read)
		.put(users.requiresLogin, activities.hasAuthorization, activities.update)
		.delete(users.requiresLogin, activities.hasAuthorization, activities.delete);

	// Bind the Activity middleware
	app.param('activityId', activities.activityByID);
};
