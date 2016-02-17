var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var partialify = require("partialify");
var jsonlint	= require("gulp-jsonlint");


gulp.task("jsonlint", function() {
	return gulp.src(["src/featureConfigDefaults/**/*.json", "src/modules/**/*.json"])
		.pipe(jsonlint())
		.pipe(jsonlint.failOnError());
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
	knob: {
		entries: ["./src/components.js"],
		outputFileName: "components.built.js",
		destFolder: "./src/"
	}
};

var prop = "knob";
var actConfig = examplesConfigs[prop];
var actBrowserifyTaskName = "browserify-examples-" + prop;
gulp.task(actBrowserifyTaskName, ["jsonlint"], createBrowserifyTask(actConfig));
gulp.task("watch-examples-" + prop, createWatchTask({taskToRun: actBrowserifyTaskName}));