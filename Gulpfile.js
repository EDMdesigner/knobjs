var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var partialify = require("partialify");
var jsonlint = require("gulp-jsonlint");
var jscs = require("gulp-jscs");
var jshint = require("gulp-jshint");
var stylish = require("gulp-jscs-stylish");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var cssnano = require("gulp-cssnano");
var concat = require("gulp-concat");
var jasmine = require("gulp-jasmine");

var jsFiles = [
	"./**/*.js",
	"!node_modules/**/*",
	"!dist/**/*",
	"!./**/*.built.js"
];

var jsonFiles = [
	"./**/*.json",
	".jshintrc",
	".jscsrc",
	"!node_modules/**/*"
];


// SASS Compile
// ==================================================

gulp.task("sass:prod", function() {
	return gulp.src("./src/knob.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(cssnano())
		.pipe(autoprefixer({
			browsers: ["last 2 version", "iOS 6"],
			cascade: false
		}))
		.pipe(concat("knob.min.css"))
		.pipe(gulp.dest("./dist"));
});

gulp.task("sass:dev", function() {
	return gulp.src("./src/knob.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(autoprefixer({
			browsers: ["last 2 version", "iOS 6"],
			cascade: false
		}))
		.pipe(concat("knob.min.css"))
		.pipe(gulp.dest("./examples"));
});

gulp.task("sass:watch", function() {
	gulp.watch("./src/**/*.scss", ["sass:dev"]);
});

// Build components
// ==================================================
gulp.task("js:prod", createBrowserifyTask({
	entries: ["./src/components.js"],
	outputFileName: "knob.js",
	destFolder: "./dist/"
}));


// Build examples
// ==================================================
gulp.task("js:dev", createBrowserifyTask({
	entries: ["./examples/knob.js"],
	outputFileName: "knob.built.js",
	destFolder: "./examples/"
}));


// Watch js
// ==================================================
gulp.task("js:watch", function() {
	gulp.watch(["./src/**/*.js", "./examples/**/*.js", "./src/**/*.html", "./examples/**/*.html", "./src/**/*.json"], ["js:dev"])
		.on("change", function(event) {
			console.log(event);
		});
});


// JSON lint
// ==================================================
gulp.task("jsonlint", function() {
	return gulp.src(jsonFiles)
		.pipe(jsonlint())
		.pipe(jsonlint.failOnError());
});


// JS Hint
// ==================================================
gulp.task("jshint", function() {
	return gulp.src(jsFiles)
		.pipe(jshint(".jshintrc"))
		.pipe(jshint.reporter("jshint-stylish"))
		.pipe(jshint.reporter("fail"));
});

// CodeStyle
// ==================================================
gulp.task("jscs", function() {
	return gulp.src(jsFiles)
		.pipe(jscs({
			configPath: ".jscsrc",
			fix: true
		}))
		.pipe(gulp.dest("./"))
		.pipe(stylish())
		.pipe(jscs.reporter("fail"));
});

// Jasmine
// ==================================================
gulp.task("jasmine", function() {
	return gulp.src("spec/**/*Spec.js")
		.pipe(jasmine({
			verbose: true
		}));
});

// Test
// ==================================================
gulp.task("js-test", ["jsonlint", "jshint", "jscs"]);


// Build:prod
// ==================================================
gulp.task("build:prod", ["js-test"], function() {
	gulp.start("js:prod");
	gulp.start("sass:prod");
});


// Build:dev
// ==================================================
gulp.task("build:dev", ["js-test"], function() {
	gulp.start("js:dev");
	gulp.start("sass:dev");
});


function createBrowserifyTask(config) {
	return function() {
		var bundleMethod = browserify;//global.isWatching ? watchify : browserify;

		var bundler = bundleMethod({
			// Specify the entry point of your app
			debug: true,
			entries: config.entries,
			standalone: "knob"
		});

		var bundle = function() {
			return bundler
				.transform(partialify)
				// Enable source maps!
				.bundle()
				// Use vinyl-source-stream to make the
				// stream gulp compatible. Specifiy the
				// desired output filename here.
				.pipe(source(config.outputFileName))
				// Specify the output destination
				.pipe(gulp.dest(config.destFolder));
		};

		return bundle();
	};
}
