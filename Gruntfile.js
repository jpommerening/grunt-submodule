module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    'submodule-test': {
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
    }
  });

  grunt.loadTasks('tasks');
  grunt.registerTask('default', ['submodule-test:test1', 'submodule-test:test2']);
};
