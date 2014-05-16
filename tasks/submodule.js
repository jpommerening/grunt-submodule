'use strict';

var async = require('async');
var fork = require('child_process').fork;
var minimatch = require('minimatch');

module.exports = function(grunt) {

  grunt.registerTask('submodule', 'Run tasks across submodules.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      base: '.',
      gruntfile: 'Gruntfile.js',
      tasks: []
    });

    var node = process.argv[0];
    var gruntCli = process.argv[1];
    var tasks = arguments.length > 1 ? [].slice.call(arguments, 1) : options.tasks;
    var filter = arguments[0] ? minimatch.filter(arguments[0]) : function() { return true; };
    var done = this.async();

    grunt.util.spawn({
      cmd: 'git',
      args: ['ls-files', '-z', '--stage']
    }, function (error, result, code) {
      if (error) {
        return done(error);
      }

      var files = result.stdout.split('\0');
      var pattern = /([0-9]+) ([0-9a-f]{40}) ([0-9])\t(.*)$/;

      var submodules = files.map(pattern.exec.bind(pattern)).filter(function(match) {
        return match && match[1] === '160000' && filter(match[4]);
      }).map(function(match) {
        return match[4];
      });

      function errorFromObject(o) {
        var e = new Error(o.message);
        e.message = o.message;
        e.origError = o;
        return e;
      }

      async.eachSeries(submodules, function (submodule, done) {
        var err;
        var args = [options.base, submodule, options.gruntfile].concat(tasks);
        var cp = fork(__dirname + '/lib/grunt', args, {});
        cp.on('message', function (msg) {
          if (msg.fail === 'fatal') {
            err = msg.error;
            grunt.fail.fatal(errorFromObject(msg.error), msg.errcode);
          } else if (msg.fail === 'warn') {
            grunt.fail.warn(errorFromObject(msg.error), msg.errcode);
          }
        });
        cp.on('close', function (code) {
          if( code ) {
            done(err);
          } else {
            done();
          }
        });
      }, done);
    });
  });

};
