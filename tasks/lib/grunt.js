var fs = require('fs');
var path = require('path');
var grunt = require('grunt');

/* needed args: base, submodule, gruntfile, tasks */
var base = path.resolve(process.argv[2]);
var submodule = path.resolve(process.argv[3]);
var gruntfile = path.join(submodule, process.argv[4]);
var tasks = process.argv.slice(5);

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


grunt.fail.fatal = function(e, errcode) {
  process.send({
    fail: 'fatal',
    error: errorToObject(e),
    errcode: errcode
  });
  grunt.util.exit(typeof errcode === 'number' ? errcode : fail.code.FATAL_ERROR);
};

grunt.fail.warn = function(e, errcode) {
  process.send({
    fail: 'warn',
    error: errorToObject(e),
    errcode: errcode
  });
};

function uncaughtHandler(err) {
  grunt.fail.fatal(err, grunt.fail.code.TASK_FAILURE);
}

grunt.loadTasks = grunt.task.loadTasks = loadTasks.bind(grunt.task, grunt.task.loadTasks);
grunt.loadNpmTasks = grunt.task.loadNpmTasks = loadNpmTasks.bind(grunt.task, grunt.task.loadNpmTasks);

process.chdir(base);
process.on('uncaughtException', uncaughtHandler);
grunt.task.init(tasks);
grunt.task.options({
  error: function (err) {
    grunt.fail.warn(err, grunt.fail.code.TASK_FAILURE);
  },
  done: function () {
    process.removeListener('uncaughtException', uncaughtHandler);
  }
});
require(path.resolve(submodule, gruntfile))(grunt);
tasks.forEach(function (task) {
  grunt.task.run(task);
});
process.chdir(submodule);
grunt.task.start({asyncDone: true});
