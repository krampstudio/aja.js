var fs = require('fs');
var JSDOC_TEMPLATE, JSDOC_CONFIG;
if(fs.existsSync('node_modules/grunt-jsdoc/node_modules/ink-docstrap/template'))
    JSDOC_TEMPLATE = 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template';
else if(fs.existsSync('node_modules/ink-docstrap/template'))
    JSDOC_TEMPLATE = 'node_modules/ink-docstrap/template';
if(fs.existsSync('node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json'))
    JSDOC_CONFIG = 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json';
else if(fs.existsSync('node_modules/ink-docstrap/template/jsdoc.conf.json'))
    JSDOC_CONFIG = 'node_modules/ink-docstrap/template/jsdoc.conf.json';

module.exports = function(grunt) {
    'use strict';

    var testMiddlewares = require('./test/server/middlewares.js');
    var coverageDir = '.coverage';

    //load npm tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        eslint : {
            dist : ['src/aja.js']
        },

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
                timeout: 10000
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
                        return [connect.json(), connect.urlencoded()]
                                    .concat(testMiddlewares)
                                    .concat(middlewares);
                    },
                }
            },
            testcov: {
                options: {
                    hostname: 'localhost',
                    port: 9901,
                    base: '.',
                    middleware: function(connect, options, middlewares) {
                        //to serve instrumented code to the tests runners
                        var instrumentMiddleware = function(req, res, next) {
                            if (/aja\.js$/.test(req.url)) {
                                return res.end(grunt.file.read(coverageDir + '/instrument/src/aja.js'));
                            }
                            return next();
                        };
                        return [connect.json(), connect.urlencoded(), instrumentMiddleware]
                                    .concat(testMiddlewares)
                                    .concat(middlewares);
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
                    banner: '/**\n * <%= pkg.name %> <%= pkg.homepage %>\n *  \n * @version <=%pkg.version%>\n * @author <%= pkg.author.name %> <<%= pkg.author.email %>> © <%= grunt.template.today(\'yyyy\') %>\n * @license MIT\n**/',
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
                    template: JSDOC_TEMPLATE,
                    configure: JSDOC_CONFIG
                }
            }
        }
    });

    //run tests while developping
    grunt.registerTask('devtest', ['connect:test', 'watch:test']);

    //run just the tests
    grunt.registerTask('test', ['eslint', 'connect:test', 'mocha:browser']);

    //run the tests with code coverage
    grunt.registerTask('testcov', ['connect:testcov', 'instrument', 'mocha:browsercov', 'makeReport']);

    //build the package
    grunt.registerTask('build', ['jsdoc:dist', 'uglify:dev', 'uglify:prod']);
};
