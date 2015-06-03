'use strict';

/**
 * Module dependencies.
 */
var http = require('http'),
    querystring = require('querystring');


exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};


exports.getBikeParking = function(req, res) {
  //TODO: Extract the port number from the following docker env var:
  //         process.env.ML_SERVER_PORT=tcp://172.17.0.38:5002
  //
  // URL: http://ml-server:5002/api/bike_parking?lat=37.748918599999996&long=-122.41816180000001&n=100
  //

  var urlPath = '/api/bike_parking?' + querystring.stringify(req.query);

  var options = {
      host: 'ml-server',  //<<<< This server name comes from a Docker link env var.
      port: 5002,
      path: urlPath,
      method: 'GET'
  };

  //fish: for dev
  /*
  var options = {
      host: '127.0.0.1',
      port: 5002,
      path: urlPath,
      method: 'GET'
  };
  */

  var innerReq = http.request(options, function(innerRes) {
    //console.log('STATUS: ' + innerRes.statusCode);
    //console.log('HEADERS: ' + JSON.stringify(innerRes.headers));

    var data = '';

    innerRes.on('data', function(chunk) {
      data += chunk;
    });

    innerRes.on('end', function(finalRes) {
      res.send(data);
    });
  });

  innerReq.on('error', function(e) {
    console.log('\n*** Error ***  Problem with request: ' + e.message);
  });

  innerReq.end(); //write data to request body
};
