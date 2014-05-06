module.exports = function(grunt) {
  var uglifyCompressOptions = {
    global_defs: {
      DEBUG: false,
      DEVMODE: true,
    },
    dead_code: true,
    drop_console: true
  };
  var uglifyCompressOptionsProc = {
    global_defs: {
      DEBUG: false,
      DEVMODE: false,
    },
    dead_code: true
  };

  var versions = ['1.0.0','2.0.0'];

  var files = {};

  versions.forEach(function(item){
    files['small-'+item+'.min.js'] = 'small-'+item+'.js'
  });

    grunt.initConfig({
      pkg: grunt.file.readJSON("package.json"),
      meta: {
        file: 'main',
        banner: '/* <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy/m/d") %>\n' + '   <%= pkg.homepage %>\n' + '   Copyright (c) <%= grunt.template.today("yyyy/m/d") %> <%= pkg.author.name %> */\n'
      },

      uglify: {
        options: {
          compress: uglifyCompressOptions,
          mangle: true,
          preserveComments: false,
          report: "min",
          banner: "<%= meta.banner %>",
        },
        build: {
          files: files
        },
      },
    });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', [
    'uglify:build'
  ]);
};