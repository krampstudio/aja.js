module.exports = function(grunt) {
    'use strict';

    //load npm tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

        pkg : grunt.file.readJSON('package.json'),



        mocha : {
            browser : {
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

        instrument: {
          files: 'src/*.js',
          options: {
            lazy: true,
            basePath: '.coverage/instrument/'
          }
        },

        storeCoverage: {
          options: {
            dir: '.coverage/data'
          }
        },

        makeReport: {
          src: '.coverage/data/**/*.json',
          options: {
            type: 'html',
            dir: '.coverage/reports',
          },
        },

        jsdoc : {
            dist : {
                src: ['src/*.js', 'README.md'], 
                options: {
                    destination: 'doc',
                    private : false,
                    template : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
                    configure : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json"
                }
            }
        }
    });

    //tasks related unit tests
    grunt.registerTask('test', ['connect:test', 'mocha:browser']);
    grunt.registerTask('testcov', ['connect:test', 'instrument', 'mocha:browser', 'storeCoverage', 'makeReport']);

    grunt.registerTask('devtest', ['connect:test', 'watch:test']);
};
