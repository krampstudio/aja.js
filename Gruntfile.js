module.exports = function(grunt) {
    'use strict';

    //load npm tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

        pkg : grunt.file.readJSON('package.json'),

        mocha : {
            browser : {
                //src : ['test/**/index.html'],
                options : {
                    urls : [
                        'http://localhost:9901/test/properties/index.html', 
                        'http://localhost:9901/test/methods/index.html', 
                        'http://localhost:9901/test/integration/index.html'
                    ],
                    reporter : 'Spec',
                    run : true,
                    timeout : 10000
                }
            }
        },

        'blanket_mocha' : {
            browser : {
                //src : ['test/**/index.html'],
                options : {
                    threshold : 1,
                    urls : [
                        'http://localhost:9901/test/properties/index.html', 
                        'http://localhost:9901/test/methods/index.html', 
                        'http://localhost:9901/test/integration/index.html'
                    ],
                    reporter : 'Spec',
                    run : true,
                    timeout : 10000
                }
            }
        },
        connect : {
            test : {
                options : {
                    hostname : 'localhost',
                    port : 9901,
                    base : '.',
                    middleware: function(connect, options, middlewares) {
                       var url = require('url');
                       return [function(req, res, next) {
                            if(/(jsonp)|(callback)/.test(req.url)){
                                var parsed = url.parse(req.url, true);
                                var path = parsed.pathname.replace(/^\//, '');
                                var jsonp = parsed.query.jsonp || parsed.query.callback;
                                return res.end(jsonp + '(' + grunt.file.read(path) + ');');
                            }
                            return next();
                        }].concat(middlewares);
                    },
                }
            }
        },

        watch : {
            test : {
                files: '**/*.js',
                tasks: ['mocha:browser'],
                options: {
                    debounceDelay: 2000,
                }
            }
        },

        jsdoc : {
            dist : {
                src: ['src/*.js', 'README.md'], 
                options: {
                    destination: 'doc',
                    template : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
                    configure : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json"
                }
            }
        }
    });

    //tasks related unit tests
    //grunt.registerTask('test', ['connect:test', 'mocha:browser']);
    grunt.registerTask('test', ['connect:test', 'blanket_mocha:browser']);

    grunt.registerTask('devtest', ['connect:test', 'watch:test']);
};
