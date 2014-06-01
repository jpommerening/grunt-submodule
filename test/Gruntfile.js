module.exports = function (grunt) {
  'use strict';

  function taskDummy() {
    grunt.event.emit('submodule-test', {
      base: process.cwd(),
      gruntfile: __filename,
      task: this.name,
      args: [].slice.apply(arguments)
    });
  }

  grunt.registerTask('build', taskDummy);
  grunt.registerTask('test', taskDummy);
};
