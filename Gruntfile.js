module.exports = function(grunt) {
    'use strict';

    var url = require('url');
    var coverageDir = '.coverage';

    /*
     * HTTP Middlewares for the local web server
     */

    //to serve instrumented code to the tests runners
    var instrumentMiddleware = function(req, res, next) {
        if (/aja\.js$/.test(req.url)) {
            return res.end(grunt.file.read(coverageDir + '/instrument/src/aja.js'));
        }
        return next();
    };

    //to test JSONP
    var jsonpMiddleware = function(req, res, next) {
        if (/(jsonp)|(callback)/.test(req.url)) {
            var parsed = url.parse(req.url, true);
            var path = parsed.pathname.replace(/^\//, '');
            var jsonp = parsed.query.jsonp || parsed.query.callback;
            return res.end(jsonp + '(' + grunt.file.read(path) + ');');
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

    //to test post
    var postMiddleware = function(req, res, next) {
        if (req.method === 'POST') {
            return res.end(JSON.stringify({
                body : req.body
            }));
        }
        return next();
    };

    //to test put
    var putMiddleware = function(req, res, next) {
        if (req.method === 'PUT') {
            return res.end(JSON.stringify({
                body : req.body
            }));
        }
        return next();
    };

    //load npm tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        //mocha but from grunt-mocha-phantom-istanbul
        mocha: {
            options: {
                urls: [
                    'http://localhost:9901/test/properties/index.html',
                    'http://localhost:9901/test/methods/index.html',
                    'http://localhost:9901/test/integration/index.html'
                ],
                reporter: 'Spec',
                run: true,
                timeout: 10000,
            },
            browser: {},
            browsercov: {
                options: {
                    coverage: {
                        coverageFile: coverageDir + '/data.json'
                    }
                }
            }
        },

        connect: {
            test: {
                options: {
                    hostname: 'localhost',
                    port: 9901,
                    base: '.',
                    middleware: function(connect, options, middlewares) {
                        return [connect.bodyParser(), postMiddleware, putMiddleware, jsonpMiddleware, timeMiddleware].concat(middlewares);
                    },
                }
            },
            testcov: {
                options: {
                    hostname: 'localhost',
                    port: 9901,
                    base: '.',
                    middleware: function(connect, options, middlewares) {
                        return [instrumentMiddleware, connect.bodyParser(), postMiddleware, jsonpMiddleware, timeMiddleware].concat(middlewares);
                    },
                }
            }
        },

        watch: {
            test: {
                files: '**/*.js',
                tasks: ['mocha:browser'],
                options: {
                    debounceDelay: 2000,
                }
            }
        },

        instrument: {
            files: 'src/aja.js',
            options: {
                lazy: true,
                basePath: '.coverage/instrument/'
            }
        },

        makeReport: {
            src: '.coverage/data.json',
            options: {
                type: 'html',
                dir: '.coverage/reports',
            },
        },

        uglify: {
            dev: {
                files: {
                    'src/aja.min.js': ['src/aja.js']
                },
                options: {
                    banner: "/**\n * <%= pkg.name %> <%= pkg.homepage %>\n *  \n * @version <=%pkg.version%>\n * @author <%= pkg.author.name %> <<%= pkg.author.email %>> © <%= grunt.template.today('yyyy') %>\n * @license MIT\n**/",
                    sourceMap: true,
                    beautify: {
                        'max_line_len': 500
                    }
                }
            },
            prod: {
                files: {
                    'aja.min.js': ['src/aja.js']
                }
            }
        },

        jsdoc: {
            dist: {
                src: ['src/*.js', 'README.md'],
                options: {
                    destination: 'doc',
                    private: false,
                    template: "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
                    configure: "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json"
                }
            }
        }
    });

    //run tests while developping
    grunt.registerTask('devtest', ['connect:test', 'watch:test']);

    //run just the tests
    grunt.registerTask('test', ['connect:test', 'mocha:browser']);

    //run the tests with code coverage
    grunt.registerTask('testcov', ['connect:testcov', 'instrument', 'mocha:browsercov', 'makeReport']);

    //build the package
    grunt.registerTask('build', ['jsdoc:dist', 'uglify:dev', 'uglify:prod']);
};
