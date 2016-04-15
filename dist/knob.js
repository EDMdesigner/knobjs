(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.knob = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./behaviours/click":2,"./behaviours/focus":3,"./behaviours/hover":4,"./behaviours/select":5}],7:[function(require,module,exports){
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
				"borderColor": theme.success.background,
				"backgroundColor": theme.success.background,
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
},{"tinycolor2":1}],8:[function(require,module,exports){
module.exports = '<button data-bind="css: cssClass,\n					style: style,\n					click: click,\n					event: eventHandlers,\n					disable: state() === \'disabled\'">\n\n	<span class="icon-wrapper" data-bind="if: leftIcon">\n		<svg class="icon">\n			<use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': leftIcon}" xlink:href=""></use>\n		</svg>\n	</span>\n\n	<span class="label" data-bind="text: label"></span>\n\n	<span class="icon-wrapper" data-bind="if: rightIcon">\n		<svg class="icon">\n			<use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': rightIcon}" xlink:href=""></use>\n		</svg>\n	</span>\n</button>';
},{}],9:[function(require,module,exports){
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
},{"tinycolor2":1}],10:[function(require,module,exports){
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
},{"tinycolor2":1}],11:[function(require,module,exports){
module.exports = function createStyleConfig(theme) {

	var tinycolor = require("tinycolor2");

	return {
		"default": {
			"default": {
				"backgroundColor": theme.black,
				"borderColor": theme.black,
				"color": theme.white,
				"fill": theme.white
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
				"backgroundColor": theme.white,
				"borderColor": theme.white,
				"color": theme.black,
				"fill": theme.black
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
				"borderColor": theme.success.background,
				"backgroundColor": theme.success.background,
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
},{"tinycolor2":1}],12:[function(require,module,exports){
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

},{"../base/vm":6}],13:[function(require,module,exports){
/*jslint node: true */
"use strict";

//*/

//THIS FILE SHOULD BE GENERATED

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

	var colorSet = config.colorSet;
	var theme = config.theme;

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
		throw new Error("config.theme should be a function or a string");
	}

	var buttonStyle = createButtonStyle(colorSet);

	registerComponent("knob-button", require("./button/vm"), require("./button/template.html"), buttonStyle);
	registerComponent("knob-input", require("./input/vm"), require("./input/template.html"), createInputStyle(colorSet));
	registerComponent("knob-radio", require("./radio/vm"), require("./radio/template.html"));
	registerComponent("knob-inline-text-editor", require("./inlineTextEditor/vm"), require("./inlineTextEditor/template.html"));
	registerComponent("knob-dropdown", require("./dropdown/vm"), require("./dropdown/template.html"));
	registerComponent("knob-pagination", require("./pagination/vm"), require("./pagination/template.html"), buttonStyle);
	registerComponent("knob-items-per-page", require("./itemsPerPage/vm"), require("./itemsPerPage/template.html"));

	registerComponent("knob-paged-list", require("./pagedList/vm"), require("./pagedList/template.html"), createPagedListStyle(colorSet));

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
},{"./base/vm":6,"./button/style":7,"./button/template.html":8,"./button/theme2":9,"./button/theme3":10,"./button/theme4":11,"./button/vm":12,"./dropdown/template.html":14,"./dropdown/vm":15,"./inlineTextEditor/template.html":16,"./inlineTextEditor/vm":17,"./input/style":18,"./input/template.html":19,"./input/theme2":20,"./input/theme3":21,"./input/theme4":22,"./input/vm":23,"./itemsPerPage/template.html":24,"./itemsPerPage/vm":25,"./knobRegisterComponent":26,"./modal/alert/template.html":28,"./modal/alert/vm":29,"./modal/confirm/template.html":30,"./modal/confirm/vm":31,"./modal/style":32,"./modal/template.html":33,"./modal/theme2":34,"./modal/theme3":35,"./modal/theme4":36,"./modal/vm":37,"./notificationBar/style":38,"./notificationBar/template.html":39,"./notificationBar/theme2":40,"./notificationBar/theme3":41,"./notificationBar/theme4":42,"./notificationBar/vm":43,"./pagedList/style":44,"./pagedList/template.html":45,"./pagedList/theme2":46,"./pagedList/theme3":47,"./pagedList/theme4":48,"./pagedList/vm":49,"./pagination/template.html":50,"./pagination/vm":51,"./radio/template.html":52,"./radio/vm":53,"./tabs/tab/template.html":54,"./tabs/tab/vm":55,"./tabs/template.html":56,"./tabs/vm":57}],14:[function(require,module,exports){
module.exports = '<div class="knob-dropdown">\n	<!-- with params, the selected().label won\'t be recalculated, when selected is changed... -->\n	<div data-bind="component: {\n						name: \'knob-button\',\n						params: {label: selected().label,\n						icon: selected().icon,\n						rightIcon: rightIcon,\n						click: dropdownVisible.toggle}}">\n	</div>\n	<div class="knob-dropdown-menu" data-bind="foreach: options, visible: dropdownVisible">\n		<div data-bind="component: {\n							name: \'knob-button\',\n							params: {label: label, icon: icon, click: select}}, \n							visible: $data !== $parent.selected()">\n		</div>\n	</div>\n</div>\n';
},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
module.exports = '<span>\n	<span data-bind="visible: !editMode()">\n		<span data-bind="text: value"></span>\n		<knob-button params="label: \'\', click: edit, icon: \'#icon-edit\'">\n	</span>\n	<span data-bind="visible: editMode">\n		<knob-input params="value: editedValue, hasFocus: inputHasFocus, keyDown: keyDown, visible: editMode"></knob-input>\n		<knob-button params="label: \'\', click: save, icon: \'#icon-done\'"></knob-button>\n		<knob-button params="label: \'\', click: cancel, icon: \'#icon-close\'"></knob-button>\n	</span>\n</span>';
},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
module.exports = '<input data-bind="css: cssClass,\n					style: style,\n					attr: {type: type, placeholder: placeholder},\n					event: eventHandlers,\n					hasFocus: hasFocus,\n					disable: state() === \'disabled\',\n					value: value,\n					valueUpdate: \'afterkeydown\'" />';
},{}],20:[function(require,module,exports){
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


},{}],21:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],22:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],23:[function(require,module,exports){
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

},{"../base/vm":6}],24:[function(require,module,exports){
module.exports = '<knob-dropdown params="\n	rightIcon: \'#icon-expand-more\',\n	selected: itemsPerPage,\n	items: itemsPerPageList">\n</knob-dropdown>';
},{}],25:[function(require,module,exports){
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

		itemsPerPageList: itemsPerPageList
	};
};

},{}],26:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

function knobRegisterComponent(name, createVm, template, style) {
	ko.components.register(name, {
		viewModel: {
			createViewModel: function(params, componentInfo) {
				params.style = style;
				return createVm(params, componentInfo);
			}
		},
		template: template
	});
}

