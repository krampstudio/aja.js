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

        connect : {
            test : {
              options : {
                hostname : 'localhost',
                port : 9901,
                base : '.'
              }
            }
        },

        watch : {
            test : {
                files: '**/*.js',
                tasks: ['mocha:browser'],
                options: {
                    debounceDelay: 250,
                }
            }
        }
    });

    //tasks related unit tests
    grunt.registerTask('test', ['connect:test', 'mocha:browser']);

    grunt.registerTask('devtest', ['connect:test', 'watch:test']);
};
