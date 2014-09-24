module.exports = function(grunt) {
    'use strict';

    //load npm tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

        pkg : grunt.file.readJSON('package.json'),

        mocha : {
            browser : {
                src : ['test/**/index.html'],
                options : {
                    reporter : 'Spec',
                    run : true,
                    timeout : 10000
                }
            }
        },

        connect : {
            test : {
              options : {
                port : 9000,
                base : 'test/samples'
              }
            }
        },

        watch : {
            test : {
                files: '**/*.js',
                tasks: ['test'],
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
