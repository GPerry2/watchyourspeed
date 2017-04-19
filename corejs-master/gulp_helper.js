/*
 Usage:
 #1 Add this to the top of your gulpfile:
 const coreGulpHelper = require('./bower_components/core/gulp_helper');

 #2 Make sure you have gulp and gulp-inject installed in your node package file.

 #3 Add the following lines in the <head> tag of any HTML files that need to load the core:
 <!-- insert html5shiv libs -->
 <!--[if lt IE 9]>
 <!-- shiv:js -->
 <!-- endinject -->
 <![endif]-->

 <!-- insert core javascript libraries -->
 <!-- core:js -->
 <!-- endinject -->

 <!-- insert core css libraries -->
 <!-- core:css -->
 <!-- endinject -->
 <!-- core_print:css -->
 <!-- endinject -->

 #3 Somewhere in a gulp task, call the inject method below to insert the script and link tags into your html files
 */
module.exports = {
    inject: (gulp, inject, stream, options) => {
        //gulp is your gulp object
        //inject is your gulp-inject object
        //stream is the result of a call to gulp.src
        //options is an object to specify what to inject:
        /*
         {
         "includeFormValidation": true, //include formValidation stuff
         "includeEditableSelect": true, //include editableSelect control
         "includePlaceholders": true, //include placeholders shim
         "includeMultiSelect": true, //include multiselect control
         "includeOMS": true, //inlude OMS map multi-marker
         "includeFullCalendar": true, //include full page calendar stuff
         "includeDatePicker": true, //include date picker control
         "includeLogin": true, //include cot login stuff
         "includeRangePicker": true, //include date range picker control
         "includeMoment": true, //include momentjs library
         "includeModeling": true, //include backbonejs stuff
         "includeWebtrends": true, //include webtrends stuff, combine with "environment" to get the right key injected
         "includeBootbox": true, //include bootbox alert control
         "environment": '' //what is the deployment environment? String, default is dev, can be one of: external, internal, qa, dev
                           //this determines which webtrends dcsid key is injected.
         }
         */
        //example: coreGulpHelper.inject(gulp, inject, gulp.src(workingDir + '/**/*.html'), package.coreConfig || {}).pipe()...
        let env = options['environment'] || 'dev';
        if (['external', 'internal', 'dev', 'qa'].indexOf(env) === -1) {
            throw new Error('Invalid environment specified: ' + env);
        }
        let shivFiles = [
            './bower_components/html5shiv/dist/html5shiv.js',
            './bower_components/respond/src/respond.js'
        ];
        let coreFiles = [
            './bower_components/jquery/dist/jquery.js',
            './bower_components/bootstrap/dist/js/bootstrap.js',
            './bower_components/jquery.cookie/jquery.cookie.js',
            './bower_components/bootstrap/dist/css/bootstrap.css'
        ];
        let robotoFiles = [
            './bower_components/roboto-fontface/css/roboto/roboto-fontface.css'
        ];
        let corePrintFiles = [];
        if (options['includeWebtrends']) {
            process.stdout.write('Core gulp helper injecting webtrends with key for environment: ' + env + '\n');
            coreFiles = coreFiles.concat([
                "./bower_components/core/dist/js/webtrends_keys/" + env + ".js",
                "./bower_components/core/dist/js/webtrends.js"
            ]);
        }
        if (options['includeModeling']) {
            process.stdout.write('Core gulp helper injecting underscore/backbone for modeling\n');
            coreFiles = coreFiles.concat([
                "./bower_components/underscore/underscore.js",
                "./bower_components/backbone/backbone.js",
                "./bower_components/core/dist/js/cot_backbone.js"
            ]);
        }
        if (options['includeFormValidation']) {
            process.stdout.write('Core gulp helper injecting cot_forms and formValidation\n');
            coreFiles = coreFiles.concat([
                "./bower_components/core/dist/js/formValidation.min.js",
                "./bower_components/intl-tel-input/build/js/intlTelInput.js",
                "./bower_components/core/dist/js/cot_forms.js",
                "./bower_components/jquery.maskedinput/dist/jquery.maskedinput.js",
                "./bower_components/core/dist/css/formValidation.min.css",
                "./bower_components/intl-tel-input/build/css/intlTelInput.css"
            ]);
        }
        if (options['includeEditableSelect']) {
            process.stdout.write('Core gulp helper injecting jquery-editable-select for modeling\n');
            coreFiles = coreFiles.concat([
                "./bower_components/jquery-editable-select/dist/jquery-editable-select.js",
                "./bower_components/jquery-editable-select/dist/jquery-editable-select.css"
            ]);
        }
        if (options['includePlaceholders']) {
            process.stdout.write('Core gulp helper injecting jquery placeholders\n');
            coreFiles = coreFiles.concat(['./bower_components/placeholders/dist/placeholders.jquery.js']);
        }
        if (options['includeMultiSelect']) {
            process.stdout.write('Core gulp helper injecting bootstrap-multiselect\n');
            coreFiles = coreFiles.concat([
                './bower_components/core/dist/js/bootstrap-multiselect.js',
                './bower_components/core/dist/css/bootstrap-multiselect.css'
            ]);
        }
        if (options['includeOMS']) {
            process.stdout.write('Core gulp helper injecting OMS for google maps\n');
            coreFiles = coreFiles.concat(['./bower_components/core/dist/js/oms.min.js']);
        }
        if (options['includeMoment'] || options['includeFullCalendar'] || options['includeDatePicker'] || options['includeRangePicker']) {
            process.stdout.write('Core gulp helper injecting momentjs\n');
            coreFiles = coreFiles.concat(['./bower_components/moment/min/moment-with-locales.js']);
        }
        if (options['includeFullCalendar']) {
            process.stdout.write('Core gulp helper injecting fullcalendar\n');
            coreFiles = coreFiles.concat(['./bower_components/fullcalendar/dist/fullcalendar.js']);
            corePrintFiles = corePrintFiles.concat(['./bower_components/fullcalendar/dist/fullcalendar.print.css']);
        }
        if (options['includeDatePicker']) {
            process.stdout.write('Core gulp helper injecting bootstrap-datetimepicker\n');
            coreFiles = coreFiles.concat([
                './bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
                './bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css'
            ]);
        }
        if (options['includeLogin']) {
            process.stdout.write('Core gulp helper injecting cot_login\n');
            coreFiles = coreFiles.concat(['./bower_components/core/dist/js/cot_login.js']);
        }
        if (options['includeRangePicker']) {
            process.stdout.write('Core gulp helper injecting daterangepicker\n');
            coreFiles = coreFiles.concat([
                './bower_components/bootstrap-daterangepicker/daterangepicker.js',
                './bower_components/bootstrap-daterangepicker/daterangepicker.css'
            ]);
        }
        if (options['includeBootbox']) {
            process.stdout.write('Core gulp helper injecting bootbox\n');
            coreFiles = coreFiles.concat([
                './bower_components/bootbox.js/bootbox.js',
            ]);
        }		
        coreFiles = coreFiles.concat([
            './bower_components/core/dist/js/cot_app.js',
            './bower_components/core/dist/css/cot_app.css'
        ]);

        return stream
            .pipe(inject(gulp.src(shivFiles, {read: false}), {name: 'shiv', relative: true}))
            .pipe(inject(gulp.src(coreFiles, {read: false}), {name: 'core', relative: true}))
            .pipe(inject(gulp.src(robotoFiles, {read: false}), {name: 'roboto', relative: true}))
            .pipe(inject(gulp.src(corePrintFiles, {read: false}), {
                name: 'core_print',
                relative: true,
                transform: function (filepath) {
                    if (filepath.slice(-4) === '.css') {
                        return '<link rel="stylesheet" type="text/css" media="print" href="' + filepath + '">';
                    }
                    // Use the default transform as fallback:
                    return inject.transform.apply(inject.transform, arguments);
                }
            }));
    },
    distExtras: (gulp, distDir, options) => {
        //gulp is your gulp object
        //distDir is your distribution directory
        //options is the same as the inject method above

        //bootstrap needs font files:
        gulp.src(['bower_components/bootstrap/dist/fonts/*']).pipe(gulp.dest(distDir + '/fonts'));

        //Roboto needs font files:
        gulp.src(['./bower_components/roboto-fontface/fonts/Roboto/*']).pipe(gulp.dest(distDir + '/fonts/Roboto'));

        //core and intl-tel-input need images:
        let imageSrcs = ['bower_components/core/dist/img/*'];
        if (options['includeFormValidation']) {
            imageSrcs.push('bower_components/intl-tel-input/build/img/*');
        }
        gulp.src(imageSrcs)
            .pipe(gulp.dest(distDir + '/img'));

        //intl-tel-input needs a weird lib build folder with a js util referenced by the core
        if (options['includeFormValidation']) {
            gulp.src('bower_components/intl-tel-input/lib/libphonenumber/build/utils.js')
                .pipe(gulp.dest(distDir + '/js'));
        }

        //core needs html files
        return gulp.src(['bower_components/core/dist/html/*'])
            .pipe(gulp.dest(distDir + '/html'));
    }
};
