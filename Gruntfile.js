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
                    livereload: 35729
                }
            }
        },

        open: {
            preview: {
                path: 'http://localhost:4040/index.html',
                app: 'fxdev'
            }
        },

        cssmin: {
            dist: {
                files: {
                    'css/style.min.css': [
                        'css/font.css', 
                        'css/normalize.css', 
                        'css/layout.css', 
                        'css/theme.css',
                        'js/vendor/prism/themes/prism-okaidia.css',
                        'js/vendor/prism/plugins/line-numbers/prism-line-numbers.css'
                    ]
                }
            }
        },

        concat : {
            dist: {
                files: {
                   'js/script.min.js' : [
                       'js/vendor/prism/prism.js',
                       'js/vendor/prism/plugins/line-numbers/prism-line-numbers.min.js',
                       'js/main.js'
                    ]
                }
            }
        },

        watch: {
            options: {
                livereload: 35729,
                debounceDelay: 200
            },
            preview: {
                files: ['index.html', 'css/*.css', '!css/*.min.css'],
                tasks : ['cssmin', 'concat']
            }
        },

    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-open');
    grunt.registerTask('preview', ['connect:preview', 'open:preview', 'watch:preview']);
    grunt.registerTask('build', ['cssmin', 'concat']);

};
