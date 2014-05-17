module.exports = function (grunt) {
  'use strict';

  grunt.registerMultiTask('submodule-test', function() {
    var options = this.options();
    var files = this.files;

    this.files.forEach(function (file) {
      grunt.file.write(file.dest, options.data);
    });
    grunt.log.ok();
  });
};
