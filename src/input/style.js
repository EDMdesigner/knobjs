var tinycolor = require("tinycolor2");

module.exports = function createStyleConfig(theme) {
	var hoverColor = tinycolor(theme.primary).isDark() ? tinycolor(theme.primary).lighten(20).toString() : tinycolor(theme.primary).darken(20).toString();
	var activeColor = tinycolor(theme.primary).isDark() ? tinycolor(theme.primary).lighten(30).toString() : tinycolor(theme.primary).darken(30).toString();
	return {
		"default": {
			"default": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"borderColor": theme.darkGray
			},
			"hover": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"borderColor": theme.darkGray
			},
			"active": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"fill": theme.black
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
				"borderColor": theme.primary,
				"fill": theme.primary
			},
			"hover": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"borderColor": hoverColor,
				"fill": hoverColor
			},
			"active": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"borderColor": activeColor,
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
