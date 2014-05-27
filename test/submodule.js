/**
 * grunt-submodule – copyright © 2014, Jonas Pommerening
 * Released under the MIT license.
 * https://github.com/jpommerening/grunt-submodule.git
 */
var expect = require('expect.js');
var grunt = require('grunt');
var runTask = require('grunt-run-task');

describe('the submodule task', function () {
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

});
