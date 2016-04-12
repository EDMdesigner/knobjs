
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
				"backgroundColor": tinycolor(theme.primaryColor).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.primaryColor).darken().toString(),
				"color": theme.white,
				"fill": theme.white
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
				"backgroundColor": tinycolor(theme.secondaryColor).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.secondaryColor).darken().toString(),
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
				"backgroundColor": theme.white,
				"color": theme.darkGray,
				"fill": theme.darkGray
			},
			"hover": {
				"borderColor": theme.white,
				"backgroundColor": tinycolor(theme.white).darken().toString(),
				"color": theme.black,
				"fill": theme.black
			},
			"active": {
				"borderColor": theme.black,
				"backgroundColor": tinycolor(theme.white).lighten().toString(),
				"color": theme.black,
				"fill": theme.black
			},
			"disabled": {
				"borderColor": theme.white,
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
				"borderColor": theme.white,
				"backgroundColor": tinycolor(theme.darkGray).darken().toString(),
				"color": theme.write,
				"fill": theme.write
			},
			"active": {
				"borderColor": theme.black,
				"backgroundColor": tinycolor(theme.darkGray).darken().toString(),
				"color": theme.write,
				"fill": theme.write
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
				"borderColor": theme.white,
				"backgroundColor": theme.transparent,
				"color": theme.mediumGray,
				"fill": theme.mediumGray
			},
			"active": {
				"borderColor": theme.black,
				"backgroundColor": theme.transparent,
				"color": theme.white,
				"fill": theme.white
			}
		},
		"action": {
			"default": {
				"borderColor": theme.white,
				"backgroundColor": theme.info.text,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"borderColor": theme.white,
				"backgroundColor": tinycolor(theme.info.text).lighten().toString(),
				"color": theme.black,
				"fill": theme.black
			},
			"active": {
				"borderColor": theme.white,
				"backgroundColor": tinycolor(theme.info.text).darken().toString(),
				"color": theme.black,
				"fill": theme.black
			}
		},
		"danger": {
			"default": {
				"borderColor": theme.white,
				"backgroundColor": theme.error.text,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"borderColor": theme.white,
				"backgroundColor": tinycolor(theme.error.text).lighten().toString(),
				"color": theme.error.black,
				"fill": theme.error.black
			},
			"active": {
				"borderColor": theme.black,
				"backgroundColor": tinycolor(theme.error.text).darken().toString(),
				"color": theme.error.black,
				"fill": theme.error.black
			}
		},
		"info": {
			"default": {
				"borderColor": theme.info.text,
				"backgroundColor": theme.info.text,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"borderColor": theme.info.text,
				"backgroundColor": tinycolor(theme.info.text).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"borderColor": theme.info.text,
				"backgroundColor": tinycolor(theme.info.text).darken().toString(),
				"color": theme.white,
				"fill": theme.white
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
				"borderColor": theme.success.text,
				"backgroundColor": tinycolor(theme.success.text).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"borderColor": theme.success.text,
				"backgroundColor": tinycolor(theme.success.text).darken().toString(),
				"color": theme.white,
				"fill": theme.white
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
				"borderColor": theme.warning.text,
				"backgroundColor": tinycolor(theme.warning.text).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"borderColor": theme.warning.text,
				"backgroundColor": tinycolor(theme.warning.text).darken().toString(),
				"color": theme.white,
				"fill": theme.white
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
				"borderColor": theme.error.text,
				"backgroundColor": tinycolor(theme.error.text).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"borderColor": theme.error.text,
				"backgroundColor": tinycolor(theme.error.text).darken().toString(),
				"color": theme.white,
				"fill": theme.white
			}
		},
	};
};