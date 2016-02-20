module.exports = function createStyleConfig(theme) {
	return {
		"default": {
			"default": {
				"backgroundColor": theme.baseColor, //STEVE, you will be able to set the colors like this. This way we can define multiple styles!
				"color": "#fff",
				"fill": "#fff"
			},
			"hover": {
				"backgroundColor": "#3d8eb9",
				"color": "#fff",
				"fill": "#fff"
			},
			"active": {
				"backgroundColor": "#54acd2",
				"color": "#fff",
				"fill": "#fff"
			},
			"disabled": {
				"backgroundColor": "#D1D5D8",
				"color": "#131313",
				"fill": "#131313"
			},
			"success": {
				"backgroundColor": "#171717",
				"color": "#fff",
				"fill": "#fff"
			},
			"error": {
				"backgroundColor": "#B8312F",
				"color": "#131313",
				"fill": "#131313"
			}
		},
		"primary": {
			"default": {
				"backgroundColor": theme.primaryColor,
				"color": "#fff",
				"fill": "#fff"
			},
			"hover": {
				"backgroundColor": "#FAC51C",
				"color": "#fff",
				"fill": "#fff"
			},
			"active": {
				"backgroundColor": "#F7DA64",
				"color": "#fff",
				"fill": "#fff"
			},
			"disabled": {
				"backgroundColor": "#D1D5D8",
				"color": "#131313",
				"fill": "#131313"
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
