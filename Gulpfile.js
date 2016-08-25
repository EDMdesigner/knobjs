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
var istanbul = require("gulp-istanbul");
var inject = require("gulp-inject");
var svgstore = require("gulp-svgstore");

var jsFiles = [
	"./**/*.js",
	"!node_modules/**/*",
	"!coverage/**/*",
	"!dist/**/*",
	"!./**/*.built.js"
];

var jsonFiles = [
	"./**/*.json",
	".jshintrc",
	".jscsrc",
	"!node_modules/**/*",
	"!coverage/**/*",
];


// Build example
// ==================================================
gulp.task("sass:dev", ["sass:example"], function() {
	return gulp.src("./src/knob.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(autoprefixer({
			browsers: ["last 2 version", "iOS 6"],
			cascade: false
		}))
		.pipe(concat("knob.min.css"))
		.pipe(gulp.dest("./examples"));
});

gulp.task("sass:example", function() {
	return gulp.src("./examples/example.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(autoprefixer({
			browsers: ["last 2 version", "iOS 6"],
			cascade: false
		}))
		.pipe(concat("example.min.css"))
		.pipe(gulp.dest("./examples"));
});

gulp.task("js:dev", createBrowserifyTask({
	entries: ["./examples/knob.js"],
	outputFileName: "knob.built.js",
	destFolder: "./examples/"
}));


// Build production
// ==================================================
gulp.task("sass:prod", function() {
	return gulp.src("./src/knob.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(cssnano({
			safe: true
		}))
		.pipe(autoprefixer({
			browsers: ["last 2 version", "iOS 6"],
			cascade: false
		}))
		.pipe(concat("knob.min.css"))
		.pipe(gulp.dest("./dist"));
});

gulp.task("js:prod", createBrowserifyTask({
	entries: ["./src/components.js"],
	outputFileName: "knob.js",
	destFolder: "./dist/"
}));

//SVG sprite generate

gulp.task("svg", function () {
	var svgs = gulp.src("examples/SVG/*.svg")
		.pipe(svgstore({ inlineSvg: true }));

		function fileContents (filePath, file) {
			return file.contents.toString();
		}

	return gulp.src("examples/knob.html")
		.pipe(inject(svgs, { transform: fileContents }))
		.pipe(gulp.dest("examples/"));
});


// Watchers
// ==================================================
gulp.task("sass:watch", function() {
	gulp.watch("./src/**/*.scss", ["sass:dev"]);
});

gulp.task("js:watch", function() {
	gulp.watch(["./src/**/*.js", "./examples/**/*.js", "./src/**/*.html", "./examples/**/*.html", "./src/**/*.json"], ["js:dev"])
		.on("change", function(event) {
			console.log(event);
		});
});


// Validators
// ==================================================
gulp.task("jsonlint", function() {
	return gulp.src(jsonFiles)
		.pipe(jsonlint())
		.pipe(jsonlint.failOnError());
});

gulp.task("jshint", function() {
	return gulp.src(jsFiles)
		.pipe(jshint(".jshintrc"))
		.pipe(jshint.reporter("jshint-stylish"))
		.pipe(jshint.reporter("fail"));
});

gulp.task("jscs", function() {
	return gulp.src(jsFiles)
		.pipe(jscs({
			configPath: ".jscsrc",
			fix: true
		}))
		.pipe(stylish())
		.pipe(jscs.reporter("fail"));
});

// Test
// ==================================================
gulp.task("jasmine", function() {
	return gulp.src("spec/**/*Spec.js")
		.pipe(jasmine({
			verbose: true
		}));
});

gulp.task("pre-test", function () {
	return gulp.src(["src/**/*.js"])
		// Covering files 
		.pipe(istanbul())
		// Force `require` to return covered files 
		.pipe(istanbul.hookRequire());
});
		
gulp.task("istanbul", ["pre-test"], function () {
	return gulp.src(["spec/**/*Spec.js"])
		.pipe(jasmine())
		// Creating the reports after tests ran 
		.pipe(istanbul.writeReports())
		// Enforce a coverage of at least 90% 
		.pipe(istanbul.enforceThresholds({ thresholds: { global: 50 } }));
});

// Test
// ==================================================
gulp.task("js-test", ["jsonlint", "jshint", "jscs"]);
gulp.task("test", ["jsonlint", "jshint", "jscs", "istanbul"]);

// Build:prod
// ==================================================
gulp.task("build:prod", ["js-test"], function() {
	gulp.start("js:prod");
	gulp.start("sass:prod");
	gulp.start("svg");
});


// Build:dev
// ==================================================
gulp.task("build:dev", ["js-test"], function() {
	gulp.start("js:dev");
	gulp.start("sass:dev");
	gulp.start("svg");
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
