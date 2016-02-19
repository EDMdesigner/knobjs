module.exports = function createStyleConfig() {
	return {
		"default": {
			"default": {
				"backgroundColor": "#fff", //STEVE, you will be able to set the colors like this. This way we can define multiple styles!
				"color": "#131313",
				"border-color": "#ddd"
			},
			"hover": {
				"backgroundColor": "#fff",
				"color": "#131313",
				"border-color": "#131313"
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
			"disabled": {
				"backgroundColor": "#3AB54A"
			}
		}
	};
};
