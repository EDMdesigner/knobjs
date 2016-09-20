var tinycolor = require("tinycolor2");

module.exports = function createStyleConfig(theme) {
	var hoverColor = tinycolor(theme.primaryColor).isDark() ? tinycolor(theme.primaryColor).lighten(20).toString() : tinycolor(theme.primaryColor).darken(20).toString();
	var activeColor = tinycolor(theme.primaryColor).isDark() ? tinycolor(theme.primaryColor).lighten(30).toString() : tinycolor(theme.primaryColor).darken(30).toString();
	return {
		"default": {
			"default": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"border-color": theme.border
			},
			"hover": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"border-color": theme.darkGray
			},
			"active": {
				"backgroundColor": theme.white,
				"color": theme.primaryColor,
				"fill": theme.primaryColor
			},
			"disabled": {
				"backgroundColor": theme.lightGray,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		},
		"primary": {
			"default": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"border-color": theme.primaryColor,
				"fill": theme.primaryColor
			},
			"hover": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"border-color": hoverColor,
				"fill": hoverColor
			},
			"active": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"border-color": activeColor,
				"fill": activeColor
			},
			"disabled": {
				"backgroundColor": theme.lightGray,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		}
	};
};
 