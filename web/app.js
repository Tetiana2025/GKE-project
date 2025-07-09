var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', function (req, res) {
    res.status(200).send('OK');
});

// Config endpoint for frontend
const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

app.get('/config', (req, res) => {
    res.json({ apiUrl: API_BASE_URL });
});

// API status proxy
app.get('/api-status', async (req, res) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/status`);
        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error("Proxy error:", err.message);
        res.status(500).json({ error: 'API proxy failed' });
    }
});

// Main routes
app.use('/', routes);

// 404 handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: app.get('env') === 'development' ? err : {}
    });
});

module.exports = app;