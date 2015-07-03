/**
 * Quick and dirty middleware to answer the tested aja requests
 */

var url = require('url');
var fs = require('fs');

//Any request that contains the
var jsonpMiddleware = function(req, res, next) {
    var parsed, path, jsonp;
    if (/(jsonp)|(callback)/.test(req.url)) {
        parsed = url.parse(req.url, true);
        path = parsed.pathname.replace(/^\//, '');
        jsonp = parsed.query.jsonp || parsed.query.callback;
        return res.end(jsonp + '(' + fs.readFileSync(path) + ');');
    }
    return next();
};

//to test browser caching
var timeMiddleware = function(req, res, next) {
    if (/time/.test(req.url)) {
        return res.end(JSON.stringify({
            ts : new Date().getTime()
        }));
    }
    return next();
};

//to test timeout
var timeoutMiddleware = function(req, res, next) {
    if (/beinglate/.test(req.url)) {
        setTimeout(function() {
            res.writeHead(204);
            return res.end();
        }, 500);
    } else {
        return next();
    }
};

//to mirror the request content
var mirrorMiddleware = function(req, res, next) {
    var parsed;
    if (/mirror/.test(req.url)) {
        parsed = url.parse(req.url, true);
        return res.end(JSON.stringify({
            headers : req.headers,
            queryString : parsed.query,
            body : req.body
        }));
    }
    return next();
};

//to test if no content 200 response doesn't trigger error
var emptyMiddleware = function(req, res, next) {
    if (/empty/.test(req.url)) {
        res.writeHead(204);
        return res.end();
    }
    return next();
};

module.exports = [
    jsonpMiddleware,
    timeMiddleware,
    timeoutMiddleware,
    mirrorMiddleware,
    emptyMiddleware
];
