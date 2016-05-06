
module.exports = function(grunt) {

    var libs = [
        'src/matter-0.8.0.js'
    ];

    var files = [
        'src/GameParams.js', 
        'src/SharedUtils.js', 
        'src/SendMessage.js', 
        'src/LevelModel.js',
        'src/ShitCast.js',
        'src/simulation/timeline/InstantTimeline.js',
        'src/simulation/timeline/StreamTimeline.js',
        'src/simulation/InstantAction.js',
        'src/simulation/StreamAction.js',
        'src/simulation/Physics.js',
        'src/simulation/Simulation.js'
    ];

    //noinspection JSUnresolvedFunction
    grunt.initConfig({
        jshint: {
            files: files
        },
        uglify: {
            options: {
                banner: "/* SHARED LOGIC GENERATED (<%= grunt.template.today('dd-mm-yyyy') %>) */\n",
                beautify: true,
                mangle: false
            },
            build: {
                files: {
                    '../server/src/shared.gen.js': libs.concat(files),
                    '../client/src/js/shared.gen.js': libs.concat(files)
                }
            }
        },
        watch: {
            scripts: {
                files: files.concat(libs).concat('gruntfile.js'),
                tasks: ['uglify', 'jshint'],
                options: {
                    reload: true,
                    spawn: false,
                    atBegin: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', 'watch');
};