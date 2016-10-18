var tinycolor = require("tinycolor2"); 

module.exports = function createColorThemeBackground(theme) {
	var activeColor = tinycolor(theme.darkGray).darken().darken();
	var hoverColor = tinycolor(theme.mediumGray).darken(); 
	var defaultColor = theme.lightGray;

	return {
		"default": {	
			default: {
				backgroundColor: defaultColor
			},
			hover: {
				backgroundColor: hoverColor
			},
			active: {
				backgroundColor: activeColor
			},
			disabled: {
				backgroundColor: defaultColor
			}
		}
	};
};
