/**
 * grunt-submodule – copyright © 2014, Jonas Pommerening
 * Released under the MIT license.
 * https://github.com/jpommerening/grunt-submodule.git
 */
'use strict';

var fs = require('fs');
var path = require('path');
var grunt = require('grunt');

if (process.argv.length < 5) {
  console.error('Usage: node ' + __filename + ' <base> <submodule> <gruntfile> [tasks...]');
  process.exit(1);
}

/* needed args: base, submodule, gruntfile, tasks */
var base = path.resolve(process.argv[2]);
var submodule = path.resolve(process.argv[3]);
var gruntfile = path.resolve(submodule, process.argv[4]);
var args = process.argv.slice(5);
var tasks = [];
var options = {};
args.forEach(function (arg) {
  var option = /^--(no-)?([^=]+)(=.+)?$/.exec(arg);
  if (!option) {
    tasks.push(arg);
  } else if (option[1]) {
    options[option[2]] = false;
  } else if (option[3]) {
    options[option[2]] = option[3].substr(1);
  } else {
    options[option[2]] = true;
  }
});

function loadTasks(orig, directory) {
  [
    path.join(submodule, directory),
    path.join(base, directory)
  ].forEach(function (directory) {
    if (grunt.file.exists(directory)) {
      orig(directory);
    }
  });
}

function loadNpmTasks(orig, module) {
  [
    submodule,
    base
  ].forEach(function (directory) {
    if (grunt.file.exists(path.join(directory, 'node_modules', module))) {
      var cwd = process.cwd();
      process.chdir(directory);
      orig(module);
      process.chdir(cwd);
    }
  });
}

function errorToObject(e) {
  var message = typeof e === 'string' ? e : e.message;
  return {
    message: message,
    stack: e.stack
  };
}

grunt.event.onAny(function () {
  process.send({
    event: this.event,
    arguments: [].slice.apply(arguments)
  });
});

grunt.fail.fatal = function (e, errcode) {
  process.send({
    fail: 'fatal',
    error: errorToObject(e),
    errcode: errcode
  });
  grunt.task.clearQueue();
  grunt.util.exit(typeof errcode === 'number' ? errcode : grunt.fail.code.FATAL_ERROR);
};

grunt.fail.warn = function (e, errcode) {
  process.send({
    fail: 'warn',
    error: errorToObject(e),
    errcode: errcode
  });
  grunt.task.clearQueue();
};

function uncaughtHandler(err) {
  grunt.fail.fatal(err, grunt.fail.code.TASK_FAILURE);
}

grunt.loadTasks = grunt.task.loadTasks = loadTasks.bind(grunt.task, grunt.task.loadTasks);
grunt.loadNpmTasks = grunt.task.loadNpmTasks = loadNpmTasks.bind(grunt.task, grunt.task.loadNpmTasks);

process.on('uncaughtException', uncaughtHandler);
grunt.option.init(options);
grunt.task.init(tasks);
grunt.task.options({
  error: function (err) {
    grunt.fail.warn(err, grunt.fail.code.TASK_FAILURE);
    process.disconnect();
  },
  done: function () {
    process.removeListener('uncaughtException', uncaughtHandler);
    process.disconnect();
    grunt.util.exit(0);
  }
});

process.chdir(submodule);

if (grunt.file.exists(gruntfile)) {
  require(gruntfile)(grunt);
} else {
  grunt.fail.fatal(new Error('Gruntfile ' + gruntfile + ' does not exist!'));
}
tasks.forEach(function (task) {
  grunt.task.run(task);
});
grunt.task.start({asyncDone: true});
