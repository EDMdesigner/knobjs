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
var minifyCss = require("gulp-minify-css");
var concat = require("gulp-concat");

// SASS Compile
// ==================================================


gulp.src("src/css/**/*.css")
	.pipe(autoprefixer("last 2 version", "safari 5", "ie 8", "ie 9"));


gulp.task("sass", function() {
	return gulp.src("./src/**/*.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(minifyCss())
		.pipe(autoprefixer({
			browsers: ["last 2 version", "iOS 6"],
			cascade: false
		}))
		.pipe(concat("knob.min.css"))
		.pipe(gulp.dest("./public"));
});

gulp.task("sass:watch", function() {
	gulp.watch("./src/**/*.scss", ["sass"]);
});


// JSON lint
// ==================================================
gulp.task("jsonlint", function() {
	return gulp.src([
			"src/featureConfigDefaults/**/*.json",
			"package.json",
			".jshintrc",
			".jscsrc",
			"src/modules/**/*.json"
		])
		.pipe(jsonlint())
		.pipe(jsonlint.failOnError());
});


// JS Hint
// ==================================================
gulp.task("jshint", function() {
	return gulp.src([
		"./**/*.js",
		"!node_modules/**/*",
		"!./**/*.built.js"
		])
		.pipe(jshint(".jshintrc"))
		.pipe(jshint.reporter("jshint-stylish"));
});


// CodeStyle
// ==================================================
gulp.task("jscs", function() {
	return gulp.src([
		"./**/*.js",
		"!node_modules/**/*",
		"!./**/*.built.js"
		])
		.pipe(jscs({
			configPath: ".jscsrc",
			fix: true
		}))
		.pipe(gulp.dest("./"))
		.pipe(stylish());
});


// Build components
// ==================================================
gulp.task("build-components", createBrowserifyTask({
	entries: ["./src/components.js"],
	outputFileName: "components.built.js",
	destFolder: "./src/"
}));

// Build examples
// ==================================================
gulp.task("build-examples", createBrowserifyTask({
	entries: ["./examples/knob.js"],
	outputFileName: "knob.built.js",
	destFolder: "./examples/"
}));

// Build
// ==================================================
gulp.task("build", ["build-components", "build-examples"]);


// Watch js
// ==================================================
gulp.task("watch-js", function() {
	gulp.watch(["./src/**/*.js", "./examples/**/*.js", "./src/**/*.html", "./examples/**/*.html", "./src/**/*.json"], ["build"])
		.on("change", function(event) {
			console.log(event);
		});
});


function createBrowserifyTask(config) {
	return function() {
		var bundleMethod = browserify;//global.isWatching ? watchify : browserify;

		var bundler = bundleMethod({
			// Specify the entry point of your app
			debug: true,
			entries: config.entries
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

gulp.task("test", ["jsonlint", "jshint", "jscs"]);
