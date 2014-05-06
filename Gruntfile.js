module.exports = function(grunt) {

  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    meta: {
      file: 'main',
      banner: '/* <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy/m/d") %>\n' + '   <%= pkg.homepage %>\n' + '   Copyright (c) <%= grunt.template.today("yyyy/m/d") %> <%= pkg.author.name %> */\n'
    },

    uglify: {
      options: {
        compress: {
          global_defs: {
            DEBUG: false,
            DEVMODE: true,
          },
          dead_code: true,
          drop_console: true,
          hoist_funs: false,
          loops: false,
          unused: false
        },
        mangle: true,
        preserveComments: false,
        report: "min",
        banner: "<%= meta.banner %>",
        sourceMap: "small.min.map",
        sourceMappingURL: "small.min.map",
        beautify: {
          ascii_only: true
        }
      },
      build: {
        files: {
          'small.min.js': 'small-<%= pkg.version %>.js'
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', [
    'uglify:build'
  ]);
};