module.exports = function createStyleConfig(theme) {
	return {
		"default": {
			"default": {
				"backgroundColor": theme.black,
				"color": theme.white,
				"fill": theme.white
			}
		},
		"info": {
			"default": {
				"backgroundColor": theme.info.background,
				"color": theme.info.text,
				"fill": theme.info.text
			}
		},
		"success": {
			"default": {
				"backgroundColor": theme.success.background,
				"color": theme.success.text,
				"fill": theme.success.text
			}
		},
		"warning": {
			"default": {
				"backgroundColor": theme.warning.background,
				"color": theme.warning.text,
				"fill": theme.warning.text
			}
		},
		"error": {
			"default": {
				"backgroundColor": theme.error.background,
				"color": theme.error.text,
				"fill": theme.error.text
			}
		}
	};
};