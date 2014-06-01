/**
 * grunt-submodule – copyright © 2014, Jonas Pommerening
 * Released under the MIT license.
 * https://github.com/jpommerening/grunt-submodule.git
 */
var expect = require('expect.js');
var grunt = require('grunt');
var runTask = require('grunt-run-task');
var markdownBdd = require('markdown-bdd');

describe('the “submodule” task', function () {
  'use strict';

  runTask.loadTasks('tasks');

  describe('with default options', function() {
    var task = runTask.task('submodule');

    beforeEach(function (done) {
      this.timeout(5000);
      task.run(done);
    });
    afterEach(task.clean());

    it('works', function() {
      expect(grunt.file.read('test/fixtures/test1/tmp/test1')).to.equal('test1');
      expect(grunt.file.exists('test/fixtures/test1/tmp/test2')).to.be(false);
      expect(grunt.file.read('test/fixtures/test2/tmp/test1')).to.equal('test1');
      expect(grunt.file.exists('test/fixtures/test2/tmp/test2')).to.be(false);
    });

  });

  describe('Usage Examples', function () {
    describe.example = markdownBdd(__dirname + '/../README.md', 'Usage Examples', {
      grunt: runTask,
      __filename: __dirname + '/Gruntfile.js'
    });

    describe.example('Default Options', function () {
      var task = runTask.task('submodule');
      var events = [];
      task.on('submodule-test', events.push.bind(events));

      before(task.run());
      after(task.clean());

      it('runs the default task in each submodule', function () {
      });

      it('uses the submodule’s Gruntfiles', function () {
      });

      it('uses the submodule’s directory as base directory', function () {
      });
    });

    describe.example('Custom Options', function () {
      var task = runTask.task('submodule');
      var events = [];
      task.on('submodule-test', events.push.bind(events));

      before(task.run());
      after(task.clean());

      it('runs the “build” and “test” tasks in each submodule', function () {
        expect(events.length).to.equal(4);
        expect(events[0].task).to.equal('build');
        expect(events[1].task).to.equal('test');
        expect(events[2].task).to.equal('build');
        expect(events[3].task).to.equal('test');
      });

      it('uses the main repository’s Gruntfile', function () {
        var gruntfile = __dirname + '/Gruntfile.js';
        expect(events[0].gruntfile).to.equal(gruntfile)
        expect(events[1].gruntfile).to.equal(gruntfile)
        expect(events[2].gruntfile).to.equal(gruntfile)
        expect(events[3].gruntfile).to.equal(gruntfile)
      });

      it('uses the submodule’s directory as base directory', function () {
        var test1 = __dirname + '/fixtures/test1';
        var test2 = __dirname + '/fixtures/test2';
        expect(events[0].base).to.equal(test1);
        expect(events[1].base).to.equal(test1);
        expect(events[2].base).to.equal(test2);
        expect(events[3].base).to.equal(test2);
      });
    });

  });

});
