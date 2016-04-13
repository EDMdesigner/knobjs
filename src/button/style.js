
module.exports = function createStyleConfig(theme) {

	var tinycolor = require("tinycolor2");

	return {
		"default": {
			"default": {
				"backgroundColor": theme.primaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": tinycolor(theme.primaryColor).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(theme.primaryColor).darken().toString()
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
				"backgroundColor": tinycolor(theme.secondaryColor).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(theme.secondaryColor).darken().toString()
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
				"backgroundColor": theme.white,
				"color": theme.darkGray,
				"fill": theme.darkGray
			},
			"hover": {
				"backgroundColor": tinycolor(theme.white).darken().toString(),
			},
			"active": {
				"backgroundColor": tinycolor(theme.white).lighten().toString(),
			},
			"disabled": {
				"backgroundColor": theme.white,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		},
		"pagination": {
			"default": {
				"borderColor": theme.white,
				"backgroundColor": theme.darkGray,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": tinycolor(theme.darkGray).darken().toString(),
			},
			"active": {
				"backgroundColor": tinycolor(theme.darkGray).darken().toString(),
			},
			"disabled": {
				"borderColor": theme.white,
				"backgroundColor": theme.white,
				"color": theme.mediumGray,
				"fill": theme.mediumGray
			}
		},
		"modalHead": {
			"default": {
				"borderColor": theme.white,
				"backgroundColor": theme.transparent,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": theme.transparent,
			},
			"active": {
				"backgroundColor": theme.transparent,
			}
		},
		"action": {
			"default": {
				"backgroundColor": theme.info.text,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": tinycolor(theme.info.text).lighten().toString(),
			},
			"active": {
				"backgroundColor": tinycolor(theme.info.text).darken().toString(),
			}
		},
		"danger": {
			"default": {
				"backgroundColor": theme.error.text,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": tinycolor(theme.error.text).lighten().toString(),
			},
			"active": {
				"backgroundColor": tinycolor(theme.error.text).darken().toString(),
			}
		},
		"info": {
			"default": {
				"backgroundColor": theme.info.text,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": tinycolor(theme.info.text).lighten().toString(),
			},
			"active": {
				"backgroundColor": tinycolor(theme.info.text).darken().toString(),
			}
		},
		"success": {
			"default": {
				"borderColor": theme.success.text,
				"backgroundColor": theme.success.text,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": tinycolor(theme.success.text).lighten().toString(),
			},
			"active": {
				"backgroundColor": tinycolor(theme.success.text).darken().toString(),
			}
		},
		"warning": {
			"default": {
				"borderColor": theme.warning.text,
				"backgroundColor": theme.warning.text,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": tinycolor(theme.warning.text).lighten().toString(),
			},
			"active": {
				"backgroundColor": tinycolor(theme.warning.text).darken().toString(),
			}
		},
		"error": {
			"default": {
				"borderColor": theme.error.text,
				"backgroundColor": theme.error.text,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": tinycolor(theme.error.text).lighten().toString(),
			},
			"active": {
				"backgroundColor": tinycolor(theme.error.text).darken().toString(),
			}
		},
//
//
//
//
//
		"zergDefault": {
			"default": {
				"borderColor": theme.primaryColor,
				"backgroundColor": theme.white,
				"color": theme.primaryColor,
				"fill": theme.primaryColor
			},
			"hover": {
				"borderColor": tinycolor(theme.primaryColor).lighten().toString()
			},
			"active": {
				"borderColor": tinycolor(theme.primaryColor).darken().toString()
			},
			"disabled": {
				"backgroundColor": theme.mediumGray,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		},
		"zergPrimary": {
			"default": {
				"borderColor": theme.secondaryColor,
				"backgroundColor": theme.white,
				"color": theme.secondaryColor,
				"fill": theme.secondaryColor
			},
			"hover": {
				"borderColor": tinycolor(theme.secondaryColor).lighten().toString()
			},
			"active": {
				"borderColor": tinycolor(theme.secondaryColor).darken().toString()
			},
			"disabled": {
				"backgroundColor": theme.lightGray,
				"color": theme.darkGray,
				"fill": theme.darkGray
			}
		},

	};
};