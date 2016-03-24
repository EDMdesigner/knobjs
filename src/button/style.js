module.exports = function createStyleConfig(theme) {
	return {
		"default": {
			"default": {
				"backgroundColor": theme.primaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": theme.primaryColor,
				"color": theme.black,
				"fill": theme.black
			},
			"active": {
				"backgroundColor": theme.primaryColor,
				"color": theme.black,
				"fill": theme.black
			},
			"disabled": {
				"backgroundColor": theme.mediumGray,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		},
		"primary": {
			"default": {
				"backgroundColor": theme.secondaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": theme.secondaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": theme.secondaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"disabled": {
				"backgroundColor": theme.lightGray,
				"color": theme.darkGray,
				"fill": theme.darkGray
			}
		},
		"tab": {
			"default": {
				"borderColor": theme.white,
				"borderTopColor": theme.white,
				"backgroundColor": theme.white,
				"color": theme.darkGray,
				"fill": theme.darkGray
			},
			"hover": {
				"borderColor": theme.white,
				"borderTopColor": theme.white,
				"backgroundColor": theme.white,
				"color": theme.black,
				"fill": theme.black
			},
			"active": {
				"borderColor": theme.darkGray,
				"borderTopColor": theme.darkGray,
				"backgroundColor": theme.white,
				"color": theme.black,
				"fill": theme.black
			},
			"disabled": {
				"borderColor": theme.white,
				"borderTopColor": theme.white,
				"backgroundColor": theme.white,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		}
	};
};
