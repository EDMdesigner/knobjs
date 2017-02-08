var tinycolor = require("tinycolor2");

module.exports = function createStyleConfig(config) {
	var theme = config.theme;
	var colors = config.colors;

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

	function createButtonStatesBackground(color) {
		var colorVersions = createColorShades(color);

		var color1 = colorVersions.color1;
		var color2 = colorVersions.color2;
		var color3 = colorVersions.color3;
		var color4 = colorVersions.color4;

		var textColor1 = tinycolor(color1).isDark() ? colors.white : colors.black;
		//var textColor2 = tinycolor(color2).isDark() ? colors.white : colors.black;
		//var textColor3 = tinycolor(color3).isDark() ? colors.white : colors.black;

		return {
			default: {
				backgroundColor: color1,
				borderColor: color2,
				color: textColor1,
				fill: textColor1
			},
			hover: {
				backgroundColor: color2,
				borderColor: color3,
			},
			active: {
				backgroundColor: color3,
				borderColor: color4,
			},
			disabled: {
				backgroundColor: colors.mediumGray,
				color: tinycolor(colors.mediumGray).lighten().toString(),
				fill: tinycolor(colors.mediumGray).lighten().toString()
			}
		};
	}

	function createButtonStatesBorder(color) {
		var colorVersions = createColorShades(color);

		var color1 = colorVersions.color1;
		var color2 = colorVersions.color2;
		var color3 = colorVersions.color3;
		var color4 = colorVersions.color4;

		var textColor1 = tinycolor(color1).isDark() ? colors.white : colors.black;
		//var textColor2 = tinycolor(color2).isDark() ? colors.white : colors.black;
		//var textColor3 = tinycolor(color3).isDark() ? colors.white : colors.black;

		return {
			default: {
				backgroundColor: colors.white,
				borderColor: color1,
				color: colors.black,
				fill: colors.black
			},
			hover: {
				backgroundColor: color2,
				borderColor: color3,
				color: textColor1,
				fill: textColor1
			},
			active: {
				backgroundColor: color3,
				borderColor: color4,
				color: textColor1,
				fill: textColor1
			},
			disabled: {
				backgroundColor: colors.mediumGray,
				borderColor: tinycolor(colors.mediumGray).darken().toString(),
				color: tinycolor(colors.mediumGray).lighten().toString(),
				fill: tinycolor(colors.mediumGray).lighten().toString()
			}
		};
	}

	function createButtonStatesBorderFill(color) {
		var colorVersions = createColorShades(color);

		var color1 = colorVersions.color1;
		var color2 = colorVersions.color2;
		var color3 = colorVersions.color3;
		//var color4 = colorVersions.color4;
		var color6 = colorVersions.color6;

		//var textColor1 = tinycolor(color1).isDark() ? colors.white : colors.black;
		//var textColor2 = tinycolor(color2).isDark() ? colors.white : colors.black;
		//var textColor3 = tinycolor(color3).isDark() ? colors.white : colors.black;

		return {
			default: {
				backgroundColor: colors.white,
				borderColor: color1,
				color: colors.black,
				fill: colors.black
			},
			hover: {
				backgroundColor: colors.white,
				borderColor: color2,
				color: tinycolor(color1).isLight() ? color6 : color1,
				fill: tinycolor(color1).isLight() ? color6 : color1
			},
			active: {
				backgroundColor: color3,
				borderColor: color1,
				color: colors.black,
				fill: colors.black
			},
			disabled: {
				backgroundColor: colors.mediumGray,
				borderColor: tinycolor(colors.mediumGray).darken().toString(),
				color: tinycolor(colors.mediumGray).lighten().toString(),
				fill: tinycolor(colors.mediumGray).lighten().toString()
			}
		};
	}

	function createModalHeadButtonState(color) {
		var colorVersions = createColorShades(color);

		var color1 = colorVersions.color1;
		var color2 = colorVersions.color2;
		var color3 = colorVersions.color3;

		return {
			default: {
				color: color1,
				fill: color1
			},
			hover: {
				color: color2,
				fill: color2
			},
			active: {
				color: color3,
				fill: color3
			},
			disabled: {
				color: colors.mediumGray,
				fill: colors.mediumGray
			}
		};
	}

	var createButtonStates = createButtonStatesBackground;

	if (theme === "border") {
		createButtonStates = createButtonStatesBorder;
	} else if (theme === "border-fill") {
		createButtonStates = createButtonStatesBorderFill;
	}



	var primaryButtonStates = createButtonStates(colors.primary);
	var ligthGrayButtonStates = createButtonStates(colors.lightGray);

	var infoButtonStates = createButtonStates(colors.info);
	var warningButtonStates = createButtonStates(colors.warning);
	var successButtonStates = createButtonStates(colors.success);
	var errorButtonStates = createButtonStates(colors.error);

	var modalHeadButtonStates = createModalHeadButtonState(colors.black);
	var linkButtonStates = {
		default: {
			color: colors.primary,
			fill: colors.primary,
			padding: 0,
			border: "none",
			backgroundColor: "transparent"
		},
		hover: {
			color: colors.primary.lighten(20),
			fill: colors.primary.lighten(20)
		},
		active: {},
		disabled: {
			color: colors.mediumGray,
			fill: colors.mediumGray
		}
	};

	console.log(modalHeadButtonStates);

	return {
		"default": ligthGrayButtonStates,
		"primary": primaryButtonStates,
		"tab": ligthGrayButtonStates,
		"pagination": ligthGrayButtonStates,
		"dropdown": ligthGrayButtonStates,
		"dropdown-option": ligthGrayButtonStates,
		"modalHead": modalHeadButtonStates,
		"info": infoButtonStates,
		"success": successButtonStates,
		"warning": warningButtonStates,
		"error": errorButtonStates,
		"cancel": ligthGrayButtonStates,
		"link": linkButtonStates
	};
};