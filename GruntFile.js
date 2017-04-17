module.exports = function(grunt) {
    'use strict';
    
    // Load npm tasks beginning with 'grunt-'
    require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );
    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            css: "assets/css",
            js: "assets/js",
            scss: "assets/scss"
        },
        watch: {
            options: {
                spawn: false // Makes watch run A LOT faster, and also lets you pass variables to the grunt tasks being called
            },
            js: {
                files: ['<%= dirs.js %>/src/*.js'],
                tasks: ['concat:js','uglify','sync:test']
            },
            scss: {
                files: [
                    '<%= dirs.scss %>/*.scss'
                ],
                tasks: ['compass','concat:css']
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: '<%= dirs.scss %>',
                    cssDir: '<%= dirs.css %>/sass_output',
                    environment: 'production',
                    raw: 'preferred_syntax = :scss\n', // Use `raw` since it's not directly available
                    outputStyle: 'compressed'
                }
            }
        },
        concat: {
            options: {
                separator: ''
            },
            css: {
                src: ['<%= dirs.css %>/sass_output/*.css'],
                dest: '<%= dirs.css %>/style.min.css'
            },
            js: {
                src: [
                    '<%= dirs.js %>/src/intro.js',
                    '<%= dirs.js %>/src/front-page.js',
                    '<%= dirs.js %>/src/main-menu.js',
                    '<%= dirs.js %>/src/outro.js'
                ],
                dest: '<%= dirs.js %>/script.min.js'
            }
        },
        uglify: {
            main: {
                options: {
                    banner: ''
                },
                files: {
                    '<%= dirs.js %>/script.min.js': ['<%= dirs.js %>/script.min.js']
                }
            }
        }
    });
    
    // On watch events configure copy tasks to only run on changed file
    grunt.event.on('watch', function(action, filepath) {
        grunt.config('copy.scss.files.0.src', [filepath]);
        grunt.config('copy.dcss.files.0.src', filepath);
        grunt.config('copy.js.files.0.src', filepath);
    });
};