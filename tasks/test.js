module.exports = function (grunt) {
  'use strict';

  var path = require('path');
  var gruntfile = path.resolve(__dirname, '../Gruntfile.js');

  function taskDummy() {
    grunt.event.emit('submodule-test', {
      base: process.cwd(),
      gruntfile: gruntfile,
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
