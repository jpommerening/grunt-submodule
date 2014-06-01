module.exports = function (grunt) {
  'use strict';

  function taskDummy() {
    grunt.event.emit('submodule-test', {
      base: process.cwd(),
      gruntfile: __filename,
      name: this.name,
      options: this.options(),
      arguments: [].slice.apply(arguments)
    });
    grunt.log.ok();
  }

  grunt.registerTask('build', taskDummy);
  grunt.registerTask('test', taskDummy);
};
