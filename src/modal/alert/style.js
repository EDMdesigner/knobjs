module.exports = function createStyleConfig(theme) {
	return {
		"default": {
			"default": {
				"backgroundColor": theme.alertColor,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": theme.alertColor,
				"color": theme.white,
				"fill": theme.white
			}
		}
	};
};
