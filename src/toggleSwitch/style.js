//var tinycolor = require("tinycolor2"); 

module.exports = function createColorThemeBackground(colors) {
	//var activeColor = tinycolor(theme.primary).darken().darken();
	//var hoverColor = tinycolor(theme.mediumGray).darken(); 
	var defaultColor = colors.lightGray;

	return {
		track: {
			default: {
				default: {
					backgroundColor: "#aaa"
				},
				hover: {
					backgroundColor: "#bbb"
				},
				active: {
					backgroundColor: colors.primary
				},
				disabled: {
					backgroundColor: defaultColor
				}
			}
		},
		tick: {
			default: {
				default: {
					backgroundColor: "#ddd"
				},
				hover: {
					backgroundColor: "#eee"
				},
				active: {
					backgroundColor: "#eee"
				},
				disabled: {
					backgroundColor: defaultColor
				}
			}
		}
	};
};
