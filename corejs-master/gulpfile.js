const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const htmlmin = require('gulp-htmlmin');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const eslint = require('gulp-eslint');
const size = require('gulp-size');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const gulpIf = require('gulp-if');
const del = require('del');
const runSequence = require('run-sequence');

gulp.task('lint', () => {
    return gulp.src('js/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
// .pipe(gulp.dest('src/scripts')); if fix:true is sent to eslint, results will go back in here.
});

function concatAndMinify(glob, dest, fileName, minify, beforeConcat) {
    return gulp.src(glob)
        .pipe(gulpIf(beforeConcat !== undefined,(beforeConcat !== undefined ? beforeConcat : ()=>{})))
        .pipe(concat(fileName))
        .pipe(gulp.dest(dest))
        .pipe(minify)
        .pipe(rename((path) => {
            path.extname = '.min' + path.extname;
        }))
        .pipe(gulp.dest(dest));
}

gulp.task('styles', () => {
    let distDir = 'dist/css';
    concatAndMinify(['css/bootstrap_cot_customizations.css', 'css/cot_app.css'],
        distDir,
        'cot_app.css',
        cssnano({safe: true}),
        autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']})
    )

    //unavailable for use with bower: http://formvalidation.io/
    gulp.src('css/formValidation.min.css')
        .pipe(gulp.dest(distDir));

    //see note on this sadness below
    return gulp.src(['css/bootstrap-multiselect.css'])
        .pipe(gulp.dest('dist/css'));

});

gulp.task('scripts', () => {
    let distDir = 'dist/js';
    concatAndMinify(['js/cot_bower_enabled.js','js/bootstrap_cot_customizations.js','js/cot_app.js'],
        distDir,
        'cot_app.js',
        uglify()
    )

    //unavailable for use with bower: https://github.com/jawj/OverlappingMarkerSpiderfier
    gulp.src('js/oms.min.js')
        .pipe(gulp.dest('dist/js'));

    //unavailable for use with bower: http://formvalidation.io/
    gulp.src(['js/formValidation.min.js','js/framework/bootstrap.min.js'])
        .pipe(concat('formValidation.min.js'))
        .pipe(gulp.dest('dist/js'));

    //TODO: this file should really be pulled in with bower BUT:
    //the version currently in use is ahead of the latest github release 0.9.13
    //so either we use an old release, which could break code,
    //OR we use the master branch, which could also break code (since it we aren't specifying a specific version)
    //OR we stick with this specific file, in our repo.
    concatAndMinify('js/bootstrap-multiselect.js',
        distDir,
        'bootstrap-multiselect.js',
        uglify()
    );

    concatAndMinify('js/cot_login.js',
        distDir,
        'cot_login.js',
        uglify()
    );

    concatAndMinify('js/cot_backbone.js',
        distDir,
        'cot_backbone.js',
        uglify()
    );

    concatAndMinify(['js/webtrends/webtrendsload.js', 'js/webtrends/webtrends.js'],
        distDir,
        'webtrends.js',
        uglify()
    );

    gulp.src('js/webtrends/keys/*.js')
        .pipe(gulp.dest('dist/js/webtrends_keys'));

    return concatAndMinify('js/cot_forms.js',
        distDir,
        'cot_forms.js',
        uglify()
    );
});

gulp.task('html', () => {
    return gulp.src('html/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist/html'));
});

gulp.task('clear_cache', (done) => {
    return cache.clearAll(done);
});

gulp.task('images', () => {
    return gulp.src('img/**/*')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/img'));
});

//use these from the CLI:
gulp.task('clean', () => {
    del.sync(['dist']);
});
gulp.task('build', ['html', 'styles', 'scripts', 'images'], () => {
    return gulp.src('dist/**/*').pipe(size({title: 'build', gzip: true}));
});
gulp.task('default', () => {
    return new Promise(resolve => {
        runSequence(['clean'], 'build', resolve);
    });
});

//a task to scaffold a new core app project that uses npm, bower, gulp, etc. And loads the core with bower
//example usage:
//gulp scaffold -dir /Library/WebServer/Documents/cot/new_project #on a mac
//gulp scaffold -dir c:\path\to\app_name #on windows

gulp.task('scaffold', () => {
  let dirIndex = process.argv.indexOf('-dir');
  if (dirIndex == -1 || dirIndex + 1 > process.argv.length - 1) {
    throw new Error('You missed the -dir option. Use gulp scaffold -dir /path/name');
  }
  let dir = process.argv[dirIndex + 1];
  return gulp.src([
    'scaffold/**/*'
  ], {dot: true})
    .pipe(rename((p) => {
      if (p.basename.indexOf('sample_') != -1) {
        p.basename = p.basename.split('sample_').join('');
      }
    }))
    .pipe(gulp.dest(dir));
});
