var tinycolor = require("tinycolor2"); 

module.exports = function createColorThemeBackground(theme) {

	var colors = theme;

	var factor2 = 5;
	var factor3 = 10;
	var factor4 = 15;
	var factor5 = 20;
	var factor6 = 25;

	function createColorShades(color) {
		var color1 = tinycolor(color);
		var color2 = tinycolor(color);
		var color3 = tinycolor(color);
		var color4 = tinycolor(color);
		var color5 = tinycolor(color);
		var color6 = tinycolor(color);

		if (color1.isDark()) {
			color2 = color2.lighten(factor2);
			color3 = color3.lighten(factor3);
			color4 = color4.lighten(factor4);
			color5 = color5.lighten(factor5);
			color6 = color6.lighten(factor6);
		} else {
			color2 = color2.darken(factor2);
			color3 = color3.darken(factor3);
			color4 = color4.darken(factor4);
			color5 = color6.darken(factor5);
			color6 = color6.darken(factor6);
		}

		color1 = color1.toString();
		color2 = color2.toString();
		color3 = color3.toString();
		color4 = color4.toString();
		color5 = color5.toString();
		color6 = color6.toString();

		return {
			color1: color1,
			color2: color2,
			color3: color3,
			color4: color4,
			color5: color5,
			color6: color6
		};
	}

	function createToggleTrackStatesBackground (color) {
		var colorVersions = createColorShades(color);

		var color1 = colorVersions.color1;
		var color2 = colorVersions.color2;
		var color3 = colorVersions.color3;

		return {
			default: {
				backgroundColor: color2,
				borderColor: color1
			},
			hover: {
				backgroundColor: color2,
				borderColor: color3
			},
			active: {
				backgroundColor: colors.primary,
				borderColor: color3
			},
			disabled: {
				backgroundColor: colors.mediumGray
			}
		};
	}

	function createToogleTickStatesBackground (color) {
		var colorVersions = createColorShades(color);

		var color1 = colorVersions.color1;
		var color2 = colorVersions.color2;

		return {
			default: {
				backgroundColor: color1
			},
			hover: {
				backgroundColor: color2
			},
			active: {
				backgroundColor: color1
			},
			disabled: {
				backgroundColor: colors.lightGray
			}
		};
	}

	var defaultToggleTrackStates = createToggleTrackStatesBackground(colors.lightGray);
	var defaultToogleTickStates = createToogleTickStatesBackground(colors.lightGray);

	// Create custom rectangular toggleSwitch button styles
	var squareToggleTrackStates = createToggleTrackStatesBackground(colors.lightGray);
	var squareToogleTickStates = createToogleTickStatesBackground(colors.lightGray);
	squareToggleTrackStates.default.borderRadius = 0;
	squareToogleTickStates.default.borderRadius = 0;


	return {
		track: {
			default: defaultToggleTrackStates,
			square: squareToggleTrackStates
		},
		tick: {
			default: defaultToogleTickStates,
			square: squareToogleTickStates
		}
	};
};


