var bodyParser = require('body-parser');
var _ = require('lodash');

module.exports = function(grunt) {
    'use strict';

    var coverage = {};
    var testMiddlewares = require('./test/server/middlewares.js');

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        eslint: {
            dist: [
                'src/**/*.js', '!src/*.bundle.js', '!src/*.min.js',
                'test/**/*.js', '!test/**/*.bundle.js',
                'Gruntfile.js'
            ]
        },

        browserify: {
            bundle: {
                files: {
                    'src/aja.bundle.js': ['src/aja.js']
                },
                options: {
                    transform: [
                        ['babelify', {
                            'presets': ['es2015'],
                            'plugins': ['add-module-exports']
                        }]
                    ],
                    browserifyOptions: {
                        standalone: 'aja',
                        debug: true
                    }
                }
            },
            test: {
                files: [{
                    expand: true,
                    cwd: 'test/',
                    dest: 'test/',
                    src: '**/test.js',
                    ext: '.bundle.js'
                }],
                options: {
                    transform: [
                        ['babelify', {
                            'presets': ['es2015'],
                            'plugins': [ ['__coverage__', { only: 'src/' }] ]
                        }]
                    ],
                    browserifyOptions: {
                        debug: true
                    }
                }
            }
        },

        connect: {
            options: {
                hostname: '<%=pkg.config.host%>',
                port: '<%=pkg.config.port%>',
                base: '.',
                middleware: function(connect, options, middlewares) {
                    return [bodyParser.json(), bodyParser.urlencoded({
                        extended: true
                    })]
                    .concat(testMiddlewares)
                    .concat(middlewares);
                }
            },
            devtest: {
                options: {
                    livereload: true
                }
            },
            test: {}
        },

        open: {
            test: {
                path: 'http://<%=pkg.config.host%>:<%=pkg.config.port%>/test',
                app: '<%=pkg.config.browser%>'
            }
        },

        watch: {
            devtest: {
                files: ['test/**/test.js', 'src/**/*.js', '!src/**/*.bundle.js'],
                tasks: ['browserify:test'],
                options: {
                    livereload: true
                }
            }
        },

        qunit: {
            test: {
                options: {
                    inject : './test/phantomjs/bridge.js',
                    urls: grunt.file.expand('test/**/test.html').map(function(url) {
                        return 'http://<%=pkg.config.host%>:<%=pkg.config.port%>/' + url;
                    })
                }
            }
        },

        clean : {
            coverage : ['.coverage/**']
        },


        makeReport: {
            src: '.coverage/data.json',
            options: {
                type: 'html',
                dir : '.coverage/reports',
                print: 'detail'
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

    //merge qunit coverage data
    grunt.event.on('qunit.coverage', function(__coverage__) {
        if (__coverage__) {
            _.merge(coverage, __coverage__);
        }
    });

    grunt.registerTask('write-coverage', function(){
        grunt.file.write('.coverage/data.json', JSON.stringify(coverage));
    });

    //run tests while developping
    grunt.registerTask('devtest', ['browserify:test', 'connect:devtest', 'open:test', 'watch:devtest']);

    //run just the tests
    grunt.registerTask('test', ['clean:coverage', 'eslint:dist', 'browserify:bundle', 'browserify:test', 'connect:test', 'qunit:test', 'write-coverage', 'makeReport']);

    //build the package
    grunt.registerTask('build', ['browserify:bundle']);


};
