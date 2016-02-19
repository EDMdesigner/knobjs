module.exports = function createStyleConfig(theme) {
	return {
		"default": {
			"default": {
				"backgroundColor": theme.BaseColor, //STEVE, you will be able to set the colors like this. This way we can define multiple styles!
				"color": "#fff",
				"fill": "#fff"
			},
			"hover": {
				"backgroundColor": "#2bbbad",
				"color": "#fff",
				"fill": "#fff"
			},
			"active": {
				"color": "#1337aa",
				"fill": "#abcdef"
			},
			"disabled": {
				"backgroundColor": "#dddddd",
				"color": "#aaaaaa"
			},
			"success": {
				"backgroundColor": "#171717",
				"color": "#fff",
				"fill": "#fff"
			},
			"error": {
				"backgroundColor": "#171717",
				"color": "#fff",
				"fill": "#fff"
			}
		},
		"primary": {
			"default": {
				"backgroundColor": "#3AB54A"
			},
			"hover": {
				"backgroundColor": "#2bbbad",
				"color": "#fff",
				"fill": "#fff"
			},
			"active": {
				"color": "#1337aa",
				"fill": "#abcdef"
			},
			"disabled": {
				"backgroundColor": "#dddddd",
				"color": "#aaaaaa"
			},
			"success": {
				"backgroundColor": "#171717",
				"color": "#fff",
				"fill": "#fff"
			},
			"error": {
				"backgroundColor": "#171717",
				"color": "#fff",
				"fill": "#fff"
			}
		}
	};
};
