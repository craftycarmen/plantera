const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const routes = require('./routes');
const { ValidationError } = require('sequelize');
const { environment } = require('./config');

const isProduction = environment === 'production';
const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',  // Allow localhost for testing
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
};

if (!isProduction) {
    app.use(cors(corsOptions));  // Allow CORS in development (or for your testing environment)
}

app.use((req, res, next) => {
    if (req.originalUrl === '/api/checkout/webhook') {
        return next(); // Skip JSON parsing for the webhook
    }
    express.json()(req, res, next);
});


// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
}

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// helmet helps set a variety of headers to better secure your app
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);


app.use((req, res, next) => {
    if (req.originalUrl === '/api/checkout/webhook') {
        console.log('CSRF skipped for webhook');
        return next();
    }
    console.log('CSRF applied for:', req.originalUrl);
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction ? 'Lax' : 'Strict',
            httpOnly: true,
        },
    })(req, res, next);
});

// Add CSRF token to cookies (exclude webhook route)
app.use((req, res, next) => {
    if (req.originalUrl === '/api/checkout/webhook') {
        return next();
    }
    res.cookie('XSRF-TOKEN', req.csrfToken(), {
        secure: isProduction,
        sameSite: isProduction ? 'Lax' : 'Strict',
    });
    next();
});

app.use(routes); // Connect all the routes

app.use((_req, res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = { message: "The requested resource couldn't be found." };
    err.status = 404;

    if (!isProduction) {
        next(err);
    } else {
        res.status(err.status).json({
            title: err.title,
            message: err.message,
            errors: err.errors
        });
    }

    // next(err);
});

app.use((err, _req, _res, next) => {
    // check if error is a Sequelize error:
    if (err instanceof ValidationError) {
        let errors = {};
        for (let error of err.errors) {
            errors[error.path] = error.message;
        }
        err.title = 'Validation error';
        err.errors = errors;
    }
    next(err);
});

app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
        title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    });
});

module.exports = app;