module.exports = knobRegisterComponent;

},{}],27:[function(require,module,exports){
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

		sortOptions.push({
			icon: "#icon-sort-asc",
			label: act.label,
			value: createQueryObj(act.value, 1)
		});
		sortOptions.push({
			icon: "#icon-sort-desc",
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

},{}],28:[function(require,module,exports){
module.exports = '<div>\n	<knob-modal params="\n		title: title,\n		icon: icon,\n		visible: visible">\n\n		<div class="knob-confirm__content" data-bind="text: message"></div>\n		<div class="knob-confirm__buttons">\n			<knob-button params="\n				label: okLabel,\n				variation: \'primary\',\n				click: ok\n			"></knob-button>\n		</div>\n	</knob-modal>\n</div>\n';
},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
module.exports = '<div class="knob-confirm">\n	<knob-modal params="\n		title: title,\n		icon: icon,\n		visible: visible">\n		<div class="knob-confirm__content" data-bind="text: message"></div>\n		<div class="knob-confirm__buttons">\n			<knob-button params="\n				label: okLabel,\n				variation: \'primary\',\n				click: ok\n			"></knob-button>\n			<knob-button params="\n				label: cancelLabel,\n				click: cancel\n			"></knob-button>\n		</div>\n	</knob-modal>\n</div>\n';
},{}],31:[function(require,module,exports){
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
},{}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
module.exports = '<div class="knob-modal-overlay" data-bind="visible: visible">\n\n	<div class="knob-modal">\n		<div class="knob-modal__header" data-bind="style: style">\n			<knob-button class="button-close" params="variation: \'modalHead\', icon: \'#icon-close\', click: $component.visible.toggle"></knob-button>\n\n			<span class="desc">\n				<svg class="icon">\n					<use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': icon}" xlink:href=""></use>\n				</svg>\n				<span data-bind="text: title"></span>\n			</span>\n\n		</div>\n		<div class="knob-modal__body">\n			<!-- ko template: { nodes: $componentTemplateNodes, data: $parent } --><!-- /ko -->\n		</div>\n	</div>\n</div>\n';
},{}],34:[function(require,module,exports){
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

},{"tinycolor2":1}],35:[function(require,module,exports){
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

},{"tinycolor2":1}],36:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],37:[function(require,module,exports){
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
},{"../base/vm":6}],38:[function(require,module,exports){
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
},{}],39:[function(require,module,exports){
module.exports = '<div class="knob-notification" data-bind="visible: visible, style: style">\n\n	<svg class="icon">\n		<use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': icon}" xlink:href=""></use>\n	</svg>\n	<span data-bind="text: message"></span>\n	<!-- ko template: { nodes: $componentTemplateNodes, data: $parent } --><!-- /ko -->\n</div>';
},{}],40:[function(require,module,exports){
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
},{}],41:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"dup":38}],42:[function(require,module,exports){
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
},{}],43:[function(require,module,exports){
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
},{"../base/vm":6}],44:[function(require,module,exports){
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

},{"tinycolor2":1}],45:[function(require,module,exports){
module.exports = '<div class="knob-pagelist">\n	<!-- ko if: error -->\n		<div data-bind="text: error"></div>\n	<!-- /ko -->\n\n	<div>\n		<div class="knob-pagelist__bar">\n			<input class="knob-input" type="text" data-bind="value: search, valueUpdate: \'afterkeydown\'"/>\n			<knob-button class="knob-button-search" params="label: \'\',\n								variation: \'default\',\n								icon: \'#icon-search\'">\n			</knob-button>\n			<knob-items-per-page class="knob-pagelist__items-per-page" params="numOfItems: count,\n										numOfPages: numOfPages,\n										itemsPerPage: itemsPerPage">\n			</knob-items-per-page>\n			<!-- ko if: sortOptions.length > 0 -->\n				<knob-dropdown class="knob-dropdown" params="rightIcon: \'#icon-expand-more\', selectedIdx: sortIdx, selected: sort, items: sortOptions"></knob-dropdown>\n			<!-- /ko -->\n		</div>\n		<ul data-bind="css: listClass, foreach: items">\n			<li data-bind="css: $parent.itemClass">\n				<!-- ko template: { nodes: $componentTemplateNodes, data: {model: $data, parent: $parent, index: $index} } --><!-- /ko -->\n			</li>\n		</ul>\n	</div>\n\n	<div data-bind="visible: loading">Loading...</div>\n	<!--\n	<knob-pagination params="numOfItems: pagination.numOfItems, itemsPerPage: itemsPerPage"></knob-pagination>\n	-->\n	<!-- ko if: numOfPages() > 0 -->\n		<knob-pagination params="numOfPages: numOfPages, currentPage: currentPage"></knob-pagination>\n	<!-- /ko -->\n	<!-- ko if: $data.loadMore -->\n		<div data-bind="visible: !loading(), click: loadMore">Load more...</div>\n	<!-- /ko -->\n</div>';
},{}],46:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"dup":44,"tinycolor2":1}],47:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"dup":44,"tinycolor2":1}],48:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"dup":44,"tinycolor2":1}],49:[function(require,module,exports){
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

},{"../list/vm":27}],50:[function(require,module,exports){
module.exports = '<div class="knob-pagination" data-bind="if: pageSelectors().length">\n	<span data-bind="component: {\n						name: \'knob-button\',\n						params: {\n							variation: \'pagination\',\n							icon: \'#icon-first-page\',\n							state: first().state,\n							click: first().selectPage\n						}\n					}">\n	</span>\n	<span data-bind="component: {\n						name: \'knob-button\',\n						params: {\n							variation: \'pagination\',\n							icon: \'#icon-chevron-left\',\n							state: prev().state,\n							click: prev().selectPage\n						}\n					}">\n	</span>\n	<span data-bind="foreach: pageSelectors">\n		<knob-button params="label: label,\n							state: state,\n							variation: \'pagination\',\n							click: selectPage"></knob-button>\n	</span>\n	<span data-bind="component: {\n						name: \'knob-button\',\n						params: {\n							variation: \'pagination\',\n							icon: \'#icon-chevron-right\',\n							state: next().state,\n							click: next().selectPage\n						}\n					}">\n	</span>\n	<span data-bind="component: {\n						name: \'knob-button\',\n						params: {\n							variation: \'pagination\',\n							icon: \'#icon-last-page\',\n							state: last().state,\n							click: last().selectPage\n						}\n					}">\n	</span>\n</div>';
},{}],51:[function(require,module,exports){
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

		numOfPages: numOfPages
	};
};

},{}],52:[function(require,module,exports){
module.exports = '<div class="knob-radio" data-bind="foreach: items">\n	<div data-bind="component: {\n		name: \'knob-button\',\n		params: {\n			state: isSelected() ? \'active\' : \'default\',\n			variation: $parent.variation,\n			label: label,\n			icon: icon,\n			radio: true,\n			group: group,\n			click: select\n		}\n	}">\n	</div>\n</div>\n';
},{}],53:[function(require,module,exports){
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

},{}],54:[function(require,module,exports){
module.exports = '<div data-bind="css: cssClass,\n					style: style">\n	<!-- ko template: { nodes: $componentTemplateNodes, data: $parent } --><!-- /ko -->\n</div>';
},{}],55:[function(require,module,exports){
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

},{"../../base/vm":6}],56:[function(require,module,exports){
module.exports = '<div>\n	<knob-radio class="knob-radio--inline" params="\n		group: tabsGroup,\n		variation: \'tab\',\n		selectedIdx: selectedIdx,\n		items: buttons">\n	</knob-radio>\n\n	<div data-bind="foreach: panels">\n		<knob-tab data-bind="visible: $parent.selectedIdx() == $index()">\n			<!-- ko template: { nodes: $data } --><!-- /ko -->\n		</knob-tab>\n	</div>\n</div>';
},{}],57:[function(require,module,exports){
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

},{}]},{},[13])(13)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvdGlueWNvbG9yMi90aW55Y29sb3IuanMiLCJzcmMvYmFzZS9iZWhhdmlvdXJzL2NsaWNrLmpzIiwic3JjL2Jhc2UvYmVoYXZpb3Vycy9mb2N1cy5qcyIsInNyYy9iYXNlL2JlaGF2aW91cnMvaG92ZXIuanMiLCJzcmMvYmFzZS9iZWhhdmlvdXJzL3NlbGVjdC5qcyIsInNyYy9iYXNlL3ZtLmpzIiwic3JjL2J1dHRvbi9zdHlsZS5qcyIsInNyYy9idXR0b24vdGVtcGxhdGUuaHRtbCIsInNyYy9idXR0b24vdGhlbWUyLmpzIiwic3JjL2J1dHRvbi90aGVtZTMuanMiLCJzcmMvYnV0dG9uL3RoZW1lNC5qcyIsInNyYy9idXR0b24vdm0uanMiLCJzcmMvY29tcG9uZW50cy5qcyIsInNyYy9kcm9wZG93bi90ZW1wbGF0ZS5odG1sIiwic3JjL2Ryb3Bkb3duL3ZtLmpzIiwic3JjL2lubGluZVRleHRFZGl0b3IvdGVtcGxhdGUuaHRtbCIsInNyYy9pbmxpbmVUZXh0RWRpdG9yL3ZtLmpzIiwic3JjL2lucHV0L3N0eWxlLmpzIiwic3JjL2lucHV0L3RlbXBsYXRlLmh0bWwiLCJzcmMvaW5wdXQvdGhlbWUyLmpzIiwic3JjL2lucHV0L3ZtLmpzIiwic3JjL2l0ZW1zUGVyUGFnZS90ZW1wbGF0ZS5odG1sIiwic3JjL2l0ZW1zUGVyUGFnZS92bS5qcyIsInNyYy9rbm9iUmVnaXN0ZXJDb21wb25lbnQuanMiLCJzcmMvbGlzdC92bS5qcyIsInNyYy9tb2RhbC9hbGVydC90ZW1wbGF0ZS5odG1sIiwic3JjL21vZGFsL2FsZXJ0L3ZtLmpzIiwic3JjL21vZGFsL2NvbmZpcm0vdGVtcGxhdGUuaHRtbCIsInNyYy9tb2RhbC9jb25maXJtL3ZtLmpzIiwic3JjL21vZGFsL3N0eWxlLmpzIiwic3JjL21vZGFsL3RlbXBsYXRlLmh0bWwiLCJzcmMvbW9kYWwvdGhlbWUyLmpzIiwic3JjL21vZGFsL3RoZW1lMy5qcyIsInNyYy9tb2RhbC92bS5qcyIsInNyYy9ub3RpZmljYXRpb25CYXIvc3R5bGUuanMiLCJzcmMvbm90aWZpY2F0aW9uQmFyL3RlbXBsYXRlLmh0bWwiLCJzcmMvbm90aWZpY2F0aW9uQmFyL3RoZW1lMi5qcyIsInNyYy9ub3RpZmljYXRpb25CYXIvdGhlbWU0LmpzIiwic3JjL25vdGlmaWNhdGlvbkJhci92bS5qcyIsInNyYy9wYWdlZExpc3Qvc3R5bGUuanMiLCJzcmMvcGFnZWRMaXN0L3RlbXBsYXRlLmh0bWwiLCJzcmMvcGFnZWRMaXN0L3ZtLmpzIiwic3JjL3BhZ2luYXRpb24vdGVtcGxhdGUuaHRtbCIsInNyYy9wYWdpbmF0aW9uL3ZtLmpzIiwic3JjL3JhZGlvL3RlbXBsYXRlLmh0bWwiLCJzcmMvcmFkaW8vdm0uanMiLCJzcmMvdGFicy90YWIvdGVtcGxhdGUuaHRtbCIsInNyYy90YWJzL3RhYi92bS5qcyIsInNyYy90YWJzL3RlbXBsYXRlLmh0bWwiLCJzcmMvdGFicy92bS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5b0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZNQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlNQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xMQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIFRpbnlDb2xvciB2MS4zLjBcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9iZ3JpbnMvVGlueUNvbG9yXG4vLyBCcmlhbiBHcmluc3RlYWQsIE1JVCBMaWNlbnNlXG5cbihmdW5jdGlvbigpIHtcblxudmFyIHRyaW1MZWZ0ID0gL15cXHMrLyxcbiAgICB0cmltUmlnaHQgPSAvXFxzKyQvLFxuICAgIHRpbnlDb3VudGVyID0gMCxcbiAgICBtYXRoID0gTWF0aCxcbiAgICBtYXRoUm91bmQgPSBtYXRoLnJvdW5kLFxuICAgIG1hdGhNaW4gPSBtYXRoLm1pbixcbiAgICBtYXRoTWF4ID0gbWF0aC5tYXgsXG4gICAgbWF0aFJhbmRvbSA9IG1hdGgucmFuZG9tO1xuXG5mdW5jdGlvbiB0aW55Y29sb3IgKGNvbG9yLCBvcHRzKSB7XG5cbiAgICBjb2xvciA9IChjb2xvcikgPyBjb2xvciA6ICcnO1xuICAgIG9wdHMgPSBvcHRzIHx8IHsgfTtcblxuICAgIC8vIElmIGlucHV0IGlzIGFscmVhZHkgYSB0aW55Y29sb3IsIHJldHVybiBpdHNlbGZcbiAgICBpZiAoY29sb3IgaW5zdGFuY2VvZiB0aW55Y29sb3IpIHtcbiAgICAgICByZXR1cm4gY29sb3I7XG4gICAgfVxuICAgIC8vIElmIHdlIGFyZSBjYWxsZWQgYXMgYSBmdW5jdGlvbiwgY2FsbCB1c2luZyBuZXcgaW5zdGVhZFxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiB0aW55Y29sb3IpKSB7XG4gICAgICAgIHJldHVybiBuZXcgdGlueWNvbG9yKGNvbG9yLCBvcHRzKTtcbiAgICB9XG5cbiAgICB2YXIgcmdiID0gaW5wdXRUb1JHQihjb2xvcik7XG4gICAgdGhpcy5fb3JpZ2luYWxJbnB1dCA9IGNvbG9yLFxuICAgIHRoaXMuX3IgPSByZ2IucixcbiAgICB0aGlzLl9nID0gcmdiLmcsXG4gICAgdGhpcy5fYiA9IHJnYi5iLFxuICAgIHRoaXMuX2EgPSByZ2IuYSxcbiAgICB0aGlzLl9yb3VuZEEgPSBtYXRoUm91bmQoMTAwKnRoaXMuX2EpIC8gMTAwLFxuICAgIHRoaXMuX2Zvcm1hdCA9IG9wdHMuZm9ybWF0IHx8IHJnYi5mb3JtYXQ7XG4gICAgdGhpcy5fZ3JhZGllbnRUeXBlID0gb3B0cy5ncmFkaWVudFR5cGU7XG5cbiAgICAvLyBEb24ndCBsZXQgdGhlIHJhbmdlIG9mIFswLDI1NV0gY29tZSBiYWNrIGluIFswLDFdLlxuICAgIC8vIFBvdGVudGlhbGx5IGxvc2UgYSBsaXR0bGUgYml0IG9mIHByZWNpc2lvbiBoZXJlLCBidXQgd2lsbCBmaXggaXNzdWVzIHdoZXJlXG4gICAgLy8gLjUgZ2V0cyBpbnRlcnByZXRlZCBhcyBoYWxmIG9mIHRoZSB0b3RhbCwgaW5zdGVhZCBvZiBoYWxmIG9mIDFcbiAgICAvLyBJZiBpdCB3YXMgc3VwcG9zZWQgdG8gYmUgMTI4LCB0aGlzIHdhcyBhbHJlYWR5IHRha2VuIGNhcmUgb2YgYnkgYGlucHV0VG9SZ2JgXG4gICAgaWYgKHRoaXMuX3IgPCAxKSB7IHRoaXMuX3IgPSBtYXRoUm91bmQodGhpcy5fcik7IH1cbiAgICBpZiAodGhpcy5fZyA8IDEpIHsgdGhpcy5fZyA9IG1hdGhSb3VuZCh0aGlzLl9nKTsgfVxuICAgIGlmICh0aGlzLl9iIDwgMSkgeyB0aGlzLl9iID0gbWF0aFJvdW5kKHRoaXMuX2IpOyB9XG5cbiAgICB0aGlzLl9vayA9IHJnYi5vaztcbiAgICB0aGlzLl90Y19pZCA9IHRpbnlDb3VudGVyKys7XG59XG5cbnRpbnljb2xvci5wcm90b3R5cGUgPSB7XG4gICAgaXNEYXJrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QnJpZ2h0bmVzcygpIDwgMTI4O1xuICAgIH0sXG4gICAgaXNMaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5pc0RhcmsoKTtcbiAgICB9LFxuICAgIGlzVmFsaWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb2s7XG4gICAgfSxcbiAgICBnZXRPcmlnaW5hbElucHV0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9vcmlnaW5hbElucHV0O1xuICAgIH0sXG4gICAgZ2V0Rm9ybWF0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Zvcm1hdDtcbiAgICB9LFxuICAgIGdldEFscGhhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2E7XG4gICAgfSxcbiAgICBnZXRCcmlnaHRuZXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy9odHRwOi8vd3d3LnczLm9yZy9UUi9BRVJUI2NvbG9yLWNvbnRyYXN0XG4gICAgICAgIHZhciByZ2IgPSB0aGlzLnRvUmdiKCk7XG4gICAgICAgIHJldHVybiAocmdiLnIgKiAyOTkgKyByZ2IuZyAqIDU4NyArIHJnYi5iICogMTE0KSAvIDEwMDA7XG4gICAgfSxcbiAgICBnZXRMdW1pbmFuY2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvL2h0dHA6Ly93d3cudzMub3JnL1RSLzIwMDgvUkVDLVdDQUcyMC0yMDA4MTIxMS8jcmVsYXRpdmVsdW1pbmFuY2VkZWZcbiAgICAgICAgdmFyIHJnYiA9IHRoaXMudG9SZ2IoKTtcbiAgICAgICAgdmFyIFJzUkdCLCBHc1JHQiwgQnNSR0IsIFIsIEcsIEI7XG4gICAgICAgIFJzUkdCID0gcmdiLnIvMjU1O1xuICAgICAgICBHc1JHQiA9IHJnYi5nLzI1NTtcbiAgICAgICAgQnNSR0IgPSByZ2IuYi8yNTU7XG5cbiAgICAgICAgaWYgKFJzUkdCIDw9IDAuMDM5MjgpIHtSID0gUnNSR0IgLyAxMi45Mjt9IGVsc2Uge1IgPSBNYXRoLnBvdygoKFJzUkdCICsgMC4wNTUpIC8gMS4wNTUpLCAyLjQpO31cbiAgICAgICAgaWYgKEdzUkdCIDw9IDAuMDM5MjgpIHtHID0gR3NSR0IgLyAxMi45Mjt9IGVsc2Uge0cgPSBNYXRoLnBvdygoKEdzUkdCICsgMC4wNTUpIC8gMS4wNTUpLCAyLjQpO31cbiAgICAgICAgaWYgKEJzUkdCIDw9IDAuMDM5MjgpIHtCID0gQnNSR0IgLyAxMi45Mjt9IGVsc2Uge0IgPSBNYXRoLnBvdygoKEJzUkdCICsgMC4wNTUpIC8gMS4wNTUpLCAyLjQpO31cbiAgICAgICAgcmV0dXJuICgwLjIxMjYgKiBSKSArICgwLjcxNTIgKiBHKSArICgwLjA3MjIgKiBCKTtcbiAgICB9LFxuICAgIHNldEFscGhhOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICB0aGlzLl9hID0gYm91bmRBbHBoYSh2YWx1ZSk7XG4gICAgICAgIHRoaXMuX3JvdW5kQSA9IG1hdGhSb3VuZCgxMDAqdGhpcy5fYSkgLyAxMDA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgdG9Ic3Y6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaHN2ID0gcmdiVG9Ic3YodGhpcy5fciwgdGhpcy5fZywgdGhpcy5fYik7XG4gICAgICAgIHJldHVybiB7IGg6IGhzdi5oICogMzYwLCBzOiBoc3YucywgdjogaHN2LnYsIGE6IHRoaXMuX2EgfTtcbiAgICB9LFxuICAgIHRvSHN2U3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGhzdiA9IHJnYlRvSHN2KHRoaXMuX3IsIHRoaXMuX2csIHRoaXMuX2IpO1xuICAgICAgICB2YXIgaCA9IG1hdGhSb3VuZChoc3YuaCAqIDM2MCksIHMgPSBtYXRoUm91bmQoaHN2LnMgKiAxMDApLCB2ID0gbWF0aFJvdW5kKGhzdi52ICogMTAwKTtcbiAgICAgICAgcmV0dXJuICh0aGlzLl9hID09IDEpID9cbiAgICAgICAgICBcImhzdihcIiAgKyBoICsgXCIsIFwiICsgcyArIFwiJSwgXCIgKyB2ICsgXCIlKVwiIDpcbiAgICAgICAgICBcImhzdmEoXCIgKyBoICsgXCIsIFwiICsgcyArIFwiJSwgXCIgKyB2ICsgXCIlLCBcIisgdGhpcy5fcm91bmRBICsgXCIpXCI7XG4gICAgfSxcbiAgICB0b0hzbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoc2wgPSByZ2JUb0hzbCh0aGlzLl9yLCB0aGlzLl9nLCB0aGlzLl9iKTtcbiAgICAgICAgcmV0dXJuIHsgaDogaHNsLmggKiAzNjAsIHM6IGhzbC5zLCBsOiBoc2wubCwgYTogdGhpcy5fYSB9O1xuICAgIH0sXG4gICAgdG9Ic2xTdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaHNsID0gcmdiVG9Ic2wodGhpcy5fciwgdGhpcy5fZywgdGhpcy5fYik7XG4gICAgICAgIHZhciBoID0gbWF0aFJvdW5kKGhzbC5oICogMzYwKSwgcyA9IG1hdGhSb3VuZChoc2wucyAqIDEwMCksIGwgPSBtYXRoUm91bmQoaHNsLmwgKiAxMDApO1xuICAgICAgICByZXR1cm4gKHRoaXMuX2EgPT0gMSkgP1xuICAgICAgICAgIFwiaHNsKFwiICArIGggKyBcIiwgXCIgKyBzICsgXCIlLCBcIiArIGwgKyBcIiUpXCIgOlxuICAgICAgICAgIFwiaHNsYShcIiArIGggKyBcIiwgXCIgKyBzICsgXCIlLCBcIiArIGwgKyBcIiUsIFwiKyB0aGlzLl9yb3VuZEEgKyBcIilcIjtcbiAgICB9LFxuICAgIHRvSGV4OiBmdW5jdGlvbihhbGxvdzNDaGFyKSB7XG4gICAgICAgIHJldHVybiByZ2JUb0hleCh0aGlzLl9yLCB0aGlzLl9nLCB0aGlzLl9iLCBhbGxvdzNDaGFyKTtcbiAgICB9LFxuICAgIHRvSGV4U3RyaW5nOiBmdW5jdGlvbihhbGxvdzNDaGFyKSB7XG4gICAgICAgIHJldHVybiAnIycgKyB0aGlzLnRvSGV4KGFsbG93M0NoYXIpO1xuICAgIH0sXG4gICAgdG9IZXg4OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHJnYmFUb0hleCh0aGlzLl9yLCB0aGlzLl9nLCB0aGlzLl9iLCB0aGlzLl9hKTtcbiAgICB9LFxuICAgIHRvSGV4OFN0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAnIycgKyB0aGlzLnRvSGV4OCgpO1xuICAgIH0sXG4gICAgdG9SZ2I6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4geyByOiBtYXRoUm91bmQodGhpcy5fciksIGc6IG1hdGhSb3VuZCh0aGlzLl9nKSwgYjogbWF0aFJvdW5kKHRoaXMuX2IpLCBhOiB0aGlzLl9hIH07XG4gICAgfSxcbiAgICB0b1JnYlN0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5fYSA9PSAxKSA/XG4gICAgICAgICAgXCJyZ2IoXCIgICsgbWF0aFJvdW5kKHRoaXMuX3IpICsgXCIsIFwiICsgbWF0aFJvdW5kKHRoaXMuX2cpICsgXCIsIFwiICsgbWF0aFJvdW5kKHRoaXMuX2IpICsgXCIpXCIgOlxuICAgICAgICAgIFwicmdiYShcIiArIG1hdGhSb3VuZCh0aGlzLl9yKSArIFwiLCBcIiArIG1hdGhSb3VuZCh0aGlzLl9nKSArIFwiLCBcIiArIG1hdGhSb3VuZCh0aGlzLl9iKSArIFwiLCBcIiArIHRoaXMuX3JvdW5kQSArIFwiKVwiO1xuICAgIH0sXG4gICAgdG9QZXJjZW50YWdlUmdiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHsgcjogbWF0aFJvdW5kKGJvdW5kMDEodGhpcy5fciwgMjU1KSAqIDEwMCkgKyBcIiVcIiwgZzogbWF0aFJvdW5kKGJvdW5kMDEodGhpcy5fZywgMjU1KSAqIDEwMCkgKyBcIiVcIiwgYjogbWF0aFJvdW5kKGJvdW5kMDEodGhpcy5fYiwgMjU1KSAqIDEwMCkgKyBcIiVcIiwgYTogdGhpcy5fYSB9O1xuICAgIH0sXG4gICAgdG9QZXJjZW50YWdlUmdiU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLl9hID09IDEpID9cbiAgICAgICAgICBcInJnYihcIiAgKyBtYXRoUm91bmQoYm91bmQwMSh0aGlzLl9yLCAyNTUpICogMTAwKSArIFwiJSwgXCIgKyBtYXRoUm91bmQoYm91bmQwMSh0aGlzLl9nLCAyNTUpICogMTAwKSArIFwiJSwgXCIgKyBtYXRoUm91bmQoYm91bmQwMSh0aGlzLl9iLCAyNTUpICogMTAwKSArIFwiJSlcIiA6XG4gICAgICAgICAgXCJyZ2JhKFwiICsgbWF0aFJvdW5kKGJvdW5kMDEodGhpcy5fciwgMjU1KSAqIDEwMCkgKyBcIiUsIFwiICsgbWF0aFJvdW5kKGJvdW5kMDEodGhpcy5fZywgMjU1KSAqIDEwMCkgKyBcIiUsIFwiICsgbWF0aFJvdW5kKGJvdW5kMDEodGhpcy5fYiwgMjU1KSAqIDEwMCkgKyBcIiUsIFwiICsgdGhpcy5fcm91bmRBICsgXCIpXCI7XG4gICAgfSxcbiAgICB0b05hbWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5fYSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNwYXJlbnRcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9hIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGhleE5hbWVzW3JnYlRvSGV4KHRoaXMuX3IsIHRoaXMuX2csIHRoaXMuX2IsIHRydWUpXSB8fCBmYWxzZTtcbiAgICB9LFxuICAgIHRvRmlsdGVyOiBmdW5jdGlvbihzZWNvbmRDb2xvcikge1xuICAgICAgICB2YXIgaGV4OFN0cmluZyA9ICcjJyArIHJnYmFUb0hleCh0aGlzLl9yLCB0aGlzLl9nLCB0aGlzLl9iLCB0aGlzLl9hKTtcbiAgICAgICAgdmFyIHNlY29uZEhleDhTdHJpbmcgPSBoZXg4U3RyaW5nO1xuICAgICAgICB2YXIgZ3JhZGllbnRUeXBlID0gdGhpcy5fZ3JhZGllbnRUeXBlID8gXCJHcmFkaWVudFR5cGUgPSAxLCBcIiA6IFwiXCI7XG5cbiAgICAgICAgaWYgKHNlY29uZENvbG9yKSB7XG4gICAgICAgICAgICB2YXIgcyA9IHRpbnljb2xvcihzZWNvbmRDb2xvcik7XG4gICAgICAgICAgICBzZWNvbmRIZXg4U3RyaW5nID0gcy50b0hleDhTdHJpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBcInByb2dpZDpEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5ncmFkaWVudChcIitncmFkaWVudFR5cGUrXCJzdGFydENvbG9yc3RyPVwiK2hleDhTdHJpbmcrXCIsZW5kQ29sb3JzdHI9XCIrc2Vjb25kSGV4OFN0cmluZytcIilcIjtcbiAgICB9LFxuICAgIHRvU3RyaW5nOiBmdW5jdGlvbihmb3JtYXQpIHtcbiAgICAgICAgdmFyIGZvcm1hdFNldCA9ICEhZm9ybWF0O1xuICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgdGhpcy5fZm9ybWF0O1xuXG4gICAgICAgIHZhciBmb3JtYXR0ZWRTdHJpbmcgPSBmYWxzZTtcbiAgICAgICAgdmFyIGhhc0FscGhhID0gdGhpcy5fYSA8IDEgJiYgdGhpcy5fYSA+PSAwO1xuICAgICAgICB2YXIgbmVlZHNBbHBoYUZvcm1hdCA9ICFmb3JtYXRTZXQgJiYgaGFzQWxwaGEgJiYgKGZvcm1hdCA9PT0gXCJoZXhcIiB8fCBmb3JtYXQgPT09IFwiaGV4NlwiIHx8IGZvcm1hdCA9PT0gXCJoZXgzXCIgfHwgZm9ybWF0ID09PSBcIm5hbWVcIik7XG5cbiAgICAgICAgaWYgKG5lZWRzQWxwaGFGb3JtYXQpIHtcbiAgICAgICAgICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgXCJ0cmFuc3BhcmVudFwiLCBhbGwgb3RoZXIgbm9uLWFscGhhIGZvcm1hdHNcbiAgICAgICAgICAgIC8vIHdpbGwgcmV0dXJuIHJnYmEgd2hlbiB0aGVyZSBpcyB0cmFuc3BhcmVuY3kuXG4gICAgICAgICAgICBpZiAoZm9ybWF0ID09PSBcIm5hbWVcIiAmJiB0aGlzLl9hID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9OYW1lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b1JnYlN0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT09IFwicmdiXCIpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9SZ2JTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSBcInByZ2JcIikge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b1BlcmNlbnRhZ2VSZ2JTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSBcImhleFwiIHx8IGZvcm1hdCA9PT0gXCJoZXg2XCIpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9IZXhTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSBcImhleDNcIikge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b0hleFN0cmluZyh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSBcImhleDhcIikge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b0hleDhTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSBcIm5hbWVcIikge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b05hbWUoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSBcImhzbFwiKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWRTdHJpbmcgPSB0aGlzLnRvSHNsU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJoc3ZcIikge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b0hzdlN0cmluZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvcm1hdHRlZFN0cmluZyB8fCB0aGlzLnRvSGV4U3RyaW5nKCk7XG4gICAgfSxcbiAgICBjbG9uZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aW55Y29sb3IodGhpcy50b1N0cmluZygpKTtcbiAgICB9LFxuXG4gICAgX2FwcGx5TW9kaWZpY2F0aW9uOiBmdW5jdGlvbihmbiwgYXJncykge1xuICAgICAgICB2YXIgY29sb3IgPSBmbi5hcHBseShudWxsLCBbdGhpc10uY29uY2F0KFtdLnNsaWNlLmNhbGwoYXJncykpKTtcbiAgICAgICAgdGhpcy5fciA9IGNvbG9yLl9yO1xuICAgICAgICB0aGlzLl9nID0gY29sb3IuX2c7XG4gICAgICAgIHRoaXMuX2IgPSBjb2xvci5fYjtcbiAgICAgICAgdGhpcy5zZXRBbHBoYShjb2xvci5fYSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgbGlnaHRlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseU1vZGlmaWNhdGlvbihsaWdodGVuLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgYnJpZ2h0ZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlNb2RpZmljYXRpb24oYnJpZ2h0ZW4sIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBkYXJrZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlNb2RpZmljYXRpb24oZGFya2VuLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgZGVzYXR1cmF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseU1vZGlmaWNhdGlvbihkZXNhdHVyYXRlLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgc2F0dXJhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlNb2RpZmljYXRpb24oc2F0dXJhdGUsIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBncmV5c2NhbGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlNb2RpZmljYXRpb24oZ3JleXNjYWxlLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgc3BpbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseU1vZGlmaWNhdGlvbihzcGluLCBhcmd1bWVudHMpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlDb21iaW5hdGlvbjogZnVuY3Rpb24oZm4sIGFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KG51bGwsIFt0aGlzXS5jb25jYXQoW10uc2xpY2UuY2FsbChhcmdzKSkpO1xuICAgIH0sXG4gICAgYW5hbG9nb3VzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5Q29tYmluYXRpb24oYW5hbG9nb3VzLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgY29tcGxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseUNvbWJpbmF0aW9uKGNvbXBsZW1lbnQsIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBtb25vY2hyb21hdGljOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5Q29tYmluYXRpb24obW9ub2Nocm9tYXRpYywgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIHNwbGl0Y29tcGxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseUNvbWJpbmF0aW9uKHNwbGl0Y29tcGxlbWVudCwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIHRyaWFkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5Q29tYmluYXRpb24odHJpYWQsIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICB0ZXRyYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlDb21iaW5hdGlvbih0ZXRyYWQsIGFyZ3VtZW50cyk7XG4gICAgfVxufTtcblxuLy8gSWYgaW5wdXQgaXMgYW4gb2JqZWN0LCBmb3JjZSAxIGludG8gXCIxLjBcIiB0byBoYW5kbGUgcmF0aW9zIHByb3Blcmx5XG4vLyBTdHJpbmcgaW5wdXQgcmVxdWlyZXMgXCIxLjBcIiBhcyBpbnB1dCwgc28gMSB3aWxsIGJlIHRyZWF0ZWQgYXMgMVxudGlueWNvbG9yLmZyb21SYXRpbyA9IGZ1bmN0aW9uKGNvbG9yLCBvcHRzKSB7XG4gICAgaWYgKHR5cGVvZiBjb2xvciA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHZhciBuZXdDb2xvciA9IHt9O1xuICAgICAgICBmb3IgKHZhciBpIGluIGNvbG9yKSB7XG4gICAgICAgICAgICBpZiAoY29sb3IuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gXCJhXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3Q29sb3JbaV0gPSBjb2xvcltpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0NvbG9yW2ldID0gY29udmVydFRvUGVyY2VudGFnZShjb2xvcltpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbG9yID0gbmV3Q29sb3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRpbnljb2xvcihjb2xvciwgb3B0cyk7XG59O1xuXG4vLyBHaXZlbiBhIHN0cmluZyBvciBvYmplY3QsIGNvbnZlcnQgdGhhdCBpbnB1dCB0byBSR0Jcbi8vIFBvc3NpYmxlIHN0cmluZyBpbnB1dHM6XG4vL1xuLy8gICAgIFwicmVkXCJcbi8vICAgICBcIiNmMDBcIiBvciBcImYwMFwiXG4vLyAgICAgXCIjZmYwMDAwXCIgb3IgXCJmZjAwMDBcIlxuLy8gICAgIFwiI2ZmMDAwMDAwXCIgb3IgXCJmZjAwMDAwMFwiXG4vLyAgICAgXCJyZ2IgMjU1IDAgMFwiIG9yIFwicmdiICgyNTUsIDAsIDApXCJcbi8vICAgICBcInJnYiAxLjAgMCAwXCIgb3IgXCJyZ2IgKDEsIDAsIDApXCJcbi8vICAgICBcInJnYmEgKDI1NSwgMCwgMCwgMSlcIiBvciBcInJnYmEgMjU1LCAwLCAwLCAxXCJcbi8vICAgICBcInJnYmEgKDEuMCwgMCwgMCwgMSlcIiBvciBcInJnYmEgMS4wLCAwLCAwLCAxXCJcbi8vICAgICBcImhzbCgwLCAxMDAlLCA1MCUpXCIgb3IgXCJoc2wgMCAxMDAlIDUwJVwiXG4vLyAgICAgXCJoc2xhKDAsIDEwMCUsIDUwJSwgMSlcIiBvciBcImhzbGEgMCAxMDAlIDUwJSwgMVwiXG4vLyAgICAgXCJoc3YoMCwgMTAwJSwgMTAwJSlcIiBvciBcImhzdiAwIDEwMCUgMTAwJVwiXG4vL1xuZnVuY3Rpb24gaW5wdXRUb1JHQihjb2xvcikge1xuXG4gICAgdmFyIHJnYiA9IHsgcjogMCwgZzogMCwgYjogMCB9O1xuICAgIHZhciBhID0gMTtcbiAgICB2YXIgb2sgPSBmYWxzZTtcbiAgICB2YXIgZm9ybWF0ID0gZmFsc2U7XG5cbiAgICBpZiAodHlwZW9mIGNvbG9yID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgY29sb3IgPSBzdHJpbmdJbnB1dFRvT2JqZWN0KGNvbG9yKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNvbG9yID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgaWYgKGNvbG9yLmhhc093blByb3BlcnR5KFwiclwiKSAmJiBjb2xvci5oYXNPd25Qcm9wZXJ0eShcImdcIikgJiYgY29sb3IuaGFzT3duUHJvcGVydHkoXCJiXCIpKSB7XG4gICAgICAgICAgICByZ2IgPSByZ2JUb1JnYihjb2xvci5yLCBjb2xvci5nLCBjb2xvci5iKTtcbiAgICAgICAgICAgIG9rID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvcm1hdCA9IFN0cmluZyhjb2xvci5yKS5zdWJzdHIoLTEpID09PSBcIiVcIiA/IFwicHJnYlwiIDogXCJyZ2JcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb2xvci5oYXNPd25Qcm9wZXJ0eShcImhcIikgJiYgY29sb3IuaGFzT3duUHJvcGVydHkoXCJzXCIpICYmIGNvbG9yLmhhc093blByb3BlcnR5KFwidlwiKSkge1xuICAgICAgICAgICAgY29sb3IucyA9IGNvbnZlcnRUb1BlcmNlbnRhZ2UoY29sb3Iucyk7XG4gICAgICAgICAgICBjb2xvci52ID0gY29udmVydFRvUGVyY2VudGFnZShjb2xvci52KTtcbiAgICAgICAgICAgIHJnYiA9IGhzdlRvUmdiKGNvbG9yLmgsIGNvbG9yLnMsIGNvbG9yLnYpO1xuICAgICAgICAgICAgb2sgPSB0cnVlO1xuICAgICAgICAgICAgZm9ybWF0ID0gXCJoc3ZcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb2xvci5oYXNPd25Qcm9wZXJ0eShcImhcIikgJiYgY29sb3IuaGFzT3duUHJvcGVydHkoXCJzXCIpICYmIGNvbG9yLmhhc093blByb3BlcnR5KFwibFwiKSkge1xuICAgICAgICAgICAgY29sb3IucyA9IGNvbnZlcnRUb1BlcmNlbnRhZ2UoY29sb3Iucyk7XG4gICAgICAgICAgICBjb2xvci5sID0gY29udmVydFRvUGVyY2VudGFnZShjb2xvci5sKTtcbiAgICAgICAgICAgIHJnYiA9IGhzbFRvUmdiKGNvbG9yLmgsIGNvbG9yLnMsIGNvbG9yLmwpO1xuICAgICAgICAgICAgb2sgPSB0cnVlO1xuICAgICAgICAgICAgZm9ybWF0ID0gXCJoc2xcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb2xvci5oYXNPd25Qcm9wZXJ0eShcImFcIikpIHtcbiAgICAgICAgICAgIGEgPSBjb2xvci5hO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYSA9IGJvdW5kQWxwaGEoYSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBvazogb2ssXG4gICAgICAgIGZvcm1hdDogY29sb3IuZm9ybWF0IHx8IGZvcm1hdCxcbiAgICAgICAgcjogbWF0aE1pbigyNTUsIG1hdGhNYXgocmdiLnIsIDApKSxcbiAgICAgICAgZzogbWF0aE1pbigyNTUsIG1hdGhNYXgocmdiLmcsIDApKSxcbiAgICAgICAgYjogbWF0aE1pbigyNTUsIG1hdGhNYXgocmdiLmIsIDApKSxcbiAgICAgICAgYTogYVxuICAgIH07XG59XG5cblxuLy8gQ29udmVyc2lvbiBGdW5jdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIGByZ2JUb0hzbGAsIGByZ2JUb0hzdmAsIGBoc2xUb1JnYmAsIGBoc3ZUb1JnYmAgbW9kaWZpZWQgZnJvbTpcbi8vIDxodHRwOi8vbWppamFja3Nvbi5jb20vMjAwOC8wMi9yZ2ItdG8taHNsLWFuZC1yZ2ItdG8taHN2LWNvbG9yLW1vZGVsLWNvbnZlcnNpb24tYWxnb3JpdGhtcy1pbi1qYXZhc2NyaXB0PlxuXG4vLyBgcmdiVG9SZ2JgXG4vLyBIYW5kbGUgYm91bmRzIC8gcGVyY2VudGFnZSBjaGVja2luZyB0byBjb25mb3JtIHRvIENTUyBjb2xvciBzcGVjXG4vLyA8aHR0cDovL3d3dy53My5vcmcvVFIvY3NzMy1jb2xvci8+XG4vLyAqQXNzdW1lczoqIHIsIGcsIGIgaW4gWzAsIDI1NV0gb3IgWzAsIDFdXG4vLyAqUmV0dXJuczoqIHsgciwgZywgYiB9IGluIFswLCAyNTVdXG5mdW5jdGlvbiByZ2JUb1JnYihyLCBnLCBiKXtcbiAgICByZXR1cm4ge1xuICAgICAgICByOiBib3VuZDAxKHIsIDI1NSkgKiAyNTUsXG4gICAgICAgIGc6IGJvdW5kMDEoZywgMjU1KSAqIDI1NSxcbiAgICAgICAgYjogYm91bmQwMShiLCAyNTUpICogMjU1XG4gICAgfTtcbn1cblxuLy8gYHJnYlRvSHNsYFxuLy8gQ29udmVydHMgYW4gUkdCIGNvbG9yIHZhbHVlIHRvIEhTTC5cbi8vICpBc3N1bWVzOiogciwgZywgYW5kIGIgYXJlIGNvbnRhaW5lZCBpbiBbMCwgMjU1XSBvciBbMCwgMV1cbi8vICpSZXR1cm5zOiogeyBoLCBzLCBsIH0gaW4gWzAsMV1cbmZ1bmN0aW9uIHJnYlRvSHNsKHIsIGcsIGIpIHtcblxuICAgIHIgPSBib3VuZDAxKHIsIDI1NSk7XG4gICAgZyA9IGJvdW5kMDEoZywgMjU1KTtcbiAgICBiID0gYm91bmQwMShiLCAyNTUpO1xuXG4gICAgdmFyIG1heCA9IG1hdGhNYXgociwgZywgYiksIG1pbiA9IG1hdGhNaW4ociwgZywgYik7XG4gICAgdmFyIGgsIHMsIGwgPSAobWF4ICsgbWluKSAvIDI7XG5cbiAgICBpZihtYXggPT0gbWluKSB7XG4gICAgICAgIGggPSBzID0gMDsgLy8gYWNocm9tYXRpY1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIGQgPSBtYXggLSBtaW47XG4gICAgICAgIHMgPSBsID4gMC41ID8gZCAvICgyIC0gbWF4IC0gbWluKSA6IGQgLyAobWF4ICsgbWluKTtcbiAgICAgICAgc3dpdGNoKG1heCkge1xuICAgICAgICAgICAgY2FzZSByOiBoID0gKGcgLSBiKSAvIGQgKyAoZyA8IGIgPyA2IDogMCk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBnOiBoID0gKGIgLSByKSAvIGQgKyAyOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgYjogaCA9IChyIC0gZykgLyBkICsgNDsgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBoIC89IDY7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgaDogaCwgczogcywgbDogbCB9O1xufVxuXG4vLyBgaHNsVG9SZ2JgXG4vLyBDb252ZXJ0cyBhbiBIU0wgY29sb3IgdmFsdWUgdG8gUkdCLlxuLy8gKkFzc3VtZXM6KiBoIGlzIGNvbnRhaW5lZCBpbiBbMCwgMV0gb3IgWzAsIDM2MF0gYW5kIHMgYW5kIGwgYXJlIGNvbnRhaW5lZCBbMCwgMV0gb3IgWzAsIDEwMF1cbi8vICpSZXR1cm5zOiogeyByLCBnLCBiIH0gaW4gdGhlIHNldCBbMCwgMjU1XVxuZnVuY3Rpb24gaHNsVG9SZ2IoaCwgcywgbCkge1xuICAgIHZhciByLCBnLCBiO1xuXG4gICAgaCA9IGJvdW5kMDEoaCwgMzYwKTtcbiAgICBzID0gYm91bmQwMShzLCAxMDApO1xuICAgIGwgPSBib3VuZDAxKGwsIDEwMCk7XG5cbiAgICBmdW5jdGlvbiBodWUycmdiKHAsIHEsIHQpIHtcbiAgICAgICAgaWYodCA8IDApIHQgKz0gMTtcbiAgICAgICAgaWYodCA+IDEpIHQgLT0gMTtcbiAgICAgICAgaWYodCA8IDEvNikgcmV0dXJuIHAgKyAocSAtIHApICogNiAqIHQ7XG4gICAgICAgIGlmKHQgPCAxLzIpIHJldHVybiBxO1xuICAgICAgICBpZih0IDwgMi8zKSByZXR1cm4gcCArIChxIC0gcCkgKiAoMi8zIC0gdCkgKiA2O1xuICAgICAgICByZXR1cm4gcDtcbiAgICB9XG5cbiAgICBpZihzID09PSAwKSB7XG4gICAgICAgIHIgPSBnID0gYiA9IGw7IC8vIGFjaHJvbWF0aWNcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciBxID0gbCA8IDAuNSA/IGwgKiAoMSArIHMpIDogbCArIHMgLSBsICogcztcbiAgICAgICAgdmFyIHAgPSAyICogbCAtIHE7XG4gICAgICAgIHIgPSBodWUycmdiKHAsIHEsIGggKyAxLzMpO1xuICAgICAgICBnID0gaHVlMnJnYihwLCBxLCBoKTtcbiAgICAgICAgYiA9IGh1ZTJyZ2IocCwgcSwgaCAtIDEvMyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgcjogciAqIDI1NSwgZzogZyAqIDI1NSwgYjogYiAqIDI1NSB9O1xufVxuXG4vLyBgcmdiVG9Ic3ZgXG4vLyBDb252ZXJ0cyBhbiBSR0IgY29sb3IgdmFsdWUgdG8gSFNWXG4vLyAqQXNzdW1lczoqIHIsIGcsIGFuZCBiIGFyZSBjb250YWluZWQgaW4gdGhlIHNldCBbMCwgMjU1XSBvciBbMCwgMV1cbi8vICpSZXR1cm5zOiogeyBoLCBzLCB2IH0gaW4gWzAsMV1cbmZ1bmN0aW9uIHJnYlRvSHN2KHIsIGcsIGIpIHtcblxuICAgIHIgPSBib3VuZDAxKHIsIDI1NSk7XG4gICAgZyA9IGJvdW5kMDEoZywgMjU1KTtcbiAgICBiID0gYm91bmQwMShiLCAyNTUpO1xuXG4gICAgdmFyIG1heCA9IG1hdGhNYXgociwgZywgYiksIG1pbiA9IG1hdGhNaW4ociwgZywgYik7XG4gICAgdmFyIGgsIHMsIHYgPSBtYXg7XG5cbiAgICB2YXIgZCA9IG1heCAtIG1pbjtcbiAgICBzID0gbWF4ID09PSAwID8gMCA6IGQgLyBtYXg7XG5cbiAgICBpZihtYXggPT0gbWluKSB7XG4gICAgICAgIGggPSAwOyAvLyBhY2hyb21hdGljXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzd2l0Y2gobWF4KSB7XG4gICAgICAgICAgICBjYXNlIHI6IGggPSAoZyAtIGIpIC8gZCArIChnIDwgYiA/IDYgOiAwKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGc6IGggPSAoYiAtIHIpIC8gZCArIDI7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBiOiBoID0gKHIgLSBnKSAvIGQgKyA0OyBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBoIC89IDY7XG4gICAgfVxuICAgIHJldHVybiB7IGg6IGgsIHM6IHMsIHY6IHYgfTtcbn1cblxuLy8gYGhzdlRvUmdiYFxuLy8gQ29udmVydHMgYW4gSFNWIGNvbG9yIHZhbHVlIHRvIFJHQi5cbi8vICpBc3N1bWVzOiogaCBpcyBjb250YWluZWQgaW4gWzAsIDFdIG9yIFswLCAzNjBdIGFuZCBzIGFuZCB2IGFyZSBjb250YWluZWQgaW4gWzAsIDFdIG9yIFswLCAxMDBdXG4vLyAqUmV0dXJuczoqIHsgciwgZywgYiB9IGluIHRoZSBzZXQgWzAsIDI1NV1cbiBmdW5jdGlvbiBoc3ZUb1JnYihoLCBzLCB2KSB7XG5cbiAgICBoID0gYm91bmQwMShoLCAzNjApICogNjtcbiAgICBzID0gYm91bmQwMShzLCAxMDApO1xuICAgIHYgPSBib3VuZDAxKHYsIDEwMCk7XG5cbiAgICB2YXIgaSA9IG1hdGguZmxvb3IoaCksXG4gICAgICAgIGYgPSBoIC0gaSxcbiAgICAgICAgcCA9IHYgKiAoMSAtIHMpLFxuICAgICAgICBxID0gdiAqICgxIC0gZiAqIHMpLFxuICAgICAgICB0ID0gdiAqICgxIC0gKDEgLSBmKSAqIHMpLFxuICAgICAgICBtb2QgPSBpICUgNixcbiAgICAgICAgciA9IFt2LCBxLCBwLCBwLCB0LCB2XVttb2RdLFxuICAgICAgICBnID0gW3QsIHYsIHYsIHEsIHAsIHBdW21vZF0sXG4gICAgICAgIGIgPSBbcCwgcCwgdCwgdiwgdiwgcV1bbW9kXTtcblxuICAgIHJldHVybiB7IHI6IHIgKiAyNTUsIGc6IGcgKiAyNTUsIGI6IGIgKiAyNTUgfTtcbn1cblxuLy8gYHJnYlRvSGV4YFxuLy8gQ29udmVydHMgYW4gUkdCIGNvbG9yIHRvIGhleFxuLy8gQXNzdW1lcyByLCBnLCBhbmQgYiBhcmUgY29udGFpbmVkIGluIHRoZSBzZXQgWzAsIDI1NV1cbi8vIFJldHVybnMgYSAzIG9yIDYgY2hhcmFjdGVyIGhleFxuZnVuY3Rpb24gcmdiVG9IZXgociwgZywgYiwgYWxsb3czQ2hhcikge1xuXG4gICAgdmFyIGhleCA9IFtcbiAgICAgICAgcGFkMihtYXRoUm91bmQocikudG9TdHJpbmcoMTYpKSxcbiAgICAgICAgcGFkMihtYXRoUm91bmQoZykudG9TdHJpbmcoMTYpKSxcbiAgICAgICAgcGFkMihtYXRoUm91bmQoYikudG9TdHJpbmcoMTYpKVxuICAgIF07XG5cbiAgICAvLyBSZXR1cm4gYSAzIGNoYXJhY3RlciBoZXggaWYgcG9zc2libGVcbiAgICBpZiAoYWxsb3czQ2hhciAmJiBoZXhbMF0uY2hhckF0KDApID09IGhleFswXS5jaGFyQXQoMSkgJiYgaGV4WzFdLmNoYXJBdCgwKSA9PSBoZXhbMV0uY2hhckF0KDEpICYmIGhleFsyXS5jaGFyQXQoMCkgPT0gaGV4WzJdLmNoYXJBdCgxKSkge1xuICAgICAgICByZXR1cm4gaGV4WzBdLmNoYXJBdCgwKSArIGhleFsxXS5jaGFyQXQoMCkgKyBoZXhbMl0uY2hhckF0KDApO1xuICAgIH1cblxuICAgIHJldHVybiBoZXguam9pbihcIlwiKTtcbn1cblxuLy8gYHJnYmFUb0hleGBcbi8vIENvbnZlcnRzIGFuIFJHQkEgY29sb3IgcGx1cyBhbHBoYSB0cmFuc3BhcmVuY3kgdG8gaGV4XG4vLyBBc3N1bWVzIHIsIGcsIGIgYW5kIGEgYXJlIGNvbnRhaW5lZCBpbiB0aGUgc2V0IFswLCAyNTVdXG4vLyBSZXR1cm5zIGFuIDggY2hhcmFjdGVyIGhleFxuZnVuY3Rpb24gcmdiYVRvSGV4KHIsIGcsIGIsIGEpIHtcblxuICAgIHZhciBoZXggPSBbXG4gICAgICAgIHBhZDIoY29udmVydERlY2ltYWxUb0hleChhKSksXG4gICAgICAgIHBhZDIobWF0aFJvdW5kKHIpLnRvU3RyaW5nKDE2KSksXG4gICAgICAgIHBhZDIobWF0aFJvdW5kKGcpLnRvU3RyaW5nKDE2KSksXG4gICAgICAgIHBhZDIobWF0aFJvdW5kKGIpLnRvU3RyaW5nKDE2KSlcbiAgICBdO1xuXG4gICAgcmV0dXJuIGhleC5qb2luKFwiXCIpO1xufVxuXG4vLyBgZXF1YWxzYFxuLy8gQ2FuIGJlIGNhbGxlZCB3aXRoIGFueSB0aW55Y29sb3IgaW5wdXRcbnRpbnljb2xvci5lcXVhbHMgPSBmdW5jdGlvbiAoY29sb3IxLCBjb2xvcjIpIHtcbiAgICBpZiAoIWNvbG9yMSB8fCAhY29sb3IyKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIHJldHVybiB0aW55Y29sb3IoY29sb3IxKS50b1JnYlN0cmluZygpID09IHRpbnljb2xvcihjb2xvcjIpLnRvUmdiU3RyaW5nKCk7XG59O1xuXG50aW55Y29sb3IucmFuZG9tID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRpbnljb2xvci5mcm9tUmF0aW8oe1xuICAgICAgICByOiBtYXRoUmFuZG9tKCksXG4gICAgICAgIGc6IG1hdGhSYW5kb20oKSxcbiAgICAgICAgYjogbWF0aFJhbmRvbSgpXG4gICAgfSk7XG59O1xuXG5cbi8vIE1vZGlmaWNhdGlvbiBGdW5jdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFRoYW5rcyB0byBsZXNzLmpzIGZvciBzb21lIG9mIHRoZSBiYXNpY3MgaGVyZVxuLy8gPGh0dHBzOi8vZ2l0aHViLmNvbS9jbG91ZGhlYWQvbGVzcy5qcy9ibG9iL21hc3Rlci9saWIvbGVzcy9mdW5jdGlvbnMuanM+XG5cbmZ1bmN0aW9uIGRlc2F0dXJhdGUoY29sb3IsIGFtb3VudCkge1xuICAgIGFtb3VudCA9IChhbW91bnQgPT09IDApID8gMCA6IChhbW91bnQgfHwgMTApO1xuICAgIHZhciBoc2wgPSB0aW55Y29sb3IoY29sb3IpLnRvSHNsKCk7XG4gICAgaHNsLnMgLT0gYW1vdW50IC8gMTAwO1xuICAgIGhzbC5zID0gY2xhbXAwMShoc2wucyk7XG4gICAgcmV0dXJuIHRpbnljb2xvcihoc2wpO1xufVxuXG5mdW5jdGlvbiBzYXR1cmF0ZShjb2xvciwgYW1vdW50KSB7XG4gICAgYW1vdW50ID0gKGFtb3VudCA9PT0gMCkgPyAwIDogKGFtb3VudCB8fCAxMCk7XG4gICAgdmFyIGhzbCA9IHRpbnljb2xvcihjb2xvcikudG9Ic2woKTtcbiAgICBoc2wucyArPSBhbW91bnQgLyAxMDA7XG4gICAgaHNsLnMgPSBjbGFtcDAxKGhzbC5zKTtcbiAgICByZXR1cm4gdGlueWNvbG9yKGhzbCk7XG59XG5cbmZ1bmN0aW9uIGdyZXlzY2FsZShjb2xvcikge1xuICAgIHJldHVybiB0aW55Y29sb3IoY29sb3IpLmRlc2F0dXJhdGUoMTAwKTtcbn1cblxuZnVuY3Rpb24gbGlnaHRlbiAoY29sb3IsIGFtb3VudCkge1xuICAgIGFtb3VudCA9IChhbW91bnQgPT09IDApID8gMCA6IChhbW91bnQgfHwgMTApO1xuICAgIHZhciBoc2wgPSB0aW55Y29sb3IoY29sb3IpLnRvSHNsKCk7XG4gICAgaHNsLmwgKz0gYW1vdW50IC8gMTAwO1xuICAgIGhzbC5sID0gY2xhbXAwMShoc2wubCk7XG4gICAgcmV0dXJuIHRpbnljb2xvcihoc2wpO1xufVxuXG5mdW5jdGlvbiBicmlnaHRlbihjb2xvciwgYW1vdW50KSB7XG4gICAgYW1vdW50ID0gKGFtb3VudCA9PT0gMCkgPyAwIDogKGFtb3VudCB8fCAxMCk7XG4gICAgdmFyIHJnYiA9IHRpbnljb2xvcihjb2xvcikudG9SZ2IoKTtcbiAgICByZ2IuciA9IG1hdGhNYXgoMCwgbWF0aE1pbigyNTUsIHJnYi5yIC0gbWF0aFJvdW5kKDI1NSAqIC0gKGFtb3VudCAvIDEwMCkpKSk7XG4gICAgcmdiLmcgPSBtYXRoTWF4KDAsIG1hdGhNaW4oMjU1LCByZ2IuZyAtIG1hdGhSb3VuZCgyNTUgKiAtIChhbW91bnQgLyAxMDApKSkpO1xuICAgIHJnYi5iID0gbWF0aE1heCgwLCBtYXRoTWluKDI1NSwgcmdiLmIgLSBtYXRoUm91bmQoMjU1ICogLSAoYW1vdW50IC8gMTAwKSkpKTtcbiAgICByZXR1cm4gdGlueWNvbG9yKHJnYik7XG59XG5cbmZ1bmN0aW9uIGRhcmtlbiAoY29sb3IsIGFtb3VudCkge1xuICAgIGFtb3VudCA9IChhbW91bnQgPT09IDApID8gMCA6IChhbW91bnQgfHwgMTApO1xuICAgIHZhciBoc2wgPSB0aW55Y29sb3IoY29sb3IpLnRvSHNsKCk7XG4gICAgaHNsLmwgLT0gYW1vdW50IC8gMTAwO1xuICAgIGhzbC5sID0gY2xhbXAwMShoc2wubCk7XG4gICAgcmV0dXJuIHRpbnljb2xvcihoc2wpO1xufVxuXG4vLyBTcGluIHRha2VzIGEgcG9zaXRpdmUgb3IgbmVnYXRpdmUgYW1vdW50IHdpdGhpbiBbLTM2MCwgMzYwXSBpbmRpY2F0aW5nIHRoZSBjaGFuZ2Ugb2YgaHVlLlxuLy8gVmFsdWVzIG91dHNpZGUgb2YgdGhpcyByYW5nZSB3aWxsIGJlIHdyYXBwZWQgaW50byB0aGlzIHJhbmdlLlxuZnVuY3Rpb24gc3Bpbihjb2xvciwgYW1vdW50KSB7XG4gICAgdmFyIGhzbCA9IHRpbnljb2xvcihjb2xvcikudG9Ic2woKTtcbiAgICB2YXIgaHVlID0gKG1hdGhSb3VuZChoc2wuaCkgKyBhbW91bnQpICUgMzYwO1xuICAgIGhzbC5oID0gaHVlIDwgMCA/IDM2MCArIGh1ZSA6IGh1ZTtcbiAgICByZXR1cm4gdGlueWNvbG9yKGhzbCk7XG59XG5cbi8vIENvbWJpbmF0aW9uIEZ1bmN0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBUaGFua3MgdG8galF1ZXJ5IHhDb2xvciBmb3Igc29tZSBvZiB0aGUgaWRlYXMgYmVoaW5kIHRoZXNlXG4vLyA8aHR0cHM6Ly9naXRodWIuY29tL2luZnVzaW9uL2pRdWVyeS14Y29sb3IvYmxvYi9tYXN0ZXIvanF1ZXJ5Lnhjb2xvci5qcz5cblxuZnVuY3Rpb24gY29tcGxlbWVudChjb2xvcikge1xuICAgIHZhciBoc2wgPSB0aW55Y29sb3IoY29sb3IpLnRvSHNsKCk7XG4gICAgaHNsLmggPSAoaHNsLmggKyAxODApICUgMzYwO1xuICAgIHJldHVybiB0aW55Y29sb3IoaHNsKTtcbn1cblxuZnVuY3Rpb24gdHJpYWQoY29sb3IpIHtcbiAgICB2YXIgaHNsID0gdGlueWNvbG9yKGNvbG9yKS50b0hzbCgpO1xuICAgIHZhciBoID0gaHNsLmg7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgdGlueWNvbG9yKGNvbG9yKSxcbiAgICAgICAgdGlueWNvbG9yKHsgaDogKGggKyAxMjApICUgMzYwLCBzOiBoc2wucywgbDogaHNsLmwgfSksXG4gICAgICAgIHRpbnljb2xvcih7IGg6IChoICsgMjQwKSAlIDM2MCwgczogaHNsLnMsIGw6IGhzbC5sIH0pXG4gICAgXTtcbn1cblxuZnVuY3Rpb24gdGV0cmFkKGNvbG9yKSB7XG4gICAgdmFyIGhzbCA9IHRpbnljb2xvcihjb2xvcikudG9Ic2woKTtcbiAgICB2YXIgaCA9IGhzbC5oO1xuICAgIHJldHVybiBbXG4gICAgICAgIHRpbnljb2xvcihjb2xvciksXG4gICAgICAgIHRpbnljb2xvcih7IGg6IChoICsgOTApICUgMzYwLCBzOiBoc2wucywgbDogaHNsLmwgfSksXG4gICAgICAgIHRpbnljb2xvcih7IGg6IChoICsgMTgwKSAlIDM2MCwgczogaHNsLnMsIGw6IGhzbC5sIH0pLFxuICAgICAgICB0aW55Y29sb3IoeyBoOiAoaCArIDI3MCkgJSAzNjAsIHM6IGhzbC5zLCBsOiBoc2wubCB9KVxuICAgIF07XG59XG5cbmZ1bmN0aW9uIHNwbGl0Y29tcGxlbWVudChjb2xvcikge1xuICAgIHZhciBoc2wgPSB0aW55Y29sb3IoY29sb3IpLnRvSHNsKCk7XG4gICAgdmFyIGggPSBoc2wuaDtcbiAgICByZXR1cm4gW1xuICAgICAgICB0aW55Y29sb3IoY29sb3IpLFxuICAgICAgICB0aW55Y29sb3IoeyBoOiAoaCArIDcyKSAlIDM2MCwgczogaHNsLnMsIGw6IGhzbC5sfSksXG4gICAgICAgIHRpbnljb2xvcih7IGg6IChoICsgMjE2KSAlIDM2MCwgczogaHNsLnMsIGw6IGhzbC5sfSlcbiAgICBdO1xufVxuXG5mdW5jdGlvbiBhbmFsb2dvdXMoY29sb3IsIHJlc3VsdHMsIHNsaWNlcykge1xuICAgIHJlc3VsdHMgPSByZXN1bHRzIHx8IDY7XG4gICAgc2xpY2VzID0gc2xpY2VzIHx8IDMwO1xuXG4gICAgdmFyIGhzbCA9IHRpbnljb2xvcihjb2xvcikudG9Ic2woKTtcbiAgICB2YXIgcGFydCA9IDM2MCAvIHNsaWNlcztcbiAgICB2YXIgcmV0ID0gW3Rpbnljb2xvcihjb2xvcildO1xuXG4gICAgZm9yIChoc2wuaCA9ICgoaHNsLmggLSAocGFydCAqIHJlc3VsdHMgPj4gMSkpICsgNzIwKSAlIDM2MDsgLS1yZXN1bHRzOyApIHtcbiAgICAgICAgaHNsLmggPSAoaHNsLmggKyBwYXJ0KSAlIDM2MDtcbiAgICAgICAgcmV0LnB1c2godGlueWNvbG9yKGhzbCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBtb25vY2hyb21hdGljKGNvbG9yLCByZXN1bHRzKSB7XG4gICAgcmVzdWx0cyA9IHJlc3VsdHMgfHwgNjtcbiAgICB2YXIgaHN2ID0gdGlueWNvbG9yKGNvbG9yKS50b0hzdigpO1xuICAgIHZhciBoID0gaHN2LmgsIHMgPSBoc3YucywgdiA9IGhzdi52O1xuICAgIHZhciByZXQgPSBbXTtcbiAgICB2YXIgbW9kaWZpY2F0aW9uID0gMSAvIHJlc3VsdHM7XG5cbiAgICB3aGlsZSAocmVzdWx0cy0tKSB7XG4gICAgICAgIHJldC5wdXNoKHRpbnljb2xvcih7IGg6IGgsIHM6IHMsIHY6IHZ9KSk7XG4gICAgICAgIHYgPSAodiArIG1vZGlmaWNhdGlvbikgJSAxO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG59XG5cbi8vIFV0aWxpdHkgRnVuY3Rpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudGlueWNvbG9yLm1peCA9IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyLCBhbW91bnQpIHtcbiAgICBhbW91bnQgPSAoYW1vdW50ID09PSAwKSA/IDAgOiAoYW1vdW50IHx8IDUwKTtcblxuICAgIHZhciByZ2IxID0gdGlueWNvbG9yKGNvbG9yMSkudG9SZ2IoKTtcbiAgICB2YXIgcmdiMiA9IHRpbnljb2xvcihjb2xvcjIpLnRvUmdiKCk7XG5cbiAgICB2YXIgcCA9IGFtb3VudCAvIDEwMDtcbiAgICB2YXIgdyA9IHAgKiAyIC0gMTtcbiAgICB2YXIgYSA9IHJnYjIuYSAtIHJnYjEuYTtcblxuICAgIHZhciB3MTtcblxuICAgIGlmICh3ICogYSA9PSAtMSkge1xuICAgICAgICB3MSA9IHc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdzEgPSAodyArIGEpIC8gKDEgKyB3ICogYSk7XG4gICAgfVxuXG4gICAgdzEgPSAodzEgKyAxKSAvIDI7XG5cbiAgICB2YXIgdzIgPSAxIC0gdzE7XG5cbiAgICB2YXIgcmdiYSA9IHtcbiAgICAgICAgcjogcmdiMi5yICogdzEgKyByZ2IxLnIgKiB3MixcbiAgICAgICAgZzogcmdiMi5nICogdzEgKyByZ2IxLmcgKiB3MixcbiAgICAgICAgYjogcmdiMi5iICogdzEgKyByZ2IxLmIgKiB3MixcbiAgICAgICAgYTogcmdiMi5hICogcCAgKyByZ2IxLmEgKiAoMSAtIHApXG4gICAgfTtcblxuICAgIHJldHVybiB0aW55Y29sb3IocmdiYSk7XG59O1xuXG5cbi8vIFJlYWRhYmlsaXR5IEZ1bmN0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyA8aHR0cDovL3d3dy53My5vcmcvVFIvMjAwOC9SRUMtV0NBRzIwLTIwMDgxMjExLyNjb250cmFzdC1yYXRpb2RlZiAoV0NBRyBWZXJzaW9uIDIpXG5cbi8vIGBjb250cmFzdGBcbi8vIEFuYWx5emUgdGhlIDIgY29sb3JzIGFuZCByZXR1cm5zIHRoZSBjb2xvciBjb250cmFzdCBkZWZpbmVkIGJ5IChXQ0FHIFZlcnNpb24gMilcbnRpbnljb2xvci5yZWFkYWJpbGl0eSA9IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyKSB7XG4gICAgdmFyIGMxID0gdGlueWNvbG9yKGNvbG9yMSk7XG4gICAgdmFyIGMyID0gdGlueWNvbG9yKGNvbG9yMik7XG4gICAgcmV0dXJuIChNYXRoLm1heChjMS5nZXRMdW1pbmFuY2UoKSxjMi5nZXRMdW1pbmFuY2UoKSkrMC4wNSkgLyAoTWF0aC5taW4oYzEuZ2V0THVtaW5hbmNlKCksYzIuZ2V0THVtaW5hbmNlKCkpKzAuMDUpO1xufTtcblxuLy8gYGlzUmVhZGFibGVgXG4vLyBFbnN1cmUgdGhhdCBmb3JlZ3JvdW5kIGFuZCBiYWNrZ3JvdW5kIGNvbG9yIGNvbWJpbmF0aW9ucyBtZWV0IFdDQUcyIGd1aWRlbGluZXMuXG4vLyBUaGUgdGhpcmQgYXJndW1lbnQgaXMgYW4gb3B0aW9uYWwgT2JqZWN0LlxuLy8gICAgICB0aGUgJ2xldmVsJyBwcm9wZXJ0eSBzdGF0ZXMgJ0FBJyBvciAnQUFBJyAtIGlmIG1pc3Npbmcgb3IgaW52YWxpZCwgaXQgZGVmYXVsdHMgdG8gJ0FBJztcbi8vICAgICAgdGhlICdzaXplJyBwcm9wZXJ0eSBzdGF0ZXMgJ2xhcmdlJyBvciAnc21hbGwnIC0gaWYgbWlzc2luZyBvciBpbnZhbGlkLCBpdCBkZWZhdWx0cyB0byAnc21hbGwnLlxuLy8gSWYgdGhlIGVudGlyZSBvYmplY3QgaXMgYWJzZW50LCBpc1JlYWRhYmxlIGRlZmF1bHRzIHRvIHtsZXZlbDpcIkFBXCIsc2l6ZTpcInNtYWxsXCJ9LlxuXG4vLyAqRXhhbXBsZSpcbi8vICAgIHRpbnljb2xvci5pc1JlYWRhYmxlKFwiIzAwMFwiLCBcIiMxMTFcIikgPT4gZmFsc2Vcbi8vICAgIHRpbnljb2xvci5pc1JlYWRhYmxlKFwiIzAwMFwiLCBcIiMxMTFcIix7bGV2ZWw6XCJBQVwiLHNpemU6XCJsYXJnZVwifSkgPT4gZmFsc2VcbnRpbnljb2xvci5pc1JlYWRhYmxlID0gZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIsIHdjYWcyKSB7XG4gICAgdmFyIHJlYWRhYmlsaXR5ID0gdGlueWNvbG9yLnJlYWRhYmlsaXR5KGNvbG9yMSwgY29sb3IyKTtcbiAgICB2YXIgd2NhZzJQYXJtcywgb3V0O1xuXG4gICAgb3V0ID0gZmFsc2U7XG5cbiAgICB3Y2FnMlBhcm1zID0gdmFsaWRhdGVXQ0FHMlBhcm1zKHdjYWcyKTtcbiAgICBzd2l0Y2ggKHdjYWcyUGFybXMubGV2ZWwgKyB3Y2FnMlBhcm1zLnNpemUpIHtcbiAgICAgICAgY2FzZSBcIkFBc21hbGxcIjpcbiAgICAgICAgY2FzZSBcIkFBQWxhcmdlXCI6XG4gICAgICAgICAgICBvdXQgPSByZWFkYWJpbGl0eSA+PSA0LjU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIkFBbGFyZ2VcIjpcbiAgICAgICAgICAgIG91dCA9IHJlYWRhYmlsaXR5ID49IDM7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIkFBQXNtYWxsXCI6XG4gICAgICAgICAgICBvdXQgPSByZWFkYWJpbGl0eSA+PSA3O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG5cbn07XG5cbi8vIGBtb3N0UmVhZGFibGVgXG4vLyBHaXZlbiBhIGJhc2UgY29sb3IgYW5kIGEgbGlzdCBvZiBwb3NzaWJsZSBmb3JlZ3JvdW5kIG9yIGJhY2tncm91bmRcbi8vIGNvbG9ycyBmb3IgdGhhdCBiYXNlLCByZXR1cm5zIHRoZSBtb3N0IHJlYWRhYmxlIGNvbG9yLlxuLy8gT3B0aW9uYWxseSByZXR1cm5zIEJsYWNrIG9yIFdoaXRlIGlmIHRoZSBtb3N0IHJlYWRhYmxlIGNvbG9yIGlzIHVucmVhZGFibGUuXG4vLyAqRXhhbXBsZSpcbi8vICAgIHRpbnljb2xvci5tb3N0UmVhZGFibGUodGlueWNvbG9yLm1vc3RSZWFkYWJsZShcIiMxMjNcIiwgW1wiIzEyNFwiLCBcIiMxMjVcIl0se2luY2x1ZGVGYWxsYmFja0NvbG9yczpmYWxzZX0pLnRvSGV4U3RyaW5nKCk7IC8vIFwiIzExMjI1NVwiXG4vLyAgICB0aW55Y29sb3IubW9zdFJlYWRhYmxlKHRpbnljb2xvci5tb3N0UmVhZGFibGUoXCIjMTIzXCIsIFtcIiMxMjRcIiwgXCIjMTI1XCJdLHtpbmNsdWRlRmFsbGJhY2tDb2xvcnM6dHJ1ZX0pLnRvSGV4U3RyaW5nKCk7ICAvLyBcIiNmZmZmZmZcIlxuLy8gICAgdGlueWNvbG9yLm1vc3RSZWFkYWJsZShcIiNhODAxNWFcIiwgW1wiI2ZhZjNmM1wiXSx7aW5jbHVkZUZhbGxiYWNrQ29sb3JzOnRydWUsbGV2ZWw6XCJBQUFcIixzaXplOlwibGFyZ2VcIn0pLnRvSGV4U3RyaW5nKCk7IC8vIFwiI2ZhZjNmM1wiXG4vLyAgICB0aW55Y29sb3IubW9zdFJlYWRhYmxlKFwiI2E4MDE1YVwiLCBbXCIjZmFmM2YzXCJdLHtpbmNsdWRlRmFsbGJhY2tDb2xvcnM6dHJ1ZSxsZXZlbDpcIkFBQVwiLHNpemU6XCJzbWFsbFwifSkudG9IZXhTdHJpbmcoKTsgLy8gXCIjZmZmZmZmXCJcbnRpbnljb2xvci5tb3N0UmVhZGFibGUgPSBmdW5jdGlvbihiYXNlQ29sb3IsIGNvbG9yTGlzdCwgYXJncykge1xuICAgIHZhciBiZXN0Q29sb3IgPSBudWxsO1xuICAgIHZhciBiZXN0U2NvcmUgPSAwO1xuICAgIHZhciByZWFkYWJpbGl0eTtcbiAgICB2YXIgaW5jbHVkZUZhbGxiYWNrQ29sb3JzLCBsZXZlbCwgc2l6ZSA7XG4gICAgYXJncyA9IGFyZ3MgfHwge307XG4gICAgaW5jbHVkZUZhbGxiYWNrQ29sb3JzID0gYXJncy5pbmNsdWRlRmFsbGJhY2tDb2xvcnMgO1xuICAgIGxldmVsID0gYXJncy5sZXZlbDtcbiAgICBzaXplID0gYXJncy5zaXplO1xuXG4gICAgZm9yICh2YXIgaT0gMDsgaSA8IGNvbG9yTGlzdC5sZW5ndGggOyBpKyspIHtcbiAgICAgICAgcmVhZGFiaWxpdHkgPSB0aW55Y29sb3IucmVhZGFiaWxpdHkoYmFzZUNvbG9yLCBjb2xvckxpc3RbaV0pO1xuICAgICAgICBpZiAocmVhZGFiaWxpdHkgPiBiZXN0U2NvcmUpIHtcbiAgICAgICAgICAgIGJlc3RTY29yZSA9IHJlYWRhYmlsaXR5O1xuICAgICAgICAgICAgYmVzdENvbG9yID0gdGlueWNvbG9yKGNvbG9yTGlzdFtpXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGlueWNvbG9yLmlzUmVhZGFibGUoYmFzZUNvbG9yLCBiZXN0Q29sb3IsIHtcImxldmVsXCI6bGV2ZWwsXCJzaXplXCI6c2l6ZX0pIHx8ICFpbmNsdWRlRmFsbGJhY2tDb2xvcnMpIHtcbiAgICAgICAgcmV0dXJuIGJlc3RDb2xvcjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGFyZ3MuaW5jbHVkZUZhbGxiYWNrQ29sb3JzPWZhbHNlO1xuICAgICAgICByZXR1cm4gdGlueWNvbG9yLm1vc3RSZWFkYWJsZShiYXNlQ29sb3IsW1wiI2ZmZlwiLCBcIiMwMDBcIl0sYXJncyk7XG4gICAgfVxufTtcblxuXG4vLyBCaWcgTGlzdCBvZiBDb2xvcnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gPGh0dHA6Ly93d3cudzMub3JnL1RSL2NzczMtY29sb3IvI3N2Zy1jb2xvcj5cbnZhciBuYW1lcyA9IHRpbnljb2xvci5uYW1lcyA9IHtcbiAgICBhbGljZWJsdWU6IFwiZjBmOGZmXCIsXG4gICAgYW50aXF1ZXdoaXRlOiBcImZhZWJkN1wiLFxuICAgIGFxdWE6IFwiMGZmXCIsXG4gICAgYXF1YW1hcmluZTogXCI3ZmZmZDRcIixcbiAgICBhenVyZTogXCJmMGZmZmZcIixcbiAgICBiZWlnZTogXCJmNWY1ZGNcIixcbiAgICBiaXNxdWU6IFwiZmZlNGM0XCIsXG4gICAgYmxhY2s6IFwiMDAwXCIsXG4gICAgYmxhbmNoZWRhbG1vbmQ6IFwiZmZlYmNkXCIsXG4gICAgYmx1ZTogXCIwMGZcIixcbiAgICBibHVldmlvbGV0OiBcIjhhMmJlMlwiLFxuICAgIGJyb3duOiBcImE1MmEyYVwiLFxuICAgIGJ1cmx5d29vZDogXCJkZWI4ODdcIixcbiAgICBidXJudHNpZW5uYTogXCJlYTdlNWRcIixcbiAgICBjYWRldGJsdWU6IFwiNWY5ZWEwXCIsXG4gICAgY2hhcnRyZXVzZTogXCI3ZmZmMDBcIixcbiAgICBjaG9jb2xhdGU6IFwiZDI2OTFlXCIsXG4gICAgY29yYWw6IFwiZmY3ZjUwXCIsXG4gICAgY29ybmZsb3dlcmJsdWU6IFwiNjQ5NWVkXCIsXG4gICAgY29ybnNpbGs6IFwiZmZmOGRjXCIsXG4gICAgY3JpbXNvbjogXCJkYzE0M2NcIixcbiAgICBjeWFuOiBcIjBmZlwiLFxuICAgIGRhcmtibHVlOiBcIjAwMDA4YlwiLFxuICAgIGRhcmtjeWFuOiBcIjAwOGI4YlwiLFxuICAgIGRhcmtnb2xkZW5yb2Q6IFwiYjg4NjBiXCIsXG4gICAgZGFya2dyYXk6IFwiYTlhOWE5XCIsXG4gICAgZGFya2dyZWVuOiBcIjAwNjQwMFwiLFxuICAgIGRhcmtncmV5OiBcImE5YTlhOVwiLFxuICAgIGRhcmtraGFraTogXCJiZGI3NmJcIixcbiAgICBkYXJrbWFnZW50YTogXCI4YjAwOGJcIixcbiAgICBkYXJrb2xpdmVncmVlbjogXCI1NTZiMmZcIixcbiAgICBkYXJrb3JhbmdlOiBcImZmOGMwMFwiLFxuICAgIGRhcmtvcmNoaWQ6IFwiOTkzMmNjXCIsXG4gICAgZGFya3JlZDogXCI4YjAwMDBcIixcbiAgICBkYXJrc2FsbW9uOiBcImU5OTY3YVwiLFxuICAgIGRhcmtzZWFncmVlbjogXCI4ZmJjOGZcIixcbiAgICBkYXJrc2xhdGVibHVlOiBcIjQ4M2Q4YlwiLFxuICAgIGRhcmtzbGF0ZWdyYXk6IFwiMmY0ZjRmXCIsXG4gICAgZGFya3NsYXRlZ3JleTogXCIyZjRmNGZcIixcbiAgICBkYXJrdHVycXVvaXNlOiBcIjAwY2VkMVwiLFxuICAgIGRhcmt2aW9sZXQ6IFwiOTQwMGQzXCIsXG4gICAgZGVlcHBpbms6IFwiZmYxNDkzXCIsXG4gICAgZGVlcHNreWJsdWU6IFwiMDBiZmZmXCIsXG4gICAgZGltZ3JheTogXCI2OTY5NjlcIixcbiAgICBkaW1ncmV5OiBcIjY5Njk2OVwiLFxuICAgIGRvZGdlcmJsdWU6IFwiMWU5MGZmXCIsXG4gICAgZmlyZWJyaWNrOiBcImIyMjIyMlwiLFxuICAgIGZsb3JhbHdoaXRlOiBcImZmZmFmMFwiLFxuICAgIGZvcmVzdGdyZWVuOiBcIjIyOGIyMlwiLFxuICAgIGZ1Y2hzaWE6IFwiZjBmXCIsXG4gICAgZ2FpbnNib3JvOiBcImRjZGNkY1wiLFxuICAgIGdob3N0d2hpdGU6IFwiZjhmOGZmXCIsXG4gICAgZ29sZDogXCJmZmQ3MDBcIixcbiAgICBnb2xkZW5yb2Q6IFwiZGFhNTIwXCIsXG4gICAgZ3JheTogXCI4MDgwODBcIixcbiAgICBncmVlbjogXCIwMDgwMDBcIixcbiAgICBncmVlbnllbGxvdzogXCJhZGZmMmZcIixcbiAgICBncmV5OiBcIjgwODA4MFwiLFxuICAgIGhvbmV5ZGV3OiBcImYwZmZmMFwiLFxuICAgIGhvdHBpbms6IFwiZmY2OWI0XCIsXG4gICAgaW5kaWFucmVkOiBcImNkNWM1Y1wiLFxuICAgIGluZGlnbzogXCI0YjAwODJcIixcbiAgICBpdm9yeTogXCJmZmZmZjBcIixcbiAgICBraGFraTogXCJmMGU2OGNcIixcbiAgICBsYXZlbmRlcjogXCJlNmU2ZmFcIixcbiAgICBsYXZlbmRlcmJsdXNoOiBcImZmZjBmNVwiLFxuICAgIGxhd25ncmVlbjogXCI3Y2ZjMDBcIixcbiAgICBsZW1vbmNoaWZmb246IFwiZmZmYWNkXCIsXG4gICAgbGlnaHRibHVlOiBcImFkZDhlNlwiLFxuICAgIGxpZ2h0Y29yYWw6IFwiZjA4MDgwXCIsXG4gICAgbGlnaHRjeWFuOiBcImUwZmZmZlwiLFxuICAgIGxpZ2h0Z29sZGVucm9keWVsbG93OiBcImZhZmFkMlwiLFxuICAgIGxpZ2h0Z3JheTogXCJkM2QzZDNcIixcbiAgICBsaWdodGdyZWVuOiBcIjkwZWU5MFwiLFxuICAgIGxpZ2h0Z3JleTogXCJkM2QzZDNcIixcbiAgICBsaWdodHBpbms6IFwiZmZiNmMxXCIsXG4gICAgbGlnaHRzYWxtb246IFwiZmZhMDdhXCIsXG4gICAgbGlnaHRzZWFncmVlbjogXCIyMGIyYWFcIixcbiAgICBsaWdodHNreWJsdWU6IFwiODdjZWZhXCIsXG4gICAgbGlnaHRzbGF0ZWdyYXk6IFwiNzg5XCIsXG4gICAgbGlnaHRzbGF0ZWdyZXk6IFwiNzg5XCIsXG4gICAgbGlnaHRzdGVlbGJsdWU6IFwiYjBjNGRlXCIsXG4gICAgbGlnaHR5ZWxsb3c6IFwiZmZmZmUwXCIsXG4gICAgbGltZTogXCIwZjBcIixcbiAgICBsaW1lZ3JlZW46IFwiMzJjZDMyXCIsXG4gICAgbGluZW46IFwiZmFmMGU2XCIsXG4gICAgbWFnZW50YTogXCJmMGZcIixcbiAgICBtYXJvb246IFwiODAwMDAwXCIsXG4gICAgbWVkaXVtYXF1YW1hcmluZTogXCI2NmNkYWFcIixcbiAgICBtZWRpdW1ibHVlOiBcIjAwMDBjZFwiLFxuICAgIG1lZGl1bW9yY2hpZDogXCJiYTU1ZDNcIixcbiAgICBtZWRpdW1wdXJwbGU6IFwiOTM3MGRiXCIsXG4gICAgbWVkaXVtc2VhZ3JlZW46IFwiM2NiMzcxXCIsXG4gICAgbWVkaXVtc2xhdGVibHVlOiBcIjdiNjhlZVwiLFxuICAgIG1lZGl1bXNwcmluZ2dyZWVuOiBcIjAwZmE5YVwiLFxuICAgIG1lZGl1bXR1cnF1b2lzZTogXCI0OGQxY2NcIixcbiAgICBtZWRpdW12aW9sZXRyZWQ6IFwiYzcxNTg1XCIsXG4gICAgbWlkbmlnaHRibHVlOiBcIjE5MTk3MFwiLFxuICAgIG1pbnRjcmVhbTogXCJmNWZmZmFcIixcbiAgICBtaXN0eXJvc2U6IFwiZmZlNGUxXCIsXG4gICAgbW9jY2FzaW46IFwiZmZlNGI1XCIsXG4gICAgbmF2YWpvd2hpdGU6IFwiZmZkZWFkXCIsXG4gICAgbmF2eTogXCIwMDAwODBcIixcbiAgICBvbGRsYWNlOiBcImZkZjVlNlwiLFxuICAgIG9saXZlOiBcIjgwODAwMFwiLFxuICAgIG9saXZlZHJhYjogXCI2YjhlMjNcIixcbiAgICBvcmFuZ2U6IFwiZmZhNTAwXCIsXG4gICAgb3JhbmdlcmVkOiBcImZmNDUwMFwiLFxuICAgIG9yY2hpZDogXCJkYTcwZDZcIixcbiAgICBwYWxlZ29sZGVucm9kOiBcImVlZThhYVwiLFxuICAgIHBhbGVncmVlbjogXCI5OGZiOThcIixcbiAgICBwYWxldHVycXVvaXNlOiBcImFmZWVlZVwiLFxuICAgIHBhbGV2aW9sZXRyZWQ6IFwiZGI3MDkzXCIsXG4gICAgcGFwYXlhd2hpcDogXCJmZmVmZDVcIixcbiAgICBwZWFjaHB1ZmY6IFwiZmZkYWI5XCIsXG4gICAgcGVydTogXCJjZDg1M2ZcIixcbiAgICBwaW5rOiBcImZmYzBjYlwiLFxuICAgIHBsdW06IFwiZGRhMGRkXCIsXG4gICAgcG93ZGVyYmx1ZTogXCJiMGUwZTZcIixcbiAgICBwdXJwbGU6IFwiODAwMDgwXCIsXG4gICAgcmViZWNjYXB1cnBsZTogXCI2NjMzOTlcIixcbiAgICByZWQ6IFwiZjAwXCIsXG4gICAgcm9zeWJyb3duOiBcImJjOGY4ZlwiLFxuICAgIHJveWFsYmx1ZTogXCI0MTY5ZTFcIixcbiAgICBzYWRkbGVicm93bjogXCI4YjQ1MTNcIixcbiAgICBzYWxtb246IFwiZmE4MDcyXCIsXG4gICAgc2FuZHlicm93bjogXCJmNGE0NjBcIixcbiAgICBzZWFncmVlbjogXCIyZThiNTdcIixcbiAgICBzZWFzaGVsbDogXCJmZmY1ZWVcIixcbiAgICBzaWVubmE6IFwiYTA1MjJkXCIsXG4gICAgc2lsdmVyOiBcImMwYzBjMFwiLFxuICAgIHNreWJsdWU6IFwiODdjZWViXCIsXG4gICAgc2xhdGVibHVlOiBcIjZhNWFjZFwiLFxuICAgIHNsYXRlZ3JheTogXCI3MDgwOTBcIixcbiAgICBzbGF0ZWdyZXk6IFwiNzA4MDkwXCIsXG4gICAgc25vdzogXCJmZmZhZmFcIixcbiAgICBzcHJpbmdncmVlbjogXCIwMGZmN2ZcIixcbiAgICBzdGVlbGJsdWU6IFwiNDY4MmI0XCIsXG4gICAgdGFuOiBcImQyYjQ4Y1wiLFxuICAgIHRlYWw6IFwiMDA4MDgwXCIsXG4gICAgdGhpc3RsZTogXCJkOGJmZDhcIixcbiAgICB0b21hdG86IFwiZmY2MzQ3XCIsXG4gICAgdHVycXVvaXNlOiBcIjQwZTBkMFwiLFxuICAgIHZpb2xldDogXCJlZTgyZWVcIixcbiAgICB3aGVhdDogXCJmNWRlYjNcIixcbiAgICB3aGl0ZTogXCJmZmZcIixcbiAgICB3aGl0ZXNtb2tlOiBcImY1ZjVmNVwiLFxuICAgIHllbGxvdzogXCJmZjBcIixcbiAgICB5ZWxsb3dncmVlbjogXCI5YWNkMzJcIlxufTtcblxuLy8gTWFrZSBpdCBlYXN5IHRvIGFjY2VzcyBjb2xvcnMgdmlhIGBoZXhOYW1lc1toZXhdYFxudmFyIGhleE5hbWVzID0gdGlueWNvbG9yLmhleE5hbWVzID0gZmxpcChuYW1lcyk7XG5cblxuLy8gVXRpbGl0aWVzXG4vLyAtLS0tLS0tLS1cblxuLy8gYHsgJ25hbWUxJzogJ3ZhbDEnIH1gIGJlY29tZXMgYHsgJ3ZhbDEnOiAnbmFtZTEnIH1gXG5mdW5jdGlvbiBmbGlwKG8pIHtcbiAgICB2YXIgZmxpcHBlZCA9IHsgfTtcbiAgICBmb3IgKHZhciBpIGluIG8pIHtcbiAgICAgICAgaWYgKG8uaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgIGZsaXBwZWRbb1tpXV0gPSBpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmbGlwcGVkO1xufVxuXG4vLyBSZXR1cm4gYSB2YWxpZCBhbHBoYSB2YWx1ZSBbMCwxXSB3aXRoIGFsbCBpbnZhbGlkIHZhbHVlcyBiZWluZyBzZXQgdG8gMVxuZnVuY3Rpb24gYm91bmRBbHBoYShhKSB7XG4gICAgYSA9IHBhcnNlRmxvYXQoYSk7XG5cbiAgICBpZiAoaXNOYU4oYSkgfHwgYSA8IDAgfHwgYSA+IDEpIHtcbiAgICAgICAgYSA9IDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIGE7XG59XG5cbi8vIFRha2UgaW5wdXQgZnJvbSBbMCwgbl0gYW5kIHJldHVybiBpdCBhcyBbMCwgMV1cbmZ1bmN0aW9uIGJvdW5kMDEobiwgbWF4KSB7XG4gICAgaWYgKGlzT25lUG9pbnRaZXJvKG4pKSB7IG4gPSBcIjEwMCVcIjsgfVxuXG4gICAgdmFyIHByb2Nlc3NQZXJjZW50ID0gaXNQZXJjZW50YWdlKG4pO1xuICAgIG4gPSBtYXRoTWluKG1heCwgbWF0aE1heCgwLCBwYXJzZUZsb2F0KG4pKSk7XG5cbiAgICAvLyBBdXRvbWF0aWNhbGx5IGNvbnZlcnQgcGVyY2VudGFnZSBpbnRvIG51bWJlclxuICAgIGlmIChwcm9jZXNzUGVyY2VudCkge1xuICAgICAgICBuID0gcGFyc2VJbnQobiAqIG1heCwgMTApIC8gMTAwO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBmbG9hdGluZyBwb2ludCByb3VuZGluZyBlcnJvcnNcbiAgICBpZiAoKG1hdGguYWJzKG4gLSBtYXgpIDwgMC4wMDAwMDEpKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIC8vIENvbnZlcnQgaW50byBbMCwgMV0gcmFuZ2UgaWYgaXQgaXNuJ3QgYWxyZWFkeVxuICAgIHJldHVybiAobiAlIG1heCkgLyBwYXJzZUZsb2F0KG1heCk7XG59XG5cbi8vIEZvcmNlIGEgbnVtYmVyIGJldHdlZW4gMCBhbmQgMVxuZnVuY3Rpb24gY2xhbXAwMSh2YWwpIHtcbiAgICByZXR1cm4gbWF0aE1pbigxLCBtYXRoTWF4KDAsIHZhbCkpO1xufVxuXG4vLyBQYXJzZSBhIGJhc2UtMTYgaGV4IHZhbHVlIGludG8gYSBiYXNlLTEwIGludGVnZXJcbmZ1bmN0aW9uIHBhcnNlSW50RnJvbUhleCh2YWwpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQodmFsLCAxNik7XG59XG5cbi8vIE5lZWQgdG8gaGFuZGxlIDEuMCBhcyAxMDAlLCBzaW5jZSBvbmNlIGl0IGlzIGEgbnVtYmVyLCB0aGVyZSBpcyBubyBkaWZmZXJlbmNlIGJldHdlZW4gaXQgYW5kIDFcbi8vIDxodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzc0MjIwNzIvamF2YXNjcmlwdC1ob3ctdG8tZGV0ZWN0LW51bWJlci1hcy1hLWRlY2ltYWwtaW5jbHVkaW5nLTEtMD5cbmZ1bmN0aW9uIGlzT25lUG9pbnRaZXJvKG4pIHtcbiAgICByZXR1cm4gdHlwZW9mIG4gPT0gXCJzdHJpbmdcIiAmJiBuLmluZGV4T2YoJy4nKSAhPSAtMSAmJiBwYXJzZUZsb2F0KG4pID09PSAxO1xufVxuXG4vLyBDaGVjayB0byBzZWUgaWYgc3RyaW5nIHBhc3NlZCBpbiBpcyBhIHBlcmNlbnRhZ2VcbmZ1bmN0aW9uIGlzUGVyY2VudGFnZShuKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBuID09PSBcInN0cmluZ1wiICYmIG4uaW5kZXhPZignJScpICE9IC0xO1xufVxuXG4vLyBGb3JjZSBhIGhleCB2YWx1ZSB0byBoYXZlIDIgY2hhcmFjdGVyc1xuZnVuY3Rpb24gcGFkMihjKSB7XG4gICAgcmV0dXJuIGMubGVuZ3RoID09IDEgPyAnMCcgKyBjIDogJycgKyBjO1xufVxuXG4vLyBSZXBsYWNlIGEgZGVjaW1hbCB3aXRoIGl0J3MgcGVyY2VudGFnZSB2YWx1ZVxuZnVuY3Rpb24gY29udmVydFRvUGVyY2VudGFnZShuKSB7XG4gICAgaWYgKG4gPD0gMSkge1xuICAgICAgICBuID0gKG4gKiAxMDApICsgXCIlXCI7XG4gICAgfVxuXG4gICAgcmV0dXJuIG47XG59XG5cbi8vIENvbnZlcnRzIGEgZGVjaW1hbCB0byBhIGhleCB2YWx1ZVxuZnVuY3Rpb24gY29udmVydERlY2ltYWxUb0hleChkKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQocGFyc2VGbG9hdChkKSAqIDI1NSkudG9TdHJpbmcoMTYpO1xufVxuLy8gQ29udmVydHMgYSBoZXggdmFsdWUgdG8gYSBkZWNpbWFsXG5mdW5jdGlvbiBjb252ZXJ0SGV4VG9EZWNpbWFsKGgpIHtcbiAgICByZXR1cm4gKHBhcnNlSW50RnJvbUhleChoKSAvIDI1NSk7XG59XG5cbnZhciBtYXRjaGVycyA9IChmdW5jdGlvbigpIHtcblxuICAgIC8vIDxodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLXZhbHVlcy8jaW50ZWdlcnM+XG4gICAgdmFyIENTU19JTlRFR0VSID0gXCJbLVxcXFwrXT9cXFxcZCslP1wiO1xuXG4gICAgLy8gPGh0dHA6Ly93d3cudzMub3JnL1RSL2NzczMtdmFsdWVzLyNudW1iZXItdmFsdWU+XG4gICAgdmFyIENTU19OVU1CRVIgPSBcIlstXFxcXCtdP1xcXFxkKlxcXFwuXFxcXGQrJT9cIjtcblxuICAgIC8vIEFsbG93IHBvc2l0aXZlL25lZ2F0aXZlIGludGVnZXIvbnVtYmVyLiAgRG9uJ3QgY2FwdHVyZSB0aGUgZWl0aGVyL29yLCBqdXN0IHRoZSBlbnRpcmUgb3V0Y29tZS5cbiAgICB2YXIgQ1NTX1VOSVQgPSBcIig/OlwiICsgQ1NTX05VTUJFUiArIFwiKXwoPzpcIiArIENTU19JTlRFR0VSICsgXCIpXCI7XG5cbiAgICAvLyBBY3R1YWwgbWF0Y2hpbmcuXG4gICAgLy8gUGFyZW50aGVzZXMgYW5kIGNvbW1hcyBhcmUgb3B0aW9uYWwsIGJ1dCBub3QgcmVxdWlyZWQuXG4gICAgLy8gV2hpdGVzcGFjZSBjYW4gdGFrZSB0aGUgcGxhY2Ugb2YgY29tbWFzIG9yIG9wZW5pbmcgcGFyZW5cbiAgICB2YXIgUEVSTUlTU0lWRV9NQVRDSDMgPSBcIltcXFxcc3xcXFxcKF0rKFwiICsgQ1NTX1VOSVQgKyBcIilbLHxcXFxcc10rKFwiICsgQ1NTX1VOSVQgKyBcIilbLHxcXFxcc10rKFwiICsgQ1NTX1VOSVQgKyBcIilcXFxccypcXFxcKT9cIjtcbiAgICB2YXIgUEVSTUlTU0lWRV9NQVRDSDQgPSBcIltcXFxcc3xcXFxcKF0rKFwiICsgQ1NTX1VOSVQgKyBcIilbLHxcXFxcc10rKFwiICsgQ1NTX1VOSVQgKyBcIilbLHxcXFxcc10rKFwiICsgQ1NTX1VOSVQgKyBcIilbLHxcXFxcc10rKFwiICsgQ1NTX1VOSVQgKyBcIilcXFxccypcXFxcKT9cIjtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJnYjogbmV3IFJlZ0V4cChcInJnYlwiICsgUEVSTUlTU0lWRV9NQVRDSDMpLFxuICAgICAgICByZ2JhOiBuZXcgUmVnRXhwKFwicmdiYVwiICsgUEVSTUlTU0lWRV9NQVRDSDQpLFxuICAgICAgICBoc2w6IG5ldyBSZWdFeHAoXCJoc2xcIiArIFBFUk1JU1NJVkVfTUFUQ0gzKSxcbiAgICAgICAgaHNsYTogbmV3IFJlZ0V4cChcImhzbGFcIiArIFBFUk1JU1NJVkVfTUFUQ0g0KSxcbiAgICAgICAgaHN2OiBuZXcgUmVnRXhwKFwiaHN2XCIgKyBQRVJNSVNTSVZFX01BVENIMyksXG4gICAgICAgIGhzdmE6IG5ldyBSZWdFeHAoXCJoc3ZhXCIgKyBQRVJNSVNTSVZFX01BVENINCksXG4gICAgICAgIGhleDM6IC9eIz8oWzAtOWEtZkEtRl17MX0pKFswLTlhLWZBLUZdezF9KShbMC05YS1mQS1GXXsxfSkkLyxcbiAgICAgICAgaGV4NjogL14jPyhbMC05YS1mQS1GXXsyfSkoWzAtOWEtZkEtRl17Mn0pKFswLTlhLWZBLUZdezJ9KSQvLFxuICAgICAgICBoZXg4OiAvXiM/KFswLTlhLWZBLUZdezJ9KShbMC05YS1mQS1GXXsyfSkoWzAtOWEtZkEtRl17Mn0pKFswLTlhLWZBLUZdezJ9KSQvXG4gICAgfTtcbn0pKCk7XG5cbi8vIGBzdHJpbmdJbnB1dFRvT2JqZWN0YFxuLy8gUGVybWlzc2l2ZSBzdHJpbmcgcGFyc2luZy4gIFRha2UgaW4gYSBudW1iZXIgb2YgZm9ybWF0cywgYW5kIG91dHB1dCBhbiBvYmplY3Rcbi8vIGJhc2VkIG9uIGRldGVjdGVkIGZvcm1hdC4gIFJldHVybnMgYHsgciwgZywgYiB9YCBvciBgeyBoLCBzLCBsIH1gIG9yIGB7IGgsIHMsIHZ9YFxuZnVuY3Rpb24gc3RyaW5nSW5wdXRUb09iamVjdChjb2xvcikge1xuXG4gICAgY29sb3IgPSBjb2xvci5yZXBsYWNlKHRyaW1MZWZ0LCcnKS5yZXBsYWNlKHRyaW1SaWdodCwgJycpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFyIG5hbWVkID0gZmFsc2U7XG4gICAgaWYgKG5hbWVzW2NvbG9yXSkge1xuICAgICAgICBjb2xvciA9IG5hbWVzW2NvbG9yXTtcbiAgICAgICAgbmFtZWQgPSB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmIChjb2xvciA9PSAndHJhbnNwYXJlbnQnKSB7XG4gICAgICAgIHJldHVybiB7IHI6IDAsIGc6IDAsIGI6IDAsIGE6IDAsIGZvcm1hdDogXCJuYW1lXCIgfTtcbiAgICB9XG5cbiAgICAvLyBUcnkgdG8gbWF0Y2ggc3RyaW5nIGlucHV0IHVzaW5nIHJlZ3VsYXIgZXhwcmVzc2lvbnMuXG4gICAgLy8gS2VlcCBtb3N0IG9mIHRoZSBudW1iZXIgYm91bmRpbmcgb3V0IG9mIHRoaXMgZnVuY3Rpb24gLSBkb24ndCB3b3JyeSBhYm91dCBbMCwxXSBvciBbMCwxMDBdIG9yIFswLDM2MF1cbiAgICAvLyBKdXN0IHJldHVybiBhbiBvYmplY3QgYW5kIGxldCB0aGUgY29udmVyc2lvbiBmdW5jdGlvbnMgaGFuZGxlIHRoYXQuXG4gICAgLy8gVGhpcyB3YXkgdGhlIHJlc3VsdCB3aWxsIGJlIHRoZSBzYW1lIHdoZXRoZXIgdGhlIHRpbnljb2xvciBpcyBpbml0aWFsaXplZCB3aXRoIHN0cmluZyBvciBvYmplY3QuXG4gICAgdmFyIG1hdGNoO1xuICAgIGlmICgobWF0Y2ggPSBtYXRjaGVycy5yZ2IuZXhlYyhjb2xvcikpKSB7XG4gICAgICAgIHJldHVybiB7IHI6IG1hdGNoWzFdLCBnOiBtYXRjaFsyXSwgYjogbWF0Y2hbM10gfTtcbiAgICB9XG4gICAgaWYgKChtYXRjaCA9IG1hdGNoZXJzLnJnYmEuZXhlYyhjb2xvcikpKSB7XG4gICAgICAgIHJldHVybiB7IHI6IG1hdGNoWzFdLCBnOiBtYXRjaFsyXSwgYjogbWF0Y2hbM10sIGE6IG1hdGNoWzRdIH07XG4gICAgfVxuICAgIGlmICgobWF0Y2ggPSBtYXRjaGVycy5oc2wuZXhlYyhjb2xvcikpKSB7XG4gICAgICAgIHJldHVybiB7IGg6IG1hdGNoWzFdLCBzOiBtYXRjaFsyXSwgbDogbWF0Y2hbM10gfTtcbiAgICB9XG4gICAgaWYgKChtYXRjaCA9IG1hdGNoZXJzLmhzbGEuZXhlYyhjb2xvcikpKSB7XG4gICAgICAgIHJldHVybiB7IGg6IG1hdGNoWzFdLCBzOiBtYXRjaFsyXSwgbDogbWF0Y2hbM10sIGE6IG1hdGNoWzRdIH07XG4gICAgfVxuICAgIGlmICgobWF0Y2ggPSBtYXRjaGVycy5oc3YuZXhlYyhjb2xvcikpKSB7XG4gICAgICAgIHJldHVybiB7IGg6IG1hdGNoWzFdLCBzOiBtYXRjaFsyXSwgdjogbWF0Y2hbM10gfTtcbiAgICB9XG4gICAgaWYgKChtYXRjaCA9IG1hdGNoZXJzLmhzdmEuZXhlYyhjb2xvcikpKSB7XG4gICAgICAgIHJldHVybiB7IGg6IG1hdGNoWzFdLCBzOiBtYXRjaFsyXSwgdjogbWF0Y2hbM10sIGE6IG1hdGNoWzRdIH07XG4gICAgfVxuICAgIGlmICgobWF0Y2ggPSBtYXRjaGVycy5oZXg4LmV4ZWMoY29sb3IpKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYTogY29udmVydEhleFRvRGVjaW1hbChtYXRjaFsxXSksXG4gICAgICAgICAgICByOiBwYXJzZUludEZyb21IZXgobWF0Y2hbMl0pLFxuICAgICAgICAgICAgZzogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzNdKSxcbiAgICAgICAgICAgIGI6IHBhcnNlSW50RnJvbUhleChtYXRjaFs0XSksXG4gICAgICAgICAgICBmb3JtYXQ6IG5hbWVkID8gXCJuYW1lXCIgOiBcImhleDhcIlxuICAgICAgICB9O1xuICAgIH1cbiAgICBpZiAoKG1hdGNoID0gbWF0Y2hlcnMuaGV4Ni5leGVjKGNvbG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHI6IHBhcnNlSW50RnJvbUhleChtYXRjaFsxXSksXG4gICAgICAgICAgICBnOiBwYXJzZUludEZyb21IZXgobWF0Y2hbMl0pLFxuICAgICAgICAgICAgYjogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzNdKSxcbiAgICAgICAgICAgIGZvcm1hdDogbmFtZWQgPyBcIm5hbWVcIiA6IFwiaGV4XCJcbiAgICAgICAgfTtcbiAgICB9XG4gICAgaWYgKChtYXRjaCA9IG1hdGNoZXJzLmhleDMuZXhlYyhjb2xvcikpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByOiBwYXJzZUludEZyb21IZXgobWF0Y2hbMV0gKyAnJyArIG1hdGNoWzFdKSxcbiAgICAgICAgICAgIGc6IHBhcnNlSW50RnJvbUhleChtYXRjaFsyXSArICcnICsgbWF0Y2hbMl0pLFxuICAgICAgICAgICAgYjogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzNdICsgJycgKyBtYXRjaFszXSksXG4gICAgICAgICAgICBmb3JtYXQ6IG5hbWVkID8gXCJuYW1lXCIgOiBcImhleFwiXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZVdDQUcyUGFybXMocGFybXMpIHtcbiAgICAvLyByZXR1cm4gdmFsaWQgV0NBRzIgcGFybXMgZm9yIGlzUmVhZGFibGUuXG4gICAgLy8gSWYgaW5wdXQgcGFybXMgYXJlIGludmFsaWQsIHJldHVybiB7XCJsZXZlbFwiOlwiQUFcIiwgXCJzaXplXCI6XCJzbWFsbFwifVxuICAgIHZhciBsZXZlbCwgc2l6ZTtcbiAgICBwYXJtcyA9IHBhcm1zIHx8IHtcImxldmVsXCI6XCJBQVwiLCBcInNpemVcIjpcInNtYWxsXCJ9O1xuICAgIGxldmVsID0gKHBhcm1zLmxldmVsIHx8IFwiQUFcIikudG9VcHBlckNhc2UoKTtcbiAgICBzaXplID0gKHBhcm1zLnNpemUgfHwgXCJzbWFsbFwiKS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChsZXZlbCAhPT0gXCJBQVwiICYmIGxldmVsICE9PSBcIkFBQVwiKSB7XG4gICAgICAgIGxldmVsID0gXCJBQVwiO1xuICAgIH1cbiAgICBpZiAoc2l6ZSAhPT0gXCJzbWFsbFwiICYmIHNpemUgIT09IFwibGFyZ2VcIikge1xuICAgICAgICBzaXplID0gXCJzbWFsbFwiO1xuICAgIH1cbiAgICByZXR1cm4ge1wibGV2ZWxcIjpsZXZlbCwgXCJzaXplXCI6c2l6ZX07XG59XG5cbi8vIE5vZGU6IEV4cG9ydCBmdW5jdGlvblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHRpbnljb2xvcjtcbn1cbi8vIEFNRC9yZXF1aXJlanM6IERlZmluZSB0aGUgbW9kdWxlXG5lbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24gKCkge3JldHVybiB0aW55Y29sb3I7fSk7XG59XG4vLyBCcm93c2VyOiBFeHBvc2UgdG8gd2luZG93XG5lbHNlIHtcbiAgICB3aW5kb3cudGlueWNvbG9yID0gdGlueWNvbG9yO1xufVxuXG59KSgpO1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNsaWNrQmVoYXZpb3VyKHZtKSB7XG5cdGlmICghdm0pIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ2bSBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKCFrby5pc09ic2VydmFibGUodm0uc3RhdGUpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwidm0uc3RhdGUgaGFzIHRvIGJlIGEga25vY2tvdXQgb2JzZXJ2YWJsZSFcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZURvd24oKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUoXCJhY3RpdmVcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZVVwKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKFwiaG92ZXJcIik7XG5cdH1cblxuXHRpZiAoIXZtLmV2ZW50SGFuZGxlcnMpIHtcblx0XHR2bS5ldmVudEhhbmRsZXJzID0ge307XG5cdH1cblxuXHR2bS5ldmVudEhhbmRsZXJzLm1vdXNlZG93biA9IG1vdXNlRG93bjtcblx0dm0uZXZlbnRIYW5kbGVycy5tb3VzZXVwID0gbW91c2VVcDtcblxuXHRyZXR1cm4gdm07XG59O1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvY3VzQmVoYXZpb3VyKHZtKSB7XG5cblx0aWYgKCF2bSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcInZtIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoIWtvLmlzT2JzZXJ2YWJsZSh2bS5zdGF0ZSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ2bS5zdGF0ZSBoYXMgdG8gYmUgYSBrbm9ja291dCBvYnNlcnZhYmxlIVwiKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGZvY3VzKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKFwiYWN0aXZlXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYmx1cigpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShcImRlZmF1bHRcIik7XG5cdH1cblxuXHRpZiAoIXZtLmV2ZW50SGFuZGxlcnMpIHtcblx0XHR2bS5ldmVudEhhbmRsZXJzID0ge307XG5cdH1cblxuXHR2bS5ldmVudEhhbmRsZXJzLmZvY3VzID0gZm9jdXM7XG5cdHZtLmV2ZW50SGFuZGxlcnMuYmx1ciA9IGJsdXI7XG5cblx0cmV0dXJuIHZtO1xufTtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBob3ZlckJlaGF2aW91cih2bSkge1xuXHRpZiAoIXZtKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwidm0gaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmICgha28uaXNPYnNlcnZhYmxlKHZtLnN0YXRlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcInZtLnN0YXRlIGhhcyB0byBiZSBhIGtub2Nrb3V0IG9ic2VydmFibGUhXCIpO1xuXHR9XG5cblx0dmFyIHByZXZpb3VzU3RhdGU7XG5cblx0ZnVuY3Rpb24gbW91c2VPdmVyKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIiB8fCBhY3RTdGF0ZSA9PT0gXCJhY3RpdmVcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChhY3RTdGF0ZSAhPT0gXCJob3ZlclwiKSB7XG5cdFx0XHRwcmV2aW91c1N0YXRlID0gYWN0U3RhdGU7XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUoXCJob3ZlclwiKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNlT3V0KCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIiB8fCBhY3RTdGF0ZSA9PT0gXCJhY3RpdmVcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKHByZXZpb3VzU3RhdGUpO1xuXHR9XG5cblx0aWYgKCF2bS5ldmVudEhhbmRsZXJzKSB7XG5cdFx0dm0uZXZlbnRIYW5kbGVycyA9IHt9O1xuXHR9XG5cblx0dm0uZXZlbnRIYW5kbGVycy5tb3VzZW92ZXIgPSBtb3VzZU92ZXI7XG5cdHZtLmV2ZW50SGFuZGxlcnMubW91c2VvdXQgPSBtb3VzZU91dDtcblxuXG5cdHJldHVybiB2bTtcbn07XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIHZtcyA9IHt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNlbGVjdEJlaGF2aW91cih2bSwgY29uZmlnKSB7XG5cdGlmICghdm0pIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ2bSBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdHZhciBncm91cCA9IGNvbmZpZy5ncm91cCB8fCBcImRlZmF1bHRcIjtcblxuXHRpZiAoIXZtc1tncm91cF0pIHtcblx0XHR2bXNbZ3JvdXBdID0gW107XG5cdH1cblxuXHR2bXNbZ3JvdXBdLnB1c2godm0pO1xuXG5cdGZ1bmN0aW9uIG1vdXNlRG93bigpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShcImFjdGl2ZVwiKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNlVXAoKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGFjdEdyb3VwVm1zID0gdm1zW2dyb3VwXTtcblxuXHRcdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFjdEdyb3VwVm1zLmxlbmd0aDsgaWR4ICs9IDEpIHtcblx0XHRcdHZhciBhY3RWbSA9IGFjdEdyb3VwVm1zW2lkeF07XG5cblx0XHRcdGlmIChhY3RWbSA9PT0gdm0pIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGFjdFZtLnN0YXRlKFwiZGVmYXVsdFwiKTtcblx0XHR9XG5cdH1cblxuXHRpZiAoIXZtLmV2ZW50SGFuZGxlcnMpIHtcblx0XHR2bS5ldmVudEhhbmRsZXJzID0ge307XG5cdH1cblxuXHR2bS5ldmVudEhhbmRsZXJzLm1vdXNlZG93biA9IG1vdXNlRG93bjtcblx0dm0uZXZlbnRIYW5kbGVycy5tb3VzZXVwID0gbW91c2VVcDtcblxuXHRyZXR1cm4gdm07XG59O1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG52YXIgaG92ZXJCZWhhdmlvdXIgPSByZXF1aXJlKFwiLi9iZWhhdmlvdXJzL2hvdmVyXCIpO1xudmFyIGZvY3VzQmVoYXZpb3VyID0gcmVxdWlyZShcIi4vYmVoYXZpb3Vycy9mb2N1c1wiKTtcbnZhciBjbGlja0JlaGF2aW91ciA9IHJlcXVpcmUoXCIuL2JlaGF2aW91cnMvY2xpY2tcIik7XG52YXIgc2VsZWN0QmVoYXZpb3VyID0gcmVxdWlyZShcIi4vYmVoYXZpb3Vycy9zZWxlY3RcIik7XG5cblxuZnVuY3Rpb24gY3JlYXRlQmFzZVZtKGNvbmZpZykge1xuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cblx0aWYgKCFjb25maWcuY29tcG9uZW50KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmNvbXBvbmVudCBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKCFjb25maWcuc3R5bGUpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc3R5bGUgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdHZhciBjb21wb25lbnQgPSBjb25maWcuY29tcG9uZW50O1xuXHR2YXIgc3R5bGUgPSBjb25maWcuc3R5bGU7XG5cblx0dmFyIHN0YXRlID0ga28ub2JzZXJ2YWJsZShjb25maWcuc3RhdGUgfHwgXCJkZWZhdWx0XCIpO1xuXHR2YXIgdmFyaWF0aW9uID0gY29uZmlnLnZhcmlhdGlvbiB8fCBcImRlZmF1bHRcIjtcblxuXG5cdHZhciBjc3NDbGFzc0NvbXB1dGVkID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIFwia25vYi1cIiArIGNvbXBvbmVudCArIFwiIHN0YXRlLVwiICsgc3RhdGUoKSArIFwiIHZhcmlhdGlvbi1cIiArIHZhcmlhdGlvbjtcblx0fSk7XG5cdHZhciBzdHlsZUNvbXB1dGVkID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHN0YXRlVmFsID0gc3RhdGUoKTtcblxuXHRcdHJldHVybiBzdHlsZVt2YXJpYXRpb25dW3N0YXRlVmFsXTtcblx0fSk7XG5cblx0dmFyIHZtID0ge1xuXHRcdHZhcmlhdGlvbjogdmFyaWF0aW9uLFxuXHRcdHN0YXRlOiBzdGF0ZSxcblxuXHRcdGNzc0NsYXNzOiBjc3NDbGFzc0NvbXB1dGVkLFxuXHRcdHN0eWxlOiBzdHlsZUNvbXB1dGVkLFxuXG5cdFx0ZXZlbnRIYW5kbGVyczoge31cblx0fTtcblxuXG5cdGZ1bmN0aW9uIGNyZWF0ZUVuYWJsZXIoYmVoYXZpb3VyLCBwcm9wcykge1xuXHRcdHJldHVybiB7XG5cdFx0XHRlbmFibGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRiZWhhdmlvdXIodm0sIGNvbmZpZyk7XG5cdFx0XHR9LFxuXHRcdFx0ZGlzYWJsZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHByb3BzLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuXHRcdFx0XHRcdGlmICh2bS5ldmVudEhhbmRsZXJzW3Byb3BdKSB7XG5cdFx0XHRcdFx0XHRkZWxldGUgdm0uZXZlbnRIYW5kbGVyc1twcm9wXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHR2bS5iZWhhdmlvdXJzID0ge1xuXHRcdGhvdmVyOiBjcmVhdGVFbmFibGVyKGhvdmVyQmVoYXZpb3VyLCBbXCJtb3VzZW92ZXJcIiwgXCJtb3VzZW91dFwiXSksXG5cdFx0Zm9jdXM6IGNyZWF0ZUVuYWJsZXIoZm9jdXNCZWhhdmlvdXIsIFtcImZvY3VzXCIsIFwiYmx1clwiXSksXG5cdFx0Y2xpY2s6IGNyZWF0ZUVuYWJsZXIoY2xpY2tCZWhhdmlvdXIsIFtcIm1vdXNlZG93blwiLCBcIm1vdXNldXBcIl0pLFxuXHRcdHNlbGVjdDogY3JlYXRlRW5hYmxlcihzZWxlY3RCZWhhdmlvdXIsIFtcIm1vdXNlZG93blwiLCBcIm1vdXNldXBcIl0pXG5cdH07XG5cblx0cmV0dXJuIHZtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJhc2VWbTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlU3R5bGVDb25maWcodGhlbWUpIHtcblxuXHR2YXIgdGlueWNvbG9yID0gcmVxdWlyZShcInRpbnljb2xvcjJcIik7XG5cblx0cmV0dXJuIHtcblx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5ibGFja1xuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zZWNvbmRhcnlDb2xvcikubGlnaHRlbigpLnRvU3RyaW5nKClcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zZWNvbmRhcnlDb2xvcikuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmRhcmtlbigpLnRvU3RyaW5nKClcblx0XHRcdH0sXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUubWVkaXVtR3JheSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5saWdodEdyYXlcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwicHJpbWFyeVwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5wcmltYXJ5Q29sb3IsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUucHJpbWFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnByaW1hcnlDb2xvcikubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjp0aW55Y29sb3IodGhlbWUucHJpbWFyeUNvbG9yKS5saWdodGVuKCkudG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnByaW1hcnlDb2xvcikuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUucHJpbWFyeUNvbG9yKS5kYXJrZW4oKS50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmxpZ2h0R3JheSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5kYXJrR3JheSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmRhcmtHcmF5XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcInRhYlwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmJsYWNrXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zZWNvbmRhcnlDb2xvcikubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5saWdodGVuKCkudG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubGlnaHRHcmF5XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcInBhZ2luYXRpb25cIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5zdWNjZXNzLmJhY2tncm91bmQsXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnN1Y2Nlc3MuYmFja2dyb3VuZCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zdWNjZXNzLmJhY2tncm91bmQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zdWNjZXNzLmJhY2tncm91bmQpLmxpZ2h0ZW4oKS50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc3VjY2Vzcy5iYWNrZ3JvdW5kKS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zdWNjZXNzLmJhY2tncm91bmQpLmRhcmtlbigpLnRvU3RyaW5nKClcblx0XHRcdH0sXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubWVkaXVtR3JheSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLm1lZGl1bUdyYXlcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwibW9kYWxIZWFkXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3Jcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcImFjdGlvblwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmluZm8udGV4dCxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuaW5mby50ZXh0LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuaW5mby50ZXh0XG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmluZm8udGV4dCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5pbmZvLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcImRhbmdlclwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5lcnJvci50ZXh0LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmVycm9yLnRleHQsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5lcnJvci50ZXh0XG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmVycm9yLnRleHQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IudGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwiaW5mb1wiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOnRoZW1lLmluZm8uYmFja2dyb3VuZCxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5pbmZvLmJhY2tncm91bmQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby5iYWNrZ3JvdW5kKS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby5iYWNrZ3JvdW5kKS5saWdodGVuKCkudG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmluZm8uYmFja2dyb3VuZCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby5iYWNrZ3JvdW5kKS5kYXJrZW4oKS50b1N0cmluZygpXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcInN1Y2Nlc3NcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc3VjY2Vzcy5iYWNrZ3JvdW5kLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnN1Y2Nlc3MuYmFja2dyb3VuZCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zdWNjZXNzLmJhY2tncm91bmQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zdWNjZXNzLmJhY2tncm91bmQpLmxpZ2h0ZW4oKS50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc3VjY2Vzcy5iYWNrZ3JvdW5kKS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zdWNjZXNzLmJhY2tncm91bmQpLmRhcmtlbigpLnRvU3RyaW5nKClcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwid2FybmluZ1wiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53YXJuaW5nLmJhY2tncm91bmQsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2FybmluZy5iYWNrZ3JvdW5kLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLndhcm5pbmcuYmFja2dyb3VuZCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLndhcm5pbmcuYmFja2dyb3VuZCkubGlnaHRlbigpLnRvU3RyaW5nKClcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS53YXJuaW5nLmJhY2tncm91bmQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLndhcm5pbmcuYmFja2dyb3VuZCkuZGFya2VuKCkudG9TdHJpbmcoKVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJlcnJvclwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5lcnJvci5iYWNrZ3JvdW5kLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmVycm9yLmJhY2tncm91bmQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IuYmFja2dyb3VuZCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmVycm9yLmJhY2tncm91bmQpLmxpZ2h0ZW4oKS50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IuYmFja2dyb3VuZCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IuYmFja2dyb3VuZCkuZGFya2VuKCkudG9TdHJpbmcoKVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSAnPGJ1dHRvbiBkYXRhLWJpbmQ9XCJjc3M6IGNzc0NsYXNzLFxcblx0XHRcdFx0XHRzdHlsZTogc3R5bGUsXFxuXHRcdFx0XHRcdGNsaWNrOiBjbGljayxcXG5cdFx0XHRcdFx0ZXZlbnQ6IGV2ZW50SGFuZGxlcnMsXFxuXHRcdFx0XHRcdGRpc2FibGU6IHN0YXRlKCkgPT09IFxcJ2Rpc2FibGVkXFwnXCI+XFxuXFxuXHQ8c3BhbiBjbGFzcz1cImljb24td3JhcHBlclwiIGRhdGEtYmluZD1cImlmOiBsZWZ0SWNvblwiPlxcblx0XHQ8c3ZnIGNsYXNzPVwiaWNvblwiPlxcblx0XHRcdDx1c2UgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgZGF0YS1iaW5kPVwiYXR0cjoge1xcJ3hsaW5rOmhyZWZcXCc6IGxlZnRJY29ufVwiIHhsaW5rOmhyZWY9XCJcIj48L3VzZT5cXG5cdFx0PC9zdmc+XFxuXHQ8L3NwYW4+XFxuXFxuXHQ8c3BhbiBjbGFzcz1cImxhYmVsXCIgZGF0YS1iaW5kPVwidGV4dDogbGFiZWxcIj48L3NwYW4+XFxuXFxuXHQ8c3BhbiBjbGFzcz1cImljb24td3JhcHBlclwiIGRhdGEtYmluZD1cImlmOiByaWdodEljb25cIj5cXG5cdFx0PHN2ZyBjbGFzcz1cImljb25cIj5cXG5cdFx0XHQ8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIGRhdGEtYmluZD1cImF0dHI6IHtcXCd4bGluazpocmVmXFwnOiByaWdodEljb259XCIgeGxpbms6aHJlZj1cIlwiPjwvdXNlPlxcblx0XHQ8L3N2Zz5cXG5cdDwvc3Bhbj5cXG48L2J1dHRvbj4nOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlU3R5bGVDb25maWcodGhlbWUpIHtcblxuXHR2YXIgdGlueWNvbG9yID0gcmVxdWlyZShcInRpbnljb2xvcjJcIik7XG5cblx0cmV0dXJuIHtcblx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvclxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zZWNvbmRhcnlDb2xvcikubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zZWNvbmRhcnlDb2xvcikuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLm1lZGl1bUdyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubGlnaHRHcmF5XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdFwicHJpbWFyeVwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5wcmltYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUucHJpbWFyeUNvbG9yLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUucHJpbWFyeUNvbG9yXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5wcmltYXJ5Q29sb3IpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6dGlueWNvbG9yKHRoZW1lLnByaW1hcnlDb2xvcikubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnByaW1hcnlDb2xvcikuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUucHJpbWFyeUNvbG9yKS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmRhcmtHcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuZGFya0dyYXlcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwidGFiXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuYmxhY2tcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5saWdodGVuKCkudG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5saWdodGVuKCkudG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5saWdodEdyYXlcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwicGFnaW5hdGlvblwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zZWNvbmRhcnlDb2xvcikubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubWVkaXVtR3JheSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLm1lZGl1bUdyYXlcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwibW9kYWxIZWFkXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3Jcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcImFjdGlvblwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmluZm8udGV4dCxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuaW5mby50ZXh0LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuaW5mby50ZXh0XG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmluZm8udGV4dCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5pbmZvLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcImRhbmdlclwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5lcnJvci50ZXh0LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmVycm9yLnRleHQsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5lcnJvci50ZXh0XG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmVycm9yLnRleHQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IudGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwiaW5mb1wiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOnRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmluZm8udGV4dCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5pbmZvLnRleHQsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5pbmZvLnRleHRcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmluZm8udGV4dCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmluZm8udGV4dCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmluZm8udGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby50ZXh0KS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwic3VjY2Vzc1wiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5zdWNjZXNzLnRleHQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuc3VjY2Vzcy50ZXh0LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuc3VjY2Vzcy50ZXh0XG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zdWNjZXNzLnRleHQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zdWNjZXNzLnRleHQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zdWNjZXNzLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnN1Y2Nlc3MudGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcIndhcm5pbmdcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2FybmluZy50ZXh0LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndhcm5pbmcudGV4dCxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndhcm5pbmcudGV4dFxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUud2FybmluZy50ZXh0KS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUud2FybmluZy50ZXh0KS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUud2FybmluZy50ZXh0KS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS53YXJuaW5nLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJlcnJvclwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5lcnJvci50ZXh0LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmVycm9yLnRleHQsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5lcnJvci50ZXh0XG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5lcnJvci50ZXh0KS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IudGV4dCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmVycm9yLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmVycm9yLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVTdHlsZUNvbmZpZyh0aGVtZSkge1xuXG5cdHZhciB0aW55Y29sb3IgPSByZXF1aXJlKFwidGlueWNvbG9yMlwiKTtcblxuXHRyZXR1cm4ge1xuXHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJib3JkZXJSYWRpdXNcIjogXCI1cHhcIixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zZWNvbmRhcnlDb2xvcikubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUubWVkaXVtR3JheSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5saWdodEdyYXlcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0XCJwcmltYXJ5XCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnByaW1hcnlDb2xvcixcblx0XHRcdFx0XCJib3JkZXJSYWRpdXNcIjogXCI1cHhcIixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5wcmltYXJ5Q29sb3IsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5wcmltYXJ5Q29sb3Jcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnByaW1hcnlDb2xvcikubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjp0aW55Y29sb3IodGhlbWUucHJpbWFyeUNvbG9yKS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUucHJpbWFyeUNvbG9yKS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5wcmltYXJ5Q29sb3IpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuZGFya0dyYXksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5kYXJrR3JheVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJ0YWJcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiYm9yZGVyUmFkaXVzXCI6IFwiNXB4XCIsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5ibGFja1xuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmxpZ2h0ZW4oKS50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmxpZ2h0ZW4oKS50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmxpZ2h0R3JheSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmxpZ2h0R3JheVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJwYWdpbmF0aW9uXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3Jcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5tZWRpdW1HcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubWVkaXVtR3JheVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJtb2RhbEhlYWRcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvclxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3Jcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwiYWN0aW9uXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuaW5mby50ZXh0LFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5pbmZvLnRleHQsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5pbmZvLnRleHRcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby50ZXh0KS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmluZm8udGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwiZGFuZ2VyXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmVycm9yLnRleHQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuZXJyb3IudGV4dCxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmVycm9yLnRleHRcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IudGV4dCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5lcnJvci50ZXh0KS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJpbmZvXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6dGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuaW5mby50ZXh0LFxuXHRcdFx0XHRcImJvcmRlclJhZGl1c1wiOiBcIjVweFwiLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmluZm8udGV4dCxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmluZm8udGV4dFxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby50ZXh0KS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby50ZXh0KS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby50ZXh0KS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5pbmZvLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJzdWNjZXNzXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnN1Y2Nlc3MudGV4dCxcblx0XHRcdFx0XCJib3JkZXJSYWRpdXNcIjogXCI1cHhcIixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5zdWNjZXNzLnRleHQsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5zdWNjZXNzLnRleHRcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnN1Y2Nlc3MudGV4dCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnN1Y2Nlc3MudGV4dCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnN1Y2Nlc3MudGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc3VjY2Vzcy50ZXh0KS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwid2FybmluZ1wiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53YXJuaW5nLnRleHQsXG5cdFx0XHRcdFwiYm9yZGVyUmFkaXVzXCI6IFwiNXB4XCIsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2FybmluZy50ZXh0LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2FybmluZy50ZXh0XG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS53YXJuaW5nLnRleHQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS53YXJuaW5nLnRleHQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS53YXJuaW5nLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLndhcm5pbmcudGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcImVycm9yXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmVycm9yLnRleHQsXG5cdFx0XHRcdFwiYm9yZGVyUmFkaXVzXCI6IFwiNXB4XCIsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuZXJyb3IudGV4dCxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmVycm9yLnRleHRcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmVycm9yLnRleHQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5lcnJvci50ZXh0KS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IudGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IudGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlQ29uZmlnKHRoZW1lKSB7XG5cblx0dmFyIHRpbnljb2xvciA9IHJlcXVpcmUoXCJ0aW55Y29sb3IyXCIpO1xuXG5cdHJldHVybiB7XG5cdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmxpZ2h0ZW4oKS50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5kYXJrZW4oKS50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLm1lZGl1bUdyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubGlnaHRHcmF5XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcInByaW1hcnlcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5ibGFja1xuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUucHJpbWFyeUNvbG9yKS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOnRpbnljb2xvcih0aGVtZS5wcmltYXJ5Q29sb3IpLmxpZ2h0ZW4oKS50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUucHJpbWFyeUNvbG9yKS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5wcmltYXJ5Q29sb3IpLmRhcmtlbigpLnRvU3RyaW5nKClcblx0XHRcdH0sXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmRhcmtHcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuZGFya0dyYXlcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwidGFiXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuYmxhY2tcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmxpZ2h0ZW4oKS50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5saWdodEdyYXlcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwicGFnaW5hdGlvblwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnN1Y2Nlc3MuYmFja2dyb3VuZCxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc3VjY2Vzcy5iYWNrZ3JvdW5kLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnN1Y2Nlc3MuYmFja2dyb3VuZCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnN1Y2Nlc3MuYmFja2dyb3VuZCkubGlnaHRlbigpLnRvU3RyaW5nKClcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zdWNjZXNzLmJhY2tncm91bmQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnN1Y2Nlc3MuYmFja2dyb3VuZCkuZGFya2VuKCkudG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5tZWRpdW1HcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubWVkaXVtR3JheVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJtb2RhbEhlYWRcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvclxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3Jcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwiYWN0aW9uXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuaW5mby50ZXh0LFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5pbmZvLnRleHQsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5pbmZvLnRleHRcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby50ZXh0KS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmluZm8udGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwiZGFuZ2VyXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmVycm9yLnRleHQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuZXJyb3IudGV4dCxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmVycm9yLnRleHRcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IudGV4dCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5lcnJvci50ZXh0KS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJpbmZvXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6dGhlbWUuaW5mby5iYWNrZ3JvdW5kLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmluZm8uYmFja2dyb3VuZCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5pbmZvLmJhY2tncm91bmQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5pbmZvLmJhY2tncm91bmQpLmxpZ2h0ZW4oKS50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby5iYWNrZ3JvdW5kKS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5pbmZvLmJhY2tncm91bmQpLmRhcmtlbigpLnRvU3RyaW5nKClcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwic3VjY2Vzc1wiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5zdWNjZXNzLmJhY2tncm91bmQsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc3VjY2Vzcy5iYWNrZ3JvdW5kLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnN1Y2Nlc3MuYmFja2dyb3VuZCkubGlnaHRlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnN1Y2Nlc3MuYmFja2dyb3VuZCkubGlnaHRlbigpLnRvU3RyaW5nKClcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zdWNjZXNzLmJhY2tncm91bmQpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnN1Y2Nlc3MuYmFja2dyb3VuZCkuZGFya2VuKCkudG9TdHJpbmcoKVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJ3YXJuaW5nXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndhcm5pbmcuYmFja2dyb3VuZCxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53YXJuaW5nLmJhY2tncm91bmQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUud2FybmluZy5iYWNrZ3JvdW5kKS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUud2FybmluZy5iYWNrZ3JvdW5kKS5saWdodGVuKCkudG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLndhcm5pbmcuYmFja2dyb3VuZCkuZGFya2VuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUud2FybmluZy5iYWNrZ3JvdW5kKS5kYXJrZW4oKS50b1N0cmluZygpXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcImVycm9yXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmVycm9yLmJhY2tncm91bmQsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuZXJyb3IuYmFja2dyb3VuZCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5lcnJvci5iYWNrZ3JvdW5kKS5saWdodGVuKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IuYmFja2dyb3VuZCkubGlnaHRlbigpLnRvU3RyaW5nKClcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5lcnJvci5iYWNrZ3JvdW5kKS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5lcnJvci5iYWNrZ3JvdW5kKS5kYXJrZW4oKS50b1N0cmluZygpXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbnZhciBiYXNlID0gcmVxdWlyZShcIi4uL2Jhc2Uvdm1cIik7XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1dHRvbihjb25maWcpIHtcblx0aWYgKCFjb25maWcpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmIChjb25maWcuY2xpY2sgJiYgdHlwZW9mIGNvbmZpZy5jbGljayAhPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY2xpY2sgaGFzIHRvIGJlIGEgZnVuY3Rpb24hXCIpO1xuXHR9XG5cblx0aWYgKCFjb25maWcubGFiZWwgJiYgIWNvbmZpZy5sZWZ0SWNvbiAmJiAhY29uZmlnLnJpZ2h0SWNvbiAmJiAhY29uZmlnLmljb24pIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJlaXRoZXIgbGFiZWwvbGVmdGljb24vcmlnaHRpY29uL2ljb24gaGFzIHRvIGJlIGdpdmVuIVwiKTtcblx0fVxuXG5cdGNvbmZpZy5jb21wb25lbnQgPSBcImJ1dHRvblwiO1xuXG5cdHZhciB2bSA9IGJhc2UoY29uZmlnKTtcblxuXHR2bS5iZWhhdmlvdXJzLmhvdmVyLmVuYWJsZSgpO1xuXG5cdGlmIChjb25maWcucmFkaW8pIHtcblx0XHR2bS5iZWhhdmlvdXJzLnNlbGVjdC5lbmFibGUoKTtcblx0fSBlbHNlIHtcblx0XHR2bS5iZWhhdmlvdXJzLmNsaWNrLmVuYWJsZSgpO1xuXHR9XG5cblx0dm0ubGVmdEljb24gPSBrby5vYnNlcnZhYmxlKGtvLnVud3JhcChjb25maWcubGVmdEljb24gfHwgY29uZmlnLmljb24pKTtcblx0dm0ucmlnaHRJY29uID0ga28ub2JzZXJ2YWJsZShrby51bndyYXAoY29uZmlnLnJpZ2h0SWNvbikpO1xuXHR2bS5sYWJlbCA9IGtvLm9ic2VydmFibGUoa28udW53cmFwKGNvbmZpZy5sYWJlbCkpO1xuXHR2bS52YWx1ZSA9IGNvbmZpZy52YWx1ZTtcblx0dm0uY2xpY2sgPSBjb25maWcuY2xpY2sgfHwgZnVuY3Rpb24oKSB7fTtcblxuXHRyZXR1cm4gdm07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQnV0dG9uO1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vKi9cblxuLy9USElTIEZJTEUgU0hPVUxEIEJFIEdFTkVSQVRFRFxuXG52YXIgcmVnaXN0ZXJDb21wb25lbnQgPSByZXF1aXJlKFwiLi9rbm9iUmVnaXN0ZXJDb21wb25lbnRcIik7XG5cbnZhciBiYXNlVm0gPSByZXF1aXJlKFwiLi9iYXNlL3ZtXCIpO1xuXG52YXIgY3JlYXRlQnV0dG9uU3R5bGU7XG52YXIgY3JlYXRlQnV0dG9uU3R5bGVEZWZhdWx0ID0gcmVxdWlyZShcIi4vYnV0dG9uL3N0eWxlXCIpO1xudmFyIGNyZWF0ZUJ1dHRvblN0eWxlVGhlbWUyID0gcmVxdWlyZShcIi4vYnV0dG9uL3RoZW1lMlwiKTtcbnZhciBjcmVhdGVCdXR0b25TdHlsZVRoZW1lMyA9IHJlcXVpcmUoXCIuL2J1dHRvbi90aGVtZTNcIik7XG52YXIgY3JlYXRlQnV0dG9uU3R5bGVUaGVtZTQgPSByZXF1aXJlKFwiLi9idXR0b24vdGhlbWU0XCIpO1xuXG52YXIgY3JlYXRlSW5wdXRTdHlsZTtcbnZhciBjcmVhdGVJbnB1dFN0eWxlRGVmYXVsdCA9IHJlcXVpcmUoXCIuL2lucHV0L3N0eWxlXCIpO1xudmFyIGNyZWF0ZUlucHV0U3R5bGVUaGVtZTIgPSByZXF1aXJlKFwiLi9pbnB1dC90aGVtZTJcIik7XG52YXIgY3JlYXRlSW5wdXRTdHlsZVRoZW1lMyA9IHJlcXVpcmUoXCIuL2lucHV0L3RoZW1lM1wiKTtcbnZhciBjcmVhdGVJbnB1dFN0eWxlVGhlbWU0ID0gcmVxdWlyZShcIi4vaW5wdXQvdGhlbWU0XCIpO1xuXG52YXIgY3JlYXRlTW9kYWxTdHlsZTtcbnZhciBjcmVhdGVNb2RhbFN0eWxlRGVmYXVsdCA9IHJlcXVpcmUoXCIuL21vZGFsL3N0eWxlXCIpO1xudmFyIGNyZWF0ZU1vZGFsU3R5bGVUaGVtZTIgPSByZXF1aXJlKFwiLi9tb2RhbC90aGVtZTJcIik7XG52YXIgY3JlYXRlTW9kYWxTdHlsZVRoZW1lMyA9IHJlcXVpcmUoXCIuL21vZGFsL3RoZW1lM1wiKTtcbnZhciBjcmVhdGVNb2RhbFN0eWxlVGhlbWU0ID0gcmVxdWlyZShcIi4vbW9kYWwvdGhlbWU0XCIpO1xuXG52YXIgY3JlYXRlUGFnZWRMaXN0U3R5bGU7XG52YXIgY3JlYXRlUGFnZWRMaXN0U3R5bGVEZWZhdWx0ID0gcmVxdWlyZShcIi4vcGFnZWRMaXN0L3N0eWxlXCIpO1xudmFyIGNyZWF0ZVBhZ2VkTGlzdFN0eWxlVGhlbWUyID0gcmVxdWlyZShcIi4vcGFnZWRMaXN0L3RoZW1lMlwiKTtcbnZhciBjcmVhdGVQYWdlZExpc3RTdHlsZVRoZW1lMyA9IHJlcXVpcmUoXCIuL3BhZ2VkTGlzdC90aGVtZTNcIik7XG52YXIgY3JlYXRlUGFnZWRMaXN0U3R5bGVUaGVtZTQgPSByZXF1aXJlKFwiLi9wYWdlZExpc3QvdGhlbWU0XCIpO1xuXG52YXIgY3JlYXRlTm90aWZpY2F0aW9uU3R5bGU7XG52YXIgY3JlYXRlTm90aWZpY2F0aW9uU3R5bGVEZWZhdWx0ID0gcmVxdWlyZShcIi4vbm90aWZpY2F0aW9uQmFyL3N0eWxlXCIpO1xudmFyIGNyZWF0ZU5vdGlmaWNhdGlvblN0eWxlVGhlbWUyID0gcmVxdWlyZShcIi4vbm90aWZpY2F0aW9uQmFyL3RoZW1lMlwiKTtcbnZhciBjcmVhdGVOb3RpZmljYXRpb25TdHlsZVRoZW1lMyA9IHJlcXVpcmUoXCIuL25vdGlmaWNhdGlvbkJhci90aGVtZTNcIik7XG52YXIgY3JlYXRlTm90aWZpY2F0aW9uU3R5bGVUaGVtZTQgPSByZXF1aXJlKFwiLi9ub3RpZmljYXRpb25CYXIvdGhlbWU0XCIpO1xuXG5mdW5jdGlvbiBpbml0S25vYihjb25maWcpIHtcblxuXHR2YXIgY29sb3JTZXQgPSBjb25maWcuY29sb3JTZXQ7XG5cdHZhciB0aGVtZSA9IGNvbmZpZy50aGVtZTtcblxuXHRpZiAodHlwZW9mIHRoZW1lID09PSBcIm9iamVjdFwiKSB7XG5cblx0XHRpZiAodHlwZW9mIHRoZW1lLmNyZWF0ZUJ1dHRvblN0eWxlICE9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy50aGVtZS5jcmVhdGVCdXR0b25TdHlsZSBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiB0aGVtZS5jcmVhdGVJbnB1dFN0eWxlICE9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy50aGVtZS5jcmVhdGVJbnB1dFN0eWxlIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIHRoZW1lLmNyZWF0ZU1vZGFsU3R5bGUgIT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnRoZW1lLmNyZWF0ZU1vZGFsU3R5bGUgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgdGhlbWUuY3JlYXRlUGFnZWRMaXN0U3R5bGUgIT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnRoZW1lLmNyZWF0ZVBhZ2VkTGlzdFN0eWxlIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIHRoZW1lLmNyZWF0ZU5vdGlmaWNhdGlvblN0eWxlICE9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy50aGVtZS5jcmVhdGVOb3RpZmljYXRpb25TdHlsZSBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG5cdFx0fVxuXG5cdFx0Y3JlYXRlQnV0dG9uU3R5bGUgPSB0aGVtZS5jcmVhdGVCdXR0b25TdHlsZTtcblx0XHRjcmVhdGVJbnB1dFN0eWxlID0gdGhlbWUuY3JlYXRlSW5wdXRTdHlsZTtcblx0XHRjcmVhdGVNb2RhbFN0eWxlID0gdGhlbWUuY3JlYXRlTW9kYWxTdHlsZTtcblx0XHRjcmVhdGVQYWdlZExpc3RTdHlsZSA9IHRoZW1lLmNyZWF0ZVBhZ2VkTGlzdFN0eWxlO1xuXHRcdGNyZWF0ZU5vdGlmaWNhdGlvblN0eWxlID0gdGhlbWUuY3JlYXRlTm90aWZpY2F0aW9uU3R5bGU7XG5cblx0fSBlbHNlIGlmICh0eXBlb2YgdGhlbWUgPT09IFwic3RyaW5nXCIpIHtcblxuXHRcdGlmICh0aGVtZSA9PT0gXCJ0aGVtZTJcIikge1xuXHRcdFx0Y3JlYXRlQnV0dG9uU3R5bGUgPSBjcmVhdGVCdXR0b25TdHlsZVRoZW1lMjtcblx0XHRcdGNyZWF0ZUlucHV0U3R5bGUgPSBjcmVhdGVJbnB1dFN0eWxlVGhlbWUyO1xuXHRcdFx0Y3JlYXRlTW9kYWxTdHlsZSA9IGNyZWF0ZU1vZGFsU3R5bGVUaGVtZTI7XG5cdFx0XHRjcmVhdGVQYWdlZExpc3RTdHlsZSA9IGNyZWF0ZVBhZ2VkTGlzdFN0eWxlVGhlbWUyO1xuXHRcdFx0Y3JlYXRlTm90aWZpY2F0aW9uU3R5bGUgPSBjcmVhdGVOb3RpZmljYXRpb25TdHlsZVRoZW1lMjtcblxuXHRcdH0gZWxzZSBpZiAodGhlbWUgPT09IFwidGhlbWUzXCIpe1xuXHRcdFx0Y3JlYXRlQnV0dG9uU3R5bGUgPSBjcmVhdGVCdXR0b25TdHlsZVRoZW1lMztcblx0XHRcdGNyZWF0ZUlucHV0U3R5bGUgPSBjcmVhdGVJbnB1dFN0eWxlVGhlbWUzO1xuXHRcdFx0Y3JlYXRlTW9kYWxTdHlsZSA9IGNyZWF0ZU1vZGFsU3R5bGVUaGVtZTM7XG5cdFx0XHRjcmVhdGVQYWdlZExpc3RTdHlsZSA9IGNyZWF0ZVBhZ2VkTGlzdFN0eWxlVGhlbWUzO1xuXHRcdFx0Y3JlYXRlTm90aWZpY2F0aW9uU3R5bGUgPSBjcmVhdGVOb3RpZmljYXRpb25TdHlsZVRoZW1lMztcblx0XHR9IGVsc2UgaWYgKHRoZW1lID09PSBcInRoZW1lNFwiKSB7XG5cdFx0XHRjcmVhdGVCdXR0b25TdHlsZSA9IGNyZWF0ZUJ1dHRvblN0eWxlVGhlbWU0O1xuXHRcdFx0Y3JlYXRlSW5wdXRTdHlsZSA9IGNyZWF0ZUlucHV0U3R5bGVUaGVtZTQ7XG5cdFx0XHRjcmVhdGVNb2RhbFN0eWxlID0gY3JlYXRlTW9kYWxTdHlsZVRoZW1lNDtcblx0XHRcdGNyZWF0ZVBhZ2VkTGlzdFN0eWxlID0gY3JlYXRlUGFnZWRMaXN0U3R5bGVUaGVtZTQ7XG5cdFx0XHRjcmVhdGVOb3RpZmljYXRpb25TdHlsZSA9IGNyZWF0ZU5vdGlmaWNhdGlvblN0eWxlVGhlbWU0O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjcmVhdGVCdXR0b25TdHlsZSA9IGNyZWF0ZUJ1dHRvblN0eWxlRGVmYXVsdDtcblx0XHRcdGNyZWF0ZUlucHV0U3R5bGUgPSBjcmVhdGVJbnB1dFN0eWxlRGVmYXVsdDtcblx0XHRcdGNyZWF0ZU1vZGFsU3R5bGUgPSBjcmVhdGVNb2RhbFN0eWxlRGVmYXVsdDtcblx0XHRcdGNyZWF0ZVBhZ2VkTGlzdFN0eWxlID0gY3JlYXRlUGFnZWRMaXN0U3R5bGVEZWZhdWx0O1xuXHRcdFx0Y3JlYXRlTm90aWZpY2F0aW9uU3R5bGUgPSBjcmVhdGVOb3RpZmljYXRpb25TdHlsZURlZmF1bHQ7XG5cdFx0fVxuXG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnRoZW1lIHNob3VsZCBiZSBhIGZ1bmN0aW9uIG9yIGEgc3RyaW5nXCIpO1xuXHR9XG5cblx0dmFyIGJ1dHRvblN0eWxlID0gY3JlYXRlQnV0dG9uU3R5bGUoY29sb3JTZXQpO1xuXG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1idXR0b25cIiwgcmVxdWlyZShcIi4vYnV0dG9uL3ZtXCIpLCByZXF1aXJlKFwiLi9idXR0b24vdGVtcGxhdGUuaHRtbFwiKSwgYnV0dG9uU3R5bGUpO1xuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItaW5wdXRcIiwgcmVxdWlyZShcIi4vaW5wdXQvdm1cIiksIHJlcXVpcmUoXCIuL2lucHV0L3RlbXBsYXRlLmh0bWxcIiksIGNyZWF0ZUlucHV0U3R5bGUoY29sb3JTZXQpKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLXJhZGlvXCIsIHJlcXVpcmUoXCIuL3JhZGlvL3ZtXCIpLCByZXF1aXJlKFwiLi9yYWRpby90ZW1wbGF0ZS5odG1sXCIpKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWlubGluZS10ZXh0LWVkaXRvclwiLCByZXF1aXJlKFwiLi9pbmxpbmVUZXh0RWRpdG9yL3ZtXCIpLCByZXF1aXJlKFwiLi9pbmxpbmVUZXh0RWRpdG9yL3RlbXBsYXRlLmh0bWxcIikpO1xuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItZHJvcGRvd25cIiwgcmVxdWlyZShcIi4vZHJvcGRvd24vdm1cIiksIHJlcXVpcmUoXCIuL2Ryb3Bkb3duL3RlbXBsYXRlLmh0bWxcIikpO1xuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItcGFnaW5hdGlvblwiLCByZXF1aXJlKFwiLi9wYWdpbmF0aW9uL3ZtXCIpLCByZXF1aXJlKFwiLi9wYWdpbmF0aW9uL3RlbXBsYXRlLmh0bWxcIiksIGJ1dHRvblN0eWxlKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWl0ZW1zLXBlci1wYWdlXCIsIHJlcXVpcmUoXCIuL2l0ZW1zUGVyUGFnZS92bVwiKSwgcmVxdWlyZShcIi4vaXRlbXNQZXJQYWdlL3RlbXBsYXRlLmh0bWxcIikpO1xuXG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1wYWdlZC1saXN0XCIsIHJlcXVpcmUoXCIuL3BhZ2VkTGlzdC92bVwiKSwgcmVxdWlyZShcIi4vcGFnZWRMaXN0L3RlbXBsYXRlLmh0bWxcIiksIGNyZWF0ZVBhZ2VkTGlzdFN0eWxlKGNvbG9yU2V0KSk7XG5cblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLW1vZGFsXCIsIHJlcXVpcmUoXCIuL21vZGFsL3ZtXCIpLCByZXF1aXJlKFwiLi9tb2RhbC90ZW1wbGF0ZS5odG1sXCIpLCBjcmVhdGVNb2RhbFN0eWxlKGNvbG9yU2V0KSk7XG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1jb25maXJtXCIsIHJlcXVpcmUoXCIuL21vZGFsL2NvbmZpcm0vdm1cIiksIHJlcXVpcmUoXCIuL21vZGFsL2NvbmZpcm0vdGVtcGxhdGUuaHRtbFwiKSwgY3JlYXRlTW9kYWxTdHlsZShjb2xvclNldCkpO1xuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItYWxlcnRcIiwgcmVxdWlyZShcIi4vbW9kYWwvYWxlcnQvdm1cIiksIHJlcXVpcmUoXCIuL21vZGFsL2FsZXJ0L3RlbXBsYXRlLmh0bWxcIiksIGNyZWF0ZU1vZGFsU3R5bGUoY29sb3JTZXQpKTtcblxuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItdGFic1wiLCByZXF1aXJlKFwiLi90YWJzL3ZtXCIpLCByZXF1aXJlKFwiLi90YWJzL3RlbXBsYXRlLmh0bWxcIikpO1xuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItdGFiXCIsIHJlcXVpcmUoXCIuL3RhYnMvdGFiL3ZtXCIpLCByZXF1aXJlKFwiLi90YWJzL3RhYi90ZW1wbGF0ZS5odG1sXCIpLCBidXR0b25TdHlsZSk7XG5cblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLW5vdGlmaWNhdGlvblwiLCByZXF1aXJlKFwiLi9ub3RpZmljYXRpb25CYXIvdm1cIiksIHJlcXVpcmUoXCIuL25vdGlmaWNhdGlvbkJhci90ZW1wbGF0ZS5odG1sXCIpLCBjcmVhdGVOb3RpZmljYXRpb25TdHlsZShjb2xvclNldCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdDogaW5pdEtub2IsXG5cblx0cmVnaXN0ZXJDb21wb25lbnQ6IHJlZ2lzdGVyQ29tcG9uZW50LFxuXHRiYXNlOiB7XG5cdFx0dm06IGJhc2VWbVxuXHR9XG59O1xuLy8iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwia25vYi1kcm9wZG93blwiPlxcblx0PCEtLSB3aXRoIHBhcmFtcywgdGhlIHNlbGVjdGVkKCkubGFiZWwgd29uXFwndCBiZSByZWNhbGN1bGF0ZWQsIHdoZW4gc2VsZWN0ZWQgaXMgY2hhbmdlZC4uLiAtLT5cXG5cdDxkaXYgZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0cGFyYW1zOiB7bGFiZWw6IHNlbGVjdGVkKCkubGFiZWwsXFxuXHRcdFx0XHRcdFx0aWNvbjogc2VsZWN0ZWQoKS5pY29uLFxcblx0XHRcdFx0XHRcdHJpZ2h0SWNvbjogcmlnaHRJY29uLFxcblx0XHRcdFx0XHRcdGNsaWNrOiBkcm9wZG93blZpc2libGUudG9nZ2xlfX1cIj5cXG5cdDwvZGl2Plxcblx0PGRpdiBjbGFzcz1cImtub2ItZHJvcGRvd24tbWVudVwiIGRhdGEtYmluZD1cImZvcmVhY2g6IG9wdGlvbnMsIHZpc2libGU6IGRyb3Bkb3duVmlzaWJsZVwiPlxcblx0XHQ8ZGl2IGRhdGEtYmluZD1cImNvbXBvbmVudDoge1xcblx0XHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0XHRwYXJhbXM6IHtsYWJlbDogbGFiZWwsIGljb246IGljb24sIGNsaWNrOiBzZWxlY3R9fSwgXFxuXHRcdFx0XHRcdFx0XHR2aXNpYmxlOiAkZGF0YSAhPT0gJHBhcmVudC5zZWxlY3RlZCgpXCI+XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cblxuZnVuY3Rpb24gY3JlYXRlQnV0dG9uRHJvcGRvd24oY29uZmlnKSB7XG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHRpZiAoIWNvbmZpZy5yaWdodEljb24pIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcucmlnaHRJY29uIGVsZW1lbnQgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXHRpZiAoIWNvbmZpZy5pdGVtcykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5pdGVtcyBlbGVtZW50IGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblx0aWYgKGNvbmZpZy5zZWxlY3RlZCAmJiAha28uaXNPYnNlcnZhYmxlKGNvbmZpZy5zZWxlY3RlZCkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc2VsZWN0ZWQgaGFzIHRvIGJlIGEga25vY2tvdXQgb2JzZXJ2YWJsZSFcIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLml0ZW1zLmxlbmd0aCA9PT0gMCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5pdGVtcyBzaG91bGQgbm90IGJlIGVtcHR5XCIpO1xuXHR9XG5cblx0dmFyIHJpZ2h0SWNvbiA9IGtvLm9ic2VydmFibGUoY29uZmlnLnJpZ2h0SWNvbik7XG5cblx0dmFyIG9wdGlvbnMgPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xuXG5cdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGNvbmZpZy5pdGVtcy5sZW5ndGg7IGlkeCArPSAxKSB7XG5cblx0XHRpZiAoIWNvbmZpZy5pdGVtc1tpZHhdLmxhYmVsICYmICFjb25maWcuaXRlbXNbaWR4XS5pY29uKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJlYWNoIGVsZW1lbnQgb2YgY29uZmlnLml0ZW1zIGhhcyB0byBoYXZlIGxhYmVsIGFuZC9vciBpY29uIHByb3BlcnR5XCIpO1xuXHRcdH1cblx0XHRvcHRpb25zLnB1c2goY3JlYXRlT3B0aW9uKHtcblx0XHRcdGxhYmVsOiBjb25maWcuaXRlbXNbaWR4XS5sYWJlbCxcblx0XHRcdGljb246IGNvbmZpZy5pdGVtc1tpZHhdLmljb24sXG5cdFx0XHR2YWx1ZTogY29uZmlnLml0ZW1zW2lkeF0udmFsdWVcblx0XHR9KSk7XG5cdH1cblxuXHQvLyBjb25zb2xlLmxvZyhvcHRpb25zKCkpO1xuXG5cdHZhciBzZWxlY3RlZCA9IGNvbmZpZy5zZWxlY3RlZCB8fCBrby5vYnNlcnZhYmxlKCk7XG5cblx0c2VsZWN0ZWQob3B0aW9ucygpW2NvbmZpZy5zZWxlY3RlZElkeCB8fCAwXSk7XG5cblx0dmFyIGRyb3Bkb3duVmlzaWJsZSA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuXG5cdGRyb3Bkb3duVmlzaWJsZS50b2dnbGUgPSBmdW5jdGlvbiB0b2dnbGVEcm9wZG93blZpc2libGUoaXRlbSwgZXZlbnQpIHtcblx0XHRpZiAoZXZlbnQpIHtcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdH1cblxuXHRcdHZhciB2aXNpYmxlID0gZHJvcGRvd25WaXNpYmxlKCk7XG5cblx0XHRkcm9wZG93blZpc2libGUoIXZpc2libGUpO1xuXG5cdFx0Ly8gc2hvdWxkIHJlbW92ZSB0aGlzIHdoZW4gdGVzdCBpbiBwaGFudG9tanNcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICh2aXNpYmxlKSB7XG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRvZ2dsZURyb3Bkb3duVmlzaWJsZSwgZmFsc2UpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRvZ2dsZURyb3Bkb3duVmlzaWJsZSwgZmFsc2UpO1xuXHRcdH1cblx0fTtcblxuXHRmdW5jdGlvbiBjcmVhdGVPcHRpb24oY29uZmlnKSB7XG5cdFx0dmFyIG9iaiA9IHtcblx0XHRcdGxhYmVsOiBrby5vYnNlcnZhYmxlKGNvbmZpZy5sYWJlbCksXG5cdFx0XHRpY29uOiBrby5vYnNlcnZhYmxlKGNvbmZpZy5pY29uKSxcblx0XHRcdHZhbHVlOiBjb25maWcudmFsdWUsXG5cdFx0XHRzZWxlY3Q6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzZWxlY3RlZChvYmopO1xuXHRcdFx0XHRkcm9wZG93blZpc2libGUudG9nZ2xlKCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiBvYmo7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHJpZ2h0SWNvbjogcmlnaHRJY29uLFxuXG5cdFx0c2VsZWN0ZWQ6IHNlbGVjdGVkLFxuXHRcdG9wdGlvbnM6IG9wdGlvbnMsXG5cblx0XHRkcm9wZG93blZpc2libGU6IGRyb3Bkb3duVmlzaWJsZVxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJ1dHRvbkRyb3Bkb3duO1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPHNwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAhZWRpdE1vZGUoKVwiPlxcblx0XHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiB2YWx1ZVwiPjwvc3Bhbj5cXG5cdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cImxhYmVsOiBcXCdcXCcsIGNsaWNrOiBlZGl0LCBpY29uOiBcXCcjaWNvbi1lZGl0XFwnXCI+XFxuXHQ8L3NwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBlZGl0TW9kZVwiPlxcblx0XHQ8a25vYi1pbnB1dCBwYXJhbXM9XCJ2YWx1ZTogZWRpdGVkVmFsdWUsIGhhc0ZvY3VzOiBpbnB1dEhhc0ZvY3VzLCBrZXlEb3duOiBrZXlEb3duLCB2aXNpYmxlOiBlZGl0TW9kZVwiPjwva25vYi1pbnB1dD5cXG5cdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cImxhYmVsOiBcXCdcXCcsIGNsaWNrOiBzYXZlLCBpY29uOiBcXCcjaWNvbi1kb25lXFwnXCI+PC9rbm9iLWJ1dHRvbj5cXG5cdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cImxhYmVsOiBcXCdcXCcsIGNsaWNrOiBjYW5jZWwsIGljb246IFxcJyNpY29uLWNsb3NlXFwnXCI+PC9rbm9iLWJ1dHRvbj5cXG5cdDwvc3Bhbj5cXG48L3NwYW4+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUlubGluZVRleHRFZGl0b3IoY29uZmlnKSB7XG5cdHZhciB2bSA9IHt9O1xuXG5cdHZhciBjb25maWcgPSBjb25maWcgfHwge307XG5cblx0aWYgKGNvbmZpZy52YWx1ZSAmJiAha28uaXNPYnNlcnZhYmxlKGNvbmZpZy52YWx1ZSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudmFsdWUgaGFzIHRvIGJlIGFuIG9ic2VydmFibGUhXCIpO1xuXHR9XG5cblx0dm0udmFsdWUgPSBjb25maWcudmFsdWUgfHwga28ub2JzZXJ2YWJsZShcIlwiKTtcblx0dm0uZWRpdGVkVmFsdWUgPSBrby5vYnNlcnZhYmxlKHZtLnZhbHVlKCkpO1xuXG5cdHZtLmVkaXRNb2RlID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG5cblx0dm0uZWRpdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZtLmVkaXRlZFZhbHVlKHZtLnZhbHVlKCkpO1xuXHRcdHZtLmVkaXRNb2RlKHRydWUpO1xuXHRcdHZtLmlucHV0SGFzRm9jdXModHJ1ZSk7XG5cdH07XG5cblx0dm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZtLnZhbHVlKHZtLmVkaXRlZFZhbHVlKCkpO1xuXHRcdHZtLmVkaXRNb2RlKGZhbHNlKTtcblx0fTtcblxuXHR2bS5jYW5jZWwgPSBmdW5jdGlvbigpIHtcblx0XHR2bS5lZGl0TW9kZShmYWxzZSk7XG5cdH07XG5cblx0dm0ua2V5RG93biA9IGZ1bmN0aW9uKGl0ZW0sIGV2ZW50KSB7XG5cdFx0aWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG5cdFx0XHRyZXR1cm4gdm0uc2F2ZSgpO1xuXHRcdH1cblxuXHRcdGlmIChldmVudC5rZXlDb2RlID09PSAyNykge1xuXHRcdFx0cmV0dXJuIHZtLmNhbmNlbCgpO1xuXHRcdH1cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fTtcblxuXHR2bS5pbnB1dEhhc0ZvY3VzID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG5cblx0cmV0dXJuIHZtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUlubGluZVRleHRFZGl0b3I7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlQ29uZmlnKHRoZW1lKSB7XG5cdHJldHVybiB7XG5cdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImJvcmRlci1jb2xvclwiOiB0aGVtZS5kYXJrR3JheVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJib3JkZXItY29sb3JcIjogdGhlbWUuZGFya0dyYXlcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLnByaW1hcnlDb2xvcixcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLnByaW1hcnlDb2xvclxuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubGlnaHRHcmF5XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxpbnB1dCBkYXRhLWJpbmQ9XCJjc3M6IGNzc0NsYXNzLFxcblx0XHRcdFx0XHRzdHlsZTogc3R5bGUsXFxuXHRcdFx0XHRcdGF0dHI6IHt0eXBlOiB0eXBlLCBwbGFjZWhvbGRlcjogcGxhY2Vob2xkZXJ9LFxcblx0XHRcdFx0XHRldmVudDogZXZlbnRIYW5kbGVycyxcXG5cdFx0XHRcdFx0aGFzRm9jdXM6IGhhc0ZvY3VzLFxcblx0XHRcdFx0XHRkaXNhYmxlOiBzdGF0ZSgpID09PSBcXCdkaXNhYmxlZFxcJyxcXG5cdFx0XHRcdFx0dmFsdWU6IHZhbHVlLFxcblx0XHRcdFx0XHR2YWx1ZVVwZGF0ZTogXFwnYWZ0ZXJrZXlkb3duXFwnXCIgLz4nOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlU3R5bGVDb25maWcodGhlbWUpIHtcblx0cmV0dXJuIHtcblx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiYm9yZGVyLWNvbG9yXCI6IHRoZW1lLmRhcmtHcmF5XG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImJvcmRlci1jb2xvclwiOiB0aGVtZS5kYXJrR3JheVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUucHJpbWFyeUNvbG9yLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUucHJpbWFyeUNvbG9yXG5cdFx0XHR9LFxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmxpZ2h0R3JheSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5saWdodEdyYXlcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuXG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbnZhciBiYXNlID0gcmVxdWlyZShcIi4uL2Jhc2Uvdm1cIik7XG5cbmZ1bmN0aW9uIGNyZWF0ZUlucHV0KGNvbmZpZykge1xuXG5cdGlmICghY29uZmlnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLnZhbHVlICYmICFrby5pc09ic2VydmFibGUoY29uZmlnLnZhbHVlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy52YWx1ZSBtdXN0IGJlIGFuIG9ic2VydmFibGVcIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLmhhc0ZvY3VzICYmICFrby5pc09ic2VydmFibGUoY29uZmlnLmhhc0ZvY3VzKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5oYXNGb2N1cyBtdXN0IGJlIGFuIG9ic2VydmFibGVcIik7XG5cdH1cblxuXHRjb25maWcuY29tcG9uZW50ID0gXCJpbnB1dFwiO1xuXHRjb25maWcudHlwZSA9IGNvbmZpZy50eXBlIHx8IFwidGV4dFwiO1xuXHRjb25maWcucGxhY2Vob2xkZXIgPSBjb25maWcucGxhY2Vob2xkZXIgfHwgXCJcIjtcblxuXHR2YXIgdm0gPSBiYXNlKGNvbmZpZyk7XG5cblx0dm0uYmVoYXZpb3Vycy5ob3Zlci5lbmFibGUoKTtcblx0dm0uYmVoYXZpb3Vycy5mb2N1cy5lbmFibGUoKTtcblxuXHR2bS5wbGFjZWhvbGRlciA9IGNvbmZpZy5wbGFjZWhvbGRlcjtcblx0dm0udHlwZSA9IGNvbmZpZy50eXBlO1xuXHR2bS52YWx1ZSA9IGNvbmZpZy52YWx1ZSB8fCBrby5vYnNlcnZhYmxlKCk7XG5cdHZtLmhhc0ZvY3VzID0gY29uZmlnLmhhc0ZvY3VzIHx8IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuXG5cdGlmIChjb25maWcua2V5RG93bikge1xuXHRcdHZtLmV2ZW50SGFuZGxlcnMua2V5ZG93biA9IGNvbmZpZy5rZXlEb3duO1xuXHR9XG5cblx0cmV0dXJuIHZtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUlucHV0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGtub2ItZHJvcGRvd24gcGFyYW1zPVwiXFxuXHRyaWdodEljb246IFxcJyNpY29uLWV4cGFuZC1tb3JlXFwnLFxcblx0c2VsZWN0ZWQ6IGl0ZW1zUGVyUGFnZSxcXG5cdGl0ZW1zOiBpdGVtc1BlclBhZ2VMaXN0XCI+XFxuPC9rbm9iLWRyb3Bkb3duPic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUl0ZW1zUGVyUGFnZShjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdGlmICghY29uZmlnLm51bU9mSXRlbXMpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcubnVtT2ZJdGVtcyBlbGVtZW50IGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLml0ZW1zUGVyUGFnZUxpc3QpIHtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNvbmZpZy5pdGVtc1BlclBhZ2VMaXN0Lmxlbmd0aDsgaSArPSAxKSB7XG5cblx0XHRcdGlmICghY29uZmlnLml0ZW1zUGVyUGFnZUxpc3RbaV0udmFsdWUgJiYgIWNvbmZpZy5pdGVtc1BlclBhZ2VMaXN0W2ldLmxhYmVsKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcImVhY2ggZWxlbWVudCBvZiBjb25maWcuaXRlbXMgaGFzIHRvIGhhdmUgbGFiZWwgYW5kL29yIHZhbHVlIHByb3BlcnR5XCIpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHR9XG5cblx0dmFyIG51bU9mSXRlbXMgPSBjb25maWcubnVtT2ZJdGVtcztcblxuXHR2YXIgaXRlbXNQZXJQYWdlTGlzdCA9IGNvbmZpZy5pdGVtc1BlclBhZ2VMaXN0IHx8IFt7XG5cdFx0bGFiZWw6IDEwLFxuXHRcdHZhbHVlOiAxMFxuXHR9LCB7XG5cdFx0bGFiZWw6IDI1LFxuXHRcdHZhbHVlOiAyNVxuXHR9LCB7XG5cdFx0bGFiZWw6IDUwLFxuXHRcdHZhbHVlOiA1MFxuXHR9LCB7XG5cdFx0bGFiZWw6IDEwMCxcblx0XHR2YWx1ZTogMTAwXG5cdH1dO1xuXG5cdHZhciBpdGVtc1BlclBhZ2UgPSBrby5vYnNlcnZhYmxlKGl0ZW1zUGVyUGFnZUxpc3RbMF0pO1xuXG5cdHZhciBudW1PZlBhZ2VzID0gY29uZmlnLm51bU9mUGFnZXMgfHwga28ub2JzZXJ2YWJsZSgpO1xuXG5cdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBudW1PZkl0ZW1zVmFsID0gbnVtT2ZJdGVtcygpO1xuXHRcdHZhciBpdGVtc1BlclBhZ2VWYWwgPSBpdGVtc1BlclBhZ2UoKTtcblxuXHRcdGlmICghaXRlbXNQZXJQYWdlVmFsKSB7XG5cdFx0XHRyZXR1cm4gbnVtT2ZQYWdlcygwKTtcblx0XHR9XG5cblx0XHRpZiAoY29uZmlnLml0ZW1zUGVyUGFnZSkge1xuXHRcdFx0Y29uZmlnLml0ZW1zUGVyUGFnZShpdGVtc1BlclBhZ2VWYWwudmFsdWUpO1xuXHRcdH1cblxuXHRcdHJldHVybiBudW1PZlBhZ2VzKE1hdGguY2VpbChudW1PZkl0ZW1zVmFsIC8gaXRlbXNQZXJQYWdlVmFsLnZhbHVlKSk7XG5cdH0pO1xuXG5cdHJldHVybiB7XG5cdFx0bnVtT2ZJdGVtczogbnVtT2ZJdGVtcyxcblx0XHRpdGVtc1BlclBhZ2U6IGl0ZW1zUGVyUGFnZSxcblx0XHRudW1PZlBhZ2VzOiBudW1PZlBhZ2VzLFxuXG5cdFx0aXRlbXNQZXJQYWdlTGlzdDogaXRlbXNQZXJQYWdlTGlzdFxuXHR9O1xufTtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxuZnVuY3Rpb24ga25vYlJlZ2lzdGVyQ29tcG9uZW50KG5hbWUsIGNyZWF0ZVZtLCB0ZW1wbGF0ZSwgc3R5bGUpIHtcblx0a28uY29tcG9uZW50cy5yZWdpc3RlcihuYW1lLCB7XG5cdFx0dmlld01vZGVsOiB7XG5cdFx0XHRjcmVhdGVWaWV3TW9kZWw6IGZ1bmN0aW9uKHBhcmFtcywgY29tcG9uZW50SW5mbykge1xuXHRcdFx0XHRwYXJhbXMuc3R5bGUgPSBzdHlsZTtcblx0XHRcdFx0cmV0dXJuIGNyZWF0ZVZtKHBhcmFtcywgY29tcG9uZW50SW5mbyk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga25vYlJlZ2lzdGVyQ29tcG9uZW50O1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUxpc3QoY29uZmlnKSB7XG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHRpZiAoIWNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcInN0b3JlXCIpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnN0b3JlIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoIWNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcImZpZWxkc1wiKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5maWVsZHMgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmICghY29uZmlnLmhhc093blByb3BlcnR5KFwic29ydFwiKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zb3J0IGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoIWNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcInNlYXJjaFwiKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zZWFyY2ggaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgY29uZmlnLnN0b3JlICE9PSBcIm9iamVjdFwiKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNlYXJjaCBtdXN0IGJlIGFuIG9iamVjdCFcIik7XG5cdH1cblxuXHRpZiAoIShjb25maWcuZmllbGRzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmZpZWxkcyBtdXN0IGJlIGFuIGFycmF5IVwiKTtcblx0fVxuXG5cdGlmICghKGNvbmZpZy5zb3J0IGluc3RhbmNlb2YgQXJyYXkpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNvcnQgbXVzdCBiZSBhbiBhcnJheSFcIik7XG5cdH1cblxuXHRpZiAodHlwZW9mIGNvbmZpZy5zZWFyY2ggIT09IFwic3RyaW5nXCIpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc2VhcmNoIG11c3QgYmUgYSBzdHJpbmchXCIpO1xuXHR9XG5cblx0aWYgKGNvbmZpZy5maWVsZHMuaW5kZXhPZihjb25maWcuc2VhcmNoKSA9PT0gLTEpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuZmllbGRzIG11c3QgY29udGFpbiB0aGUgdmFsdWUgb2YgY29uZmlnLnNlYXJjaCFcIik7XG5cdH1cblxuXHR2YXIgb3JkZXJGaWVsZDtcblxuXHRpZiAoY29uZmlnLm9yZGVyQnkpIHtcblx0XHRpZiAodHlwZW9mIGNvbmZpZy5vcmRlckJ5ICE9PSBcIm9iamVjdFwiKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcub3JkZXJCeSBtdXN0IGhhdmUgdGhlIGZvcm1hdCBvZiB7IDxrZXk+OiBbMTstMV0gfSBcIik7XG5cdFx0fVxuXG5cdFx0b3JkZXJGaWVsZCA9IE9iamVjdC5rZXlzKGNvbmZpZy5vcmRlckJ5KVswXTtcblx0XHRpZiAoY29uZmlnLmZpZWxkcy5pbmRleE9mKG9yZGVyRmllbGQpID09PSAtMSB8fCBNYXRoLmFicyhjb25maWcub3JkZXJCeVtvcmRlckZpZWxkXSkgIT09IDEpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5vcmRlckJ5IG11c3QgaGF2ZSB0aGUgZm9ybWF0IG9mIHsgPGtleT46IFsxOy0xXSB9IFwiKTtcblx0XHR9XG5cblx0XHR2YXIgc29ydENvbnRhaW5zT3JkZXJGaWVsZCA9IGZhbHNlO1xuXG5cdFx0Y29uZmlnLnNvcnQuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRpZiAoaXRlbS52YWx1ZSA9PT0gb3JkZXJGaWVsZCkge1xuXHRcdFx0XHRzb3J0Q29udGFpbnNPcmRlckZpZWxkID0gdHJ1ZTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKCFzb3J0Q29udGFpbnNPcmRlckZpZWxkKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc29ydCBtdXN0IGNvbnRhaW4gdGhlIHZhbHVlIG9mIGNvbmZpZy5vcmRlckJ5IVwiKTtcblx0XHR9XG5cdH1cblxuXHRjb25maWcuc29ydC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRpZiAoY29uZmlnLmZpZWxkcy5pbmRleE9mKGl0ZW0udmFsdWUpID09PSAtMSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwidmFsdWVzIG9mIGNvbmZpZy5zb3J0IG11c3QgYmUgaW4gY29uZmlnLmZpZWxkcyFcIik7XG5cdFx0fVxuXHR9KTtcblxuXHR2YXIgc3RvcmUgPSBjb25maWcuc3RvcmU7XG5cdHZhciBmaWVsZHMgPSBjb25maWcuZmllbGRzO1xuXG5cdHZhciBzZWFyY2ggPSBrby5vYnNlcnZhYmxlKFwiXCIpLmV4dGVuZCh7XG5cdFx0dGhyb3R0bGU6IGNvbmZpZy50aHJvdHRsZSB8fCA1MDBcblx0fSk7XG5cblx0dmFyIHNvcnRPcHRpb25zID0gW107XG5cblx0dmFyIGRlZmF1bHRPcmRlcklkeDtcblxuXHRmdW5jdGlvbiBjcmVhdGVRdWVyeU9iaihwcm9wLCBhc2MpIHtcblx0XHR2YXIgb2JqID0ge307XG5cblx0XHRvYmpbcHJvcF0gPSBhc2M7XG5cblx0XHRpZiAob3JkZXJGaWVsZCAmJiBwcm9wID09PSBvcmRlckZpZWxkICYmIGFzYyA9PT0gY29uZmlnLm9yZGVyQnlbb3JkZXJGaWVsZF0pIHtcblx0XHRcdGRlZmF1bHRPcmRlcklkeCA9IHNvcnRPcHRpb25zLmxlbmd0aDtcblx0XHR9XG5cblx0XHRyZXR1cm4gb2JqO1xuXHR9XG5cblx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgY29uZmlnLnNvcnQubGVuZ3RoOyBpZHggKz0gMSkge1xuXHRcdHZhciBhY3QgPSBjb25maWcuc29ydFtpZHhdO1xuXG5cdFx0c29ydE9wdGlvbnMucHVzaCh7XG5cdFx0XHRpY29uOiBcIiNpY29uLXNvcnQtYXNjXCIsXG5cdFx0XHRsYWJlbDogYWN0LmxhYmVsLFxuXHRcdFx0dmFsdWU6IGNyZWF0ZVF1ZXJ5T2JqKGFjdC52YWx1ZSwgMSlcblx0XHR9KTtcblx0XHRzb3J0T3B0aW9ucy5wdXNoKHtcblx0XHRcdGljb246IFwiI2ljb24tc29ydC1kZXNjXCIsXG5cdFx0XHRsYWJlbDogYWN0LmxhYmVsLFxuXHRcdFx0dmFsdWU6IGNyZWF0ZVF1ZXJ5T2JqKGFjdC52YWx1ZSwgLTEpXG5cdFx0fSk7XG5cdH1cblxuXHR2YXIgc29ydCA9IGtvLm9ic2VydmFibGUoc29ydE9wdGlvbnNbZGVmYXVsdE9yZGVySWR4IHx8IDBdKTtcblx0dmFyIHNvcnRJZHggPSBkZWZhdWx0T3JkZXJJZHggfHwgMDtcblxuXHR2YXIgc2tpcCA9IGtvLm9ic2VydmFibGUoMCk7XG5cdHZhciBsaW1pdCA9IGtvLm9ic2VydmFibGUoMCk7XG5cblx0dmFyIGl0ZW1zID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcblxuXHRzdG9yZS5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHsgLy9zdG9yZSA9PT0gdGhpc1xuXHRcdGl0ZW1zLnB1c2goaXRlbSk7XG5cdH0pO1xuXG5cdHZhciBjb3VudCA9IGtvLm9ic2VydmFibGUoMCk7IC8vc2hvdWxkIGJlIHJlYWQtb25seVxuXG5cdHZhciBsb2FkaW5nID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7IC8vc2hvdWxkIGJlIHJlYWQtb25seVxuXHR2YXIgZXJyb3IgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTsgLy9zaG91bGQgYmUgcmVhZC1vbmx5P1xuXG5cdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzZWFyY2hWYWwgPSBzZWFyY2goKTtcblx0XHR2YXIgc29ydFZhbCA9IHNvcnQoKS52YWx1ZTtcblx0XHR2YXIgc2tpcFZhbCA9IHNraXAoKTtcblx0XHR2YXIgbGltaXRWYWwgPSBsaW1pdCgpO1xuXG5cdFx0dmFyIGZpbmQgPSB7fTtcblxuXHRcdGZpbmRbY29uZmlnLnNlYXJjaF0gPSAobmV3IFJlZ0V4cChzZWFyY2hWYWwsIFwiaWdcIikpLnRvU3RyaW5nKCk7XG5cblx0XHRzdG9yZS5maW5kID0gZmluZDtcblx0XHRzdG9yZS5zb3J0ID0gc29ydFZhbDtcblx0XHRzdG9yZS5za2lwID0gc2tpcFZhbDtcblx0XHRzdG9yZS5saW1pdCA9IGxpbWl0VmFsO1xuXHR9KS5leHRlbmQoe1xuXHRcdHRocm90dGxlOiAwXG5cdH0pO1xuXG5cdGZ1bmN0aW9uIGJlZm9yZUxvYWQoKSB7XG5cdFx0aWYgKGxvYWRpbmcoKSkge1xuXHRcdFx0Y29uc29sZS5sb2coXCJMaXN0IGlzIGFscmVhZHkgbG9hZGluZy4uLlwiKTsgLy90aGlzIG1pZ2h0IGJlIHByb2JsZW1hdGljIGlmIHRoZXJlIGFyZSBubyBnb29kIHRpbWVvdXQgc2V0dGluZ3MuXG5cdFx0fVxuXG5cdFx0bG9hZGluZyh0cnVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFmdGVyTG9hZChlcnIpIHtcblx0XHRsb2FkaW5nKGZhbHNlKTtcblx0XHRpZiAoZXJyKSB7XG5cdFx0XHRyZXR1cm4gZXJyb3IoZXJyKTtcblx0XHR9XG5cdFx0ZXJyb3IobnVsbCk7XG5cblx0XHRzdG9yZS5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHsgLy9zdG9yZSA9PT0gdGhpc1xuXHRcdFx0aXRlbXMucHVzaChpdGVtKTtcblx0XHR9KTtcblxuXHRcdGNvdW50KHN0b3JlLmNvdW50KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlYWRPbmx5Q29tcHV0ZWQob2JzZXJ2YWJsZSkge1xuXHRcdHJldHVybiBrby5jb21wdXRlZCh7XG5cdFx0XHRyZWFkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG9ic2VydmFibGUoKTtcblx0XHRcdH0sXG5cdFx0XHR3cml0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRocm93IFwiVGhpcyBjb21wdXRlZCB2YXJpYWJsZSBzaG91bGQgbm90IGJlIHdyaXR0ZW4uXCI7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRzdG9yZS5sb2FkLmJlZm9yZS5hZGQoYmVmb3JlTG9hZCk7XG5cdHN0b3JlLmxvYWQuYWZ0ZXIuYWRkKGFmdGVyTG9hZCk7XG5cblx0cmV0dXJuIHtcblx0XHRzdG9yZTogc3RvcmUsXG5cblx0XHRmaWVsZHM6IGZpZWxkcywgLy9zaG91bGQgZmlsdGVyIHRvIHRoZSBmaWVsZHMuIChzZWxlY3QpXG5cblx0XHRzZWFyY2g6IHNlYXJjaCxcblxuXHRcdHNvcnQ6IHNvcnQsXG5cdFx0c29ydElkeDogc29ydElkeCxcblx0XHRzb3J0T3B0aW9uczogc29ydE9wdGlvbnMsXG5cblx0XHRza2lwOiBza2lwLFxuXHRcdGxpbWl0OiBsaW1pdCxcblxuXHRcdGl0ZW1zOiBpdGVtcyxcblx0XHRjb3VudDogcmVhZE9ubHlDb21wdXRlZChjb3VudCksXG5cblx0XHRsb2FkaW5nOiByZWFkT25seUNvbXB1dGVkKGxvYWRpbmcpLFxuXHRcdGVycm9yOiByZWFkT25seUNvbXB1dGVkKGVycm9yKVxuXHR9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXY+XFxuXHQ8a25vYi1tb2RhbCBwYXJhbXM9XCJcXG5cdFx0dGl0bGU6IHRpdGxlLFxcblx0XHRpY29uOiBpY29uLFxcblx0XHR2aXNpYmxlOiB2aXNpYmxlXCI+XFxuXFxuXHRcdDxkaXYgY2xhc3M9XCJrbm9iLWNvbmZpcm1fX2NvbnRlbnRcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiBtZXNzYWdlXCI+PC9kaXY+XFxuXHRcdDxkaXYgY2xhc3M9XCJrbm9iLWNvbmZpcm1fX2J1dHRvbnNcIj5cXG5cdFx0XHQ8a25vYi1idXR0b24gcGFyYW1zPVwiXFxuXHRcdFx0XHRsYWJlbDogb2tMYWJlbCxcXG5cdFx0XHRcdHZhcmlhdGlvbjogXFwncHJpbWFyeVxcJyxcXG5cdFx0XHRcdGNsaWNrOiBva1xcblx0XHRcdFwiPjwva25vYi1idXR0b24+XFxuXHRcdDwvZGl2Plxcblx0PC9rbm9iLW1vZGFsPlxcbjwvZGl2Plxcbic7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUFsZXJ0KGNvbmZpZykge1xuXG5cdGlmICghY29uZmlnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAodHlwZW9mIGNvbmZpZy5tZXNzYWdlICE9PSBcInN0cmluZ1wiKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLm1lc3NhZ2UgbXVzdCBiZSBhIHN0cmluZ1wiKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgY29uZmlnLm9rTGFiZWwgIT09IFwic3RyaW5nXCIpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcub2tMYWJlbCBtdXN0IGJlIGEgc3RyaW5nXCIpO1xuXHR9XG5cblx0aWYgKCFrby5pc09ic2VydmFibGUoY29uZmlnLnZpc2libGUpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnZpc2libGUgbXVzdCBiZSBhbiBvYnNlcnZhYmxlXCIpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBjb25maWcuY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5jYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG5cdH1cblxuXHR2YXIgdmlzaWJsZSA9IGNvbmZpZy52aXNpYmxlO1xuXHR2YXIgb2tMYWJlbCA9IGNvbmZpZy5va0xhYmVsO1xuXHR2YXIgY2FsbGJhY2sgPSBjb25maWcuY2FsbGJhY2s7XG5cblx0dmFyIHRpdGxlID0gY29uZmlnLnRpdGxlIHx8IFwiXCI7XG5cdHZhciBpY29uID0gY29uZmlnLmljb24gfHwgXCJcIjtcblx0dmFyIG1lc3NhZ2UgPSBjb25maWcubWVzc2FnZTtcblxuXHR2YXIgb2tMYWJlbCA9IGNvbmZpZy5va0xhYmVsO1xuXG5cdGZ1bmN0aW9uIG9rKCkge1xuXHRcdGNhbGxiYWNrKCk7XG5cdFx0dmlzaWJsZSghdmlzaWJsZSgpKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0dmlzaWJsZTogdmlzaWJsZSxcblxuXHRcdHRpdGxlOiB0aXRsZSxcblx0XHRpY29uOiBpY29uLFxuXHRcdG1lc3NhZ2U6IG1lc3NhZ2UsXG5cblx0XHRva0xhYmVsOiBva0xhYmVsLFxuXG5cdFx0b2s6IG9rXG5cdH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImtub2ItY29uZmlybVwiPlxcblx0PGtub2ItbW9kYWwgcGFyYW1zPVwiXFxuXHRcdHRpdGxlOiB0aXRsZSxcXG5cdFx0aWNvbjogaWNvbixcXG5cdFx0dmlzaWJsZTogdmlzaWJsZVwiPlxcblx0XHQ8ZGl2IGNsYXNzPVwia25vYi1jb25maXJtX19jb250ZW50XCIgZGF0YS1iaW5kPVwidGV4dDogbWVzc2FnZVwiPjwvZGl2Plxcblx0XHQ8ZGl2IGNsYXNzPVwia25vYi1jb25maXJtX19idXR0b25zXCI+XFxuXHRcdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cIlxcblx0XHRcdFx0bGFiZWw6IG9rTGFiZWwsXFxuXHRcdFx0XHR2YXJpYXRpb246IFxcJ3ByaW1hcnlcXCcsXFxuXHRcdFx0XHRjbGljazogb2tcXG5cdFx0XHRcIj48L2tub2ItYnV0dG9uPlxcblx0XHRcdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0XHRcdGxhYmVsOiBjYW5jZWxMYWJlbCxcXG5cdFx0XHRcdGNsaWNrOiBjYW5jZWxcXG5cdFx0XHRcIj48L2tub2ItYnV0dG9uPlxcblx0XHQ8L2Rpdj5cXG5cdDwva25vYi1tb2RhbD5cXG48L2Rpdj5cXG4nOyIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBjcmVhdGVDb25maXJtTW9kYWwoY29uZmlnKSB7XG5cdGlmICghY29uZmlnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoIWNvbmZpZy5tZXNzYWdlKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLm1lc3NhZ2UgZWxlbWVudCBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKCFjb25maWcub2tMYWJlbCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5va0xhYmVsIGVsZW1lbnQgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmICghY29uZmlnLmNhbmNlbExhYmVsKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmNhbmNlbExhYmVsIGVsZW1lbnQgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHR2YXIgdmlzaWJsZSA9IGNvbmZpZy52aXNpYmxlO1xuXHR2YXIgY2FsbGJhY2sgPSBjb25maWcuY2FsbGJhY2s7XG5cblx0dmFyIHRpdGxlID0gY29uZmlnLnRpdGxlIHx8IFwiXCI7XG5cdHZhciBpY29uID0gY29uZmlnLmljb24gfHwgXCJcIjtcblx0dmFyIG1lc3NhZ2UgPSBjb25maWcubWVzc2FnZTtcblxuXHR2YXIgb2tMYWJlbCA9IGNvbmZpZy5va0xhYmVsO1xuXHR2YXIgY2FuY2VsTGFiZWwgPSBjb25maWcuY2FuY2VsTGFiZWw7XG5cblxuXHRmdW5jdGlvbiBvaygpIHtcblx0XHRjYWxsYmFjayh0cnVlKTtcblx0XHR2aXNpYmxlKCF2aXNpYmxlKCkpO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2FuY2VsKCkge1xuXHRcdGNhbGxiYWNrKGZhbHNlKTtcblx0XHR2aXNpYmxlKCF2aXNpYmxlKCkpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHR2aXNpYmxlOiB2aXNpYmxlLFxuXG5cdFx0dGl0bGU6IHRpdGxlLFxuXHRcdGljb246IGljb24sXG5cdFx0bWVzc2FnZTogbWVzc2FnZSxcblxuXHRcdG9rTGFiZWw6IG9rTGFiZWwsXG5cdFx0Y2FuY2VsTGFiZWw6IGNhbmNlbExhYmVsLFxuXG5cdFx0b2s6IG9rLFxuXHRcdGNhbmNlbDogY2FuY2VsXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQ29uZmlybU1vZGFsOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlU3R5bGVDb25maWcodGhlbWUpIHtcblx0cmV0dXJuIHtcblx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiYm9yZGVyLWNvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUucHJpbWFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImJvcmRlci1jb2xvclwiOiB0aGVtZS5kYXJrR3JheVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUucHJpbWFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLnByaW1hcnlDb2xvcixcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLnByaW1hcnlDb2xvclxuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubGlnaHRHcmF5XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJrbm9iLW1vZGFsLW92ZXJsYXlcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiB2aXNpYmxlXCI+XFxuXFxuXHQ8ZGl2IGNsYXNzPVwia25vYi1tb2RhbFwiPlxcblx0XHQ8ZGl2IGNsYXNzPVwia25vYi1tb2RhbF9faGVhZGVyXCIgZGF0YS1iaW5kPVwic3R5bGU6IHN0eWxlXCI+XFxuXHRcdFx0PGtub2ItYnV0dG9uIGNsYXNzPVwiYnV0dG9uLWNsb3NlXCIgcGFyYW1zPVwidmFyaWF0aW9uOiBcXCdtb2RhbEhlYWRcXCcsIGljb246IFxcJyNpY29uLWNsb3NlXFwnLCBjbGljazogJGNvbXBvbmVudC52aXNpYmxlLnRvZ2dsZVwiPjwva25vYi1idXR0b24+XFxuXFxuXHRcdFx0PHNwYW4gY2xhc3M9XCJkZXNjXCI+XFxuXHRcdFx0XHQ8c3ZnIGNsYXNzPVwiaWNvblwiPlxcblx0XHRcdFx0XHQ8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIGRhdGEtYmluZD1cImF0dHI6IHtcXCd4bGluazpocmVmXFwnOiBpY29ufVwiIHhsaW5rOmhyZWY9XCJcIj48L3VzZT5cXG5cdFx0XHRcdDwvc3ZnPlxcblx0XHRcdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogdGl0bGVcIj48L3NwYW4+XFxuXHRcdFx0PC9zcGFuPlxcblxcblx0XHQ8L2Rpdj5cXG5cdFx0PGRpdiBjbGFzcz1cImtub2ItbW9kYWxfX2JvZHlcIj5cXG5cdFx0XHQ8IS0tIGtvIHRlbXBsYXRlOiB7IG5vZGVzOiAkY29tcG9uZW50VGVtcGxhdGVOb2RlcywgZGF0YTogJHBhcmVudCB9IC0tPjwhLS0gL2tvIC0tPlxcblx0XHQ8L2Rpdj5cXG5cdDwvZGl2PlxcbjwvZGl2Plxcbic7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVTdHlsZUNvbmZpZyh0aGVtZSkge1xuXG5cdHZhciB0aW55Y29sb3IgPSByZXF1aXJlKFwidGlueWNvbG9yMlwiKTtcblxuXHRyZXR1cm4ge1xuXHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJib3JkZXItY29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiYm9yZGVyLWNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5tZWRpdW1HcmF5KS5kYXJrZW4udG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJjb2xvclwiOiB0aW55Y29sb3IodGhlbWUubWVkaXVtR3JheSkuZGFya2VuLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aW55Y29sb3IodGhlbWUubWVkaXVtR3JheSkuZGFya2VuLnRvU3RyaW5nKClcblx0XHRcdH0sXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrXG5cdFx0XHR9LFxuXHRcdFx0XCJzdWNjZXNzXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc3VjY2Vzc0NvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImVycm9yXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuYWxlcnRDb2xvcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlU3R5bGVDb25maWcodGhlbWUpIHtcblxuXHR2YXIgdGlueWNvbG9yID0gcmVxdWlyZShcInRpbnljb2xvcjJcIik7XG5cblx0cmV0dXJuIHtcblx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiYm9yZGVyLWNvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmRhcmtlbigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiYm9yZGVyLWNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5tZWRpdW1HcmF5KS5kYXJrZW4udG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJjb2xvclwiOiB0aW55Y29sb3IodGhlbWUubWVkaXVtR3JheSkuZGFya2VuLnRvU3RyaW5nKCksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aW55Y29sb3IodGhlbWUubWVkaXVtR3JheSkuZGFya2VuLnRvU3RyaW5nKClcblx0XHRcdH0sXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrXG5cdFx0XHR9LFxuXHRcdFx0XCJzdWNjZXNzXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc3VjY2Vzc0NvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImVycm9yXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuYWxlcnRDb2xvcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIGtvID0gKHdpbmRvdy5rbyk7XG52YXIgYmFzZSA9IHJlcXVpcmUoXCIuLi9iYXNlL3ZtXCIpO1xuXG5mdW5jdGlvbiBjcmVhdGVNb2RhbChjb25maWcpIHtcblxuXHRpZiAoIWNvbmZpZykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZyBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKGNvbmZpZy52aXNpYmxlICYmICFrby5pc09ic2VydmFibGUoY29uZmlnLnZpc2libGUpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnZpc2libGUgbXVzdCBiZSBhbiBvYnNlcnZhYmxlXCIpO1xuXHR9XG5cblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdHZhciB2aXNpYmxlID0gY29uZmlnLnZpc2libGU7XG5cdHZhciB0aXRsZSA9IGNvbmZpZy50aXRsZTtcblx0dmFyIGljb24gPSBjb25maWcuaWNvbjtcblxuXHR2aXNpYmxlLnRvZ2dsZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZpc2libGUoIXZpc2libGUoKSk7XG5cdH07XG5cblx0Y29uZmlnLmNvbXBvbmVudCA9IFwibW9kYWxcIjtcblxuXHR2YXIgdm0gPSBiYXNlKGNvbmZpZyk7XG5cblx0dm0udmlzaWJsZSA9IHZpc2libGU7XG5cdHZtLnRpdGxlID0gdGl0bGU7XG5cdHZtLmljb24gPSBpY29uO1xuXG5cdHJldHVybiB2bTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVNb2RhbDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlQ29uZmlnKHRoZW1lKSB7XG5cdHJldHVybiB7XG5cdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwiaW5mb1wiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5pbmZvLmJhY2tncm91bmQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuaW5mby50ZXh0LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuaW5mby50ZXh0XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcInN1Y2Nlc3NcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc3VjY2Vzcy5iYWNrZ3JvdW5kLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLnN1Y2Nlc3MudGV4dCxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLnN1Y2Nlc3MudGV4dFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJ3YXJuaW5nXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndhcm5pbmcuYmFja2dyb3VuZCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53YXJuaW5nLnRleHQsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53YXJuaW5nLnRleHRcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwiZXJyb3JcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuZXJyb3IuYmFja2dyb3VuZCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5lcnJvci50ZXh0LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuZXJyb3IudGV4dFxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImtub2Itbm90aWZpY2F0aW9uXCIgZGF0YS1iaW5kPVwidmlzaWJsZTogdmlzaWJsZSwgc3R5bGU6IHN0eWxlXCI+XFxuXFxuXHQ8c3ZnIGNsYXNzPVwiaWNvblwiPlxcblx0XHQ8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIGRhdGEtYmluZD1cImF0dHI6IHtcXCd4bGluazpocmVmXFwnOiBpY29ufVwiIHhsaW5rOmhyZWY9XCJcIj48L3VzZT5cXG5cdDwvc3ZnPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogbWVzc2FnZVwiPjwvc3Bhbj5cXG5cdDwhLS0ga28gdGVtcGxhdGU6IHsgbm9kZXM6ICRjb21wb25lbnRUZW1wbGF0ZU5vZGVzLCBkYXRhOiAkcGFyZW50IH0gLS0+PCEtLSAva28gLS0+XFxuPC9kaXY+JzsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlQ29uZmlnKHRoZW1lKSB7XG5cdHJldHVybiB7XG5cdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwiaW5mb1wiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5pbmZvLmJhY2tncm91bmQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuaW5mby50ZXh0LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuaW5mby50ZXh0XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcInN1Y2Nlc3NcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc3VjY2Vzcy5iYWNrZ3JvdW5kLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLnN1Y2Nlc3MudGV4dCxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLnN1Y2Nlc3MudGV4dFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJ3YXJuaW5nXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLndhcm5pbmcuYmFja2dyb3VuZCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53YXJuaW5nLnRleHQsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53YXJuaW5nLnRleHRcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwiZXJyb3JcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuZXJyb3IuYmFja2dyb3VuZCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5lcnJvci50ZXh0LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuZXJyb3IudGV4dFxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVTdHlsZUNvbmZpZyh0aGVtZSkge1xuXHRyZXR1cm4ge1xuXHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcImluZm9cIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuaW5mby5iYWNrZ3JvdW5kLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwic3VjY2Vzc1wiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5zdWNjZXNzLmJhY2tncm91bmQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJ3YXJuaW5nXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndhcm5pbmcuYmFja2dyb3VuZCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcImVycm9yXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmVycm9yLmJhY2tncm91bmQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIga28gPSAod2luZG93LmtvKTtcbnZhciBiYXNlID0gcmVxdWlyZShcIi4uL2Jhc2Uvdm1cIik7XG5cbmZ1bmN0aW9uIGNyZWF0ZU5vdGlmaWNhdGlvbihjb25maWcpIHtcblxuXHRpZiAoIWNvbmZpZykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZyBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKCFjb25maWcubWVzc2FnZSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5tZXNzYWdlIGVsZW1lbnQgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmIChjb25maWcudmlzaWJsZSAmJiAha28uaXNPYnNlcnZhYmxlKGNvbmZpZy52aXNpYmxlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy52aXNpYmxlIG11c3QgYmUgYW4gb2JzZXJ2YWJsZVwiKTtcblx0fVxuXG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHR2YXIgdmlzaWJsZSA9IGNvbmZpZy52aXNpYmxlO1xuXHR2YXIgbWVzc2FnZSA9IGNvbmZpZy5tZXNzYWdlO1xuXHR2YXIgaWNvbiA9IGNvbmZpZy5pY29uO1xuXG5cdHZpc2libGUudG9nZ2xlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmlzaWJsZSghdmlzaWJsZSgpKTtcblx0fTtcblxuXHRjb25maWcuY29tcG9uZW50ID0gXCJub3RpZmljYXRpb25cIjtcblxuXHR2YXIgdm0gPSBiYXNlKGNvbmZpZyk7XG5cblx0dm0udmlzaWJsZSA9IHZpc2libGU7XG5cdHZtLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHR2bS5pY29uID0gaWNvbjtcblxuXHRyZXR1cm4gdm07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlTm90aWZpY2F0aW9uOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlU3R5bGVDb25maWcodGhlbWUpIHtcblxuXHR2YXIgdGlueWNvbG9yID0gcmVxdWlyZShcInRpbnljb2xvcjJcIik7XG5cblx0cmV0dXJuIHtcblx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiYm9yZGVyLWNvbG9yXCI6IHRoZW1lLm1lZGl1bUdyYXlcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLndoaXRlKS5kYXJrZW4oKS50b1N0cmluZygpLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImJvcmRlci1jb2xvclwiOiB0aW55Y29sb3IodGhlbWUubWVkaXVtR3JheSkuZGFya2VuLnRvU3RyaW5nKClcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiY29sb3JcIjogdGlueWNvbG9yKHRoZW1lLm1lZGl1bUdyYXkpLmRhcmtlbi50b1N0cmluZygpLFxuXHRcdFx0XHRcImZpbGxcIjogdGlueWNvbG9yKHRoZW1lLm1lZGl1bUdyYXkpLmRhcmtlbi50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmxpZ2h0R3JheSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFja1xuXHRcdFx0fSxcblx0XHRcdFwic3VjY2Vzc1wiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnN1Y2Nlc3NDb2xvcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJlcnJvclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmFsZXJ0Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwia25vYi1wYWdlbGlzdFwiPlxcblx0PCEtLSBrbyBpZjogZXJyb3IgLS0+XFxuXHRcdDxkaXYgZGF0YS1iaW5kPVwidGV4dDogZXJyb3JcIj48L2Rpdj5cXG5cdDwhLS0gL2tvIC0tPlxcblxcblx0PGRpdj5cXG5cdFx0PGRpdiBjbGFzcz1cImtub2ItcGFnZWxpc3RfX2JhclwiPlxcblx0XHRcdDxpbnB1dCBjbGFzcz1cImtub2ItaW5wdXRcIiB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cInZhbHVlOiBzZWFyY2gsIHZhbHVlVXBkYXRlOiBcXCdhZnRlcmtleWRvd25cXCdcIi8+XFxuXHRcdFx0PGtub2ItYnV0dG9uIGNsYXNzPVwia25vYi1idXR0b24tc2VhcmNoXCIgcGFyYW1zPVwibGFiZWw6IFxcJ1xcJyxcXG5cdFx0XHRcdFx0XHRcdFx0dmFyaWF0aW9uOiBcXCdkZWZhdWx0XFwnLFxcblx0XHRcdFx0XHRcdFx0XHRpY29uOiBcXCcjaWNvbi1zZWFyY2hcXCdcIj5cXG5cdFx0XHQ8L2tub2ItYnV0dG9uPlxcblx0XHRcdDxrbm9iLWl0ZW1zLXBlci1wYWdlIGNsYXNzPVwia25vYi1wYWdlbGlzdF9faXRlbXMtcGVyLXBhZ2VcIiBwYXJhbXM9XCJudW1PZkl0ZW1zOiBjb3VudCxcXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG51bU9mUGFnZXM6IG51bU9mUGFnZXMsXFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtc1BlclBhZ2U6IGl0ZW1zUGVyUGFnZVwiPlxcblx0XHRcdDwva25vYi1pdGVtcy1wZXItcGFnZT5cXG5cdFx0XHQ8IS0tIGtvIGlmOiBzb3J0T3B0aW9ucy5sZW5ndGggPiAwIC0tPlxcblx0XHRcdFx0PGtub2ItZHJvcGRvd24gY2xhc3M9XCJrbm9iLWRyb3Bkb3duXCIgcGFyYW1zPVwicmlnaHRJY29uOiBcXCcjaWNvbi1leHBhbmQtbW9yZVxcJywgc2VsZWN0ZWRJZHg6IHNvcnRJZHgsIHNlbGVjdGVkOiBzb3J0LCBpdGVtczogc29ydE9wdGlvbnNcIj48L2tub2ItZHJvcGRvd24+XFxuXHRcdFx0PCEtLSAva28gLS0+XFxuXHRcdDwvZGl2Plxcblx0XHQ8dWwgZGF0YS1iaW5kPVwiY3NzOiBsaXN0Q2xhc3MsIGZvcmVhY2g6IGl0ZW1zXCI+XFxuXHRcdFx0PGxpIGRhdGEtYmluZD1cImNzczogJHBhcmVudC5pdGVtQ2xhc3NcIj5cXG5cdFx0XHRcdDwhLS0ga28gdGVtcGxhdGU6IHsgbm9kZXM6ICRjb21wb25lbnRUZW1wbGF0ZU5vZGVzLCBkYXRhOiB7bW9kZWw6ICRkYXRhLCBwYXJlbnQ6ICRwYXJlbnQsIGluZGV4OiAkaW5kZXh9IH0gLS0+PCEtLSAva28gLS0+XFxuXHRcdFx0PC9saT5cXG5cdFx0PC91bD5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBsb2FkaW5nXCI+TG9hZGluZy4uLjwvZGl2Plxcblx0PCEtLVxcblx0PGtub2ItcGFnaW5hdGlvbiBwYXJhbXM9XCJudW1PZkl0ZW1zOiBwYWdpbmF0aW9uLm51bU9mSXRlbXMsIGl0ZW1zUGVyUGFnZTogaXRlbXNQZXJQYWdlXCI+PC9rbm9iLXBhZ2luYXRpb24+XFxuXHQtLT5cXG5cdDwhLS0ga28gaWY6IG51bU9mUGFnZXMoKSA+IDAgLS0+XFxuXHRcdDxrbm9iLXBhZ2luYXRpb24gcGFyYW1zPVwibnVtT2ZQYWdlczogbnVtT2ZQYWdlcywgY3VycmVudFBhZ2U6IGN1cnJlbnRQYWdlXCI+PC9rbm9iLXBhZ2luYXRpb24+XFxuXHQ8IS0tIC9rbyAtLT5cXG5cdDwhLS0ga28gaWY6ICRkYXRhLmxvYWRNb3JlIC0tPlxcblx0XHQ8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6ICFsb2FkaW5nKCksIGNsaWNrOiBsb2FkTW9yZVwiPkxvYWQgbW9yZS4uLjwvZGl2Plxcblx0PCEtLSAva28gLS0+XFxuPC9kaXY+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG52YXIgY3JlYXRlTGlzdCA9IHJlcXVpcmUoXCIuLi9saXN0L3ZtXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVBhZ2VkTGlzdChjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdGlmICghY29uZmlnLnN0b3JlKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnN0b3JlIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXG5cblxuXHR2YXIgc3RvcmUgPSBjb25maWcuc3RvcmU7XG5cblx0c3RvcmUubG9hZC5iZWZvcmUuYWRkKGJlZm9yZUxvYWQpO1xuXG5cdHZhciBsaXN0ID0gY3JlYXRlTGlzdChjb25maWcpO1xuXHQvL3ZhciBwYWdpbmF0aW9uID0gY3JlYXRlUGFnaW5hdGlvbihjb25maWcucGFnaW5hdGlvbik7XG5cdC8vbGlzdC5wYWdpbmF0aW9uID0gcGFnaW5hdGlvbjtcblxuXHR2YXIgbnVtT2ZQYWdlcyA9IGtvLm9ic2VydmFibGUoKTtcblx0dmFyIGl0ZW1zUGVyUGFnZSA9IGtvLm9ic2VydmFibGUoMTApO1xuXHR2YXIgY3VycmVudFBhZ2UgPSBrby5vYnNlcnZhYmxlKDApO1xuXG5cdGxpc3QubGlzdENsYXNzID0gY29uZmlnLmxpc3RDbGFzcyB8fCBcImtub2ItcGFnZWRsaXN0X19saXN0XCI7XG5cdGxpc3QuaXRlbUNsYXNzID0gY29uZmlnLml0ZW1DbGFzcyB8fCBcImtub2ItcGFnZWRsaXN0X19pdGVtXCI7XG5cdGxpc3QubnVtT2ZQYWdlcyA9IG51bU9mUGFnZXM7XG5cdGxpc3QuaXRlbXNQZXJQYWdlID0gaXRlbXNQZXJQYWdlO1xuXHRsaXN0LmN1cnJlbnRQYWdlID0gY3VycmVudFBhZ2U7XG5cblx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGN1cnJlbnRQYWdlVmFsID0gY3VycmVudFBhZ2UoKTtcblx0XHR2YXIgaXRlbXNQZXJQYWdlVmFsID0gaXRlbXNQZXJQYWdlKCk7XG5cblx0XHRsaXN0LnNraXAoY3VycmVudFBhZ2VWYWwgKiBpdGVtc1BlclBhZ2VWYWwpO1xuXHRcdGxpc3QubGltaXQoaXRlbXNQZXJQYWdlVmFsKTtcblx0fSk7XG5cblx0Lypcblx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNvdW50ID0gbGlzdC5jb3VudCgpO1xuXHRcdGxpc3QucGFnaW5hdGlvbi5udW1PZkl0ZW1zKGNvdW50KTtcblx0fSk7XG5cdCovXG5cblx0ZnVuY3Rpb24gYmVmb3JlTG9hZCgpIHtcblx0XHRsaXN0Lml0ZW1zKFtdKTtcblx0fVxuXG5cdHJldHVybiBsaXN0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJrbm9iLXBhZ2luYXRpb25cIiBkYXRhLWJpbmQ9XCJpZjogcGFnZVNlbGVjdG9ycygpLmxlbmd0aFwiPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0cGFyYW1zOiB7XFxuXHRcdFx0XHRcdFx0XHR2YXJpYXRpb246IFxcJ3BhZ2luYXRpb25cXCcsXFxuXHRcdFx0XHRcdFx0XHRpY29uOiBcXCcjaWNvbi1maXJzdC1wYWdlXFwnLFxcblx0XHRcdFx0XHRcdFx0c3RhdGU6IGZpcnN0KCkuc3RhdGUsXFxuXHRcdFx0XHRcdFx0XHRjbGljazogZmlyc3QoKS5zZWxlY3RQYWdlXFxuXHRcdFx0XHRcdFx0fVxcblx0XHRcdFx0XHR9XCI+XFxuXHQ8L3NwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtcXG5cdFx0XHRcdFx0XHRuYW1lOiBcXCdrbm9iLWJ1dHRvblxcJyxcXG5cdFx0XHRcdFx0XHRwYXJhbXM6IHtcXG5cdFx0XHRcdFx0XHRcdHZhcmlhdGlvbjogXFwncGFnaW5hdGlvblxcJyxcXG5cdFx0XHRcdFx0XHRcdGljb246IFxcJyNpY29uLWNoZXZyb24tbGVmdFxcJyxcXG5cdFx0XHRcdFx0XHRcdHN0YXRlOiBwcmV2KCkuc3RhdGUsXFxuXHRcdFx0XHRcdFx0XHRjbGljazogcHJldigpLnNlbGVjdFBhZ2VcXG5cdFx0XHRcdFx0XHR9XFxuXHRcdFx0XHRcdH1cIj5cXG5cdDwvc3Bhbj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cImZvcmVhY2g6IHBhZ2VTZWxlY3RvcnNcIj5cXG5cdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cImxhYmVsOiBsYWJlbCxcXG5cdFx0XHRcdFx0XHRcdHN0YXRlOiBzdGF0ZSxcXG5cdFx0XHRcdFx0XHRcdHZhcmlhdGlvbjogXFwncGFnaW5hdGlvblxcJyxcXG5cdFx0XHRcdFx0XHRcdGNsaWNrOiBzZWxlY3RQYWdlXCI+PC9rbm9iLWJ1dHRvbj5cXG5cdDwvc3Bhbj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cImNvbXBvbmVudDoge1xcblx0XHRcdFx0XHRcdG5hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLFxcblx0XHRcdFx0XHRcdHBhcmFtczoge1xcblx0XHRcdFx0XHRcdFx0dmFyaWF0aW9uOiBcXCdwYWdpbmF0aW9uXFwnLFxcblx0XHRcdFx0XHRcdFx0aWNvbjogXFwnI2ljb24tY2hldnJvbi1yaWdodFxcJyxcXG5cdFx0XHRcdFx0XHRcdHN0YXRlOiBuZXh0KCkuc3RhdGUsXFxuXHRcdFx0XHRcdFx0XHRjbGljazogbmV4dCgpLnNlbGVjdFBhZ2VcXG5cdFx0XHRcdFx0XHR9XFxuXHRcdFx0XHRcdH1cIj5cXG5cdDwvc3Bhbj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cImNvbXBvbmVudDoge1xcblx0XHRcdFx0XHRcdG5hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLFxcblx0XHRcdFx0XHRcdHBhcmFtczoge1xcblx0XHRcdFx0XHRcdFx0dmFyaWF0aW9uOiBcXCdwYWdpbmF0aW9uXFwnLFxcblx0XHRcdFx0XHRcdFx0aWNvbjogXFwnI2ljb24tbGFzdC1wYWdlXFwnLFxcblx0XHRcdFx0XHRcdFx0c3RhdGU6IGxhc3QoKS5zdGF0ZSxcXG5cdFx0XHRcdFx0XHRcdGNsaWNrOiBsYXN0KCkuc2VsZWN0UGFnZVxcblx0XHRcdFx0XHRcdH1cXG5cdFx0XHRcdFx0fVwiPlxcblx0PC9zcGFuPlxcbjwvZGl2Pic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVBhZ2luYXRpb24oY29uZmlnKSB7XG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHRpZiAoY29uZmlnLmFmdGVySGVhZCAmJiBjb25maWcuYWZ0ZXJIZWFkIDwgMSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5hZnRlckhlYWQgbXVzdCBiZSBsYXJnZXIgdGhhbiB6ZXJvXCIpO1xuXHR9XG5cblx0aWYgKGNvbmZpZy5iZWZvcmVUYWlsICYmIGNvbmZpZy5iZWZvcmVUYWlsIDwgMSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5iZWZvcmVUYWlsIG11c3QgYmUgbGFyZ2VyIHRoYW4gemVyb1wiKTtcblx0fVxuXG5cdGlmIChjb25maWcuYmVmb3JlQ3VycmVudCAmJiBjb25maWcuYmVmb3JlQ3VycmVudCA8IDEpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuYmVmb3JlQ3VycmVudCBtdXN0IGJlIGxhcmdlciB0aGFuIHplcm9cIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLmFmdGVyQ3VycmVudCAmJiBjb25maWcuYWZ0ZXJDdXJyZW50IDwgMSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5hZnRlckN1cnJlbnQgbXVzdCBiZSBsYXJnZXIgdGhhbiB6ZXJvXCIpO1xuXHR9XG5cblx0dmFyIG51bU9mUGFnZXM7XG5cblx0aWYgKGtvLmlzT2JzZXJ2YWJsZShjb25maWcubnVtT2ZQYWdlcykpIHtcblx0XHRudW1PZlBhZ2VzID0gY29uZmlnLm51bU9mUGFnZXM7XG5cdH0gZWxzZSB7XG5cdFx0bnVtT2ZQYWdlcyA9IGtvLm9ic2VydmFibGUoY29uZmlnLm51bU9mUGFnZXMgfHwgMTApO1xuXHR9XG5cblx0ZnVuY3Rpb24gbm9ybWFsaXplKHZhbHVlKSB7XG5cdFx0aWYgKHZhbHVlIDwgMCkge1xuXHRcdFx0dmFsdWUgPSAwO1xuXHRcdH1cblxuXHRcdHZhciBwYWdlc051bSA9IG51bU9mUGFnZXMoKTtcblxuXHRcdGlmICh2YWx1ZSA+PSBwYWdlc051bSkge1xuXHRcdFx0dmFsdWUgPSBwYWdlc051bSAtIDE7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG5cblx0dmFyIGN1cnJlbnRQYWdlID0gKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjdXJyZW50UGFnZSA9IGtvLm9ic2VydmFibGUoKTtcblxuXHRcdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdFx0bnVtT2ZQYWdlcygpO1xuXHRcdFx0Y3VycmVudFBhZ2UoMCk7XG5cdFx0fSk7XG5cblx0XHRpZiAoa28uaXNPYnNlcnZhYmxlKGNvbmZpZy5jdXJyZW50UGFnZSkpIHtcblx0XHRcdGN1cnJlbnRQYWdlID0gY29uZmlnLmN1cnJlbnRQYWdlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjdXJyZW50UGFnZSA9IGtvLm9ic2VydmFibGUobm9ybWFsaXplKGNvbmZpZy5jdXJyZW50UGFnZSkgfHwgMCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGtvLmNvbXB1dGVkKHtcblx0XHRcdHJlYWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gY3VycmVudFBhZ2UoKTtcblx0XHRcdH0sXG5cdFx0XHR3cml0ZTogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0Y3VycmVudFBhZ2Uobm9ybWFsaXplKHZhbHVlKSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0oKSk7XG5cblxuXG5cdHZhciBjdXJyZW50UGFnZVJlYWxJZHg7XG5cdHZhciBwYWdlU2VsZWN0b3JzID0gKGZ1bmN0aW9uKGNvbmZpZykge1xuXHRcdHZhciBhZnRlckhlYWQgPSBjb25maWcuYWZ0ZXJIZWFkIHx8IDI7XG5cdFx0dmFyIGJlZm9yZVRhaWwgPSBjb25maWcuYmVmb3JlVGFpbCB8fCAyO1xuXHRcdHZhciBiZWZvcmVDdXJyZW50ID0gY29uZmlnLmJlZm9yZUN1cnJlbnQgfHwgMjtcblx0XHR2YXIgYWZ0ZXJDdXJyZW50ID0gY29uZmlnLmFmdGVyQ3VycmVudCB8fCAyO1xuXG5cdFx0ZnVuY3Rpb24gY3JlYXRlUGFnZVNlbGVjdG9yKGlkeCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bGFiZWw6IGlkeCArIDEsXG5cdFx0XHRcdHN0YXRlOiBcImRlZmF1bHRcIixcblx0XHRcdFx0c2VsZWN0UGFnZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y3VycmVudFBhZ2UoaWR4KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjcmVhdGVOb25DbGlja2FibGVTZWxlY3RvcihsYWJlbCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bGFiZWw6IGxhYmVsLFxuXHRcdFx0XHRzdGF0ZTogXCJkaXNhYmxlZFwiLFxuXHRcdFx0XHRzZWxlY3RQYWdlOiBmdW5jdGlvbigpIHt9XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHJldHVybiBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHRcdHZhciBlbGVtZW50cyA9IFtdO1xuXG5cdFx0XHR2YXIgbnVtT2ZQYWdlc1ZhbCA9IG51bU9mUGFnZXMoKTtcblx0XHRcdHZhciBjdXJyZW50UGFnZVZhbCA9IGN1cnJlbnRQYWdlKCk7XG5cblx0XHRcdHZhciBub25DbGlja2FibGVJbnNlcnRlZCA9IGZhbHNlO1xuXG5cdFx0XHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCBudW1PZlBhZ2VzVmFsOyBpZHggKz0gMSkge1xuXHRcdFx0XHRpZiAoaWR4IDw9IGFmdGVySGVhZCB8fCBpZHggPj0gbnVtT2ZQYWdlc1ZhbCAtIGJlZm9yZVRhaWwgLSAxIHx8IGlkeCA+PSBjdXJyZW50UGFnZVZhbCAtIGJlZm9yZUN1cnJlbnQgJiYgaWR4IDw9IGN1cnJlbnRQYWdlVmFsICsgYWZ0ZXJDdXJyZW50KSB7XG5cdFx0XHRcdFx0dmFyIHBhZ2VTZWxlY3RvcjtcblxuXHRcdFx0XHRcdGlmIChpZHggPT09IGN1cnJlbnRQYWdlVmFsKSB7XG5cdFx0XHRcdFx0XHRwYWdlU2VsZWN0b3IgPSBjcmVhdGVOb25DbGlja2FibGVTZWxlY3RvcihpZHggKyAxKTtcblx0XHRcdFx0XHRcdGN1cnJlbnRQYWdlUmVhbElkeCA9IGVsZW1lbnRzLmxlbmd0aDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cGFnZVNlbGVjdG9yID0gY3JlYXRlUGFnZVNlbGVjdG9yKGlkeCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0ZWxlbWVudHMucHVzaChwYWdlU2VsZWN0b3IpO1xuXHRcdFx0XHRcdG5vbkNsaWNrYWJsZUluc2VydGVkID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKCFub25DbGlja2FibGVJbnNlcnRlZCkge1xuXHRcdFx0XHRcdFx0ZWxlbWVudHMucHVzaChjcmVhdGVOb25DbGlja2FibGVTZWxlY3RvcihcIi4uLlwiKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5vbkNsaWNrYWJsZUluc2VydGVkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZWxlbWVudHM7XG5cdFx0fSk7XG5cdH0oY29uZmlnKSk7XG5cblxuXHR2YXIgbmV4dCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBpZHggPSBjdXJyZW50UGFnZVJlYWxJZHggKyAxO1xuXG5cdFx0dmFyIHBhZ2VzID0gcGFnZVNlbGVjdG9ycygpO1xuXG5cdFx0aWYgKGlkeCA+PSBwYWdlcy5sZW5ndGggLSAxKSB7XG5cdFx0XHRpZHggPSBwYWdlcy5sZW5ndGggLSAxO1xuXHRcdH1cblxuXHRcdHJldHVybiBwYWdlc1tpZHhdO1xuXHR9KTtcblxuXHR2YXIgcHJldiA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBpZHggPSBjdXJyZW50UGFnZVJlYWxJZHggLSAxO1xuXG5cdFx0aWYgKGlkeCA8IDApIHtcblx0XHRcdGlkeCA9IDA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBhZ2VTZWxlY3RvcnMoKVtpZHhdO1xuXHR9KTtcblxuXHR2YXIgZmlyc3QgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gcGFnZVNlbGVjdG9ycygpWzBdO1xuXHR9KTtcblxuXHR2YXIgbGFzdCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBwYWdlcyA9IHBhZ2VTZWxlY3RvcnMoKTtcblxuXHRcdHJldHVybiBwYWdlc1twYWdlcy5sZW5ndGggLSAxXTtcblx0fSk7XG5cblxuXHRyZXR1cm4ge1xuXHRcdHBhZ2VTZWxlY3RvcnM6IHBhZ2VTZWxlY3RvcnMsXG5cblx0XHRmaXJzdDogZmlyc3QsXG5cdFx0bGFzdDogbGFzdCxcblxuXHRcdG5leHQ6IG5leHQsXG5cdFx0cHJldjogcHJldixcblxuXHRcdGN1cnJlbnRQYWdlOiBjdXJyZW50UGFnZSxcblxuXHRcdG51bU9mUGFnZXM6IG51bU9mUGFnZXNcblx0fTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwia25vYi1yYWRpb1wiIGRhdGEtYmluZD1cImZvcmVhY2g6IGl0ZW1zXCI+XFxuXHQ8ZGl2IGRhdGEtYmluZD1cImNvbXBvbmVudDoge1xcblx0XHRuYW1lOiBcXCdrbm9iLWJ1dHRvblxcJyxcXG5cdFx0cGFyYW1zOiB7XFxuXHRcdFx0c3RhdGU6IGlzU2VsZWN0ZWQoKSA/IFxcJ2FjdGl2ZVxcJyA6IFxcJ2RlZmF1bHRcXCcsXFxuXHRcdFx0dmFyaWF0aW9uOiAkcGFyZW50LnZhcmlhdGlvbixcXG5cdFx0XHRsYWJlbDogbGFiZWwsXFxuXHRcdFx0aWNvbjogaWNvbixcXG5cdFx0XHRyYWRpbzogdHJ1ZSxcXG5cdFx0XHRncm91cDogZ3JvdXAsXFxuXHRcdFx0Y2xpY2s6IHNlbGVjdFxcblx0XHR9XFxuXHR9XCI+XFxuXHQ8L2Rpdj5cXG48L2Rpdj5cXG4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxuZnVuY3Rpb24gY3JlYXRlUmFkaW8oY29uZmlnKSB7XG5cblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdHZhciB2bSA9IHt9O1xuXG5cdGlmIChjb25maWcuaXRlbXMubGVuZ3RoID09PSAwKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLml0ZW1zIHNob3VsZCBub3QgYmUgZW1wdHlcIik7XG5cdH1cblxuXHR2bS5zZWxlY3RlZCA9IGNvbmZpZy5zZWxlY3RlZCB8fCBrby5vYnNlcnZhYmxlKCk7XG5cdHZtLnNlbGVjdGVkSWR4ID0gY29uZmlnLnNlbGVjdGVkSWR4IHx8IGtvLm9ic2VydmFibGUoKTtcblxuXHR2bS52YXJpYXRpb24gPSBjb25maWcudmFyaWF0aW9uIHx8IFwiZGVmYXVsdFwiO1xuXG5cdHZtLml0ZW1zID0gW107XG5cblx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgY29uZmlnLml0ZW1zLmxlbmd0aDsgaWR4ICs9IDEpIHtcblxuXHRcdHZhciBhY3QgPSBjb25maWcuaXRlbXNbaWR4XTtcblxuXHRcdGlmICghYWN0LmxhYmVsICYmICFhY3QuaWNvbikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiZWFjaCBlbGVtZW50IG9mIGNvbmZpZy5pdGVtcyBoYXMgdG8gaGF2ZSBsYWJlbCBhbmQvb3IgaWNvbiBwcm9wZXJ0eVwiKTtcblx0XHR9XG5cblx0XHR2bS5pdGVtcy5wdXNoKGNyZWF0ZUl0ZW1WbShhY3QubGFiZWwsIGFjdC5pY29uLCBpZHgpKTtcblx0fVxuXG5cdHZhciBzZWwgPSB2bS5zZWxlY3RlZElkeCgpO1xuXG5cdGlmICh0eXBlb2Ygc2VsID09PSBcIm51bWJlclwiKSB7XG5cdFx0c2VsID0gTWF0aC5mbG9vcihzZWwpO1xuXHRcdHNlbCAlPSB2bS5pdGVtcy5sZW5ndGg7XG5cblx0XHR2bS5pdGVtc1tzZWxdLnNlbGVjdCgpO1xuXG5cdH0gZWxzZSB7XG5cdFx0dm0uaXRlbXNbMF0uc2VsZWN0KCk7XG5cdH1cblxuXHRmdW5jdGlvbiBjcmVhdGVJdGVtVm0obGFiZWwsIGljb24sIGlkeCkge1xuXG5cdFx0dmFyIG9iaiA9IHtcblx0XHRcdGxhYmVsOiBsYWJlbCxcblx0XHRcdGljb246IGljb24sXG5cdFx0XHRncm91cDogY29uZmlnLmdyb3VwLFxuXHRcdFx0c2VsZWN0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dm0uc2VsZWN0ZWQob2JqKTtcblx0XHRcdFx0dm0uc2VsZWN0ZWRJZHgoaWR4KTtcblx0XHRcdH0sXG5cdFx0XHRpc1NlbGVjdGVkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG9iaiA9PT0gdm0uc2VsZWN0ZWQoKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cmV0dXJuIG9iajtcblx0fVxuXG5cdHJldHVybiB2bTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVSYWRpbztcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgZGF0YS1iaW5kPVwiY3NzOiBjc3NDbGFzcyxcXG5cdFx0XHRcdFx0c3R5bGU6IHN0eWxlXCI+XFxuXHQ8IS0tIGtvIHRlbXBsYXRlOiB7IG5vZGVzOiAkY29tcG9uZW50VGVtcGxhdGVOb2RlcywgZGF0YTogJHBhcmVudCB9IC0tPjwhLS0gL2tvIC0tPlxcbjwvZGl2Pic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBiYXNlID0gcmVxdWlyZShcIi4uLy4uL2Jhc2Uvdm1cIik7XG5cbmZ1bmN0aW9uIGNyZWF0ZVRhYihjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXHRjb25maWcuY29tcG9uZW50ID0gXCJ0YWJcIjtcblx0Y29uZmlnLnZhcmlhdGlvbiA9IFwidGFiXCI7XG5cdGNvbmZpZy5zdGF0ZSA9IFwiYWN0aXZlXCI7XG5cblx0dmFyIHZtID0gYmFzZShjb25maWcpO1xuXG5cdHJldHVybiB2bTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVUYWI7XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2Plxcblx0PGtub2ItcmFkaW8gY2xhc3M9XCJrbm9iLXJhZGlvLS1pbmxpbmVcIiBwYXJhbXM9XCJcXG5cdFx0Z3JvdXA6IHRhYnNHcm91cCxcXG5cdFx0dmFyaWF0aW9uOiBcXCd0YWJcXCcsXFxuXHRcdHNlbGVjdGVkSWR4OiBzZWxlY3RlZElkeCxcXG5cdFx0aXRlbXM6IGJ1dHRvbnNcIj5cXG5cdDwva25vYi1yYWRpbz5cXG5cXG5cdDxkaXYgZGF0YS1iaW5kPVwiZm9yZWFjaDogcGFuZWxzXCI+XFxuXHRcdDxrbm9iLXRhYiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAkcGFyZW50LnNlbGVjdGVkSWR4KCkgPT0gJGluZGV4KClcIj5cXG5cdFx0XHQ8IS0tIGtvIHRlbXBsYXRlOiB7IG5vZGVzOiAkZGF0YSB9IC0tPjwhLS0gL2tvIC0tPlxcblx0XHQ8L2tub2ItdGFiPlxcblx0PC9kaXY+XFxuPC9kaXY+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbnZhciBuZXh0VGFic0dyb3VwSWR4ID0gMDtcblxuZnVuY3Rpb24gY29udmVydFBhcmFtc1RvT2JqZWN0KHBhcmFtcykge1xuXHRwYXJhbXMgPSBwYXJhbXMucmVwbGFjZSgvJy9nLCBcIlxcXCJcIik7XG5cblx0dmFyIHBhcmFtcyA9IHBhcmFtcy5zcGxpdChcIixcIik7XG5cblx0dmFyIGNvbnZlcnRlZFBhcmFtcyA9IFtdO1xuXG5cdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHBhcmFtcy5sZW5ndGg7IGlkeCArPSAxKSB7XG5cdFx0dmFyIGFjdCA9IHBhcmFtc1tpZHhdO1xuXG5cdFx0YWN0ID0gYWN0LnRyaW0oKTtcblxuXHRcdGFjdCA9IGFjdC5zcGxpdChcIjpcIik7XG5cblx0XHRpZiAoYWN0Lmxlbmd0aCAhPT0gMikge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0YWN0ID0gXCJcXFwiXCIgKyBhY3RbMF0gKyBcIlxcXCJcIiArIFwiOlwiICsgYWN0WzFdO1xuXHRcdGNvbnZlcnRlZFBhcmFtcy5wdXNoKGFjdCk7XG5cdH1cblxuXHRyZXR1cm4gSlNPTi5wYXJzZShcIntcIiArIGNvbnZlcnRlZFBhcmFtcy5qb2luKFwiLFwiKSArIFwifVwiKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVGFicyhjb25maWcsIGNvbXBvbmVudEluZm8pIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXHRjb21wb25lbnRJbmZvID0gY29tcG9uZW50SW5mbyB8fCB7fTtcblx0Y29tcG9uZW50SW5mby50ZW1wbGF0ZU5vZGVzID0gY29tcG9uZW50SW5mby50ZW1wbGF0ZU5vZGVzIHx8IFtdO1xuXG5cdHZhciBkZWZhdWx0VGFiID0gY29uZmlnLmRlZmF1bHRUYWIgfHwgMDtcblxuXHR2YXIgdm0gPSB7fTtcblxuXHR2YXIgdGFiQnV0dG9ucyA9IFtdO1xuXHR2YXIgdGFiUGFuZWxzID0gW107XG5cblx0dmFyIHRhYklkeCA9IDA7XG5cblx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgY29tcG9uZW50SW5mby50ZW1wbGF0ZU5vZGVzLmxlbmd0aDsgaWR4ICs9IDEpIHtcblx0XHR2YXIgYWN0VGVtcGxhdGVOb2RlID0gY29tcG9uZW50SW5mby50ZW1wbGF0ZU5vZGVzW2lkeF07XG5cblx0XHRpZiAoYWN0VGVtcGxhdGVOb2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09IFwia25vYi10YWJcIikge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0dmFyIHRhYkJ1dHRvbkRhdGEgPSBjb252ZXJ0UGFyYW1zVG9PYmplY3QoYWN0VGVtcGxhdGVOb2RlLmdldEF0dHJpYnV0ZShcInBhcmFtc1wiKSk7XG5cblx0XHR0YWJCdXR0b25EYXRhLnRhYklkeCA9IHRhYklkeDtcblx0XHR0YWJJZHggKz0gMTtcblxuXHRcdHRhYkJ1dHRvbnMucHVzaCh0YWJCdXR0b25EYXRhKTtcblxuXHRcdHRhYlBhbmVscy5wdXNoKGFjdFRlbXBsYXRlTm9kZS5jaGlsZE5vZGVzKTtcblx0fVxuXG5cdGlmICh0YWJQYW5lbHMubGVuZ3RoIDwgMSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImtub2ItdGFicyBjb21wb25lbnQgc2hvdWxkIGhhdmUgYXQgbGVhc3Qgb25lIGtub2ItdGFiIGNvbXBvbmVudCBhcyBhIGNoaWxkIGNvbXBvbmVudCFcIik7XG5cdH1cblxuXHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0YWJCdXR0b25zLmxlbmd0aDsgaWR4ICs9IDEpIHtcblx0XHR2YXIgYWN0ID0gdGFiQnV0dG9uc1tpZHhdO1xuXG5cdFx0aWYgKCFhY3QuaWNvbiAmJiAhYWN0LmxlZnRJY29uICYmICFhY3QucmlnaHRJY29uICYmICFhY3QubGFiZWwpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSBjaGlsZCBrbm9iLXRhYiBjb21wb25lbnRzIHNob3VsZCBoYXZlIHByb3BlciBwYXJhbXMgKGljb24gYW5kL29yIGxhYmVsKSBqdXN0IGxpa2Ugd2l0aCBidXR0b25zIVwiKTtcblx0XHR9XG5cdH1cblxuXHR2bS50YWJzR3JvdXAgPSBcInRhYnNHcm91cF9cIiArIG5leHRUYWJzR3JvdXBJZHg7XG5cdG5leHRUYWJzR3JvdXBJZHggKz0gMTtcblxuXHR2bS5zZWxlY3RlZElkeCA9IGtvLm9ic2VydmFibGUoZGVmYXVsdFRhYik7XG5cblx0dm0uYnV0dG9ucyA9IHRhYkJ1dHRvbnM7XG5cdHZtLnBhbmVscyA9IHRhYlBhbmVscztcblxuXHRyZXR1cm4gdm07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlVGFicztcbiJdfQ==
