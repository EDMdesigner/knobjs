module.exports = function createStyleConfig(theme) {

	return {
		"even": {
			"default": {
				"backgroundColor": theme.white,
				"color": theme.black
			},
			"hover": {
				"backgroundColor": theme.mediumGray,
				"color": theme.black
			}
		},
		"odd": {
			"default": {
				"backgroundColor": theme.lightGray,
				"color": theme.black
			},
			"hover": {
				"backgroundColor": theme.mediumGray,
				"color": theme.black
			}
		}
	};
};
