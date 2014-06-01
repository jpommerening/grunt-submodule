module.exports = function (grunt) {
  'use strict';

  grunt.registerMultiTask('submodule-test', function taskDummy() {
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
  });
};
