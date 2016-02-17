var gulp 		= require("gulp");
var browserify 	= require("browserify");
var source 		= require("vinyl-source-stream");
var partialify 	= require("partialify");
var jsonlint	= require("gulp-jsonlint");
var jscs		= require("gulp-jscs");
var jshint		= require("gulp-jshint");
var stylish 	= require('gulp-jscs-stylish');

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

gulp.task("js-validate", function() {
	return gulp.src([
		"!src/components.built.js",
		"Gulpfile.js",
		"src/**/*.js"
		])
		.pipe(jshint(".jshintrc"))
		.pipe(jshint.reporter("jshint-stylish"))
});

gulp.task("js-style", function() {
	return gulp.src([
			"!src/components.built.js",
			"Gulpfile.js",
			"src/**/*.js"
		])
		.pipe(jscs(".jscsrc"))
		.pipe(stylish())
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

function createWatchTask(config) {
	var taskToRun = config.taskToRun;
	return function () {
		gulp.watch(["./src/**/*.js", "./examples/**/*.js", "./src/**/*.html", "./examples/**/*.html", "./src/**/*.json"], [taskToRun])
			.on("change", function (event) {
				//log(event);
			});
	};
}

var examplesConfigs = {
	components: {
		entries: ["./src/components.js"],
		outputFileName: "components.built.js",
		destFolder: "./src/"
	},
	knob: {
		entries: ["./examples/knob.js"],
		outputFileName: "knob.built.js",
		destFolder: "./examples/"
	}
};

for (var prop in examplesConfigs) {
	var actConfig = examplesConfigs[prop];
	var actBrowserifyTaskName = "browserify-examples-" + prop;
	gulp.task(actBrowserifyTaskName, ["jsonlint"], createBrowserifyTask(actConfig));
	gulp.task("watch-examples-" + prop, createWatchTask({taskToRun: actBrowserifyTaskName}));
}
