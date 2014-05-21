/*
 * grunt-submodule – copyright © 2014, Jonas Pommerening
 * Released under the MIT license.
 * https://github.com/jpommerening/grunt-submodule.git
 */
module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    clean: {
      tests: ['tmp']
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
      },
      tasks: {
        src: [
          __filename,
          'tasks/*.js',
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: [
          'test/*.js'
        ]
      }
    },

    submodule: {
      'test/fixtures/*': {
        options: {
          tasks: ['test']
        }
      }
    },

    mochacli: {
      options: {
        ui: 'bdd',
        reporter: 'spec'
      },
      test: {
        src: [ 'test/*.js' ]
      }
    },
    watch: {
      tasks: {
        files: [
          __filename,
          'tasks/*.js'
        ],
        tasks: ['newer:jshint:tasks', 'clean', 'submodule', 'mochacli']
      },
      test: {
        files: [
          'test/*.js'
        ],
        tasks: ['newer:jshint:test', 'newer:mochacli']
      }
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-newer');

  grunt.registerTask('test', ['clean', 'submodule', 'mochacli']);
  grunt.registerTask('default', ['test', 'jshint']);
};
