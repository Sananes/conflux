var gulp 		= require('gulp');
	pug 		= require('gulp-pug'),
	sass 		= require('gulp-sass'),
	prettUrl	= require('gulp-pretty-url'),
	sourcemaps	= require('gulp-sourcemaps'),
	rev	= require('gulp-rev'),
	revReplace = require('gulp-rev-replace'),
	collect = require('gulp-rev-collector'),
	revdel = require('rev-del'),
	image = require('gulp-image'),
	browserify 	= require('browserify'),
	source		= require('vinyl-source-stream'),
	buffer		= require('vinyl-buffer'),
	sourcemaps 	= require('gulp-sourcemaps'),
	sass 		= require('gulp-sass'),
	cssImageDimensions = require("gulp-css-image-dimensions");
	uglify 		= require('gulp-uglify'),
	del			= require('del'),
	browserSync = require('browser-sync'),
  neat = require('node-neat').includePaths;
	reload      = browserSync.reload;


gulp.task('templates', function() {
	return gulp.src('./src/views/pages/**/*.pug')
	.pipe(pug({
		basedir: './src/views/',
		pretty: true,
		locals:{}
	}))
	.pipe(prettUrl())
	.pipe(gulp.dest('build/'));
});

gulp.task('images', function () {
  gulp.src('./src/images/**/*')
    .pipe(gulp.dest('build/images/'));
});

gulp.task('images-dist', function () {
  gulp.src('./src/images/**/*')
    .pipe(image())
    .pipe(gulp.dest('build/images/'));
});
gulp.task('sass-dist', function() {
	gulp.src('src/sass/**/*.scss')
	.pipe(sourcemaps.init({loadMaps:true}))
	.pipe(sass({includePaths: ['sass-dev'].concat(neat)},{outputStyle: 'compressed'}).on('error', sass.logError))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('build/css/'))
});

gulp.task('sass-dev', function() {
	gulp.src('src/sass/**/*.scss')
		.pipe(sourcemaps.init({loadMaps:true}))
		.pipe(sass({includePaths: ['sass-dev'].concat(neat)}).on('error', sass.logError))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('build/css/'))
		.pipe(browserSync.stream());
});

gulp.task('scripts-dist', function() {
	return browserify({ entries: ['src/scripts/main.js'], debug:true })
		.bundle()
		.pipe(source('bundled.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps:true}))
		.pipe(uglify({
			// preserveComments:'all'
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('build/js/'))
});

gulp.task('scripts-dev', function() {
	return browserify({ entries: ['src/scripts/main.js'], debug:true })
		.bundle()
		.pipe(source('bundled.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps:true}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('build/js/'))
});

gulp.task('clean', function(){
	return del(['build/**/*']);
});

gulp.task('watch', ['templates', 'sass-dev', 'scripts-dev', 'images'], function(){
	gulp.watch('src/views/**/*', ['templates']);
	gulp.watch('src/sass/**/*', ['sass-dev']);
	gulp.watch('src/scripts/**/*', ['scripts-dev']);
	gulp.watch('src/images/**/*', ['images']);
});


gulp.task('build', ['clean'], function(){
	gulp.start('templates');
	gulp.start('sass-dist');
	gulp.start('scripts-dist');
	gulp.start('images-dist');
});


// Static server
gulp.task('serve', ['watch'], function() {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });

	gulp.watch("build/**/*.html").on("change", reload);
});
