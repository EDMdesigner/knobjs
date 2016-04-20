(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.knob = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {/**/}

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],2:[function(require,module,exports){
// TinyColor v1.3.0
// https://github.com/bgrins/TinyColor
// Brian Grinstead, MIT License

(function() {

var trimLeft = /^\s+/,
    trimRight = /\s+$/,
    tinyCounter = 0,
    math = Math,
    mathRound = math.round,
    mathMin = math.min,
    mathMax = math.max,
    mathRandom = math.random;

function tinycolor (color, opts) {

    color = (color) ? color : '';
    opts = opts || { };

    // If input is already a tinycolor, return itself
    if (color instanceof tinycolor) {
       return color;
    }
    // If we are called as a function, call using new instead
    if (!(this instanceof tinycolor)) {
        return new tinycolor(color, opts);
    }

    var rgb = inputToRGB(color);
    this._originalInput = color,
    this._r = rgb.r,
    this._g = rgb.g,
    this._b = rgb.b,
    this._a = rgb.a,
    this._roundA = mathRound(100*this._a) / 100,
    this._format = opts.format || rgb.format;
    this._gradientType = opts.gradientType;

    // Don't let the range of [0,255] come back in [0,1].
    // Potentially lose a little bit of precision here, but will fix issues where
    // .5 gets interpreted as half of the total, instead of half of 1
    // If it was supposed to be 128, this was already taken care of by `inputToRgb`
    if (this._r < 1) { this._r = mathRound(this._r); }
    if (this._g < 1) { this._g = mathRound(this._g); }
    if (this._b < 1) { this._b = mathRound(this._b); }

    this._ok = rgb.ok;
    this._tc_id = tinyCounter++;
}

tinycolor.prototype = {
    isDark: function() {
        return this.getBrightness() < 128;
    },
    isLight: function() {
        return !this.isDark();
    },
    isValid: function() {
        return this._ok;
    },
    getOriginalInput: function() {
      return this._originalInput;
    },
    getFormat: function() {
        return this._format;
    },
    getAlpha: function() {
        return this._a;
    },
    getBrightness: function() {
        //http://www.w3.org/TR/AERT#color-contrast
        var rgb = this.toRgb();
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    },
    getLuminance: function() {
        //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        var rgb = this.toRgb();
        var RsRGB, GsRGB, BsRGB, R, G, B;
        RsRGB = rgb.r/255;
        GsRGB = rgb.g/255;
        BsRGB = rgb.b/255;

        if (RsRGB <= 0.03928) {R = RsRGB / 12.92;} else {R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4);}
        if (GsRGB <= 0.03928) {G = GsRGB / 12.92;} else {G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4);}
        if (BsRGB <= 0.03928) {B = BsRGB / 12.92;} else {B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4);}
        return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
    },
    setAlpha: function(value) {
        this._a = boundAlpha(value);
        this._roundA = mathRound(100*this._a) / 100;
        return this;
    },
    toHsv: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
    },
    toHsvString: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
        return (this._a == 1) ?
          "hsv("  + h + ", " + s + "%, " + v + "%)" :
          "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
    },
    toHsl: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
    },
    toHslString: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
        return (this._a == 1) ?
          "hsl("  + h + ", " + s + "%, " + l + "%)" :
          "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
    },
    toHex: function(allow3Char) {
        return rgbToHex(this._r, this._g, this._b, allow3Char);
    },
    toHexString: function(allow3Char) {
        return '#' + this.toHex(allow3Char);
    },
    toHex8: function() {
        return rgbaToHex(this._r, this._g, this._b, this._a);
    },
    toHex8String: function() {
        return '#' + this.toHex8();
    },
    toRgb: function() {
        return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
    },
    toRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
          "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
    },
    toPercentageRgb: function() {
        return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
    },
    toPercentageRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
          "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
    },
    toName: function() {
        if (this._a === 0) {
            return "transparent";
        }

        if (this._a < 1) {
            return false;
        }

        return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
    },
    toFilter: function(secondColor) {
        var hex8String = '#' + rgbaToHex(this._r, this._g, this._b, this._a);
        var secondHex8String = hex8String;
        var gradientType = this._gradientType ? "GradientType = 1, " : "";

        if (secondColor) {
            var s = tinycolor(secondColor);
            secondHex8String = s.toHex8String();
        }

        return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
    },
    toString: function(format) {
        var formatSet = !!format;
        format = format || this._format;

        var formattedString = false;
        var hasAlpha = this._a < 1 && this._a >= 0;
        var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "name");

        if (needsAlphaFormat) {
            // Special case for "transparent", all other non-alpha formats
            // will return rgba when there is transparency.
            if (format === "name" && this._a === 0) {
                return this.toName();
            }
            return this.toRgbString();
        }
        if (format === "rgb") {
            formattedString = this.toRgbString();
        }
        if (format === "prgb") {
            formattedString = this.toPercentageRgbString();
        }
        if (format === "hex" || format === "hex6") {
            formattedString = this.toHexString();
        }
        if (format === "hex3") {
            formattedString = this.toHexString(true);
        }
        if (format === "hex8") {
            formattedString = this.toHex8String();
        }
        if (format === "name") {
            formattedString = this.toName();
        }
        if (format === "hsl") {
            formattedString = this.toHslString();
        }
        if (format === "hsv") {
            formattedString = this.toHsvString();
        }

        return formattedString || this.toHexString();
    },
    clone: function() {
        return tinycolor(this.toString());
    },

    _applyModification: function(fn, args) {
        var color = fn.apply(null, [this].concat([].slice.call(args)));
        this._r = color._r;
        this._g = color._g;
        this._b = color._b;
        this.setAlpha(color._a);
        return this;
    },
    lighten: function() {
        return this._applyModification(lighten, arguments);
    },
    brighten: function() {
        return this._applyModification(brighten, arguments);
    },
    darken: function() {
        return this._applyModification(darken, arguments);
    },
    desaturate: function() {
        return this._applyModification(desaturate, arguments);
    },
    saturate: function() {
        return this._applyModification(saturate, arguments);
    },
    greyscale: function() {
        return this._applyModification(greyscale, arguments);
    },
    spin: function() {
        return this._applyModification(spin, arguments);
    },

    _applyCombination: function(fn, args) {
        return fn.apply(null, [this].concat([].slice.call(args)));
    },
    analogous: function() {
        return this._applyCombination(analogous, arguments);
    },
    complement: function() {
        return this._applyCombination(complement, arguments);
    },
    monochromatic: function() {
        return this._applyCombination(monochromatic, arguments);
    },
    splitcomplement: function() {
        return this._applyCombination(splitcomplement, arguments);
    },
    triad: function() {
        return this._applyCombination(triad, arguments);
    },
    tetrad: function() {
        return this._applyCombination(tetrad, arguments);
    }
};

// If input is an object, force 1 into "1.0" to handle ratios properly
// String input requires "1.0" as input, so 1 will be treated as 1
tinycolor.fromRatio = function(color, opts) {
    if (typeof color == "object") {
        var newColor = {};
        for (var i in color) {
            if (color.hasOwnProperty(i)) {
                if (i === "a") {
                    newColor[i] = color[i];
                }
                else {
                    newColor[i] = convertToPercentage(color[i]);
                }
            }
        }
        color = newColor;
    }

    return tinycolor(color, opts);
};

// Given a string or object, convert that input to RGB
// Possible string inputs:
//
//     "red"
//     "#f00" or "f00"
//     "#ff0000" or "ff0000"
//     "#ff000000" or "ff000000"
//     "rgb 255 0 0" or "rgb (255, 0, 0)"
//     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
//     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
//     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
//     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
//     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
//     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
//
function inputToRGB(color) {

    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var ok = false;
    var format = false;

    if (typeof color == "string") {
        color = stringInputToObject(color);
    }

    if (typeof color == "object") {
        if (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
        }
        else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v")) {
            color.s = convertToPercentage(color.s);
            color.v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, color.s, color.v);
            ok = true;
            format = "hsv";
        }
        else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {
            color.s = convertToPercentage(color.s);
            color.l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, color.s, color.l);
            ok = true;
            format = "hsl";
        }

        if (color.hasOwnProperty("a")) {
            a = color.a;
        }
    }

    a = boundAlpha(a);

    return {
        ok: ok,
        format: color.format || format,
        r: mathMin(255, mathMax(rgb.r, 0)),
        g: mathMin(255, mathMax(rgb.g, 0)),
        b: mathMin(255, mathMax(rgb.b, 0)),
        a: a
    };
}


// Conversion Functions
// --------------------

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

// `rgbToRgb`
// Handle bounds / percentage checking to conform to CSS color spec
// <http://www.w3.org/TR/css3-color/>
// *Assumes:* r, g, b in [0, 255] or [0, 1]
// *Returns:* { r, g, b } in [0, 255]
function rgbToRgb(r, g, b){
    return {
        r: bound01(r, 255) * 255,
        g: bound01(g, 255) * 255,
        b: bound01(b, 255) * 255
    };
}

// `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l } in [0,1]
function rgbToHsl(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min) {
        h = s = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return { h: h, s: s, l: l };
}

// `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hslToRgb(h, s, l) {
    var r, g, b;

    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);

    function hue2rgb(p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    if(s === 0) {
        r = g = b = l; // achromatic
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
function rgbToHsv(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
}

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
 function hsvToRgb(h, s, v) {

    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);

    var i = math.floor(h),
        f = h - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        mod = i % 6,
        r = [v, q, p, p, t, v][mod],
        g = [t, v, v, q, p, p][mod],
        b = [p, p, t, v, v, q][mod];

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHex`
// Converts an RGB color to hex
// Assumes r, g, and b are contained in the set [0, 255]
// Returns a 3 or 6 character hex
function rgbToHex(r, g, b, allow3Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    // Return a 3 character hex if possible
    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }

    return hex.join("");
}

// `rgbaToHex`
// Converts an RGBA color plus alpha transparency to hex
// Assumes r, g, b and a are contained in the set [0, 255]
// Returns an 8 character hex
function rgbaToHex(r, g, b, a) {

    var hex = [
        pad2(convertDecimalToHex(a)),
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    return hex.join("");
}

// `equals`
// Can be called with any tinycolor input
tinycolor.equals = function (color1, color2) {
    if (!color1 || !color2) { return false; }
    return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
};

tinycolor.random = function() {
    return tinycolor.fromRatio({
        r: mathRandom(),
        g: mathRandom(),
        b: mathRandom()
    });
};


// Modification Functions
// ----------------------
// Thanks to less.js for some of the basics here
// <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

function desaturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s -= amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function saturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s += amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function greyscale(color) {
    return tinycolor(color).desaturate(100);
}

function lighten (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

function brighten(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var rgb = tinycolor(color).toRgb();
    rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
    rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
    rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
    return tinycolor(rgb);
}

function darken (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l -= amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

// Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
// Values outside of this range will be wrapped into this range.
function spin(color, amount) {
    var hsl = tinycolor(color).toHsl();
    var hue = (mathRound(hsl.h) + amount) % 360;
    hsl.h = hue < 0 ? 360 + hue : hue;
    return tinycolor(hsl);
}

// Combination Functions
// ---------------------
// Thanks to jQuery xColor for some of the ideas behind these
// <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

function complement(color) {
    var hsl = tinycolor(color).toHsl();
    hsl.h = (hsl.h + 180) % 360;
    return tinycolor(hsl);
}

function triad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
    ];
}

function tetrad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
    ];
}

function splitcomplement(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
        tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
    ];
}

function analogous(color, results, slices) {
    results = results || 6;
    slices = slices || 30;

    var hsl = tinycolor(color).toHsl();
    var part = 360 / slices;
    var ret = [tinycolor(color)];

    for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(tinycolor(hsl));
    }
    return ret;
}

function monochromatic(color, results) {
    results = results || 6;
    var hsv = tinycolor(color).toHsv();
    var h = hsv.h, s = hsv.s, v = hsv.v;
    var ret = [];
    var modification = 1 / results;

    while (results--) {
        ret.push(tinycolor({ h: h, s: s, v: v}));
        v = (v + modification) % 1;
    }

    return ret;
}

// Utility Functions
// ---------------------

tinycolor.mix = function(color1, color2, amount) {
    amount = (amount === 0) ? 0 : (amount || 50);

    var rgb1 = tinycolor(color1).toRgb();
    var rgb2 = tinycolor(color2).toRgb();

    var p = amount / 100;
    var w = p * 2 - 1;
    var a = rgb2.a - rgb1.a;

    var w1;

    if (w * a == -1) {
        w1 = w;
    } else {
        w1 = (w + a) / (1 + w * a);
    }

    w1 = (w1 + 1) / 2;

    var w2 = 1 - w1;

    var rgba = {
        r: rgb2.r * w1 + rgb1.r * w2,
        g: rgb2.g * w1 + rgb1.g * w2,
        b: rgb2.b * w1 + rgb1.b * w2,
        a: rgb2.a * p  + rgb1.a * (1 - p)
    };

    return tinycolor(rgba);
};


// Readability Functions
// ---------------------
// <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)

// `contrast`
// Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
tinycolor.readability = function(color1, color2) {
    var c1 = tinycolor(color1);
    var c2 = tinycolor(color2);
    return (Math.max(c1.getLuminance(),c2.getLuminance())+0.05) / (Math.min(c1.getLuminance(),c2.getLuminance())+0.05);
};

// `isReadable`
// Ensure that foreground and background color combinations meet WCAG2 guidelines.
// The third argument is an optional Object.
//      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
//      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
// If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.

// *Example*
//    tinycolor.isReadable("#000", "#111") => false
//    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
tinycolor.isReadable = function(color1, color2, wcag2) {
    var readability = tinycolor.readability(color1, color2);
    var wcag2Parms, out;

    out = false;

    wcag2Parms = validateWCAG2Parms(wcag2);
    switch (wcag2Parms.level + wcag2Parms.size) {
        case "AAsmall":
        case "AAAlarge":
            out = readability >= 4.5;
            break;
        case "AAlarge":
            out = readability >= 3;
            break;
        case "AAAsmall":
            out = readability >= 7;
            break;
    }
    return out;

};

// `mostReadable`
// Given a base color and a list of possible foreground or background
// colors for that base, returns the most readable color.
// Optionally returns Black or White if the most readable color is unreadable.
// *Example*
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
tinycolor.mostReadable = function(baseColor, colorList, args) {
    var bestColor = null;
    var bestScore = 0;
    var readability;
    var includeFallbackColors, level, size ;
    args = args || {};
    includeFallbackColors = args.includeFallbackColors ;
    level = args.level;
    size = args.size;

    for (var i= 0; i < colorList.length ; i++) {
        readability = tinycolor.readability(baseColor, colorList[i]);
        if (readability > bestScore) {
            bestScore = readability;
            bestColor = tinycolor(colorList[i]);
        }
    }

    if (tinycolor.isReadable(baseColor, bestColor, {"level":level,"size":size}) || !includeFallbackColors) {
        return bestColor;
    }
    else {
        args.includeFallbackColors=false;
        return tinycolor.mostReadable(baseColor,["#fff", "#000"],args);
    }
};


// Big List of Colors
// ------------------
// <http://www.w3.org/TR/css3-color/#svg-color>
var names = tinycolor.names = {
    aliceblue: "f0f8ff",
    antiquewhite: "faebd7",
    aqua: "0ff",
    aquamarine: "7fffd4",
    azure: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "000",
    blanchedalmond: "ffebcd",
    blue: "00f",
    blueviolet: "8a2be2",
    brown: "a52a2a",
    burlywood: "deb887",
    burntsienna: "ea7e5d",
    cadetblue: "5f9ea0",
    chartreuse: "7fff00",
    chocolate: "d2691e",
    coral: "ff7f50",
    cornflowerblue: "6495ed",
    cornsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "0ff",
    darkblue: "00008b",
    darkcyan: "008b8b",
    darkgoldenrod: "b8860b",
    darkgray: "a9a9a9",
    darkgreen: "006400",
    darkgrey: "a9a9a9",
    darkkhaki: "bdb76b",
    darkmagenta: "8b008b",
    darkolivegreen: "556b2f",
    darkorange: "ff8c00",
    darkorchid: "9932cc",
    darkred: "8b0000",
    darksalmon: "e9967a",
    darkseagreen: "8fbc8f",
    darkslateblue: "483d8b",
    darkslategray: "2f4f4f",
    darkslategrey: "2f4f4f",
    darkturquoise: "00ced1",
    darkviolet: "9400d3",
    deeppink: "ff1493",
    deepskyblue: "00bfff",
    dimgray: "696969",
    dimgrey: "696969",
    dodgerblue: "1e90ff",
    firebrick: "b22222",
    floralwhite: "fffaf0",
    forestgreen: "228b22",
    fuchsia: "f0f",
    gainsboro: "dcdcdc",
    ghostwhite: "f8f8ff",
    gold: "ffd700",
    goldenrod: "daa520",
    gray: "808080",
    green: "008000",
    greenyellow: "adff2f",
    grey: "808080",
    honeydew: "f0fff0",
    hotpink: "ff69b4",
    indianred: "cd5c5c",
    indigo: "4b0082",
    ivory: "fffff0",
    khaki: "f0e68c",
    lavender: "e6e6fa",
    lavenderblush: "fff0f5",
    lawngreen: "7cfc00",
    lemonchiffon: "fffacd",
    lightblue: "add8e6",
    lightcoral: "f08080",
    lightcyan: "e0ffff",
    lightgoldenrodyellow: "fafad2",
    lightgray: "d3d3d3",
    lightgreen: "90ee90",
    lightgrey: "d3d3d3",
    lightpink: "ffb6c1",
    lightsalmon: "ffa07a",
    lightseagreen: "20b2aa",
    lightskyblue: "87cefa",
    lightslategray: "789",
    lightslategrey: "789",
    lightsteelblue: "b0c4de",
    lightyellow: "ffffe0",
    lime: "0f0",
    limegreen: "32cd32",
    linen: "faf0e6",
    magenta: "f0f",
    maroon: "800000",
    mediumaquamarine: "66cdaa",
    mediumblue: "0000cd",
    mediumorchid: "ba55d3",
    mediumpurple: "9370db",
    mediumseagreen: "3cb371",
    mediumslateblue: "7b68ee",
    mediumspringgreen: "00fa9a",
    mediumturquoise: "48d1cc",
    mediumvioletred: "c71585",
    midnightblue: "191970",
    mintcream: "f5fffa",
    mistyrose: "ffe4e1",
    moccasin: "ffe4b5",
    navajowhite: "ffdead",
    navy: "000080",
    oldlace: "fdf5e6",
    olive: "808000",
    olivedrab: "6b8e23",
    orange: "ffa500",
    orangered: "ff4500",
    orchid: "da70d6",
    palegoldenrod: "eee8aa",
    palegreen: "98fb98",
    paleturquoise: "afeeee",
    palevioletred: "db7093",
    papayawhip: "ffefd5",
    peachpuff: "ffdab9",
    peru: "cd853f",
    pink: "ffc0cb",
    plum: "dda0dd",
    powderblue: "b0e0e6",
    purple: "800080",
    rebeccapurple: "663399",
    red: "f00",
    rosybrown: "bc8f8f",
    royalblue: "4169e1",
    saddlebrown: "8b4513",
    salmon: "fa8072",
    sandybrown: "f4a460",
    seagreen: "2e8b57",
    seashell: "fff5ee",
    sienna: "a0522d",
    silver: "c0c0c0",
    skyblue: "87ceeb",
    slateblue: "6a5acd",
    slategray: "708090",
    slategrey: "708090",
    snow: "fffafa",
    springgreen: "00ff7f",
    steelblue: "4682b4",
    tan: "d2b48c",
    teal: "008080",
    thistle: "d8bfd8",
    tomato: "ff6347",
    turquoise: "40e0d0",
    violet: "ee82ee",
    wheat: "f5deb3",
    white: "fff",
    whitesmoke: "f5f5f5",
    yellow: "ff0",
    yellowgreen: "9acd32"
};

// Make it easy to access colors via `hexNames[hex]`
var hexNames = tinycolor.hexNames = flip(names);


// Utilities
// ---------

// `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
function flip(o) {
    var flipped = { };
    for (var i in o) {
        if (o.hasOwnProperty(i)) {
            flipped[o[i]] = i;
        }
    }
    return flipped;
}

// Return a valid alpha value [0,1] with all invalid values being set to 1
function boundAlpha(a) {
    a = parseFloat(a);

    if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
    }

    return a;
}

// Take input from [0, n] and return it as [0, 1]
function bound01(n, max) {
    if (isOnePointZero(n)) { n = "100%"; }

    var processPercent = isPercentage(n);
    n = mathMin(max, mathMax(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent) {
        n = parseInt(n * max, 10) / 100;
    }

    // Handle floating point rounding errors
    if ((math.abs(n - max) < 0.000001)) {
        return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
}

// Force a number between 0 and 1
function clamp01(val) {
    return mathMin(1, mathMax(0, val));
}

// Parse a base-16 hex value into a base-10 integer
function parseIntFromHex(val) {
    return parseInt(val, 16);
}

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
function isOnePointZero(n) {
    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
}

// Check to see if string passed in is a percentage
function isPercentage(n) {
    return typeof n === "string" && n.indexOf('%') != -1;
}

// Force a hex value to have 2 characters
function pad2(c) {
    return c.length == 1 ? '0' + c : '' + c;
}

// Replace a decimal with it's percentage value
function convertToPercentage(n) {
    if (n <= 1) {
        n = (n * 100) + "%";
    }

    return n;
}

// Converts a decimal to a hex value
function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
}
// Converts a hex value to a decimal
function convertHexToDecimal(h) {
    return (parseIntFromHex(h) / 255);
}

var matchers = (function() {

    // <http://www.w3.org/TR/css3-values/#integers>
    var CSS_INTEGER = "[-\\+]?\\d+%?";

    // <http://www.w3.org/TR/css3-values/#number-value>
    var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
    var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

    // Actual matching.
    // Parentheses and commas are optional, but not required.
    // Whitespace can take the place of commas or opening paren
    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

    return {
        rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
        rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
        hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
        hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
        hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
        hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
        hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    };
})();

// `stringInputToObject`
// Permissive string parsing.  Take in a number of formats, and output an object
// based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
function stringInputToObject(color) {

    color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
    var named = false;
    if (names[color]) {
        color = names[color];
        named = true;
    }
    else if (color == 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }

    // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the tinycolor is initialized with string or object.
    var match;
    if ((match = matchers.rgb.exec(color))) {
        return { r: match[1], g: match[2], b: match[3] };
    }
    if ((match = matchers.rgba.exec(color))) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    if ((match = matchers.hsl.exec(color))) {
        return { h: match[1], s: match[2], l: match[3] };
    }
    if ((match = matchers.hsla.exec(color))) {
        return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    if ((match = matchers.hsv.exec(color))) {
        return { h: match[1], s: match[2], v: match[3] };
    }
    if ((match = matchers.hsva.exec(color))) {
        return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    if ((match = matchers.hex8.exec(color))) {
        return {
            a: convertHexToDecimal(match[1]),
            r: parseIntFromHex(match[2]),
            g: parseIntFromHex(match[3]),
            b: parseIntFromHex(match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex6.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? "name" : "hex"
        };
    }
    if ((match = matchers.hex3.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            format: named ? "name" : "hex"
        };
    }

    return false;
}

function validateWCAG2Parms(parms) {
    // return valid WCAG2 parms for isReadable.
    // If input parms are invalid, return {"level":"AA", "size":"small"}
    var level, size;
    parms = parms || {"level":"AA", "size":"small"};
    level = (parms.level || "AA").toUpperCase();
    size = (parms.size || "small").toLowerCase();
    if (level !== "AA" && level !== "AAA") {
        level = "AA";
    }
    if (size !== "small" && size !== "large") {
        size = "small";
    }
    return {"level":level, "size":size};
}

// Node: Export function
if (typeof module !== "undefined" && module.exports) {
    module.exports = tinycolor;
}
// AMD/requirejs: Define the module
else if (typeof define === 'function' && define.amd) {
    define(function () {return tinycolor;});
}
// Browser: Expose to window
else {
    window.tinycolor = tinycolor;
}

})();

},{}],3:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

module.exports = function clickBehaviour(vm) {
	if (!vm) {
		throw new Error("vm is mandatory!");
	}

	if (!ko.isObservable(vm.state)) {
		throw new Error("vm.state has to be a knockout observable!");
	}

	function mouseDown() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		vm.state("active");
	}

	function mouseUp() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		vm.state("hover");
	}

	if (!vm.eventHandlers) {
		vm.eventHandlers = {};
	}

	vm.eventHandlers.mousedown = mouseDown;
	vm.eventHandlers.mouseup = mouseUp;

	return vm;
};

},{}],4:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

module.exports = function focusBehaviour(vm) {

	if (!vm) {
		throw new Error("vm is mandatory!");
	}

	if (!ko.isObservable(vm.state)) {
		throw new Error("vm.state has to be a knockout observable!");
	}

	function focus() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		vm.state("active");
	}

	function blur() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		vm.state("default");
	}

	if (!vm.eventHandlers) {
		vm.eventHandlers = {};
	}

	vm.eventHandlers.focus = focus;
	vm.eventHandlers.blur = blur;

	return vm;
};

},{}],5:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

module.exports = function hoverBehaviour(vm) {
	if (!vm) {
		throw new Error("vm is mandatory!");
	}

	if (!ko.isObservable(vm.state)) {
		throw new Error("vm.state has to be a knockout observable!");
	}

	var previousState;

	function mouseOver() {
		var actState = vm.state();

		if (actState === "disabled" || actState === "active") {
			return;
		}

		if (actState !== "hover") {
			previousState = actState;
		}

		vm.state("hover");
	}

	function mouseOut() {
		var actState = vm.state();

		if (actState === "disabled" || actState === "active") {
			return;
		}

		vm.state(previousState);
	}

	if (!vm.eventHandlers) {
		vm.eventHandlers = {};
	}

	vm.eventHandlers.mouseover = mouseOver;
	vm.eventHandlers.mouseout = mouseOut;


	return vm;
};

},{}],6:[function(require,module,exports){
/*jslint node: true */
"use strict";

var vms = {};

module.exports = function selectBehaviour(vm, config) {
	if (!vm) {
		throw new Error("vm is mandatory!");
	}

	config = config || {};

	var group = config.group || "default";

	if (!vms[group]) {
		vms[group] = [];
	}

	vms[group].push(vm);

	function mouseDown() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		vm.state("active");
	}

	function mouseUp() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		var actGroupVms = vms[group];

		for (var idx = 0; idx < actGroupVms.length; idx += 1) {
			var actVm = actGroupVms[idx];

			if (actVm === vm) {
				continue;
			}

			actVm.state("default");
		}
	}

	if (!vm.eventHandlers) {
		vm.eventHandlers = {};
	}

	vm.eventHandlers.mousedown = mouseDown;
	vm.eventHandlers.mouseup = mouseUp;

	return vm;
};

},{}],7:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

var hoverBehaviour = require("./behaviours/hover");
var focusBehaviour = require("./behaviours/focus");
var clickBehaviour = require("./behaviours/click");
var selectBehaviour = require("./behaviours/select");


function createBaseVm(config) {
	config = config || {};

	if (!config.component) {
		throw new Error("config.component is mandatory!");
	}

	if (!config.style) {
		throw new Error("config.style is mandatory!");
	}

	var component = config.component;
	var style = config.style;

	var state = ko.observable(config.state || "default");
	var variation = config.variation || "default";


	var cssClassComputed = ko.computed(function() {
		return "knob-" + component + " state-" + state() + " variation-" + variation;
	});
	var styleComputed = ko.computed(function() {
		var stateVal = state();

		return style[variation][stateVal];
	});

	var vm = {
		variation: variation,
		state: state,

		cssClass: cssClassComputed,
		style: styleComputed,

		eventHandlers: {}
	};


	function createEnabler(behaviour, props) {
		return {
			enable: function() {
				behaviour(vm, config);
			},
			disable: function() {
				props.forEach(function(prop) {
					if (vm.eventHandlers[prop]) {
						delete vm.eventHandlers[prop];
					}
				});
			}
		};
	}

	vm.behaviours = {
		hover: createEnabler(hoverBehaviour, ["mouseover", "mouseout"]),
		focus: createEnabler(focusBehaviour, ["focus", "blur"]),
		click: createEnabler(clickBehaviour, ["mousedown", "mouseup"]),
		select: createEnabler(selectBehaviour, ["mousedown", "mouseup"])
	};

	return vm;
}

module.exports = createBaseVm;

},{"./behaviours/click":3,"./behaviours/focus":4,"./behaviours/hover":5,"./behaviours/select":6}],8:[function(require,module,exports){
module.exports = function createStyleConfig(theme) {

	var tinycolor = require("tinycolor2");

	return {
		"default": {
			"default": {
				"backgroundColor": theme.secondaryColor,
				"borderColor": theme.secondaryColor,
				"color": theme.black,
				"fill": theme.black
			},
			"hover": {
				"backgroundColor": tinycolor(theme.secondaryColor).lighten().toString(),
				"borderColor": tinycolor(theme.secondaryColor).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(theme.secondaryColor).darken().toString(),
				"borderColor": tinycolor(theme.secondaryColor).darken().toString()
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
				"borderColor": theme.secondaryColor,
				"backgroundColor": theme.secondaryColor,
				"color": theme.black,
				"fill": theme.black
			},
			"hover": {
				"backgroundColor": tinycolor(theme.secondaryColor).lighten().toString(),
				"borderColor": tinycolor(theme.secondaryColor).lighten().toString()
			},
			"active": {
				"backgroundColor": theme.white,
				"borderColor": theme.white
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
},{"tinycolor2":2}],9:[function(require,module,exports){
module.exports = '<button data-bind="css: cssClass,\n					style: style,\n					click: click,\n					event: eventHandlers,\n					disable: state() === \'disabled\'">\n\n	<span class="icon-wrapper" data-bind="if: leftIcon">\n		<svg class="icon">\n			<use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': leftIcon}" xlink:href=""></use>\n		</svg>\n	</span>\n\n	<span class="label" data-bind="text: label"></span>\n\n	<span class="icon-wrapper" data-bind="if: rightIcon">\n		<svg class="icon">\n			<use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': rightIcon}" xlink:href=""></use>\n		</svg>\n	</span>\n</button>';
},{}],10:[function(require,module,exports){
module.exports = function createStyleConfig(theme) {

	var tinycolor = require("tinycolor2");

	return {
		"default": {
			"default": {
				"backgroundColor": theme.white,
				"borderColor": theme.secondaryColor,
				"color": theme.secondaryColor,
				"fill": theme.secondaryColor
			},
			"hover": {
				"backgroundColor": tinycolor(theme.secondaryColor).lighten().toString(),
				"borderColor": tinycolor(theme.secondaryColor).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.secondaryColor).darken().toString(),
				"borderColor": tinycolor(theme.secondaryColor).darken().toString(),
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
				"backgroundColor": theme.white,
				"borderColor": theme.primaryColor,
				"color": theme.primaryColor,
				"fill": theme.primaryColor
			},
			"hover": {
				"backgroundColor": tinycolor(theme.primaryColor).lighten().toString(),
				"borderColor":tinycolor(theme.primaryColor).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.primaryColor).darken().toString(),
				"borderColor": tinycolor(theme.primaryColor).darken().toString(),
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
				"color": theme.black,
				"fill": theme.black
			},
			"hover": {
				"backgroundColor": theme.white,
				"borderColor": tinycolor(theme.secondaryColor).lighten().toString()
			},
			"active": {
				"backgroundColor": theme.white,
				"borderColor": tinycolor(theme.secondaryColor).lighten().toString()
			},
			"disabled": {
				"backgroundColor": theme.white,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		},
		"pagination": {
			"default": {
				"borderColor": theme.secondaryColor,
				"backgroundColor": theme.white,
				"color": theme.secondaryColor,
				"fill": theme.secondaryColor
			},
			"hover": {
				"backgroundColor": tinycolor(theme.secondaryColor).lighten().toString(),
				"borderColor": theme.secondaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.secondaryColor).darken().toString(),
				"borderColor": theme.secondaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"disabled": {
				"borderColor": theme.secondaryColor,
				"backgroundColor": theme.white,
				"color": theme.mediumGray,
				"fill": theme.mediumGray
			}
		},
		"modalHead": {
			"default": {
				"backgroundColor": theme.secondaryColor,
				"borderColor": theme.secondaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": theme.secondaryColor,
				"borderColor": theme.secondaryColor
			},
			"active": {
				"backgroundColor": theme.secondaryColor,
				"borderColor": theme.secondaryColor
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
				"backgroundColor": tinycolor(theme.info.text).lighten().toString(),
				"borderColor": tinycolor(theme.info.text).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.info.text).darken().toString(),
				"borderColor": tinycolor(theme.info.text).darken().toString(),
				"color": theme.white,
				"fill": theme.white
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
				"backgroundColor": tinycolor(theme.success.text).lighten().toString(),
				"borderColor": tinycolor(theme.success.text).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.success.text).darken().toString(),
				"borderColor": tinycolor(theme.success.text).darken().toString(),
				"color": theme.white,
				"fill": theme.white
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
				"backgroundColor": tinycolor(theme.warning.text).lighten().toString(),
				"borderColor": tinycolor(theme.warning.text).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.warning.text).darken().toString(),
				"borderColor": tinycolor(theme.warning.text).darken().toString(),
				"color": theme.white,
				"fill": theme.white
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
				"backgroundColor": tinycolor(theme.error.text).lighten().toString(),
				"borderColor": tinycolor(theme.error.text).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.error.text).darken().toString(),
				"borderColor": tinycolor(theme.error.text).darken().toString(),
				"color": theme.white,
				"fill": theme.white
			}
		}
	};
};
},{"tinycolor2":2}],11:[function(require,module,exports){
module.exports = function createStyleConfig(theme) {

	var tinycolor = require("tinycolor2");

	return {
		"default": {
			"default": {
				"backgroundColor": theme.white,
				"borderColor": theme.secondaryColor,
				"borderRadius": "5px",
				"color": theme.secondaryColor,
				"fill": theme.secondaryColor
			},
			"hover": {
				"backgroundColor": tinycolor(theme.secondaryColor).lighten().toString(),
				"borderColor": tinycolor(theme.secondaryColor).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.secondaryColor).darken().toString(),
				"borderColor": tinycolor(theme.secondaryColor).darken().toString(),
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
				"backgroundColor": theme.white,
				"borderColor": theme.primaryColor,
				"borderRadius": "5px",
				"color": theme.primaryColor,
				"fill": theme.primaryColor
			},
			"hover": {
				"backgroundColor": tinycolor(theme.primaryColor).lighten().toString(),
				"borderColor":tinycolor(theme.primaryColor).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.primaryColor).darken().toString(),
				"borderColor": tinycolor(theme.primaryColor).darken().toString(),
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
				"color": theme.black,
				"borderRadius": "5px",
				"fill": theme.black
			},
			"hover": {
				"backgroundColor": theme.white,
				"borderColor": tinycolor(theme.secondaryColor).lighten().toString()
			},
			"active": {
				"backgroundColor": theme.white,
				"borderColor": tinycolor(theme.secondaryColor).lighten().toString()
			},
			"disabled": {
				"backgroundColor": theme.white,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		},
		"pagination": {
			"default": {
				"borderColor": theme.secondaryColor,
				"backgroundColor": theme.white,
				"color": theme.secondaryColor,
				"fill": theme.secondaryColor
			},
			"hover": {
				"backgroundColor": tinycolor(theme.secondaryColor).lighten().toString(),
				"borderColor": theme.secondaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.secondaryColor).darken().toString(),
				"borderColor": theme.secondaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"disabled": {
				"borderColor": theme.secondaryColor,
				"backgroundColor": theme.white,
				"color": theme.mediumGray,
				"fill": theme.mediumGray
			}
		},
		"modalHead": {
			"default": {
				"backgroundColor": theme.secondaryColor,
				"borderColor": theme.secondaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": theme.secondaryColor,
				"borderColor": theme.secondaryColor
			},
			"active": {
				"backgroundColor": theme.secondaryColor,
				"borderColor": theme.secondaryColor
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
				"borderRadius": "5px",
				"color": theme.info.text,
				"fill": theme.info.text
			},
			"hover": {
				"backgroundColor": tinycolor(theme.info.text).lighten().toString(),
				"borderColor": tinycolor(theme.info.text).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.info.text).darken().toString(),
				"borderColor": tinycolor(theme.info.text).darken().toString(),
				"color": theme.white,
				"fill": theme.white
			}
		},
		"success": {
			"default": {
				"backgroundColor": theme.white,
				"borderColor": theme.success.text,
				"borderRadius": "5px",
				"color": theme.success.text,
				"fill": theme.success.text
			},
			"hover": {
				"backgroundColor": tinycolor(theme.success.text).lighten().toString(),
				"borderColor": tinycolor(theme.success.text).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.success.text).darken().toString(),
				"borderColor": tinycolor(theme.success.text).darken().toString(),
				"color": theme.white,
				"fill": theme.white
			}
		},
		"warning": {
			"default": {
				"backgroundColor": theme.white,
				"borderColor": theme.warning.text,
				"borderRadius": "5px",
				"color": theme.warning.text,
				"fill": theme.warning.text
			},
			"hover": {
				"backgroundColor": tinycolor(theme.warning.text).lighten().toString(),
				"borderColor": tinycolor(theme.warning.text).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.warning.text).darken().toString(),
				"borderColor": tinycolor(theme.warning.text).darken().toString(),
				"color": theme.white,
				"fill": theme.white
			}
		},
		"error": {
			"default": {
				"backgroundColor": theme.white,
				"borderColor": theme.error.text,
				"borderRadius": "5px",
				"color": theme.error.text,
				"fill": theme.error.text
			},
			"hover": {
				"backgroundColor": tinycolor(theme.error.text).lighten().toString(),
				"borderColor": tinycolor(theme.error.text).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.error.text).darken().toString(),
				"borderColor": tinycolor(theme.error.text).darken().toString(),
				"color": theme.white,
				"fill": theme.white
			}
		}
	};
};
},{"tinycolor2":2}],12:[function(require,module,exports){
module.exports = function createStyleConfig(theme) {

	var tinycolor = require("tinycolor2");

	return {
		"default": {
			"default": {
				"backgroundColor": theme.secondaryColor,
				"borderColor": theme.secondaryColor,
				"color": theme.black,
				"fill": theme.black
			},
			"hover": {
				"backgroundColor": tinycolor(theme.secondaryColor).lighten().toString(),
				"borderColor": tinycolor(theme.secondaryColor).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(theme.secondaryColor).darken().toString(),
				"borderColor": tinycolor(theme.secondaryColor).darken().toString()
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
				"borderColor": theme.secondaryColor,
				"backgroundColor": theme.secondaryColor,
				"color": theme.black,
				"fill": theme.black
			},
			"hover": {
				"backgroundColor": tinycolor(theme.secondaryColor).lighten().toString(),
				"borderColor": tinycolor(theme.secondaryColor).lighten().toString()
			},
			"active": {
				"backgroundColor": theme.white,
				"borderColor": theme.white
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
		"modalHead": {
			"default": {
				"backgroundColor": theme.secondaryColor,
				"borderColor": theme.secondaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": theme.secondaryColor,
				"borderColor": theme.secondaryColor
			},
			"active": {
				"backgroundColor": theme.secondaryColor,
				"borderColor": theme.secondaryColor
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
},{"tinycolor2":2}],13:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

var base = require("../base/vm");

function createButton(config) {
	if (!config) {
		throw new Error("config is mandatory!");
	}

	if (config.click && typeof config.click !== "function") {
		throw new Error("click has to be a function!");
	}

	if (!config.label && !config.leftIcon && !config.rightIcon && !config.icon) {
		throw new Error("either label/lefticon/righticon/icon has to be given!");
	}

	config.component = "button";

	var vm = base(config);

	vm.behaviours.hover.enable();

	if (config.radio) {
		vm.behaviours.select.enable();
	} else {
		vm.behaviours.click.enable();
	}

	vm.leftIcon = ko.observable(ko.unwrap(config.leftIcon || config.icon));
	vm.rightIcon = ko.observable(ko.unwrap(config.rightIcon));
	vm.label = ko.observable(ko.unwrap(config.label));
	vm.value = config.value;
	vm.click = config.click || function() {};

	return vm;
}

module.exports = createButton;

},{"../base/vm":7}],14:[function(require,module,exports){
"use strict";

//*/

//THIS FILE SHOULD BE GENERATED

var extend = require("extend");

var registerComponent = require("./knobRegisterComponent");

var baseVm = require("./base/vm");

var createButtonStyle;
var createButtonStyleDefault = require("./button/style");
var createButtonStyleTheme2 = require("./button/theme2");
var createButtonStyleTheme3 = require("./button/theme3");
var createButtonStyleTheme4 = require("./button/theme4");

var createInputStyle;
var createInputStyleDefault = require("./input/style");
var createInputStyleTheme2 = require("./input/theme2");
var createInputStyleTheme3 = require("./input/theme3");
var createInputStyleTheme4 = require("./input/theme4");

var createModalStyle;
var createModalStyleDefault = require("./modal/style");
var createModalStyleTheme2 = require("./modal/theme2");
var createModalStyleTheme3 = require("./modal/theme3");
var createModalStyleTheme4 = require("./modal/theme4");

var createPagedListStyle;
var createPagedListStyleDefault = require("./pagedList/style");
var createPagedListStyleTheme2 = require("./pagedList/theme2");
var createPagedListStyleTheme3 = require("./pagedList/theme3");
var createPagedListStyleTheme4 = require("./pagedList/theme4");

var createNotificationStyle;
var createNotificationStyleDefault = require("./notificationBar/style");
var createNotificationStyleTheme2 = require("./notificationBar/theme2");
var createNotificationStyleTheme3 = require("./notificationBar/theme3");
var createNotificationStyleTheme4 = require("./notificationBar/theme4");

function initKnob(config) {
	var defaultIcons = {
		search: "#icon-search",
		sort: {
			asc: "#icon-sort-asc",
			desc: "#icon-sort-desc"
		},
		dropdown: "#icon-expand-more",
		loading: "#icon-loading",
		pagination: {
			first: "#icon-first-page",
			prev: "#icon-chevron-left",
			last: "#icon-chevron-right",
			next: "#icon-last-page"
		}
	};

	var defaultLabels = {
		noResults: "No results"
	};


	var colorSet = config.colorSet;
	var theme = config.theme;

	var icons = extend(true, {}, defaultIcons, config.icons);
	var labels = extend(true, {}, defaultLabels, config.labels);

	if (typeof theme === "object") {

		if (typeof theme.createButtonStyle !== "function") {
			throw new Error("config.theme.createButtonStyle must be a function");
		}

		if (typeof theme.createInputStyle !== "function") {
			throw new Error("config.theme.createInputStyle must be a function");
		}

		if (typeof theme.createModalStyle !== "function") {
			throw new Error("config.theme.createModalStyle must be a function");
		}

		if (typeof theme.createPagedListStyle !== "function") {
			throw new Error("config.theme.createPagedListStyle must be a function");
		}

		if (typeof theme.createNotificationStyle !== "function") {
			throw new Error("config.theme.createNotificationStyle must be a function");
		}

		createButtonStyle = theme.createButtonStyle;
		createInputStyle = theme.createInputStyle;
		createModalStyle = theme.createModalStyle;
		createPagedListStyle = theme.createPagedListStyle;
		createNotificationStyle = theme.createNotificationStyle;

	} else if (typeof theme === "string") {

		if (theme === "theme2") {
			createButtonStyle = createButtonStyleTheme2;
			createInputStyle = createInputStyleTheme2;
			createModalStyle = createModalStyleTheme2;
			createPagedListStyle = createPagedListStyleTheme2;
			createNotificationStyle = createNotificationStyleTheme2;

		} else if (theme === "theme3"){
			createButtonStyle = createButtonStyleTheme3;
			createInputStyle = createInputStyleTheme3;
			createModalStyle = createModalStyleTheme3;
			createPagedListStyle = createPagedListStyleTheme3;
			createNotificationStyle = createNotificationStyleTheme3;
		} else if (theme === "theme4") {
			createButtonStyle = createButtonStyleTheme4;
			createInputStyle = createInputStyleTheme4;
			createModalStyle = createModalStyleTheme4;
			createPagedListStyle = createPagedListStyleTheme4;
			createNotificationStyle = createNotificationStyleTheme4;
		} else {
			createButtonStyle = createButtonStyleDefault;
			createInputStyle = createInputStyleDefault;
			createModalStyle = createModalStyleDefault;
			createPagedListStyle = createPagedListStyleDefault;
			createNotificationStyle = createNotificationStyleDefault;
		}

	} else {
		throw new Error("config.theme should be an object or a string");
	}

	var buttonStyle = createButtonStyle(colorSet);

	registerComponent("knob-button", require("./button/vm"), require("./button/template.html"), buttonStyle);
	registerComponent("knob-input", require("./input/vm"), require("./input/template.html"), createInputStyle(colorSet));
	registerComponent("knob-radio", require("./radio/vm"), require("./radio/template.html"));
	registerComponent("knob-inline-text-editor", require("./inlineTextEditor/vm"), require("./inlineTextEditor/template.html"));
	registerComponent("knob-dropdown", require("./dropdown/vm"), require("./dropdown/template.html"));
	registerComponent(
		"knob-pagination",
		require("./pagination/vm"),
		require("./pagination/template.html"),
		buttonStyle,
		icons.pagination
	);
	registerComponent(
		"knob-items-per-page",
		require("./itemsPerPage/vm"),
		require("./itemsPerPage/template.html"),
		null,
		{
			dropdown: icons.dropdown
		}
	);

	registerComponent(
		"knob-paged-list",
		require("./pagedList/vm"),
		require("./pagedList/template.html"),
		createPagedListStyle(colorSet),
		{
			search: icons.search,
			sort: icons.sort,
			dropdown: icons.dropdown
		},
		{
			noResults: labels.noResults
		}
	);

	registerComponent("knob-modal", require("./modal/vm"), require("./modal/template.html"), createModalStyle(colorSet));
	registerComponent("knob-confirm", require("./modal/confirm/vm"), require("./modal/confirm/template.html"), createModalStyle(colorSet));
	registerComponent("knob-alert", require("./modal/alert/vm"), require("./modal/alert/template.html"), createModalStyle(colorSet));

	registerComponent("knob-tabs", require("./tabs/vm"), require("./tabs/template.html"));
	registerComponent("knob-tab", require("./tabs/tab/vm"), require("./tabs/tab/template.html"), buttonStyle);

	registerComponent("knob-notification", require("./notificationBar/vm"), require("./notificationBar/template.html"), createNotificationStyle(colorSet));
}

module.exports = {
	init: initKnob,

	registerComponent: registerComponent,
	base: {
		vm: baseVm
	}
};
//
},{"./base/vm":7,"./button/style":8,"./button/template.html":9,"./button/theme2":10,"./button/theme3":11,"./button/theme4":12,"./button/vm":13,"./dropdown/template.html":15,"./dropdown/vm":16,"./inlineTextEditor/template.html":17,"./inlineTextEditor/vm":18,"./input/style":19,"./input/template.html":20,"./input/theme2":21,"./input/theme3":22,"./input/theme4":23,"./input/vm":24,"./itemsPerPage/template.html":25,"./itemsPerPage/vm":26,"./knobRegisterComponent":27,"./modal/alert/template.html":29,"./modal/alert/vm":30,"./modal/confirm/template.html":31,"./modal/confirm/vm":32,"./modal/style":33,"./modal/template.html":34,"./modal/theme2":35,"./modal/theme3":36,"./modal/theme4":37,"./modal/vm":38,"./notificationBar/style":39,"./notificationBar/template.html":40,"./notificationBar/theme2":41,"./notificationBar/theme3":42,"./notificationBar/theme4":43,"./notificationBar/vm":44,"./pagedList/style":45,"./pagedList/template.html":46,"./pagedList/theme2":47,"./pagedList/theme3":48,"./pagedList/theme4":49,"./pagedList/vm":50,"./pagination/template.html":51,"./pagination/vm":52,"./radio/template.html":53,"./radio/vm":54,"./tabs/tab/template.html":55,"./tabs/tab/vm":56,"./tabs/template.html":57,"./tabs/vm":58,"extend":1}],15:[function(require,module,exports){
module.exports = '<div class="knob-dropdown">\n	<!-- with params, the selected().label won\'t be recalculated, when selected is changed... -->\n	<div data-bind="component: {\n						name: \'knob-button\',\n						params: {label: selected().label,\n						icon: selected().icon,\n						rightIcon: rightIcon,\n						click: dropdownVisible.toggle}}">\n	</div>\n	<div class="knob-dropdown-menu" data-bind="foreach: options, visible: dropdownVisible">\n		<div data-bind="component: {\n							name: \'knob-button\',\n							params: {label: label, icon: icon, click: select}}, \n							visible: $data !== $parent.selected()">\n		</div>\n	</div>\n</div>\n';
},{}],16:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);


function createButtonDropdown(config) {
	config = config || {};

	if (!config.rightIcon) {
		throw new Error("config.rightIcon element is mandatory!");
	}
	if (!config.items) {
		throw new Error("config.items element is mandatory!");
	}
	if (config.selected && !ko.isObservable(config.selected)) {
		throw new Error("config.selected has to be a knockout observable!");
	}

	if (config.items.length === 0) {
		throw new Error("config.items should not be empty");
	}

	var rightIcon = ko.observable(config.rightIcon);

	var options = ko.observableArray([]);

	for (var idx = 0; idx < config.items.length; idx += 1) {

		if (!config.items[idx].label && !config.items[idx].icon) {
			throw new Error("each element of config.items has to have label and/or icon property");
		}
		options.push(createOption({
			label: config.items[idx].label,
			icon: config.items[idx].icon,
			value: config.items[idx].value
		}));
	}

	// console.log(options());

	var selected = config.selected || ko.observable();

	selected(options()[config.selectedIdx || 0]);

	var dropdownVisible = ko.observable(false);

	dropdownVisible.toggle = function toggleDropdownVisible(item, event) {
		if (event) {
			event.stopPropagation();
		}

		var visible = dropdownVisible();

		dropdownVisible(!visible);

		// should remove this when test in phantomjs
		if (typeof window === "undefined") {
			return;
		}

		if (visible) {
			window.removeEventListener("click", toggleDropdownVisible, false);
		} else {
			window.addEventListener("click", toggleDropdownVisible, false);
		}
	};

	function createOption(config) {
		var obj = {
			label: ko.observable(config.label),
			icon: ko.observable(config.icon),
			value: config.value,
			select: function() {
				selected(obj);
				dropdownVisible.toggle();
			}
		};

		return obj;
	}

	return {
		rightIcon: rightIcon,

		selected: selected,
		options: options,

		dropdownVisible: dropdownVisible
	};
}

module.exports = createButtonDropdown;

},{}],17:[function(require,module,exports){
module.exports = '<span>\n	<span data-bind="visible: !editMode()" class="knob-inlinetext--noedit">\n		<span data-bind="text: value"></span>\n		<knob-button params="label: \'\', click: edit, icon: \'#icon-edit\'">\n	</span>\n	<span data-bind="visible: editMode" class="knob-inlinetext--edit">\n		<knob-input params="value: editedValue, hasFocus: inputHasFocus, keyDown: keyDown, visible: editMode"></knob-input>\n		<knob-button params="label: \'\', click: save, icon: \'#icon-done\'"></knob-button>\n		<knob-button params="label: \'\', click: cancel, icon: \'#icon-close\'"></knob-button>\n	</span>\n</span>';
},{}],18:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

function createInlineTextEditor(config) {
	var vm = {};

	var config = config || {};

	if (config.value && !ko.isObservable(config.value)) {
		throw new Error("config.value has to be an observable!");
	}

	vm.value = config.value || ko.observable("");
	vm.editedValue = ko.observable(vm.value());

	vm.editMode = ko.observable(false);

	vm.edit = function() {
		vm.editedValue(vm.value());
		vm.editMode(true);
		vm.inputHasFocus(true);
	};

	vm.save = function() {
		vm.value(vm.editedValue());
		vm.editMode(false);
	};

	vm.cancel = function() {
		vm.editMode(false);
	};

	vm.keyDown = function(item, event) {
		if (event.keyCode === 13) {
			return vm.save();
		}

		if (event.keyCode === 27) {
			return vm.cancel();
		}
		return true;
	};

	vm.inputHasFocus = ko.observable(false);

	return vm;
}

module.exports = createInlineTextEditor;

},{}],19:[function(require,module,exports){
module.exports = function createStyleConfig(theme) {
	return {
		"default": {
			"default": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"border-color": theme.darkGray
			},
			"hover": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"border-color": theme.darkGray
			},
			"active": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"fill": theme.black
			},
			"disabled": {
				"backgroundColor": theme.lightGray,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		}
	};
};

},{}],20:[function(require,module,exports){
module.exports = '<input data-bind="css: cssClass,\n					style: style,\n					attr: {type: type, placeholder: placeholder},\n					event: eventHandlers,\n					hasFocus: hasFocus,\n					disable: state() === \'disabled\',\n					value: value,\n					valueUpdate: \'afterkeydown\'" />';
},{}],21:[function(require,module,exports){
module.exports = function createStyleConfig(theme) {
	return {
		"default": {
			"default": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"border-color": theme.darkGray
			},
			"hover": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"border-color": theme.darkGray
			},
			"active": {
				"backgroundColor": theme.white,
				"color": theme.primaryColor,
				"fill": theme.primaryColor
			},
			"disabled": {
				"backgroundColor": theme.lightGray,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		}
	};
};


},{}],22:[function(require,module,exports){
module.exports = function createStyleConfig(theme) {
	return {
		"default": {
			"default": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"border-color": theme.darkGray
			},
			"hover": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"border-color": theme.darkGray
			},
			"active": {
				"backgroundColor": theme.white,
				"color": theme.primaryColor,
				"fill": theme.primaryColor
			},
			"disabled": {
				"backgroundColor": theme.lightGray,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		}
	};
};

},{}],23:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],24:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

var base = require("../base/vm");

function createInput(config) {

	if (!config) {
		throw new Error("config is mandatory!");
	}

	if (config.value && !ko.isObservable(config.value)) {
		throw new Error("config.value must be an observable");
	}

	if (config.hasFocus && !ko.isObservable(config.hasFocus)) {
		throw new Error("config.hasFocus must be an observable");
	}

	config.component = "input";
	config.type = config.type || "text";
	config.placeholder = config.placeholder || "";

	var vm = base(config);

	vm.behaviours.hover.enable();
	vm.behaviours.focus.enable();

	vm.placeholder = config.placeholder;
	vm.type = config.type;
	vm.value = config.value || ko.observable();
	vm.hasFocus = config.hasFocus || ko.observable(false);

	if (config.keyDown) {
		vm.eventHandlers.keydown = config.keyDown;
	}

	return vm;
}

module.exports = createInput;

},{"../base/vm":7}],25:[function(require,module,exports){
module.exports = '<knob-dropdown params="\n	rightIcon: icons.dropdown,\n	selected: itemsPerPage,\n	items: itemsPerPageList">\n</knob-dropdown>';
},{}],26:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

module.exports = function createItemsPerPage(config) {
	config = config || {};

	if (!config.numOfItems) {
		throw new Error("config.numOfItems element is mandatory!");
	}

	if (config.itemsPerPageList) {
		for (var i = 0; i < config.itemsPerPageList.length; i += 1) {

			if (!config.itemsPerPageList[i].value && !config.itemsPerPageList[i].label) {
				throw new Error("each element of config.items has to have label and/or value property");
			}

		}
	}

	var numOfItems = config.numOfItems;

	var itemsPerPageList = config.itemsPerPageList || [{
		label: 10,
		value: 10
	}, {
		label: 25,
		value: 25
	}, {
		label: 50,
		value: 50
	}, {
		label: 100,
		value: 100
	}];

	var itemsPerPage = ko.observable(itemsPerPageList[0]);

	var numOfPages = config.numOfPages || ko.observable();

	ko.computed(function() {
		var numOfItemsVal = numOfItems();
		var itemsPerPageVal = itemsPerPage();

		if (!itemsPerPageVal) {
			return numOfPages(0);
		}

		if (config.itemsPerPage) {
			config.itemsPerPage(itemsPerPageVal.value);
		}

		return numOfPages(Math.ceil(numOfItemsVal / itemsPerPageVal.value));
	});

	return {
		numOfItems: numOfItems,
		itemsPerPage: itemsPerPage,
		numOfPages: numOfPages,

		itemsPerPageList: itemsPerPageList,

		icons: config.icons
	};
};

},{}],27:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

function knobRegisterComponent(name, createVm, template, style, icons, labels) {
	ko.components.register(name, {
		viewModel: {
			createViewModel: function(params, componentInfo) {
				params.style = style;
				params.icons = icons;
				params.labels = labels;
				return createVm(params, componentInfo);
			}
		},
		template: template
	});
}

module.exports = knobRegisterComponent;

},{}],28:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

module.exports = function createList(config) {
	config = config || {};

	if (!config.hasOwnProperty("store")) {
		throw new Error("config.store is mandatory!");
	}

	if (!config.hasOwnProperty("fields")) {
		throw new Error("config.fields is mandatory!");
	}

	if (!config.hasOwnProperty("sort")) {
		throw new Error("config.sort is mandatory!");
	}

	if (!config.hasOwnProperty("search")) {
		throw new Error("config.search is mandatory!");
	}

	if (typeof config.store !== "object") {
		throw new Error("config.search must be an object!");
	}

	if (!(config.fields instanceof Array)) {
		throw new Error("config.fields must be an array!");
	}

	if (!(config.sort instanceof Array)) {
		throw new Error("config.sort must be an array!");
	}

	if (typeof config.search !== "string") {
		throw new Error("config.search must be a string!");
	}

	if (config.fields.indexOf(config.search) === -1) {
		throw new Error("config.fields must contain the value of config.search!");
	}

	var orderField;

	if (config.orderBy) {
		if (typeof config.orderBy !== "object") {
			throw new Error("config.orderBy must have the format of { <key>: [1;-1] } ");
		}

		orderField = Object.keys(config.orderBy)[0];
		if (config.fields.indexOf(orderField) === -1 || Math.abs(config.orderBy[orderField]) !== 1) {
			throw new Error("config.orderBy must have the format of { <key>: [1;-1] } ");
		}

		var sortContainsOrderField = false;

		config.sort.forEach(function(item) {
			if (item.value === orderField) {
				sortContainsOrderField = true;
				return;
			}
		});

		if (!sortContainsOrderField) {
			throw new Error("config.sort must contain the value of config.orderBy!");
		}
	}

	config.sort.forEach(function(item) {
		if (config.fields.indexOf(item.value) === -1) {
			throw new Error("values of config.sort must be in config.fields!");
		}
	});

	var store = config.store;
	var fields = config.fields;

	var search = ko.observable("").extend({
		throttle: config.throttle || 500
	});

	var sortOptions = [];

	var defaultOrderIdx;

	function createQueryObj(prop, asc) {
		var obj = {};

		obj[prop] = asc;

		if (orderField && prop === orderField && asc === config.orderBy[orderField]) {
			defaultOrderIdx = sortOptions.length;
		}

		return obj;
	}

	for (var idx = 0; idx < config.sort.length; idx += 1) {
		var act = config.sort[idx];

		var ascIcon = config.icons ? config.icons.sort.asc : "";
		var descIcon = config.icons ? config.icons.sort.desc : "";

		sortOptions.push({
			icon: ascIcon,
			label: act.label,
			value: createQueryObj(act.value, 1)
		});
		sortOptions.push({
			icon: descIcon,
			label: act.label,
			value: createQueryObj(act.value, -1)
		});
	}

	var sort = ko.observable(sortOptions[defaultOrderIdx || 0]);
	var sortIdx = defaultOrderIdx || 0;

	var skip = ko.observable(0);
	var limit = ko.observable(0);

	var items = ko.observableArray([]);

	store.items.forEach(function(item) { //store === this
		items.push(item);
	});

	var count = ko.observable(0); //should be read-only

	var loading = ko.observable(false); //should be read-only
	var error = ko.observable(false); //should be read-only?

	ko.computed(function() {
		var searchVal = search();
		var sortVal = sort().value;
		var skipVal = skip();
		var limitVal = limit();

		var find = {};

		find[config.search] = (new RegExp(searchVal, "ig")).toString();

		store.find = find;
		store.sort = sortVal;
		store.skip = skipVal;
		store.limit = limitVal;
	}).extend({
		throttle: 0
	});

	function beforeLoad() {
		if (loading()) {
			console.log("List is already loading..."); //this might be problematic if there are no good timeout settings.
		}

		loading(true);
	}

	function afterLoad(err) {
		loading(false);
		if (err) {
			return error(err);
		}
		error(null);

		store.items.forEach(function(item) { //store === this
			items.push(item);
		});

		count(store.count);
	}

	function readOnlyComputed(observable) {
		return ko.computed({
			read: function() {
				return observable();
			},
			write: function() {
				throw "This computed variable should not be written.";
			}
		});
	}

	store.load.before.add(beforeLoad);
	store.load.after.add(afterLoad);

	return {
		store: store,

		fields: fields, //should filter to the fields. (select)

		search: search,

		sort: sort,
		sortIdx: sortIdx,
		sortOptions: sortOptions,

		skip: skip,
		limit: limit,

		items: items,
		count: readOnlyComputed(count),

		loading: readOnlyComputed(loading),
		error: readOnlyComputed(error)
	};
};

},{}],29:[function(require,module,exports){
module.exports = '<div>\n	<knob-modal params="\n		title: title,\n		icon: icon,\n		visible: visible">\n\n		<div class="knob-confirm__content" data-bind="text: message"></div>\n		<div class="knob-confirm__buttons">\n			<knob-button params="\n				label: okLabel,\n				variation: \'primary\',\n				click: ok\n			"></knob-button>\n		</div>\n	</knob-modal>\n</div>\n';
},{}],30:[function(require,module,exports){
"use strict";

var ko = (window.ko);

module.exports = function createAlert(config) {

	if (!config) {
		throw new Error("config is mandatory!");
	}

	if (typeof config.message !== "string") {
		throw new Error("config.message must be a string");
	}

	if (typeof config.okLabel !== "string") {
		throw new Error("config.okLabel must be a string");
	}

	if (!ko.isObservable(config.visible)) {
		throw new Error("config.visible must be an observable");
	}

	if (typeof config.callback !== "function") {
		throw new Error("config.callback must be a function");
	}

	var visible = config.visible;
	var okLabel = config.okLabel;
	var callback = config.callback;

	var title = config.title || "";
	var icon = config.icon || "";
	var message = config.message;

	var okLabel = config.okLabel;

	function ok() {
		callback();
		visible(!visible());
	}

	return {
		visible: visible,

		title: title,
		icon: icon,
		message: message,

		okLabel: okLabel,

		ok: ok
	};
};

},{}],31:[function(require,module,exports){
module.exports = '<div class="knob-confirm">\n	<knob-modal params="\n		title: title,\n		icon: icon,\n		visible: visible">\n		<div class="knob-confirm__content" data-bind="text: message"></div>\n		<div class="knob-confirm__buttons">\n			<knob-button params="\n				label: okLabel,\n				variation: \'primary\',\n				click: ok\n			"></knob-button>\n			<knob-button params="\n				label: cancelLabel,\n				click: cancel\n			"></knob-button>\n		</div>\n	</knob-modal>\n</div>\n';
},{}],32:[function(require,module,exports){
"use strict";

function createConfirmModal(config) {
	if (!config) {
		throw new Error("config is mandatory!");
	}

	if (!config.message) {
		throw new Error("config.message element is mandatory!");
	}

	if (!config.okLabel) {
		throw new Error("config.okLabel element is mandatory!");
	}

	if (!config.cancelLabel) {
		throw new Error("config.cancelLabel element is mandatory!");
	}

	config = config || {};

	var visible = config.visible;
	var callback = config.callback;

	var title = config.title || "";
	var icon = config.icon || "";
	var message = config.message;

	var okLabel = config.okLabel;
	var cancelLabel = config.cancelLabel;


	function ok() {
		callback(true);
		visible(!visible());
	}

	function cancel() {
		callback(false);
		visible(!visible());
	}

	return {
		visible: visible,

		title: title,
		icon: icon,
		message: message,

		okLabel: okLabel,
		cancelLabel: cancelLabel,

		ok: ok,
		cancel: cancel
	};
}

module.exports = createConfirmModal;
},{}],33:[function(require,module,exports){
module.exports = function createStyleConfig(theme) {
	return {
		"default": {
			"default": {
				"backgroundColor": theme.darkGray,
				"border-color": theme.darkGray,
				"color": theme.white,
				"fill": theme.white
			}
		}
	};
};

},{}],34:[function(require,module,exports){
module.exports = '<div class="knob-modal-overlay" data-bind="visible: visible">\n\n	<div class="knob-modal">\n		<div class="knob-modal__header" data-bind="style: style">\n			<knob-button class="button-close" params="variation: \'modalHead\', icon: \'#icon-close\', click: $component.visible.toggle"></knob-button>\n\n			<span class="desc">\n				<svg class="icon">\n					<use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': icon}" xlink:href=""></use>\n				</svg>\n				<span data-bind="text: title"></span>\n			</span>\n\n		</div>\n		<div class="knob-modal__body">\n			<!-- ko template: { nodes: $componentTemplateNodes, data: $parent } --><!-- /ko -->\n		</div>\n	</div>\n</div>\n';
},{}],35:[function(require,module,exports){
module.exports = function createStyleConfig(theme) {

	var tinycolor = require("tinycolor2");

	return {
		"default": {
			"default": {
				"backgroundColor": theme.secondaryColor,
				"border-color": theme.secondaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": tinycolor(theme.secondaryColor).darken().toString(),
				"color": theme.black,
				"border-color": tinycolor(theme.mediumGray).darken.toString()
			},
			"active": {
				"color": tinycolor(theme.mediumGray).darken.toString(),
				"fill": tinycolor(theme.mediumGray).darken.toString()
			},
			"disabled": {
				"backgroundColor": theme.lightGray,
				"color": theme.black
			},
			"success": {
				"backgroundColor": theme.successColor,
				"color": theme.white,
				"fill": theme.white
			},
			"error": {
				"backgroundColor": theme.alertColor,
				"color": theme.white,
				"fill": theme.white
			}
		}
	};
};

},{"tinycolor2":2}],36:[function(require,module,exports){
module.exports = function createStyleConfig(theme) {

	var tinycolor = require("tinycolor2");

	return {
		"default": {
			"default": {
				"backgroundColor": theme.secondaryColor,
				"border-color": theme.secondaryColor,
				"color": theme.white,
				"fill": theme.white

			},
			"hover": {
				"backgroundColor": tinycolor(theme.secondaryColor).darken().toString(),
				"color": theme.black,
				"border-color": tinycolor(theme.mediumGray).darken.toString()
			},
			"active": {
				"color": tinycolor(theme.mediumGray).darken.toString(),
				"fill": tinycolor(theme.mediumGray).darken.toString()
			},
			"disabled": {
				"backgroundColor": theme.lightGray,
				"color": theme.black
			},
			"success": {
				"backgroundColor": theme.successColor,
				"color": theme.white,
				"fill": theme.white
			},
			"error": {
				"backgroundColor": theme.alertColor,
				"color": theme.white,
				"fill": theme.white
			}
		}
	};
};

},{"tinycolor2":2}],37:[function(require,module,exports){
module.exports = function createStyleConfig(theme) {
	return {
		"default": {
			"default": {
				"backgroundColor": theme.secondaryColor,
				"border-color": theme.secondaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": theme.primaryColor,
				"color": theme.black,
				"border-color": theme.darkGray
			},
			"active": {
				"backgroundColor": theme.primaryColor,
				"color": theme.primaryColor,
				"fill": theme.primaryColor
			},
			"disabled": {
				"backgroundColor": theme.lightGray,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		}
	};
};

},{}],38:[function(require,module,exports){
"use strict";
var ko = (window.ko);
var base = require("../base/vm");

function createModal(config) {

	if (!config) {
		throw new Error("config is mandatory!");
	}

	if (config.visible && !ko.isObservable(config.visible)) {
		throw new Error("config.visible must be an observable");
	}

	config = config || {};

	var visible = config.visible;
	var title = config.title;
	var icon = config.icon;

	visible.toggle = function() {
		visible(!visible());
	};

	config.component = "modal";

	var vm = base(config);

	vm.visible = visible;
	vm.title = title;
	vm.icon = icon;

	return vm;
}

module.exports = createModal;
},{"../base/vm":7}],39:[function(require,module,exports){
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
},{}],40:[function(require,module,exports){
module.exports = '<div class="knob-notification" data-bind="visible: visible, style: style">\n\n	<svg class="icon">\n		<use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': icon}" xlink:href=""></use>\n	</svg>\n	<span data-bind="text: message"></span>\n	<!-- ko template: { nodes: $componentTemplateNodes, data: $parent } --><!-- /ko -->\n</div>';
},{}],41:[function(require,module,exports){
module.exports = function createStyleConfig(theme) {
	return {
		"default": {
			"default": {
				"backgroundColor": theme.black,
				"borderColor": theme.black,
				"color": theme.white,
				"fill": theme.white
			}
		},
		"info": {
			"default": {
				"backgroundColor": theme.white,
				"borderColor": theme.info.background,
				"color": theme.info.text,
				"fill": theme.info.text
			}
		},
		"success": {
			"default": {
				"backgroundColor": theme.white,
				"borderColor": theme.success.background,
				"color": theme.success.text,
				"fill": theme.success.text
			}
		},
		"warning": {
			"default": {
				"backgroundColor": theme.white,
				"borderColor": theme.warning.background,
				"color": theme.warning.text,
				"fill": theme.warning.text
			}
		},
		"error": {
			"default": {
				"backgroundColor": theme.white,
				"borderColor": theme.error.background,
				"color": theme.error.text,
				"fill": theme.error.text
			}
		}
	};
};
},{}],42:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],43:[function(require,module,exports){
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
				"color": theme.white,
				"fill": theme.white
			}
		},
		"success": {
			"default": {
				"backgroundColor": theme.success.background,
				"color": theme.white,
				"fill": theme.white
			}
		},
		"warning": {
			"default": {
				"backgroundColor": theme.warning.background,
				"color": theme.white,
				"fill": theme.white
			}
		},
		"error": {
			"default": {
				"backgroundColor": theme.error.background,
				"color": theme.white,
				"fill": theme.white
			}
		}
	};
};
},{}],44:[function(require,module,exports){
"use strict";
var ko = (window.ko);
var base = require("../base/vm");

function createNotification(config) {

	if (!config) {
		throw new Error("config is mandatory!");
	}

	if (!config.message) {
		throw new Error("config.message element is mandatory!");
	}

	if (config.visible && !ko.isObservable(config.visible)) {
		throw new Error("config.visible must be an observable");
	}

	config = config || {};

	var visible = config.visible;
	var message = config.message;
	var icon = config.icon;

	visible.toggle = function() {
		visible(!visible());
	};

	config.component = "notification";

	var vm = base(config);

	vm.visible = visible;
	vm.message = message;
	vm.icon = icon;

	return vm;
}

module.exports = createNotification;
},{"../base/vm":7}],45:[function(require,module,exports){
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

},{}],46:[function(require,module,exports){
module.exports = '<div class="knob-pagelist">\n	<!-- ko if: error -->\n		<div data-bind="text: error"></div>\n	<!-- /ko -->\n\n	<div>\n		<div class="knob-pagelist__bar">\n			<input class="knob-input" type="text" data-bind="value: search, valueUpdate: \'afterkeydown\'"/>\n			<knob-button class="knob-button-search" params="label: \'\',\n								variation: \'default\',\n								icon: icons.search">\n			</knob-button>\n			<knob-items-per-page class="knob-pagelist__items-per-page" params="\n				numOfItems: count,\n				numOfPages: numOfPages,\n				itemsPerPage: itemsPerPage">\n			</knob-items-per-page>\n			<!-- ko if: sortOptions.length > 0 -->\n				<knob-dropdown class="knob-dropdown" params="rightIcon: icons.dropdown, selectedIdx: sortIdx, selected: sort, items: sortOptions"></knob-dropdown>\n			<!-- /ko -->\n		</div>\n		<ul data-bind="css: listClass, foreach: items">\n			<li data-bind="css: $parent.itemClass">\n				<!-- ko template: { nodes: $componentTemplateNodes, data: {model: $data, parent: $parent, index: $index} } --><!-- /ko -->\n			</li>\n		</ul>\n		<!-- ko if: items().length === 0 -->\n			<span class="no-result" data-bind="visible: !loading(), text: labels.noResults"></span>\n		<!-- /ko -->\n	</div>\n\n	<div class="loading" data-bind="visible: loading">\n		<svg class="anim-rotate"><use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': icons.loading}" xlink:href=""></use></svg>\n	</div>\n	<!--\n	<knob-pagination params="numOfItems: pagination.numOfItems, itemsPerPage: itemsPerPage"></knob-pagination>\n	-->\n	<!-- ko if: numOfPages() > 0 -->\n		<knob-pagination params="numOfPages: numOfPages, currentPage: currentPage"></knob-pagination>\n	<!-- /ko -->\n	<!-- ko if: $data.loadMore -->\n		<div data-bind="visible: !loading(), click: loadMore">Load more...</div>\n	<!-- /ko -->\n</div>';
},{}],47:[function(require,module,exports){
module.exports = function createStyleConfig(theme) {

	var tinycolor = require("tinycolor2");

	return {
		"default": {
			"default": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"border-color": theme.mediumGray
			},
			"hover": {
				"backgroundColor": tinycolor(theme.white).darken().toString(),
				"color": theme.black,
				"border-color": tinycolor(theme.mediumGray).darken.toString()
			},
			"active": {
				"color": tinycolor(theme.mediumGray).darken.toString(),
				"fill": tinycolor(theme.mediumGray).darken.toString()
			},
			"disabled": {
				"backgroundColor": theme.lightGray,
				"color": theme.black
			},
			"success": {
				"backgroundColor": theme.successColor,
				"color": theme.white,
				"fill": theme.white
			},
			"error": {
				"backgroundColor": theme.alertColor,
				"color": theme.white,
				"fill": theme.white
			}
		}
	};
};

},{"tinycolor2":2}],48:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"dup":47,"tinycolor2":2}],49:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"dup":47,"tinycolor2":2}],50:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);
var createList = require("../list/vm");

module.exports = function createPagedList(config) {
	config = config || {};

	if (!config.store) {
		throw new Error("config.store is mandatory!");
	}

	var store = config.store;

	store.load.before.add(beforeLoad);

	var list = createList(config);
	//var pagination = createPagination(config.pagination);
	//list.pagination = pagination;

	var numOfPages = ko.observable();
	var itemsPerPage = ko.observable(10);
	var currentPage = ko.observable(0);

	list.listClass = config.listClass || "knob-pagedlist__list";
	list.itemClass = config.itemClass || "knob-pagedlist__item";
	list.numOfPages = numOfPages;
	list.itemsPerPage = itemsPerPage;
	list.currentPage = currentPage;

	list.icons = config.icons;
	list.labels = config.labels;

	ko.computed(function() {
		var currentPageVal = currentPage();
		var itemsPerPageVal = itemsPerPage();

		list.skip(currentPageVal * itemsPerPageVal);
		list.limit(itemsPerPageVal);
	});

	/*
	ko.computed(function() {
		var count = list.count();
		list.pagination.numOfItems(count);
	});
	*/

	function beforeLoad() {
		list.items([]);
	}

	return list;
};

},{"../list/vm":28}],51:[function(require,module,exports){
module.exports = '<div class="knob-pagination" data-bind="if: pageSelectors().length">\n	<span data-bind="component: {\n						name: \'knob-button\',\n						params: {\n							variation: \'pagination\',\n							icon: icons.first,\n							state: first().state,\n							click: first().selectPage\n						}\n					}">\n	</span>\n	<span data-bind="component: {\n						name: \'knob-button\',\n						params: {\n							variation: \'pagination\',\n							icon: icons.prev,\n							state: prev().state,\n							click: prev().selectPage\n						}\n					}">\n	</span>\n	<span data-bind="foreach: pageSelectors">\n		<knob-button params="label: label,\n							state: state,\n							variation: \'pagination\',\n							click: selectPage"></knob-button>\n	</span>\n	<span data-bind="component: {\n						name: \'knob-button\',\n						params: {\n							variation: \'pagination\',\n							icon: icons.next,\n							state: next().state,\n							click: next().selectPage\n						}\n					}">\n	</span>\n	<span data-bind="component: {\n						name: \'knob-button\',\n						params: {\n							variation: \'pagination\',\n							icon: icons.last,\n							state: last().state,\n							click: last().selectPage\n						}\n					}">\n	</span>\n</div>';
},{}],52:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

module.exports = function createPagination(config) {
	config = config || {};

	if (config.afterHead && config.afterHead < 1) {
		throw new Error("config.afterHead must be larger than zero");
	}

	if (config.beforeTail && config.beforeTail < 1) {
		throw new Error("config.beforeTail must be larger than zero");
	}

	if (config.beforeCurrent && config.beforeCurrent < 1) {
		throw new Error("config.beforeCurrent must be larger than zero");
	}

	if (config.afterCurrent && config.afterCurrent < 1) {
		throw new Error("config.afterCurrent must be larger than zero");
	}

	var numOfPages;

	if (ko.isObservable(config.numOfPages)) {
		numOfPages = config.numOfPages;
	} else {
		numOfPages = ko.observable(config.numOfPages || 10);
	}

	function normalize(value) {
		if (value < 0) {
			value = 0;
		}

		var pagesNum = numOfPages();

		if (value >= pagesNum) {
			value = pagesNum - 1;
		}

		return value;
	}

	var currentPage = (function() {
		var currentPage = ko.observable();

		ko.computed(function() {
			numOfPages();
			currentPage(0);
		});

		if (ko.isObservable(config.currentPage)) {
			currentPage = config.currentPage;
		} else {
			currentPage = ko.observable(normalize(config.currentPage) || 0);
		}

		return ko.computed({
			read: function() {
				return currentPage();
			},
			write: function(value) {
				currentPage(normalize(value));
			}
		});
	}());



	var currentPageRealIdx;
	var pageSelectors = (function(config) {
		var afterHead = config.afterHead || 2;
		var beforeTail = config.beforeTail || 2;
		var beforeCurrent = config.beforeCurrent || 2;
		var afterCurrent = config.afterCurrent || 2;

		function createPageSelector(idx) {
			return {
				label: idx + 1,
				state: "default",
				selectPage: function() {
					currentPage(idx);
				}
			};
		}

		function createNonClickableSelector(label) {
			return {
				label: label,
				state: "disabled",
				selectPage: function() {}
			};
		}

		return ko.computed(function() {
			var elements = [];

			var numOfPagesVal = numOfPages();
			var currentPageVal = currentPage();

			var nonClickableInserted = false;

			for (var idx = 0; idx < numOfPagesVal; idx += 1) {
				if (idx <= afterHead || idx >= numOfPagesVal - beforeTail - 1 || idx >= currentPageVal - beforeCurrent && idx <= currentPageVal + afterCurrent) {
					var pageSelector;

					if (idx === currentPageVal) {
						pageSelector = createNonClickableSelector(idx + 1);
						currentPageRealIdx = elements.length;
					} else {
						pageSelector = createPageSelector(idx);
					}

					elements.push(pageSelector);
					nonClickableInserted = false;
				} else {
					if (!nonClickableInserted) {
						elements.push(createNonClickableSelector("..."));
					}
					nonClickableInserted = true;
				}
			}

			return elements;
		});
	}(config));


	var next = ko.computed(function() {
		var idx = currentPageRealIdx + 1;

		var pages = pageSelectors();

		if (idx >= pages.length - 1) {
			idx = pages.length - 1;
		}

		return pages[idx];
	});

	var prev = ko.computed(function() {
		var idx = currentPageRealIdx - 1;

		if (idx < 0) {
			idx = 0;
		}

		return pageSelectors()[idx];
	});

	var first = ko.computed(function() {
		return pageSelectors()[0];
	});

	var last = ko.computed(function() {
		var pages = pageSelectors();

		return pages[pages.length - 1];
	});


	return {
		pageSelectors: pageSelectors,

		first: first,
		last: last,

		next: next,
		prev: prev,

		currentPage: currentPage,

		numOfPages: numOfPages,

		icons: config.icons
	};
};

},{}],53:[function(require,module,exports){
module.exports = '<div class="knob-radio" data-bind="foreach: items">\n	<div data-bind="component: {\n		name: \'knob-button\',\n		params: {\n			state: isSelected() ? \'active\' : \'default\',\n			variation: $parent.variation,\n			label: label,\n			icon: icon,\n			radio: true,\n			group: group,\n			click: select\n		}\n	}">\n	</div>\n</div>\n';
},{}],54:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

function createRadio(config) {

	config = config || {};

	var vm = {};

	if (config.items.length === 0) {
		throw new Error("config.items should not be empty");
	}

	vm.selected = config.selected || ko.observable();
	vm.selectedIdx = config.selectedIdx || ko.observable();

	vm.variation = config.variation || "default";

	vm.items = [];

	for (var idx = 0; idx < config.items.length; idx += 1) {

		var act = config.items[idx];

		if (!act.label && !act.icon) {
			throw new Error("each element of config.items has to have label and/or icon property");
		}

		vm.items.push(createItemVm(act.label, act.icon, idx));
	}

	var sel = vm.selectedIdx();

	if (typeof sel === "number") {
		sel = Math.floor(sel);
		sel %= vm.items.length;

		vm.items[sel].select();

	} else {
		vm.items[0].select();
	}

	function createItemVm(label, icon, idx) {

		var obj = {
			label: label,
			icon: icon,
			group: config.group,
			select: function() {
				vm.selected(obj);
				vm.selectedIdx(idx);
			},
			isSelected: function() {
				return obj === vm.selected();
			}
		};

		return obj;
	}

	return vm;
}

module.exports = createRadio;

},{}],55:[function(require,module,exports){
module.exports = '<div data-bind="css: cssClass,\n					style: style">\n	<!-- ko template: { nodes: $componentTemplateNodes, data: $parent } --><!-- /ko -->\n</div>';
},{}],56:[function(require,module,exports){
/*jslint node: true */
"use strict";

var base = require("../../base/vm");

function createTab(config) {
	config = config || {};
	config.component = "tab";
	config.variation = "tab";
	config.state = "active";

	var vm = base(config);

	return vm;
}

module.exports = createTab;

},{"../../base/vm":7}],57:[function(require,module,exports){
module.exports = '<div>\n	<knob-radio params="\n		group: tabsGroup,\n		variation: \'tab\',\n		selectedIdx: selectedIdx,\n		items: buttons">\n	</knob-radio>\n\n	<div class="knob-panel-group" data-bind="foreach: panels">\n		<knob-tab data-bind="visible: $parent.selectedIdx() == $index()">\n			<!-- ko template: { nodes: $data } --><!-- /ko -->\n		</knob-tab>\n	</div>\n</div>';
},{}],58:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

var nextTabsGroupIdx = 0;

function convertParamsToObject(params) {
	params = params.replace(/'/g, "\"");

	var params = params.split(",");

	var convertedParams = [];

	for (var idx = 0; idx < params.length; idx += 1) {
		var act = params[idx];

		act = act.trim();

		act = act.split(":");

		if (act.length !== 2) {
			continue;
		}

		act = "\"" + act[0] + "\"" + ":" + act[1];
		convertedParams.push(act);
	}

	return JSON.parse("{" + convertedParams.join(",") + "}");
}

function createTabs(config, componentInfo) {
	config = config || {};
	componentInfo = componentInfo || {};
	componentInfo.templateNodes = componentInfo.templateNodes || [];

	var defaultTab = config.defaultTab || 0;

	var vm = {};

	var tabButtons = [];
	var tabPanels = [];

	var tabIdx = 0;

	for (var idx = 0; idx < componentInfo.templateNodes.length; idx += 1) {
		var actTemplateNode = componentInfo.templateNodes[idx];

		if (actTemplateNode.nodeName.toLowerCase() !== "knob-tab") {
			continue;
		}

		var tabButtonData = convertParamsToObject(actTemplateNode.getAttribute("params"));

		tabButtonData.tabIdx = tabIdx;
		tabIdx += 1;

		tabButtons.push(tabButtonData);

		tabPanels.push(actTemplateNode.childNodes);
	}

	if (tabPanels.length < 1) {
		throw new Error("knob-tabs component should have at least one knob-tab component as a child component!");
	}

	for (var idx = 0; idx < tabButtons.length; idx += 1) {
		var act = tabButtons[idx];

		if (!act.icon && !act.leftIcon && !act.rightIcon && !act.label) {
			throw new Error("The child knob-tab components should have proper params (icon and/or label) just like with buttons!");
		}
	}

	vm.tabsGroup = "tabsGroup_" + nextTabsGroupIdx;
	nextTabsGroupIdx += 1;

	vm.selectedIdx = ko.observable(defaultTab);

	vm.buttons = tabButtons;
	vm.panels = tabPanels;

	return vm;
}

module.exports = createTabs;

},{}]},{},[14])(14)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZXh0ZW5kL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Rpbnljb2xvcjIvdGlueWNvbG9yLmpzIiwic3JjL2Jhc2UvYmVoYXZpb3Vycy9jbGljay5qcyIsInNyYy9iYXNlL2JlaGF2aW91cnMvZm9jdXMuanMiLCJzcmMvYmFzZS9iZWhhdmlvdXJzL2hvdmVyLmpzIiwic3JjL2Jhc2UvYmVoYXZpb3Vycy9zZWxlY3QuanMiLCJzcmMvYmFzZS92bS5qcyIsInNyYy9idXR0b24vc3R5bGUuanMiLCJzcmMvYnV0dG9uL3RlbXBsYXRlLmh0bWwiLCJzcmMvYnV0dG9uL3RoZW1lMi5qcyIsInNyYy9idXR0b24vdGhlbWUzLmpzIiwic3JjL2J1dHRvbi90aGVtZTQuanMiLCJzcmMvYnV0dG9uL3ZtLmpzIiwic3JjL2NvbXBvbmVudHMuanMiLCJzcmMvZHJvcGRvd24vdGVtcGxhdGUuaHRtbCIsInNyYy9kcm9wZG93bi92bS5qcyIsInNyYy9pbmxpbmVUZXh0RWRpdG9yL3RlbXBsYXRlLmh0bWwiLCJzcmMvaW5saW5lVGV4dEVkaXRvci92bS5qcyIsInNyYy9pbnB1dC9zdHlsZS5qcyIsInNyYy9pbnB1dC90ZW1wbGF0ZS5odG1sIiwic3JjL2lucHV0L3RoZW1lMi5qcyIsInNyYy9pbnB1dC90aGVtZTMuanMiLCJzcmMvaW5wdXQvdm0uanMiLCJzcmMvaXRlbXNQZXJQYWdlL3RlbXBsYXRlLmh0bWwiLCJzcmMvaXRlbXNQZXJQYWdlL3ZtLmpzIiwic3JjL2tub2JSZWdpc3RlckNvbXBvbmVudC5qcyIsInNyYy9saXN0L3ZtLmpzIiwic3JjL21vZGFsL2FsZXJ0L3RlbXBsYXRlLmh0bWwiLCJzcmMvbW9kYWwvYWxlcnQvdm0uanMiLCJzcmMvbW9kYWwvY29uZmlybS90ZW1wbGF0ZS5odG1sIiwic3JjL21vZGFsL2NvbmZpcm0vdm0uanMiLCJzcmMvbW9kYWwvc3R5bGUuanMiLCJzcmMvbW9kYWwvdGVtcGxhdGUuaHRtbCIsInNyYy9tb2RhbC90aGVtZTIuanMiLCJzcmMvbW9kYWwvdGhlbWUzLmpzIiwic3JjL21vZGFsL3RoZW1lNC5qcyIsInNyYy9tb2RhbC92bS5qcyIsInNyYy9ub3RpZmljYXRpb25CYXIvc3R5bGUuanMiLCJzcmMvbm90aWZpY2F0aW9uQmFyL3RlbXBsYXRlLmh0bWwiLCJzcmMvbm90aWZpY2F0aW9uQmFyL3RoZW1lMi5qcyIsInNyYy9ub3RpZmljYXRpb25CYXIvdGhlbWU0LmpzIiwic3JjL25vdGlmaWNhdGlvbkJhci92bS5qcyIsInNyYy9wYWdlZExpc3Qvc3R5bGUuanMiLCJzcmMvcGFnZWRMaXN0L3RlbXBsYXRlLmh0bWwiLCJzcmMvcGFnZWRMaXN0L3RoZW1lMi5qcyIsInNyYy9wYWdlZExpc3Qvdm0uanMiLCJzcmMvcGFnaW5hdGlvbi90ZW1wbGF0ZS5odG1sIiwic3JjL3BhZ2luYXRpb24vdm0uanMiLCJzcmMvcmFkaW8vdGVtcGxhdGUuaHRtbCIsInNyYy9yYWRpby92bS5qcyIsInNyYy90YWJzL3RhYi90ZW1wbGF0ZS5odG1sIiwic3JjL3RhYnMvdGFiL3ZtLmpzIiwic3JjL3RhYnMvdGVtcGxhdGUuaHRtbCIsInNyYy90YWJzL3ZtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOW9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdk1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUxBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pOQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BMQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG52YXIgaXNBcnJheSA9IGZ1bmN0aW9uIGlzQXJyYXkoYXJyKSB7XG5cdGlmICh0eXBlb2YgQXJyYXkuaXNBcnJheSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHJldHVybiBBcnJheS5pc0FycmF5KGFycik7XG5cdH1cblxuXHRyZXR1cm4gdG9TdHIuY2FsbChhcnIpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxudmFyIGlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xuXHRpZiAoIW9iaiB8fCB0b1N0ci5jYWxsKG9iaikgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0dmFyIGhhc093bkNvbnN0cnVjdG9yID0gaGFzT3duLmNhbGwob2JqLCAnY29uc3RydWN0b3InKTtcblx0dmFyIGhhc0lzUHJvdG90eXBlT2YgPSBvYmouY29uc3RydWN0b3IgJiYgb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSAmJiBoYXNPd24uY2FsbChvYmouY29uc3RydWN0b3IucHJvdG90eXBlLCAnaXNQcm90b3R5cGVPZicpO1xuXHQvLyBOb3Qgb3duIGNvbnN0cnVjdG9yIHByb3BlcnR5IG11c3QgYmUgT2JqZWN0XG5cdGlmIChvYmouY29uc3RydWN0b3IgJiYgIWhhc093bkNvbnN0cnVjdG9yICYmICFoYXNJc1Byb3RvdHlwZU9mKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gT3duIHByb3BlcnRpZXMgYXJlIGVudW1lcmF0ZWQgZmlyc3RseSwgc28gdG8gc3BlZWQgdXAsXG5cdC8vIGlmIGxhc3Qgb25lIGlzIG93biwgdGhlbiBhbGwgcHJvcGVydGllcyBhcmUgb3duLlxuXHR2YXIga2V5O1xuXHRmb3IgKGtleSBpbiBvYmopIHsvKiovfVxuXG5cdHJldHVybiB0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJyB8fCBoYXNPd24uY2FsbChvYmosIGtleSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGV4dGVuZCgpIHtcblx0dmFyIG9wdGlvbnMsIG5hbWUsIHNyYywgY29weSwgY29weUlzQXJyYXksIGNsb25lLFxuXHRcdHRhcmdldCA9IGFyZ3VtZW50c1swXSxcblx0XHRpID0gMSxcblx0XHRsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLFxuXHRcdGRlZXAgPSBmYWxzZTtcblxuXHQvLyBIYW5kbGUgYSBkZWVwIGNvcHkgc2l0dWF0aW9uXG5cdGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnYm9vbGVhbicpIHtcblx0XHRkZWVwID0gdGFyZ2V0O1xuXHRcdHRhcmdldCA9IGFyZ3VtZW50c1sxXSB8fCB7fTtcblx0XHQvLyBza2lwIHRoZSBib29sZWFuIGFuZCB0aGUgdGFyZ2V0XG5cdFx0aSA9IDI7XG5cdH0gZWxzZSBpZiAoKHR5cGVvZiB0YXJnZXQgIT09ICdvYmplY3QnICYmIHR5cGVvZiB0YXJnZXQgIT09ICdmdW5jdGlvbicpIHx8IHRhcmdldCA9PSBudWxsKSB7XG5cdFx0dGFyZ2V0ID0ge307XG5cdH1cblxuXHRmb3IgKDsgaSA8IGxlbmd0aDsgKytpKSB7XG5cdFx0b3B0aW9ucyA9IGFyZ3VtZW50c1tpXTtcblx0XHQvLyBPbmx5IGRlYWwgd2l0aCBub24tbnVsbC91bmRlZmluZWQgdmFsdWVzXG5cdFx0aWYgKG9wdGlvbnMgIT0gbnVsbCkge1xuXHRcdFx0Ly8gRXh0ZW5kIHRoZSBiYXNlIG9iamVjdFxuXHRcdFx0Zm9yIChuYW1lIGluIG9wdGlvbnMpIHtcblx0XHRcdFx0c3JjID0gdGFyZ2V0W25hbWVdO1xuXHRcdFx0XHRjb3B5ID0gb3B0aW9uc1tuYW1lXTtcblxuXHRcdFx0XHQvLyBQcmV2ZW50IG5ldmVyLWVuZGluZyBsb29wXG5cdFx0XHRcdGlmICh0YXJnZXQgIT09IGNvcHkpIHtcblx0XHRcdFx0XHQvLyBSZWN1cnNlIGlmIHdlJ3JlIG1lcmdpbmcgcGxhaW4gb2JqZWN0cyBvciBhcnJheXNcblx0XHRcdFx0XHRpZiAoZGVlcCAmJiBjb3B5ICYmIChpc1BsYWluT2JqZWN0KGNvcHkpIHx8IChjb3B5SXNBcnJheSA9IGlzQXJyYXkoY29weSkpKSkge1xuXHRcdFx0XHRcdFx0aWYgKGNvcHlJc0FycmF5KSB7XG5cdFx0XHRcdFx0XHRcdGNvcHlJc0FycmF5ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdGNsb25lID0gc3JjICYmIGlzQXJyYXkoc3JjKSA/IHNyYyA6IFtdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Y2xvbmUgPSBzcmMgJiYgaXNQbGFpbk9iamVjdChzcmMpID8gc3JjIDoge307XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIE5ldmVyIG1vdmUgb3JpZ2luYWwgb2JqZWN0cywgY2xvbmUgdGhlbVxuXHRcdFx0XHRcdFx0dGFyZ2V0W25hbWVdID0gZXh0ZW5kKGRlZXAsIGNsb25lLCBjb3B5KTtcblxuXHRcdFx0XHRcdC8vIERvbid0IGJyaW5nIGluIHVuZGVmaW5lZCB2YWx1ZXNcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBjb3B5ICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdFx0dGFyZ2V0W25hbWVdID0gY29weTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBSZXR1cm4gdGhlIG1vZGlmaWVkIG9iamVjdFxuXHRyZXR1cm4gdGFyZ2V0O1xufTtcblxuIiwiLy8gVGlueUNvbG9yIHYxLjMuMFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Jncmlucy9UaW55Q29sb3Jcbi8vIEJyaWFuIEdyaW5zdGVhZCwgTUlUIExpY2Vuc2VcblxuKGZ1bmN0aW9uKCkge1xuXG52YXIgdHJpbUxlZnQgPSAvXlxccysvLFxuICAgIHRyaW1SaWdodCA9IC9cXHMrJC8sXG4gICAgdGlueUNvdW50ZXIgPSAwLFxuICAgIG1hdGggPSBNYXRoLFxuICAgIG1hdGhSb3VuZCA9IG1hdGgucm91bmQsXG4gICAgbWF0aE1pbiA9IG1hdGgubWluLFxuICAgIG1hdGhNYXggPSBtYXRoLm1heCxcbiAgICBtYXRoUmFuZG9tID0gbWF0aC5yYW5kb207XG5cbmZ1bmN0aW9uIHRpbnljb2xvciAoY29sb3IsIG9wdHMpIHtcblxuICAgIGNvbG9yID0gKGNvbG9yKSA/IGNvbG9yIDogJyc7XG4gICAgb3B0cyA9IG9wdHMgfHwgeyB9O1xuXG4gICAgLy8gSWYgaW5wdXQgaXMgYWxyZWFkeSBhIHRpbnljb2xvciwgcmV0dXJuIGl0c2VsZlxuICAgIGlmIChjb2xvciBpbnN0YW5jZW9mIHRpbnljb2xvcikge1xuICAgICAgIHJldHVybiBjb2xvcjtcbiAgICB9XG4gICAgLy8gSWYgd2UgYXJlIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLCBjYWxsIHVzaW5nIG5ldyBpbnN0ZWFkXG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIHRpbnljb2xvcikpIHtcbiAgICAgICAgcmV0dXJuIG5ldyB0aW55Y29sb3IoY29sb3IsIG9wdHMpO1xuICAgIH1cblxuICAgIHZhciByZ2IgPSBpbnB1dFRvUkdCKGNvbG9yKTtcbiAgICB0aGlzLl9vcmlnaW5hbElucHV0ID0gY29sb3IsXG4gICAgdGhpcy5fciA9IHJnYi5yLFxuICAgIHRoaXMuX2cgPSByZ2IuZyxcbiAgICB0aGlzLl9iID0gcmdiLmIsXG4gICAgdGhpcy5fYSA9IHJnYi5hLFxuICAgIHRoaXMuX3JvdW5kQSA9IG1hdGhSb3VuZCgxMDAqdGhpcy5fYSkgLyAxMDAsXG4gICAgdGhpcy5fZm9ybWF0ID0gb3B0cy5mb3JtYXQgfHwgcmdiLmZvcm1hdDtcbiAgICB0aGlzLl9ncmFkaWVudFR5cGUgPSBvcHRzLmdyYWRpZW50VHlwZTtcblxuICAgIC8vIERvbid0IGxldCB0aGUgcmFuZ2Ugb2YgWzAsMjU1XSBjb21lIGJhY2sgaW4gWzAsMV0uXG4gICAgLy8gUG90ZW50aWFsbHkgbG9zZSBhIGxpdHRsZSBiaXQgb2YgcHJlY2lzaW9uIGhlcmUsIGJ1dCB3aWxsIGZpeCBpc3N1ZXMgd2hlcmVcbiAgICAvLyAuNSBnZXRzIGludGVycHJldGVkIGFzIGhhbGYgb2YgdGhlIHRvdGFsLCBpbnN0ZWFkIG9mIGhhbGYgb2YgMVxuICAgIC8vIElmIGl0IHdhcyBzdXBwb3NlZCB0byBiZSAxMjgsIHRoaXMgd2FzIGFscmVhZHkgdGFrZW4gY2FyZSBvZiBieSBgaW5wdXRUb1JnYmBcbiAgICBpZiAodGhpcy5fciA8IDEpIHsgdGhpcy5fciA9IG1hdGhSb3VuZCh0aGlzLl9yKTsgfVxuICAgIGlmICh0aGlzLl9nIDwgMSkgeyB0aGlzLl9nID0gbWF0aFJvdW5kKHRoaXMuX2cpOyB9XG4gICAgaWYgKHRoaXMuX2IgPCAxKSB7IHRoaXMuX2IgPSBtYXRoUm91bmQodGhpcy5fYik7IH1cblxuICAgIHRoaXMuX29rID0gcmdiLm9rO1xuICAgIHRoaXMuX3RjX2lkID0gdGlueUNvdW50ZXIrKztcbn1cblxudGlueWNvbG9yLnByb3RvdHlwZSA9IHtcbiAgICBpc0Rhcms6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRCcmlnaHRuZXNzKCkgPCAxMjg7XG4gICAgfSxcbiAgICBpc0xpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmlzRGFyaygpO1xuICAgIH0sXG4gICAgaXNWYWxpZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vaztcbiAgICB9LFxuICAgIGdldE9yaWdpbmFsSW5wdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX29yaWdpbmFsSW5wdXQ7XG4gICAgfSxcbiAgICBnZXRGb3JtYXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZm9ybWF0O1xuICAgIH0sXG4gICAgZ2V0QWxwaGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYTtcbiAgICB9LFxuICAgIGdldEJyaWdodG5lc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvL2h0dHA6Ly93d3cudzMub3JnL1RSL0FFUlQjY29sb3ItY29udHJhc3RcbiAgICAgICAgdmFyIHJnYiA9IHRoaXMudG9SZ2IoKTtcbiAgICAgICAgcmV0dXJuIChyZ2IuciAqIDI5OSArIHJnYi5nICogNTg3ICsgcmdiLmIgKiAxMTQpIC8gMTAwMDtcbiAgICB9LFxuICAgIGdldEx1bWluYW5jZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vaHR0cDovL3d3dy53My5vcmcvVFIvMjAwOC9SRUMtV0NBRzIwLTIwMDgxMjExLyNyZWxhdGl2ZWx1bWluYW5jZWRlZlxuICAgICAgICB2YXIgcmdiID0gdGhpcy50b1JnYigpO1xuICAgICAgICB2YXIgUnNSR0IsIEdzUkdCLCBCc1JHQiwgUiwgRywgQjtcbiAgICAgICAgUnNSR0IgPSByZ2Iuci8yNTU7XG4gICAgICAgIEdzUkdCID0gcmdiLmcvMjU1O1xuICAgICAgICBCc1JHQiA9IHJnYi5iLzI1NTtcblxuICAgICAgICBpZiAoUnNSR0IgPD0gMC4wMzkyOCkge1IgPSBSc1JHQiAvIDEyLjkyO30gZWxzZSB7UiA9IE1hdGgucG93KCgoUnNSR0IgKyAwLjA1NSkgLyAxLjA1NSksIDIuNCk7fVxuICAgICAgICBpZiAoR3NSR0IgPD0gMC4wMzkyOCkge0cgPSBHc1JHQiAvIDEyLjkyO30gZWxzZSB7RyA9IE1hdGgucG93KCgoR3NSR0IgKyAwLjA1NSkgLyAxLjA1NSksIDIuNCk7fVxuICAgICAgICBpZiAoQnNSR0IgPD0gMC4wMzkyOCkge0IgPSBCc1JHQiAvIDEyLjkyO30gZWxzZSB7QiA9IE1hdGgucG93KCgoQnNSR0IgKyAwLjA1NSkgLyAxLjA1NSksIDIuNCk7fVxuICAgICAgICByZXR1cm4gKDAuMjEyNiAqIFIpICsgKDAuNzE1MiAqIEcpICsgKDAuMDcyMiAqIEIpO1xuICAgIH0sXG4gICAgc2V0QWxwaGE6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2EgPSBib3VuZEFscGhhKHZhbHVlKTtcbiAgICAgICAgdGhpcy5fcm91bmRBID0gbWF0aFJvdW5kKDEwMCp0aGlzLl9hKSAvIDEwMDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICB0b0hzdjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoc3YgPSByZ2JUb0hzdih0aGlzLl9yLCB0aGlzLl9nLCB0aGlzLl9iKTtcbiAgICAgICAgcmV0dXJuIHsgaDogaHN2LmggKiAzNjAsIHM6IGhzdi5zLCB2OiBoc3YudiwgYTogdGhpcy5fYSB9O1xuICAgIH0sXG4gICAgdG9Ic3ZTdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaHN2ID0gcmdiVG9Ic3YodGhpcy5fciwgdGhpcy5fZywgdGhpcy5fYik7XG4gICAgICAgIHZhciBoID0gbWF0aFJvdW5kKGhzdi5oICogMzYwKSwgcyA9IG1hdGhSb3VuZChoc3YucyAqIDEwMCksIHYgPSBtYXRoUm91bmQoaHN2LnYgKiAxMDApO1xuICAgICAgICByZXR1cm4gKHRoaXMuX2EgPT0gMSkgP1xuICAgICAgICAgIFwiaHN2KFwiICArIGggKyBcIiwgXCIgKyBzICsgXCIlLCBcIiArIHYgKyBcIiUpXCIgOlxuICAgICAgICAgIFwiaHN2YShcIiArIGggKyBcIiwgXCIgKyBzICsgXCIlLCBcIiArIHYgKyBcIiUsIFwiKyB0aGlzLl9yb3VuZEEgKyBcIilcIjtcbiAgICB9LFxuICAgIHRvSHNsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGhzbCA9IHJnYlRvSHNsKHRoaXMuX3IsIHRoaXMuX2csIHRoaXMuX2IpO1xuICAgICAgICByZXR1cm4geyBoOiBoc2wuaCAqIDM2MCwgczogaHNsLnMsIGw6IGhzbC5sLCBhOiB0aGlzLl9hIH07XG4gICAgfSxcbiAgICB0b0hzbFN0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoc2wgPSByZ2JUb0hzbCh0aGlzLl9yLCB0aGlzLl9nLCB0aGlzLl9iKTtcbiAgICAgICAgdmFyIGggPSBtYXRoUm91bmQoaHNsLmggKiAzNjApLCBzID0gbWF0aFJvdW5kKGhzbC5zICogMTAwKSwgbCA9IG1hdGhSb3VuZChoc2wubCAqIDEwMCk7XG4gICAgICAgIHJldHVybiAodGhpcy5fYSA9PSAxKSA/XG4gICAgICAgICAgXCJoc2woXCIgICsgaCArIFwiLCBcIiArIHMgKyBcIiUsIFwiICsgbCArIFwiJSlcIiA6XG4gICAgICAgICAgXCJoc2xhKFwiICsgaCArIFwiLCBcIiArIHMgKyBcIiUsIFwiICsgbCArIFwiJSwgXCIrIHRoaXMuX3JvdW5kQSArIFwiKVwiO1xuICAgIH0sXG4gICAgdG9IZXg6IGZ1bmN0aW9uKGFsbG93M0NoYXIpIHtcbiAgICAgICAgcmV0dXJuIHJnYlRvSGV4KHRoaXMuX3IsIHRoaXMuX2csIHRoaXMuX2IsIGFsbG93M0NoYXIpO1xuICAgIH0sXG4gICAgdG9IZXhTdHJpbmc6IGZ1bmN0aW9uKGFsbG93M0NoYXIpIHtcbiAgICAgICAgcmV0dXJuICcjJyArIHRoaXMudG9IZXgoYWxsb3czQ2hhcik7XG4gICAgfSxcbiAgICB0b0hleDg6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcmdiYVRvSGV4KHRoaXMuX3IsIHRoaXMuX2csIHRoaXMuX2IsIHRoaXMuX2EpO1xuICAgIH0sXG4gICAgdG9IZXg4U3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICcjJyArIHRoaXMudG9IZXg4KCk7XG4gICAgfSxcbiAgICB0b1JnYjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7IHI6IG1hdGhSb3VuZCh0aGlzLl9yKSwgZzogbWF0aFJvdW5kKHRoaXMuX2cpLCBiOiBtYXRoUm91bmQodGhpcy5fYiksIGE6IHRoaXMuX2EgfTtcbiAgICB9LFxuICAgIHRvUmdiU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLl9hID09IDEpID9cbiAgICAgICAgICBcInJnYihcIiAgKyBtYXRoUm91bmQodGhpcy5fcikgKyBcIiwgXCIgKyBtYXRoUm91bmQodGhpcy5fZykgKyBcIiwgXCIgKyBtYXRoUm91bmQodGhpcy5fYikgKyBcIilcIiA6XG4gICAgICAgICAgXCJyZ2JhKFwiICsgbWF0aFJvdW5kKHRoaXMuX3IpICsgXCIsIFwiICsgbWF0aFJvdW5kKHRoaXMuX2cpICsgXCIsIFwiICsgbWF0aFJvdW5kKHRoaXMuX2IpICsgXCIsIFwiICsgdGhpcy5fcm91bmRBICsgXCIpXCI7XG4gICAgfSxcbiAgICB0b1BlcmNlbnRhZ2VSZ2I6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4geyByOiBtYXRoUm91bmQoYm91bmQwMSh0aGlzLl9yLCAyNTUpICogMTAwKSArIFwiJVwiLCBnOiBtYXRoUm91bmQoYm91bmQwMSh0aGlzLl9nLCAyNTUpICogMTAwKSArIFwiJVwiLCBiOiBtYXRoUm91bmQoYm91bmQwMSh0aGlzLl9iLCAyNTUpICogMTAwKSArIFwiJVwiLCBhOiB0aGlzLl9hIH07XG4gICAgfSxcbiAgICB0b1BlcmNlbnRhZ2VSZ2JTdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuX2EgPT0gMSkgP1xuICAgICAgICAgIFwicmdiKFwiICArIG1hdGhSb3VuZChib3VuZDAxKHRoaXMuX3IsIDI1NSkgKiAxMDApICsgXCIlLCBcIiArIG1hdGhSb3VuZChib3VuZDAxKHRoaXMuX2csIDI1NSkgKiAxMDApICsgXCIlLCBcIiArIG1hdGhSb3VuZChib3VuZDAxKHRoaXMuX2IsIDI1NSkgKiAxMDApICsgXCIlKVwiIDpcbiAgICAgICAgICBcInJnYmEoXCIgKyBtYXRoUm91bmQoYm91bmQwMSh0aGlzLl9yLCAyNTUpICogMTAwKSArIFwiJSwgXCIgKyBtYXRoUm91bmQoYm91bmQwMSh0aGlzLl9nLCAyNTUpICogMTAwKSArIFwiJSwgXCIgKyBtYXRoUm91bmQoYm91bmQwMSh0aGlzLl9iLCAyNTUpICogMTAwKSArIFwiJSwgXCIgKyB0aGlzLl9yb3VuZEEgKyBcIilcIjtcbiAgICB9LFxuICAgIHRvTmFtZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLl9hID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJ0cmFuc3BhcmVudFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2EgPCAxKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaGV4TmFtZXNbcmdiVG9IZXgodGhpcy5fciwgdGhpcy5fZywgdGhpcy5fYiwgdHJ1ZSldIHx8IGZhbHNlO1xuICAgIH0sXG4gICAgdG9GaWx0ZXI6IGZ1bmN0aW9uKHNlY29uZENvbG9yKSB7XG4gICAgICAgIHZhciBoZXg4U3RyaW5nID0gJyMnICsgcmdiYVRvSGV4KHRoaXMuX3IsIHRoaXMuX2csIHRoaXMuX2IsIHRoaXMuX2EpO1xuICAgICAgICB2YXIgc2Vjb25kSGV4OFN0cmluZyA9IGhleDhTdHJpbmc7XG4gICAgICAgIHZhciBncmFkaWVudFR5cGUgPSB0aGlzLl9ncmFkaWVudFR5cGUgPyBcIkdyYWRpZW50VHlwZSA9IDEsIFwiIDogXCJcIjtcblxuICAgICAgICBpZiAoc2Vjb25kQ29sb3IpIHtcbiAgICAgICAgICAgIHZhciBzID0gdGlueWNvbG9yKHNlY29uZENvbG9yKTtcbiAgICAgICAgICAgIHNlY29uZEhleDhTdHJpbmcgPSBzLnRvSGV4OFN0cmluZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFwicHJvZ2lkOkRYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0LmdyYWRpZW50KFwiK2dyYWRpZW50VHlwZStcInN0YXJ0Q29sb3JzdHI9XCIraGV4OFN0cmluZytcIixlbmRDb2xvcnN0cj1cIitzZWNvbmRIZXg4U3RyaW5nK1wiKVwiO1xuICAgIH0sXG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uKGZvcm1hdCkge1xuICAgICAgICB2YXIgZm9ybWF0U2V0ID0gISFmb3JtYXQ7XG4gICAgICAgIGZvcm1hdCA9IGZvcm1hdCB8fCB0aGlzLl9mb3JtYXQ7XG5cbiAgICAgICAgdmFyIGZvcm1hdHRlZFN0cmluZyA9IGZhbHNlO1xuICAgICAgICB2YXIgaGFzQWxwaGEgPSB0aGlzLl9hIDwgMSAmJiB0aGlzLl9hID49IDA7XG4gICAgICAgIHZhciBuZWVkc0FscGhhRm9ybWF0ID0gIWZvcm1hdFNldCAmJiBoYXNBbHBoYSAmJiAoZm9ybWF0ID09PSBcImhleFwiIHx8IGZvcm1hdCA9PT0gXCJoZXg2XCIgfHwgZm9ybWF0ID09PSBcImhleDNcIiB8fCBmb3JtYXQgPT09IFwibmFtZVwiKTtcblxuICAgICAgICBpZiAobmVlZHNBbHBoYUZvcm1hdCkge1xuICAgICAgICAgICAgLy8gU3BlY2lhbCBjYXNlIGZvciBcInRyYW5zcGFyZW50XCIsIGFsbCBvdGhlciBub24tYWxwaGEgZm9ybWF0c1xuICAgICAgICAgICAgLy8gd2lsbCByZXR1cm4gcmdiYSB3aGVuIHRoZXJlIGlzIHRyYW5zcGFyZW5jeS5cbiAgICAgICAgICAgIGlmIChmb3JtYXQgPT09IFwibmFtZVwiICYmIHRoaXMuX2EgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50b05hbWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRvUmdiU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJyZ2JcIikge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b1JnYlN0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT09IFwicHJnYlwiKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWRTdHJpbmcgPSB0aGlzLnRvUGVyY2VudGFnZVJnYlN0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT09IFwiaGV4XCIgfHwgZm9ybWF0ID09PSBcImhleDZcIikge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b0hleFN0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT09IFwiaGV4M1wiKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWRTdHJpbmcgPSB0aGlzLnRvSGV4U3RyaW5nKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT09IFwiaGV4OFwiKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWRTdHJpbmcgPSB0aGlzLnRvSGV4OFN0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT09IFwibmFtZVwiKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWRTdHJpbmcgPSB0aGlzLnRvTmFtZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT09IFwiaHNsXCIpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9Ic2xTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSBcImhzdlwiKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWRTdHJpbmcgPSB0aGlzLnRvSHN2U3RyaW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZm9ybWF0dGVkU3RyaW5nIHx8IHRoaXMudG9IZXhTdHJpbmcoKTtcbiAgICB9LFxuICAgIGNsb25lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRpbnljb2xvcih0aGlzLnRvU3RyaW5nKCkpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlNb2RpZmljYXRpb246IGZ1bmN0aW9uKGZuLCBhcmdzKSB7XG4gICAgICAgIHZhciBjb2xvciA9IGZuLmFwcGx5KG51bGwsIFt0aGlzXS5jb25jYXQoW10uc2xpY2UuY2FsbChhcmdzKSkpO1xuICAgICAgICB0aGlzLl9yID0gY29sb3IuX3I7XG4gICAgICAgIHRoaXMuX2cgPSBjb2xvci5fZztcbiAgICAgICAgdGhpcy5fYiA9IGNvbG9yLl9iO1xuICAgICAgICB0aGlzLnNldEFscGhhKGNvbG9yLl9hKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBsaWdodGVuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5TW9kaWZpY2F0aW9uKGxpZ2h0ZW4sIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBicmlnaHRlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseU1vZGlmaWNhdGlvbihicmlnaHRlbiwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIGRhcmtlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseU1vZGlmaWNhdGlvbihkYXJrZW4sIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBkZXNhdHVyYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5TW9kaWZpY2F0aW9uKGRlc2F0dXJhdGUsIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBzYXR1cmF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseU1vZGlmaWNhdGlvbihzYXR1cmF0ZSwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIGdyZXlzY2FsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseU1vZGlmaWNhdGlvbihncmV5c2NhbGUsIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBzcGluOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5TW9kaWZpY2F0aW9uKHNwaW4sIGFyZ3VtZW50cyk7XG4gICAgfSxcblxuICAgIF9hcHBseUNvbWJpbmF0aW9uOiBmdW5jdGlvbihmbiwgYXJncykge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkobnVsbCwgW3RoaXNdLmNvbmNhdChbXS5zbGljZS5jYWxsKGFyZ3MpKSk7XG4gICAgfSxcbiAgICBhbmFsb2dvdXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlDb21iaW5hdGlvbihhbmFsb2dvdXMsIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBjb21wbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5Q29tYmluYXRpb24oY29tcGxlbWVudCwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIG1vbm9jaHJvbWF0aWM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlDb21iaW5hdGlvbihtb25vY2hyb21hdGljLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgc3BsaXRjb21wbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5Q29tYmluYXRpb24oc3BsaXRjb21wbGVtZW50LCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgdHJpYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlDb21iaW5hdGlvbih0cmlhZCwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIHRldHJhZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseUNvbWJpbmF0aW9uKHRldHJhZCwgYXJndW1lbnRzKTtcbiAgICB9XG59O1xuXG4vLyBJZiBpbnB1dCBpcyBhbiBvYmplY3QsIGZvcmNlIDEgaW50byBcIjEuMFwiIHRvIGhhbmRsZSByYXRpb3MgcHJvcGVybHlcbi8vIFN0cmluZyBpbnB1dCByZXF1aXJlcyBcIjEuMFwiIGFzIGlucHV0LCBzbyAxIHdpbGwgYmUgdHJlYXRlZCBhcyAxXG50aW55Y29sb3IuZnJvbVJhdGlvID0gZnVuY3Rpb24oY29sb3IsIG9wdHMpIHtcbiAgICBpZiAodHlwZW9mIGNvbG9yID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgdmFyIG5ld0NvbG9yID0ge307XG4gICAgICAgIGZvciAodmFyIGkgaW4gY29sb3IpIHtcbiAgICAgICAgICAgIGlmIChjb2xvci5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgIGlmIChpID09PSBcImFcIikge1xuICAgICAgICAgICAgICAgICAgICBuZXdDb2xvcltpXSA9IGNvbG9yW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3Q29sb3JbaV0gPSBjb252ZXJ0VG9QZXJjZW50YWdlKGNvbG9yW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29sb3IgPSBuZXdDb2xvcjtcbiAgICB9XG5cbiAgICByZXR1cm4gdGlueWNvbG9yKGNvbG9yLCBvcHRzKTtcbn07XG5cbi8vIEdpdmVuIGEgc3RyaW5nIG9yIG9iamVjdCwgY29udmVydCB0aGF0IGlucHV0IHRvIFJHQlxuLy8gUG9zc2libGUgc3RyaW5nIGlucHV0czpcbi8vXG4vLyAgICAgXCJyZWRcIlxuLy8gICAgIFwiI2YwMFwiIG9yIFwiZjAwXCJcbi8vICAgICBcIiNmZjAwMDBcIiBvciBcImZmMDAwMFwiXG4vLyAgICAgXCIjZmYwMDAwMDBcIiBvciBcImZmMDAwMDAwXCJcbi8vICAgICBcInJnYiAyNTUgMCAwXCIgb3IgXCJyZ2IgKDI1NSwgMCwgMClcIlxuLy8gICAgIFwicmdiIDEuMCAwIDBcIiBvciBcInJnYiAoMSwgMCwgMClcIlxuLy8gICAgIFwicmdiYSAoMjU1LCAwLCAwLCAxKVwiIG9yIFwicmdiYSAyNTUsIDAsIDAsIDFcIlxuLy8gICAgIFwicmdiYSAoMS4wLCAwLCAwLCAxKVwiIG9yIFwicmdiYSAxLjAsIDAsIDAsIDFcIlxuLy8gICAgIFwiaHNsKDAsIDEwMCUsIDUwJSlcIiBvciBcImhzbCAwIDEwMCUgNTAlXCJcbi8vICAgICBcImhzbGEoMCwgMTAwJSwgNTAlLCAxKVwiIG9yIFwiaHNsYSAwIDEwMCUgNTAlLCAxXCJcbi8vICAgICBcImhzdigwLCAxMDAlLCAxMDAlKVwiIG9yIFwiaHN2IDAgMTAwJSAxMDAlXCJcbi8vXG5mdW5jdGlvbiBpbnB1dFRvUkdCKGNvbG9yKSB7XG5cbiAgICB2YXIgcmdiID0geyByOiAwLCBnOiAwLCBiOiAwIH07XG4gICAgdmFyIGEgPSAxO1xuICAgIHZhciBvayA9IGZhbHNlO1xuICAgIHZhciBmb3JtYXQgPSBmYWxzZTtcblxuICAgIGlmICh0eXBlb2YgY29sb3IgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICBjb2xvciA9IHN0cmluZ0lucHV0VG9PYmplY3QoY29sb3IpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY29sb3IgPT0gXCJvYmplY3RcIikge1xuICAgICAgICBpZiAoY29sb3IuaGFzT3duUHJvcGVydHkoXCJyXCIpICYmIGNvbG9yLmhhc093blByb3BlcnR5KFwiZ1wiKSAmJiBjb2xvci5oYXNPd25Qcm9wZXJ0eShcImJcIikpIHtcbiAgICAgICAgICAgIHJnYiA9IHJnYlRvUmdiKGNvbG9yLnIsIGNvbG9yLmcsIGNvbG9yLmIpO1xuICAgICAgICAgICAgb2sgPSB0cnVlO1xuICAgICAgICAgICAgZm9ybWF0ID0gU3RyaW5nKGNvbG9yLnIpLnN1YnN0cigtMSkgPT09IFwiJVwiID8gXCJwcmdiXCIgOiBcInJnYlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvbG9yLmhhc093blByb3BlcnR5KFwiaFwiKSAmJiBjb2xvci5oYXNPd25Qcm9wZXJ0eShcInNcIikgJiYgY29sb3IuaGFzT3duUHJvcGVydHkoXCJ2XCIpKSB7XG4gICAgICAgICAgICBjb2xvci5zID0gY29udmVydFRvUGVyY2VudGFnZShjb2xvci5zKTtcbiAgICAgICAgICAgIGNvbG9yLnYgPSBjb252ZXJ0VG9QZXJjZW50YWdlKGNvbG9yLnYpO1xuICAgICAgICAgICAgcmdiID0gaHN2VG9SZ2IoY29sb3IuaCwgY29sb3IucywgY29sb3Iudik7XG4gICAgICAgICAgICBvayA9IHRydWU7XG4gICAgICAgICAgICBmb3JtYXQgPSBcImhzdlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvbG9yLmhhc093blByb3BlcnR5KFwiaFwiKSAmJiBjb2xvci5oYXNPd25Qcm9wZXJ0eShcInNcIikgJiYgY29sb3IuaGFzT3duUHJvcGVydHkoXCJsXCIpKSB7XG4gICAgICAgICAgICBjb2xvci5zID0gY29udmVydFRvUGVyY2VudGFnZShjb2xvci5zKTtcbiAgICAgICAgICAgIGNvbG9yLmwgPSBjb252ZXJ0VG9QZXJjZW50YWdlKGNvbG9yLmwpO1xuICAgICAgICAgICAgcmdiID0gaHNsVG9SZ2IoY29sb3IuaCwgY29sb3IucywgY29sb3IubCk7XG4gICAgICAgICAgICBvayA9IHRydWU7XG4gICAgICAgICAgICBmb3JtYXQgPSBcImhzbFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbG9yLmhhc093blByb3BlcnR5KFwiYVwiKSkge1xuICAgICAgICAgICAgYSA9IGNvbG9yLmE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhID0gYm91bmRBbHBoYShhKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIG9rOiBvayxcbiAgICAgICAgZm9ybWF0OiBjb2xvci5mb3JtYXQgfHwgZm9ybWF0LFxuICAgICAgICByOiBtYXRoTWluKDI1NSwgbWF0aE1heChyZ2IuciwgMCkpLFxuICAgICAgICBnOiBtYXRoTWluKDI1NSwgbWF0aE1heChyZ2IuZywgMCkpLFxuICAgICAgICBiOiBtYXRoTWluKDI1NSwgbWF0aE1heChyZ2IuYiwgMCkpLFxuICAgICAgICBhOiBhXG4gICAgfTtcbn1cblxuXG4vLyBDb252ZXJzaW9uIEZ1bmN0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gYHJnYlRvSHNsYCwgYHJnYlRvSHN2YCwgYGhzbFRvUmdiYCwgYGhzdlRvUmdiYCBtb2RpZmllZCBmcm9tOlxuLy8gPGh0dHA6Ly9tamlqYWNrc29uLmNvbS8yMDA4LzAyL3JnYi10by1oc2wtYW5kLXJnYi10by1oc3YtY29sb3ItbW9kZWwtY29udmVyc2lvbi1hbGdvcml0aG1zLWluLWphdmFzY3JpcHQ+XG5cbi8vIGByZ2JUb1JnYmBcbi8vIEhhbmRsZSBib3VuZHMgLyBwZXJjZW50YWdlIGNoZWNraW5nIHRvIGNvbmZvcm0gdG8gQ1NTIGNvbG9yIHNwZWNcbi8vIDxodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLWNvbG9yLz5cbi8vICpBc3N1bWVzOiogciwgZywgYiBpbiBbMCwgMjU1XSBvciBbMCwgMV1cbi8vICpSZXR1cm5zOiogeyByLCBnLCBiIH0gaW4gWzAsIDI1NV1cbmZ1bmN0aW9uIHJnYlRvUmdiKHIsIGcsIGIpe1xuICAgIHJldHVybiB7XG4gICAgICAgIHI6IGJvdW5kMDEociwgMjU1KSAqIDI1NSxcbiAgICAgICAgZzogYm91bmQwMShnLCAyNTUpICogMjU1LFxuICAgICAgICBiOiBib3VuZDAxKGIsIDI1NSkgKiAyNTVcbiAgICB9O1xufVxuXG4vLyBgcmdiVG9Ic2xgXG4vLyBDb252ZXJ0cyBhbiBSR0IgY29sb3IgdmFsdWUgdG8gSFNMLlxuLy8gKkFzc3VtZXM6KiByLCBnLCBhbmQgYiBhcmUgY29udGFpbmVkIGluIFswLCAyNTVdIG9yIFswLCAxXVxuLy8gKlJldHVybnM6KiB7IGgsIHMsIGwgfSBpbiBbMCwxXVxuZnVuY3Rpb24gcmdiVG9Ic2wociwgZywgYikge1xuXG4gICAgciA9IGJvdW5kMDEociwgMjU1KTtcbiAgICBnID0gYm91bmQwMShnLCAyNTUpO1xuICAgIGIgPSBib3VuZDAxKGIsIDI1NSk7XG5cbiAgICB2YXIgbWF4ID0gbWF0aE1heChyLCBnLCBiKSwgbWluID0gbWF0aE1pbihyLCBnLCBiKTtcbiAgICB2YXIgaCwgcywgbCA9IChtYXggKyBtaW4pIC8gMjtcblxuICAgIGlmKG1heCA9PSBtaW4pIHtcbiAgICAgICAgaCA9IHMgPSAwOyAvLyBhY2hyb21hdGljXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgZCA9IG1heCAtIG1pbjtcbiAgICAgICAgcyA9IGwgPiAwLjUgPyBkIC8gKDIgLSBtYXggLSBtaW4pIDogZCAvIChtYXggKyBtaW4pO1xuICAgICAgICBzd2l0Y2gobWF4KSB7XG4gICAgICAgICAgICBjYXNlIHI6IGggPSAoZyAtIGIpIC8gZCArIChnIDwgYiA/IDYgOiAwKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGc6IGggPSAoYiAtIHIpIC8gZCArIDI7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBiOiBoID0gKHIgLSBnKSAvIGQgKyA0OyBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGggLz0gNjtcbiAgICB9XG5cbiAgICByZXR1cm4geyBoOiBoLCBzOiBzLCBsOiBsIH07XG59XG5cbi8vIGBoc2xUb1JnYmBcbi8vIENvbnZlcnRzIGFuIEhTTCBjb2xvciB2YWx1ZSB0byBSR0IuXG4vLyAqQXNzdW1lczoqIGggaXMgY29udGFpbmVkIGluIFswLCAxXSBvciBbMCwgMzYwXSBhbmQgcyBhbmQgbCBhcmUgY29udGFpbmVkIFswLCAxXSBvciBbMCwgMTAwXVxuLy8gKlJldHVybnM6KiB7IHIsIGcsIGIgfSBpbiB0aGUgc2V0IFswLCAyNTVdXG5mdW5jdGlvbiBoc2xUb1JnYihoLCBzLCBsKSB7XG4gICAgdmFyIHIsIGcsIGI7XG5cbiAgICBoID0gYm91bmQwMShoLCAzNjApO1xuICAgIHMgPSBib3VuZDAxKHMsIDEwMCk7XG4gICAgbCA9IGJvdW5kMDEobCwgMTAwKTtcblxuICAgIGZ1bmN0aW9uIGh1ZTJyZ2IocCwgcSwgdCkge1xuICAgICAgICBpZih0IDwgMCkgdCArPSAxO1xuICAgICAgICBpZih0ID4gMSkgdCAtPSAxO1xuICAgICAgICBpZih0IDwgMS82KSByZXR1cm4gcCArIChxIC0gcCkgKiA2ICogdDtcbiAgICAgICAgaWYodCA8IDEvMikgcmV0dXJuIHE7XG4gICAgICAgIGlmKHQgPCAyLzMpIHJldHVybiBwICsgKHEgLSBwKSAqICgyLzMgLSB0KSAqIDY7XG4gICAgICAgIHJldHVybiBwO1xuICAgIH1cblxuICAgIGlmKHMgPT09IDApIHtcbiAgICAgICAgciA9IGcgPSBiID0gbDsgLy8gYWNocm9tYXRpY1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIHEgPSBsIDwgMC41ID8gbCAqICgxICsgcykgOiBsICsgcyAtIGwgKiBzO1xuICAgICAgICB2YXIgcCA9IDIgKiBsIC0gcTtcbiAgICAgICAgciA9IGh1ZTJyZ2IocCwgcSwgaCArIDEvMyk7XG4gICAgICAgIGcgPSBodWUycmdiKHAsIHEsIGgpO1xuICAgICAgICBiID0gaHVlMnJnYihwLCBxLCBoIC0gMS8zKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyByOiByICogMjU1LCBnOiBnICogMjU1LCBiOiBiICogMjU1IH07XG59XG5cbi8vIGByZ2JUb0hzdmBcbi8vIENvbnZlcnRzIGFuIFJHQiBjb2xvciB2YWx1ZSB0byBIU1Zcbi8vICpBc3N1bWVzOiogciwgZywgYW5kIGIgYXJlIGNvbnRhaW5lZCBpbiB0aGUgc2V0IFswLCAyNTVdIG9yIFswLCAxXVxuLy8gKlJldHVybnM6KiB7IGgsIHMsIHYgfSBpbiBbMCwxXVxuZnVuY3Rpb24gcmdiVG9Ic3YociwgZywgYikge1xuXG4gICAgciA9IGJvdW5kMDEociwgMjU1KTtcbiAgICBnID0gYm91bmQwMShnLCAyNTUpO1xuICAgIGIgPSBib3VuZDAxKGIsIDI1NSk7XG5cbiAgICB2YXIgbWF4ID0gbWF0aE1heChyLCBnLCBiKSwgbWluID0gbWF0aE1pbihyLCBnLCBiKTtcbiAgICB2YXIgaCwgcywgdiA9IG1heDtcblxuICAgIHZhciBkID0gbWF4IC0gbWluO1xuICAgIHMgPSBtYXggPT09IDAgPyAwIDogZCAvIG1heDtcblxuICAgIGlmKG1heCA9PSBtaW4pIHtcbiAgICAgICAgaCA9IDA7IC8vIGFjaHJvbWF0aWNcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHN3aXRjaChtYXgpIHtcbiAgICAgICAgICAgIGNhc2UgcjogaCA9IChnIC0gYikgLyBkICsgKGcgPCBiID8gNiA6IDApOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgZzogaCA9IChiIC0gcikgLyBkICsgMjsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGI6IGggPSAociAtIGcpIC8gZCArIDQ7IGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGggLz0gNjtcbiAgICB9XG4gICAgcmV0dXJuIHsgaDogaCwgczogcywgdjogdiB9O1xufVxuXG4vLyBgaHN2VG9SZ2JgXG4vLyBDb252ZXJ0cyBhbiBIU1YgY29sb3IgdmFsdWUgdG8gUkdCLlxuLy8gKkFzc3VtZXM6KiBoIGlzIGNvbnRhaW5lZCBpbiBbMCwgMV0gb3IgWzAsIDM2MF0gYW5kIHMgYW5kIHYgYXJlIGNvbnRhaW5lZCBpbiBbMCwgMV0gb3IgWzAsIDEwMF1cbi8vICpSZXR1cm5zOiogeyByLCBnLCBiIH0gaW4gdGhlIHNldCBbMCwgMjU1XVxuIGZ1bmN0aW9uIGhzdlRvUmdiKGgsIHMsIHYpIHtcblxuICAgIGggPSBib3VuZDAxKGgsIDM2MCkgKiA2O1xuICAgIHMgPSBib3VuZDAxKHMsIDEwMCk7XG4gICAgdiA9IGJvdW5kMDEodiwgMTAwKTtcblxuICAgIHZhciBpID0gbWF0aC5mbG9vcihoKSxcbiAgICAgICAgZiA9IGggLSBpLFxuICAgICAgICBwID0gdiAqICgxIC0gcyksXG4gICAgICAgIHEgPSB2ICogKDEgLSBmICogcyksXG4gICAgICAgIHQgPSB2ICogKDEgLSAoMSAtIGYpICogcyksXG4gICAgICAgIG1vZCA9IGkgJSA2LFxuICAgICAgICByID0gW3YsIHEsIHAsIHAsIHQsIHZdW21vZF0sXG4gICAgICAgIGcgPSBbdCwgdiwgdiwgcSwgcCwgcF1bbW9kXSxcbiAgICAgICAgYiA9IFtwLCBwLCB0LCB2LCB2LCBxXVttb2RdO1xuXG4gICAgcmV0dXJuIHsgcjogciAqIDI1NSwgZzogZyAqIDI1NSwgYjogYiAqIDI1NSB9O1xufVxuXG4vLyBgcmdiVG9IZXhgXG4vLyBDb252ZXJ0cyBhbiBSR0IgY29sb3IgdG8gaGV4XG4vLyBBc3N1bWVzIHIsIGcsIGFuZCBiIGFyZSBjb250YWluZWQgaW4gdGhlIHNldCBbMCwgMjU1XVxuLy8gUmV0dXJucyBhIDMgb3IgNiBjaGFyYWN0ZXIgaGV4XG5mdW5jdGlvbiByZ2JUb0hleChyLCBnLCBiLCBhbGxvdzNDaGFyKSB7XG5cbiAgICB2YXIgaGV4ID0gW1xuICAgICAgICBwYWQyKG1hdGhSb3VuZChyKS50b1N0cmluZygxNikpLFxuICAgICAgICBwYWQyKG1hdGhSb3VuZChnKS50b1N0cmluZygxNikpLFxuICAgICAgICBwYWQyKG1hdGhSb3VuZChiKS50b1N0cmluZygxNikpXG4gICAgXTtcblxuICAgIC8vIFJldHVybiBhIDMgY2hhcmFjdGVyIGhleCBpZiBwb3NzaWJsZVxuICAgIGlmIChhbGxvdzNDaGFyICYmIGhleFswXS5jaGFyQXQoMCkgPT0gaGV4WzBdLmNoYXJBdCgxKSAmJiBoZXhbMV0uY2hhckF0KDApID09IGhleFsxXS5jaGFyQXQoMSkgJiYgaGV4WzJdLmNoYXJBdCgwKSA9PSBoZXhbMl0uY2hhckF0KDEpKSB7XG4gICAgICAgIHJldHVybiBoZXhbMF0uY2hhckF0KDApICsgaGV4WzFdLmNoYXJBdCgwKSArIGhleFsyXS5jaGFyQXQoMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhleC5qb2luKFwiXCIpO1xufVxuXG4vLyBgcmdiYVRvSGV4YFxuLy8gQ29udmVydHMgYW4gUkdCQSBjb2xvciBwbHVzIGFscGhhIHRyYW5zcGFyZW5jeSB0byBoZXhcbi8vIEFzc3VtZXMgciwgZywgYiBhbmQgYSBhcmUgY29udGFpbmVkIGluIHRoZSBzZXQgWzAsIDI1NV1cbi8vIFJldHVybnMgYW4gOCBjaGFyYWN0ZXIgaGV4XG5mdW5jdGlvbiByZ2JhVG9IZXgociwgZywgYiwgYSkge1xuXG4gICAgdmFyIGhleCA9IFtcbiAgICAgICAgcGFkMihjb252ZXJ0RGVjaW1hbFRvSGV4KGEpKSxcbiAgICAgICAgcGFkMihtYXRoUm91bmQocikudG9TdHJpbmcoMTYpKSxcbiAgICAgICAgcGFkMihtYXRoUm91bmQoZykudG9TdHJpbmcoMTYpKSxcbiAgICAgICAgcGFkMihtYXRoUm91bmQoYikudG9TdHJpbmcoMTYpKVxuICAgIF07XG5cbiAgICByZXR1cm4gaGV4LmpvaW4oXCJcIik7XG59XG5cbi8vIGBlcXVhbHNgXG4vLyBDYW4gYmUgY2FsbGVkIHdpdGggYW55IHRpbnljb2xvciBpbnB1dFxudGlueWNvbG9yLmVxdWFscyA9IGZ1bmN0aW9uIChjb2xvcjEsIGNvbG9yMikge1xuICAgIGlmICghY29sb3IxIHx8ICFjb2xvcjIpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgcmV0dXJuIHRpbnljb2xvcihjb2xvcjEpLnRvUmdiU3RyaW5nKCkgPT0gdGlueWNvbG9yKGNvbG9yMikudG9SZ2JTdHJpbmcoKTtcbn07XG5cbnRpbnljb2xvci5yYW5kb20gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGlueWNvbG9yLmZyb21SYXRpbyh7XG4gICAgICAgIHI6IG1hdGhSYW5kb20oKSxcbiAgICAgICAgZzogbWF0aFJhbmRvbSgpLFxuICAgICAgICBiOiBtYXRoUmFuZG9tKClcbiAgICB9KTtcbn07XG5cblxuLy8gTW9kaWZpY2F0aW9uIEZ1bmN0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gVGhhbmtzIHRvIGxlc3MuanMgZm9yIHNvbWUgb2YgdGhlIGJhc2ljcyBoZXJlXG4vLyA8aHR0cHM6Ly9naXRodWIuY29tL2Nsb3VkaGVhZC9sZXNzLmpzL2Jsb2IvbWFzdGVyL2xpYi9sZXNzL2Z1bmN0aW9ucy5qcz5cblxuZnVuY3Rpb24gZGVzYXR1cmF0ZShjb2xvciwgYW1vdW50KSB7XG4gICAgYW1vdW50ID0gKGFtb3VudCA9PT0gMCkgPyAwIDogKGFtb3VudCB8fCAxMCk7XG4gICAgdmFyIGhzbCA9IHRpbnljb2xvcihjb2xvcikudG9Ic2woKTtcbiAgICBoc2wucyAtPSBhbW91bnQgLyAxMDA7XG4gICAgaHNsLnMgPSBjbGFtcDAxKGhzbC5zKTtcbiAgICByZXR1cm4gdGlueWNvbG9yKGhzbCk7XG59XG5cbmZ1bmN0aW9uIHNhdHVyYXRlKGNvbG9yLCBhbW91bnQpIHtcbiAgICBhbW91bnQgPSAoYW1vdW50ID09PSAwKSA/IDAgOiAoYW1vdW50IHx8IDEwKTtcbiAgICB2YXIgaHNsID0gdGlueWNvbG9yKGNvbG9yKS50b0hzbCgpO1xuICAgIGhzbC5zICs9IGFtb3VudCAvIDEwMDtcbiAgICBoc2wucyA9IGNsYW1wMDEoaHNsLnMpO1xuICAgIHJldHVybiB0aW55Y29sb3IoaHNsKTtcbn1cblxuZnVuY3Rpb24gZ3JleXNjYWxlKGNvbG9yKSB7XG4gICAgcmV0dXJuIHRpbnljb2xvcihjb2xvcikuZGVzYXR1cmF0ZSgxMDApO1xufVxuXG5mdW5jdGlvbiBsaWdodGVuIChjb2xvciwgYW1vdW50KSB7XG4gICAgYW1vdW50ID0gKGFtb3VudCA9PT0gMCkgPyAwIDogKGFtb3VudCB8fCAxMCk7XG4gICAgdmFyIGhzbCA9IHRpbnljb2xvcihjb2xvcikudG9Ic2woKTtcbiAgICBoc2wubCArPSBhbW91bnQgLyAxMDA7XG4gICAgaHNsLmwgPSBjbGFtcDAxKGhzbC5sKTtcbiAgICByZXR1cm4gdGlueWNvbG9yKGhzbCk7XG59XG5cbmZ1bmN0aW9uIGJyaWdodGVuKGNvbG9yLCBhbW91bnQpIHtcbiAgICBhbW91bnQgPSAoYW1vdW50ID09PSAwKSA/IDAgOiAoYW1vdW50IHx8IDEwKTtcbiAgICB2YXIgcmdiID0gdGlueWNvbG9yKGNvbG9yKS50b1JnYigpO1xuICAgIHJnYi5yID0gbWF0aE1heCgwLCBtYXRoTWluKDI1NSwgcmdiLnIgLSBtYXRoUm91bmQoMjU1ICogLSAoYW1vdW50IC8gMTAwKSkpKTtcbiAgICByZ2IuZyA9IG1hdGhNYXgoMCwgbWF0aE1pbigyNTUsIHJnYi5nIC0gbWF0aFJvdW5kKDI1NSAqIC0gKGFtb3VudCAvIDEwMCkpKSk7XG4gICAgcmdiLmIgPSBtYXRoTWF4KDAsIG1hdGhNaW4oMjU1LCByZ2IuYiAtIG1hdGhSb3VuZCgyNTUgKiAtIChhbW91bnQgLyAxMDApKSkpO1xuICAgIHJldHVybiB0aW55Y29sb3IocmdiKTtcbn1cblxuZnVuY3Rpb24gZGFya2VuIChjb2xvciwgYW1vdW50KSB7XG4gICAgYW1vdW50ID0gKGFtb3VudCA9PT0gMCkgPyAwIDogKGFtb3VudCB8fCAxMCk7XG4gICAgdmFyIGhzbCA9IHRpbnljb2xvcihjb2xvcikudG9Ic2woKTtcbiAgICBoc2wubCAtPSBhbW91bnQgLyAxMDA7XG4gICAgaHNsLmwgPSBjbGFtcDAxKGhzbC5sKTtcbiAgICByZXR1cm4gdGlueWNvbG9yKGhzbCk7XG59XG5cbi8vIFNwaW4gdGFrZXMgYSBwb3NpdGl2ZSBvciBuZWdhdGl2ZSBhbW91bnQgd2l0aGluIFstMzYwLCAzNjBdIGluZGljYXRpbmcgdGhlIGNoYW5nZSBvZiBodWUuXG4vLyBWYWx1ZXMgb3V0c2lkZSBvZiB0aGlzIHJhbmdlIHdpbGwgYmUgd3JhcHBlZCBpbnRvIHRoaXMgcmFuZ2UuXG5mdW5jdGlvbiBzcGluKGNvbG9yLCBhbW91bnQpIHtcbiAgICB2YXIgaHNsID0gdGlueWNvbG9yKGNvbG9yKS50b0hzbCgpO1xuICAgIHZhciBodWUgPSAobWF0aFJvdW5kKGhzbC5oKSArIGFtb3VudCkgJSAzNjA7XG4gICAgaHNsLmggPSBodWUgPCAwID8gMzYwICsgaHVlIDogaHVlO1xuICAgIHJldHVybiB0aW55Y29sb3IoaHNsKTtcbn1cblxuLy8gQ29tYmluYXRpb24gRnVuY3Rpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFRoYW5rcyB0byBqUXVlcnkgeENvbG9yIGZvciBzb21lIG9mIHRoZSBpZGVhcyBiZWhpbmQgdGhlc2Vcbi8vIDxodHRwczovL2dpdGh1Yi5jb20vaW5mdXNpb24valF1ZXJ5LXhjb2xvci9ibG9iL21hc3Rlci9qcXVlcnkueGNvbG9yLmpzPlxuXG5mdW5jdGlvbiBjb21wbGVtZW50KGNvbG9yKSB7XG4gICAgdmFyIGhzbCA9IHRpbnljb2xvcihjb2xvcikudG9Ic2woKTtcbiAgICBoc2wuaCA9IChoc2wuaCArIDE4MCkgJSAzNjA7XG4gICAgcmV0dXJuIHRpbnljb2xvcihoc2wpO1xufVxuXG5mdW5jdGlvbiB0cmlhZChjb2xvcikge1xuICAgIHZhciBoc2wgPSB0aW55Y29sb3IoY29sb3IpLnRvSHNsKCk7XG4gICAgdmFyIGggPSBoc2wuaDtcbiAgICByZXR1cm4gW1xuICAgICAgICB0aW55Y29sb3IoY29sb3IpLFxuICAgICAgICB0aW55Y29sb3IoeyBoOiAoaCArIDEyMCkgJSAzNjAsIHM6IGhzbC5zLCBsOiBoc2wubCB9KSxcbiAgICAgICAgdGlueWNvbG9yKHsgaDogKGggKyAyNDApICUgMzYwLCBzOiBoc2wucywgbDogaHNsLmwgfSlcbiAgICBdO1xufVxuXG5mdW5jdGlvbiB0ZXRyYWQoY29sb3IpIHtcbiAgICB2YXIgaHNsID0gdGlueWNvbG9yKGNvbG9yKS50b0hzbCgpO1xuICAgIHZhciBoID0gaHNsLmg7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgdGlueWNvbG9yKGNvbG9yKSxcbiAgICAgICAgdGlueWNvbG9yKHsgaDogKGggKyA5MCkgJSAzNjAsIHM6IGhzbC5zLCBsOiBoc2wubCB9KSxcbiAgICAgICAgdGlueWNvbG9yKHsgaDogKGggKyAxODApICUgMzYwLCBzOiBoc2wucywgbDogaHNsLmwgfSksXG4gICAgICAgIHRpbnljb2xvcih7IGg6IChoICsgMjcwKSAlIDM2MCwgczogaHNsLnMsIGw6IGhzbC5sIH0pXG4gICAgXTtcbn1cblxuZnVuY3Rpb24gc3BsaXRjb21wbGVtZW50KGNvbG9yKSB7XG4gICAgdmFyIGhzbCA9IHRpbnljb2xvcihjb2xvcikudG9Ic2woKTtcbiAgICB2YXIgaCA9IGhzbC5oO1xuICAgIHJldHVybiBbXG4gICAgICAgIHRpbnljb2xvcihjb2xvciksXG4gICAgICAgIHRpbnljb2xvcih7IGg6IChoICsgNzIpICUgMzYwLCBzOiBoc2wucywgbDogaHNsLmx9KSxcbiAgICAgICAgdGlueWNvbG9yKHsgaDogKGggKyAyMTYpICUgMzYwLCBzOiBoc2wucywgbDogaHNsLmx9KVxuICAgIF07XG59XG5cbmZ1bmN0aW9uIGFuYWxvZ291cyhjb2xvciwgcmVzdWx0cywgc2xpY2VzKSB7XG4gICAgcmVzdWx0cyA9IHJlc3VsdHMgfHwgNjtcbiAgICBzbGljZXMgPSBzbGljZXMgfHwgMzA7XG5cbiAgICB2YXIgaHNsID0gdGlueWNvbG9yKGNvbG9yKS50b0hzbCgpO1xuICAgIHZhciBwYXJ0ID0gMzYwIC8gc2xpY2VzO1xuICAgIHZhciByZXQgPSBbdGlueWNvbG9yKGNvbG9yKV07XG5cbiAgICBmb3IgKGhzbC5oID0gKChoc2wuaCAtIChwYXJ0ICogcmVzdWx0cyA+PiAxKSkgKyA3MjApICUgMzYwOyAtLXJlc3VsdHM7ICkge1xuICAgICAgICBoc2wuaCA9IChoc2wuaCArIHBhcnQpICUgMzYwO1xuICAgICAgICByZXQucHVzaCh0aW55Y29sb3IoaHNsKSk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIG1vbm9jaHJvbWF0aWMoY29sb3IsIHJlc3VsdHMpIHtcbiAgICByZXN1bHRzID0gcmVzdWx0cyB8fCA2O1xuICAgIHZhciBoc3YgPSB0aW55Y29sb3IoY29sb3IpLnRvSHN2KCk7XG4gICAgdmFyIGggPSBoc3YuaCwgcyA9IGhzdi5zLCB2ID0gaHN2LnY7XG4gICAgdmFyIHJldCA9IFtdO1xuICAgIHZhciBtb2RpZmljYXRpb24gPSAxIC8gcmVzdWx0cztcblxuICAgIHdoaWxlIChyZXN1bHRzLS0pIHtcbiAgICAgICAgcmV0LnB1c2godGlueWNvbG9yKHsgaDogaCwgczogcywgdjogdn0pKTtcbiAgICAgICAgdiA9ICh2ICsgbW9kaWZpY2F0aW9uKSAlIDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbn1cblxuLy8gVXRpbGl0eSBGdW5jdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG50aW55Y29sb3IubWl4ID0gZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIsIGFtb3VudCkge1xuICAgIGFtb3VudCA9IChhbW91bnQgPT09IDApID8gMCA6IChhbW91bnQgfHwgNTApO1xuXG4gICAgdmFyIHJnYjEgPSB0aW55Y29sb3IoY29sb3IxKS50b1JnYigpO1xuICAgIHZhciByZ2IyID0gdGlueWNvbG9yKGNvbG9yMikudG9SZ2IoKTtcblxuICAgIHZhciBwID0gYW1vdW50IC8gMTAwO1xuICAgIHZhciB3ID0gcCAqIDIgLSAxO1xuICAgIHZhciBhID0gcmdiMi5hIC0gcmdiMS5hO1xuXG4gICAgdmFyIHcxO1xuXG4gICAgaWYgKHcgKiBhID09IC0xKSB7XG4gICAgICAgIHcxID0gdztcbiAgICB9IGVsc2Uge1xuICAgICAgICB3MSA9ICh3ICsgYSkgLyAoMSArIHcgKiBhKTtcbiAgICB9XG5cbiAgICB3MSA9ICh3MSArIDEpIC8gMjtcblxuICAgIHZhciB3MiA9IDEgLSB3MTtcblxuICAgIHZhciByZ2JhID0ge1xuICAgICAgICByOiByZ2IyLnIgKiB3MSArIHJnYjEuciAqIHcyLFxuICAgICAgICBnOiByZ2IyLmcgKiB3MSArIHJnYjEuZyAqIHcyLFxuICAgICAgICBiOiByZ2IyLmIgKiB3MSArIHJnYjEuYiAqIHcyLFxuICAgICAgICBhOiByZ2IyLmEgKiBwICArIHJnYjEuYSAqICgxIC0gcClcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRpbnljb2xvcihyZ2JhKTtcbn07XG5cblxuLy8gUmVhZGFiaWxpdHkgRnVuY3Rpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIDxodHRwOi8vd3d3LnczLm9yZy9UUi8yMDA4L1JFQy1XQ0FHMjAtMjAwODEyMTEvI2NvbnRyYXN0LXJhdGlvZGVmIChXQ0FHIFZlcnNpb24gMilcblxuLy8gYGNvbnRyYXN0YFxuLy8gQW5hbHl6ZSB0aGUgMiBjb2xvcnMgYW5kIHJldHVybnMgdGhlIGNvbG9yIGNvbnRyYXN0IGRlZmluZWQgYnkgKFdDQUcgVmVyc2lvbiAyKVxudGlueWNvbG9yLnJlYWRhYmlsaXR5ID0gZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIpIHtcbiAgICB2YXIgYzEgPSB0aW55Y29sb3IoY29sb3IxKTtcbiAgICB2YXIgYzIgPSB0aW55Y29sb3IoY29sb3IyKTtcbiAgICByZXR1cm4gKE1hdGgubWF4KGMxLmdldEx1bWluYW5jZSgpLGMyLmdldEx1bWluYW5jZSgpKSswLjA1KSAvIChNYXRoLm1pbihjMS5nZXRMdW1pbmFuY2UoKSxjMi5nZXRMdW1pbmFuY2UoKSkrMC4wNSk7XG59O1xuXG4vLyBgaXNSZWFkYWJsZWBcbi8vIEVuc3VyZSB0aGF0IGZvcmVncm91bmQgYW5kIGJhY2tncm91bmQgY29sb3IgY29tYmluYXRpb25zIG1lZXQgV0NBRzIgZ3VpZGVsaW5lcy5cbi8vIFRoZSB0aGlyZCBhcmd1bWVudCBpcyBhbiBvcHRpb25hbCBPYmplY3QuXG4vLyAgICAgIHRoZSAnbGV2ZWwnIHByb3BlcnR5IHN0YXRlcyAnQUEnIG9yICdBQUEnIC0gaWYgbWlzc2luZyBvciBpbnZhbGlkLCBpdCBkZWZhdWx0cyB0byAnQUEnO1xuLy8gICAgICB0aGUgJ3NpemUnIHByb3BlcnR5IHN0YXRlcyAnbGFyZ2UnIG9yICdzbWFsbCcgLSBpZiBtaXNzaW5nIG9yIGludmFsaWQsIGl0IGRlZmF1bHRzIHRvICdzbWFsbCcuXG4vLyBJZiB0aGUgZW50aXJlIG9iamVjdCBpcyBhYnNlbnQsIGlzUmVhZGFibGUgZGVmYXVsdHMgdG8ge2xldmVsOlwiQUFcIixzaXplOlwic21hbGxcIn0uXG5cbi8vICpFeGFtcGxlKlxuLy8gICAgdGlueWNvbG9yLmlzUmVhZGFibGUoXCIjMDAwXCIsIFwiIzExMVwiKSA9PiBmYWxzZVxuLy8gICAgdGlueWNvbG9yLmlzUmVhZGFibGUoXCIjMDAwXCIsIFwiIzExMVwiLHtsZXZlbDpcIkFBXCIsc2l6ZTpcImxhcmdlXCJ9KSA9PiBmYWxzZVxudGlueWNvbG9yLmlzUmVhZGFibGUgPSBmdW5jdGlvbihjb2xvcjEsIGNvbG9yMiwgd2NhZzIpIHtcbiAgICB2YXIgcmVhZGFiaWxpdHkgPSB0aW55Y29sb3IucmVhZGFiaWxpdHkoY29sb3IxLCBjb2xvcjIpO1xuICAgIHZhciB3Y2FnMlBhcm1zLCBvdXQ7XG5cbiAgICBvdXQgPSBmYWxzZTtcblxuICAgIHdjYWcyUGFybXMgPSB2YWxpZGF0ZVdDQUcyUGFybXMod2NhZzIpO1xuICAgIHN3aXRjaCAod2NhZzJQYXJtcy5sZXZlbCArIHdjYWcyUGFybXMuc2l6ZSkge1xuICAgICAgICBjYXNlIFwiQUFzbWFsbFwiOlxuICAgICAgICBjYXNlIFwiQUFBbGFyZ2VcIjpcbiAgICAgICAgICAgIG91dCA9IHJlYWRhYmlsaXR5ID49IDQuNTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiQUFsYXJnZVwiOlxuICAgICAgICAgICAgb3V0ID0gcmVhZGFiaWxpdHkgPj0gMztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiQUFBc21hbGxcIjpcbiAgICAgICAgICAgIG91dCA9IHJlYWRhYmlsaXR5ID49IDc7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcblxufTtcblxuLy8gYG1vc3RSZWFkYWJsZWBcbi8vIEdpdmVuIGEgYmFzZSBjb2xvciBhbmQgYSBsaXN0IG9mIHBvc3NpYmxlIGZvcmVncm91bmQgb3IgYmFja2dyb3VuZFxuLy8gY29sb3JzIGZvciB0aGF0IGJhc2UsIHJldHVybnMgdGhlIG1vc3QgcmVhZGFibGUgY29sb3IuXG4vLyBPcHRpb25hbGx5IHJldHVybnMgQmxhY2sgb3IgV2hpdGUgaWYgdGhlIG1vc3QgcmVhZGFibGUgY29sb3IgaXMgdW5yZWFkYWJsZS5cbi8vICpFeGFtcGxlKlxuLy8gICAgdGlueWNvbG9yLm1vc3RSZWFkYWJsZSh0aW55Y29sb3IubW9zdFJlYWRhYmxlKFwiIzEyM1wiLCBbXCIjMTI0XCIsIFwiIzEyNVwiXSx7aW5jbHVkZUZhbGxiYWNrQ29sb3JzOmZhbHNlfSkudG9IZXhTdHJpbmcoKTsgLy8gXCIjMTEyMjU1XCJcbi8vICAgIHRpbnljb2xvci5tb3N0UmVhZGFibGUodGlueWNvbG9yLm1vc3RSZWFkYWJsZShcIiMxMjNcIiwgW1wiIzEyNFwiLCBcIiMxMjVcIl0se2luY2x1ZGVGYWxsYmFja0NvbG9yczp0cnVlfSkudG9IZXhTdHJpbmcoKTsgIC8vIFwiI2ZmZmZmZlwiXG4vLyAgICB0aW55Y29sb3IubW9zdFJlYWRhYmxlKFwiI2E4MDE1YVwiLCBbXCIjZmFmM2YzXCJdLHtpbmNsdWRlRmFsbGJhY2tDb2xvcnM6dHJ1ZSxsZXZlbDpcIkFBQVwiLHNpemU6XCJsYXJnZVwifSkudG9IZXhTdHJpbmcoKTsgLy8gXCIjZmFmM2YzXCJcbi8vICAgIHRpbnljb2xvci5tb3N0UmVhZGFibGUoXCIjYTgwMTVhXCIsIFtcIiNmYWYzZjNcIl0se2luY2x1ZGVGYWxsYmFja0NvbG9yczp0cnVlLGxldmVsOlwiQUFBXCIsc2l6ZTpcInNtYWxsXCJ9KS50b0hleFN0cmluZygpOyAvLyBcIiNmZmZmZmZcIlxudGlueWNvbG9yLm1vc3RSZWFkYWJsZSA9IGZ1bmN0aW9uKGJhc2VDb2xvciwgY29sb3JMaXN0LCBhcmdzKSB7XG4gICAgdmFyIGJlc3RDb2xvciA9IG51bGw7XG4gICAgdmFyIGJlc3RTY29yZSA9IDA7XG4gICAgdmFyIHJlYWRhYmlsaXR5O1xuICAgIHZhciBpbmNsdWRlRmFsbGJhY2tDb2xvcnMsIGxldmVsLCBzaXplIDtcbiAgICBhcmdzID0gYXJncyB8fCB7fTtcbiAgICBpbmNsdWRlRmFsbGJhY2tDb2xvcnMgPSBhcmdzLmluY2x1ZGVGYWxsYmFja0NvbG9ycyA7XG4gICAgbGV2ZWwgPSBhcmdzLmxldmVsO1xuICAgIHNpemUgPSBhcmdzLnNpemU7XG5cbiAgICBmb3IgKHZhciBpPSAwOyBpIDwgY29sb3JMaXN0Lmxlbmd0aCA7IGkrKykge1xuICAgICAgICByZWFkYWJpbGl0eSA9IHRpbnljb2xvci5yZWFkYWJpbGl0eShiYXNlQ29sb3IsIGNvbG9yTGlzdFtpXSk7XG4gICAgICAgIGlmIChyZWFkYWJpbGl0eSA+IGJlc3RTY29yZSkge1xuICAgICAgICAgICAgYmVzdFNjb3JlID0gcmVhZGFiaWxpdHk7XG4gICAgICAgICAgICBiZXN0Q29sb3IgPSB0aW55Y29sb3IoY29sb3JMaXN0W2ldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aW55Y29sb3IuaXNSZWFkYWJsZShiYXNlQ29sb3IsIGJlc3RDb2xvciwge1wibGV2ZWxcIjpsZXZlbCxcInNpemVcIjpzaXplfSkgfHwgIWluY2x1ZGVGYWxsYmFja0NvbG9ycykge1xuICAgICAgICByZXR1cm4gYmVzdENvbG9yO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgYXJncy5pbmNsdWRlRmFsbGJhY2tDb2xvcnM9ZmFsc2U7XG4gICAgICAgIHJldHVybiB0aW55Y29sb3IubW9zdFJlYWRhYmxlKGJhc2VDb2xvcixbXCIjZmZmXCIsIFwiIzAwMFwiXSxhcmdzKTtcbiAgICB9XG59O1xuXG5cbi8vIEJpZyBMaXN0IG9mIENvbG9yc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyA8aHR0cDovL3d3dy53My5vcmcvVFIvY3NzMy1jb2xvci8jc3ZnLWNvbG9yPlxudmFyIG5hbWVzID0gdGlueWNvbG9yLm5hbWVzID0ge1xuICAgIGFsaWNlYmx1ZTogXCJmMGY4ZmZcIixcbiAgICBhbnRpcXVld2hpdGU6IFwiZmFlYmQ3XCIsXG4gICAgYXF1YTogXCIwZmZcIixcbiAgICBhcXVhbWFyaW5lOiBcIjdmZmZkNFwiLFxuICAgIGF6dXJlOiBcImYwZmZmZlwiLFxuICAgIGJlaWdlOiBcImY1ZjVkY1wiLFxuICAgIGJpc3F1ZTogXCJmZmU0YzRcIixcbiAgICBibGFjazogXCIwMDBcIixcbiAgICBibGFuY2hlZGFsbW9uZDogXCJmZmViY2RcIixcbiAgICBibHVlOiBcIjAwZlwiLFxuICAgIGJsdWV2aW9sZXQ6IFwiOGEyYmUyXCIsXG4gICAgYnJvd246IFwiYTUyYTJhXCIsXG4gICAgYnVybHl3b29kOiBcImRlYjg4N1wiLFxuICAgIGJ1cm50c2llbm5hOiBcImVhN2U1ZFwiLFxuICAgIGNhZGV0Ymx1ZTogXCI1ZjllYTBcIixcbiAgICBjaGFydHJldXNlOiBcIjdmZmYwMFwiLFxuICAgIGNob2NvbGF0ZTogXCJkMjY5MWVcIixcbiAgICBjb3JhbDogXCJmZjdmNTBcIixcbiAgICBjb3JuZmxvd2VyYmx1ZTogXCI2NDk1ZWRcIixcbiAgICBjb3Juc2lsazogXCJmZmY4ZGNcIixcbiAgICBjcmltc29uOiBcImRjMTQzY1wiLFxuICAgIGN5YW46IFwiMGZmXCIsXG4gICAgZGFya2JsdWU6IFwiMDAwMDhiXCIsXG4gICAgZGFya2N5YW46IFwiMDA4YjhiXCIsXG4gICAgZGFya2dvbGRlbnJvZDogXCJiODg2MGJcIixcbiAgICBkYXJrZ3JheTogXCJhOWE5YTlcIixcbiAgICBkYXJrZ3JlZW46IFwiMDA2NDAwXCIsXG4gICAgZGFya2dyZXk6IFwiYTlhOWE5XCIsXG4gICAgZGFya2toYWtpOiBcImJkYjc2YlwiLFxuICAgIGRhcmttYWdlbnRhOiBcIjhiMDA4YlwiLFxuICAgIGRhcmtvbGl2ZWdyZWVuOiBcIjU1NmIyZlwiLFxuICAgIGRhcmtvcmFuZ2U6IFwiZmY4YzAwXCIsXG4gICAgZGFya29yY2hpZDogXCI5OTMyY2NcIixcbiAgICBkYXJrcmVkOiBcIjhiMDAwMFwiLFxuICAgIGRhcmtzYWxtb246IFwiZTk5NjdhXCIsXG4gICAgZGFya3NlYWdyZWVuOiBcIjhmYmM4ZlwiLFxuICAgIGRhcmtzbGF0ZWJsdWU6IFwiNDgzZDhiXCIsXG4gICAgZGFya3NsYXRlZ3JheTogXCIyZjRmNGZcIixcbiAgICBkYXJrc2xhdGVncmV5OiBcIjJmNGY0ZlwiLFxuICAgIGRhcmt0dXJxdW9pc2U6IFwiMDBjZWQxXCIsXG4gICAgZGFya3Zpb2xldDogXCI5NDAwZDNcIixcbiAgICBkZWVwcGluazogXCJmZjE0OTNcIixcbiAgICBkZWVwc2t5Ymx1ZTogXCIwMGJmZmZcIixcbiAgICBkaW1ncmF5OiBcIjY5Njk2OVwiLFxuICAgIGRpbWdyZXk6IFwiNjk2OTY5XCIsXG4gICAgZG9kZ2VyYmx1ZTogXCIxZTkwZmZcIixcbiAgICBmaXJlYnJpY2s6IFwiYjIyMjIyXCIsXG4gICAgZmxvcmFsd2hpdGU6IFwiZmZmYWYwXCIsXG4gICAgZm9yZXN0Z3JlZW46IFwiMjI4YjIyXCIsXG4gICAgZnVjaHNpYTogXCJmMGZcIixcbiAgICBnYWluc2Jvcm86IFwiZGNkY2RjXCIsXG4gICAgZ2hvc3R3aGl0ZTogXCJmOGY4ZmZcIixcbiAgICBnb2xkOiBcImZmZDcwMFwiLFxuICAgIGdvbGRlbnJvZDogXCJkYWE1MjBcIixcbiAgICBncmF5OiBcIjgwODA4MFwiLFxuICAgIGdyZWVuOiBcIjAwODAwMFwiLFxuICAgIGdyZWVueWVsbG93OiBcImFkZmYyZlwiLFxuICAgIGdyZXk6IFwiODA4MDgwXCIsXG4gICAgaG9uZXlkZXc6IFwiZjBmZmYwXCIsXG4gICAgaG90cGluazogXCJmZjY5YjRcIixcbiAgICBpbmRpYW5yZWQ6IFwiY2Q1YzVjXCIsXG4gICAgaW5kaWdvOiBcIjRiMDA4MlwiLFxuICAgIGl2b3J5OiBcImZmZmZmMFwiLFxuICAgIGtoYWtpOiBcImYwZTY4Y1wiLFxuICAgIGxhdmVuZGVyOiBcImU2ZTZmYVwiLFxuICAgIGxhdmVuZGVyYmx1c2g6IFwiZmZmMGY1XCIsXG4gICAgbGF3bmdyZWVuOiBcIjdjZmMwMFwiLFxuICAgIGxlbW9uY2hpZmZvbjogXCJmZmZhY2RcIixcbiAgICBsaWdodGJsdWU6IFwiYWRkOGU2XCIsXG4gICAgbGlnaHRjb3JhbDogXCJmMDgwODBcIixcbiAgICBsaWdodGN5YW46IFwiZTBmZmZmXCIsXG4gICAgbGlnaHRnb2xkZW5yb2R5ZWxsb3c6IFwiZmFmYWQyXCIsXG4gICAgbGlnaHRncmF5OiBcImQzZDNkM1wiLFxuICAgIGxpZ2h0Z3JlZW46IFwiOTBlZTkwXCIsXG4gICAgbGlnaHRncmV5OiBcImQzZDNkM1wiLFxuICAgIGxpZ2h0cGluazogXCJmZmI2YzFcIixcbiAgICBsaWdodHNhbG1vbjogXCJmZmEwN2FcIixcbiAgICBsaWdodHNlYWdyZWVuOiBcIjIwYjJhYVwiLFxuICAgIGxpZ2h0c2t5Ymx1ZTogXCI4N2NlZmFcIixcbiAgICBsaWdodHNsYXRlZ3JheTogXCI3ODlcIixcbiAgICBsaWdodHNsYXRlZ3JleTogXCI3ODlcIixcbiAgICBsaWdodHN0ZWVsYmx1ZTogXCJiMGM0ZGVcIixcbiAgICBsaWdodHllbGxvdzogXCJmZmZmZTBcIixcbiAgICBsaW1lOiBcIjBmMFwiLFxuICAgIGxpbWVncmVlbjogXCIzMmNkMzJcIixcbiAgICBsaW5lbjogXCJmYWYwZTZcIixcbiAgICBtYWdlbnRhOiBcImYwZlwiLFxuICAgIG1hcm9vbjogXCI4MDAwMDBcIixcbiAgICBtZWRpdW1hcXVhbWFyaW5lOiBcIjY2Y2RhYVwiLFxuICAgIG1lZGl1bWJsdWU6IFwiMDAwMGNkXCIsXG4gICAgbWVkaXVtb3JjaGlkOiBcImJhNTVkM1wiLFxuICAgIG1lZGl1bXB1cnBsZTogXCI5MzcwZGJcIixcbiAgICBtZWRpdW1zZWFncmVlbjogXCIzY2IzNzFcIixcbiAgICBtZWRpdW1zbGF0ZWJsdWU6IFwiN2I2OGVlXCIsXG4gICAgbWVkaXVtc3ByaW5nZ3JlZW46IFwiMDBmYTlhXCIsXG4gICAgbWVkaXVtdHVycXVvaXNlOiBcIjQ4ZDFjY1wiLFxuICAgIG1lZGl1bXZpb2xldHJlZDogXCJjNzE1ODVcIixcbiAgICBtaWRuaWdodGJsdWU6IFwiMTkxOTcwXCIsXG4gICAgbWludGNyZWFtOiBcImY1ZmZmYVwiLFxuICAgIG1pc3R5cm9zZTogXCJmZmU0ZTFcIixcbiAgICBtb2NjYXNpbjogXCJmZmU0YjVcIixcbiAgICBuYXZham93aGl0ZTogXCJmZmRlYWRcIixcbiAgICBuYXZ5OiBcIjAwMDA4MFwiLFxuICAgIG9sZGxhY2U6IFwiZmRmNWU2XCIsXG4gICAgb2xpdmU6IFwiODA4MDAwXCIsXG4gICAgb2xpdmVkcmFiOiBcIjZiOGUyM1wiLFxuICAgIG9yYW5nZTogXCJmZmE1MDBcIixcbiAgICBvcmFuZ2VyZWQ6IFwiZmY0NTAwXCIsXG4gICAgb3JjaGlkOiBcImRhNzBkNlwiLFxuICAgIHBhbGVnb2xkZW5yb2Q6IFwiZWVlOGFhXCIsXG4gICAgcGFsZWdyZWVuOiBcIjk4ZmI5OFwiLFxuICAgIHBhbGV0dXJxdW9pc2U6IFwiYWZlZWVlXCIsXG4gICAgcGFsZXZpb2xldHJlZDogXCJkYjcwOTNcIixcbiAgICBwYXBheWF3aGlwOiBcImZmZWZkNVwiLFxuICAgIHBlYWNocHVmZjogXCJmZmRhYjlcIixcbiAgICBwZXJ1OiBcImNkODUzZlwiLFxuICAgIHBpbms6IFwiZmZjMGNiXCIsXG4gICAgcGx1bTogXCJkZGEwZGRcIixcbiAgICBwb3dkZXJibHVlOiBcImIwZTBlNlwiLFxuICAgIHB1cnBsZTogXCI4MDAwODBcIixcbiAgICByZWJlY2NhcHVycGxlOiBcIjY2MzM5OVwiLFxuICAgIHJlZDogXCJmMDBcIixcbiAgICByb3N5YnJvd246IFwiYmM4ZjhmXCIsXG4gICAgcm95YWxibHVlOiBcIjQxNjllMVwiLFxuICAgIHNhZGRsZWJyb3duOiBcIjhiNDUxM1wiLFxuICAgIHNhbG1vbjogXCJmYTgwNzJcIixcbiAgICBzYW5keWJyb3duOiBcImY0YTQ2MFwiLFxuICAgIHNlYWdyZWVuOiBcIjJlOGI1N1wiLFxuICAgIHNlYXNoZWxsOiBcImZmZjVlZVwiLFxuICAgIHNpZW5uYTogXCJhMDUyMmRcIixcbiAgICBzaWx2ZXI6IFwiYzBjMGMwXCIsXG4gICAgc2t5Ymx1ZTogXCI4N2NlZWJcIixcbiAgICBzbGF0ZWJsdWU6IFwiNmE1YWNkXCIsXG4gICAgc2xhdGVncmF5OiBcIjcwODA5MFwiLFxuICAgIHNsYXRlZ3JleTogXCI3MDgwOTBcIixcbiAgICBzbm93OiBcImZmZmFmYVwiLFxuICAgIHNwcmluZ2dyZWVuOiBcIjAwZmY3ZlwiLFxuICAgIHN0ZWVsYmx1ZTogXCI0NjgyYjRcIixcbiAgICB0YW46IFwiZDJiNDhjXCIsXG4gICAgdGVhbDogXCIwMDgwODBcIixcbiAgICB0aGlzdGxlOiBcImQ4YmZkOFwiLFxuICAgIHRvbWF0bzogXCJmZjYzNDdcIixcbiAgICB0dXJxdW9pc2U6IFwiNDBlMGQwXCIsXG4gICAgdmlvbGV0OiBcImVlODJlZVwiLFxuICAgIHdoZWF0OiBcImY1ZGViM1wiLFxuICAgIHdoaXRlOiBcImZmZlwiLFxuICAgIHdoaXRlc21va2U6IFwiZjVmNWY1XCIsXG4gICAgeWVsbG93OiBcImZmMFwiLFxuICAgIHllbGxvd2dyZWVuOiBcIjlhY2QzMlwiXG59O1xuXG4vLyBNYWtlIGl0IGVhc3kgdG8gYWNjZXNzIGNvbG9ycyB2aWEgYGhleE5hbWVzW2hleF1gXG52YXIgaGV4TmFtZXMgPSB0aW55Y29sb3IuaGV4TmFtZXMgPSBmbGlwKG5hbWVzKTtcblxuXG4vLyBVdGlsaXRpZXNcbi8vIC0tLS0tLS0tLVxuXG4vLyBgeyAnbmFtZTEnOiAndmFsMScgfWAgYmVjb21lcyBgeyAndmFsMSc6ICduYW1lMScgfWBcbmZ1bmN0aW9uIGZsaXAobykge1xuICAgIHZhciBmbGlwcGVkID0geyB9O1xuICAgIGZvciAodmFyIGkgaW4gbykge1xuICAgICAgICBpZiAoby5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgZmxpcHBlZFtvW2ldXSA9IGk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZsaXBwZWQ7XG59XG5cbi8vIFJldHVybiBhIHZhbGlkIGFscGhhIHZhbHVlIFswLDFdIHdpdGggYWxsIGludmFsaWQgdmFsdWVzIGJlaW5nIHNldCB0byAxXG5mdW5jdGlvbiBib3VuZEFscGhhKGEpIHtcbiAgICBhID0gcGFyc2VGbG9hdChhKTtcblxuICAgIGlmIChpc05hTihhKSB8fCBhIDwgMCB8fCBhID4gMSkge1xuICAgICAgICBhID0gMTtcbiAgICB9XG5cbiAgICByZXR1cm4gYTtcbn1cblxuLy8gVGFrZSBpbnB1dCBmcm9tIFswLCBuXSBhbmQgcmV0dXJuIGl0IGFzIFswLCAxXVxuZnVuY3Rpb24gYm91bmQwMShuLCBtYXgpIHtcbiAgICBpZiAoaXNPbmVQb2ludFplcm8obikpIHsgbiA9IFwiMTAwJVwiOyB9XG5cbiAgICB2YXIgcHJvY2Vzc1BlcmNlbnQgPSBpc1BlcmNlbnRhZ2Uobik7XG4gICAgbiA9IG1hdGhNaW4obWF4LCBtYXRoTWF4KDAsIHBhcnNlRmxvYXQobikpKTtcblxuICAgIC8vIEF1dG9tYXRpY2FsbHkgY29udmVydCBwZXJjZW50YWdlIGludG8gbnVtYmVyXG4gICAgaWYgKHByb2Nlc3NQZXJjZW50KSB7XG4gICAgICAgIG4gPSBwYXJzZUludChuICogbWF4LCAxMCkgLyAxMDA7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIGZsb2F0aW5nIHBvaW50IHJvdW5kaW5nIGVycm9yc1xuICAgIGlmICgobWF0aC5hYnMobiAtIG1heCkgPCAwLjAwMDAwMSkpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgLy8gQ29udmVydCBpbnRvIFswLCAxXSByYW5nZSBpZiBpdCBpc24ndCBhbHJlYWR5XG4gICAgcmV0dXJuIChuICUgbWF4KSAvIHBhcnNlRmxvYXQobWF4KTtcbn1cblxuLy8gRm9yY2UgYSBudW1iZXIgYmV0d2VlbiAwIGFuZCAxXG5mdW5jdGlvbiBjbGFtcDAxKHZhbCkge1xuICAgIHJldHVybiBtYXRoTWluKDEsIG1hdGhNYXgoMCwgdmFsKSk7XG59XG5cbi8vIFBhcnNlIGEgYmFzZS0xNiBoZXggdmFsdWUgaW50byBhIGJhc2UtMTAgaW50ZWdlclxuZnVuY3Rpb24gcGFyc2VJbnRGcm9tSGV4KHZhbCkge1xuICAgIHJldHVybiBwYXJzZUludCh2YWwsIDE2KTtcbn1cblxuLy8gTmVlZCB0byBoYW5kbGUgMS4wIGFzIDEwMCUsIHNpbmNlIG9uY2UgaXQgaXMgYSBudW1iZXIsIHRoZXJlIGlzIG5vIGRpZmZlcmVuY2UgYmV0d2VlbiBpdCBhbmQgMVxuLy8gPGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNzQyMjA3Mi9qYXZhc2NyaXB0LWhvdy10by1kZXRlY3QtbnVtYmVyLWFzLWEtZGVjaW1hbC1pbmNsdWRpbmctMS0wPlxuZnVuY3Rpb24gaXNPbmVQb2ludFplcm8obikge1xuICAgIHJldHVybiB0eXBlb2YgbiA9PSBcInN0cmluZ1wiICYmIG4uaW5kZXhPZignLicpICE9IC0xICYmIHBhcnNlRmxvYXQobikgPT09IDE7XG59XG5cbi8vIENoZWNrIHRvIHNlZSBpZiBzdHJpbmcgcGFzc2VkIGluIGlzIGEgcGVyY2VudGFnZVxuZnVuY3Rpb24gaXNQZXJjZW50YWdlKG4pIHtcbiAgICByZXR1cm4gdHlwZW9mIG4gPT09IFwic3RyaW5nXCIgJiYgbi5pbmRleE9mKCclJykgIT0gLTE7XG59XG5cbi8vIEZvcmNlIGEgaGV4IHZhbHVlIHRvIGhhdmUgMiBjaGFyYWN0ZXJzXG5mdW5jdGlvbiBwYWQyKGMpIHtcbiAgICByZXR1cm4gYy5sZW5ndGggPT0gMSA/ICcwJyArIGMgOiAnJyArIGM7XG59XG5cbi8vIFJlcGxhY2UgYSBkZWNpbWFsIHdpdGggaXQncyBwZXJjZW50YWdlIHZhbHVlXG5mdW5jdGlvbiBjb252ZXJ0VG9QZXJjZW50YWdlKG4pIHtcbiAgICBpZiAobiA8PSAxKSB7XG4gICAgICAgIG4gPSAobiAqIDEwMCkgKyBcIiVcIjtcbiAgICB9XG5cbiAgICByZXR1cm4gbjtcbn1cblxuLy8gQ29udmVydHMgYSBkZWNpbWFsIHRvIGEgaGV4IHZhbHVlXG5mdW5jdGlvbiBjb252ZXJ0RGVjaW1hbFRvSGV4KGQpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChwYXJzZUZsb2F0KGQpICogMjU1KS50b1N0cmluZygxNik7XG59XG4vLyBDb252ZXJ0cyBhIGhleCB2YWx1ZSB0byBhIGRlY2ltYWxcbmZ1bmN0aW9uIGNvbnZlcnRIZXhUb0RlY2ltYWwoaCkge1xuICAgIHJldHVybiAocGFyc2VJbnRGcm9tSGV4KGgpIC8gMjU1KTtcbn1cblxudmFyIG1hdGNoZXJzID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgLy8gPGh0dHA6Ly93d3cudzMub3JnL1RSL2NzczMtdmFsdWVzLyNpbnRlZ2Vycz5cbiAgICB2YXIgQ1NTX0lOVEVHRVIgPSBcIlstXFxcXCtdP1xcXFxkKyU/XCI7XG5cbiAgICAvLyA8aHR0cDovL3d3dy53My5vcmcvVFIvY3NzMy12YWx1ZXMvI251bWJlci12YWx1ZT5cbiAgICB2YXIgQ1NTX05VTUJFUiA9IFwiWy1cXFxcK10/XFxcXGQqXFxcXC5cXFxcZCslP1wiO1xuXG4gICAgLy8gQWxsb3cgcG9zaXRpdmUvbmVnYXRpdmUgaW50ZWdlci9udW1iZXIuICBEb24ndCBjYXB0dXJlIHRoZSBlaXRoZXIvb3IsIGp1c3QgdGhlIGVudGlyZSBvdXRjb21lLlxuICAgIHZhciBDU1NfVU5JVCA9IFwiKD86XCIgKyBDU1NfTlVNQkVSICsgXCIpfCg/OlwiICsgQ1NTX0lOVEVHRVIgKyBcIilcIjtcblxuICAgIC8vIEFjdHVhbCBtYXRjaGluZy5cbiAgICAvLyBQYXJlbnRoZXNlcyBhbmQgY29tbWFzIGFyZSBvcHRpb25hbCwgYnV0IG5vdCByZXF1aXJlZC5cbiAgICAvLyBXaGl0ZXNwYWNlIGNhbiB0YWtlIHRoZSBwbGFjZSBvZiBjb21tYXMgb3Igb3BlbmluZyBwYXJlblxuICAgIHZhciBQRVJNSVNTSVZFX01BVENIMyA9IFwiW1xcXFxzfFxcXFwoXSsoXCIgKyBDU1NfVU5JVCArIFwiKVssfFxcXFxzXSsoXCIgKyBDU1NfVU5JVCArIFwiKVssfFxcXFxzXSsoXCIgKyBDU1NfVU5JVCArIFwiKVxcXFxzKlxcXFwpP1wiO1xuICAgIHZhciBQRVJNSVNTSVZFX01BVENINCA9IFwiW1xcXFxzfFxcXFwoXSsoXCIgKyBDU1NfVU5JVCArIFwiKVssfFxcXFxzXSsoXCIgKyBDU1NfVU5JVCArIFwiKVssfFxcXFxzXSsoXCIgKyBDU1NfVU5JVCArIFwiKVssfFxcXFxzXSsoXCIgKyBDU1NfVU5JVCArIFwiKVxcXFxzKlxcXFwpP1wiO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmdiOiBuZXcgUmVnRXhwKFwicmdiXCIgKyBQRVJNSVNTSVZFX01BVENIMyksXG4gICAgICAgIHJnYmE6IG5ldyBSZWdFeHAoXCJyZ2JhXCIgKyBQRVJNSVNTSVZFX01BVENINCksXG4gICAgICAgIGhzbDogbmV3IFJlZ0V4cChcImhzbFwiICsgUEVSTUlTU0lWRV9NQVRDSDMpLFxuICAgICAgICBoc2xhOiBuZXcgUmVnRXhwKFwiaHNsYVwiICsgUEVSTUlTU0lWRV9NQVRDSDQpLFxuICAgICAgICBoc3Y6IG5ldyBSZWdFeHAoXCJoc3ZcIiArIFBFUk1JU1NJVkVfTUFUQ0gzKSxcbiAgICAgICAgaHN2YTogbmV3IFJlZ0V4cChcImhzdmFcIiArIFBFUk1JU1NJVkVfTUFUQ0g0KSxcbiAgICAgICAgaGV4MzogL14jPyhbMC05YS1mQS1GXXsxfSkoWzAtOWEtZkEtRl17MX0pKFswLTlhLWZBLUZdezF9KSQvLFxuICAgICAgICBoZXg2OiAvXiM/KFswLTlhLWZBLUZdezJ9KShbMC05YS1mQS1GXXsyfSkoWzAtOWEtZkEtRl17Mn0pJC8sXG4gICAgICAgIGhleDg6IC9eIz8oWzAtOWEtZkEtRl17Mn0pKFswLTlhLWZBLUZdezJ9KShbMC05YS1mQS1GXXsyfSkoWzAtOWEtZkEtRl17Mn0pJC9cbiAgICB9O1xufSkoKTtcblxuLy8gYHN0cmluZ0lucHV0VG9PYmplY3RgXG4vLyBQZXJtaXNzaXZlIHN0cmluZyBwYXJzaW5nLiAgVGFrZSBpbiBhIG51bWJlciBvZiBmb3JtYXRzLCBhbmQgb3V0cHV0IGFuIG9iamVjdFxuLy8gYmFzZWQgb24gZGV0ZWN0ZWQgZm9ybWF0LiAgUmV0dXJucyBgeyByLCBnLCBiIH1gIG9yIGB7IGgsIHMsIGwgfWAgb3IgYHsgaCwgcywgdn1gXG5mdW5jdGlvbiBzdHJpbmdJbnB1dFRvT2JqZWN0KGNvbG9yKSB7XG5cbiAgICBjb2xvciA9IGNvbG9yLnJlcGxhY2UodHJpbUxlZnQsJycpLnJlcGxhY2UodHJpbVJpZ2h0LCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICB2YXIgbmFtZWQgPSBmYWxzZTtcbiAgICBpZiAobmFtZXNbY29sb3JdKSB7XG4gICAgICAgIGNvbG9yID0gbmFtZXNbY29sb3JdO1xuICAgICAgICBuYW1lZCA9IHRydWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKGNvbG9yID09ICd0cmFuc3BhcmVudCcpIHtcbiAgICAgICAgcmV0dXJuIHsgcjogMCwgZzogMCwgYjogMCwgYTogMCwgZm9ybWF0OiBcIm5hbWVcIiB9O1xuICAgIH1cblxuICAgIC8vIFRyeSB0byBtYXRjaCBzdHJpbmcgaW5wdXQgdXNpbmcgcmVndWxhciBleHByZXNzaW9ucy5cbiAgICAvLyBLZWVwIG1vc3Qgb2YgdGhlIG51bWJlciBib3VuZGluZyBvdXQgb2YgdGhpcyBmdW5jdGlvbiAtIGRvbid0IHdvcnJ5IGFib3V0IFswLDFdIG9yIFswLDEwMF0gb3IgWzAsMzYwXVxuICAgIC8vIEp1c3QgcmV0dXJuIGFuIG9iamVjdCBhbmQgbGV0IHRoZSBjb252ZXJzaW9uIGZ1bmN0aW9ucyBoYW5kbGUgdGhhdC5cbiAgICAvLyBUaGlzIHdheSB0aGUgcmVzdWx0IHdpbGwgYmUgdGhlIHNhbWUgd2hldGhlciB0aGUgdGlueWNvbG9yIGlzIGluaXRpYWxpemVkIHdpdGggc3RyaW5nIG9yIG9iamVjdC5cbiAgICB2YXIgbWF0Y2g7XG4gICAgaWYgKChtYXRjaCA9IG1hdGNoZXJzLnJnYi5leGVjKGNvbG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIHsgcjogbWF0Y2hbMV0sIGc6IG1hdGNoWzJdLCBiOiBtYXRjaFszXSB9O1xuICAgIH1cbiAgICBpZiAoKG1hdGNoID0gbWF0Y2hlcnMucmdiYS5leGVjKGNvbG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIHsgcjogbWF0Y2hbMV0sIGc6IG1hdGNoWzJdLCBiOiBtYXRjaFszXSwgYTogbWF0Y2hbNF0gfTtcbiAgICB9XG4gICAgaWYgKChtYXRjaCA9IG1hdGNoZXJzLmhzbC5leGVjKGNvbG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIHsgaDogbWF0Y2hbMV0sIHM6IG1hdGNoWzJdLCBsOiBtYXRjaFszXSB9O1xuICAgIH1cbiAgICBpZiAoKG1hdGNoID0gbWF0Y2hlcnMuaHNsYS5leGVjKGNvbG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIHsgaDogbWF0Y2hbMV0sIHM6IG1hdGNoWzJdLCBsOiBtYXRjaFszXSwgYTogbWF0Y2hbNF0gfTtcbiAgICB9XG4gICAgaWYgKChtYXRjaCA9IG1hdGNoZXJzLmhzdi5leGVjKGNvbG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIHsgaDogbWF0Y2hbMV0sIHM6IG1hdGNoWzJdLCB2OiBtYXRjaFszXSB9O1xuICAgIH1cbiAgICBpZiAoKG1hdGNoID0gbWF0Y2hlcnMuaHN2YS5leGVjKGNvbG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIHsgaDogbWF0Y2hbMV0sIHM6IG1hdGNoWzJdLCB2OiBtYXRjaFszXSwgYTogbWF0Y2hbNF0gfTtcbiAgICB9XG4gICAgaWYgKChtYXRjaCA9IG1hdGNoZXJzLmhleDguZXhlYyhjb2xvcikpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhOiBjb252ZXJ0SGV4VG9EZWNpbWFsKG1hdGNoWzFdKSxcbiAgICAgICAgICAgIHI6IHBhcnNlSW50RnJvbUhleChtYXRjaFsyXSksXG4gICAgICAgICAgICBnOiBwYXJzZUludEZyb21IZXgobWF0Y2hbM10pLFxuICAgICAgICAgICAgYjogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzRdKSxcbiAgICAgICAgICAgIGZvcm1hdDogbmFtZWQgPyBcIm5hbWVcIiA6IFwiaGV4OFwiXG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmICgobWF0Y2ggPSBtYXRjaGVycy5oZXg2LmV4ZWMoY29sb3IpKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcjogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzFdKSxcbiAgICAgICAgICAgIGc6IHBhcnNlSW50RnJvbUhleChtYXRjaFsyXSksXG4gICAgICAgICAgICBiOiBwYXJzZUludEZyb21IZXgobWF0Y2hbM10pLFxuICAgICAgICAgICAgZm9ybWF0OiBuYW1lZCA/IFwibmFtZVwiIDogXCJoZXhcIlxuICAgICAgICB9O1xuICAgIH1cbiAgICBpZiAoKG1hdGNoID0gbWF0Y2hlcnMuaGV4My5leGVjKGNvbG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHI6IHBhcnNlSW50RnJvbUhleChtYXRjaFsxXSArICcnICsgbWF0Y2hbMV0pLFxuICAgICAgICAgICAgZzogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzJdICsgJycgKyBtYXRjaFsyXSksXG4gICAgICAgICAgICBiOiBwYXJzZUludEZyb21IZXgobWF0Y2hbM10gKyAnJyArIG1hdGNoWzNdKSxcbiAgICAgICAgICAgIGZvcm1hdDogbmFtZWQgPyBcIm5hbWVcIiA6IFwiaGV4XCJcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlV0NBRzJQYXJtcyhwYXJtcykge1xuICAgIC8vIHJldHVybiB2YWxpZCBXQ0FHMiBwYXJtcyBmb3IgaXNSZWFkYWJsZS5cbiAgICAvLyBJZiBpbnB1dCBwYXJtcyBhcmUgaW52YWxpZCwgcmV0dXJuIHtcImxldmVsXCI6XCJBQVwiLCBcInNpemVcIjpcInNtYWxsXCJ9XG4gICAgdmFyIGxldmVsLCBzaXplO1xuICAgIHBhcm1zID0gcGFybXMgfHwge1wibGV2ZWxcIjpcIkFBXCIsIFwic2l6ZVwiOlwic21hbGxcIn07XG4gICAgbGV2ZWwgPSAocGFybXMubGV2ZWwgfHwgXCJBQVwiKS50b1VwcGVyQ2FzZSgpO1xuICAgIHNpemUgPSAocGFybXMuc2l6ZSB8fCBcInNtYWxsXCIpLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKGxldmVsICE9PSBcIkFBXCIgJiYgbGV2ZWwgIT09IFwiQUFBXCIpIHtcbiAgICAgICAgbGV2ZWwgPSBcIkFBXCI7XG4gICAgfVxuICAgIGlmIChzaXplICE9PSBcInNtYWxsXCIgJiYgc2l6ZSAhPT0gXCJsYXJnZVwiKSB7XG4gICAgICAgIHNpemUgPSBcInNtYWxsXCI7XG4gICAgfVxuICAgIHJldHVybiB7XCJsZXZlbFwiOmxldmVsLCBcInNpemVcIjpzaXplfTtcbn1cblxuLy8gTm9kZTogRXhwb3J0IGZ1bmN0aW9uXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gdGlueWNvbG9yO1xufVxuLy8gQU1EL3JlcXVpcmVqczogRGVmaW5lIHRoZSBtb2R1bGVcbmVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbiAoKSB7cmV0dXJuIHRpbnljb2xvcjt9KTtcbn1cbi8vIEJyb3dzZXI6IEV4cG9zZSB0byB3aW5kb3dcbmVsc2Uge1xuICAgIHdpbmRvdy50aW55Y29sb3IgPSB0aW55Y29sb3I7XG59XG5cbn0pKCk7XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2xpY2tCZWhhdmlvdXIodm0pIHtcblx0aWYgKCF2bSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcInZtIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoIWtvLmlzT2JzZXJ2YWJsZSh2bS5zdGF0ZSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ2bS5zdGF0ZSBoYXMgdG8gYmUgYSBrbm9ja291dCBvYnNlcnZhYmxlIVwiKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNlRG93bigpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShcImFjdGl2ZVwiKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNlVXAoKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUoXCJob3ZlclwiKTtcblx0fVxuXG5cdGlmICghdm0uZXZlbnRIYW5kbGVycykge1xuXHRcdHZtLmV2ZW50SGFuZGxlcnMgPSB7fTtcblx0fVxuXG5cdHZtLmV2ZW50SGFuZGxlcnMubW91c2Vkb3duID0gbW91c2VEb3duO1xuXHR2bS5ldmVudEhhbmRsZXJzLm1vdXNldXAgPSBtb3VzZVVwO1xuXG5cdHJldHVybiB2bTtcbn07XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZm9jdXNCZWhhdmlvdXIodm0pIHtcblxuXHRpZiAoIXZtKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwidm0gaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmICgha28uaXNPYnNlcnZhYmxlKHZtLnN0YXRlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcInZtLnN0YXRlIGhhcyB0byBiZSBhIGtub2Nrb3V0IG9ic2VydmFibGUhXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZm9jdXMoKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUoXCJhY3RpdmVcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBibHVyKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKFwiZGVmYXVsdFwiKTtcblx0fVxuXG5cdGlmICghdm0uZXZlbnRIYW5kbGVycykge1xuXHRcdHZtLmV2ZW50SGFuZGxlcnMgPSB7fTtcblx0fVxuXG5cdHZtLmV2ZW50SGFuZGxlcnMuZm9jdXMgPSBmb2N1cztcblx0dm0uZXZlbnRIYW5kbGVycy5ibHVyID0gYmx1cjtcblxuXHRyZXR1cm4gdm07XG59O1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGhvdmVyQmVoYXZpb3VyKHZtKSB7XG5cdGlmICghdm0pIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ2bSBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKCFrby5pc09ic2VydmFibGUodm0uc3RhdGUpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwidm0uc3RhdGUgaGFzIHRvIGJlIGEga25vY2tvdXQgb2JzZXJ2YWJsZSFcIik7XG5cdH1cblxuXHR2YXIgcHJldmlvdXNTdGF0ZTtcblxuXHRmdW5jdGlvbiBtb3VzZU92ZXIoKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiIHx8IGFjdFN0YXRlID09PSBcImFjdGl2ZVwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKGFjdFN0YXRlICE9PSBcImhvdmVyXCIpIHtcblx0XHRcdHByZXZpb3VzU3RhdGUgPSBhY3RTdGF0ZTtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShcImhvdmVyXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gbW91c2VPdXQoKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiIHx8IGFjdFN0YXRlID09PSBcImFjdGl2ZVwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUocHJldmlvdXNTdGF0ZSk7XG5cdH1cblxuXHRpZiAoIXZtLmV2ZW50SGFuZGxlcnMpIHtcblx0XHR2bS5ldmVudEhhbmRsZXJzID0ge307XG5cdH1cblxuXHR2bS5ldmVudEhhbmRsZXJzLm1vdXNlb3ZlciA9IG1vdXNlT3Zlcjtcblx0dm0uZXZlbnRIYW5kbGVycy5tb3VzZW91dCA9IG1vdXNlT3V0O1xuXG5cblx0cmV0dXJuIHZtO1xufTtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgdm1zID0ge307XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2VsZWN0QmVoYXZpb3VyKHZtLCBjb25maWcpIHtcblx0aWYgKCF2bSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcInZtIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cblx0dmFyIGdyb3VwID0gY29uZmlnLmdyb3VwIHx8IFwiZGVmYXVsdFwiO1xuXG5cdGlmICghdm1zW2dyb3VwXSkge1xuXHRcdHZtc1tncm91cF0gPSBbXTtcblx0fVxuXG5cdHZtc1tncm91cF0ucHVzaCh2bSk7XG5cblx0ZnVuY3Rpb24gbW91c2VEb3duKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKFwiYWN0aXZlXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gbW91c2VVcCgpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgYWN0R3JvdXBWbXMgPSB2bXNbZ3JvdXBdO1xuXG5cdFx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYWN0R3JvdXBWbXMubGVuZ3RoOyBpZHggKz0gMSkge1xuXHRcdFx0dmFyIGFjdFZtID0gYWN0R3JvdXBWbXNbaWR4XTtcblxuXHRcdFx0aWYgKGFjdFZtID09PSB2bSkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0YWN0Vm0uc3RhdGUoXCJkZWZhdWx0XCIpO1xuXHRcdH1cblx0fVxuXG5cdGlmICghdm0uZXZlbnRIYW5kbGVycykge1xuXHRcdHZtLmV2ZW50SGFuZGxlcnMgPSB7fTtcblx0fVxuXG5cdHZtLmV2ZW50SGFuZGxlcnMubW91c2Vkb3duID0gbW91c2VEb3duO1xuXHR2bS5ldmVudEhhbmRsZXJzLm1vdXNldXAgPSBtb3VzZVVwO1xuXG5cdHJldHVybiB2bTtcbn07XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbnZhciBob3ZlckJlaGF2aW91ciA9IHJlcXVpcmUoXCIuL2JlaGF2aW91cnMvaG92ZXJcIik7XG52YXIgZm9jdXNCZWhhdmlvdXIgPSByZXF1aXJlKFwiLi9iZWhhdmlvdXJzL2ZvY3VzXCIpO1xudmFyIGNsaWNrQmVoYXZpb3VyID0gcmVxdWlyZShcIi4vYmVoYXZpb3Vycy9jbGlja1wiKTtcbnZhciBzZWxlY3RCZWhhdmlvdXIgPSByZXF1aXJlKFwiLi9iZWhhdmlvdXJzL3NlbGVjdFwiKTtcblxuXG5mdW5jdGlvbiBjcmVhdGVCYXNlVm0oY29uZmlnKSB7XG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHRpZiAoIWNvbmZpZy5jb21wb25lbnQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuY29tcG9uZW50IGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoIWNvbmZpZy5zdHlsZSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zdHlsZSBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0dmFyIGNvbXBvbmVudCA9IGNvbmZpZy5jb21wb25lbnQ7XG5cdHZhciBzdHlsZSA9IGNvbmZpZy5zdHlsZTtcblxuXHR2YXIgc3RhdGUgPSBrby5vYnNlcnZhYmxlKGNvbmZpZy5zdGF0ZSB8fCBcImRlZmF1bHRcIik7XG5cdHZhciB2YXJpYXRpb24gPSBjb25maWcudmFyaWF0aW9uIHx8IFwiZGVmYXVsdFwiO1xuXG5cblx0dmFyIGNzc0NsYXNzQ29tcHV0ZWQgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gXCJrbm9iLVwiICsgY29tcG9uZW50ICsgXCIgc3RhdGUtXCIgKyBzdGF0ZSgpICsgXCIgdmFyaWF0aW9uLVwiICsgdmFyaWF0aW9uO1xuXHR9KTtcblx0dmFyIHN0eWxlQ29tcHV0ZWQgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgc3RhdGVWYWwgPSBzdGF0ZSgpO1xuXG5cdFx0cmV0dXJuIHN0eWxlW3ZhcmlhdGlvbl1bc3RhdGVWYWxdO1xuXHR9KTtcblxuXHR2YXIgdm0gPSB7XG5cdFx0dmFyaWF0aW9uOiB2YXJpYXRpb24sXG5cdFx0c3RhdGU6IHN0YXRlLFxuXG5cdFx0Y3NzQ2xhc3M6IGNzc0NsYXNzQ29tcHV0ZWQsXG5cdFx0c3R5bGU6IHN0eWxlQ29tcHV0ZWQsXG5cblx0XHRldmVudEhhbmRsZXJzOiB7fVxuXHR9O1xuXG5cblx0ZnVuY3Rpb24gY3JlYXRlRW5hYmxlcihiZWhhdmlvdXIsIHByb3BzKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGVuYWJsZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGJlaGF2aW91cih2bSwgY29uZmlnKTtcblx0XHRcdH0sXG5cdFx0XHRkaXNhYmxlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cHJvcHMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG5cdFx0XHRcdFx0aWYgKHZtLmV2ZW50SGFuZGxlcnNbcHJvcF0pIHtcblx0XHRcdFx0XHRcdGRlbGV0ZSB2bS5ldmVudEhhbmRsZXJzW3Byb3BdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXG5cdHZtLmJlaGF2aW91cnMgPSB7XG5cdFx0aG92ZXI6IGNyZWF0ZUVuYWJsZXIoaG92ZXJCZWhhdmlvdXIsIFtcIm1vdXNlb3ZlclwiLCBcIm1vdXNlb3V0XCJdKSxcblx0XHRmb2N1czogY3JlYXRlRW5hYmxlcihmb2N1c0JlaGF2aW91ciwgW1wiZm9jdXNcIiwgXCJibHVyXCJdKSxcblx0XHRjbGljazogY3JlYXRlRW5hYmxlcihjbGlja0JlaGF2aW91ciwgW1wibW91c2Vkb3duXCIsIFwibW91c2V1cFwiXSksXG5cdFx0c2VsZWN0OiBjcmVhdGVFbmFibGVyKHNlbGVjdEJlaGF2aW91ciwgW1wibW91c2Vkb3duXCIsIFwibW91c2V1cFwiXSlcblx0fTtcblxuXHRyZXR1cm4gdm07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZVZtO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVTdHlsZUNvbmZpZyh0aGVtZSkge1xuXG5cdHZhciB0aW55Y29sb3IgPSByZXF1aXJlKFwidGlueWNvbG9yMlwiKTtcblxuXHRyZXR1cm4ge1xuXHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmJsYWNrXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zZWNvbmRhcnlDb2xvcikubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5saWdodGVuKCkudG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zZWNvbmRhcnlDb2xvcikuZGFya2VuKCkudG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5tZWRpdW1HcmF5LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmxpZ2h0R3JheSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmxpZ2h0R3JheVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJwcmltYXJ5XCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnByaW1hcnlDb2xvcixcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5wcmltYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUucHJpbWFyeUNvbG9yKS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOnRpbnljb2xvcih0aGVtZS5wcmltYXJ5Q29sb3IpLmxpZ2h0ZW4oKS50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUucHJpbWFyeUNvbG9yKS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5wcmltYXJ5Q29sb3IpLmRhcmtlbigpLnRvU3RyaW5nKClcblx0XHRcdH0sXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmRhcmtHcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuZGFya0dyYXlcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwidGFiXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuYmxhY2tcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmxpZ2h0ZW4oKS50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5saWdodEdyYXlcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwicGFnaW5hdGlvblwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmxpZ2h0R3JheSxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuYmxhY2tcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmxpZ2h0R3JheSkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmxpZ2h0R3JheSkubGlnaHRlbigpLnRvU3RyaW5nKClcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5saWdodEdyYXkpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmxpZ2h0R3JheSkuZGFya2VuKCkudG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5tZWRpdW1HcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubWVkaXVtR3JheVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJtb2RhbEhlYWRcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuZGFya0dyYXksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuZGFya0dyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5tZWRpdW1HcmF5LFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLm1lZGl1bUdyYXlcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmRhcmtHcmF5LFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmRhcmtHcmF5XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcImFjdGlvblwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmluZm8udGV4dCxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuaW5mby50ZXh0LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuaW5mby50ZXh0XG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmluZm8udGV4dCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5pbmZvLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcImRhbmdlclwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5lcnJvci50ZXh0LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmVycm9yLnRleHQsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5lcnJvci50ZXh0XG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmVycm9yLnRleHQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IudGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwiaW5mb1wiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOnRoZW1lLmluZm8uYmFja2dyb3VuZCxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5pbmZvLmJhY2tncm91bmQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby5iYWNrZ3JvdW5kKS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby5iYWNrZ3JvdW5kKS5saWdodGVuKCkudG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmluZm8uYmFja2dyb3VuZCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby5iYWNrZ3JvdW5kKS5kYXJrZW4oKS50b1N0cmluZygpXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcInN1Y2Nlc3NcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc3VjY2Vzcy5iYWNrZ3JvdW5kLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnN1Y2Nlc3MuYmFja2dyb3VuZCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zdWNjZXNzLmJhY2tncm91bmQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zdWNjZXNzLmJhY2tncm91bmQpLmxpZ2h0ZW4oKS50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc3VjY2Vzcy5iYWNrZ3JvdW5kKS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zdWNjZXNzLmJhY2tncm91bmQpLmRhcmtlbigpLnRvU3RyaW5nKClcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwid2FybmluZ1wiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53YXJuaW5nLmJhY2tncm91bmQsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2FybmluZy5iYWNrZ3JvdW5kLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLndhcm5pbmcuYmFja2dyb3VuZCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLndhcm5pbmcuYmFja2dyb3VuZCkubGlnaHRlbigpLnRvU3RyaW5nKClcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS53YXJuaW5nLmJhY2tncm91bmQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLndhcm5pbmcuYmFja2dyb3VuZCkuZGFya2VuKCkudG9TdHJpbmcoKVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJlcnJvclwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5lcnJvci5iYWNrZ3JvdW5kLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmVycm9yLmJhY2tncm91bmQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IuYmFja2dyb3VuZCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmVycm9yLmJhY2tncm91bmQpLmxpZ2h0ZW4oKS50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IuYmFja2dyb3VuZCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IuYmFja2dyb3VuZCkuZGFya2VuKCkudG9TdHJpbmcoKVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSAnPGJ1dHRvbiBkYXRhLWJpbmQ9XCJjc3M6IGNzc0NsYXNzLFxcblx0XHRcdFx0XHRzdHlsZTogc3R5bGUsXFxuXHRcdFx0XHRcdGNsaWNrOiBjbGljayxcXG5cdFx0XHRcdFx0ZXZlbnQ6IGV2ZW50SGFuZGxlcnMsXFxuXHRcdFx0XHRcdGRpc2FibGU6IHN0YXRlKCkgPT09IFxcJ2Rpc2FibGVkXFwnXCI+XFxuXFxuXHQ8c3BhbiBjbGFzcz1cImljb24td3JhcHBlclwiIGRhdGEtYmluZD1cImlmOiBsZWZ0SWNvblwiPlxcblx0XHQ8c3ZnIGNsYXNzPVwiaWNvblwiPlxcblx0XHRcdDx1c2UgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgZGF0YS1iaW5kPVwiYXR0cjoge1xcJ3hsaW5rOmhyZWZcXCc6IGxlZnRJY29ufVwiIHhsaW5rOmhyZWY9XCJcIj48L3VzZT5cXG5cdFx0PC9zdmc+XFxuXHQ8L3NwYW4+XFxuXFxuXHQ8c3BhbiBjbGFzcz1cImxhYmVsXCIgZGF0YS1iaW5kPVwidGV4dDogbGFiZWxcIj48L3NwYW4+XFxuXFxuXHQ8c3BhbiBjbGFzcz1cImljb24td3JhcHBlclwiIGRhdGEtYmluZD1cImlmOiByaWdodEljb25cIj5cXG5cdFx0PHN2ZyBjbGFzcz1cImljb25cIj5cXG5cdFx0XHQ8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIGRhdGEtYmluZD1cImF0dHI6IHtcXCd4bGluazpocmVmXFwnOiByaWdodEljb259XCIgeGxpbms6aHJlZj1cIlwiPjwvdXNlPlxcblx0XHQ8L3N2Zz5cXG5cdDwvc3Bhbj5cXG48L2J1dHRvbj4nOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlU3R5bGVDb25maWcodGhlbWUpIHtcblxuXHR2YXIgdGlueWNvbG9yID0gcmVxdWlyZShcInRpbnljb2xvcjJcIik7XG5cblx0cmV0dXJuIHtcblx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvclxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zZWNvbmRhcnlDb2xvcikubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zZWNvbmRhcnlDb2xvcikuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLm1lZGl1bUdyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubGlnaHRHcmF5XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdFwicHJpbWFyeVwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5wcmltYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUucHJpbWFyeUNvbG9yLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUucHJpbWFyeUNvbG9yXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5wcmltYXJ5Q29sb3IpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6dGlueWNvbG9yKHRoZW1lLnByaW1hcnlDb2xvcikubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnByaW1hcnlDb2xvcikuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUucHJpbWFyeUNvbG9yKS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmRhcmtHcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuZGFya0dyYXlcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwidGFiXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuYmxhY2tcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5saWdodGVuKCkudG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5saWdodGVuKCkudG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5saWdodEdyYXlcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwicGFnaW5hdGlvblwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zZWNvbmRhcnlDb2xvcikubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubWVkaXVtR3JheSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLm1lZGl1bUdyYXlcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwibW9kYWxIZWFkXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3Jcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcImFjdGlvblwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmluZm8udGV4dCxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuaW5mby50ZXh0LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuaW5mby50ZXh0XG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmluZm8udGV4dCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5pbmZvLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcImRhbmdlclwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5lcnJvci50ZXh0LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmVycm9yLnRleHQsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5lcnJvci50ZXh0XG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmVycm9yLnRleHQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IudGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwiaW5mb1wiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOnRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmluZm8udGV4dCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5pbmZvLnRleHQsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5pbmZvLnRleHRcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmluZm8udGV4dCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmluZm8udGV4dCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmluZm8udGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby50ZXh0KS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwic3VjY2Vzc1wiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5zdWNjZXNzLnRleHQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuc3VjY2Vzcy50ZXh0LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuc3VjY2Vzcy50ZXh0XG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zdWNjZXNzLnRleHQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zdWNjZXNzLnRleHQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zdWNjZXNzLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnN1Y2Nlc3MudGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcIndhcm5pbmdcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2FybmluZy50ZXh0LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndhcm5pbmcudGV4dCxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndhcm5pbmcudGV4dFxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUud2FybmluZy50ZXh0KS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUud2FybmluZy50ZXh0KS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUud2FybmluZy50ZXh0KS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS53YXJuaW5nLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJlcnJvclwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5lcnJvci50ZXh0LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmVycm9yLnRleHQsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5lcnJvci50ZXh0XG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5lcnJvci50ZXh0KS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IudGV4dCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmVycm9yLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmVycm9yLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVTdHlsZUNvbmZpZyh0aGVtZSkge1xuXG5cdHZhciB0aW55Y29sb3IgPSByZXF1aXJlKFwidGlueWNvbG9yMlwiKTtcblxuXHRyZXR1cm4ge1xuXHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJib3JkZXJSYWRpdXNcIjogXCI1cHhcIixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zZWNvbmRhcnlDb2xvcikubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUubWVkaXVtR3JheSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5saWdodEdyYXlcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0XCJwcmltYXJ5XCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnByaW1hcnlDb2xvcixcblx0XHRcdFx0XCJib3JkZXJSYWRpdXNcIjogXCI1cHhcIixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5wcmltYXJ5Q29sb3IsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5wcmltYXJ5Q29sb3Jcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnByaW1hcnlDb2xvcikubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjp0aW55Y29sb3IodGhlbWUucHJpbWFyeUNvbG9yKS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUucHJpbWFyeUNvbG9yKS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5wcmltYXJ5Q29sb3IpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuZGFya0dyYXksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5kYXJrR3JheVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJ0YWJcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiYm9yZGVyUmFkaXVzXCI6IFwiNXB4XCIsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5ibGFja1xuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmxpZ2h0ZW4oKS50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmxpZ2h0ZW4oKS50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmxpZ2h0R3JheSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmxpZ2h0R3JheVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJwYWdpbmF0aW9uXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3Jcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5tZWRpdW1HcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubWVkaXVtR3JheVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJtb2RhbEhlYWRcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvclxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3Jcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwiYWN0aW9uXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuaW5mby50ZXh0LFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5pbmZvLnRleHQsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5pbmZvLnRleHRcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby50ZXh0KS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmluZm8udGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwiZGFuZ2VyXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmVycm9yLnRleHQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuZXJyb3IudGV4dCxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmVycm9yLnRleHRcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IudGV4dCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5lcnJvci50ZXh0KS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJpbmZvXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6dGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuaW5mby50ZXh0LFxuXHRcdFx0XHRcImJvcmRlclJhZGl1c1wiOiBcIjVweFwiLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmluZm8udGV4dCxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmluZm8udGV4dFxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby50ZXh0KS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby50ZXh0KS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby50ZXh0KS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5pbmZvLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJzdWNjZXNzXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnN1Y2Nlc3MudGV4dCxcblx0XHRcdFx0XCJib3JkZXJSYWRpdXNcIjogXCI1cHhcIixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5zdWNjZXNzLnRleHQsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5zdWNjZXNzLnRleHRcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnN1Y2Nlc3MudGV4dCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnN1Y2Nlc3MudGV4dCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnN1Y2Nlc3MudGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc3VjY2Vzcy50ZXh0KS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwid2FybmluZ1wiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53YXJuaW5nLnRleHQsXG5cdFx0XHRcdFwiYm9yZGVyUmFkaXVzXCI6IFwiNXB4XCIsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2FybmluZy50ZXh0LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2FybmluZy50ZXh0XG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS53YXJuaW5nLnRleHQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS53YXJuaW5nLnRleHQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS53YXJuaW5nLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLndhcm5pbmcudGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcImVycm9yXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmVycm9yLnRleHQsXG5cdFx0XHRcdFwiYm9yZGVyUmFkaXVzXCI6IFwiNXB4XCIsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuZXJyb3IudGV4dCxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmVycm9yLnRleHRcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmVycm9yLnRleHQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5lcnJvci50ZXh0KS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IudGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IudGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlQ29uZmlnKHRoZW1lKSB7XG5cblx0dmFyIHRpbnljb2xvciA9IHJlcXVpcmUoXCJ0aW55Y29sb3IyXCIpO1xuXG5cdHJldHVybiB7XG5cdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuYmxhY2tcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmxpZ2h0ZW4oKS50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5kYXJrZW4oKS50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLm1lZGl1bUdyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubGlnaHRHcmF5XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcInByaW1hcnlcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUucHJpbWFyeUNvbG9yLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnByaW1hcnlDb2xvcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5wcmltYXJ5Q29sb3IpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6dGlueWNvbG9yKHRoZW1lLnByaW1hcnlDb2xvcikubGlnaHRlbigpLnRvU3RyaW5nKClcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5wcmltYXJ5Q29sb3IpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnByaW1hcnlDb2xvcikuZGFya2VuKCkudG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuZGFya0dyYXksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5kYXJrR3JheVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJ0YWJcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5ibGFja1xuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zZWNvbmRhcnlDb2xvcikubGlnaHRlbigpLnRvU3RyaW5nKClcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmxpZ2h0R3JheSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmxpZ2h0R3JheVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJwYWdpbmF0aW9uXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5ibGFja1xuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUubGlnaHRHcmF5KS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUubGlnaHRHcmF5KS5saWdodGVuKCkudG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmxpZ2h0R3JheSkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUubGlnaHRHcmF5KS5kYXJrZW4oKS50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLm1lZGl1bUdyYXksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5tZWRpdW1HcmF5XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcIm1vZGFsSGVhZFwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvclxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJhY3Rpb25cIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5pbmZvLnRleHQsXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmluZm8udGV4dCxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmluZm8udGV4dFxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5pbmZvLnRleHQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby50ZXh0KS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJkYW5nZXJcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuZXJyb3IudGV4dCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5lcnJvci50ZXh0LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuZXJyb3IudGV4dFxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5lcnJvci50ZXh0KS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmVycm9yLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcImluZm9cIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjp0aGVtZS5pbmZvLmJhY2tncm91bmQsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuaW5mby5iYWNrZ3JvdW5kLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmluZm8uYmFja2dyb3VuZCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmluZm8uYmFja2dyb3VuZCkubGlnaHRlbigpLnRvU3RyaW5nKClcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5pbmZvLmJhY2tncm91bmQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmluZm8uYmFja2dyb3VuZCkuZGFya2VuKCkudG9TdHJpbmcoKVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJzdWNjZXNzXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnN1Y2Nlc3MuYmFja2dyb3VuZCxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5zdWNjZXNzLmJhY2tncm91bmQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc3VjY2Vzcy5iYWNrZ3JvdW5kKS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc3VjY2Vzcy5iYWNrZ3JvdW5kKS5saWdodGVuKCkudG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnN1Y2Nlc3MuYmFja2dyb3VuZCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc3VjY2Vzcy5iYWNrZ3JvdW5kKS5kYXJrZW4oKS50b1N0cmluZygpXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcIndhcm5pbmdcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2FybmluZy5iYWNrZ3JvdW5kLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLndhcm5pbmcuYmFja2dyb3VuZCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS53YXJuaW5nLmJhY2tncm91bmQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS53YXJuaW5nLmJhY2tncm91bmQpLmxpZ2h0ZW4oKS50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUud2FybmluZy5iYWNrZ3JvdW5kKS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS53YXJuaW5nLmJhY2tncm91bmQpLmRhcmtlbigpLnRvU3RyaW5nKClcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwiZXJyb3JcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuZXJyb3IuYmFja2dyb3VuZCxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5lcnJvci5iYWNrZ3JvdW5kLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmVycm9yLmJhY2tncm91bmQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5lcnJvci5iYWNrZ3JvdW5kKS5saWdodGVuKCkudG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmVycm9yLmJhY2tncm91bmQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmVycm9yLmJhY2tncm91bmQpLmRhcmtlbigpLnRvU3RyaW5nKClcblx0XHRcdH1cblx0XHR9XG5cdH07XG59OyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxudmFyIGJhc2UgPSByZXF1aXJlKFwiLi4vYmFzZS92bVwiKTtcblxuZnVuY3Rpb24gY3JlYXRlQnV0dG9uKGNvbmZpZykge1xuXHRpZiAoIWNvbmZpZykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZyBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKGNvbmZpZy5jbGljayAmJiB0eXBlb2YgY29uZmlnLmNsaWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjbGljayBoYXMgdG8gYmUgYSBmdW5jdGlvbiFcIik7XG5cdH1cblxuXHRpZiAoIWNvbmZpZy5sYWJlbCAmJiAhY29uZmlnLmxlZnRJY29uICYmICFjb25maWcucmlnaHRJY29uICYmICFjb25maWcuaWNvbikge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImVpdGhlciBsYWJlbC9sZWZ0aWNvbi9yaWdodGljb24vaWNvbiBoYXMgdG8gYmUgZ2l2ZW4hXCIpO1xuXHR9XG5cblx0Y29uZmlnLmNvbXBvbmVudCA9IFwiYnV0dG9uXCI7XG5cblx0dmFyIHZtID0gYmFzZShjb25maWcpO1xuXG5cdHZtLmJlaGF2aW91cnMuaG92ZXIuZW5hYmxlKCk7XG5cblx0aWYgKGNvbmZpZy5yYWRpbykge1xuXHRcdHZtLmJlaGF2aW91cnMuc2VsZWN0LmVuYWJsZSgpO1xuXHR9IGVsc2Uge1xuXHRcdHZtLmJlaGF2aW91cnMuY2xpY2suZW5hYmxlKCk7XG5cdH1cblxuXHR2bS5sZWZ0SWNvbiA9IGtvLm9ic2VydmFibGUoa28udW53cmFwKGNvbmZpZy5sZWZ0SWNvbiB8fCBjb25maWcuaWNvbikpO1xuXHR2bS5yaWdodEljb24gPSBrby5vYnNlcnZhYmxlKGtvLnVud3JhcChjb25maWcucmlnaHRJY29uKSk7XG5cdHZtLmxhYmVsID0ga28ub2JzZXJ2YWJsZShrby51bndyYXAoY29uZmlnLmxhYmVsKSk7XG5cdHZtLnZhbHVlID0gY29uZmlnLnZhbHVlO1xuXHR2bS5jbGljayA9IGNvbmZpZy5jbGljayB8fCBmdW5jdGlvbigpIHt9O1xuXG5cdHJldHVybiB2bTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCdXR0b247XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLy8qL1xuXG4vL1RISVMgRklMRSBTSE9VTEQgQkUgR0VORVJBVEVEXG5cbnZhciBleHRlbmQgPSByZXF1aXJlKFwiZXh0ZW5kXCIpO1xuXG52YXIgcmVnaXN0ZXJDb21wb25lbnQgPSByZXF1aXJlKFwiLi9rbm9iUmVnaXN0ZXJDb21wb25lbnRcIik7XG5cbnZhciBiYXNlVm0gPSByZXF1aXJlKFwiLi9iYXNlL3ZtXCIpO1xuXG52YXIgY3JlYXRlQnV0dG9uU3R5bGU7XG52YXIgY3JlYXRlQnV0dG9uU3R5bGVEZWZhdWx0ID0gcmVxdWlyZShcIi4vYnV0dG9uL3N0eWxlXCIpO1xudmFyIGNyZWF0ZUJ1dHRvblN0eWxlVGhlbWUyID0gcmVxdWlyZShcIi4vYnV0dG9uL3RoZW1lMlwiKTtcbnZhciBjcmVhdGVCdXR0b25TdHlsZVRoZW1lMyA9IHJlcXVpcmUoXCIuL2J1dHRvbi90aGVtZTNcIik7XG52YXIgY3JlYXRlQnV0dG9uU3R5bGVUaGVtZTQgPSByZXF1aXJlKFwiLi9idXR0b24vdGhlbWU0XCIpO1xuXG52YXIgY3JlYXRlSW5wdXRTdHlsZTtcbnZhciBjcmVhdGVJbnB1dFN0eWxlRGVmYXVsdCA9IHJlcXVpcmUoXCIuL2lucHV0L3N0eWxlXCIpO1xudmFyIGNyZWF0ZUlucHV0U3R5bGVUaGVtZTIgPSByZXF1aXJlKFwiLi9pbnB1dC90aGVtZTJcIik7XG52YXIgY3JlYXRlSW5wdXRTdHlsZVRoZW1lMyA9IHJlcXVpcmUoXCIuL2lucHV0L3RoZW1lM1wiKTtcbnZhciBjcmVhdGVJbnB1dFN0eWxlVGhlbWU0ID0gcmVxdWlyZShcIi4vaW5wdXQvdGhlbWU0XCIpO1xuXG52YXIgY3JlYXRlTW9kYWxTdHlsZTtcbnZhciBjcmVhdGVNb2RhbFN0eWxlRGVmYXVsdCA9IHJlcXVpcmUoXCIuL21vZGFsL3N0eWxlXCIpO1xudmFyIGNyZWF0ZU1vZGFsU3R5bGVUaGVtZTIgPSByZXF1aXJlKFwiLi9tb2RhbC90aGVtZTJcIik7XG52YXIgY3JlYXRlTW9kYWxTdHlsZVRoZW1lMyA9IHJlcXVpcmUoXCIuL21vZGFsL3RoZW1lM1wiKTtcbnZhciBjcmVhdGVNb2RhbFN0eWxlVGhlbWU0ID0gcmVxdWlyZShcIi4vbW9kYWwvdGhlbWU0XCIpO1xuXG52YXIgY3JlYXRlUGFnZWRMaXN0U3R5bGU7XG52YXIgY3JlYXRlUGFnZWRMaXN0U3R5bGVEZWZhdWx0ID0gcmVxdWlyZShcIi4vcGFnZWRMaXN0L3N0eWxlXCIpO1xudmFyIGNyZWF0ZVBhZ2VkTGlzdFN0eWxlVGhlbWUyID0gcmVxdWlyZShcIi4vcGFnZWRMaXN0L3RoZW1lMlwiKTtcbnZhciBjcmVhdGVQYWdlZExpc3RTdHlsZVRoZW1lMyA9IHJlcXVpcmUoXCIuL3BhZ2VkTGlzdC90aGVtZTNcIik7XG52YXIgY3JlYXRlUGFnZWRMaXN0U3R5bGVUaGVtZTQgPSByZXF1aXJlKFwiLi9wYWdlZExpc3QvdGhlbWU0XCIpO1xuXG52YXIgY3JlYXRlTm90aWZpY2F0aW9uU3R5bGU7XG52YXIgY3JlYXRlTm90aWZpY2F0aW9uU3R5bGVEZWZhdWx0ID0gcmVxdWlyZShcIi4vbm90aWZpY2F0aW9uQmFyL3N0eWxlXCIpO1xudmFyIGNyZWF0ZU5vdGlmaWNhdGlvblN0eWxlVGhlbWUyID0gcmVxdWlyZShcIi4vbm90aWZpY2F0aW9uQmFyL3RoZW1lMlwiKTtcbnZhciBjcmVhdGVOb3RpZmljYXRpb25TdHlsZVRoZW1lMyA9IHJlcXVpcmUoXCIuL25vdGlmaWNhdGlvbkJhci90aGVtZTNcIik7XG52YXIgY3JlYXRlTm90aWZpY2F0aW9uU3R5bGVUaGVtZTQgPSByZXF1aXJlKFwiLi9ub3RpZmljYXRpb25CYXIvdGhlbWU0XCIpO1xuXG5mdW5jdGlvbiBpbml0S25vYihjb25maWcpIHtcblx0dmFyIGRlZmF1bHRJY29ucyA9IHtcblx0XHRzZWFyY2g6IFwiI2ljb24tc2VhcmNoXCIsXG5cdFx0c29ydDoge1xuXHRcdFx0YXNjOiBcIiNpY29uLXNvcnQtYXNjXCIsXG5cdFx0XHRkZXNjOiBcIiNpY29uLXNvcnQtZGVzY1wiXG5cdFx0fSxcblx0XHRkcm9wZG93bjogXCIjaWNvbi1leHBhbmQtbW9yZVwiLFxuXHRcdGxvYWRpbmc6IFwiI2ljb24tbG9hZGluZ1wiLFxuXHRcdHBhZ2luYXRpb246IHtcblx0XHRcdGZpcnN0OiBcIiNpY29uLWZpcnN0LXBhZ2VcIixcblx0XHRcdHByZXY6IFwiI2ljb24tY2hldnJvbi1sZWZ0XCIsXG5cdFx0XHRsYXN0OiBcIiNpY29uLWNoZXZyb24tcmlnaHRcIixcblx0XHRcdG5leHQ6IFwiI2ljb24tbGFzdC1wYWdlXCJcblx0XHR9XG5cdH07XG5cblx0dmFyIGRlZmF1bHRMYWJlbHMgPSB7XG5cdFx0bm9SZXN1bHRzOiBcIk5vIHJlc3VsdHNcIlxuXHR9O1xuXG5cblx0dmFyIGNvbG9yU2V0ID0gY29uZmlnLmNvbG9yU2V0O1xuXHR2YXIgdGhlbWUgPSBjb25maWcudGhlbWU7XG5cblx0dmFyIGljb25zID0gZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0SWNvbnMsIGNvbmZpZy5pY29ucyk7XG5cdHZhciBsYWJlbHMgPSBleHRlbmQodHJ1ZSwge30sIGRlZmF1bHRMYWJlbHMsIGNvbmZpZy5sYWJlbHMpO1xuXG5cdGlmICh0eXBlb2YgdGhlbWUgPT09IFwib2JqZWN0XCIpIHtcblxuXHRcdGlmICh0eXBlb2YgdGhlbWUuY3JlYXRlQnV0dG9uU3R5bGUgIT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnRoZW1lLmNyZWF0ZUJ1dHRvblN0eWxlIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIHRoZW1lLmNyZWF0ZUlucHV0U3R5bGUgIT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnRoZW1lLmNyZWF0ZUlucHV0U3R5bGUgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgdGhlbWUuY3JlYXRlTW9kYWxTdHlsZSAhPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudGhlbWUuY3JlYXRlTW9kYWxTdHlsZSBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiB0aGVtZS5jcmVhdGVQYWdlZExpc3RTdHlsZSAhPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudGhlbWUuY3JlYXRlUGFnZWRMaXN0U3R5bGUgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgdGhlbWUuY3JlYXRlTm90aWZpY2F0aW9uU3R5bGUgIT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnRoZW1lLmNyZWF0ZU5vdGlmaWNhdGlvblN0eWxlIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcblx0XHR9XG5cblx0XHRjcmVhdGVCdXR0b25TdHlsZSA9IHRoZW1lLmNyZWF0ZUJ1dHRvblN0eWxlO1xuXHRcdGNyZWF0ZUlucHV0U3R5bGUgPSB0aGVtZS5jcmVhdGVJbnB1dFN0eWxlO1xuXHRcdGNyZWF0ZU1vZGFsU3R5bGUgPSB0aGVtZS5jcmVhdGVNb2RhbFN0eWxlO1xuXHRcdGNyZWF0ZVBhZ2VkTGlzdFN0eWxlID0gdGhlbWUuY3JlYXRlUGFnZWRMaXN0U3R5bGU7XG5cdFx0Y3JlYXRlTm90aWZpY2F0aW9uU3R5bGUgPSB0aGVtZS5jcmVhdGVOb3RpZmljYXRpb25TdHlsZTtcblxuXHR9IGVsc2UgaWYgKHR5cGVvZiB0aGVtZSA9PT0gXCJzdHJpbmdcIikge1xuXG5cdFx0aWYgKHRoZW1lID09PSBcInRoZW1lMlwiKSB7XG5cdFx0XHRjcmVhdGVCdXR0b25TdHlsZSA9IGNyZWF0ZUJ1dHRvblN0eWxlVGhlbWUyO1xuXHRcdFx0Y3JlYXRlSW5wdXRTdHlsZSA9IGNyZWF0ZUlucHV0U3R5bGVUaGVtZTI7XG5cdFx0XHRjcmVhdGVNb2RhbFN0eWxlID0gY3JlYXRlTW9kYWxTdHlsZVRoZW1lMjtcblx0XHRcdGNyZWF0ZVBhZ2VkTGlzdFN0eWxlID0gY3JlYXRlUGFnZWRMaXN0U3R5bGVUaGVtZTI7XG5cdFx0XHRjcmVhdGVOb3RpZmljYXRpb25TdHlsZSA9IGNyZWF0ZU5vdGlmaWNhdGlvblN0eWxlVGhlbWUyO1xuXG5cdFx0fSBlbHNlIGlmICh0aGVtZSA9PT0gXCJ0aGVtZTNcIil7XG5cdFx0XHRjcmVhdGVCdXR0b25TdHlsZSA9IGNyZWF0ZUJ1dHRvblN0eWxlVGhlbWUzO1xuXHRcdFx0Y3JlYXRlSW5wdXRTdHlsZSA9IGNyZWF0ZUlucHV0U3R5bGVUaGVtZTM7XG5cdFx0XHRjcmVhdGVNb2RhbFN0eWxlID0gY3JlYXRlTW9kYWxTdHlsZVRoZW1lMztcblx0XHRcdGNyZWF0ZVBhZ2VkTGlzdFN0eWxlID0gY3JlYXRlUGFnZWRMaXN0U3R5bGVUaGVtZTM7XG5cdFx0XHRjcmVhdGVOb3RpZmljYXRpb25TdHlsZSA9IGNyZWF0ZU5vdGlmaWNhdGlvblN0eWxlVGhlbWUzO1xuXHRcdH0gZWxzZSBpZiAodGhlbWUgPT09IFwidGhlbWU0XCIpIHtcblx0XHRcdGNyZWF0ZUJ1dHRvblN0eWxlID0gY3JlYXRlQnV0dG9uU3R5bGVUaGVtZTQ7XG5cdFx0XHRjcmVhdGVJbnB1dFN0eWxlID0gY3JlYXRlSW5wdXRTdHlsZVRoZW1lNDtcblx0XHRcdGNyZWF0ZU1vZGFsU3R5bGUgPSBjcmVhdGVNb2RhbFN0eWxlVGhlbWU0O1xuXHRcdFx0Y3JlYXRlUGFnZWRMaXN0U3R5bGUgPSBjcmVhdGVQYWdlZExpc3RTdHlsZVRoZW1lNDtcblx0XHRcdGNyZWF0ZU5vdGlmaWNhdGlvblN0eWxlID0gY3JlYXRlTm90aWZpY2F0aW9uU3R5bGVUaGVtZTQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNyZWF0ZUJ1dHRvblN0eWxlID0gY3JlYXRlQnV0dG9uU3R5bGVEZWZhdWx0O1xuXHRcdFx0Y3JlYXRlSW5wdXRTdHlsZSA9IGNyZWF0ZUlucHV0U3R5bGVEZWZhdWx0O1xuXHRcdFx0Y3JlYXRlTW9kYWxTdHlsZSA9IGNyZWF0ZU1vZGFsU3R5bGVEZWZhdWx0O1xuXHRcdFx0Y3JlYXRlUGFnZWRMaXN0U3R5bGUgPSBjcmVhdGVQYWdlZExpc3RTdHlsZURlZmF1bHQ7XG5cdFx0XHRjcmVhdGVOb3RpZmljYXRpb25TdHlsZSA9IGNyZWF0ZU5vdGlmaWNhdGlvblN0eWxlRGVmYXVsdDtcblx0XHR9XG5cblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudGhlbWUgc2hvdWxkIGJlIGFuIG9iamVjdCBvciBhIHN0cmluZ1wiKTtcblx0fVxuXG5cdHZhciBidXR0b25TdHlsZSA9IGNyZWF0ZUJ1dHRvblN0eWxlKGNvbG9yU2V0KTtcblxuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItYnV0dG9uXCIsIHJlcXVpcmUoXCIuL2J1dHRvbi92bVwiKSwgcmVxdWlyZShcIi4vYnV0dG9uL3RlbXBsYXRlLmh0bWxcIiksIGJ1dHRvblN0eWxlKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWlucHV0XCIsIHJlcXVpcmUoXCIuL2lucHV0L3ZtXCIpLCByZXF1aXJlKFwiLi9pbnB1dC90ZW1wbGF0ZS5odG1sXCIpLCBjcmVhdGVJbnB1dFN0eWxlKGNvbG9yU2V0KSk7XG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1yYWRpb1wiLCByZXF1aXJlKFwiLi9yYWRpby92bVwiKSwgcmVxdWlyZShcIi4vcmFkaW8vdGVtcGxhdGUuaHRtbFwiKSk7XG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1pbmxpbmUtdGV4dC1lZGl0b3JcIiwgcmVxdWlyZShcIi4vaW5saW5lVGV4dEVkaXRvci92bVwiKSwgcmVxdWlyZShcIi4vaW5saW5lVGV4dEVkaXRvci90ZW1wbGF0ZS5odG1sXCIpKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWRyb3Bkb3duXCIsIHJlcXVpcmUoXCIuL2Ryb3Bkb3duL3ZtXCIpLCByZXF1aXJlKFwiLi9kcm9wZG93bi90ZW1wbGF0ZS5odG1sXCIpKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXG5cdFx0XCJrbm9iLXBhZ2luYXRpb25cIixcblx0XHRyZXF1aXJlKFwiLi9wYWdpbmF0aW9uL3ZtXCIpLFxuXHRcdHJlcXVpcmUoXCIuL3BhZ2luYXRpb24vdGVtcGxhdGUuaHRtbFwiKSxcblx0XHRidXR0b25TdHlsZSxcblx0XHRpY29ucy5wYWdpbmF0aW9uXG5cdCk7XG5cdHJlZ2lzdGVyQ29tcG9uZW50KFxuXHRcdFwia25vYi1pdGVtcy1wZXItcGFnZVwiLFxuXHRcdHJlcXVpcmUoXCIuL2l0ZW1zUGVyUGFnZS92bVwiKSxcblx0XHRyZXF1aXJlKFwiLi9pdGVtc1BlclBhZ2UvdGVtcGxhdGUuaHRtbFwiKSxcblx0XHRudWxsLFxuXHRcdHtcblx0XHRcdGRyb3Bkb3duOiBpY29ucy5kcm9wZG93blxuXHRcdH1cblx0KTtcblxuXHRyZWdpc3RlckNvbXBvbmVudChcblx0XHRcImtub2ItcGFnZWQtbGlzdFwiLFxuXHRcdHJlcXVpcmUoXCIuL3BhZ2VkTGlzdC92bVwiKSxcblx0XHRyZXF1aXJlKFwiLi9wYWdlZExpc3QvdGVtcGxhdGUuaHRtbFwiKSxcblx0XHRjcmVhdGVQYWdlZExpc3RTdHlsZShjb2xvclNldCksXG5cdFx0e1xuXHRcdFx0c2VhcmNoOiBpY29ucy5zZWFyY2gsXG5cdFx0XHRzb3J0OiBpY29ucy5zb3J0LFxuXHRcdFx0ZHJvcGRvd246IGljb25zLmRyb3Bkb3duXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRub1Jlc3VsdHM6IGxhYmVscy5ub1Jlc3VsdHNcblx0XHR9XG5cdCk7XG5cblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLW1vZGFsXCIsIHJlcXVpcmUoXCIuL21vZGFsL3ZtXCIpLCByZXF1aXJlKFwiLi9tb2RhbC90ZW1wbGF0ZS5odG1sXCIpLCBjcmVhdGVNb2RhbFN0eWxlKGNvbG9yU2V0KSk7XG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1jb25maXJtXCIsIHJlcXVpcmUoXCIuL21vZGFsL2NvbmZpcm0vdm1cIiksIHJlcXVpcmUoXCIuL21vZGFsL2NvbmZpcm0vdGVtcGxhdGUuaHRtbFwiKSwgY3JlYXRlTW9kYWxTdHlsZShjb2xvclNldCkpO1xuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItYWxlcnRcIiwgcmVxdWlyZShcIi4vbW9kYWwvYWxlcnQvdm1cIiksIHJlcXVpcmUoXCIuL21vZGFsL2FsZXJ0L3RlbXBsYXRlLmh0bWxcIiksIGNyZWF0ZU1vZGFsU3R5bGUoY29sb3JTZXQpKTtcblxuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItdGFic1wiLCByZXF1aXJlKFwiLi90YWJzL3ZtXCIpLCByZXF1aXJlKFwiLi90YWJzL3RlbXBsYXRlLmh0bWxcIikpO1xuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItdGFiXCIsIHJlcXVpcmUoXCIuL3RhYnMvdGFiL3ZtXCIpLCByZXF1aXJlKFwiLi90YWJzL3RhYi90ZW1wbGF0ZS5odG1sXCIpLCBidXR0b25TdHlsZSk7XG5cblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLW5vdGlmaWNhdGlvblwiLCByZXF1aXJlKFwiLi9ub3RpZmljYXRpb25CYXIvdm1cIiksIHJlcXVpcmUoXCIuL25vdGlmaWNhdGlvbkJhci90ZW1wbGF0ZS5odG1sXCIpLCBjcmVhdGVOb3RpZmljYXRpb25TdHlsZShjb2xvclNldCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdDogaW5pdEtub2IsXG5cblx0cmVnaXN0ZXJDb21wb25lbnQ6IHJlZ2lzdGVyQ29tcG9uZW50LFxuXHRiYXNlOiB7XG5cdFx0dm06IGJhc2VWbVxuXHR9XG59O1xuLy8iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwia25vYi1kcm9wZG93blwiPlxcblx0PCEtLSB3aXRoIHBhcmFtcywgdGhlIHNlbGVjdGVkKCkubGFiZWwgd29uXFwndCBiZSByZWNhbGN1bGF0ZWQsIHdoZW4gc2VsZWN0ZWQgaXMgY2hhbmdlZC4uLiAtLT5cXG5cdDxkaXYgZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0cGFyYW1zOiB7bGFiZWw6IHNlbGVjdGVkKCkubGFiZWwsXFxuXHRcdFx0XHRcdFx0aWNvbjogc2VsZWN0ZWQoKS5pY29uLFxcblx0XHRcdFx0XHRcdHJpZ2h0SWNvbjogcmlnaHRJY29uLFxcblx0XHRcdFx0XHRcdGNsaWNrOiBkcm9wZG93blZpc2libGUudG9nZ2xlfX1cIj5cXG5cdDwvZGl2Plxcblx0PGRpdiBjbGFzcz1cImtub2ItZHJvcGRvd24tbWVudVwiIGRhdGEtYmluZD1cImZvcmVhY2g6IG9wdGlvbnMsIHZpc2libGU6IGRyb3Bkb3duVmlzaWJsZVwiPlxcblx0XHQ8ZGl2IGRhdGEtYmluZD1cImNvbXBvbmVudDoge1xcblx0XHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0XHRwYXJhbXM6IHtsYWJlbDogbGFiZWwsIGljb246IGljb24sIGNsaWNrOiBzZWxlY3R9fSwgXFxuXHRcdFx0XHRcdFx0XHR2aXNpYmxlOiAkZGF0YSAhPT0gJHBhcmVudC5zZWxlY3RlZCgpXCI+XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cblxuZnVuY3Rpb24gY3JlYXRlQnV0dG9uRHJvcGRvd24oY29uZmlnKSB7XG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHRpZiAoIWNvbmZpZy5yaWdodEljb24pIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcucmlnaHRJY29uIGVsZW1lbnQgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXHRpZiAoIWNvbmZpZy5pdGVtcykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5pdGVtcyBlbGVtZW50IGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblx0aWYgKGNvbmZpZy5zZWxlY3RlZCAmJiAha28uaXNPYnNlcnZhYmxlKGNvbmZpZy5zZWxlY3RlZCkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc2VsZWN0ZWQgaGFzIHRvIGJlIGEga25vY2tvdXQgb2JzZXJ2YWJsZSFcIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLml0ZW1zLmxlbmd0aCA9PT0gMCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5pdGVtcyBzaG91bGQgbm90IGJlIGVtcHR5XCIpO1xuXHR9XG5cblx0dmFyIHJpZ2h0SWNvbiA9IGtvLm9ic2VydmFibGUoY29uZmlnLnJpZ2h0SWNvbik7XG5cblx0dmFyIG9wdGlvbnMgPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xuXG5cdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGNvbmZpZy5pdGVtcy5sZW5ndGg7IGlkeCArPSAxKSB7XG5cblx0XHRpZiAoIWNvbmZpZy5pdGVtc1tpZHhdLmxhYmVsICYmICFjb25maWcuaXRlbXNbaWR4XS5pY29uKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJlYWNoIGVsZW1lbnQgb2YgY29uZmlnLml0ZW1zIGhhcyB0byBoYXZlIGxhYmVsIGFuZC9vciBpY29uIHByb3BlcnR5XCIpO1xuXHRcdH1cblx0XHRvcHRpb25zLnB1c2goY3JlYXRlT3B0aW9uKHtcblx0XHRcdGxhYmVsOiBjb25maWcuaXRlbXNbaWR4XS5sYWJlbCxcblx0XHRcdGljb246IGNvbmZpZy5pdGVtc1tpZHhdLmljb24sXG5cdFx0XHR2YWx1ZTogY29uZmlnLml0ZW1zW2lkeF0udmFsdWVcblx0XHR9KSk7XG5cdH1cblxuXHQvLyBjb25zb2xlLmxvZyhvcHRpb25zKCkpO1xuXG5cdHZhciBzZWxlY3RlZCA9IGNvbmZpZy5zZWxlY3RlZCB8fCBrby5vYnNlcnZhYmxlKCk7XG5cblx0c2VsZWN0ZWQob3B0aW9ucygpW2NvbmZpZy5zZWxlY3RlZElkeCB8fCAwXSk7XG5cblx0dmFyIGRyb3Bkb3duVmlzaWJsZSA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuXG5cdGRyb3Bkb3duVmlzaWJsZS50b2dnbGUgPSBmdW5jdGlvbiB0b2dnbGVEcm9wZG93blZpc2libGUoaXRlbSwgZXZlbnQpIHtcblx0XHRpZiAoZXZlbnQpIHtcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdH1cblxuXHRcdHZhciB2aXNpYmxlID0gZHJvcGRvd25WaXNpYmxlKCk7XG5cblx0XHRkcm9wZG93blZpc2libGUoIXZpc2libGUpO1xuXG5cdFx0Ly8gc2hvdWxkIHJlbW92ZSB0aGlzIHdoZW4gdGVzdCBpbiBwaGFudG9tanNcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICh2aXNpYmxlKSB7XG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRvZ2dsZURyb3Bkb3duVmlzaWJsZSwgZmFsc2UpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRvZ2dsZURyb3Bkb3duVmlzaWJsZSwgZmFsc2UpO1xuXHRcdH1cblx0fTtcblxuXHRmdW5jdGlvbiBjcmVhdGVPcHRpb24oY29uZmlnKSB7XG5cdFx0dmFyIG9iaiA9IHtcblx0XHRcdGxhYmVsOiBrby5vYnNlcnZhYmxlKGNvbmZpZy5sYWJlbCksXG5cdFx0XHRpY29uOiBrby5vYnNlcnZhYmxlKGNvbmZpZy5pY29uKSxcblx0XHRcdHZhbHVlOiBjb25maWcudmFsdWUsXG5cdFx0XHRzZWxlY3Q6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzZWxlY3RlZChvYmopO1xuXHRcdFx0XHRkcm9wZG93blZpc2libGUudG9nZ2xlKCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiBvYmo7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHJpZ2h0SWNvbjogcmlnaHRJY29uLFxuXG5cdFx0c2VsZWN0ZWQ6IHNlbGVjdGVkLFxuXHRcdG9wdGlvbnM6IG9wdGlvbnMsXG5cblx0XHRkcm9wZG93blZpc2libGU6IGRyb3Bkb3duVmlzaWJsZVxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJ1dHRvbkRyb3Bkb3duO1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPHNwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAhZWRpdE1vZGUoKVwiIGNsYXNzPVwia25vYi1pbmxpbmV0ZXh0LS1ub2VkaXRcIj5cXG5cdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogdmFsdWVcIj48L3NwYW4+XFxuXHRcdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJsYWJlbDogXFwnXFwnLCBjbGljazogZWRpdCwgaWNvbjogXFwnI2ljb24tZWRpdFxcJ1wiPlxcblx0PC9zcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwidmlzaWJsZTogZWRpdE1vZGVcIiBjbGFzcz1cImtub2ItaW5saW5ldGV4dC0tZWRpdFwiPlxcblx0XHQ8a25vYi1pbnB1dCBwYXJhbXM9XCJ2YWx1ZTogZWRpdGVkVmFsdWUsIGhhc0ZvY3VzOiBpbnB1dEhhc0ZvY3VzLCBrZXlEb3duOiBrZXlEb3duLCB2aXNpYmxlOiBlZGl0TW9kZVwiPjwva25vYi1pbnB1dD5cXG5cdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cImxhYmVsOiBcXCdcXCcsIGNsaWNrOiBzYXZlLCBpY29uOiBcXCcjaWNvbi1kb25lXFwnXCI+PC9rbm9iLWJ1dHRvbj5cXG5cdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cImxhYmVsOiBcXCdcXCcsIGNsaWNrOiBjYW5jZWwsIGljb246IFxcJyNpY29uLWNsb3NlXFwnXCI+PC9rbm9iLWJ1dHRvbj5cXG5cdDwvc3Bhbj5cXG48L3NwYW4+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUlubGluZVRleHRFZGl0b3IoY29uZmlnKSB7XG5cdHZhciB2bSA9IHt9O1xuXG5cdHZhciBjb25maWcgPSBjb25maWcgfHwge307XG5cblx0aWYgKGNvbmZpZy52YWx1ZSAmJiAha28uaXNPYnNlcnZhYmxlKGNvbmZpZy52YWx1ZSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudmFsdWUgaGFzIHRvIGJlIGFuIG9ic2VydmFibGUhXCIpO1xuXHR9XG5cblx0dm0udmFsdWUgPSBjb25maWcudmFsdWUgfHwga28ub2JzZXJ2YWJsZShcIlwiKTtcblx0dm0uZWRpdGVkVmFsdWUgPSBrby5vYnNlcnZhYmxlKHZtLnZhbHVlKCkpO1xuXG5cdHZtLmVkaXRNb2RlID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG5cblx0dm0uZWRpdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZtLmVkaXRlZFZhbHVlKHZtLnZhbHVlKCkpO1xuXHRcdHZtLmVkaXRNb2RlKHRydWUpO1xuXHRcdHZtLmlucHV0SGFzRm9jdXModHJ1ZSk7XG5cdH07XG5cblx0dm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZtLnZhbHVlKHZtLmVkaXRlZFZhbHVlKCkpO1xuXHRcdHZtLmVkaXRNb2RlKGZhbHNlKTtcblx0fTtcblxuXHR2bS5jYW5jZWwgPSBmdW5jdGlvbigpIHtcblx0XHR2bS5lZGl0TW9kZShmYWxzZSk7XG5cdH07XG5cblx0dm0ua2V5RG93biA9IGZ1bmN0aW9uKGl0ZW0sIGV2ZW50KSB7XG5cdFx0aWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG5cdFx0XHRyZXR1cm4gdm0uc2F2ZSgpO1xuXHRcdH1cblxuXHRcdGlmIChldmVudC5rZXlDb2RlID09PSAyNykge1xuXHRcdFx0cmV0dXJuIHZtLmNhbmNlbCgpO1xuXHRcdH1cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fTtcblxuXHR2bS5pbnB1dEhhc0ZvY3VzID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG5cblx0cmV0dXJuIHZtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUlubGluZVRleHRFZGl0b3I7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlQ29uZmlnKHRoZW1lKSB7XG5cdHJldHVybiB7XG5cdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImJvcmRlci1jb2xvclwiOiB0aGVtZS5kYXJrR3JheVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJib3JkZXItY29sb3JcIjogdGhlbWUuZGFya0dyYXlcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuYmxhY2tcblx0XHRcdH0sXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmxpZ2h0R3JheSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmxpZ2h0R3JheVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8aW5wdXQgZGF0YS1iaW5kPVwiY3NzOiBjc3NDbGFzcyxcXG5cdFx0XHRcdFx0c3R5bGU6IHN0eWxlLFxcblx0XHRcdFx0XHRhdHRyOiB7dHlwZTogdHlwZSwgcGxhY2Vob2xkZXI6IHBsYWNlaG9sZGVyfSxcXG5cdFx0XHRcdFx0ZXZlbnQ6IGV2ZW50SGFuZGxlcnMsXFxuXHRcdFx0XHRcdGhhc0ZvY3VzOiBoYXNGb2N1cyxcXG5cdFx0XHRcdFx0ZGlzYWJsZTogc3RhdGUoKSA9PT0gXFwnZGlzYWJsZWRcXCcsXFxuXHRcdFx0XHRcdHZhbHVlOiB2YWx1ZSxcXG5cdFx0XHRcdFx0dmFsdWVVcGRhdGU6IFxcJ2FmdGVya2V5ZG93blxcJ1wiIC8+JzsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlQ29uZmlnKHRoZW1lKSB7XG5cdHJldHVybiB7XG5cdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImJvcmRlci1jb2xvclwiOiB0aGVtZS5kYXJrR3JheVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJib3JkZXItY29sb3JcIjogdGhlbWUuZGFya0dyYXlcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLnByaW1hcnlDb2xvcixcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLnByaW1hcnlDb2xvclxuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubGlnaHRHcmF5XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcblxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVTdHlsZUNvbmZpZyh0aGVtZSkge1xuXHRyZXR1cm4ge1xuXHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJib3JkZXItY29sb3JcIjogdGhlbWUuZGFya0dyYXlcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiYm9yZGVyLWNvbG9yXCI6IHRoZW1lLmRhcmtHcmF5XG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5wcmltYXJ5Q29sb3IsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5wcmltYXJ5Q29sb3Jcblx0XHRcdH0sXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmxpZ2h0R3JheSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmxpZ2h0R3JheVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbnZhciBiYXNlID0gcmVxdWlyZShcIi4uL2Jhc2Uvdm1cIik7XG5cbmZ1bmN0aW9uIGNyZWF0ZUlucHV0KGNvbmZpZykge1xuXG5cdGlmICghY29uZmlnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLnZhbHVlICYmICFrby5pc09ic2VydmFibGUoY29uZmlnLnZhbHVlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy52YWx1ZSBtdXN0IGJlIGFuIG9ic2VydmFibGVcIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLmhhc0ZvY3VzICYmICFrby5pc09ic2VydmFibGUoY29uZmlnLmhhc0ZvY3VzKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5oYXNGb2N1cyBtdXN0IGJlIGFuIG9ic2VydmFibGVcIik7XG5cdH1cblxuXHRjb25maWcuY29tcG9uZW50ID0gXCJpbnB1dFwiO1xuXHRjb25maWcudHlwZSA9IGNvbmZpZy50eXBlIHx8IFwidGV4dFwiO1xuXHRjb25maWcucGxhY2Vob2xkZXIgPSBjb25maWcucGxhY2Vob2xkZXIgfHwgXCJcIjtcblxuXHR2YXIgdm0gPSBiYXNlKGNvbmZpZyk7XG5cblx0dm0uYmVoYXZpb3Vycy5ob3Zlci5lbmFibGUoKTtcblx0dm0uYmVoYXZpb3Vycy5mb2N1cy5lbmFibGUoKTtcblxuXHR2bS5wbGFjZWhvbGRlciA9IGNvbmZpZy5wbGFjZWhvbGRlcjtcblx0dm0udHlwZSA9IGNvbmZpZy50eXBlO1xuXHR2bS52YWx1ZSA9IGNvbmZpZy52YWx1ZSB8fCBrby5vYnNlcnZhYmxlKCk7XG5cdHZtLmhhc0ZvY3VzID0gY29uZmlnLmhhc0ZvY3VzIHx8IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuXG5cdGlmIChjb25maWcua2V5RG93bikge1xuXHRcdHZtLmV2ZW50SGFuZGxlcnMua2V5ZG93biA9IGNvbmZpZy5rZXlEb3duO1xuXHR9XG5cblx0cmV0dXJuIHZtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUlucHV0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGtub2ItZHJvcGRvd24gcGFyYW1zPVwiXFxuXHRyaWdodEljb246IGljb25zLmRyb3Bkb3duLFxcblx0c2VsZWN0ZWQ6IGl0ZW1zUGVyUGFnZSxcXG5cdGl0ZW1zOiBpdGVtc1BlclBhZ2VMaXN0XCI+XFxuPC9rbm9iLWRyb3Bkb3duPic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUl0ZW1zUGVyUGFnZShjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdGlmICghY29uZmlnLm51bU9mSXRlbXMpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcubnVtT2ZJdGVtcyBlbGVtZW50IGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLml0ZW1zUGVyUGFnZUxpc3QpIHtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNvbmZpZy5pdGVtc1BlclBhZ2VMaXN0Lmxlbmd0aDsgaSArPSAxKSB7XG5cblx0XHRcdGlmICghY29uZmlnLml0ZW1zUGVyUGFnZUxpc3RbaV0udmFsdWUgJiYgIWNvbmZpZy5pdGVtc1BlclBhZ2VMaXN0W2ldLmxhYmVsKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcImVhY2ggZWxlbWVudCBvZiBjb25maWcuaXRlbXMgaGFzIHRvIGhhdmUgbGFiZWwgYW5kL29yIHZhbHVlIHByb3BlcnR5XCIpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHR9XG5cblx0dmFyIG51bU9mSXRlbXMgPSBjb25maWcubnVtT2ZJdGVtcztcblxuXHR2YXIgaXRlbXNQZXJQYWdlTGlzdCA9IGNvbmZpZy5pdGVtc1BlclBhZ2VMaXN0IHx8IFt7XG5cdFx0bGFiZWw6IDEwLFxuXHRcdHZhbHVlOiAxMFxuXHR9LCB7XG5cdFx0bGFiZWw6IDI1LFxuXHRcdHZhbHVlOiAyNVxuXHR9LCB7XG5cdFx0bGFiZWw6IDUwLFxuXHRcdHZhbHVlOiA1MFxuXHR9LCB7XG5cdFx0bGFiZWw6IDEwMCxcblx0XHR2YWx1ZTogMTAwXG5cdH1dO1xuXG5cdHZhciBpdGVtc1BlclBhZ2UgPSBrby5vYnNlcnZhYmxlKGl0ZW1zUGVyUGFnZUxpc3RbMF0pO1xuXG5cdHZhciBudW1PZlBhZ2VzID0gY29uZmlnLm51bU9mUGFnZXMgfHwga28ub2JzZXJ2YWJsZSgpO1xuXG5cdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBudW1PZkl0ZW1zVmFsID0gbnVtT2ZJdGVtcygpO1xuXHRcdHZhciBpdGVtc1BlclBhZ2VWYWwgPSBpdGVtc1BlclBhZ2UoKTtcblxuXHRcdGlmICghaXRlbXNQZXJQYWdlVmFsKSB7XG5cdFx0XHRyZXR1cm4gbnVtT2ZQYWdlcygwKTtcblx0XHR9XG5cblx0XHRpZiAoY29uZmlnLml0ZW1zUGVyUGFnZSkge1xuXHRcdFx0Y29uZmlnLml0ZW1zUGVyUGFnZShpdGVtc1BlclBhZ2VWYWwudmFsdWUpO1xuXHRcdH1cblxuXHRcdHJldHVybiBudW1PZlBhZ2VzKE1hdGguY2VpbChudW1PZkl0ZW1zVmFsIC8gaXRlbXNQZXJQYWdlVmFsLnZhbHVlKSk7XG5cdH0pO1xuXG5cdHJldHVybiB7XG5cdFx0bnVtT2ZJdGVtczogbnVtT2ZJdGVtcyxcblx0XHRpdGVtc1BlclBhZ2U6IGl0ZW1zUGVyUGFnZSxcblx0XHRudW1PZlBhZ2VzOiBudW1PZlBhZ2VzLFxuXG5cdFx0aXRlbXNQZXJQYWdlTGlzdDogaXRlbXNQZXJQYWdlTGlzdCxcblxuXHRcdGljb25zOiBjb25maWcuaWNvbnNcblx0fTtcbn07XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbmZ1bmN0aW9uIGtub2JSZWdpc3RlckNvbXBvbmVudChuYW1lLCBjcmVhdGVWbSwgdGVtcGxhdGUsIHN0eWxlLCBpY29ucywgbGFiZWxzKSB7XG5cdGtvLmNvbXBvbmVudHMucmVnaXN0ZXIobmFtZSwge1xuXHRcdHZpZXdNb2RlbDoge1xuXHRcdFx0Y3JlYXRlVmlld01vZGVsOiBmdW5jdGlvbihwYXJhbXMsIGNvbXBvbmVudEluZm8pIHtcblx0XHRcdFx0cGFyYW1zLnN0eWxlID0gc3R5bGU7XG5cdFx0XHRcdHBhcmFtcy5pY29ucyA9IGljb25zO1xuXHRcdFx0XHRwYXJhbXMubGFiZWxzID0gbGFiZWxzO1xuXHRcdFx0XHRyZXR1cm4gY3JlYXRlVm0ocGFyYW1zLCBjb21wb25lbnRJbmZvKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrbm9iUmVnaXN0ZXJDb21wb25lbnQ7XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlTGlzdChjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdGlmICghY29uZmlnLmhhc093blByb3BlcnR5KFwic3RvcmVcIikpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc3RvcmUgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmICghY29uZmlnLmhhc093blByb3BlcnR5KFwiZmllbGRzXCIpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmZpZWxkcyBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKCFjb25maWcuaGFzT3duUHJvcGVydHkoXCJzb3J0XCIpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNvcnQgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmICghY29uZmlnLmhhc093blByb3BlcnR5KFwic2VhcmNoXCIpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNlYXJjaCBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBjb25maWcuc3RvcmUgIT09IFwib2JqZWN0XCIpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc2VhcmNoIG11c3QgYmUgYW4gb2JqZWN0IVwiKTtcblx0fVxuXG5cdGlmICghKGNvbmZpZy5maWVsZHMgaW5zdGFuY2VvZiBBcnJheSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuZmllbGRzIG11c3QgYmUgYW4gYXJyYXkhXCIpO1xuXHR9XG5cblx0aWYgKCEoY29uZmlnLnNvcnQgaW5zdGFuY2VvZiBBcnJheSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc29ydCBtdXN0IGJlIGFuIGFycmF5IVwiKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgY29uZmlnLnNlYXJjaCAhPT0gXCJzdHJpbmdcIikge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zZWFyY2ggbXVzdCBiZSBhIHN0cmluZyFcIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLmZpZWxkcy5pbmRleE9mKGNvbmZpZy5zZWFyY2gpID09PSAtMSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5maWVsZHMgbXVzdCBjb250YWluIHRoZSB2YWx1ZSBvZiBjb25maWcuc2VhcmNoIVwiKTtcblx0fVxuXG5cdHZhciBvcmRlckZpZWxkO1xuXG5cdGlmIChjb25maWcub3JkZXJCeSkge1xuXHRcdGlmICh0eXBlb2YgY29uZmlnLm9yZGVyQnkgIT09IFwib2JqZWN0XCIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5vcmRlckJ5IG11c3QgaGF2ZSB0aGUgZm9ybWF0IG9mIHsgPGtleT46IFsxOy0xXSB9IFwiKTtcblx0XHR9XG5cblx0XHRvcmRlckZpZWxkID0gT2JqZWN0LmtleXMoY29uZmlnLm9yZGVyQnkpWzBdO1xuXHRcdGlmIChjb25maWcuZmllbGRzLmluZGV4T2Yob3JkZXJGaWVsZCkgPT09IC0xIHx8IE1hdGguYWJzKGNvbmZpZy5vcmRlckJ5W29yZGVyRmllbGRdKSAhPT0gMSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLm9yZGVyQnkgbXVzdCBoYXZlIHRoZSBmb3JtYXQgb2YgeyA8a2V5PjogWzE7LTFdIH0gXCIpO1xuXHRcdH1cblxuXHRcdHZhciBzb3J0Q29udGFpbnNPcmRlckZpZWxkID0gZmFsc2U7XG5cblx0XHRjb25maWcuc29ydC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdGlmIChpdGVtLnZhbHVlID09PSBvcmRlckZpZWxkKSB7XG5cdFx0XHRcdHNvcnRDb250YWluc09yZGVyRmllbGQgPSB0cnVlO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAoIXNvcnRDb250YWluc09yZGVyRmllbGQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zb3J0IG11c3QgY29udGFpbiB0aGUgdmFsdWUgb2YgY29uZmlnLm9yZGVyQnkhXCIpO1xuXHRcdH1cblx0fVxuXG5cdGNvbmZpZy5zb3J0LmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuXHRcdGlmIChjb25maWcuZmllbGRzLmluZGV4T2YoaXRlbS52YWx1ZSkgPT09IC0xKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ2YWx1ZXMgb2YgY29uZmlnLnNvcnQgbXVzdCBiZSBpbiBjb25maWcuZmllbGRzIVwiKTtcblx0XHR9XG5cdH0pO1xuXG5cdHZhciBzdG9yZSA9IGNvbmZpZy5zdG9yZTtcblx0dmFyIGZpZWxkcyA9IGNvbmZpZy5maWVsZHM7XG5cblx0dmFyIHNlYXJjaCA9IGtvLm9ic2VydmFibGUoXCJcIikuZXh0ZW5kKHtcblx0XHR0aHJvdHRsZTogY29uZmlnLnRocm90dGxlIHx8IDUwMFxuXHR9KTtcblxuXHR2YXIgc29ydE9wdGlvbnMgPSBbXTtcblxuXHR2YXIgZGVmYXVsdE9yZGVySWR4O1xuXG5cdGZ1bmN0aW9uIGNyZWF0ZVF1ZXJ5T2JqKHByb3AsIGFzYykge1xuXHRcdHZhciBvYmogPSB7fTtcblxuXHRcdG9ialtwcm9wXSA9IGFzYztcblxuXHRcdGlmIChvcmRlckZpZWxkICYmIHByb3AgPT09IG9yZGVyRmllbGQgJiYgYXNjID09PSBjb25maWcub3JkZXJCeVtvcmRlckZpZWxkXSkge1xuXHRcdFx0ZGVmYXVsdE9yZGVySWR4ID0gc29ydE9wdGlvbnMubGVuZ3RoO1xuXHRcdH1cblxuXHRcdHJldHVybiBvYmo7XG5cdH1cblxuXHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCBjb25maWcuc29ydC5sZW5ndGg7IGlkeCArPSAxKSB7XG5cdFx0dmFyIGFjdCA9IGNvbmZpZy5zb3J0W2lkeF07XG5cblx0XHR2YXIgYXNjSWNvbiA9IGNvbmZpZy5pY29ucyA/IGNvbmZpZy5pY29ucy5zb3J0LmFzYyA6IFwiXCI7XG5cdFx0dmFyIGRlc2NJY29uID0gY29uZmlnLmljb25zID8gY29uZmlnLmljb25zLnNvcnQuZGVzYyA6IFwiXCI7XG5cblx0XHRzb3J0T3B0aW9ucy5wdXNoKHtcblx0XHRcdGljb246IGFzY0ljb24sXG5cdFx0XHRsYWJlbDogYWN0LmxhYmVsLFxuXHRcdFx0dmFsdWU6IGNyZWF0ZVF1ZXJ5T2JqKGFjdC52YWx1ZSwgMSlcblx0XHR9KTtcblx0XHRzb3J0T3B0aW9ucy5wdXNoKHtcblx0XHRcdGljb246IGRlc2NJY29uLFxuXHRcdFx0bGFiZWw6IGFjdC5sYWJlbCxcblx0XHRcdHZhbHVlOiBjcmVhdGVRdWVyeU9iaihhY3QudmFsdWUsIC0xKVxuXHRcdH0pO1xuXHR9XG5cblx0dmFyIHNvcnQgPSBrby5vYnNlcnZhYmxlKHNvcnRPcHRpb25zW2RlZmF1bHRPcmRlcklkeCB8fCAwXSk7XG5cdHZhciBzb3J0SWR4ID0gZGVmYXVsdE9yZGVySWR4IHx8IDA7XG5cblx0dmFyIHNraXAgPSBrby5vYnNlcnZhYmxlKDApO1xuXHR2YXIgbGltaXQgPSBrby5vYnNlcnZhYmxlKDApO1xuXG5cdHZhciBpdGVtcyA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XG5cblx0c3RvcmUuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7IC8vc3RvcmUgPT09IHRoaXNcblx0XHRpdGVtcy5wdXNoKGl0ZW0pO1xuXHR9KTtcblxuXHR2YXIgY291bnQgPSBrby5vYnNlcnZhYmxlKDApOyAvL3Nob3VsZCBiZSByZWFkLW9ubHlcblxuXHR2YXIgbG9hZGluZyA9IGtvLm9ic2VydmFibGUoZmFsc2UpOyAvL3Nob3VsZCBiZSByZWFkLW9ubHlcblx0dmFyIGVycm9yID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7IC8vc2hvdWxkIGJlIHJlYWQtb25seT9cblxuXHRrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgc2VhcmNoVmFsID0gc2VhcmNoKCk7XG5cdFx0dmFyIHNvcnRWYWwgPSBzb3J0KCkudmFsdWU7XG5cdFx0dmFyIHNraXBWYWwgPSBza2lwKCk7XG5cdFx0dmFyIGxpbWl0VmFsID0gbGltaXQoKTtcblxuXHRcdHZhciBmaW5kID0ge307XG5cblx0XHRmaW5kW2NvbmZpZy5zZWFyY2hdID0gKG5ldyBSZWdFeHAoc2VhcmNoVmFsLCBcImlnXCIpKS50b1N0cmluZygpO1xuXG5cdFx0c3RvcmUuZmluZCA9IGZpbmQ7XG5cdFx0c3RvcmUuc29ydCA9IHNvcnRWYWw7XG5cdFx0c3RvcmUuc2tpcCA9IHNraXBWYWw7XG5cdFx0c3RvcmUubGltaXQgPSBsaW1pdFZhbDtcblx0fSkuZXh0ZW5kKHtcblx0XHR0aHJvdHRsZTogMFxuXHR9KTtcblxuXHRmdW5jdGlvbiBiZWZvcmVMb2FkKCkge1xuXHRcdGlmIChsb2FkaW5nKCkpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiTGlzdCBpcyBhbHJlYWR5IGxvYWRpbmcuLi5cIik7IC8vdGhpcyBtaWdodCBiZSBwcm9ibGVtYXRpYyBpZiB0aGVyZSBhcmUgbm8gZ29vZCB0aW1lb3V0IHNldHRpbmdzLlxuXHRcdH1cblxuXHRcdGxvYWRpbmcodHJ1ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBhZnRlckxvYWQoZXJyKSB7XG5cdFx0bG9hZGluZyhmYWxzZSk7XG5cdFx0aWYgKGVycikge1xuXHRcdFx0cmV0dXJuIGVycm9yKGVycik7XG5cdFx0fVxuXHRcdGVycm9yKG51bGwpO1xuXG5cdFx0c3RvcmUuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7IC8vc3RvcmUgPT09IHRoaXNcblx0XHRcdGl0ZW1zLnB1c2goaXRlbSk7XG5cdFx0fSk7XG5cblx0XHRjb3VudChzdG9yZS5jb3VudCk7XG5cdH1cblxuXHRmdW5jdGlvbiByZWFkT25seUNvbXB1dGVkKG9ic2VydmFibGUpIHtcblx0XHRyZXR1cm4ga28uY29tcHV0ZWQoe1xuXHRcdFx0cmVhZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBvYnNlcnZhYmxlKCk7XG5cdFx0XHR9LFxuXHRcdFx0d3JpdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aHJvdyBcIlRoaXMgY29tcHV0ZWQgdmFyaWFibGUgc2hvdWxkIG5vdCBiZSB3cml0dGVuLlwiO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0c3RvcmUubG9hZC5iZWZvcmUuYWRkKGJlZm9yZUxvYWQpO1xuXHRzdG9yZS5sb2FkLmFmdGVyLmFkZChhZnRlckxvYWQpO1xuXG5cdHJldHVybiB7XG5cdFx0c3RvcmU6IHN0b3JlLFxuXG5cdFx0ZmllbGRzOiBmaWVsZHMsIC8vc2hvdWxkIGZpbHRlciB0byB0aGUgZmllbGRzLiAoc2VsZWN0KVxuXG5cdFx0c2VhcmNoOiBzZWFyY2gsXG5cblx0XHRzb3J0OiBzb3J0LFxuXHRcdHNvcnRJZHg6IHNvcnRJZHgsXG5cdFx0c29ydE9wdGlvbnM6IHNvcnRPcHRpb25zLFxuXG5cdFx0c2tpcDogc2tpcCxcblx0XHRsaW1pdDogbGltaXQsXG5cblx0XHRpdGVtczogaXRlbXMsXG5cdFx0Y291bnQ6IHJlYWRPbmx5Q29tcHV0ZWQoY291bnQpLFxuXG5cdFx0bG9hZGluZzogcmVhZE9ubHlDb21wdXRlZChsb2FkaW5nKSxcblx0XHRlcnJvcjogcmVhZE9ubHlDb21wdXRlZChlcnJvcilcblx0fTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2Plxcblx0PGtub2ItbW9kYWwgcGFyYW1zPVwiXFxuXHRcdHRpdGxlOiB0aXRsZSxcXG5cdFx0aWNvbjogaWNvbixcXG5cdFx0dmlzaWJsZTogdmlzaWJsZVwiPlxcblxcblx0XHQ8ZGl2IGNsYXNzPVwia25vYi1jb25maXJtX19jb250ZW50XCIgZGF0YS1iaW5kPVwidGV4dDogbWVzc2FnZVwiPjwvZGl2Plxcblx0XHQ8ZGl2IGNsYXNzPVwia25vYi1jb25maXJtX19idXR0b25zXCI+XFxuXHRcdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cIlxcblx0XHRcdFx0bGFiZWw6IG9rTGFiZWwsXFxuXHRcdFx0XHR2YXJpYXRpb246IFxcJ3ByaW1hcnlcXCcsXFxuXHRcdFx0XHRjbGljazogb2tcXG5cdFx0XHRcIj48L2tub2ItYnV0dG9uPlxcblx0XHQ8L2Rpdj5cXG5cdDwva25vYi1tb2RhbD5cXG48L2Rpdj5cXG4nOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVBbGVydChjb25maWcpIHtcblxuXHRpZiAoIWNvbmZpZykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZyBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBjb25maWcubWVzc2FnZSAhPT0gXCJzdHJpbmdcIikge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5tZXNzYWdlIG11c3QgYmUgYSBzdHJpbmdcIik7XG5cdH1cblxuXHRpZiAodHlwZW9mIGNvbmZpZy5va0xhYmVsICE9PSBcInN0cmluZ1wiKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLm9rTGFiZWwgbXVzdCBiZSBhIHN0cmluZ1wiKTtcblx0fVxuXG5cdGlmICgha28uaXNPYnNlcnZhYmxlKGNvbmZpZy52aXNpYmxlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy52aXNpYmxlIG11c3QgYmUgYW4gb2JzZXJ2YWJsZVwiKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgY29uZmlnLmNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuXHR9XG5cblx0dmFyIHZpc2libGUgPSBjb25maWcudmlzaWJsZTtcblx0dmFyIG9rTGFiZWwgPSBjb25maWcub2tMYWJlbDtcblx0dmFyIGNhbGxiYWNrID0gY29uZmlnLmNhbGxiYWNrO1xuXG5cdHZhciB0aXRsZSA9IGNvbmZpZy50aXRsZSB8fCBcIlwiO1xuXHR2YXIgaWNvbiA9IGNvbmZpZy5pY29uIHx8IFwiXCI7XG5cdHZhciBtZXNzYWdlID0gY29uZmlnLm1lc3NhZ2U7XG5cblx0dmFyIG9rTGFiZWwgPSBjb25maWcub2tMYWJlbDtcblxuXHRmdW5jdGlvbiBvaygpIHtcblx0XHRjYWxsYmFjaygpO1xuXHRcdHZpc2libGUoIXZpc2libGUoKSk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHZpc2libGU6IHZpc2libGUsXG5cblx0XHR0aXRsZTogdGl0bGUsXG5cdFx0aWNvbjogaWNvbixcblx0XHRtZXNzYWdlOiBtZXNzYWdlLFxuXG5cdFx0b2tMYWJlbDogb2tMYWJlbCxcblxuXHRcdG9rOiBva1xuXHR9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJrbm9iLWNvbmZpcm1cIj5cXG5cdDxrbm9iLW1vZGFsIHBhcmFtcz1cIlxcblx0XHR0aXRsZTogdGl0bGUsXFxuXHRcdGljb246IGljb24sXFxuXHRcdHZpc2libGU6IHZpc2libGVcIj5cXG5cdFx0PGRpdiBjbGFzcz1cImtub2ItY29uZmlybV9fY29udGVudFwiIGRhdGEtYmluZD1cInRleHQ6IG1lc3NhZ2VcIj48L2Rpdj5cXG5cdFx0PGRpdiBjbGFzcz1cImtub2ItY29uZmlybV9fYnV0dG9uc1wiPlxcblx0XHRcdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0XHRcdGxhYmVsOiBva0xhYmVsLFxcblx0XHRcdFx0dmFyaWF0aW9uOiBcXCdwcmltYXJ5XFwnLFxcblx0XHRcdFx0Y2xpY2s6IG9rXFxuXHRcdFx0XCI+PC9rbm9iLWJ1dHRvbj5cXG5cdFx0XHQ8a25vYi1idXR0b24gcGFyYW1zPVwiXFxuXHRcdFx0XHRsYWJlbDogY2FuY2VsTGFiZWwsXFxuXHRcdFx0XHRjbGljazogY2FuY2VsXFxuXHRcdFx0XCI+PC9rbm9iLWJ1dHRvbj5cXG5cdFx0PC9kaXY+XFxuXHQ8L2tub2ItbW9kYWw+XFxuPC9kaXY+XFxuJzsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gY3JlYXRlQ29uZmlybU1vZGFsKGNvbmZpZykge1xuXHRpZiAoIWNvbmZpZykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZyBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKCFjb25maWcubWVzc2FnZSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5tZXNzYWdlIGVsZW1lbnQgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmICghY29uZmlnLm9rTGFiZWwpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcub2tMYWJlbCBlbGVtZW50IGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoIWNvbmZpZy5jYW5jZWxMYWJlbCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5jYW5jZWxMYWJlbCBlbGVtZW50IGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cblx0dmFyIHZpc2libGUgPSBjb25maWcudmlzaWJsZTtcblx0dmFyIGNhbGxiYWNrID0gY29uZmlnLmNhbGxiYWNrO1xuXG5cdHZhciB0aXRsZSA9IGNvbmZpZy50aXRsZSB8fCBcIlwiO1xuXHR2YXIgaWNvbiA9IGNvbmZpZy5pY29uIHx8IFwiXCI7XG5cdHZhciBtZXNzYWdlID0gY29uZmlnLm1lc3NhZ2U7XG5cblx0dmFyIG9rTGFiZWwgPSBjb25maWcub2tMYWJlbDtcblx0dmFyIGNhbmNlbExhYmVsID0gY29uZmlnLmNhbmNlbExhYmVsO1xuXG5cblx0ZnVuY3Rpb24gb2soKSB7XG5cdFx0Y2FsbGJhY2sodHJ1ZSk7XG5cdFx0dmlzaWJsZSghdmlzaWJsZSgpKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNhbmNlbCgpIHtcblx0XHRjYWxsYmFjayhmYWxzZSk7XG5cdFx0dmlzaWJsZSghdmlzaWJsZSgpKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0dmlzaWJsZTogdmlzaWJsZSxcblxuXHRcdHRpdGxlOiB0aXRsZSxcblx0XHRpY29uOiBpY29uLFxuXHRcdG1lc3NhZ2U6IG1lc3NhZ2UsXG5cblx0XHRva0xhYmVsOiBva0xhYmVsLFxuXHRcdGNhbmNlbExhYmVsOiBjYW5jZWxMYWJlbCxcblxuXHRcdG9rOiBvayxcblx0XHRjYW5jZWw6IGNhbmNlbFxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUNvbmZpcm1Nb2RhbDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlQ29uZmlnKHRoZW1lKSB7XG5cdHJldHVybiB7XG5cdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmRhcmtHcmF5LFxuXHRcdFx0XHRcImJvcmRlci1jb2xvclwiOiB0aGVtZS5kYXJrR3JheSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJrbm9iLW1vZGFsLW92ZXJsYXlcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiB2aXNpYmxlXCI+XFxuXFxuXHQ8ZGl2IGNsYXNzPVwia25vYi1tb2RhbFwiPlxcblx0XHQ8ZGl2IGNsYXNzPVwia25vYi1tb2RhbF9faGVhZGVyXCIgZGF0YS1iaW5kPVwic3R5bGU6IHN0eWxlXCI+XFxuXHRcdFx0PGtub2ItYnV0dG9uIGNsYXNzPVwiYnV0dG9uLWNsb3NlXCIgcGFyYW1zPVwidmFyaWF0aW9uOiBcXCdtb2RhbEhlYWRcXCcsIGljb246IFxcJyNpY29uLWNsb3NlXFwnLCBjbGljazogJGNvbXBvbmVudC52aXNpYmxlLnRvZ2dsZVwiPjwva25vYi1idXR0b24+XFxuXFxuXHRcdFx0PHNwYW4gY2xhc3M9XCJkZXNjXCI+XFxuXHRcdFx0XHQ8c3ZnIGNsYXNzPVwiaWNvblwiPlxcblx0XHRcdFx0XHQ8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIGRhdGEtYmluZD1cImF0dHI6IHtcXCd4bGluazpocmVmXFwnOiBpY29ufVwiIHhsaW5rOmhyZWY9XCJcIj48L3VzZT5cXG5cdFx0XHRcdDwvc3ZnPlxcblx0XHRcdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogdGl0bGVcIj48L3NwYW4+XFxuXHRcdFx0PC9zcGFuPlxcblxcblx0XHQ8L2Rpdj5cXG5cdFx0PGRpdiBjbGFzcz1cImtub2ItbW9kYWxfX2JvZHlcIj5cXG5cdFx0XHQ8IS0tIGtvIHRlbXBsYXRlOiB7IG5vZGVzOiAkY29tcG9uZW50VGVtcGxhdGVOb2RlcywgZGF0YTogJHBhcmVudCB9IC0tPjwhLS0gL2tvIC0tPlxcblx0XHQ8L2Rpdj5cXG5cdDwvZGl2PlxcbjwvZGl2Plxcbic7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVTdHlsZUNvbmZpZyh0aGVtZSkge1xuXG5cdHZhciB0aW55Y29sb3IgPSByZXF1aXJlKFwidGlueWNvbG9yMlwiKTtcblxuXHRyZXR1cm4ge1xuXHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJib3JkZXItY29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiYm9yZGVyLWNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5tZWRpdW1HcmF5KS5kYXJrZW4udG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJjb2xvclwiOiB0aW55Y29sb3IodGhlbWUubWVkaXVtR3JheSkuZGFya2VuLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aW55Y29sb3IodGhlbWUubWVkaXVtR3JheSkuZGFya2VuLnRvU3RyaW5nKClcblx0XHRcdH0sXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrXG5cdFx0XHR9LFxuXHRcdFx0XCJzdWNjZXNzXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc3VjY2Vzc0NvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImVycm9yXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuYWxlcnRDb2xvcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlU3R5bGVDb25maWcodGhlbWUpIHtcblxuXHR2YXIgdGlueWNvbG9yID0gcmVxdWlyZShcInRpbnljb2xvcjJcIik7XG5cblx0cmV0dXJuIHtcblx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiYm9yZGVyLWNvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiYm9yZGVyLWNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5tZWRpdW1HcmF5KS5kYXJrZW4udG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJjb2xvclwiOiB0aW55Y29sb3IodGhlbWUubWVkaXVtR3JheSkuZGFya2VuLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aW55Y29sb3IodGhlbWUubWVkaXVtR3JheSkuZGFya2VuLnRvU3RyaW5nKClcblx0XHRcdH0sXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrXG5cdFx0XHR9LFxuXHRcdFx0XCJzdWNjZXNzXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc3VjY2Vzc0NvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImVycm9yXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuYWxlcnRDb2xvcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlU3R5bGVDb25maWcodGhlbWUpIHtcblx0cmV0dXJuIHtcblx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiYm9yZGVyLWNvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUucHJpbWFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImJvcmRlci1jb2xvclwiOiB0aGVtZS5kYXJrR3JheVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUucHJpbWFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLnByaW1hcnlDb2xvcixcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLnByaW1hcnlDb2xvclxuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubGlnaHRHcmF5XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIGtvID0gKHdpbmRvdy5rbyk7XG52YXIgYmFzZSA9IHJlcXVpcmUoXCIuLi9iYXNlL3ZtXCIpO1xuXG5mdW5jdGlvbiBjcmVhdGVNb2RhbChjb25maWcpIHtcblxuXHRpZiAoIWNvbmZpZykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZyBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKGNvbmZpZy52aXNpYmxlICYmICFrby5pc09ic2VydmFibGUoY29uZmlnLnZpc2libGUpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnZpc2libGUgbXVzdCBiZSBhbiBvYnNlcnZhYmxlXCIpO1xuXHR9XG5cblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdHZhciB2aXNpYmxlID0gY29uZmlnLnZpc2libGU7XG5cdHZhciB0aXRsZSA9IGNvbmZpZy50aXRsZTtcblx0dmFyIGljb24gPSBjb25maWcuaWNvbjtcblxuXHR2aXNpYmxlLnRvZ2dsZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZpc2libGUoIXZpc2libGUoKSk7XG5cdH07XG5cblx0Y29uZmlnLmNvbXBvbmVudCA9IFwibW9kYWxcIjtcblxuXHR2YXIgdm0gPSBiYXNlKGNvbmZpZyk7XG5cblx0dm0udmlzaWJsZSA9IHZpc2libGU7XG5cdHZtLnRpdGxlID0gdGl0bGU7XG5cdHZtLmljb24gPSBpY29uO1xuXG5cdHJldHVybiB2bTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVNb2RhbDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlQ29uZmlnKHRoZW1lKSB7XG5cdHJldHVybiB7XG5cdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwiaW5mb1wiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5pbmZvLmJhY2tncm91bmQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuaW5mby50ZXh0LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuaW5mby50ZXh0XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcInN1Y2Nlc3NcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc3VjY2Vzcy5iYWNrZ3JvdW5kLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLnN1Y2Nlc3MudGV4dCxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLnN1Y2Nlc3MudGV4dFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJ3YXJuaW5nXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndhcm5pbmcuYmFja2dyb3VuZCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53YXJuaW5nLnRleHQsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53YXJuaW5nLnRleHRcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwiZXJyb3JcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuZXJyb3IuYmFja2dyb3VuZCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5lcnJvci50ZXh0LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuZXJyb3IudGV4dFxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImtub2Itbm90aWZpY2F0aW9uXCIgZGF0YS1iaW5kPVwidmlzaWJsZTogdmlzaWJsZSwgc3R5bGU6IHN0eWxlXCI+XFxuXFxuXHQ8c3ZnIGNsYXNzPVwiaWNvblwiPlxcblx0XHQ8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIGRhdGEtYmluZD1cImF0dHI6IHtcXCd4bGluazpocmVmXFwnOiBpY29ufVwiIHhsaW5rOmhyZWY9XCJcIj48L3VzZT5cXG5cdDwvc3ZnPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogbWVzc2FnZVwiPjwvc3Bhbj5cXG5cdDwhLS0ga28gdGVtcGxhdGU6IHsgbm9kZXM6ICRjb21wb25lbnRUZW1wbGF0ZU5vZGVzLCBkYXRhOiAkcGFyZW50IH0gLS0+PCEtLSAva28gLS0+XFxuPC9kaXY+JzsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlQ29uZmlnKHRoZW1lKSB7XG5cdHJldHVybiB7XG5cdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwiaW5mb1wiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5pbmZvLmJhY2tncm91bmQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuaW5mby50ZXh0LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuaW5mby50ZXh0XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcInN1Y2Nlc3NcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc3VjY2Vzcy5iYWNrZ3JvdW5kLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLnN1Y2Nlc3MudGV4dCxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLnN1Y2Nlc3MudGV4dFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJ3YXJuaW5nXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLndhcm5pbmcuYmFja2dyb3VuZCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53YXJuaW5nLnRleHQsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53YXJuaW5nLnRleHRcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwiZXJyb3JcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuZXJyb3IuYmFja2dyb3VuZCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5lcnJvci50ZXh0LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuZXJyb3IudGV4dFxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVTdHlsZUNvbmZpZyh0aGVtZSkge1xuXHRyZXR1cm4ge1xuXHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcImluZm9cIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuaW5mby5iYWNrZ3JvdW5kLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwic3VjY2Vzc1wiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5zdWNjZXNzLmJhY2tncm91bmQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJ3YXJuaW5nXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndhcm5pbmcuYmFja2dyb3VuZCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcImVycm9yXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmVycm9yLmJhY2tncm91bmQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIga28gPSAod2luZG93LmtvKTtcbnZhciBiYXNlID0gcmVxdWlyZShcIi4uL2Jhc2Uvdm1cIik7XG5cbmZ1bmN0aW9uIGNyZWF0ZU5vdGlmaWNhdGlvbihjb25maWcpIHtcblxuXHRpZiAoIWNvbmZpZykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZyBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKCFjb25maWcubWVzc2FnZSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5tZXNzYWdlIGVsZW1lbnQgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmIChjb25maWcudmlzaWJsZSAmJiAha28uaXNPYnNlcnZhYmxlKGNvbmZpZy52aXNpYmxlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy52aXNpYmxlIG11c3QgYmUgYW4gb2JzZXJ2YWJsZVwiKTtcblx0fVxuXG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHR2YXIgdmlzaWJsZSA9IGNvbmZpZy52aXNpYmxlO1xuXHR2YXIgbWVzc2FnZSA9IGNvbmZpZy5tZXNzYWdlO1xuXHR2YXIgaWNvbiA9IGNvbmZpZy5pY29uO1xuXG5cdHZpc2libGUudG9nZ2xlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmlzaWJsZSghdmlzaWJsZSgpKTtcblx0fTtcblxuXHRjb25maWcuY29tcG9uZW50ID0gXCJub3RpZmljYXRpb25cIjtcblxuXHR2YXIgdm0gPSBiYXNlKGNvbmZpZyk7XG5cblx0dm0udmlzaWJsZSA9IHZpc2libGU7XG5cdHZtLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHR2bS5pY29uID0gaWNvbjtcblxuXHRyZXR1cm4gdm07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlTm90aWZpY2F0aW9uOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlU3R5bGVDb25maWcodGhlbWUpIHtcblxuXHRyZXR1cm4ge1xuXHRcdFwiZXZlblwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFja1xuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5tZWRpdW1HcmF5LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcIm9kZFwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2tcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUubWVkaXVtR3JheSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFja1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwia25vYi1wYWdlbGlzdFwiPlxcblx0PCEtLSBrbyBpZjogZXJyb3IgLS0+XFxuXHRcdDxkaXYgZGF0YS1iaW5kPVwidGV4dDogZXJyb3JcIj48L2Rpdj5cXG5cdDwhLS0gL2tvIC0tPlxcblxcblx0PGRpdj5cXG5cdFx0PGRpdiBjbGFzcz1cImtub2ItcGFnZWxpc3RfX2JhclwiPlxcblx0XHRcdDxpbnB1dCBjbGFzcz1cImtub2ItaW5wdXRcIiB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cInZhbHVlOiBzZWFyY2gsIHZhbHVlVXBkYXRlOiBcXCdhZnRlcmtleWRvd25cXCdcIi8+XFxuXHRcdFx0PGtub2ItYnV0dG9uIGNsYXNzPVwia25vYi1idXR0b24tc2VhcmNoXCIgcGFyYW1zPVwibGFiZWw6IFxcJ1xcJyxcXG5cdFx0XHRcdFx0XHRcdFx0dmFyaWF0aW9uOiBcXCdkZWZhdWx0XFwnLFxcblx0XHRcdFx0XHRcdFx0XHRpY29uOiBpY29ucy5zZWFyY2hcIj5cXG5cdFx0XHQ8L2tub2ItYnV0dG9uPlxcblx0XHRcdDxrbm9iLWl0ZW1zLXBlci1wYWdlIGNsYXNzPVwia25vYi1wYWdlbGlzdF9faXRlbXMtcGVyLXBhZ2VcIiBwYXJhbXM9XCJcXG5cdFx0XHRcdG51bU9mSXRlbXM6IGNvdW50LFxcblx0XHRcdFx0bnVtT2ZQYWdlczogbnVtT2ZQYWdlcyxcXG5cdFx0XHRcdGl0ZW1zUGVyUGFnZTogaXRlbXNQZXJQYWdlXCI+XFxuXHRcdFx0PC9rbm9iLWl0ZW1zLXBlci1wYWdlPlxcblx0XHRcdDwhLS0ga28gaWY6IHNvcnRPcHRpb25zLmxlbmd0aCA+IDAgLS0+XFxuXHRcdFx0XHQ8a25vYi1kcm9wZG93biBjbGFzcz1cImtub2ItZHJvcGRvd25cIiBwYXJhbXM9XCJyaWdodEljb246IGljb25zLmRyb3Bkb3duLCBzZWxlY3RlZElkeDogc29ydElkeCwgc2VsZWN0ZWQ6IHNvcnQsIGl0ZW1zOiBzb3J0T3B0aW9uc1wiPjwva25vYi1kcm9wZG93bj5cXG5cdFx0XHQ8IS0tIC9rbyAtLT5cXG5cdFx0PC9kaXY+XFxuXHRcdDx1bCBkYXRhLWJpbmQ9XCJjc3M6IGxpc3RDbGFzcywgZm9yZWFjaDogaXRlbXNcIj5cXG5cdFx0XHQ8bGkgZGF0YS1iaW5kPVwiY3NzOiAkcGFyZW50Lml0ZW1DbGFzc1wiPlxcblx0XHRcdFx0PCEtLSBrbyB0ZW1wbGF0ZTogeyBub2RlczogJGNvbXBvbmVudFRlbXBsYXRlTm9kZXMsIGRhdGE6IHttb2RlbDogJGRhdGEsIHBhcmVudDogJHBhcmVudCwgaW5kZXg6ICRpbmRleH0gfSAtLT48IS0tIC9rbyAtLT5cXG5cdFx0XHQ8L2xpPlxcblx0XHQ8L3VsPlxcblx0XHQ8IS0tIGtvIGlmOiBpdGVtcygpLmxlbmd0aCA9PT0gMCAtLT5cXG5cdFx0XHQ8c3BhbiBjbGFzcz1cIm5vLXJlc3VsdFwiIGRhdGEtYmluZD1cInZpc2libGU6ICFsb2FkaW5nKCksIHRleHQ6IGxhYmVscy5ub1Jlc3VsdHNcIj48L3NwYW4+XFxuXHRcdDwhLS0gL2tvIC0tPlxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IGNsYXNzPVwibG9hZGluZ1wiIGRhdGEtYmluZD1cInZpc2libGU6IGxvYWRpbmdcIj5cXG5cdFx0PHN2ZyBjbGFzcz1cImFuaW0tcm90YXRlXCI+PHVzZSB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7XFwneGxpbms6aHJlZlxcJzogaWNvbnMubG9hZGluZ31cIiB4bGluazpocmVmPVwiXCI+PC91c2U+PC9zdmc+XFxuXHQ8L2Rpdj5cXG5cdDwhLS1cXG5cdDxrbm9iLXBhZ2luYXRpb24gcGFyYW1zPVwibnVtT2ZJdGVtczogcGFnaW5hdGlvbi5udW1PZkl0ZW1zLCBpdGVtc1BlclBhZ2U6IGl0ZW1zUGVyUGFnZVwiPjwva25vYi1wYWdpbmF0aW9uPlxcblx0LS0+XFxuXHQ8IS0tIGtvIGlmOiBudW1PZlBhZ2VzKCkgPiAwIC0tPlxcblx0XHQ8a25vYi1wYWdpbmF0aW9uIHBhcmFtcz1cIm51bU9mUGFnZXM6IG51bU9mUGFnZXMsIGN1cnJlbnRQYWdlOiBjdXJyZW50UGFnZVwiPjwva25vYi1wYWdpbmF0aW9uPlxcblx0PCEtLSAva28gLS0+XFxuXHQ8IS0tIGtvIGlmOiAkZGF0YS5sb2FkTW9yZSAtLT5cXG5cdFx0PGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAhbG9hZGluZygpLCBjbGljazogbG9hZE1vcmVcIj5Mb2FkIG1vcmUuLi48L2Rpdj5cXG5cdDwhLS0gL2tvIC0tPlxcbjwvZGl2Pic7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVTdHlsZUNvbmZpZyh0aGVtZSkge1xuXG5cdHZhciB0aW55Y29sb3IgPSByZXF1aXJlKFwidGlueWNvbG9yMlwiKTtcblxuXHRyZXR1cm4ge1xuXHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJib3JkZXItY29sb3JcIjogdGhlbWUubWVkaXVtR3JheVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUud2hpdGUpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiYm9yZGVyLWNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5tZWRpdW1HcmF5KS5kYXJrZW4udG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJjb2xvclwiOiB0aW55Y29sb3IodGhlbWUubWVkaXVtR3JheSkuZGFya2VuLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aW55Y29sb3IodGhlbWUubWVkaXVtR3JheSkuZGFya2VuLnRvU3RyaW5nKClcblx0XHRcdH0sXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrXG5cdFx0XHR9LFxuXHRcdFx0XCJzdWNjZXNzXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc3VjY2Vzc0NvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImVycm9yXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuYWxlcnRDb2xvcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcbnZhciBjcmVhdGVMaXN0ID0gcmVxdWlyZShcIi4uL2xpc3Qvdm1cIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlUGFnZWRMaXN0KGNvbmZpZykge1xuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cblx0aWYgKCFjb25maWcuc3RvcmUpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc3RvcmUgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdHZhciBzdG9yZSA9IGNvbmZpZy5zdG9yZTtcblxuXHRzdG9yZS5sb2FkLmJlZm9yZS5hZGQoYmVmb3JlTG9hZCk7XG5cblx0dmFyIGxpc3QgPSBjcmVhdGVMaXN0KGNvbmZpZyk7XG5cdC8vdmFyIHBhZ2luYXRpb24gPSBjcmVhdGVQYWdpbmF0aW9uKGNvbmZpZy5wYWdpbmF0aW9uKTtcblx0Ly9saXN0LnBhZ2luYXRpb24gPSBwYWdpbmF0aW9uO1xuXG5cdHZhciBudW1PZlBhZ2VzID0ga28ub2JzZXJ2YWJsZSgpO1xuXHR2YXIgaXRlbXNQZXJQYWdlID0ga28ub2JzZXJ2YWJsZSgxMCk7XG5cdHZhciBjdXJyZW50UGFnZSA9IGtvLm9ic2VydmFibGUoMCk7XG5cblx0bGlzdC5saXN0Q2xhc3MgPSBjb25maWcubGlzdENsYXNzIHx8IFwia25vYi1wYWdlZGxpc3RfX2xpc3RcIjtcblx0bGlzdC5pdGVtQ2xhc3MgPSBjb25maWcuaXRlbUNsYXNzIHx8IFwia25vYi1wYWdlZGxpc3RfX2l0ZW1cIjtcblx0bGlzdC5udW1PZlBhZ2VzID0gbnVtT2ZQYWdlcztcblx0bGlzdC5pdGVtc1BlclBhZ2UgPSBpdGVtc1BlclBhZ2U7XG5cdGxpc3QuY3VycmVudFBhZ2UgPSBjdXJyZW50UGFnZTtcblxuXHRsaXN0Lmljb25zID0gY29uZmlnLmljb25zO1xuXHRsaXN0LmxhYmVscyA9IGNvbmZpZy5sYWJlbHM7XG5cblx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGN1cnJlbnRQYWdlVmFsID0gY3VycmVudFBhZ2UoKTtcblx0XHR2YXIgaXRlbXNQZXJQYWdlVmFsID0gaXRlbXNQZXJQYWdlKCk7XG5cblx0XHRsaXN0LnNraXAoY3VycmVudFBhZ2VWYWwgKiBpdGVtc1BlclBhZ2VWYWwpO1xuXHRcdGxpc3QubGltaXQoaXRlbXNQZXJQYWdlVmFsKTtcblx0fSk7XG5cblx0Lypcblx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNvdW50ID0gbGlzdC5jb3VudCgpO1xuXHRcdGxpc3QucGFnaW5hdGlvbi5udW1PZkl0ZW1zKGNvdW50KTtcblx0fSk7XG5cdCovXG5cblx0ZnVuY3Rpb24gYmVmb3JlTG9hZCgpIHtcblx0XHRsaXN0Lml0ZW1zKFtdKTtcblx0fVxuXG5cdHJldHVybiBsaXN0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJrbm9iLXBhZ2luYXRpb25cIiBkYXRhLWJpbmQ9XCJpZjogcGFnZVNlbGVjdG9ycygpLmxlbmd0aFwiPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0cGFyYW1zOiB7XFxuXHRcdFx0XHRcdFx0XHR2YXJpYXRpb246IFxcJ3BhZ2luYXRpb25cXCcsXFxuXHRcdFx0XHRcdFx0XHRpY29uOiBpY29ucy5maXJzdCxcXG5cdFx0XHRcdFx0XHRcdHN0YXRlOiBmaXJzdCgpLnN0YXRlLFxcblx0XHRcdFx0XHRcdFx0Y2xpY2s6IGZpcnN0KCkuc2VsZWN0UGFnZVxcblx0XHRcdFx0XHRcdH1cXG5cdFx0XHRcdFx0fVwiPlxcblx0PC9zcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0cGFyYW1zOiB7XFxuXHRcdFx0XHRcdFx0XHR2YXJpYXRpb246IFxcJ3BhZ2luYXRpb25cXCcsXFxuXHRcdFx0XHRcdFx0XHRpY29uOiBpY29ucy5wcmV2LFxcblx0XHRcdFx0XHRcdFx0c3RhdGU6IHByZXYoKS5zdGF0ZSxcXG5cdFx0XHRcdFx0XHRcdGNsaWNrOiBwcmV2KCkuc2VsZWN0UGFnZVxcblx0XHRcdFx0XHRcdH1cXG5cdFx0XHRcdFx0fVwiPlxcblx0PC9zcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiZm9yZWFjaDogcGFnZVNlbGVjdG9yc1wiPlxcblx0XHQ8a25vYi1idXR0b24gcGFyYW1zPVwibGFiZWw6IGxhYmVsLFxcblx0XHRcdFx0XHRcdFx0c3RhdGU6IHN0YXRlLFxcblx0XHRcdFx0XHRcdFx0dmFyaWF0aW9uOiBcXCdwYWdpbmF0aW9uXFwnLFxcblx0XHRcdFx0XHRcdFx0Y2xpY2s6IHNlbGVjdFBhZ2VcIj48L2tub2ItYnV0dG9uPlxcblx0PC9zcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0cGFyYW1zOiB7XFxuXHRcdFx0XHRcdFx0XHR2YXJpYXRpb246IFxcJ3BhZ2luYXRpb25cXCcsXFxuXHRcdFx0XHRcdFx0XHRpY29uOiBpY29ucy5uZXh0LFxcblx0XHRcdFx0XHRcdFx0c3RhdGU6IG5leHQoKS5zdGF0ZSxcXG5cdFx0XHRcdFx0XHRcdGNsaWNrOiBuZXh0KCkuc2VsZWN0UGFnZVxcblx0XHRcdFx0XHRcdH1cXG5cdFx0XHRcdFx0fVwiPlxcblx0PC9zcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0cGFyYW1zOiB7XFxuXHRcdFx0XHRcdFx0XHR2YXJpYXRpb246IFxcJ3BhZ2luYXRpb25cXCcsXFxuXHRcdFx0XHRcdFx0XHRpY29uOiBpY29ucy5sYXN0LFxcblx0XHRcdFx0XHRcdFx0c3RhdGU6IGxhc3QoKS5zdGF0ZSxcXG5cdFx0XHRcdFx0XHRcdGNsaWNrOiBsYXN0KCkuc2VsZWN0UGFnZVxcblx0XHRcdFx0XHRcdH1cXG5cdFx0XHRcdFx0fVwiPlxcblx0PC9zcGFuPlxcbjwvZGl2Pic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVBhZ2luYXRpb24oY29uZmlnKSB7XG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHRpZiAoY29uZmlnLmFmdGVySGVhZCAmJiBjb25maWcuYWZ0ZXJIZWFkIDwgMSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5hZnRlckhlYWQgbXVzdCBiZSBsYXJnZXIgdGhhbiB6ZXJvXCIpO1xuXHR9XG5cblx0aWYgKGNvbmZpZy5iZWZvcmVUYWlsICYmIGNvbmZpZy5iZWZvcmVUYWlsIDwgMSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5iZWZvcmVUYWlsIG11c3QgYmUgbGFyZ2VyIHRoYW4gemVyb1wiKTtcblx0fVxuXG5cdGlmIChjb25maWcuYmVmb3JlQ3VycmVudCAmJiBjb25maWcuYmVmb3JlQ3VycmVudCA8IDEpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuYmVmb3JlQ3VycmVudCBtdXN0IGJlIGxhcmdlciB0aGFuIHplcm9cIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLmFmdGVyQ3VycmVudCAmJiBjb25maWcuYWZ0ZXJDdXJyZW50IDwgMSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5hZnRlckN1cnJlbnQgbXVzdCBiZSBsYXJnZXIgdGhhbiB6ZXJvXCIpO1xuXHR9XG5cblx0dmFyIG51bU9mUGFnZXM7XG5cblx0aWYgKGtvLmlzT2JzZXJ2YWJsZShjb25maWcubnVtT2ZQYWdlcykpIHtcblx0XHRudW1PZlBhZ2VzID0gY29uZmlnLm51bU9mUGFnZXM7XG5cdH0gZWxzZSB7XG5cdFx0bnVtT2ZQYWdlcyA9IGtvLm9ic2VydmFibGUoY29uZmlnLm51bU9mUGFnZXMgfHwgMTApO1xuXHR9XG5cblx0ZnVuY3Rpb24gbm9ybWFsaXplKHZhbHVlKSB7XG5cdFx0aWYgKHZhbHVlIDwgMCkge1xuXHRcdFx0dmFsdWUgPSAwO1xuXHRcdH1cblxuXHRcdHZhciBwYWdlc051bSA9IG51bU9mUGFnZXMoKTtcblxuXHRcdGlmICh2YWx1ZSA+PSBwYWdlc051bSkge1xuXHRcdFx0dmFsdWUgPSBwYWdlc051bSAtIDE7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG5cblx0dmFyIGN1cnJlbnRQYWdlID0gKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjdXJyZW50UGFnZSA9IGtvLm9ic2VydmFibGUoKTtcblxuXHRcdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdFx0bnVtT2ZQYWdlcygpO1xuXHRcdFx0Y3VycmVudFBhZ2UoMCk7XG5cdFx0fSk7XG5cblx0XHRpZiAoa28uaXNPYnNlcnZhYmxlKGNvbmZpZy5jdXJyZW50UGFnZSkpIHtcblx0XHRcdGN1cnJlbnRQYWdlID0gY29uZmlnLmN1cnJlbnRQYWdlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjdXJyZW50UGFnZSA9IGtvLm9ic2VydmFibGUobm9ybWFsaXplKGNvbmZpZy5jdXJyZW50UGFnZSkgfHwgMCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGtvLmNvbXB1dGVkKHtcblx0XHRcdHJlYWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gY3VycmVudFBhZ2UoKTtcblx0XHRcdH0sXG5cdFx0XHR3cml0ZTogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0Y3VycmVudFBhZ2Uobm9ybWFsaXplKHZhbHVlKSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0oKSk7XG5cblxuXG5cdHZhciBjdXJyZW50UGFnZVJlYWxJZHg7XG5cdHZhciBwYWdlU2VsZWN0b3JzID0gKGZ1bmN0aW9uKGNvbmZpZykge1xuXHRcdHZhciBhZnRlckhlYWQgPSBjb25maWcuYWZ0ZXJIZWFkIHx8IDI7XG5cdFx0dmFyIGJlZm9yZVRhaWwgPSBjb25maWcuYmVmb3JlVGFpbCB8fCAyO1xuXHRcdHZhciBiZWZvcmVDdXJyZW50ID0gY29uZmlnLmJlZm9yZUN1cnJlbnQgfHwgMjtcblx0XHR2YXIgYWZ0ZXJDdXJyZW50ID0gY29uZmlnLmFmdGVyQ3VycmVudCB8fCAyO1xuXG5cdFx0ZnVuY3Rpb24gY3JlYXRlUGFnZVNlbGVjdG9yKGlkeCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bGFiZWw6IGlkeCArIDEsXG5cdFx0XHRcdHN0YXRlOiBcImRlZmF1bHRcIixcblx0XHRcdFx0c2VsZWN0UGFnZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y3VycmVudFBhZ2UoaWR4KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjcmVhdGVOb25DbGlja2FibGVTZWxlY3RvcihsYWJlbCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bGFiZWw6IGxhYmVsLFxuXHRcdFx0XHRzdGF0ZTogXCJkaXNhYmxlZFwiLFxuXHRcdFx0XHRzZWxlY3RQYWdlOiBmdW5jdGlvbigpIHt9XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHJldHVybiBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHRcdHZhciBlbGVtZW50cyA9IFtdO1xuXG5cdFx0XHR2YXIgbnVtT2ZQYWdlc1ZhbCA9IG51bU9mUGFnZXMoKTtcblx0XHRcdHZhciBjdXJyZW50UGFnZVZhbCA9IGN1cnJlbnRQYWdlKCk7XG5cblx0XHRcdHZhciBub25DbGlja2FibGVJbnNlcnRlZCA9IGZhbHNlO1xuXG5cdFx0XHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCBudW1PZlBhZ2VzVmFsOyBpZHggKz0gMSkge1xuXHRcdFx0XHRpZiAoaWR4IDw9IGFmdGVySGVhZCB8fCBpZHggPj0gbnVtT2ZQYWdlc1ZhbCAtIGJlZm9yZVRhaWwgLSAxIHx8IGlkeCA+PSBjdXJyZW50UGFnZVZhbCAtIGJlZm9yZUN1cnJlbnQgJiYgaWR4IDw9IGN1cnJlbnRQYWdlVmFsICsgYWZ0ZXJDdXJyZW50KSB7XG5cdFx0XHRcdFx0dmFyIHBhZ2VTZWxlY3RvcjtcblxuXHRcdFx0XHRcdGlmIChpZHggPT09IGN1cnJlbnRQYWdlVmFsKSB7XG5cdFx0XHRcdFx0XHRwYWdlU2VsZWN0b3IgPSBjcmVhdGVOb25DbGlja2FibGVTZWxlY3RvcihpZHggKyAxKTtcblx0XHRcdFx0XHRcdGN1cnJlbnRQYWdlUmVhbElkeCA9IGVsZW1lbnRzLmxlbmd0aDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cGFnZVNlbGVjdG9yID0gY3JlYXRlUGFnZVNlbGVjdG9yKGlkeCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0ZWxlbWVudHMucHVzaChwYWdlU2VsZWN0b3IpO1xuXHRcdFx0XHRcdG5vbkNsaWNrYWJsZUluc2VydGVkID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKCFub25DbGlja2FibGVJbnNlcnRlZCkge1xuXHRcdFx0XHRcdFx0ZWxlbWVudHMucHVzaChjcmVhdGVOb25DbGlja2FibGVTZWxlY3RvcihcIi4uLlwiKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5vbkNsaWNrYWJsZUluc2VydGVkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZWxlbWVudHM7XG5cdFx0fSk7XG5cdH0oY29uZmlnKSk7XG5cblxuXHR2YXIgbmV4dCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBpZHggPSBjdXJyZW50UGFnZVJlYWxJZHggKyAxO1xuXG5cdFx0dmFyIHBhZ2VzID0gcGFnZVNlbGVjdG9ycygpO1xuXG5cdFx0aWYgKGlkeCA+PSBwYWdlcy5sZW5ndGggLSAxKSB7XG5cdFx0XHRpZHggPSBwYWdlcy5sZW5ndGggLSAxO1xuXHRcdH1cblxuXHRcdHJldHVybiBwYWdlc1tpZHhdO1xuXHR9KTtcblxuXHR2YXIgcHJldiA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBpZHggPSBjdXJyZW50UGFnZVJlYWxJZHggLSAxO1xuXG5cdFx0aWYgKGlkeCA8IDApIHtcblx0XHRcdGlkeCA9IDA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBhZ2VTZWxlY3RvcnMoKVtpZHhdO1xuXHR9KTtcblxuXHR2YXIgZmlyc3QgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gcGFnZVNlbGVjdG9ycygpWzBdO1xuXHR9KTtcblxuXHR2YXIgbGFzdCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBwYWdlcyA9IHBhZ2VTZWxlY3RvcnMoKTtcblxuXHRcdHJldHVybiBwYWdlc1twYWdlcy5sZW5ndGggLSAxXTtcblx0fSk7XG5cblxuXHRyZXR1cm4ge1xuXHRcdHBhZ2VTZWxlY3RvcnM6IHBhZ2VTZWxlY3RvcnMsXG5cblx0XHRmaXJzdDogZmlyc3QsXG5cdFx0bGFzdDogbGFzdCxcblxuXHRcdG5leHQ6IG5leHQsXG5cdFx0cHJldjogcHJldixcblxuXHRcdGN1cnJlbnRQYWdlOiBjdXJyZW50UGFnZSxcblxuXHRcdG51bU9mUGFnZXM6IG51bU9mUGFnZXMsXG5cblx0XHRpY29uczogY29uZmlnLmljb25zXG5cdH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImtub2ItcmFkaW9cIiBkYXRhLWJpbmQ9XCJmb3JlYWNoOiBpdGVtc1wiPlxcblx0PGRpdiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtcXG5cdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdHBhcmFtczoge1xcblx0XHRcdHN0YXRlOiBpc1NlbGVjdGVkKCkgPyBcXCdhY3RpdmVcXCcgOiBcXCdkZWZhdWx0XFwnLFxcblx0XHRcdHZhcmlhdGlvbjogJHBhcmVudC52YXJpYXRpb24sXFxuXHRcdFx0bGFiZWw6IGxhYmVsLFxcblx0XHRcdGljb246IGljb24sXFxuXHRcdFx0cmFkaW86IHRydWUsXFxuXHRcdFx0Z3JvdXA6IGdyb3VwLFxcblx0XHRcdGNsaWNrOiBzZWxlY3RcXG5cdFx0fVxcblx0fVwiPlxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbmZ1bmN0aW9uIGNyZWF0ZVJhZGlvKGNvbmZpZykge1xuXG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHR2YXIgdm0gPSB7fTtcblxuXHRpZiAoY29uZmlnLml0ZW1zLmxlbmd0aCA9PT0gMCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5pdGVtcyBzaG91bGQgbm90IGJlIGVtcHR5XCIpO1xuXHR9XG5cblx0dm0uc2VsZWN0ZWQgPSBjb25maWcuc2VsZWN0ZWQgfHwga28ub2JzZXJ2YWJsZSgpO1xuXHR2bS5zZWxlY3RlZElkeCA9IGNvbmZpZy5zZWxlY3RlZElkeCB8fCBrby5vYnNlcnZhYmxlKCk7XG5cblx0dm0udmFyaWF0aW9uID0gY29uZmlnLnZhcmlhdGlvbiB8fCBcImRlZmF1bHRcIjtcblxuXHR2bS5pdGVtcyA9IFtdO1xuXG5cdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGNvbmZpZy5pdGVtcy5sZW5ndGg7IGlkeCArPSAxKSB7XG5cblx0XHR2YXIgYWN0ID0gY29uZmlnLml0ZW1zW2lkeF07XG5cblx0XHRpZiAoIWFjdC5sYWJlbCAmJiAhYWN0Lmljb24pIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImVhY2ggZWxlbWVudCBvZiBjb25maWcuaXRlbXMgaGFzIHRvIGhhdmUgbGFiZWwgYW5kL29yIGljb24gcHJvcGVydHlcIik7XG5cdFx0fVxuXG5cdFx0dm0uaXRlbXMucHVzaChjcmVhdGVJdGVtVm0oYWN0LmxhYmVsLCBhY3QuaWNvbiwgaWR4KSk7XG5cdH1cblxuXHR2YXIgc2VsID0gdm0uc2VsZWN0ZWRJZHgoKTtcblxuXHRpZiAodHlwZW9mIHNlbCA9PT0gXCJudW1iZXJcIikge1xuXHRcdHNlbCA9IE1hdGguZmxvb3Ioc2VsKTtcblx0XHRzZWwgJT0gdm0uaXRlbXMubGVuZ3RoO1xuXG5cdFx0dm0uaXRlbXNbc2VsXS5zZWxlY3QoKTtcblxuXHR9IGVsc2Uge1xuXHRcdHZtLml0ZW1zWzBdLnNlbGVjdCgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gY3JlYXRlSXRlbVZtKGxhYmVsLCBpY29uLCBpZHgpIHtcblxuXHRcdHZhciBvYmogPSB7XG5cdFx0XHRsYWJlbDogbGFiZWwsXG5cdFx0XHRpY29uOiBpY29uLFxuXHRcdFx0Z3JvdXA6IGNvbmZpZy5ncm91cCxcblx0XHRcdHNlbGVjdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZtLnNlbGVjdGVkKG9iaik7XG5cdFx0XHRcdHZtLnNlbGVjdGVkSWR4KGlkeCk7XG5cdFx0XHR9LFxuXHRcdFx0aXNTZWxlY3RlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBvYmogPT09IHZtLnNlbGVjdGVkKCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiBvYmo7XG5cdH1cblxuXHRyZXR1cm4gdm07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlUmFkaW87XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGRhdGEtYmluZD1cImNzczogY3NzQ2xhc3MsXFxuXHRcdFx0XHRcdHN0eWxlOiBzdHlsZVwiPlxcblx0PCEtLSBrbyB0ZW1wbGF0ZTogeyBub2RlczogJGNvbXBvbmVudFRlbXBsYXRlTm9kZXMsIGRhdGE6ICRwYXJlbnQgfSAtLT48IS0tIC9rbyAtLT5cXG48L2Rpdj4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgYmFzZSA9IHJlcXVpcmUoXCIuLi8uLi9iYXNlL3ZtXCIpO1xuXG5mdW5jdGlvbiBjcmVhdGVUYWIoY29uZmlnKSB7XG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblx0Y29uZmlnLmNvbXBvbmVudCA9IFwidGFiXCI7XG5cdGNvbmZpZy52YXJpYXRpb24gPSBcInRhYlwiO1xuXHRjb25maWcuc3RhdGUgPSBcImFjdGl2ZVwiO1xuXG5cdHZhciB2bSA9IGJhc2UoY29uZmlnKTtcblxuXHRyZXR1cm4gdm07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlVGFiO1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDxrbm9iLXJhZGlvIHBhcmFtcz1cIlxcblx0XHRncm91cDogdGFic0dyb3VwLFxcblx0XHR2YXJpYXRpb246IFxcJ3RhYlxcJyxcXG5cdFx0c2VsZWN0ZWRJZHg6IHNlbGVjdGVkSWR4LFxcblx0XHRpdGVtczogYnV0dG9uc1wiPlxcblx0PC9rbm9iLXJhZGlvPlxcblxcblx0PGRpdiBjbGFzcz1cImtub2ItcGFuZWwtZ3JvdXBcIiBkYXRhLWJpbmQ9XCJmb3JlYWNoOiBwYW5lbHNcIj5cXG5cdFx0PGtub2ItdGFiIGRhdGEtYmluZD1cInZpc2libGU6ICRwYXJlbnQuc2VsZWN0ZWRJZHgoKSA9PSAkaW5kZXgoKVwiPlxcblx0XHRcdDwhLS0ga28gdGVtcGxhdGU6IHsgbm9kZXM6ICRkYXRhIH0gLS0+PCEtLSAva28gLS0+XFxuXHRcdDwva25vYi10YWI+XFxuXHQ8L2Rpdj5cXG48L2Rpdj4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxudmFyIG5leHRUYWJzR3JvdXBJZHggPSAwO1xuXG5mdW5jdGlvbiBjb252ZXJ0UGFyYW1zVG9PYmplY3QocGFyYW1zKSB7XG5cdHBhcmFtcyA9IHBhcmFtcy5yZXBsYWNlKC8nL2csIFwiXFxcIlwiKTtcblxuXHR2YXIgcGFyYW1zID0gcGFyYW1zLnNwbGl0KFwiLFwiKTtcblxuXHR2YXIgY29udmVydGVkUGFyYW1zID0gW107XG5cblx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgcGFyYW1zLmxlbmd0aDsgaWR4ICs9IDEpIHtcblx0XHR2YXIgYWN0ID0gcGFyYW1zW2lkeF07XG5cblx0XHRhY3QgPSBhY3QudHJpbSgpO1xuXG5cdFx0YWN0ID0gYWN0LnNwbGl0KFwiOlwiKTtcblxuXHRcdGlmIChhY3QubGVuZ3RoICE9PSAyKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRhY3QgPSBcIlxcXCJcIiArIGFjdFswXSArIFwiXFxcIlwiICsgXCI6XCIgKyBhY3RbMV07XG5cdFx0Y29udmVydGVkUGFyYW1zLnB1c2goYWN0KTtcblx0fVxuXG5cdHJldHVybiBKU09OLnBhcnNlKFwie1wiICsgY29udmVydGVkUGFyYW1zLmpvaW4oXCIsXCIpICsgXCJ9XCIpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUYWJzKGNvbmZpZywgY29tcG9uZW50SW5mbykge1xuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cdGNvbXBvbmVudEluZm8gPSBjb21wb25lbnRJbmZvIHx8IHt9O1xuXHRjb21wb25lbnRJbmZvLnRlbXBsYXRlTm9kZXMgPSBjb21wb25lbnRJbmZvLnRlbXBsYXRlTm9kZXMgfHwgW107XG5cblx0dmFyIGRlZmF1bHRUYWIgPSBjb25maWcuZGVmYXVsdFRhYiB8fCAwO1xuXG5cdHZhciB2bSA9IHt9O1xuXG5cdHZhciB0YWJCdXR0b25zID0gW107XG5cdHZhciB0YWJQYW5lbHMgPSBbXTtcblxuXHR2YXIgdGFiSWR4ID0gMDtcblxuXHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCBjb21wb25lbnRJbmZvLnRlbXBsYXRlTm9kZXMubGVuZ3RoOyBpZHggKz0gMSkge1xuXHRcdHZhciBhY3RUZW1wbGF0ZU5vZGUgPSBjb21wb25lbnRJbmZvLnRlbXBsYXRlTm9kZXNbaWR4XTtcblxuXHRcdGlmIChhY3RUZW1wbGF0ZU5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPT0gXCJrbm9iLXRhYlwiKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHR2YXIgdGFiQnV0dG9uRGF0YSA9IGNvbnZlcnRQYXJhbXNUb09iamVjdChhY3RUZW1wbGF0ZU5vZGUuZ2V0QXR0cmlidXRlKFwicGFyYW1zXCIpKTtcblxuXHRcdHRhYkJ1dHRvbkRhdGEudGFiSWR4ID0gdGFiSWR4O1xuXHRcdHRhYklkeCArPSAxO1xuXG5cdFx0dGFiQnV0dG9ucy5wdXNoKHRhYkJ1dHRvbkRhdGEpO1xuXG5cdFx0dGFiUGFuZWxzLnB1c2goYWN0VGVtcGxhdGVOb2RlLmNoaWxkTm9kZXMpO1xuXHR9XG5cblx0aWYgKHRhYlBhbmVscy5sZW5ndGggPCAxKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwia25vYi10YWJzIGNvbXBvbmVudCBzaG91bGQgaGF2ZSBhdCBsZWFzdCBvbmUga25vYi10YWIgY29tcG9uZW50IGFzIGEgY2hpbGQgY29tcG9uZW50IVwiKTtcblx0fVxuXG5cdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRhYkJ1dHRvbnMubGVuZ3RoOyBpZHggKz0gMSkge1xuXHRcdHZhciBhY3QgPSB0YWJCdXR0b25zW2lkeF07XG5cblx0XHRpZiAoIWFjdC5pY29uICYmICFhY3QubGVmdEljb24gJiYgIWFjdC5yaWdodEljb24gJiYgIWFjdC5sYWJlbCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhlIGNoaWxkIGtub2ItdGFiIGNvbXBvbmVudHMgc2hvdWxkIGhhdmUgcHJvcGVyIHBhcmFtcyAoaWNvbiBhbmQvb3IgbGFiZWwpIGp1c3QgbGlrZSB3aXRoIGJ1dHRvbnMhXCIpO1xuXHRcdH1cblx0fVxuXG5cdHZtLnRhYnNHcm91cCA9IFwidGFic0dyb3VwX1wiICsgbmV4dFRhYnNHcm91cElkeDtcblx0bmV4dFRhYnNHcm91cElkeCArPSAxO1xuXG5cdHZtLnNlbGVjdGVkSWR4ID0ga28ub2JzZXJ2YWJsZShkZWZhdWx0VGFiKTtcblxuXHR2bS5idXR0b25zID0gdGFiQnV0dG9ucztcblx0dm0ucGFuZWxzID0gdGFiUGFuZWxzO1xuXG5cdHJldHVybiB2bTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVUYWJzO1xuIl19
