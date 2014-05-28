/**
 * grunt-submodule – copyright © 2014, Jonas Pommerening
 * Released under the MIT license.
 * https://github.com/jpommerening/grunt-submodule.git
 */
'use strict';

var which = require('which');
var async = require('async');
var minimatch = require('minimatch');
var fork = require('child_process').fork;

module.exports = function (grunt) {

  var _ = grunt.util._;
  var git;

  grunt.registerTask('submodule', 'Run tasks across submodules.', function() {
    var options = this.options({
      base: '.',
      gruntfile: 'Gruntfile.js',
      tasks: arguments.length > 1 ? [].slice.call(arguments, 1) : ['default']
    });
    var data = grunt.config(this.name) || {};
    var done = this.async();
    var filter = arguments[0] ? minimatch.filter(arguments[0]) : function() { return true; };

    function getOptions(submodule) {
      var sources = [];
      if (data.hasOwnProperty(submodule)) {
        sources.push(data[submodule].options || {});
      }
      sources.push.apply(sources, Object.keys(data).filter(function (key) {
        return key !== 'options' && minimatch(submodule, key);
      }).map(function (key) {
        return data[key].options || {};
      }));
      sources.push(options);

      return _.defaults.apply(_, sources);
    }

    if (!git) {
      try {
        git = which.sync('git');
      } catch (err) {
        done(err);
      }
    }

    grunt.verbose.writeln('Running ' + git + ' ls-files -z --stage');
    grunt.util.spawn({
      cmd: git,
      args: ['ls-files', '-z', '--stage']
    }, function (error, result, code) {
      if (error) {
        return done(error);
      }
      if (code) {
        return done(new Error('git returned ' + code));
      }

      var files = result.stdout.split('\0');
      var pattern = /([0-9]+) ([0-9a-f]{40}) ([0-9])\t(.*)$/;

      var submodules = files.map(function (file) {
        return pattern.exec(file);
      }).filter(function(match) {
        return match && match[1] === '160000' && filter(match[4]);
      }).map(function(match) {
        return match[4];
      });

      grunt.verbose.writeln('Submodules:', grunt.log.wordlist(submodules));

      function errorFromObject(o) {
        var e = new Error(o.message);
        e.message = o.message;
        e.origError = o;
        return e;
      }

      async.eachSeries(submodules, function (submodule, done) {
        var options = getOptions(submodule);
        var err;
        var args = [
          options.base,
          submodule,
          options.gruntfile
        ].concat(options.tasks).concat(grunt.option.flags());

        grunt.log.ok('Submodule', submodule);
        grunt.verbose.writeflags(options, 'Submodule options');
        grunt.verbose.writeln('Arguments:', grunt.log.wordlist(args));
        grunt.log.writeln();

        var cp = fork(__dirname + '/lib/grunt', args, {
          silent: true
        });
        cp.stdout.pipe(grunt.log.options.outStream, {end: false});
        cp.on('message', function (msg) {
          if (msg.fail === 'fatal') {
            err = msg.error;
            grunt.fail.warn(errorFromObject(msg.error), msg.errcode);
          } else if (msg.fail === 'warn') {
            grunt.fail.warn(errorFromObject(msg.error), msg.errcode);
          }
        });
        cp.on('error', function (e) {
          err = e;
          done(err);
        });
        cp.on('close', function (code) {
          grunt.log.writeln();
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
