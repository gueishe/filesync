// Composant principal
var gulp = require('gulp');

// Composant de concaténation
var concat = require('gulp-concat');

// Uglification
var uglify = require('gulp-uglify');

// Pour renommer le fichier de sortie
var rename = require("gulp-rename");

// Sourcemaps
var sourcemaps = require('gulp-sourcemaps');

// Synchronisation avec la navigation
// pour charger à chaud les modifications
// des fichiers JS
var browserSync = require('browser-sync');

// Injection automatique
var ngAnnotate = require('gulp-ng-annotate');

// Mode rewrite
var historyApiFallback = require('connect-history-api-fallback');

// Wiredep
var wiredep = require('wiredep');

// Gulp inject
var inject = require('gulp-inject');

// Mise en cache des templates
var ngHtml2Js = require("gulp-ng-html2js");

// Injection des configurations
var gulpNgConfig = require('gulp-ng-config');

// Linter JS
var jshint = require('gulp-jshint');

// Reporter d'erreurs JS
var stylish = require('jshint-stylish');

// Proxy
var proxy = require("proxy-middleware");

// Url
var url = require("url");

// Tâche princiapale qui récupère tous
// les fichiers JS, les concatène, "minifie"
// et les "uflifie". On ajoute également
// l'extension ".min.js"
gulp.task('js',['generateconfigfile'], function() {
    //return gulp.src(['src/**/*.js', '!src/**/*.spec.js'])
    return gulp.src(['public/app/**/*.module.js', 'public/app/**/*.js', '!public/app/**/*.spec.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(sourcemaps.init())
        .pipe(concat('public/scripts/app.js'))
        /*
        .pipe(ngAnnotate({
            add: true
        }))
        */
        //.pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('.'));
});

gulp.task('wiredep', function () {
  gulp.src('./public/index.html')
    .pipe(wiredep({
        directory: './public/components'
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('generatepartials', function(){
    gulp.src("public/app/**/*.part.html")
    .pipe(ngHtml2Js({
        moduleName: "cachedpartials",
        prefix: "public/app/"
    }))
    //.pipe(uglify())
    .pipe(concat("partials.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest('./public/scripts/'));
});

// Tâche d'écoute sur les fichiers JS.
// Elle dépend  de la tâche "js".
gulp.task('js-watch', ['js'], browserSync.reload);

// Tâche permettant d'injecter les "css" et "js" automatiquement
// source: http://stackoverflow.com/a/37657188/644669
gulp.task('bowerization', function(){
    var target = gulp.src('./html/index.html');
    var js = gulp.src(wiredep({directory: './public/components'}).js);
    var css = gulp.src(wiredep().css);

    return target
        .pipe(inject(js.pipe(concat('bower.js')).pipe(uglify()).pipe(gulp.dest('./public/scripts'))))
        .pipe(inject(css.pipe(concat('bower.css')).pipe(gulp.dest('./public/styles'))))
        .pipe(gulp.dest('./html'));
});

// Tâche principale qui permet d'agir comme un serveur web.
// Elle appelle également la tâche "js-watch" qui à son tour
// appelle la tâche "js"

function generateConfigFile(environment){
    gulp.src('config/' + environment +'.json')
    .pipe(gulpNgConfig('bankapp', {createModule: false}))
    .pipe(rename('configuration.js'))
    .pipe(gulp.dest('src/generated'));
}

gulp.task('generateconfigfile', function(){
    if (process.env.NODE_ENV === 'production'){
        generateConfigFile('prod');
    } else {
        generateConfigFile('dev');
    }
});

gulp.task('dist', ['generatepartials','bowerization','js'], function() {
    gulp.watch('public/app/**/*.js', ['js-watch']);
});

gulp.task('serve', ['generatepartials','bowerization','js'], function() {
    generateConfigFile('dev');
    browserSync.init(null,{
        server: {
            baseDir: "./",
            middleware: [ historyApiFallback()]
        }
    });
    gulp.watch('public/app/**/*.js', ['js-watch']);
    gulp.watch("./**/*.html").on('change', browserSync.reload);
});
