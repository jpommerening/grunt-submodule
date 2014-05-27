# grunt-submodule

> Run Grunt across Git submodules.

`grunt-submodule` provides a Grunt task to run Grunt in a project's
submodules. You can use the submodule's Gruntfile and `node_modules` or keep
both outside the submodule.

```console
$ grunt submodule:deps/*:build
        └─1─────┘ └─2──┘ └─3─┘

  1) this task
  2) submodule pattern
  3) grunt task to run there
```


## Getting Started

This plugin requires Grunt (d'uh). You probably have used [Grunt][] before,
but just in case you're wondering what this is all about, have a look at the
[Getting Started][] guide.

To use this plugin, you first need to install it and add it to your Gruntfile:

```console
$ npm install grunt-submodule --save-dev
```

```js
grunt.loadNpmTasks('grunt-submodule');
```

## The "submodule" task

The `submodule` task tries to mimic the behavior of [multi-tasks][] – tasks
that can have multiple configurations, defined using arbitrarily named
"targets." Each submodule behaves like a target but it can be used without any
explicit configuration.

### Overview

In your project's Gruntfile, add a section named `submodule` to the data
object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  submodule: {
    options: {
      // Task-specific options go here.
    },
    '**/*_test': {
      // Submodule-specific file lists and/or options go here.
      options: {
      }
    }
  }
})
```

### Options

#### options.gruntfile
Type: `String`  
Default value: `Gruntfile.js`

The Gruntfile to use. This is relative to the submodule path, so if you want
to share the same Gruntfile with multiple submodules, just use an absolute
path.

#### options.base
Type: `String`  
Default value: `'.'`

The base directory to load Grunt tasks from if they do not exist in the
submodule. If the submodule has its own `node_modules` or `tasks` directories
these will take precedence over the ones inside the base directory.

#### option.tasks
Type: `Array`  
Default value: `[ 'default' ]`

The tasks to run if no tasks were given on the command line.

### Usage Examples

#### Default Options
In this example, the task will just enter each `submodule`, run Grunt with the
default task and exit.

```js
grunt.initConfig({
  submodule: {
    options: {}
  }
});
```

#### Custom Options
Here we use a shared Gruntfile for all submodules and run the `build` and `test`
tasks in each of them.

```js
grunt.initConfig({
  submodule: {
    options: {
      gruntfile: __dirname + '/Gruntfile.shared.js',
      tasks: [ 'build', 'test' ]
    }
  }
});
```

#### Submodule-Specific Options
It is possible to override the global options for each submodule. You can
either specify options fora specific submodule or use a pattern to configure
multiple submodules at once.

```js
grunt.initConfig({
  submodule: {
    options: {
      tasks: [ 'build' ]
    },
    'deps/*': {
      options: {
        tasks: [ 'build', 'test' ]
      }
    },
    'deps/grunt-submodule': {
      options: {
        tasks: [ 'test', 'jshint' ]
      }
    }
  }
});
```

[Grunt]: http://gruntjs.com "Grunt – The JavaScript Task Runner"
[Getting Started]: http://gruntjs.com "Grunt – Getting Started"
[Multi-Tasks]: http://gruntjs.com/configuring-tasks#task-configuration-and-targets

## Contributing

Just [fork the repository](https://github.com/jpommerening/grunt-submodule.git),
send me a pull request and we'll work out the rest together, Ok?

## Release History
_(Nothing yet)_

## [License](LICENSE-MIT)

Copyright © 2014 Jonas Pommerening

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
