/**
 * grunt-submodule – copyright © 2014, Jonas Pommerening
 * Released under the MIT license.
 * https://github.com/jpommerening/grunt-submodule.git
 */
var expect = require('expect.js');
var runTask = require('grunt-run-task');
var markdownBdd = require('markdown-bdd');

describe('the “submodule” task', function () {
  'use strict';

  var test1 = __dirname + '/fixtures/test1';
  var test2 = __dirname + '/fixtures/test2';

  describe('with default options', function() {
    var task = runTask.task('submodule');

    beforeEach(function (done) {
      // starting up grunt each time takes longer than expected ...
      this.timeout(5000);
      task.run(done);
    });
    afterEach(task.clean());

    it('works');
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

      before(function (done) {
        this.timeout(5000);
        task.run(done);
      });
      after(task.clean());

      it('runs the default task in each submodule', function () {
        expect(events.length).to.equal(6);
        expect(events[0].name).to.equal('build');
        expect(events[1].name).to.equal('build');
        expect(events[2].name).to.equal('test');
        expect(events[3].name).to.equal('build');
        expect(events[4].name).to.equal('build');
        expect(events[5].name).to.equal('test');
      });

      it('uses the submodule’s Gruntfiles', function () {
        expect(events[0].gruntfile).to.equal(test1 + '/Gruntfile.js');
        expect(events[1].gruntfile).to.equal(test1 + '/Gruntfile.js');
        expect(events[2].gruntfile).to.equal(test1 + '/Gruntfile.js');
        expect(events[3].gruntfile).to.equal(test2 + '/Gruntfile.js');
        expect(events[4].gruntfile).to.equal(test2 + '/Gruntfile.js');
        expect(events[5].gruntfile).to.equal(test2 + '/Gruntfile.js');
      });

      it('uses the submodule’s directory as base directory', function () {
        expect(events[0].base).to.equal(test1);
        expect(events[1].base).to.equal(test1);
        expect(events[2].base).to.equal(test1);
        expect(events[3].base).to.equal(test2);
        expect(events[4].base).to.equal(test2);
        expect(events[5].base).to.equal(test2);
      });
    });

    describe.example('Custom Options', function () {
      var task = runTask.task('submodule');
      var events = [];
      task.on('submodule-test', events.push.bind(events));

      before(function (done) {
        this.timeout(5000);
        task.run(done);
      });
      after(task.clean());

      it('runs the “build” and “test” tasks in each submodule', function () {
        expect(events.length).to.equal(4);
        expect(events[0].name).to.equal('build');
        expect(events[1].name).to.equal('test');
        expect(events[2].name).to.equal('build');
        expect(events[3].name).to.equal('test');
      });

      it('uses the main repository’s Gruntfile', function () {
        var gruntfile = __dirname + '/Gruntfile.js';
        expect(events[0].gruntfile).to.equal(gruntfile);
        expect(events[1].gruntfile).to.equal(gruntfile);
        expect(events[2].gruntfile).to.equal(gruntfile);
        expect(events[3].gruntfile).to.equal(gruntfile);
      });

      it('uses the submodule’s directory as base directory', function () {
        expect(events[0].base).to.equal(test1);
        expect(events[1].base).to.equal(test1);
        expect(events[2].base).to.equal(test2);
        expect(events[3].base).to.equal(test2);
      });
    });

    describe.example('Submodule-Specific Options', function () {
      var task = runTask.task('submodule');
      var events = [];
      task.on('submodule-test', events.push.bind(events));

      before(function (done) {
        this.timeout(5000);
        task.run(done);
      });
      after(task.clean());

      it('runs the “build” and “test” tasks in the first submodule', function () {
        expect(events.length >= 3).to.be.ok();
        expect(events[0].name).to.equal('build');
        expect(events[1].name).to.equal('build');
        expect(events[2].name).to.equal('test');
      });

      it('runs the “test” task in the second submodule', function () {
        expect(events.length).to.equal(4);
        expect(events[3].name).to.equal('test');
      });

      it('uses the submodule’s Gruntfiles', function () {
        expect(events[0].gruntfile).to.equal(test1 + '/Gruntfile.js');
        expect(events[1].gruntfile).to.equal(test1 + '/Gruntfile.js');
        expect(events[2].gruntfile).to.equal(test1 + '/Gruntfile.js');
        expect(events[3].gruntfile).to.equal(test2 + '/Gruntfile.js');
      });

      it('uses the submodule’s directory as base directory', function () {
        expect(events[0].base).to.equal(test1);
        expect(events[1].base).to.equal(test1);
        expect(events[2].base).to.equal(test1);
        expect(events[3].base).to.equal(test2);
      });
    });

    describe.example('Filtering Submodules', function () {
      var task = runTask.task('submodule');
      var events = [];
      task.on('submodule-test', events.push.bind(events));

      before(function (done) {
        this.timeout(5000);
        task.run(done);
      });
      after(task.clean());

      it('runs the “build” and “test” tasks in the first submodule', function () {
        expect(events.length >= 3).to.be.ok();
        expect(events[0].name).to.equal('build');
        expect(events[1].name).to.equal('build');
        expect(events[2].name).to.equal('test');
      });

      it('does not run any tasks in the second submodule', function () {
        expect(events.length).to.equal(3);
      });

      it('uses the submodule’s Gruntfiles', function () {
        expect(events[0].gruntfile).to.equal(test1 + '/Gruntfile.js');
        expect(events[1].gruntfile).to.equal(test1 + '/Gruntfile.js');
        expect(events[2].gruntfile).to.equal(test1 + '/Gruntfile.js');
      });

      it('uses the submodule’s directory as base directory', function () {
        expect(events[0].base).to.equal(test1);
        expect(events[1].base).to.equal(test1);
        expect(events[2].base).to.equal(test1);
      });
    });

  });

});
