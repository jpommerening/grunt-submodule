module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    build: {
      test1: {
        options: {
          data: 'test1'
        },
        dest: 'tmp/test1'
      },
      test2: {
        options: {
          data: 'test2'
        },
        dest: 'tmp/test2'
      }
    },
    test: {
      test3: {}
    }
  });

  grunt.loadTasks('tasks');
  grunt.registerTask('default', ['build', 'test']);
};
