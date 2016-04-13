module.exports = function createStyleConfig(theme) {

	var tinycolor = require("tinycolor2");

	return {
		"default": {
			"default": {
				"borderColor": theme.success.text,
				"backgroundColor": theme.white,
				"color": theme.success.text,
				"fill": theme.success.text
			},
			"hover": {
				"borderColor": tinycolor(theme.success.text).lighten().toString(),
				"backgroundColor": tinycolor(theme.success.text).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"borderColor": tinycolor(theme.success.text).darken().toString(),
				"backgroundColor": tinycolor(theme.success.text).darken().toString(),
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
				"borderColor": theme.warning.text,
				"backgroundColor": theme.white,
				"color": theme.warning.text,
				"fill": theme.warning.text
			},
			"hover": {
				"backgroundColor": tinycolor(theme.warning.text).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.warning.text).darken().toString(),
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
				"backgroundColor": theme.info.background,
				"color": theme.black,
				"fill": theme.black
			},
			"hover": {
				"backgroundColor": tinycolor(theme.info.background).darken().toString(),
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
				"borderColor": theme.success.background,
				"backgroundColor": theme.success.background,
				"color": theme.success.text,
				"fill": theme.success.text
			},
			"hover": {
				"backgroundColor": tinycolor(theme.success.background).darken().toString(),
			},
			"active": {
				"backgroundColor": tinycolor(theme.success.background).darken().toString(),
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
				"backgroundColor":theme.white,
				"borderColor": theme.info.text,
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
		"success": {
			"default": {
				"backgroundColor": theme.white,
				"borderColor": theme.success.text,
				"color": theme.success.text,
				"fill": theme.success.text
			},
			"hover": {
				"borderColor": tinycolor(theme.success.text).lighten().toString(),
			},
			"active": {
				"borderColor": tinycolor(theme.success.text).darken().toString(),
			}
		},
		"warning": {
			"default": {
				"backgroundColor": theme.white,
				"borderColor": theme.warning.text,
				"color": theme.warning.text,
				"fill": theme.warning.text
			},
			"hover": {
				"borderColor": tinycolor(theme.warning.text).lighten().toString(),
			},
			"active": {
				"borderColor": tinycolor(theme.warning.text).darken().toString(),
			}
		},
		"error": {
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
		}
	};
};