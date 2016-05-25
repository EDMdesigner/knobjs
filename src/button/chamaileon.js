module.exports = function createStyleConfig(theme) {

	var tinycolor = require("tinycolor2");

	return {
		"default": {
			"default": {
				"backgroundColor": theme.secondaryColor,
				"borderColor": theme.border,
				"color": theme.black,
				"fill": theme.black
			},
			"hover": {
				"backgroundColor": tinycolor(theme.secondaryColor).lighten().toString(),
				"borderColor": tinycolor(theme.border).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(theme.secondaryColor).darken().toString(),
				"borderColor": tinycolor(theme.border).darken().toString()
			},
			"disabled": {
				"backgroundColor": theme.mediumGray,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		},
		"primary": {
			"default": {
				"backgroundColor": theme.primaryColor,
				"borderColor": theme.primaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": tinycolor(theme.primaryColor).lighten().toString(),
				"borderColor":tinycolor(theme.primaryColor).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(theme.primaryColor).darken().toString(),
				"borderColor": tinycolor(theme.primaryColor).darken().toString()
			},
			"disabled": {
				"backgroundColor": theme.lightGray,
				"color": theme.darkGray,
				"fill": theme.darkGray
			}
		},
		"tab": {
			"default": {
				"borderColor": theme.border,
				"backgroundColor": theme.darkGray,
				"color": theme.secondaryColor,
				"fill": theme.secondaryColor
			},
			"hover": {
				"borderColor": theme.border,
				"backgroundColor": tinycolor(theme.secondaryColor).lighten().toString(),
				"color": theme.secondaryColor,
				"fill": theme.secondaryColor
			},
			"active": {
				"backgroundColor": theme.lightGray,
				"color": theme.secondaryColor,
				"fill": theme.secondaryColor
			},
			"disabled": {
				"backgroundColor": theme.white,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		},
		"pagination": {
			"default": {
				"borderColor": theme.lightGray,
				"backgroundColor": theme.lightGray,
				"color": theme.black,
				"fill": theme.black
			},
			"hover": {
				"backgroundColor": tinycolor(theme.lightGray).lighten().toString(),
				"borderColor": tinycolor(theme.lightGray).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(theme.lightGray).darken().toString(),
				"borderColor": tinycolor(theme.lightGray).darken().toString()
			},
			"disabled": {
				"borderColor": theme.white,
				"backgroundColor": theme.white,
				"color": theme.mediumGray,
				"fill": theme.mediumGray
			}
		},
		"accordion": {
			"default": {
				"borderColor": theme.border,
				"backgroundColor": theme.white,
				"color": theme.secondaryColor,
				"fill": theme.secondaryColor
			},
			"hover": {
				"borderColor": theme.border,
				"backgroundColor": theme.white,
				"color": theme.secondaryColor,
				"fill": theme.secondaryColor
			},
			"active": {
				"borderColor": theme.border,
				"backgroundColor": theme.lightGray,
				"color": theme.secondaryColor,
				"fill": theme.secondaryColor
			},
			"disabled": {
				"borderColor": theme.white,
				"backgroundColor": theme.white,
				"color": theme.mediumGray,
				"fill": theme.mediumGray
			}
		},
		"dropdown": {
			"default": {
				"borderColor": theme.border,
				"backgroundColor": theme.white,
				"color": theme.black,
				"fill": theme.black
			},
			"hover": {
				"backgroundColor": tinycolor(theme.secondaryColor).lighten().toString()
			},
			"active": {
				"backgroundColor": theme.white,
			},
			"disabled": {
				"backgroundColor": theme.white,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		},
		"dropdown-option": {
			"default": {
				"borderColor": theme.transparent,
				"backgroundColor": theme.white,
				"color": theme.black,
				"fill": theme.black
			},
			"hover": {
				"backgroundColor": tinycolor(theme.secondaryColor).lighten().toString()
			},
			"active": {
				"backgroundColor": theme.white,
			},
			"disabled": {
				"backgroundColor": theme.white,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		},
		"modalHead": {
			"default": {
				"backgroundColor": theme.darkGray,
				"borderColor": theme.darkGray,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": theme.mediumGray,
				"borderColor": theme.mediumGray
			},
			"active": {
				"backgroundColor": theme.darkGray,
				"borderColor": theme.darkGray
			}
		},
		"action": {
			"default": {
				"borderColor": theme.info.text,
				"backgroundColor": theme.white,
				"color": theme.info.text,
				"fill": theme.info.text
			},
			"hover": {
				"borderColor": tinycolor(theme.info.text).lighten().toString(),
			},
			"active": {
				"borderColor": tinycolor(theme.info.text).darken().toString(),
			}
		},
		"danger": {
			"default": {
				"backgroundColor": theme.white,
				"borderColor": theme.error.text,
				"color": theme.error.text,
				"fill": theme.error.text
			},
			"hover": {
				"borderColor": tinycolor(theme.error.text).lighten().toString(),
			},
			"active": {
				"borderColor": tinycolor(theme.error.text).darken().toString(),
			}
		},
		"info": {
			"default": {
				"backgroundColor":theme.info.background,
				"borderColor": theme.info.background,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": tinycolor(theme.info.background).lighten().toString(),
				"borderColor": tinycolor(theme.info.background).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(theme.info.background).darken().toString(),
				"borderColor": tinycolor(theme.info.background).darken().toString()
			}
		},
		"success": {
			"default": {
				"backgroundColor": theme.success.background,
				"borderColor": theme.success.background,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": tinycolor(theme.success.background).lighten().toString(),
				"borderColor": tinycolor(theme.success.background).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(theme.success.background).darken().toString(),
				"borderColor": tinycolor(theme.success.background).darken().toString()
			}
		},
		"warning": {
			"default": {
				"backgroundColor": theme.warning.background,
				"borderColor": theme.warning.background,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": tinycolor(theme.warning.background).lighten().toString(),
				"borderColor": tinycolor(theme.warning.background).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(theme.warning.background).darken().toString(),
				"borderColor": tinycolor(theme.warning.background).darken().toString()
			}
		},
		"error": {
			"default": {
				"backgroundColor": theme.error.background,
				"borderColor": theme.error.background,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": tinycolor(theme.error.background).lighten().toString(),
				"borderColor": tinycolor(theme.error.background).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(theme.error.background).darken().toString(),
				"borderColor": tinycolor(theme.error.background).darken().toString()
			}
		}
	};
};