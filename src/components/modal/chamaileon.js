module.exports = function createStyleConfig(theme) {
	return {
		"default": {
			"default": {
				"backgroundColor": theme.white,
				"borderColor": theme.darkGray,
				"color": theme.black,
				"fill": theme.black
			}
		},
		"confirm": {
			"default": {
				"backgroundColor": theme.white,
				"borderColor": theme.darkGray,
				"color": theme.black,
				"fill": theme.black
			}
		}
	};
};