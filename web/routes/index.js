var express = require('express');
var router = express.Router();
var request = require('request');

// Use API_HOST env var or fallback to a default URL
var api_url = (process.env.API_HOST || 'http://api:3001') + '/api/status';

/* GET home page. */
router.get('/', function(req, res, next) {
    request({
        method: 'GET',
        url: api_url,
        json: true
    }, function(error, response, body) {
        console.log('API Response:', error, body);  // Debugging output

        if (error || !response || response.statusCode !== 200 || !Array.isArray(body) || !body[0]) {
            // On error, respond with 500 and error message
            return res.status(500).send('Error running request to ' + api_url);
        } else {
            // On success, render the index page with data from API response
            res.render('index', {
                title: '3tier App',
                request_uuid: body[0].request_uuid,
                time: body[0].time
            });
        }
    });
});

module.exports = router;