module.exports = function(grunt) {
  var uglifyCompressOptions = {
    global_defs: {
      DEBUG: false,
      DEVMODE: true,
    },
    dead_code: true
  };
  var uglifyCompressOptionsProc = {
    global_defs: {
      DEBUG: false,
      DEVMODE: false,
    },
    dead_code: true
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    meta: {
      file: 'main',
      banner: '/* <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy/m/d") %>\n'
            + '   <%= pkg.homepage %>\n'
            + '   Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> */\n'
    },

    clean: {
      options: {
        force: true
      },
      build: ["build/*"]
    },

    uglify: {
      options: {
        compress: uglifyCompressOptions,
        mangle: true,
        preserveComments: false,
        report: "min",
        banner: "<%= meta.banner %>"
      },
      build: {
        files: [
        // {
        //   "build/main.js": ["small-2.0.0.js"]
        // }, 
        {
          expand: true,
          src: ["!node_modules/**", "*.js",'!Gruntfile.js'],
          dest: "build/"
        }]
      },
      proc: {
        options: {
          compress: uglifyCompressOptionsProc
        },
        files: [{
          "build/main.js": ["main.js", "init.js", "js/*.js", "!**/*.debug.js"]
        }, {
          expand: true,
          src: ["**/*.js", "!node_modules/**", "!*.js", "!360/**", "!chart/**"],
          dest: "build/"
        }]
      }
    },

    stylus: {
      build: {
        files: [{
          src: ["**/*.styl", "!node_modules/**"],
          ext: ".css",
          expand: true
        }]
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: 0,
        report: 'min'
      },
      build: {
        files: [{
          expand: true,
          src: ["**/*.css", "!node_modules/**", "!360/**", "!chart/**"],
          dest: "build/"
        }]
      }
    },

    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        removeOptionalTags: true,
      },
      build: {
        files: [{
          expand: true,
          src: [
            "**/*.html",
            "!node_modules/**",
            "!360/**",
            "!chart/**",
            "!build/**"
          ],
          dest: "build/"
        }]
      }
    },

    htmlparse: {
      build: {
        files: [{src: "build/**/*.html", expand: true}]
      },
      proc: {
        files: [{src: "build/**/*.html", expand: true}]
      }
    },

    imagemin: {
      build: {
        files: [{
          src: [
            "**/*.jpg",
            "**/*.png",
            // "**/*.gif",
            "zhonghai/**/*.jpg",
            "zhonghai/**/*.png",
            "!node_modules/**",
            "!build/**",
            "!360/**",
            "!chart/**"
          ],
          dest: "build/",
          expand: true
        }]
      }
    },

    copy: {
      build: {
        files: [
          {src: [
            '**/*.gif', 
            '**/*.mp3', 
            '**/*.eot', 
            '**/*.svg', 
            '**/*.ttf', 
            '**/*.woff', 
            '!node_modules/**'
            ], dest: 'build/', expand: true},
          {src: ['360/**'], dest: 'build/', expand: true},
          {src: ['chart/**'], dest: 'build/', expand: true},
        ]
      },
      orig: {
        files: [
            {src: ['build/*.html'], ext: '.orig.html', expand: true},
            {src: ['build/main.js'], ext: '.orig.js', expand: true},
            {src: ['build/chart/*.html'], ext: '.orig.html', expand: true},
        ]
      }
    },

    compress: {
      options: {
        mode: "gzip",
        level: 9,
        pretty: true
      },
      build: {
        files: [
          {src: "build/*.js", expand: true},
          {src: "build/*.css", expand: true},
          {src: ["build/*.html", "!build/*.orig.html"], expand: true}
        ]
      }
    },

    // rsync: {
    //   options: {
    //     args: ['-ltDvz'],
    //     // exclude: ['.git*', 'node_modules'],
    //     recursive: true,
    //     compareMode: 'checksum',
    //     src: 'build/'
    //   },
    //   proc: {
    //     options: {
    //       dest: '/var/www/htdocs/',
    //       exclude: ['book'],
    //       host: '',
    //       // syncDestIgnoreExcl: true
    //     }
    //   },
    //   dev: {
    //     options: {
    //       dest: '/var/www/htdocs/',
    //       host: '',
    //       // syncDestIgnoreExcl: true
    //     }
    //   }
    // }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-rsync');

  grunt.registerMultiTask('htmlparse', 'parse html files', function(name) {
    var fs = require('fs');
    var UglifyJS = require('uglify-js');
    var config = grunt.config.get();
    var compressOptions = this.target == 'proc' ? uglifyCompressOptionsProc
                                                : uglifyCompressOptions;
    this.files.forEach(function(file) {
      var src = file.src[0];
      var content = fs.readFileSync(src, 'utf8');

      // SEO
      // content = content.replace(/<title>/,
      //                             '<meta name="apple-itunes-app" content="app-id=580446011">'
      //                           + '<meta name="keywords" content="电影摇摇,电影票,电影,在线选座,电子券,团购,移动应用,LBS,地理位置">'
      //                           + '<meta name="description" content="电影摇摇是一款基于地理位置的移动生活应用，摇一摇，推荐一部近在咫尺又符合个人喜好的电影，实时查看影院放映排期，支持在线选座、电子券、团购等。更多功能，等待您的发现…">'
      //                           + '<title>'
      //                           );

      content = content.replace(/<script>([\s\S]*?)<\/script>/ig, function(all, js) {
        return '<script>' + UglifyJS.minify(js, {
          fromString: true,
          mangle: true,
          compress: compressOptions
        }).code + '</script>';
      });

      // content = content.replace(/<html>/i, function() {
      //     return shouldCache(src) ? '<html manifest="cache.manifest">'
      //                             : '<html>';
      // });

      fs.writeFileSync(file.dest, content);

      grunt.log.writeln("File", file.dest, "processed.");
    });
  });

  grunt.registerTask('build:dev', [
      'clean:build',
      'uglify:build',
      'stylus:build',
      'copy:build',
      'cssmin:build',
      'htmlmin:build',
      'htmlparse:build',
      'imagemin:build',
      'compress:build'
  ]);

  grunt.registerTask('build:proc', [
      'clean:build',
      'uglify:proc',
      'stylus:build',
      'copy:build',
      'cssmin:build',
      'htmlmin:build',
      'htmlparse:proc',
      'imagemin:build',
      'copy:orig',
      'compress:build'
  ]);

  grunt.registerTask('deploy:proc', ['rsync:proc']);
  grunt.registerTask('deploy:dev', ['rsync:dev']);

  grunt.registerTask('proc', ['build:proc', 'deploy:proc']);
  grunt.registerTask('default', ['build:dev', 'deploy:dev']);
};

// function shouldCache(file) {
//   var exceptions = [
//     "build/movie-desc.html",
//     "build/movie-desc.css"
//   ];
//   return exceptions.indexOf(file) < 0;
// }

