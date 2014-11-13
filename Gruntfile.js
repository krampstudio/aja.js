module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        connect: {
            preview: {
                options: {
                    port: 4040,
                    base: '.',
                    livereload : 35729
                }
            }
        },

        open: {
            preview: {
                path: 'http://localhost:4040/index.html',
                app: 'fxdev'
            }
        },

        watch: {
            options: {
                livereload: 35729,
                debounceDelay: 200
            },
            preview: {
                files : ['index.html', 'css/*.css']
            }
        },

    });

    grunt.loadNpmTasks('grunt-contrib-connect'); 
    grunt.loadNpmTasks('grunt-contrib-watch'); 
    grunt.loadNpmTasks('grunt-open'); 
    grunt.registerTask('preview', ['connect:preview', 'open:preview', 'watch:preview']);

};
