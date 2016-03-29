var bodyParser = require('body-parser');

module.exports = function(grunt) {
    'use strict';

    var testMiddlewares = require('./test/server/middlewares.js');

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        eslint : {
            dist : ['src/*.js', '!src/*.bundle.js']
        },

        browserify : {
            options: {
                transform: [
                    ['babelify', {
                        'presets' : ['es2015']
                    }]
                ],
                browserifyOptions: {
                    debug: true
                }
            },
            bundle: {
                files: {
                    'src/aja.bundle.js': ['src/aja.js']
                },
                options: {
                    transform: [
                        ['babelify', {
                            'presets' : ['es2015'],
                            'plugins' : ['add-module-exports']
                        }]
                    ],
                    browserifyOptions: {
                        standalone : 'aja',
                        debug: true
                    }
                }
            },
            test: {
                files : [{
                    expand: true,
                    cwd: 'test/',
                    dest: 'test/',
                    src: '**/test.js',
                    ext: '.bundle.js'
                }]
            }
        },

        connect: {
            options: {
                hostname: '<%=pkg.config.host%>',
                port: '<%=pkg.config.port%>',
                base: '.',
                middleware: function(connect, options, middlewares) {
                    return [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
                                .concat(testMiddlewares)
                                .concat(middlewares);
                }
            },
            devtest: {
                options: {
                    livereload: true
                }
            },
            test: { }
        },

        open: {
            test : {
                path  : 'http://<%=pkg.config.host%>:<%=pkg.config.port%>/test',
                app : '<%=pkg.config.browser%>'
            }
        },

        watch: {
            devtest: {
                files : ['test/**/test.js', 'src/**/*.js', '!src/**/*.bundle.js'],
                tasks : ['browserify:test'],
                options: {
                    livereload : true
                }
            }
        },

        qunit : {
            test: {
                options: {
                    urls : grunt.file.expand('test/**/test.html').map(function(url){
                        return 'http://<%=pkg.config.host%>:<%=pkg.config.port%>/' + url;
                    })
                }
            }
        },

        jsdoc: {
            dist: {
                src: ['src/*.js', 'README.md'],
                options: {
                    destination: 'doc',
                    private: false,
                    template: 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template',
                    configure: 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json'
                }
            }
        }
    });

    //run tests while developping
    grunt.registerTask('devtest', ['browserify:test', 'connect:devtest', 'open:test', 'watch:devtest']);

    //run just the tests
    grunt.registerTask('test', ['eslint:dist', 'browserify:bundle', 'browserify:test', 'connect:test', 'qunit:test']);

    //run the tests with code coverage
    //grunt.registerTask('testcov', ['connect:testcov', 'instrument', 'mocha:browsercov', 'makeReport']);

    //build the package
    grunt.registerTask('build', ['browserify:bundle']);
};
