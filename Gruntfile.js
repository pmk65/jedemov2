'use strict'

module.exports = function (grunt) {
  grunt.initConfig({
    'string-replace': {
      version: {
        files: {
          'dist/': ['dist/css/*.css', 'dist/js/*.js']
        },
        options: {
          replacements: [{
            pattern: /{{ VERSION }}/g,
            replacement: '<%= pkg.version %>'
          }]
        }
      }
    },
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        sourceMap: true
      },
      dist: {
        dest: 'dist/js/jsoneditor_demo.js',
        src: ['src/js/*.js']
      }
    },
    uglify: {
      dist: {
        src: 'dist/js/jsoneditor_demo.js',
        dest: 'dist/js/jsoneditor_demo.min.js'
      },
      options: {
        preserveComments: function (node, comment) {
          return /^!|@preserve|@license|@cc_on/i.test(comment.value)
        },
        sourceMap: true
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      combine: {
        files: {
          'dist/css/jsoneditor_demo.min.css': ['src/css/*.css']
        }
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {expand: true, cwd: 'src/', src: ['*.html', 'examples/**/*.*'], dest: 'dist/', filter: 'isFile'}
        ]
      }
    },
    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['concat']
      },
      css: {
        files: ['src/**/*.css'],
        tasks: ['cssmin']
      },
      html: {
        files: ['src/**/*.html'],
        tasks: ['copy']
      }
    },
    jshint: {
      options: {
        browser: true,
        indent: 2,
        devel: true,
        nonbsp: true,
        nonew: true,
        immed: true,
        asi : true,
        latedef: true,
        globals: {
          'module': true,
          'define': true
        }
      },
      beforeconcat: ['src/js/*.js'],
      afterconcat: {
        options: {
          undef: true
        },
        files: {
          src: ['dist/js/jsoneditor_demo.js']
        }
      }
    }
  })

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-string-replace')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-copy')

  // Default task.
  grunt.registerTask('default', ['jshint:beforeconcat', 'concat', 'jshint:afterconcat', 'uglify', 'cssmin', 'copy'])

  grunt.registerTask('rawbuild', ['concat', 'uglify', 'cssmin', 'copy'])
}
