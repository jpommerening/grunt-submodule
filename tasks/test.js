module.exports = function (grunt) {
  'use strict';

  function taskDummy() {
    grunt.event.emit('submodule-test', {
      base: process.cwd(),
      gruntfile: __filename,
      name: this.name,
      options: this.options(),
      arguments: [].slice.apply(arguments),
      target: this.target,
      files: this.files
    });
    grunt.log.ok();
  }

  grunt.registerMultiTask('build', taskDummy);
  grunt.registerMultiTask('test', taskDummy);
};
