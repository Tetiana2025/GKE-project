var express = require('express');
var router = express.Router();
var request = require('request');


var api_url = process.env.API_HOST + '/api/status';

/* GET home page. */
router.get('/', function(req, res, next) {
    request({
            method: 'GET',
            url: api_url,
            json: true
        },
        function(error, response, body) {
            console.log('API Response:', error, body);  // <-- add this for debugging

            if (error || response.statusCode !== 200 || !Array.isArray(body) || !body[0]) {
                return res.status(500).send('error running request to ' + api_url);
            } else {
                res.render('index', {
                    title: '3tier App',
                    request_uuid: body[0].request_uuid,
                    time: body[0].time
                });
            }
        }
    );
});

module.exports = router;