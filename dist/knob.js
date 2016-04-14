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
},{"tinycolor2":1}],8:[function(require,module,exports){
module.exports = '<button data-bind="css: cssClass,\n					style: style,\n					click: click,\n					event: eventHandlers,\n					disable: state() === \'disabled\'">\n\n	<span class="icon-wrapper" data-bind="if: leftIcon">\n		<svg class="icon">\n			<use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': leftIcon}" xlink:href=""></use>\n		</svg>\n	</span>\n\n	<span class="label" data-bind="text: label"></span>\n\n	<span class="icon-wrapper" data-bind="if: rightIcon">\n		<svg class="icon">\n			<use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': rightIcon}" xlink:href=""></use>\n		</svg>\n	</span>\n</button>';
},{}],9:[function(require,module,exports){
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
},{"tinycolor2":1}],10:[function(require,module,exports){
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

},{"../base/vm":6}],11:[function(require,module,exports){
/*jslint node: true */
"use strict";

//*/

//THIS FILE SHOULD BE GENERATED

var registerComponent = require("./knobRegisterComponent");

var baseVm = require("./base/vm");

var createButtonStyle;
var createButtonStyleDefault = require("./button/style");
var createButtonStyleTheme2 = require("./button/theme2");

var createInputStyle;
var createInputStyleDefault = require("./input/style");
var createInputStyleTheme2 = require("./input/theme2");

var createModalStyle;
var createModalStyleDefault = require("./modal/style");
var createModalStyleTheme2 = require("./modal/theme2");

var createPagedListStyle;
var createPagedListStyleDefault = require("./pagedList/style");
var createPagedListStyleTheme2 = require("./pagedList/theme2");

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

		createButtonStyle = theme.createButtonStyle;
		createInputStyle = theme.createInputStyle;
		createModalStyle = theme.createModalStyle;
		createPagedListStyle = theme.createPagedListStyle;

	} else if (typeof theme === "string") {

		if (theme === "theme2") {
			createButtonStyle = createButtonStyleTheme2;
			createInputStyle = createInputStyleTheme2;
			createModalStyle = createModalStyleTheme2;
			createPagedListStyle = createPagedListStyleTheme2;
		} else {
			createButtonStyle = createButtonStyleDefault;
			createInputStyle = createInputStyleDefault;
			createModalStyle = createModalStyleDefault;
			createPagedListStyle = createPagedListStyleDefault;
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
}

module.exports = {
	init: initKnob,

	registerComponent: registerComponent,
	base: {
		vm: baseVm
	}
};
//
},{"./base/vm":6,"./button/style":7,"./button/template.html":8,"./button/theme2":9,"./button/vm":10,"./dropdown/template.html":12,"./dropdown/vm":13,"./inlineTextEditor/template.html":14,"./inlineTextEditor/vm":15,"./input/style":16,"./input/template.html":17,"./input/theme2":18,"./input/vm":19,"./itemsPerPage/template.html":20,"./itemsPerPage/vm":21,"./knobRegisterComponent":22,"./modal/alert/template.html":24,"./modal/alert/vm":25,"./modal/confirm/template.html":26,"./modal/confirm/vm":27,"./modal/style":28,"./modal/template.html":29,"./modal/theme2":30,"./modal/vm":31,"./pagedList/style":32,"./pagedList/template.html":33,"./pagedList/theme2":34,"./pagedList/vm":35,"./pagination/template.html":36,"./pagination/vm":37,"./radio/template.html":38,"./radio/vm":39,"./tabs/tab/template.html":40,"./tabs/tab/vm":41,"./tabs/template.html":42,"./tabs/vm":43}],12:[function(require,module,exports){
module.exports = '<div class="knob-dropdown">\n	<!-- with params, the selected().label won\'t be recalculated, when selected is changed... -->\n	<div data-bind="component: {\n						name: \'knob-button\',\n						params: {label: selected().label,\n						icon: selected().icon,\n						rightIcon: rightIcon,\n						click: dropdownVisible.toggle}}">\n	</div>\n	<div class="knob-dropdown-menu" data-bind="foreach: options, visible: dropdownVisible">\n		<div data-bind="component: {\n							name: \'knob-button\',\n							params: {label: label, icon: icon, click: select}}, \n							visible: $data !== $parent.selected()">\n		</div>\n	</div>\n</div>\n';
},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
module.exports = '<span>\n	<span data-bind="visible: !editMode()">\n		<span data-bind="text: value"></span>\n		<knob-button params="label: \'\', click: edit, icon: \'#icon-edit\'">\n	</span>\n	<span data-bind="visible: editMode">\n		<knob-input params="value: editedValue, hasFocus: inputHasFocus, keyDown: keyDown, visible: editMode"></knob-input>\n		<knob-button params="label: \'\', click: save, icon: \'#icon-done\'"></knob-button>\n		<knob-button params="label: \'\', click: cancel, icon: \'#icon-close\'"></knob-button>\n	</span>\n</span>';
},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
module.exports = '<input data-bind="css: cssClass,\n					style: style,\n					attr: {type: type, placeholder: placeholder},\n					event: eventHandlers,\n					hasFocus: hasFocus,\n					disable: state() === \'disabled\',\n					value: value,\n					valueUpdate: \'afterkeydown\'" />';
},{}],18:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"dup":16}],19:[function(require,module,exports){
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

},{"../base/vm":6}],20:[function(require,module,exports){
module.exports = '<knob-dropdown params="\n	rightIcon: \'#icon-expand-more\',\n	selected: itemsPerPage,\n	items: itemsPerPageList">\n</knob-dropdown>';
},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
module.exports = '<div>\n	<knob-modal params="\n		title: title,\n		icon: icon,\n		visible: visible">\n\n		<div class="knob-confirm__content" data-bind="text: message"></div>\n		<div class="knob-confirm__buttons">\n			<knob-button params="\n				label: okLabel,\n				click: ok\n			"></knob-button>\n		</div>\n	</knob-modal>\n</div>\n';
},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
module.exports = '<div class="knob-confirm">\n	<knob-modal params="\n		title: title,\n		icon: icon,\n		visible: visible">\n		<div class="knob-confirm__content" data-bind="text: message"></div>\n		<div class="knob-confirm__buttons">\n			<knob-button params="\n				label: okLabel,\n				variation: \'primary\',\n				click: ok\n			"></knob-button>\n			<knob-button params="\n				label: cancelLabel,\n				click: cancel\n			"></knob-button>\n		</div>\n	</knob-modal>\n</div>\n';
},{}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
module.exports = function createStyleConfig(theme) {

	var tinycolor = require("tinycolor2");

	return {
		"default": {
			"default": {
				"backgroundColor": theme.black,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": tinycolor(theme.black).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			}
		}
	};
};

},{"tinycolor2":1}],29:[function(require,module,exports){
module.exports = '<div class="knob-modal-overlay" data-bind="visible: visible">\n\n	<div class="knob-modal">\n		<div class="knob-modal__header" data-bind="style: style">\n			<knob-button class="button-close" params="variation: \'modalHead\', icon: \'#icon-close\', click: $component.visible.toggle"></knob-button>\n\n			<span class="desc">\n				<svg class="icon">\n					<use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': icon}" xlink:href=""></use>\n				</svg>\n				<span data-bind="text: title"></span>\n			</span>\n\n		</div>\n		<div class="knob-modal__body">\n			<!-- ko template: { nodes: $componentTemplateNodes, data: $parent } --><!-- /ko -->\n		</div>\n	</div>\n</div>\n';
},{}],30:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28,"tinycolor2":1}],31:[function(require,module,exports){
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
},{"../base/vm":6}],32:[function(require,module,exports){
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

},{"tinycolor2":1}],33:[function(require,module,exports){
module.exports = '<div class="knob-pagelist">\n	<!-- ko if: error -->\n		<div data-bind="text: error"></div>\n	<!-- /ko -->\n\n	<div>\n		<div class="knob-pagelist__bar">\n			<input class="knob-input" type="text" data-bind="value: search, valueUpdate: \'afterkeydown\'"/>\n			<knob-button class="knob-button-search" params="label: \'\',\n								variation: \'default\',\n								icon: \'#icon-search\'">\n			</knob-button>\n			<knob-items-per-page class="knob-pagelist__items-per-page" params="numOfItems: count,\n										numOfPages: numOfPages,\n										itemsPerPage: itemsPerPage">\n			</knob-items-per-page>\n			<!-- ko if: sortOptions.length > 0 -->\n				<knob-dropdown class="knob-dropdown" params="rightIcon: \'#icon-expand-more\', selectedIdx: sortIdx, selected: sort, items: sortOptions"></knob-dropdown>\n			<!-- /ko -->\n		</div>\n		<ul data-bind="css: listClass, foreach: items">\n			<li data-bind="css: $parent.itemClass">\n				<!-- ko template: { nodes: $componentTemplateNodes, data: {model: $data, parent: $parent, index: $index} } --><!-- /ko -->\n			</li>\n		</ul>\n	</div>\n\n	<div data-bind="visible: loading">Loading...</div>\n	<!--\n	<knob-pagination params="numOfItems: pagination.numOfItems, itemsPerPage: itemsPerPage"></knob-pagination>\n	-->\n	<!-- ko if: numOfPages() > 0 -->\n		<knob-pagination params="numOfPages: numOfPages, currentPage: currentPage"></knob-pagination>\n	<!-- /ko -->\n	<!-- ko if: $data.loadMore -->\n		<div data-bind="visible: !loading(), click: loadMore">Load more...</div>\n	<!-- /ko -->\n</div>';
},{}],34:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32,"tinycolor2":1}],35:[function(require,module,exports){
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

},{"../list/vm":23}],36:[function(require,module,exports){
module.exports = '<div class="knob-pagination" data-bind="if: pageSelectors().length">\n	<span data-bind="component: {\n						name: \'knob-button\',\n						params: {\n							variation: \'pagination\',\n							icon: \'#icon-first-page\',\n							state: first().state,\n							click: first().selectPage\n						}\n					}">\n	</span>\n	<span data-bind="component: {\n						name: \'knob-button\',\n						params: {\n							variation: \'pagination\',\n							icon: \'#icon-chevron-left\',\n							state: prev().state,\n							click: prev().selectPage\n						}\n					}">\n	</span>\n	<span data-bind="foreach: pageSelectors">\n		<knob-button params="label: label,\n							state: state,\n							variation: \'pagination\',\n							click: selectPage"></knob-button>\n	</span>\n	<span data-bind="component: {\n						name: \'knob-button\',\n						params: {\n							variation: \'pagination\',\n							icon: \'#icon-chevron-right\',\n							state: next().state,\n							click: next().selectPage\n						}\n					}">\n	</span>\n	<span data-bind="component: {\n						name: \'knob-button\',\n						params: {\n							variation: \'pagination\',\n							icon: \'#icon-last-page\',\n							state: last().state,\n							click: last().selectPage\n						}\n					}">\n	</span>\n</div>';
},{}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
module.exports = '<div class="knob-radio" data-bind="foreach: items">\n	<div data-bind="component: {\n		name: \'knob-button\',\n		params: {\n			state: isSelected() ? \'active\' : \'default\',\n			variation: $parent.variation,\n			label: label,\n			icon: icon,\n			radio: true,\n			group: group,\n			click: select\n		}\n	}">\n	</div>\n</div>\n';
},{}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
module.exports = '<div data-bind="css: cssClass,\n					style: style">\n	<!-- ko template: { nodes: $componentTemplateNodes, data: $parent } --><!-- /ko -->\n</div>';
},{}],41:[function(require,module,exports){
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

},{"../../base/vm":6}],42:[function(require,module,exports){
module.exports = '<div>\n	<knob-radio class="knob-radio--inline" params="\n		group: tabsGroup,\n		variation: \'tab\',\n		selectedIdx: selectedIdx,\n		items: buttons">\n	</knob-radio>\n\n	<div data-bind="foreach: panels">\n		<knob-tab data-bind="visible: $parent.selectedIdx() == $index()">\n			<!-- ko template: { nodes: $data } --><!-- /ko -->\n		</knob-tab>\n	</div>\n</div>';
},{}],43:[function(require,module,exports){
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

},{}]},{},[11])(11)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvdGlueWNvbG9yMi90aW55Y29sb3IuanMiLCJzcmMvYmFzZS9iZWhhdmlvdXJzL2NsaWNrLmpzIiwic3JjL2Jhc2UvYmVoYXZpb3Vycy9mb2N1cy5qcyIsInNyYy9iYXNlL2JlaGF2aW91cnMvaG92ZXIuanMiLCJzcmMvYmFzZS9iZWhhdmlvdXJzL3NlbGVjdC5qcyIsInNyYy9iYXNlL3ZtLmpzIiwic3JjL2J1dHRvbi9zdHlsZS5qcyIsInNyYy9idXR0b24vdGVtcGxhdGUuaHRtbCIsInNyYy9idXR0b24vdGhlbWUyLmpzIiwic3JjL2J1dHRvbi92bS5qcyIsInNyYy9jb21wb25lbnRzLmpzIiwic3JjL2Ryb3Bkb3duL3RlbXBsYXRlLmh0bWwiLCJzcmMvZHJvcGRvd24vdm0uanMiLCJzcmMvaW5saW5lVGV4dEVkaXRvci90ZW1wbGF0ZS5odG1sIiwic3JjL2lubGluZVRleHRFZGl0b3Ivdm0uanMiLCJzcmMvaW5wdXQvc3R5bGUuanMiLCJzcmMvaW5wdXQvdGVtcGxhdGUuaHRtbCIsInNyYy9pbnB1dC92bS5qcyIsInNyYy9pdGVtc1BlclBhZ2UvdGVtcGxhdGUuaHRtbCIsInNyYy9pdGVtc1BlclBhZ2Uvdm0uanMiLCJzcmMva25vYlJlZ2lzdGVyQ29tcG9uZW50LmpzIiwic3JjL2xpc3Qvdm0uanMiLCJzcmMvbW9kYWwvYWxlcnQvdGVtcGxhdGUuaHRtbCIsInNyYy9tb2RhbC9hbGVydC92bS5qcyIsInNyYy9tb2RhbC9jb25maXJtL3RlbXBsYXRlLmh0bWwiLCJzcmMvbW9kYWwvY29uZmlybS92bS5qcyIsInNyYy9tb2RhbC9zdHlsZS5qcyIsInNyYy9tb2RhbC90ZW1wbGF0ZS5odG1sIiwic3JjL21vZGFsL3ZtLmpzIiwic3JjL3BhZ2VkTGlzdC9zdHlsZS5qcyIsInNyYy9wYWdlZExpc3QvdGVtcGxhdGUuaHRtbCIsInNyYy9wYWdlZExpc3Qvdm0uanMiLCJzcmMvcGFnaW5hdGlvbi90ZW1wbGF0ZS5odG1sIiwic3JjL3BhZ2luYXRpb24vdm0uanMiLCJzcmMvcmFkaW8vdGVtcGxhdGUuaHRtbCIsInNyYy9yYWRpby92bS5qcyIsInNyYy90YWJzL3RhYi90ZW1wbGF0ZS5odG1sIiwic3JjL3RhYnMvdGFiL3ZtLmpzIiwic3JjL3RhYnMvdGVtcGxhdGUuaHRtbCIsInNyYy90YWJzL3ZtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2R0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBOzs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlNQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xMQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBUaW55Q29sb3IgdjEuMy4wXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYmdyaW5zL1RpbnlDb2xvclxuLy8gQnJpYW4gR3JpbnN0ZWFkLCBNSVQgTGljZW5zZVxuXG4oZnVuY3Rpb24oKSB7XG5cbnZhciB0cmltTGVmdCA9IC9eXFxzKy8sXG4gICAgdHJpbVJpZ2h0ID0gL1xccyskLyxcbiAgICB0aW55Q291bnRlciA9IDAsXG4gICAgbWF0aCA9IE1hdGgsXG4gICAgbWF0aFJvdW5kID0gbWF0aC5yb3VuZCxcbiAgICBtYXRoTWluID0gbWF0aC5taW4sXG4gICAgbWF0aE1heCA9IG1hdGgubWF4LFxuICAgIG1hdGhSYW5kb20gPSBtYXRoLnJhbmRvbTtcblxuZnVuY3Rpb24gdGlueWNvbG9yIChjb2xvciwgb3B0cykge1xuXG4gICAgY29sb3IgPSAoY29sb3IpID8gY29sb3IgOiAnJztcbiAgICBvcHRzID0gb3B0cyB8fCB7IH07XG5cbiAgICAvLyBJZiBpbnB1dCBpcyBhbHJlYWR5IGEgdGlueWNvbG9yLCByZXR1cm4gaXRzZWxmXG4gICAgaWYgKGNvbG9yIGluc3RhbmNlb2YgdGlueWNvbG9yKSB7XG4gICAgICAgcmV0dXJuIGNvbG9yO1xuICAgIH1cbiAgICAvLyBJZiB3ZSBhcmUgY2FsbGVkIGFzIGEgZnVuY3Rpb24sIGNhbGwgdXNpbmcgbmV3IGluc3RlYWRcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgdGlueWNvbG9yKSkge1xuICAgICAgICByZXR1cm4gbmV3IHRpbnljb2xvcihjb2xvciwgb3B0cyk7XG4gICAgfVxuXG4gICAgdmFyIHJnYiA9IGlucHV0VG9SR0IoY29sb3IpO1xuICAgIHRoaXMuX29yaWdpbmFsSW5wdXQgPSBjb2xvcixcbiAgICB0aGlzLl9yID0gcmdiLnIsXG4gICAgdGhpcy5fZyA9IHJnYi5nLFxuICAgIHRoaXMuX2IgPSByZ2IuYixcbiAgICB0aGlzLl9hID0gcmdiLmEsXG4gICAgdGhpcy5fcm91bmRBID0gbWF0aFJvdW5kKDEwMCp0aGlzLl9hKSAvIDEwMCxcbiAgICB0aGlzLl9mb3JtYXQgPSBvcHRzLmZvcm1hdCB8fCByZ2IuZm9ybWF0O1xuICAgIHRoaXMuX2dyYWRpZW50VHlwZSA9IG9wdHMuZ3JhZGllbnRUeXBlO1xuXG4gICAgLy8gRG9uJ3QgbGV0IHRoZSByYW5nZSBvZiBbMCwyNTVdIGNvbWUgYmFjayBpbiBbMCwxXS5cbiAgICAvLyBQb3RlbnRpYWxseSBsb3NlIGEgbGl0dGxlIGJpdCBvZiBwcmVjaXNpb24gaGVyZSwgYnV0IHdpbGwgZml4IGlzc3VlcyB3aGVyZVxuICAgIC8vIC41IGdldHMgaW50ZXJwcmV0ZWQgYXMgaGFsZiBvZiB0aGUgdG90YWwsIGluc3RlYWQgb2YgaGFsZiBvZiAxXG4gICAgLy8gSWYgaXQgd2FzIHN1cHBvc2VkIHRvIGJlIDEyOCwgdGhpcyB3YXMgYWxyZWFkeSB0YWtlbiBjYXJlIG9mIGJ5IGBpbnB1dFRvUmdiYFxuICAgIGlmICh0aGlzLl9yIDwgMSkgeyB0aGlzLl9yID0gbWF0aFJvdW5kKHRoaXMuX3IpOyB9XG4gICAgaWYgKHRoaXMuX2cgPCAxKSB7IHRoaXMuX2cgPSBtYXRoUm91bmQodGhpcy5fZyk7IH1cbiAgICBpZiAodGhpcy5fYiA8IDEpIHsgdGhpcy5fYiA9IG1hdGhSb3VuZCh0aGlzLl9iKTsgfVxuXG4gICAgdGhpcy5fb2sgPSByZ2Iub2s7XG4gICAgdGhpcy5fdGNfaWQgPSB0aW55Q291bnRlcisrO1xufVxuXG50aW55Y29sb3IucHJvdG90eXBlID0ge1xuICAgIGlzRGFyazogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEJyaWdodG5lc3MoKSA8IDEyODtcbiAgICB9LFxuICAgIGlzTGlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuaXNEYXJrKCk7XG4gICAgfSxcbiAgICBpc1ZhbGlkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29rO1xuICAgIH0sXG4gICAgZ2V0T3JpZ2luYWxJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fb3JpZ2luYWxJbnB1dDtcbiAgICB9LFxuICAgIGdldEZvcm1hdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mb3JtYXQ7XG4gICAgfSxcbiAgICBnZXRBbHBoYTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hO1xuICAgIH0sXG4gICAgZ2V0QnJpZ2h0bmVzczogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vaHR0cDovL3d3dy53My5vcmcvVFIvQUVSVCNjb2xvci1jb250cmFzdFxuICAgICAgICB2YXIgcmdiID0gdGhpcy50b1JnYigpO1xuICAgICAgICByZXR1cm4gKHJnYi5yICogMjk5ICsgcmdiLmcgKiA1ODcgKyByZ2IuYiAqIDExNCkgLyAxMDAwO1xuICAgIH0sXG4gICAgZ2V0THVtaW5hbmNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy9odHRwOi8vd3d3LnczLm9yZy9UUi8yMDA4L1JFQy1XQ0FHMjAtMjAwODEyMTEvI3JlbGF0aXZlbHVtaW5hbmNlZGVmXG4gICAgICAgIHZhciByZ2IgPSB0aGlzLnRvUmdiKCk7XG4gICAgICAgIHZhciBSc1JHQiwgR3NSR0IsIEJzUkdCLCBSLCBHLCBCO1xuICAgICAgICBSc1JHQiA9IHJnYi5yLzI1NTtcbiAgICAgICAgR3NSR0IgPSByZ2IuZy8yNTU7XG4gICAgICAgIEJzUkdCID0gcmdiLmIvMjU1O1xuXG4gICAgICAgIGlmIChSc1JHQiA8PSAwLjAzOTI4KSB7UiA9IFJzUkdCIC8gMTIuOTI7fSBlbHNlIHtSID0gTWF0aC5wb3coKChSc1JHQiArIDAuMDU1KSAvIDEuMDU1KSwgMi40KTt9XG4gICAgICAgIGlmIChHc1JHQiA8PSAwLjAzOTI4KSB7RyA9IEdzUkdCIC8gMTIuOTI7fSBlbHNlIHtHID0gTWF0aC5wb3coKChHc1JHQiArIDAuMDU1KSAvIDEuMDU1KSwgMi40KTt9XG4gICAgICAgIGlmIChCc1JHQiA8PSAwLjAzOTI4KSB7QiA9IEJzUkdCIC8gMTIuOTI7fSBlbHNlIHtCID0gTWF0aC5wb3coKChCc1JHQiArIDAuMDU1KSAvIDEuMDU1KSwgMi40KTt9XG4gICAgICAgIHJldHVybiAoMC4yMTI2ICogUikgKyAoMC43MTUyICogRykgKyAoMC4wNzIyICogQik7XG4gICAgfSxcbiAgICBzZXRBbHBoYTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgdGhpcy5fYSA9IGJvdW5kQWxwaGEodmFsdWUpO1xuICAgICAgICB0aGlzLl9yb3VuZEEgPSBtYXRoUm91bmQoMTAwKnRoaXMuX2EpIC8gMTAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHRvSHN2OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGhzdiA9IHJnYlRvSHN2KHRoaXMuX3IsIHRoaXMuX2csIHRoaXMuX2IpO1xuICAgICAgICByZXR1cm4geyBoOiBoc3YuaCAqIDM2MCwgczogaHN2LnMsIHY6IGhzdi52LCBhOiB0aGlzLl9hIH07XG4gICAgfSxcbiAgICB0b0hzdlN0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoc3YgPSByZ2JUb0hzdih0aGlzLl9yLCB0aGlzLl9nLCB0aGlzLl9iKTtcbiAgICAgICAgdmFyIGggPSBtYXRoUm91bmQoaHN2LmggKiAzNjApLCBzID0gbWF0aFJvdW5kKGhzdi5zICogMTAwKSwgdiA9IG1hdGhSb3VuZChoc3YudiAqIDEwMCk7XG4gICAgICAgIHJldHVybiAodGhpcy5fYSA9PSAxKSA/XG4gICAgICAgICAgXCJoc3YoXCIgICsgaCArIFwiLCBcIiArIHMgKyBcIiUsIFwiICsgdiArIFwiJSlcIiA6XG4gICAgICAgICAgXCJoc3ZhKFwiICsgaCArIFwiLCBcIiArIHMgKyBcIiUsIFwiICsgdiArIFwiJSwgXCIrIHRoaXMuX3JvdW5kQSArIFwiKVwiO1xuICAgIH0sXG4gICAgdG9Ic2w6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaHNsID0gcmdiVG9Ic2wodGhpcy5fciwgdGhpcy5fZywgdGhpcy5fYik7XG4gICAgICAgIHJldHVybiB7IGg6IGhzbC5oICogMzYwLCBzOiBoc2wucywgbDogaHNsLmwsIGE6IHRoaXMuX2EgfTtcbiAgICB9LFxuICAgIHRvSHNsU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGhzbCA9IHJnYlRvSHNsKHRoaXMuX3IsIHRoaXMuX2csIHRoaXMuX2IpO1xuICAgICAgICB2YXIgaCA9IG1hdGhSb3VuZChoc2wuaCAqIDM2MCksIHMgPSBtYXRoUm91bmQoaHNsLnMgKiAxMDApLCBsID0gbWF0aFJvdW5kKGhzbC5sICogMTAwKTtcbiAgICAgICAgcmV0dXJuICh0aGlzLl9hID09IDEpID9cbiAgICAgICAgICBcImhzbChcIiAgKyBoICsgXCIsIFwiICsgcyArIFwiJSwgXCIgKyBsICsgXCIlKVwiIDpcbiAgICAgICAgICBcImhzbGEoXCIgKyBoICsgXCIsIFwiICsgcyArIFwiJSwgXCIgKyBsICsgXCIlLCBcIisgdGhpcy5fcm91bmRBICsgXCIpXCI7XG4gICAgfSxcbiAgICB0b0hleDogZnVuY3Rpb24oYWxsb3czQ2hhcikge1xuICAgICAgICByZXR1cm4gcmdiVG9IZXgodGhpcy5fciwgdGhpcy5fZywgdGhpcy5fYiwgYWxsb3czQ2hhcik7XG4gICAgfSxcbiAgICB0b0hleFN0cmluZzogZnVuY3Rpb24oYWxsb3czQ2hhcikge1xuICAgICAgICByZXR1cm4gJyMnICsgdGhpcy50b0hleChhbGxvdzNDaGFyKTtcbiAgICB9LFxuICAgIHRvSGV4ODogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiByZ2JhVG9IZXgodGhpcy5fciwgdGhpcy5fZywgdGhpcy5fYiwgdGhpcy5fYSk7XG4gICAgfSxcbiAgICB0b0hleDhTdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJyMnICsgdGhpcy50b0hleDgoKTtcbiAgICB9LFxuICAgIHRvUmdiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHsgcjogbWF0aFJvdW5kKHRoaXMuX3IpLCBnOiBtYXRoUm91bmQodGhpcy5fZyksIGI6IG1hdGhSb3VuZCh0aGlzLl9iKSwgYTogdGhpcy5fYSB9O1xuICAgIH0sXG4gICAgdG9SZ2JTdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuX2EgPT0gMSkgP1xuICAgICAgICAgIFwicmdiKFwiICArIG1hdGhSb3VuZCh0aGlzLl9yKSArIFwiLCBcIiArIG1hdGhSb3VuZCh0aGlzLl9nKSArIFwiLCBcIiArIG1hdGhSb3VuZCh0aGlzLl9iKSArIFwiKVwiIDpcbiAgICAgICAgICBcInJnYmEoXCIgKyBtYXRoUm91bmQodGhpcy5fcikgKyBcIiwgXCIgKyBtYXRoUm91bmQodGhpcy5fZykgKyBcIiwgXCIgKyBtYXRoUm91bmQodGhpcy5fYikgKyBcIiwgXCIgKyB0aGlzLl9yb3VuZEEgKyBcIilcIjtcbiAgICB9LFxuICAgIHRvUGVyY2VudGFnZVJnYjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7IHI6IG1hdGhSb3VuZChib3VuZDAxKHRoaXMuX3IsIDI1NSkgKiAxMDApICsgXCIlXCIsIGc6IG1hdGhSb3VuZChib3VuZDAxKHRoaXMuX2csIDI1NSkgKiAxMDApICsgXCIlXCIsIGI6IG1hdGhSb3VuZChib3VuZDAxKHRoaXMuX2IsIDI1NSkgKiAxMDApICsgXCIlXCIsIGE6IHRoaXMuX2EgfTtcbiAgICB9LFxuICAgIHRvUGVyY2VudGFnZVJnYlN0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5fYSA9PSAxKSA/XG4gICAgICAgICAgXCJyZ2IoXCIgICsgbWF0aFJvdW5kKGJvdW5kMDEodGhpcy5fciwgMjU1KSAqIDEwMCkgKyBcIiUsIFwiICsgbWF0aFJvdW5kKGJvdW5kMDEodGhpcy5fZywgMjU1KSAqIDEwMCkgKyBcIiUsIFwiICsgbWF0aFJvdW5kKGJvdW5kMDEodGhpcy5fYiwgMjU1KSAqIDEwMCkgKyBcIiUpXCIgOlxuICAgICAgICAgIFwicmdiYShcIiArIG1hdGhSb3VuZChib3VuZDAxKHRoaXMuX3IsIDI1NSkgKiAxMDApICsgXCIlLCBcIiArIG1hdGhSb3VuZChib3VuZDAxKHRoaXMuX2csIDI1NSkgKiAxMDApICsgXCIlLCBcIiArIG1hdGhSb3VuZChib3VuZDAxKHRoaXMuX2IsIDI1NSkgKiAxMDApICsgXCIlLCBcIiArIHRoaXMuX3JvdW5kQSArIFwiKVwiO1xuICAgIH0sXG4gICAgdG9OYW1lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuX2EgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBcInRyYW5zcGFyZW50XCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fYSA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBoZXhOYW1lc1tyZ2JUb0hleCh0aGlzLl9yLCB0aGlzLl9nLCB0aGlzLl9iLCB0cnVlKV0gfHwgZmFsc2U7XG4gICAgfSxcbiAgICB0b0ZpbHRlcjogZnVuY3Rpb24oc2Vjb25kQ29sb3IpIHtcbiAgICAgICAgdmFyIGhleDhTdHJpbmcgPSAnIycgKyByZ2JhVG9IZXgodGhpcy5fciwgdGhpcy5fZywgdGhpcy5fYiwgdGhpcy5fYSk7XG4gICAgICAgIHZhciBzZWNvbmRIZXg4U3RyaW5nID0gaGV4OFN0cmluZztcbiAgICAgICAgdmFyIGdyYWRpZW50VHlwZSA9IHRoaXMuX2dyYWRpZW50VHlwZSA/IFwiR3JhZGllbnRUeXBlID0gMSwgXCIgOiBcIlwiO1xuXG4gICAgICAgIGlmIChzZWNvbmRDb2xvcikge1xuICAgICAgICAgICAgdmFyIHMgPSB0aW55Y29sb3Ioc2Vjb25kQ29sb3IpO1xuICAgICAgICAgICAgc2Vjb25kSGV4OFN0cmluZyA9IHMudG9IZXg4U3RyaW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gXCJwcm9naWQ6RFhJbWFnZVRyYW5zZm9ybS5NaWNyb3NvZnQuZ3JhZGllbnQoXCIrZ3JhZGllbnRUeXBlK1wic3RhcnRDb2xvcnN0cj1cIitoZXg4U3RyaW5nK1wiLGVuZENvbG9yc3RyPVwiK3NlY29uZEhleDhTdHJpbmcrXCIpXCI7XG4gICAgfSxcbiAgICB0b1N0cmluZzogZnVuY3Rpb24oZm9ybWF0KSB7XG4gICAgICAgIHZhciBmb3JtYXRTZXQgPSAhIWZvcm1hdDtcbiAgICAgICAgZm9ybWF0ID0gZm9ybWF0IHx8IHRoaXMuX2Zvcm1hdDtcblxuICAgICAgICB2YXIgZm9ybWF0dGVkU3RyaW5nID0gZmFsc2U7XG4gICAgICAgIHZhciBoYXNBbHBoYSA9IHRoaXMuX2EgPCAxICYmIHRoaXMuX2EgPj0gMDtcbiAgICAgICAgdmFyIG5lZWRzQWxwaGFGb3JtYXQgPSAhZm9ybWF0U2V0ICYmIGhhc0FscGhhICYmIChmb3JtYXQgPT09IFwiaGV4XCIgfHwgZm9ybWF0ID09PSBcImhleDZcIiB8fCBmb3JtYXQgPT09IFwiaGV4M1wiIHx8IGZvcm1hdCA9PT0gXCJuYW1lXCIpO1xuXG4gICAgICAgIGlmIChuZWVkc0FscGhhRm9ybWF0KSB7XG4gICAgICAgICAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIFwidHJhbnNwYXJlbnRcIiwgYWxsIG90aGVyIG5vbi1hbHBoYSBmb3JtYXRzXG4gICAgICAgICAgICAvLyB3aWxsIHJldHVybiByZ2JhIHdoZW4gdGhlcmUgaXMgdHJhbnNwYXJlbmN5LlxuICAgICAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJuYW1lXCIgJiYgdGhpcy5fYSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRvTmFtZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9SZ2JTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSBcInJnYlwiKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWRTdHJpbmcgPSB0aGlzLnRvUmdiU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJwcmdiXCIpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9QZXJjZW50YWdlUmdiU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJoZXhcIiB8fCBmb3JtYXQgPT09IFwiaGV4NlwiKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWRTdHJpbmcgPSB0aGlzLnRvSGV4U3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJoZXgzXCIpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9IZXhTdHJpbmcodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJoZXg4XCIpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9IZXg4U3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJuYW1lXCIpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9OYW1lKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJoc2xcIikge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b0hzbFN0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT09IFwiaHN2XCIpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9Ic3ZTdHJpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmb3JtYXR0ZWRTdHJpbmcgfHwgdGhpcy50b0hleFN0cmluZygpO1xuICAgIH0sXG4gICAgY2xvbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGlueWNvbG9yKHRoaXMudG9TdHJpbmcoKSk7XG4gICAgfSxcblxuICAgIF9hcHBseU1vZGlmaWNhdGlvbjogZnVuY3Rpb24oZm4sIGFyZ3MpIHtcbiAgICAgICAgdmFyIGNvbG9yID0gZm4uYXBwbHkobnVsbCwgW3RoaXNdLmNvbmNhdChbXS5zbGljZS5jYWxsKGFyZ3MpKSk7XG4gICAgICAgIHRoaXMuX3IgPSBjb2xvci5fcjtcbiAgICAgICAgdGhpcy5fZyA9IGNvbG9yLl9nO1xuICAgICAgICB0aGlzLl9iID0gY29sb3IuX2I7XG4gICAgICAgIHRoaXMuc2V0QWxwaGEoY29sb3IuX2EpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGxpZ2h0ZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlNb2RpZmljYXRpb24obGlnaHRlbiwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIGJyaWdodGVuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5TW9kaWZpY2F0aW9uKGJyaWdodGVuLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgZGFya2VuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5TW9kaWZpY2F0aW9uKGRhcmtlbiwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIGRlc2F0dXJhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlNb2RpZmljYXRpb24oZGVzYXR1cmF0ZSwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIHNhdHVyYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5TW9kaWZpY2F0aW9uKHNhdHVyYXRlLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgZ3JleXNjYWxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5TW9kaWZpY2F0aW9uKGdyZXlzY2FsZSwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIHNwaW46IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlNb2RpZmljYXRpb24oc3BpbiwgYXJndW1lbnRzKTtcbiAgICB9LFxuXG4gICAgX2FwcGx5Q29tYmluYXRpb246IGZ1bmN0aW9uKGZuLCBhcmdzKSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseShudWxsLCBbdGhpc10uY29uY2F0KFtdLnNsaWNlLmNhbGwoYXJncykpKTtcbiAgICB9LFxuICAgIGFuYWxvZ291czogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseUNvbWJpbmF0aW9uKGFuYWxvZ291cywgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIGNvbXBsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlDb21iaW5hdGlvbihjb21wbGVtZW50LCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgbW9ub2Nocm9tYXRpYzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseUNvbWJpbmF0aW9uKG1vbm9jaHJvbWF0aWMsIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBzcGxpdGNvbXBsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlDb21iaW5hdGlvbihzcGxpdGNvbXBsZW1lbnQsIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICB0cmlhZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseUNvbWJpbmF0aW9uKHRyaWFkLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgdGV0cmFkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5Q29tYmluYXRpb24odGV0cmFkLCBhcmd1bWVudHMpO1xuICAgIH1cbn07XG5cbi8vIElmIGlucHV0IGlzIGFuIG9iamVjdCwgZm9yY2UgMSBpbnRvIFwiMS4wXCIgdG8gaGFuZGxlIHJhdGlvcyBwcm9wZXJseVxuLy8gU3RyaW5nIGlucHV0IHJlcXVpcmVzIFwiMS4wXCIgYXMgaW5wdXQsIHNvIDEgd2lsbCBiZSB0cmVhdGVkIGFzIDFcbnRpbnljb2xvci5mcm9tUmF0aW8gPSBmdW5jdGlvbihjb2xvciwgb3B0cykge1xuICAgIGlmICh0eXBlb2YgY29sb3IgPT0gXCJvYmplY3RcIikge1xuICAgICAgICB2YXIgbmV3Q29sb3IgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBjb2xvcikge1xuICAgICAgICAgICAgaWYgKGNvbG9yLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IFwiYVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0NvbG9yW2ldID0gY29sb3JbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXdDb2xvcltpXSA9IGNvbnZlcnRUb1BlcmNlbnRhZ2UoY29sb3JbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb2xvciA9IG5ld0NvbG9yO1xuICAgIH1cblxuICAgIHJldHVybiB0aW55Y29sb3IoY29sb3IsIG9wdHMpO1xufTtcblxuLy8gR2l2ZW4gYSBzdHJpbmcgb3Igb2JqZWN0LCBjb252ZXJ0IHRoYXQgaW5wdXQgdG8gUkdCXG4vLyBQb3NzaWJsZSBzdHJpbmcgaW5wdXRzOlxuLy9cbi8vICAgICBcInJlZFwiXG4vLyAgICAgXCIjZjAwXCIgb3IgXCJmMDBcIlxuLy8gICAgIFwiI2ZmMDAwMFwiIG9yIFwiZmYwMDAwXCJcbi8vICAgICBcIiNmZjAwMDAwMFwiIG9yIFwiZmYwMDAwMDBcIlxuLy8gICAgIFwicmdiIDI1NSAwIDBcIiBvciBcInJnYiAoMjU1LCAwLCAwKVwiXG4vLyAgICAgXCJyZ2IgMS4wIDAgMFwiIG9yIFwicmdiICgxLCAwLCAwKVwiXG4vLyAgICAgXCJyZ2JhICgyNTUsIDAsIDAsIDEpXCIgb3IgXCJyZ2JhIDI1NSwgMCwgMCwgMVwiXG4vLyAgICAgXCJyZ2JhICgxLjAsIDAsIDAsIDEpXCIgb3IgXCJyZ2JhIDEuMCwgMCwgMCwgMVwiXG4vLyAgICAgXCJoc2woMCwgMTAwJSwgNTAlKVwiIG9yIFwiaHNsIDAgMTAwJSA1MCVcIlxuLy8gICAgIFwiaHNsYSgwLCAxMDAlLCA1MCUsIDEpXCIgb3IgXCJoc2xhIDAgMTAwJSA1MCUsIDFcIlxuLy8gICAgIFwiaHN2KDAsIDEwMCUsIDEwMCUpXCIgb3IgXCJoc3YgMCAxMDAlIDEwMCVcIlxuLy9cbmZ1bmN0aW9uIGlucHV0VG9SR0IoY29sb3IpIHtcblxuICAgIHZhciByZ2IgPSB7IHI6IDAsIGc6IDAsIGI6IDAgfTtcbiAgICB2YXIgYSA9IDE7XG4gICAgdmFyIG9rID0gZmFsc2U7XG4gICAgdmFyIGZvcm1hdCA9IGZhbHNlO1xuXG4gICAgaWYgKHR5cGVvZiBjb2xvciA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGNvbG9yID0gc3RyaW5nSW5wdXRUb09iamVjdChjb2xvcik7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjb2xvciA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGlmIChjb2xvci5oYXNPd25Qcm9wZXJ0eShcInJcIikgJiYgY29sb3IuaGFzT3duUHJvcGVydHkoXCJnXCIpICYmIGNvbG9yLmhhc093blByb3BlcnR5KFwiYlwiKSkge1xuICAgICAgICAgICAgcmdiID0gcmdiVG9SZ2IoY29sb3IuciwgY29sb3IuZywgY29sb3IuYik7XG4gICAgICAgICAgICBvayA9IHRydWU7XG4gICAgICAgICAgICBmb3JtYXQgPSBTdHJpbmcoY29sb3Iucikuc3Vic3RyKC0xKSA9PT0gXCIlXCIgPyBcInByZ2JcIiA6IFwicmdiXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29sb3IuaGFzT3duUHJvcGVydHkoXCJoXCIpICYmIGNvbG9yLmhhc093blByb3BlcnR5KFwic1wiKSAmJiBjb2xvci5oYXNPd25Qcm9wZXJ0eShcInZcIikpIHtcbiAgICAgICAgICAgIGNvbG9yLnMgPSBjb252ZXJ0VG9QZXJjZW50YWdlKGNvbG9yLnMpO1xuICAgICAgICAgICAgY29sb3IudiA9IGNvbnZlcnRUb1BlcmNlbnRhZ2UoY29sb3Iudik7XG4gICAgICAgICAgICByZ2IgPSBoc3ZUb1JnYihjb2xvci5oLCBjb2xvci5zLCBjb2xvci52KTtcbiAgICAgICAgICAgIG9rID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvcm1hdCA9IFwiaHN2XCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29sb3IuaGFzT3duUHJvcGVydHkoXCJoXCIpICYmIGNvbG9yLmhhc093blByb3BlcnR5KFwic1wiKSAmJiBjb2xvci5oYXNPd25Qcm9wZXJ0eShcImxcIikpIHtcbiAgICAgICAgICAgIGNvbG9yLnMgPSBjb252ZXJ0VG9QZXJjZW50YWdlKGNvbG9yLnMpO1xuICAgICAgICAgICAgY29sb3IubCA9IGNvbnZlcnRUb1BlcmNlbnRhZ2UoY29sb3IubCk7XG4gICAgICAgICAgICByZ2IgPSBoc2xUb1JnYihjb2xvci5oLCBjb2xvci5zLCBjb2xvci5sKTtcbiAgICAgICAgICAgIG9rID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvcm1hdCA9IFwiaHNsXCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29sb3IuaGFzT3duUHJvcGVydHkoXCJhXCIpKSB7XG4gICAgICAgICAgICBhID0gY29sb3IuYTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGEgPSBib3VuZEFscGhhKGEpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgb2s6IG9rLFxuICAgICAgICBmb3JtYXQ6IGNvbG9yLmZvcm1hdCB8fCBmb3JtYXQsXG4gICAgICAgIHI6IG1hdGhNaW4oMjU1LCBtYXRoTWF4KHJnYi5yLCAwKSksXG4gICAgICAgIGc6IG1hdGhNaW4oMjU1LCBtYXRoTWF4KHJnYi5nLCAwKSksXG4gICAgICAgIGI6IG1hdGhNaW4oMjU1LCBtYXRoTWF4KHJnYi5iLCAwKSksXG4gICAgICAgIGE6IGFcbiAgICB9O1xufVxuXG5cbi8vIENvbnZlcnNpb24gRnVuY3Rpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBgcmdiVG9Ic2xgLCBgcmdiVG9Ic3ZgLCBgaHNsVG9SZ2JgLCBgaHN2VG9SZ2JgIG1vZGlmaWVkIGZyb206XG4vLyA8aHR0cDovL21qaWphY2tzb24uY29tLzIwMDgvMDIvcmdiLXRvLWhzbC1hbmQtcmdiLXRvLWhzdi1jb2xvci1tb2RlbC1jb252ZXJzaW9uLWFsZ29yaXRobXMtaW4tamF2YXNjcmlwdD5cblxuLy8gYHJnYlRvUmdiYFxuLy8gSGFuZGxlIGJvdW5kcyAvIHBlcmNlbnRhZ2UgY2hlY2tpbmcgdG8gY29uZm9ybSB0byBDU1MgY29sb3Igc3BlY1xuLy8gPGh0dHA6Ly93d3cudzMub3JnL1RSL2NzczMtY29sb3IvPlxuLy8gKkFzc3VtZXM6KiByLCBnLCBiIGluIFswLCAyNTVdIG9yIFswLCAxXVxuLy8gKlJldHVybnM6KiB7IHIsIGcsIGIgfSBpbiBbMCwgMjU1XVxuZnVuY3Rpb24gcmdiVG9SZ2IociwgZywgYil7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcjogYm91bmQwMShyLCAyNTUpICogMjU1LFxuICAgICAgICBnOiBib3VuZDAxKGcsIDI1NSkgKiAyNTUsXG4gICAgICAgIGI6IGJvdW5kMDEoYiwgMjU1KSAqIDI1NVxuICAgIH07XG59XG5cbi8vIGByZ2JUb0hzbGBcbi8vIENvbnZlcnRzIGFuIFJHQiBjb2xvciB2YWx1ZSB0byBIU0wuXG4vLyAqQXNzdW1lczoqIHIsIGcsIGFuZCBiIGFyZSBjb250YWluZWQgaW4gWzAsIDI1NV0gb3IgWzAsIDFdXG4vLyAqUmV0dXJuczoqIHsgaCwgcywgbCB9IGluIFswLDFdXG5mdW5jdGlvbiByZ2JUb0hzbChyLCBnLCBiKSB7XG5cbiAgICByID0gYm91bmQwMShyLCAyNTUpO1xuICAgIGcgPSBib3VuZDAxKGcsIDI1NSk7XG4gICAgYiA9IGJvdW5kMDEoYiwgMjU1KTtcblxuICAgIHZhciBtYXggPSBtYXRoTWF4KHIsIGcsIGIpLCBtaW4gPSBtYXRoTWluKHIsIGcsIGIpO1xuICAgIHZhciBoLCBzLCBsID0gKG1heCArIG1pbikgLyAyO1xuXG4gICAgaWYobWF4ID09IG1pbikge1xuICAgICAgICBoID0gcyA9IDA7IC8vIGFjaHJvbWF0aWNcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciBkID0gbWF4IC0gbWluO1xuICAgICAgICBzID0gbCA+IDAuNSA/IGQgLyAoMiAtIG1heCAtIG1pbikgOiBkIC8gKG1heCArIG1pbik7XG4gICAgICAgIHN3aXRjaChtYXgpIHtcbiAgICAgICAgICAgIGNhc2UgcjogaCA9IChnIC0gYikgLyBkICsgKGcgPCBiID8gNiA6IDApOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgZzogaCA9IChiIC0gcikgLyBkICsgMjsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGI6IGggPSAociAtIGcpIC8gZCArIDQ7IGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaCAvPSA2O1xuICAgIH1cblxuICAgIHJldHVybiB7IGg6IGgsIHM6IHMsIGw6IGwgfTtcbn1cblxuLy8gYGhzbFRvUmdiYFxuLy8gQ29udmVydHMgYW4gSFNMIGNvbG9yIHZhbHVlIHRvIFJHQi5cbi8vICpBc3N1bWVzOiogaCBpcyBjb250YWluZWQgaW4gWzAsIDFdIG9yIFswLCAzNjBdIGFuZCBzIGFuZCBsIGFyZSBjb250YWluZWQgWzAsIDFdIG9yIFswLCAxMDBdXG4vLyAqUmV0dXJuczoqIHsgciwgZywgYiB9IGluIHRoZSBzZXQgWzAsIDI1NV1cbmZ1bmN0aW9uIGhzbFRvUmdiKGgsIHMsIGwpIHtcbiAgICB2YXIgciwgZywgYjtcblxuICAgIGggPSBib3VuZDAxKGgsIDM2MCk7XG4gICAgcyA9IGJvdW5kMDEocywgMTAwKTtcbiAgICBsID0gYm91bmQwMShsLCAxMDApO1xuXG4gICAgZnVuY3Rpb24gaHVlMnJnYihwLCBxLCB0KSB7XG4gICAgICAgIGlmKHQgPCAwKSB0ICs9IDE7XG4gICAgICAgIGlmKHQgPiAxKSB0IC09IDE7XG4gICAgICAgIGlmKHQgPCAxLzYpIHJldHVybiBwICsgKHEgLSBwKSAqIDYgKiB0O1xuICAgICAgICBpZih0IDwgMS8yKSByZXR1cm4gcTtcbiAgICAgICAgaWYodCA8IDIvMykgcmV0dXJuIHAgKyAocSAtIHApICogKDIvMyAtIHQpICogNjtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgfVxuXG4gICAgaWYocyA9PT0gMCkge1xuICAgICAgICByID0gZyA9IGIgPSBsOyAvLyBhY2hyb21hdGljXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgcSA9IGwgPCAwLjUgPyBsICogKDEgKyBzKSA6IGwgKyBzIC0gbCAqIHM7XG4gICAgICAgIHZhciBwID0gMiAqIGwgLSBxO1xuICAgICAgICByID0gaHVlMnJnYihwLCBxLCBoICsgMS8zKTtcbiAgICAgICAgZyA9IGh1ZTJyZ2IocCwgcSwgaCk7XG4gICAgICAgIGIgPSBodWUycmdiKHAsIHEsIGggLSAxLzMpO1xuICAgIH1cblxuICAgIHJldHVybiB7IHI6IHIgKiAyNTUsIGc6IGcgKiAyNTUsIGI6IGIgKiAyNTUgfTtcbn1cblxuLy8gYHJnYlRvSHN2YFxuLy8gQ29udmVydHMgYW4gUkdCIGNvbG9yIHZhbHVlIHRvIEhTVlxuLy8gKkFzc3VtZXM6KiByLCBnLCBhbmQgYiBhcmUgY29udGFpbmVkIGluIHRoZSBzZXQgWzAsIDI1NV0gb3IgWzAsIDFdXG4vLyAqUmV0dXJuczoqIHsgaCwgcywgdiB9IGluIFswLDFdXG5mdW5jdGlvbiByZ2JUb0hzdihyLCBnLCBiKSB7XG5cbiAgICByID0gYm91bmQwMShyLCAyNTUpO1xuICAgIGcgPSBib3VuZDAxKGcsIDI1NSk7XG4gICAgYiA9IGJvdW5kMDEoYiwgMjU1KTtcblxuICAgIHZhciBtYXggPSBtYXRoTWF4KHIsIGcsIGIpLCBtaW4gPSBtYXRoTWluKHIsIGcsIGIpO1xuICAgIHZhciBoLCBzLCB2ID0gbWF4O1xuXG4gICAgdmFyIGQgPSBtYXggLSBtaW47XG4gICAgcyA9IG1heCA9PT0gMCA/IDAgOiBkIC8gbWF4O1xuXG4gICAgaWYobWF4ID09IG1pbikge1xuICAgICAgICBoID0gMDsgLy8gYWNocm9tYXRpY1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc3dpdGNoKG1heCkge1xuICAgICAgICAgICAgY2FzZSByOiBoID0gKGcgLSBiKSAvIGQgKyAoZyA8IGIgPyA2IDogMCk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBnOiBoID0gKGIgLSByKSAvIGQgKyAyOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgYjogaCA9IChyIC0gZykgLyBkICsgNDsgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaCAvPSA2O1xuICAgIH1cbiAgICByZXR1cm4geyBoOiBoLCBzOiBzLCB2OiB2IH07XG59XG5cbi8vIGBoc3ZUb1JnYmBcbi8vIENvbnZlcnRzIGFuIEhTViBjb2xvciB2YWx1ZSB0byBSR0IuXG4vLyAqQXNzdW1lczoqIGggaXMgY29udGFpbmVkIGluIFswLCAxXSBvciBbMCwgMzYwXSBhbmQgcyBhbmQgdiBhcmUgY29udGFpbmVkIGluIFswLCAxXSBvciBbMCwgMTAwXVxuLy8gKlJldHVybnM6KiB7IHIsIGcsIGIgfSBpbiB0aGUgc2V0IFswLCAyNTVdXG4gZnVuY3Rpb24gaHN2VG9SZ2IoaCwgcywgdikge1xuXG4gICAgaCA9IGJvdW5kMDEoaCwgMzYwKSAqIDY7XG4gICAgcyA9IGJvdW5kMDEocywgMTAwKTtcbiAgICB2ID0gYm91bmQwMSh2LCAxMDApO1xuXG4gICAgdmFyIGkgPSBtYXRoLmZsb29yKGgpLFxuICAgICAgICBmID0gaCAtIGksXG4gICAgICAgIHAgPSB2ICogKDEgLSBzKSxcbiAgICAgICAgcSA9IHYgKiAoMSAtIGYgKiBzKSxcbiAgICAgICAgdCA9IHYgKiAoMSAtICgxIC0gZikgKiBzKSxcbiAgICAgICAgbW9kID0gaSAlIDYsXG4gICAgICAgIHIgPSBbdiwgcSwgcCwgcCwgdCwgdl1bbW9kXSxcbiAgICAgICAgZyA9IFt0LCB2LCB2LCBxLCBwLCBwXVttb2RdLFxuICAgICAgICBiID0gW3AsIHAsIHQsIHYsIHYsIHFdW21vZF07XG5cbiAgICByZXR1cm4geyByOiByICogMjU1LCBnOiBnICogMjU1LCBiOiBiICogMjU1IH07XG59XG5cbi8vIGByZ2JUb0hleGBcbi8vIENvbnZlcnRzIGFuIFJHQiBjb2xvciB0byBoZXhcbi8vIEFzc3VtZXMgciwgZywgYW5kIGIgYXJlIGNvbnRhaW5lZCBpbiB0aGUgc2V0IFswLCAyNTVdXG4vLyBSZXR1cm5zIGEgMyBvciA2IGNoYXJhY3RlciBoZXhcbmZ1bmN0aW9uIHJnYlRvSGV4KHIsIGcsIGIsIGFsbG93M0NoYXIpIHtcblxuICAgIHZhciBoZXggPSBbXG4gICAgICAgIHBhZDIobWF0aFJvdW5kKHIpLnRvU3RyaW5nKDE2KSksXG4gICAgICAgIHBhZDIobWF0aFJvdW5kKGcpLnRvU3RyaW5nKDE2KSksXG4gICAgICAgIHBhZDIobWF0aFJvdW5kKGIpLnRvU3RyaW5nKDE2KSlcbiAgICBdO1xuXG4gICAgLy8gUmV0dXJuIGEgMyBjaGFyYWN0ZXIgaGV4IGlmIHBvc3NpYmxlXG4gICAgaWYgKGFsbG93M0NoYXIgJiYgaGV4WzBdLmNoYXJBdCgwKSA9PSBoZXhbMF0uY2hhckF0KDEpICYmIGhleFsxXS5jaGFyQXQoMCkgPT0gaGV4WzFdLmNoYXJBdCgxKSAmJiBoZXhbMl0uY2hhckF0KDApID09IGhleFsyXS5jaGFyQXQoMSkpIHtcbiAgICAgICAgcmV0dXJuIGhleFswXS5jaGFyQXQoMCkgKyBoZXhbMV0uY2hhckF0KDApICsgaGV4WzJdLmNoYXJBdCgwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGV4LmpvaW4oXCJcIik7XG59XG5cbi8vIGByZ2JhVG9IZXhgXG4vLyBDb252ZXJ0cyBhbiBSR0JBIGNvbG9yIHBsdXMgYWxwaGEgdHJhbnNwYXJlbmN5IHRvIGhleFxuLy8gQXNzdW1lcyByLCBnLCBiIGFuZCBhIGFyZSBjb250YWluZWQgaW4gdGhlIHNldCBbMCwgMjU1XVxuLy8gUmV0dXJucyBhbiA4IGNoYXJhY3RlciBoZXhcbmZ1bmN0aW9uIHJnYmFUb0hleChyLCBnLCBiLCBhKSB7XG5cbiAgICB2YXIgaGV4ID0gW1xuICAgICAgICBwYWQyKGNvbnZlcnREZWNpbWFsVG9IZXgoYSkpLFxuICAgICAgICBwYWQyKG1hdGhSb3VuZChyKS50b1N0cmluZygxNikpLFxuICAgICAgICBwYWQyKG1hdGhSb3VuZChnKS50b1N0cmluZygxNikpLFxuICAgICAgICBwYWQyKG1hdGhSb3VuZChiKS50b1N0cmluZygxNikpXG4gICAgXTtcblxuICAgIHJldHVybiBoZXguam9pbihcIlwiKTtcbn1cblxuLy8gYGVxdWFsc2Bcbi8vIENhbiBiZSBjYWxsZWQgd2l0aCBhbnkgdGlueWNvbG9yIGlucHV0XG50aW55Y29sb3IuZXF1YWxzID0gZnVuY3Rpb24gKGNvbG9yMSwgY29sb3IyKSB7XG4gICAgaWYgKCFjb2xvcjEgfHwgIWNvbG9yMikgeyByZXR1cm4gZmFsc2U7IH1cbiAgICByZXR1cm4gdGlueWNvbG9yKGNvbG9yMSkudG9SZ2JTdHJpbmcoKSA9PSB0aW55Y29sb3IoY29sb3IyKS50b1JnYlN0cmluZygpO1xufTtcblxudGlueWNvbG9yLnJhbmRvbSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aW55Y29sb3IuZnJvbVJhdGlvKHtcbiAgICAgICAgcjogbWF0aFJhbmRvbSgpLFxuICAgICAgICBnOiBtYXRoUmFuZG9tKCksXG4gICAgICAgIGI6IG1hdGhSYW5kb20oKVxuICAgIH0pO1xufTtcblxuXG4vLyBNb2RpZmljYXRpb24gRnVuY3Rpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBUaGFua3MgdG8gbGVzcy5qcyBmb3Igc29tZSBvZiB0aGUgYmFzaWNzIGhlcmVcbi8vIDxodHRwczovL2dpdGh1Yi5jb20vY2xvdWRoZWFkL2xlc3MuanMvYmxvYi9tYXN0ZXIvbGliL2xlc3MvZnVuY3Rpb25zLmpzPlxuXG5mdW5jdGlvbiBkZXNhdHVyYXRlKGNvbG9yLCBhbW91bnQpIHtcbiAgICBhbW91bnQgPSAoYW1vdW50ID09PSAwKSA/IDAgOiAoYW1vdW50IHx8IDEwKTtcbiAgICB2YXIgaHNsID0gdGlueWNvbG9yKGNvbG9yKS50b0hzbCgpO1xuICAgIGhzbC5zIC09IGFtb3VudCAvIDEwMDtcbiAgICBoc2wucyA9IGNsYW1wMDEoaHNsLnMpO1xuICAgIHJldHVybiB0aW55Y29sb3IoaHNsKTtcbn1cblxuZnVuY3Rpb24gc2F0dXJhdGUoY29sb3IsIGFtb3VudCkge1xuICAgIGFtb3VudCA9IChhbW91bnQgPT09IDApID8gMCA6IChhbW91bnQgfHwgMTApO1xuICAgIHZhciBoc2wgPSB0aW55Y29sb3IoY29sb3IpLnRvSHNsKCk7XG4gICAgaHNsLnMgKz0gYW1vdW50IC8gMTAwO1xuICAgIGhzbC5zID0gY2xhbXAwMShoc2wucyk7XG4gICAgcmV0dXJuIHRpbnljb2xvcihoc2wpO1xufVxuXG5mdW5jdGlvbiBncmV5c2NhbGUoY29sb3IpIHtcbiAgICByZXR1cm4gdGlueWNvbG9yKGNvbG9yKS5kZXNhdHVyYXRlKDEwMCk7XG59XG5cbmZ1bmN0aW9uIGxpZ2h0ZW4gKGNvbG9yLCBhbW91bnQpIHtcbiAgICBhbW91bnQgPSAoYW1vdW50ID09PSAwKSA/IDAgOiAoYW1vdW50IHx8IDEwKTtcbiAgICB2YXIgaHNsID0gdGlueWNvbG9yKGNvbG9yKS50b0hzbCgpO1xuICAgIGhzbC5sICs9IGFtb3VudCAvIDEwMDtcbiAgICBoc2wubCA9IGNsYW1wMDEoaHNsLmwpO1xuICAgIHJldHVybiB0aW55Y29sb3IoaHNsKTtcbn1cblxuZnVuY3Rpb24gYnJpZ2h0ZW4oY29sb3IsIGFtb3VudCkge1xuICAgIGFtb3VudCA9IChhbW91bnQgPT09IDApID8gMCA6IChhbW91bnQgfHwgMTApO1xuICAgIHZhciByZ2IgPSB0aW55Y29sb3IoY29sb3IpLnRvUmdiKCk7XG4gICAgcmdiLnIgPSBtYXRoTWF4KDAsIG1hdGhNaW4oMjU1LCByZ2IuciAtIG1hdGhSb3VuZCgyNTUgKiAtIChhbW91bnQgLyAxMDApKSkpO1xuICAgIHJnYi5nID0gbWF0aE1heCgwLCBtYXRoTWluKDI1NSwgcmdiLmcgLSBtYXRoUm91bmQoMjU1ICogLSAoYW1vdW50IC8gMTAwKSkpKTtcbiAgICByZ2IuYiA9IG1hdGhNYXgoMCwgbWF0aE1pbigyNTUsIHJnYi5iIC0gbWF0aFJvdW5kKDI1NSAqIC0gKGFtb3VudCAvIDEwMCkpKSk7XG4gICAgcmV0dXJuIHRpbnljb2xvcihyZ2IpO1xufVxuXG5mdW5jdGlvbiBkYXJrZW4gKGNvbG9yLCBhbW91bnQpIHtcbiAgICBhbW91bnQgPSAoYW1vdW50ID09PSAwKSA/IDAgOiAoYW1vdW50IHx8IDEwKTtcbiAgICB2YXIgaHNsID0gdGlueWNvbG9yKGNvbG9yKS50b0hzbCgpO1xuICAgIGhzbC5sIC09IGFtb3VudCAvIDEwMDtcbiAgICBoc2wubCA9IGNsYW1wMDEoaHNsLmwpO1xuICAgIHJldHVybiB0aW55Y29sb3IoaHNsKTtcbn1cblxuLy8gU3BpbiB0YWtlcyBhIHBvc2l0aXZlIG9yIG5lZ2F0aXZlIGFtb3VudCB3aXRoaW4gWy0zNjAsIDM2MF0gaW5kaWNhdGluZyB0aGUgY2hhbmdlIG9mIGh1ZS5cbi8vIFZhbHVlcyBvdXRzaWRlIG9mIHRoaXMgcmFuZ2Ugd2lsbCBiZSB3cmFwcGVkIGludG8gdGhpcyByYW5nZS5cbmZ1bmN0aW9uIHNwaW4oY29sb3IsIGFtb3VudCkge1xuICAgIHZhciBoc2wgPSB0aW55Y29sb3IoY29sb3IpLnRvSHNsKCk7XG4gICAgdmFyIGh1ZSA9IChtYXRoUm91bmQoaHNsLmgpICsgYW1vdW50KSAlIDM2MDtcbiAgICBoc2wuaCA9IGh1ZSA8IDAgPyAzNjAgKyBodWUgOiBodWU7XG4gICAgcmV0dXJuIHRpbnljb2xvcihoc2wpO1xufVxuXG4vLyBDb21iaW5hdGlvbiBGdW5jdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gVGhhbmtzIHRvIGpRdWVyeSB4Q29sb3IgZm9yIHNvbWUgb2YgdGhlIGlkZWFzIGJlaGluZCB0aGVzZVxuLy8gPGh0dHBzOi8vZ2l0aHViLmNvbS9pbmZ1c2lvbi9qUXVlcnkteGNvbG9yL2Jsb2IvbWFzdGVyL2pxdWVyeS54Y29sb3IuanM+XG5cbmZ1bmN0aW9uIGNvbXBsZW1lbnQoY29sb3IpIHtcbiAgICB2YXIgaHNsID0gdGlueWNvbG9yKGNvbG9yKS50b0hzbCgpO1xuICAgIGhzbC5oID0gKGhzbC5oICsgMTgwKSAlIDM2MDtcbiAgICByZXR1cm4gdGlueWNvbG9yKGhzbCk7XG59XG5cbmZ1bmN0aW9uIHRyaWFkKGNvbG9yKSB7XG4gICAgdmFyIGhzbCA9IHRpbnljb2xvcihjb2xvcikudG9Ic2woKTtcbiAgICB2YXIgaCA9IGhzbC5oO1xuICAgIHJldHVybiBbXG4gICAgICAgIHRpbnljb2xvcihjb2xvciksXG4gICAgICAgIHRpbnljb2xvcih7IGg6IChoICsgMTIwKSAlIDM2MCwgczogaHNsLnMsIGw6IGhzbC5sIH0pLFxuICAgICAgICB0aW55Y29sb3IoeyBoOiAoaCArIDI0MCkgJSAzNjAsIHM6IGhzbC5zLCBsOiBoc2wubCB9KVxuICAgIF07XG59XG5cbmZ1bmN0aW9uIHRldHJhZChjb2xvcikge1xuICAgIHZhciBoc2wgPSB0aW55Y29sb3IoY29sb3IpLnRvSHNsKCk7XG4gICAgdmFyIGggPSBoc2wuaDtcbiAgICByZXR1cm4gW1xuICAgICAgICB0aW55Y29sb3IoY29sb3IpLFxuICAgICAgICB0aW55Y29sb3IoeyBoOiAoaCArIDkwKSAlIDM2MCwgczogaHNsLnMsIGw6IGhzbC5sIH0pLFxuICAgICAgICB0aW55Y29sb3IoeyBoOiAoaCArIDE4MCkgJSAzNjAsIHM6IGhzbC5zLCBsOiBoc2wubCB9KSxcbiAgICAgICAgdGlueWNvbG9yKHsgaDogKGggKyAyNzApICUgMzYwLCBzOiBoc2wucywgbDogaHNsLmwgfSlcbiAgICBdO1xufVxuXG5mdW5jdGlvbiBzcGxpdGNvbXBsZW1lbnQoY29sb3IpIHtcbiAgICB2YXIgaHNsID0gdGlueWNvbG9yKGNvbG9yKS50b0hzbCgpO1xuICAgIHZhciBoID0gaHNsLmg7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgdGlueWNvbG9yKGNvbG9yKSxcbiAgICAgICAgdGlueWNvbG9yKHsgaDogKGggKyA3MikgJSAzNjAsIHM6IGhzbC5zLCBsOiBoc2wubH0pLFxuICAgICAgICB0aW55Y29sb3IoeyBoOiAoaCArIDIxNikgJSAzNjAsIHM6IGhzbC5zLCBsOiBoc2wubH0pXG4gICAgXTtcbn1cblxuZnVuY3Rpb24gYW5hbG9nb3VzKGNvbG9yLCByZXN1bHRzLCBzbGljZXMpIHtcbiAgICByZXN1bHRzID0gcmVzdWx0cyB8fCA2O1xuICAgIHNsaWNlcyA9IHNsaWNlcyB8fCAzMDtcblxuICAgIHZhciBoc2wgPSB0aW55Y29sb3IoY29sb3IpLnRvSHNsKCk7XG4gICAgdmFyIHBhcnQgPSAzNjAgLyBzbGljZXM7XG4gICAgdmFyIHJldCA9IFt0aW55Y29sb3IoY29sb3IpXTtcblxuICAgIGZvciAoaHNsLmggPSAoKGhzbC5oIC0gKHBhcnQgKiByZXN1bHRzID4+IDEpKSArIDcyMCkgJSAzNjA7IC0tcmVzdWx0czsgKSB7XG4gICAgICAgIGhzbC5oID0gKGhzbC5oICsgcGFydCkgJSAzNjA7XG4gICAgICAgIHJldC5wdXNoKHRpbnljb2xvcihoc2wpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gbW9ub2Nocm9tYXRpYyhjb2xvciwgcmVzdWx0cykge1xuICAgIHJlc3VsdHMgPSByZXN1bHRzIHx8IDY7XG4gICAgdmFyIGhzdiA9IHRpbnljb2xvcihjb2xvcikudG9Ic3YoKTtcbiAgICB2YXIgaCA9IGhzdi5oLCBzID0gaHN2LnMsIHYgPSBoc3YudjtcbiAgICB2YXIgcmV0ID0gW107XG4gICAgdmFyIG1vZGlmaWNhdGlvbiA9IDEgLyByZXN1bHRzO1xuXG4gICAgd2hpbGUgKHJlc3VsdHMtLSkge1xuICAgICAgICByZXQucHVzaCh0aW55Y29sb3IoeyBoOiBoLCBzOiBzLCB2OiB2fSkpO1xuICAgICAgICB2ID0gKHYgKyBtb2RpZmljYXRpb24pICUgMTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xufVxuXG4vLyBVdGlsaXR5IEZ1bmN0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnRpbnljb2xvci5taXggPSBmdW5jdGlvbihjb2xvcjEsIGNvbG9yMiwgYW1vdW50KSB7XG4gICAgYW1vdW50ID0gKGFtb3VudCA9PT0gMCkgPyAwIDogKGFtb3VudCB8fCA1MCk7XG5cbiAgICB2YXIgcmdiMSA9IHRpbnljb2xvcihjb2xvcjEpLnRvUmdiKCk7XG4gICAgdmFyIHJnYjIgPSB0aW55Y29sb3IoY29sb3IyKS50b1JnYigpO1xuXG4gICAgdmFyIHAgPSBhbW91bnQgLyAxMDA7XG4gICAgdmFyIHcgPSBwICogMiAtIDE7XG4gICAgdmFyIGEgPSByZ2IyLmEgLSByZ2IxLmE7XG5cbiAgICB2YXIgdzE7XG5cbiAgICBpZiAodyAqIGEgPT0gLTEpIHtcbiAgICAgICAgdzEgPSB3O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHcxID0gKHcgKyBhKSAvICgxICsgdyAqIGEpO1xuICAgIH1cblxuICAgIHcxID0gKHcxICsgMSkgLyAyO1xuXG4gICAgdmFyIHcyID0gMSAtIHcxO1xuXG4gICAgdmFyIHJnYmEgPSB7XG4gICAgICAgIHI6IHJnYjIuciAqIHcxICsgcmdiMS5yICogdzIsXG4gICAgICAgIGc6IHJnYjIuZyAqIHcxICsgcmdiMS5nICogdzIsXG4gICAgICAgIGI6IHJnYjIuYiAqIHcxICsgcmdiMS5iICogdzIsXG4gICAgICAgIGE6IHJnYjIuYSAqIHAgICsgcmdiMS5hICogKDEgLSBwKVxuICAgIH07XG5cbiAgICByZXR1cm4gdGlueWNvbG9yKHJnYmEpO1xufTtcblxuXG4vLyBSZWFkYWJpbGl0eSBGdW5jdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gPGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMDgvUkVDLVdDQUcyMC0yMDA4MTIxMS8jY29udHJhc3QtcmF0aW9kZWYgKFdDQUcgVmVyc2lvbiAyKVxuXG4vLyBgY29udHJhc3RgXG4vLyBBbmFseXplIHRoZSAyIGNvbG9ycyBhbmQgcmV0dXJucyB0aGUgY29sb3IgY29udHJhc3QgZGVmaW5lZCBieSAoV0NBRyBWZXJzaW9uIDIpXG50aW55Y29sb3IucmVhZGFiaWxpdHkgPSBmdW5jdGlvbihjb2xvcjEsIGNvbG9yMikge1xuICAgIHZhciBjMSA9IHRpbnljb2xvcihjb2xvcjEpO1xuICAgIHZhciBjMiA9IHRpbnljb2xvcihjb2xvcjIpO1xuICAgIHJldHVybiAoTWF0aC5tYXgoYzEuZ2V0THVtaW5hbmNlKCksYzIuZ2V0THVtaW5hbmNlKCkpKzAuMDUpIC8gKE1hdGgubWluKGMxLmdldEx1bWluYW5jZSgpLGMyLmdldEx1bWluYW5jZSgpKSswLjA1KTtcbn07XG5cbi8vIGBpc1JlYWRhYmxlYFxuLy8gRW5zdXJlIHRoYXQgZm9yZWdyb3VuZCBhbmQgYmFja2dyb3VuZCBjb2xvciBjb21iaW5hdGlvbnMgbWVldCBXQ0FHMiBndWlkZWxpbmVzLlxuLy8gVGhlIHRoaXJkIGFyZ3VtZW50IGlzIGFuIG9wdGlvbmFsIE9iamVjdC5cbi8vICAgICAgdGhlICdsZXZlbCcgcHJvcGVydHkgc3RhdGVzICdBQScgb3IgJ0FBQScgLSBpZiBtaXNzaW5nIG9yIGludmFsaWQsIGl0IGRlZmF1bHRzIHRvICdBQSc7XG4vLyAgICAgIHRoZSAnc2l6ZScgcHJvcGVydHkgc3RhdGVzICdsYXJnZScgb3IgJ3NtYWxsJyAtIGlmIG1pc3Npbmcgb3IgaW52YWxpZCwgaXQgZGVmYXVsdHMgdG8gJ3NtYWxsJy5cbi8vIElmIHRoZSBlbnRpcmUgb2JqZWN0IGlzIGFic2VudCwgaXNSZWFkYWJsZSBkZWZhdWx0cyB0byB7bGV2ZWw6XCJBQVwiLHNpemU6XCJzbWFsbFwifS5cblxuLy8gKkV4YW1wbGUqXG4vLyAgICB0aW55Y29sb3IuaXNSZWFkYWJsZShcIiMwMDBcIiwgXCIjMTExXCIpID0+IGZhbHNlXG4vLyAgICB0aW55Y29sb3IuaXNSZWFkYWJsZShcIiMwMDBcIiwgXCIjMTExXCIse2xldmVsOlwiQUFcIixzaXplOlwibGFyZ2VcIn0pID0+IGZhbHNlXG50aW55Y29sb3IuaXNSZWFkYWJsZSA9IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyLCB3Y2FnMikge1xuICAgIHZhciByZWFkYWJpbGl0eSA9IHRpbnljb2xvci5yZWFkYWJpbGl0eShjb2xvcjEsIGNvbG9yMik7XG4gICAgdmFyIHdjYWcyUGFybXMsIG91dDtcblxuICAgIG91dCA9IGZhbHNlO1xuXG4gICAgd2NhZzJQYXJtcyA9IHZhbGlkYXRlV0NBRzJQYXJtcyh3Y2FnMik7XG4gICAgc3dpdGNoICh3Y2FnMlBhcm1zLmxldmVsICsgd2NhZzJQYXJtcy5zaXplKSB7XG4gICAgICAgIGNhc2UgXCJBQXNtYWxsXCI6XG4gICAgICAgIGNhc2UgXCJBQUFsYXJnZVwiOlxuICAgICAgICAgICAgb3V0ID0gcmVhZGFiaWxpdHkgPj0gNC41O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJBQWxhcmdlXCI6XG4gICAgICAgICAgICBvdXQgPSByZWFkYWJpbGl0eSA+PSAzO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJBQUFzbWFsbFwiOlxuICAgICAgICAgICAgb3V0ID0gcmVhZGFiaWxpdHkgPj0gNztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuXG59O1xuXG4vLyBgbW9zdFJlYWRhYmxlYFxuLy8gR2l2ZW4gYSBiYXNlIGNvbG9yIGFuZCBhIGxpc3Qgb2YgcG9zc2libGUgZm9yZWdyb3VuZCBvciBiYWNrZ3JvdW5kXG4vLyBjb2xvcnMgZm9yIHRoYXQgYmFzZSwgcmV0dXJucyB0aGUgbW9zdCByZWFkYWJsZSBjb2xvci5cbi8vIE9wdGlvbmFsbHkgcmV0dXJucyBCbGFjayBvciBXaGl0ZSBpZiB0aGUgbW9zdCByZWFkYWJsZSBjb2xvciBpcyB1bnJlYWRhYmxlLlxuLy8gKkV4YW1wbGUqXG4vLyAgICB0aW55Y29sb3IubW9zdFJlYWRhYmxlKHRpbnljb2xvci5tb3N0UmVhZGFibGUoXCIjMTIzXCIsIFtcIiMxMjRcIiwgXCIjMTI1XCJdLHtpbmNsdWRlRmFsbGJhY2tDb2xvcnM6ZmFsc2V9KS50b0hleFN0cmluZygpOyAvLyBcIiMxMTIyNTVcIlxuLy8gICAgdGlueWNvbG9yLm1vc3RSZWFkYWJsZSh0aW55Y29sb3IubW9zdFJlYWRhYmxlKFwiIzEyM1wiLCBbXCIjMTI0XCIsIFwiIzEyNVwiXSx7aW5jbHVkZUZhbGxiYWNrQ29sb3JzOnRydWV9KS50b0hleFN0cmluZygpOyAgLy8gXCIjZmZmZmZmXCJcbi8vICAgIHRpbnljb2xvci5tb3N0UmVhZGFibGUoXCIjYTgwMTVhXCIsIFtcIiNmYWYzZjNcIl0se2luY2x1ZGVGYWxsYmFja0NvbG9yczp0cnVlLGxldmVsOlwiQUFBXCIsc2l6ZTpcImxhcmdlXCJ9KS50b0hleFN0cmluZygpOyAvLyBcIiNmYWYzZjNcIlxuLy8gICAgdGlueWNvbG9yLm1vc3RSZWFkYWJsZShcIiNhODAxNWFcIiwgW1wiI2ZhZjNmM1wiXSx7aW5jbHVkZUZhbGxiYWNrQ29sb3JzOnRydWUsbGV2ZWw6XCJBQUFcIixzaXplOlwic21hbGxcIn0pLnRvSGV4U3RyaW5nKCk7IC8vIFwiI2ZmZmZmZlwiXG50aW55Y29sb3IubW9zdFJlYWRhYmxlID0gZnVuY3Rpb24oYmFzZUNvbG9yLCBjb2xvckxpc3QsIGFyZ3MpIHtcbiAgICB2YXIgYmVzdENvbG9yID0gbnVsbDtcbiAgICB2YXIgYmVzdFNjb3JlID0gMDtcbiAgICB2YXIgcmVhZGFiaWxpdHk7XG4gICAgdmFyIGluY2x1ZGVGYWxsYmFja0NvbG9ycywgbGV2ZWwsIHNpemUgO1xuICAgIGFyZ3MgPSBhcmdzIHx8IHt9O1xuICAgIGluY2x1ZGVGYWxsYmFja0NvbG9ycyA9IGFyZ3MuaW5jbHVkZUZhbGxiYWNrQ29sb3JzIDtcbiAgICBsZXZlbCA9IGFyZ3MubGV2ZWw7XG4gICAgc2l6ZSA9IGFyZ3Muc2l6ZTtcblxuICAgIGZvciAodmFyIGk9IDA7IGkgPCBjb2xvckxpc3QubGVuZ3RoIDsgaSsrKSB7XG4gICAgICAgIHJlYWRhYmlsaXR5ID0gdGlueWNvbG9yLnJlYWRhYmlsaXR5KGJhc2VDb2xvciwgY29sb3JMaXN0W2ldKTtcbiAgICAgICAgaWYgKHJlYWRhYmlsaXR5ID4gYmVzdFNjb3JlKSB7XG4gICAgICAgICAgICBiZXN0U2NvcmUgPSByZWFkYWJpbGl0eTtcbiAgICAgICAgICAgIGJlc3RDb2xvciA9IHRpbnljb2xvcihjb2xvckxpc3RbaV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRpbnljb2xvci5pc1JlYWRhYmxlKGJhc2VDb2xvciwgYmVzdENvbG9yLCB7XCJsZXZlbFwiOmxldmVsLFwic2l6ZVwiOnNpemV9KSB8fCAhaW5jbHVkZUZhbGxiYWNrQ29sb3JzKSB7XG4gICAgICAgIHJldHVybiBiZXN0Q29sb3I7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBhcmdzLmluY2x1ZGVGYWxsYmFja0NvbG9ycz1mYWxzZTtcbiAgICAgICAgcmV0dXJuIHRpbnljb2xvci5tb3N0UmVhZGFibGUoYmFzZUNvbG9yLFtcIiNmZmZcIiwgXCIjMDAwXCJdLGFyZ3MpO1xuICAgIH1cbn07XG5cblxuLy8gQmlnIExpc3Qgb2YgQ29sb3JzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS1cbi8vIDxodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLWNvbG9yLyNzdmctY29sb3I+XG52YXIgbmFtZXMgPSB0aW55Y29sb3IubmFtZXMgPSB7XG4gICAgYWxpY2VibHVlOiBcImYwZjhmZlwiLFxuICAgIGFudGlxdWV3aGl0ZTogXCJmYWViZDdcIixcbiAgICBhcXVhOiBcIjBmZlwiLFxuICAgIGFxdWFtYXJpbmU6IFwiN2ZmZmQ0XCIsXG4gICAgYXp1cmU6IFwiZjBmZmZmXCIsXG4gICAgYmVpZ2U6IFwiZjVmNWRjXCIsXG4gICAgYmlzcXVlOiBcImZmZTRjNFwiLFxuICAgIGJsYWNrOiBcIjAwMFwiLFxuICAgIGJsYW5jaGVkYWxtb25kOiBcImZmZWJjZFwiLFxuICAgIGJsdWU6IFwiMDBmXCIsXG4gICAgYmx1ZXZpb2xldDogXCI4YTJiZTJcIixcbiAgICBicm93bjogXCJhNTJhMmFcIixcbiAgICBidXJseXdvb2Q6IFwiZGViODg3XCIsXG4gICAgYnVybnRzaWVubmE6IFwiZWE3ZTVkXCIsXG4gICAgY2FkZXRibHVlOiBcIjVmOWVhMFwiLFxuICAgIGNoYXJ0cmV1c2U6IFwiN2ZmZjAwXCIsXG4gICAgY2hvY29sYXRlOiBcImQyNjkxZVwiLFxuICAgIGNvcmFsOiBcImZmN2Y1MFwiLFxuICAgIGNvcm5mbG93ZXJibHVlOiBcIjY0OTVlZFwiLFxuICAgIGNvcm5zaWxrOiBcImZmZjhkY1wiLFxuICAgIGNyaW1zb246IFwiZGMxNDNjXCIsXG4gICAgY3lhbjogXCIwZmZcIixcbiAgICBkYXJrYmx1ZTogXCIwMDAwOGJcIixcbiAgICBkYXJrY3lhbjogXCIwMDhiOGJcIixcbiAgICBkYXJrZ29sZGVucm9kOiBcImI4ODYwYlwiLFxuICAgIGRhcmtncmF5OiBcImE5YTlhOVwiLFxuICAgIGRhcmtncmVlbjogXCIwMDY0MDBcIixcbiAgICBkYXJrZ3JleTogXCJhOWE5YTlcIixcbiAgICBkYXJra2hha2k6IFwiYmRiNzZiXCIsXG4gICAgZGFya21hZ2VudGE6IFwiOGIwMDhiXCIsXG4gICAgZGFya29saXZlZ3JlZW46IFwiNTU2YjJmXCIsXG4gICAgZGFya29yYW5nZTogXCJmZjhjMDBcIixcbiAgICBkYXJrb3JjaGlkOiBcIjk5MzJjY1wiLFxuICAgIGRhcmtyZWQ6IFwiOGIwMDAwXCIsXG4gICAgZGFya3NhbG1vbjogXCJlOTk2N2FcIixcbiAgICBkYXJrc2VhZ3JlZW46IFwiOGZiYzhmXCIsXG4gICAgZGFya3NsYXRlYmx1ZTogXCI0ODNkOGJcIixcbiAgICBkYXJrc2xhdGVncmF5OiBcIjJmNGY0ZlwiLFxuICAgIGRhcmtzbGF0ZWdyZXk6IFwiMmY0ZjRmXCIsXG4gICAgZGFya3R1cnF1b2lzZTogXCIwMGNlZDFcIixcbiAgICBkYXJrdmlvbGV0OiBcIjk0MDBkM1wiLFxuICAgIGRlZXBwaW5rOiBcImZmMTQ5M1wiLFxuICAgIGRlZXBza3libHVlOiBcIjAwYmZmZlwiLFxuICAgIGRpbWdyYXk6IFwiNjk2OTY5XCIsXG4gICAgZGltZ3JleTogXCI2OTY5NjlcIixcbiAgICBkb2RnZXJibHVlOiBcIjFlOTBmZlwiLFxuICAgIGZpcmVicmljazogXCJiMjIyMjJcIixcbiAgICBmbG9yYWx3aGl0ZTogXCJmZmZhZjBcIixcbiAgICBmb3Jlc3RncmVlbjogXCIyMjhiMjJcIixcbiAgICBmdWNoc2lhOiBcImYwZlwiLFxuICAgIGdhaW5zYm9ybzogXCJkY2RjZGNcIixcbiAgICBnaG9zdHdoaXRlOiBcImY4ZjhmZlwiLFxuICAgIGdvbGQ6IFwiZmZkNzAwXCIsXG4gICAgZ29sZGVucm9kOiBcImRhYTUyMFwiLFxuICAgIGdyYXk6IFwiODA4MDgwXCIsXG4gICAgZ3JlZW46IFwiMDA4MDAwXCIsXG4gICAgZ3JlZW55ZWxsb3c6IFwiYWRmZjJmXCIsXG4gICAgZ3JleTogXCI4MDgwODBcIixcbiAgICBob25leWRldzogXCJmMGZmZjBcIixcbiAgICBob3RwaW5rOiBcImZmNjliNFwiLFxuICAgIGluZGlhbnJlZDogXCJjZDVjNWNcIixcbiAgICBpbmRpZ286IFwiNGIwMDgyXCIsXG4gICAgaXZvcnk6IFwiZmZmZmYwXCIsXG4gICAga2hha2k6IFwiZjBlNjhjXCIsXG4gICAgbGF2ZW5kZXI6IFwiZTZlNmZhXCIsXG4gICAgbGF2ZW5kZXJibHVzaDogXCJmZmYwZjVcIixcbiAgICBsYXduZ3JlZW46IFwiN2NmYzAwXCIsXG4gICAgbGVtb25jaGlmZm9uOiBcImZmZmFjZFwiLFxuICAgIGxpZ2h0Ymx1ZTogXCJhZGQ4ZTZcIixcbiAgICBsaWdodGNvcmFsOiBcImYwODA4MFwiLFxuICAgIGxpZ2h0Y3lhbjogXCJlMGZmZmZcIixcbiAgICBsaWdodGdvbGRlbnJvZHllbGxvdzogXCJmYWZhZDJcIixcbiAgICBsaWdodGdyYXk6IFwiZDNkM2QzXCIsXG4gICAgbGlnaHRncmVlbjogXCI5MGVlOTBcIixcbiAgICBsaWdodGdyZXk6IFwiZDNkM2QzXCIsXG4gICAgbGlnaHRwaW5rOiBcImZmYjZjMVwiLFxuICAgIGxpZ2h0c2FsbW9uOiBcImZmYTA3YVwiLFxuICAgIGxpZ2h0c2VhZ3JlZW46IFwiMjBiMmFhXCIsXG4gICAgbGlnaHRza3libHVlOiBcIjg3Y2VmYVwiLFxuICAgIGxpZ2h0c2xhdGVncmF5OiBcIjc4OVwiLFxuICAgIGxpZ2h0c2xhdGVncmV5OiBcIjc4OVwiLFxuICAgIGxpZ2h0c3RlZWxibHVlOiBcImIwYzRkZVwiLFxuICAgIGxpZ2h0eWVsbG93OiBcImZmZmZlMFwiLFxuICAgIGxpbWU6IFwiMGYwXCIsXG4gICAgbGltZWdyZWVuOiBcIjMyY2QzMlwiLFxuICAgIGxpbmVuOiBcImZhZjBlNlwiLFxuICAgIG1hZ2VudGE6IFwiZjBmXCIsXG4gICAgbWFyb29uOiBcIjgwMDAwMFwiLFxuICAgIG1lZGl1bWFxdWFtYXJpbmU6IFwiNjZjZGFhXCIsXG4gICAgbWVkaXVtYmx1ZTogXCIwMDAwY2RcIixcbiAgICBtZWRpdW1vcmNoaWQ6IFwiYmE1NWQzXCIsXG4gICAgbWVkaXVtcHVycGxlOiBcIjkzNzBkYlwiLFxuICAgIG1lZGl1bXNlYWdyZWVuOiBcIjNjYjM3MVwiLFxuICAgIG1lZGl1bXNsYXRlYmx1ZTogXCI3YjY4ZWVcIixcbiAgICBtZWRpdW1zcHJpbmdncmVlbjogXCIwMGZhOWFcIixcbiAgICBtZWRpdW10dXJxdW9pc2U6IFwiNDhkMWNjXCIsXG4gICAgbWVkaXVtdmlvbGV0cmVkOiBcImM3MTU4NVwiLFxuICAgIG1pZG5pZ2h0Ymx1ZTogXCIxOTE5NzBcIixcbiAgICBtaW50Y3JlYW06IFwiZjVmZmZhXCIsXG4gICAgbWlzdHlyb3NlOiBcImZmZTRlMVwiLFxuICAgIG1vY2Nhc2luOiBcImZmZTRiNVwiLFxuICAgIG5hdmFqb3doaXRlOiBcImZmZGVhZFwiLFxuICAgIG5hdnk6IFwiMDAwMDgwXCIsXG4gICAgb2xkbGFjZTogXCJmZGY1ZTZcIixcbiAgICBvbGl2ZTogXCI4MDgwMDBcIixcbiAgICBvbGl2ZWRyYWI6IFwiNmI4ZTIzXCIsXG4gICAgb3JhbmdlOiBcImZmYTUwMFwiLFxuICAgIG9yYW5nZXJlZDogXCJmZjQ1MDBcIixcbiAgICBvcmNoaWQ6IFwiZGE3MGQ2XCIsXG4gICAgcGFsZWdvbGRlbnJvZDogXCJlZWU4YWFcIixcbiAgICBwYWxlZ3JlZW46IFwiOThmYjk4XCIsXG4gICAgcGFsZXR1cnF1b2lzZTogXCJhZmVlZWVcIixcbiAgICBwYWxldmlvbGV0cmVkOiBcImRiNzA5M1wiLFxuICAgIHBhcGF5YXdoaXA6IFwiZmZlZmQ1XCIsXG4gICAgcGVhY2hwdWZmOiBcImZmZGFiOVwiLFxuICAgIHBlcnU6IFwiY2Q4NTNmXCIsXG4gICAgcGluazogXCJmZmMwY2JcIixcbiAgICBwbHVtOiBcImRkYTBkZFwiLFxuICAgIHBvd2RlcmJsdWU6IFwiYjBlMGU2XCIsXG4gICAgcHVycGxlOiBcIjgwMDA4MFwiLFxuICAgIHJlYmVjY2FwdXJwbGU6IFwiNjYzMzk5XCIsXG4gICAgcmVkOiBcImYwMFwiLFxuICAgIHJvc3licm93bjogXCJiYzhmOGZcIixcbiAgICByb3lhbGJsdWU6IFwiNDE2OWUxXCIsXG4gICAgc2FkZGxlYnJvd246IFwiOGI0NTEzXCIsXG4gICAgc2FsbW9uOiBcImZhODA3MlwiLFxuICAgIHNhbmR5YnJvd246IFwiZjRhNDYwXCIsXG4gICAgc2VhZ3JlZW46IFwiMmU4YjU3XCIsXG4gICAgc2Vhc2hlbGw6IFwiZmZmNWVlXCIsXG4gICAgc2llbm5hOiBcImEwNTIyZFwiLFxuICAgIHNpbHZlcjogXCJjMGMwYzBcIixcbiAgICBza3libHVlOiBcIjg3Y2VlYlwiLFxuICAgIHNsYXRlYmx1ZTogXCI2YTVhY2RcIixcbiAgICBzbGF0ZWdyYXk6IFwiNzA4MDkwXCIsXG4gICAgc2xhdGVncmV5OiBcIjcwODA5MFwiLFxuICAgIHNub3c6IFwiZmZmYWZhXCIsXG4gICAgc3ByaW5nZ3JlZW46IFwiMDBmZjdmXCIsXG4gICAgc3RlZWxibHVlOiBcIjQ2ODJiNFwiLFxuICAgIHRhbjogXCJkMmI0OGNcIixcbiAgICB0ZWFsOiBcIjAwODA4MFwiLFxuICAgIHRoaXN0bGU6IFwiZDhiZmQ4XCIsXG4gICAgdG9tYXRvOiBcImZmNjM0N1wiLFxuICAgIHR1cnF1b2lzZTogXCI0MGUwZDBcIixcbiAgICB2aW9sZXQ6IFwiZWU4MmVlXCIsXG4gICAgd2hlYXQ6IFwiZjVkZWIzXCIsXG4gICAgd2hpdGU6IFwiZmZmXCIsXG4gICAgd2hpdGVzbW9rZTogXCJmNWY1ZjVcIixcbiAgICB5ZWxsb3c6IFwiZmYwXCIsXG4gICAgeWVsbG93Z3JlZW46IFwiOWFjZDMyXCJcbn07XG5cbi8vIE1ha2UgaXQgZWFzeSB0byBhY2Nlc3MgY29sb3JzIHZpYSBgaGV4TmFtZXNbaGV4XWBcbnZhciBoZXhOYW1lcyA9IHRpbnljb2xvci5oZXhOYW1lcyA9IGZsaXAobmFtZXMpO1xuXG5cbi8vIFV0aWxpdGllc1xuLy8gLS0tLS0tLS0tXG5cbi8vIGB7ICduYW1lMSc6ICd2YWwxJyB9YCBiZWNvbWVzIGB7ICd2YWwxJzogJ25hbWUxJyB9YFxuZnVuY3Rpb24gZmxpcChvKSB7XG4gICAgdmFyIGZsaXBwZWQgPSB7IH07XG4gICAgZm9yICh2YXIgaSBpbiBvKSB7XG4gICAgICAgIGlmIChvLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICBmbGlwcGVkW29baV1dID0gaTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmxpcHBlZDtcbn1cblxuLy8gUmV0dXJuIGEgdmFsaWQgYWxwaGEgdmFsdWUgWzAsMV0gd2l0aCBhbGwgaW52YWxpZCB2YWx1ZXMgYmVpbmcgc2V0IHRvIDFcbmZ1bmN0aW9uIGJvdW5kQWxwaGEoYSkge1xuICAgIGEgPSBwYXJzZUZsb2F0KGEpO1xuXG4gICAgaWYgKGlzTmFOKGEpIHx8IGEgPCAwIHx8IGEgPiAxKSB7XG4gICAgICAgIGEgPSAxO1xuICAgIH1cblxuICAgIHJldHVybiBhO1xufVxuXG4vLyBUYWtlIGlucHV0IGZyb20gWzAsIG5dIGFuZCByZXR1cm4gaXQgYXMgWzAsIDFdXG5mdW5jdGlvbiBib3VuZDAxKG4sIG1heCkge1xuICAgIGlmIChpc09uZVBvaW50WmVybyhuKSkgeyBuID0gXCIxMDAlXCI7IH1cblxuICAgIHZhciBwcm9jZXNzUGVyY2VudCA9IGlzUGVyY2VudGFnZShuKTtcbiAgICBuID0gbWF0aE1pbihtYXgsIG1hdGhNYXgoMCwgcGFyc2VGbG9hdChuKSkpO1xuXG4gICAgLy8gQXV0b21hdGljYWxseSBjb252ZXJ0IHBlcmNlbnRhZ2UgaW50byBudW1iZXJcbiAgICBpZiAocHJvY2Vzc1BlcmNlbnQpIHtcbiAgICAgICAgbiA9IHBhcnNlSW50KG4gKiBtYXgsIDEwKSAvIDEwMDtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgZmxvYXRpbmcgcG9pbnQgcm91bmRpbmcgZXJyb3JzXG4gICAgaWYgKChtYXRoLmFicyhuIC0gbWF4KSA8IDAuMDAwMDAxKSkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICAvLyBDb252ZXJ0IGludG8gWzAsIDFdIHJhbmdlIGlmIGl0IGlzbid0IGFscmVhZHlcbiAgICByZXR1cm4gKG4gJSBtYXgpIC8gcGFyc2VGbG9hdChtYXgpO1xufVxuXG4vLyBGb3JjZSBhIG51bWJlciBiZXR3ZWVuIDAgYW5kIDFcbmZ1bmN0aW9uIGNsYW1wMDEodmFsKSB7XG4gICAgcmV0dXJuIG1hdGhNaW4oMSwgbWF0aE1heCgwLCB2YWwpKTtcbn1cblxuLy8gUGFyc2UgYSBiYXNlLTE2IGhleCB2YWx1ZSBpbnRvIGEgYmFzZS0xMCBpbnRlZ2VyXG5mdW5jdGlvbiBwYXJzZUludEZyb21IZXgodmFsKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KHZhbCwgMTYpO1xufVxuXG4vLyBOZWVkIHRvIGhhbmRsZSAxLjAgYXMgMTAwJSwgc2luY2Ugb25jZSBpdCBpcyBhIG51bWJlciwgdGhlcmUgaXMgbm8gZGlmZmVyZW5jZSBiZXR3ZWVuIGl0IGFuZCAxXG4vLyA8aHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83NDIyMDcyL2phdmFzY3JpcHQtaG93LXRvLWRldGVjdC1udW1iZXItYXMtYS1kZWNpbWFsLWluY2x1ZGluZy0xLTA+XG5mdW5jdGlvbiBpc09uZVBvaW50WmVybyhuKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBuID09IFwic3RyaW5nXCIgJiYgbi5pbmRleE9mKCcuJykgIT0gLTEgJiYgcGFyc2VGbG9hdChuKSA9PT0gMTtcbn1cblxuLy8gQ2hlY2sgdG8gc2VlIGlmIHN0cmluZyBwYXNzZWQgaW4gaXMgYSBwZXJjZW50YWdlXG5mdW5jdGlvbiBpc1BlcmNlbnRhZ2Uobikge1xuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gXCJzdHJpbmdcIiAmJiBuLmluZGV4T2YoJyUnKSAhPSAtMTtcbn1cblxuLy8gRm9yY2UgYSBoZXggdmFsdWUgdG8gaGF2ZSAyIGNoYXJhY3RlcnNcbmZ1bmN0aW9uIHBhZDIoYykge1xuICAgIHJldHVybiBjLmxlbmd0aCA9PSAxID8gJzAnICsgYyA6ICcnICsgYztcbn1cblxuLy8gUmVwbGFjZSBhIGRlY2ltYWwgd2l0aCBpdCdzIHBlcmNlbnRhZ2UgdmFsdWVcbmZ1bmN0aW9uIGNvbnZlcnRUb1BlcmNlbnRhZ2Uobikge1xuICAgIGlmIChuIDw9IDEpIHtcbiAgICAgICAgbiA9IChuICogMTAwKSArIFwiJVwiO1xuICAgIH1cblxuICAgIHJldHVybiBuO1xufVxuXG4vLyBDb252ZXJ0cyBhIGRlY2ltYWwgdG8gYSBoZXggdmFsdWVcbmZ1bmN0aW9uIGNvbnZlcnREZWNpbWFsVG9IZXgoZCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKHBhcnNlRmxvYXQoZCkgKiAyNTUpLnRvU3RyaW5nKDE2KTtcbn1cbi8vIENvbnZlcnRzIGEgaGV4IHZhbHVlIHRvIGEgZGVjaW1hbFxuZnVuY3Rpb24gY29udmVydEhleFRvRGVjaW1hbChoKSB7XG4gICAgcmV0dXJuIChwYXJzZUludEZyb21IZXgoaCkgLyAyNTUpO1xufVxuXG52YXIgbWF0Y2hlcnMgPSAoZnVuY3Rpb24oKSB7XG5cbiAgICAvLyA8aHR0cDovL3d3dy53My5vcmcvVFIvY3NzMy12YWx1ZXMvI2ludGVnZXJzPlxuICAgIHZhciBDU1NfSU5URUdFUiA9IFwiWy1cXFxcK10/XFxcXGQrJT9cIjtcblxuICAgIC8vIDxodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLXZhbHVlcy8jbnVtYmVyLXZhbHVlPlxuICAgIHZhciBDU1NfTlVNQkVSID0gXCJbLVxcXFwrXT9cXFxcZCpcXFxcLlxcXFxkKyU/XCI7XG5cbiAgICAvLyBBbGxvdyBwb3NpdGl2ZS9uZWdhdGl2ZSBpbnRlZ2VyL251bWJlci4gIERvbid0IGNhcHR1cmUgdGhlIGVpdGhlci9vciwganVzdCB0aGUgZW50aXJlIG91dGNvbWUuXG4gICAgdmFyIENTU19VTklUID0gXCIoPzpcIiArIENTU19OVU1CRVIgKyBcIil8KD86XCIgKyBDU1NfSU5URUdFUiArIFwiKVwiO1xuXG4gICAgLy8gQWN0dWFsIG1hdGNoaW5nLlxuICAgIC8vIFBhcmVudGhlc2VzIGFuZCBjb21tYXMgYXJlIG9wdGlvbmFsLCBidXQgbm90IHJlcXVpcmVkLlxuICAgIC8vIFdoaXRlc3BhY2UgY2FuIHRha2UgdGhlIHBsYWNlIG9mIGNvbW1hcyBvciBvcGVuaW5nIHBhcmVuXG4gICAgdmFyIFBFUk1JU1NJVkVfTUFUQ0gzID0gXCJbXFxcXHN8XFxcXChdKyhcIiArIENTU19VTklUICsgXCIpWyx8XFxcXHNdKyhcIiArIENTU19VTklUICsgXCIpWyx8XFxcXHNdKyhcIiArIENTU19VTklUICsgXCIpXFxcXHMqXFxcXCk/XCI7XG4gICAgdmFyIFBFUk1JU1NJVkVfTUFUQ0g0ID0gXCJbXFxcXHN8XFxcXChdKyhcIiArIENTU19VTklUICsgXCIpWyx8XFxcXHNdKyhcIiArIENTU19VTklUICsgXCIpWyx8XFxcXHNdKyhcIiArIENTU19VTklUICsgXCIpWyx8XFxcXHNdKyhcIiArIENTU19VTklUICsgXCIpXFxcXHMqXFxcXCk/XCI7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZ2I6IG5ldyBSZWdFeHAoXCJyZ2JcIiArIFBFUk1JU1NJVkVfTUFUQ0gzKSxcbiAgICAgICAgcmdiYTogbmV3IFJlZ0V4cChcInJnYmFcIiArIFBFUk1JU1NJVkVfTUFUQ0g0KSxcbiAgICAgICAgaHNsOiBuZXcgUmVnRXhwKFwiaHNsXCIgKyBQRVJNSVNTSVZFX01BVENIMyksXG4gICAgICAgIGhzbGE6IG5ldyBSZWdFeHAoXCJoc2xhXCIgKyBQRVJNSVNTSVZFX01BVENINCksXG4gICAgICAgIGhzdjogbmV3IFJlZ0V4cChcImhzdlwiICsgUEVSTUlTU0lWRV9NQVRDSDMpLFxuICAgICAgICBoc3ZhOiBuZXcgUmVnRXhwKFwiaHN2YVwiICsgUEVSTUlTU0lWRV9NQVRDSDQpLFxuICAgICAgICBoZXgzOiAvXiM/KFswLTlhLWZBLUZdezF9KShbMC05YS1mQS1GXXsxfSkoWzAtOWEtZkEtRl17MX0pJC8sXG4gICAgICAgIGhleDY6IC9eIz8oWzAtOWEtZkEtRl17Mn0pKFswLTlhLWZBLUZdezJ9KShbMC05YS1mQS1GXXsyfSkkLyxcbiAgICAgICAgaGV4ODogL14jPyhbMC05YS1mQS1GXXsyfSkoWzAtOWEtZkEtRl17Mn0pKFswLTlhLWZBLUZdezJ9KShbMC05YS1mQS1GXXsyfSkkL1xuICAgIH07XG59KSgpO1xuXG4vLyBgc3RyaW5nSW5wdXRUb09iamVjdGBcbi8vIFBlcm1pc3NpdmUgc3RyaW5nIHBhcnNpbmcuICBUYWtlIGluIGEgbnVtYmVyIG9mIGZvcm1hdHMsIGFuZCBvdXRwdXQgYW4gb2JqZWN0XG4vLyBiYXNlZCBvbiBkZXRlY3RlZCBmb3JtYXQuICBSZXR1cm5zIGB7IHIsIGcsIGIgfWAgb3IgYHsgaCwgcywgbCB9YCBvciBgeyBoLCBzLCB2fWBcbmZ1bmN0aW9uIHN0cmluZ0lucHV0VG9PYmplY3QoY29sb3IpIHtcblxuICAgIGNvbG9yID0gY29sb3IucmVwbGFjZSh0cmltTGVmdCwnJykucmVwbGFjZSh0cmltUmlnaHQsICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhciBuYW1lZCA9IGZhbHNlO1xuICAgIGlmIChuYW1lc1tjb2xvcl0pIHtcbiAgICAgICAgY29sb3IgPSBuYW1lc1tjb2xvcl07XG4gICAgICAgIG5hbWVkID0gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAoY29sb3IgPT0gJ3RyYW5zcGFyZW50Jykge1xuICAgICAgICByZXR1cm4geyByOiAwLCBnOiAwLCBiOiAwLCBhOiAwLCBmb3JtYXQ6IFwibmFtZVwiIH07XG4gICAgfVxuXG4gICAgLy8gVHJ5IHRvIG1hdGNoIHN0cmluZyBpbnB1dCB1c2luZyByZWd1bGFyIGV4cHJlc3Npb25zLlxuICAgIC8vIEtlZXAgbW9zdCBvZiB0aGUgbnVtYmVyIGJvdW5kaW5nIG91dCBvZiB0aGlzIGZ1bmN0aW9uIC0gZG9uJ3Qgd29ycnkgYWJvdXQgWzAsMV0gb3IgWzAsMTAwXSBvciBbMCwzNjBdXG4gICAgLy8gSnVzdCByZXR1cm4gYW4gb2JqZWN0IGFuZCBsZXQgdGhlIGNvbnZlcnNpb24gZnVuY3Rpb25zIGhhbmRsZSB0aGF0LlxuICAgIC8vIFRoaXMgd2F5IHRoZSByZXN1bHQgd2lsbCBiZSB0aGUgc2FtZSB3aGV0aGVyIHRoZSB0aW55Y29sb3IgaXMgaW5pdGlhbGl6ZWQgd2l0aCBzdHJpbmcgb3Igb2JqZWN0LlxuICAgIHZhciBtYXRjaDtcbiAgICBpZiAoKG1hdGNoID0gbWF0Y2hlcnMucmdiLmV4ZWMoY29sb3IpKSkge1xuICAgICAgICByZXR1cm4geyByOiBtYXRjaFsxXSwgZzogbWF0Y2hbMl0sIGI6IG1hdGNoWzNdIH07XG4gICAgfVxuICAgIGlmICgobWF0Y2ggPSBtYXRjaGVycy5yZ2JhLmV4ZWMoY29sb3IpKSkge1xuICAgICAgICByZXR1cm4geyByOiBtYXRjaFsxXSwgZzogbWF0Y2hbMl0sIGI6IG1hdGNoWzNdLCBhOiBtYXRjaFs0XSB9O1xuICAgIH1cbiAgICBpZiAoKG1hdGNoID0gbWF0Y2hlcnMuaHNsLmV4ZWMoY29sb3IpKSkge1xuICAgICAgICByZXR1cm4geyBoOiBtYXRjaFsxXSwgczogbWF0Y2hbMl0sIGw6IG1hdGNoWzNdIH07XG4gICAgfVxuICAgIGlmICgobWF0Y2ggPSBtYXRjaGVycy5oc2xhLmV4ZWMoY29sb3IpKSkge1xuICAgICAgICByZXR1cm4geyBoOiBtYXRjaFsxXSwgczogbWF0Y2hbMl0sIGw6IG1hdGNoWzNdLCBhOiBtYXRjaFs0XSB9O1xuICAgIH1cbiAgICBpZiAoKG1hdGNoID0gbWF0Y2hlcnMuaHN2LmV4ZWMoY29sb3IpKSkge1xuICAgICAgICByZXR1cm4geyBoOiBtYXRjaFsxXSwgczogbWF0Y2hbMl0sIHY6IG1hdGNoWzNdIH07XG4gICAgfVxuICAgIGlmICgobWF0Y2ggPSBtYXRjaGVycy5oc3ZhLmV4ZWMoY29sb3IpKSkge1xuICAgICAgICByZXR1cm4geyBoOiBtYXRjaFsxXSwgczogbWF0Y2hbMl0sIHY6IG1hdGNoWzNdLCBhOiBtYXRjaFs0XSB9O1xuICAgIH1cbiAgICBpZiAoKG1hdGNoID0gbWF0Y2hlcnMuaGV4OC5leGVjKGNvbG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGE6IGNvbnZlcnRIZXhUb0RlY2ltYWwobWF0Y2hbMV0pLFxuICAgICAgICAgICAgcjogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzJdKSxcbiAgICAgICAgICAgIGc6IHBhcnNlSW50RnJvbUhleChtYXRjaFszXSksXG4gICAgICAgICAgICBiOiBwYXJzZUludEZyb21IZXgobWF0Y2hbNF0pLFxuICAgICAgICAgICAgZm9ybWF0OiBuYW1lZCA/IFwibmFtZVwiIDogXCJoZXg4XCJcbiAgICAgICAgfTtcbiAgICB9XG4gICAgaWYgKChtYXRjaCA9IG1hdGNoZXJzLmhleDYuZXhlYyhjb2xvcikpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByOiBwYXJzZUludEZyb21IZXgobWF0Y2hbMV0pLFxuICAgICAgICAgICAgZzogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzJdKSxcbiAgICAgICAgICAgIGI6IHBhcnNlSW50RnJvbUhleChtYXRjaFszXSksXG4gICAgICAgICAgICBmb3JtYXQ6IG5hbWVkID8gXCJuYW1lXCIgOiBcImhleFwiXG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmICgobWF0Y2ggPSBtYXRjaGVycy5oZXgzLmV4ZWMoY29sb3IpKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcjogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzFdICsgJycgKyBtYXRjaFsxXSksXG4gICAgICAgICAgICBnOiBwYXJzZUludEZyb21IZXgobWF0Y2hbMl0gKyAnJyArIG1hdGNoWzJdKSxcbiAgICAgICAgICAgIGI6IHBhcnNlSW50RnJvbUhleChtYXRjaFszXSArICcnICsgbWF0Y2hbM10pLFxuICAgICAgICAgICAgZm9ybWF0OiBuYW1lZCA/IFwibmFtZVwiIDogXCJoZXhcIlxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVXQ0FHMlBhcm1zKHBhcm1zKSB7XG4gICAgLy8gcmV0dXJuIHZhbGlkIFdDQUcyIHBhcm1zIGZvciBpc1JlYWRhYmxlLlxuICAgIC8vIElmIGlucHV0IHBhcm1zIGFyZSBpbnZhbGlkLCByZXR1cm4ge1wibGV2ZWxcIjpcIkFBXCIsIFwic2l6ZVwiOlwic21hbGxcIn1cbiAgICB2YXIgbGV2ZWwsIHNpemU7XG4gICAgcGFybXMgPSBwYXJtcyB8fCB7XCJsZXZlbFwiOlwiQUFcIiwgXCJzaXplXCI6XCJzbWFsbFwifTtcbiAgICBsZXZlbCA9IChwYXJtcy5sZXZlbCB8fCBcIkFBXCIpLnRvVXBwZXJDYXNlKCk7XG4gICAgc2l6ZSA9IChwYXJtcy5zaXplIHx8IFwic21hbGxcIikudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAobGV2ZWwgIT09IFwiQUFcIiAmJiBsZXZlbCAhPT0gXCJBQUFcIikge1xuICAgICAgICBsZXZlbCA9IFwiQUFcIjtcbiAgICB9XG4gICAgaWYgKHNpemUgIT09IFwic21hbGxcIiAmJiBzaXplICE9PSBcImxhcmdlXCIpIHtcbiAgICAgICAgc2l6ZSA9IFwic21hbGxcIjtcbiAgICB9XG4gICAgcmV0dXJuIHtcImxldmVsXCI6bGV2ZWwsIFwic2l6ZVwiOnNpemV9O1xufVxuXG4vLyBOb2RlOiBFeHBvcnQgZnVuY3Rpb25cbmlmICh0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB0aW55Y29sb3I7XG59XG4vLyBBTUQvcmVxdWlyZWpzOiBEZWZpbmUgdGhlIG1vZHVsZVxuZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGZ1bmN0aW9uICgpIHtyZXR1cm4gdGlueWNvbG9yO30pO1xufVxuLy8gQnJvd3NlcjogRXhwb3NlIHRvIHdpbmRvd1xuZWxzZSB7XG4gICAgd2luZG93LnRpbnljb2xvciA9IHRpbnljb2xvcjtcbn1cblxufSkoKTtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga28gPSAod2luZG93LmtvKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2xpY2tCZWhhdmlvdXIodm0pIHtcclxuXHRpZiAoIXZtKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ2bSBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0aWYgKCFrby5pc09ic2VydmFibGUodm0uc3RhdGUpKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ2bS5zdGF0ZSBoYXMgdG8gYmUgYSBrbm9ja291dCBvYnNlcnZhYmxlIVwiKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIG1vdXNlRG93bigpIHtcclxuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XHJcblxyXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZtLnN0YXRlKFwiYWN0aXZlXCIpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gbW91c2VVcCgpIHtcclxuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XHJcblxyXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZtLnN0YXRlKFwiaG92ZXJcIik7XHJcblx0fVxyXG5cclxuXHRpZiAoIXZtLmV2ZW50SGFuZGxlcnMpIHtcclxuXHRcdHZtLmV2ZW50SGFuZGxlcnMgPSB7fTtcclxuXHR9XHJcblxyXG5cdHZtLmV2ZW50SGFuZGxlcnMubW91c2Vkb3duID0gbW91c2VEb3duO1xyXG5cdHZtLmV2ZW50SGFuZGxlcnMubW91c2V1cCA9IG1vdXNlVXA7XHJcblxyXG5cdHJldHVybiB2bTtcclxufTtcclxuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmb2N1c0JlaGF2aW91cih2bSkge1xyXG5cclxuXHRpZiAoIXZtKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ2bSBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0aWYgKCFrby5pc09ic2VydmFibGUodm0uc3RhdGUpKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ2bS5zdGF0ZSBoYXMgdG8gYmUgYSBrbm9ja291dCBvYnNlcnZhYmxlIVwiKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGZvY3VzKCkge1xyXG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcclxuXHJcblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dm0uc3RhdGUoXCJhY3RpdmVcIik7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBibHVyKCkge1xyXG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcclxuXHJcblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dm0uc3RhdGUoXCJkZWZhdWx0XCIpO1xyXG5cdH1cclxuXHJcblx0aWYgKCF2bS5ldmVudEhhbmRsZXJzKSB7XHJcblx0XHR2bS5ldmVudEhhbmRsZXJzID0ge307XHJcblx0fVxyXG5cclxuXHR2bS5ldmVudEhhbmRsZXJzLmZvY3VzID0gZm9jdXM7XHJcblx0dm0uZXZlbnRIYW5kbGVycy5ibHVyID0gYmx1cjtcclxuXHJcblx0cmV0dXJuIHZtO1xyXG59O1xyXG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIGtvID0gKHdpbmRvdy5rbyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGhvdmVyQmVoYXZpb3VyKHZtKSB7XHJcblx0aWYgKCF2bSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwidm0gaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdGlmICgha28uaXNPYnNlcnZhYmxlKHZtLnN0YXRlKSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwidm0uc3RhdGUgaGFzIHRvIGJlIGEga25vY2tvdXQgb2JzZXJ2YWJsZSFcIik7XHJcblx0fVxyXG5cclxuXHR2YXIgcHJldmlvdXNTdGF0ZTtcclxuXHJcblx0ZnVuY3Rpb24gbW91c2VPdmVyKCkge1xyXG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcclxuXHJcblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIiB8fCBhY3RTdGF0ZSA9PT0gXCJhY3RpdmVcIikge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGFjdFN0YXRlICE9PSBcImhvdmVyXCIpIHtcclxuXHRcdFx0cHJldmlvdXNTdGF0ZSA9IGFjdFN0YXRlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZtLnN0YXRlKFwiaG92ZXJcIik7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBtb3VzZU91dCgpIHtcclxuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XHJcblxyXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIgfHwgYWN0U3RhdGUgPT09IFwiYWN0aXZlXCIpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZtLnN0YXRlKHByZXZpb3VzU3RhdGUpO1xyXG5cdH1cclxuXHJcblx0aWYgKCF2bS5ldmVudEhhbmRsZXJzKSB7XHJcblx0XHR2bS5ldmVudEhhbmRsZXJzID0ge307XHJcblx0fVxyXG5cclxuXHR2bS5ldmVudEhhbmRsZXJzLm1vdXNlb3ZlciA9IG1vdXNlT3ZlcjtcclxuXHR2bS5ldmVudEhhbmRsZXJzLm1vdXNlb3V0ID0gbW91c2VPdXQ7XHJcblxyXG5cclxuXHRyZXR1cm4gdm07XHJcbn07XHJcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgdm1zID0ge307XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNlbGVjdEJlaGF2aW91cih2bSwgY29uZmlnKSB7XHJcblx0aWYgKCF2bSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwidm0gaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0dmFyIGdyb3VwID0gY29uZmlnLmdyb3VwIHx8IFwiZGVmYXVsdFwiO1xyXG5cclxuXHRpZiAoIXZtc1tncm91cF0pIHtcclxuXHRcdHZtc1tncm91cF0gPSBbXTtcclxuXHR9XHJcblxyXG5cdHZtc1tncm91cF0ucHVzaCh2bSk7XHJcblxyXG5cdGZ1bmN0aW9uIG1vdXNlRG93bigpIHtcclxuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XHJcblxyXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZtLnN0YXRlKFwiYWN0aXZlXCIpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gbW91c2VVcCgpIHtcclxuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XHJcblxyXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBhY3RHcm91cFZtcyA9IHZtc1tncm91cF07XHJcblxyXG5cdFx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYWN0R3JvdXBWbXMubGVuZ3RoOyBpZHggKz0gMSkge1xyXG5cdFx0XHR2YXIgYWN0Vm0gPSBhY3RHcm91cFZtc1tpZHhdO1xyXG5cclxuXHRcdFx0aWYgKGFjdFZtID09PSB2bSkge1xyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRhY3RWbS5zdGF0ZShcImRlZmF1bHRcIik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRpZiAoIXZtLmV2ZW50SGFuZGxlcnMpIHtcclxuXHRcdHZtLmV2ZW50SGFuZGxlcnMgPSB7fTtcclxuXHR9XHJcblxyXG5cdHZtLmV2ZW50SGFuZGxlcnMubW91c2Vkb3duID0gbW91c2VEb3duO1xyXG5cdHZtLmV2ZW50SGFuZGxlcnMubW91c2V1cCA9IG1vdXNlVXA7XHJcblxyXG5cdHJldHVybiB2bTtcclxufTtcclxuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG5cclxudmFyIGhvdmVyQmVoYXZpb3VyID0gcmVxdWlyZShcIi4vYmVoYXZpb3Vycy9ob3ZlclwiKTtcclxudmFyIGZvY3VzQmVoYXZpb3VyID0gcmVxdWlyZShcIi4vYmVoYXZpb3Vycy9mb2N1c1wiKTtcclxudmFyIGNsaWNrQmVoYXZpb3VyID0gcmVxdWlyZShcIi4vYmVoYXZpb3Vycy9jbGlja1wiKTtcclxudmFyIHNlbGVjdEJlaGF2aW91ciA9IHJlcXVpcmUoXCIuL2JlaGF2aW91cnMvc2VsZWN0XCIpO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUJhc2VWbShjb25maWcpIHtcclxuXHRjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cdGlmICghY29uZmlnLmNvbXBvbmVudCkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmNvbXBvbmVudCBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0aWYgKCFjb25maWcuc3R5bGUpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zdHlsZSBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0dmFyIGNvbXBvbmVudCA9IGNvbmZpZy5jb21wb25lbnQ7XHJcblx0dmFyIHN0eWxlID0gY29uZmlnLnN0eWxlO1xyXG5cclxuXHR2YXIgc3RhdGUgPSBrby5vYnNlcnZhYmxlKGNvbmZpZy5zdGF0ZSB8fCBcImRlZmF1bHRcIik7XHJcblx0dmFyIHZhcmlhdGlvbiA9IGNvbmZpZy52YXJpYXRpb24gfHwgXCJkZWZhdWx0XCI7XHJcblxyXG5cclxuXHR2YXIgY3NzQ2xhc3NDb21wdXRlZCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIFwia25vYi1cIiArIGNvbXBvbmVudCArIFwiIHN0YXRlLVwiICsgc3RhdGUoKSArIFwiIHZhcmlhdGlvbi1cIiArIHZhcmlhdGlvbjtcclxuXHR9KTtcclxuXHR2YXIgc3R5bGVDb21wdXRlZCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHN0YXRlVmFsID0gc3RhdGUoKTtcclxuXHJcblx0XHRyZXR1cm4gc3R5bGVbdmFyaWF0aW9uXVtzdGF0ZVZhbF07XHJcblx0fSk7XHJcblxyXG5cdHZhciB2bSA9IHtcclxuXHRcdHZhcmlhdGlvbjogdmFyaWF0aW9uLFxyXG5cdFx0c3RhdGU6IHN0YXRlLFxyXG5cclxuXHRcdGNzc0NsYXNzOiBjc3NDbGFzc0NvbXB1dGVkLFxyXG5cdFx0c3R5bGU6IHN0eWxlQ29tcHV0ZWQsXHJcblxyXG5cdFx0ZXZlbnRIYW5kbGVyczoge31cclxuXHR9O1xyXG5cclxuXHJcblx0ZnVuY3Rpb24gY3JlYXRlRW5hYmxlcihiZWhhdmlvdXIsIHByb3BzKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRlbmFibGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGJlaGF2aW91cih2bSwgY29uZmlnKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZGlzYWJsZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cHJvcHMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XHJcblx0XHRcdFx0XHRpZiAodm0uZXZlbnRIYW5kbGVyc1twcm9wXSkge1xyXG5cdFx0XHRcdFx0XHRkZWxldGUgdm0uZXZlbnRIYW5kbGVyc1twcm9wXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHZtLmJlaGF2aW91cnMgPSB7XHJcblx0XHRob3ZlcjogY3JlYXRlRW5hYmxlcihob3ZlckJlaGF2aW91ciwgW1wibW91c2VvdmVyXCIsIFwibW91c2VvdXRcIl0pLFxyXG5cdFx0Zm9jdXM6IGNyZWF0ZUVuYWJsZXIoZm9jdXNCZWhhdmlvdXIsIFtcImZvY3VzXCIsIFwiYmx1clwiXSksXHJcblx0XHRjbGljazogY3JlYXRlRW5hYmxlcihjbGlja0JlaGF2aW91ciwgW1wibW91c2Vkb3duXCIsIFwibW91c2V1cFwiXSksXHJcblx0XHRzZWxlY3Q6IGNyZWF0ZUVuYWJsZXIoc2VsZWN0QmVoYXZpb3VyLCBbXCJtb3VzZWRvd25cIiwgXCJtb3VzZXVwXCJdKVxyXG5cdH07XHJcblxyXG5cdHJldHVybiB2bTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlVm07XHJcbiIsIlxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlQ29uZmlnKHRoZW1lKSB7XHJcblxyXG5cdHZhciB0aW55Y29sb3IgPSByZXF1aXJlKFwidGlueWNvbG9yMlwiKTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdFwiZGVmYXVsdFwiOiB7XHJcblx0XHRcdFwiZGVmYXVsdFwiOiB7XHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUucHJpbWFyeUNvbG9yLFxyXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXHJcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXHJcblx0XHRcdH0sXHJcblx0XHRcdFwiaG92ZXJcIjoge1xyXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5wcmltYXJ5Q29sb3IpLmxpZ2h0ZW4oKS50b1N0cmluZygpXHJcblx0XHRcdH0sXHJcblx0XHRcdFwiYWN0aXZlXCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUucHJpbWFyeUNvbG9yKS5kYXJrZW4oKS50b1N0cmluZygpXHJcblx0XHRcdH0sXHJcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xyXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLm1lZGl1bUdyYXksXHJcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5saWdodEdyYXksXHJcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmxpZ2h0R3JheVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0XCJwcmltYXJ5XCI6IHtcclxuXHRcdFx0XCJkZWZhdWx0XCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcclxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxyXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImhvdmVyXCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmxpZ2h0ZW4oKS50b1N0cmluZygpXHJcblx0XHRcdH0sXHJcblx0XHRcdFwiYWN0aXZlXCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc2Vjb25kYXJ5Q29sb3IpLmRhcmtlbigpLnRvU3RyaW5nKClcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxyXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuZGFya0dyYXksXHJcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmRhcmtHcmF5XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRcInRhYlwiOiB7XHJcblx0XHRcdFwiZGVmYXVsdFwiOiB7XHJcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53aGl0ZSxcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcclxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmRhcmtHcmF5LFxyXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5kYXJrR3JheVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImhvdmVyXCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUud2hpdGUpLmRhcmtlbigpLnRvU3RyaW5nKCksXHJcblx0XHRcdH0sXHJcblx0XHRcdFwiYWN0aXZlXCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUud2hpdGUpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcclxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmxpZ2h0R3JheSxcclxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubGlnaHRHcmF5XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRcInBhZ2luYXRpb25cIjoge1xyXG5cdFx0XHRcImRlZmF1bHRcIjoge1xyXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2hpdGUsXHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuZGFya0dyYXksXHJcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcclxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJob3ZlclwiOiB7XHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmRhcmtHcmF5KS5kYXJrZW4oKS50b1N0cmluZygpLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImFjdGl2ZVwiOiB7XHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmRhcmtHcmF5KS5kYXJrZW4oKS50b1N0cmluZygpLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcclxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLndoaXRlLFxyXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxyXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubWVkaXVtR3JheSxcclxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubWVkaXVtR3JheVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0XCJtb2RhbEhlYWRcIjoge1xyXG5cdFx0XHRcImRlZmF1bHRcIjoge1xyXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2hpdGUsXHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUudHJhbnNwYXJlbnQsXHJcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcclxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJob3ZlclwiOiB7XHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUudHJhbnNwYXJlbnQsXHJcblx0XHRcdH0sXHJcblx0XHRcdFwiYWN0aXZlXCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS50cmFuc3BhcmVudCxcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdFwiYWN0aW9uXCI6IHtcclxuXHRcdFx0XCJkZWZhdWx0XCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5pbmZvLnRleHQsXHJcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcclxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJob3ZlclwiOiB7XHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmluZm8udGV4dCkubGlnaHRlbigpLnRvU3RyaW5nKCksXHJcblx0XHRcdH0sXHJcblx0XHRcdFwiYWN0aXZlXCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby50ZXh0KS5kYXJrZW4oKS50b1N0cmluZygpLFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0XCJkYW5nZXJcIjoge1xyXG5cdFx0XHRcImRlZmF1bHRcIjoge1xyXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmVycm9yLnRleHQsXHJcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcclxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJob3ZlclwiOiB7XHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmVycm9yLnRleHQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImFjdGl2ZVwiOiB7XHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmVycm9yLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRcImluZm9cIjoge1xyXG5cdFx0XHRcImRlZmF1bHRcIjoge1xyXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmluZm8udGV4dCxcclxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxyXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImhvdmVyXCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby50ZXh0KS5saWdodGVuKCkudG9TdHJpbmcoKSxcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJhY3RpdmVcIjoge1xyXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5pbmZvLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRcInN1Y2Nlc3NcIjoge1xyXG5cdFx0XHRcImRlZmF1bHRcIjoge1xyXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuc3VjY2Vzcy50ZXh0LFxyXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnN1Y2Nlc3MudGV4dCxcclxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxyXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImhvdmVyXCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc3VjY2Vzcy50ZXh0KS5saWdodGVuKCkudG9TdHJpbmcoKSxcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJhY3RpdmVcIjoge1xyXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zdWNjZXNzLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRcIndhcm5pbmdcIjoge1xyXG5cdFx0XHRcImRlZmF1bHRcIjoge1xyXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2FybmluZy50ZXh0LFxyXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndhcm5pbmcudGV4dCxcclxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxyXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImhvdmVyXCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUud2FybmluZy50ZXh0KS5saWdodGVuKCkudG9TdHJpbmcoKSxcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJhY3RpdmVcIjoge1xyXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS53YXJuaW5nLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRcImVycm9yXCI6IHtcclxuXHRcdFx0XCJkZWZhdWx0XCI6IHtcclxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmVycm9yLnRleHQsXHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuZXJyb3IudGV4dCxcclxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxyXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImhvdmVyXCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IudGV4dCkubGlnaHRlbigpLnRvU3RyaW5nKCksXHJcblx0XHRcdH0sXHJcblx0XHRcdFwiYWN0aXZlXCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IudGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuLy9cclxuLy9cclxuLy9cclxuLy9cclxuLy9cclxuXHRcdFwiemVyZ0RlZmF1bHRcIjoge1xyXG5cdFx0XHRcImRlZmF1bHRcIjoge1xyXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUucHJpbWFyeUNvbG9yLFxyXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxyXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUucHJpbWFyeUNvbG9yLFxyXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5wcmltYXJ5Q29sb3JcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJob3ZlclwiOiB7XHJcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUucHJpbWFyeUNvbG9yKS5saWdodGVuKCkudG9TdHJpbmcoKVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImFjdGl2ZVwiOiB7XHJcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUucHJpbWFyeUNvbG9yKS5kYXJrZW4oKS50b1N0cmluZygpXHJcblx0XHRcdH0sXHJcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xyXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLm1lZGl1bUdyYXksXHJcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5saWdodEdyYXksXHJcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmxpZ2h0R3JheVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0XCJ6ZXJnUHJpbWFyeVwiOiB7XHJcblx0XHRcdFwiZGVmYXVsdFwiOiB7XHJcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcclxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxyXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvclxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImhvdmVyXCI6IHtcclxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zZWNvbmRhcnlDb2xvcikubGlnaHRlbigpLnRvU3RyaW5nKClcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJhY3RpdmVcIjoge1xyXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnNlY29uZGFyeUNvbG9yKS5kYXJrZW4oKS50b1N0cmluZygpXHJcblx0XHRcdH0sXHJcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xyXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmxpZ2h0R3JheSxcclxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmRhcmtHcmF5LFxyXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5kYXJrR3JheVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gJzxidXR0b24gZGF0YS1iaW5kPVwiY3NzOiBjc3NDbGFzcyxcXG5cdFx0XHRcdFx0c3R5bGU6IHN0eWxlLFxcblx0XHRcdFx0XHRjbGljazogY2xpY2ssXFxuXHRcdFx0XHRcdGV2ZW50OiBldmVudEhhbmRsZXJzLFxcblx0XHRcdFx0XHRkaXNhYmxlOiBzdGF0ZSgpID09PSBcXCdkaXNhYmxlZFxcJ1wiPlxcblxcblx0PHNwYW4gY2xhc3M9XCJpY29uLXdyYXBwZXJcIiBkYXRhLWJpbmQ9XCJpZjogbGVmdEljb25cIj5cXG5cdFx0PHN2ZyBjbGFzcz1cImljb25cIj5cXG5cdFx0XHQ8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIGRhdGEtYmluZD1cImF0dHI6IHtcXCd4bGluazpocmVmXFwnOiBsZWZ0SWNvbn1cIiB4bGluazpocmVmPVwiXCI+PC91c2U+XFxuXHRcdDwvc3ZnPlxcblx0PC9zcGFuPlxcblxcblx0PHNwYW4gY2xhc3M9XCJsYWJlbFwiIGRhdGEtYmluZD1cInRleHQ6IGxhYmVsXCI+PC9zcGFuPlxcblxcblx0PHNwYW4gY2xhc3M9XCJpY29uLXdyYXBwZXJcIiBkYXRhLWJpbmQ9XCJpZjogcmlnaHRJY29uXCI+XFxuXHRcdDxzdmcgY2xhc3M9XCJpY29uXCI+XFxuXHRcdFx0PHVzZSB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7XFwneGxpbms6aHJlZlxcJzogcmlnaHRJY29ufVwiIHhsaW5rOmhyZWY9XCJcIj48L3VzZT5cXG5cdFx0PC9zdmc+XFxuXHQ8L3NwYW4+XFxuPC9idXR0b24+JzsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlQ29uZmlnKHRoZW1lKSB7XHJcblxyXG5cdHZhciB0aW55Y29sb3IgPSByZXF1aXJlKFwidGlueWNvbG9yMlwiKTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdFwiZGVmYXVsdFwiOiB7XHJcblx0XHRcdFwiZGVmYXVsdFwiOiB7XHJcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5zdWNjZXNzLnRleHQsXHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXHJcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5zdWNjZXNzLnRleHQsXHJcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLnN1Y2Nlc3MudGV4dFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImhvdmVyXCI6IHtcclxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zdWNjZXNzLnRleHQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxyXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zdWNjZXNzLnRleHQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxyXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXHJcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXHJcblx0XHRcdH0sXHJcblx0XHRcdFwiYWN0aXZlXCI6IHtcclxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zdWNjZXNzLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnN1Y2Nlc3MudGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcclxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxyXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5tZWRpdW1HcmF5LFxyXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxyXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5saWdodEdyYXlcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdFwicHJpbWFyeVwiOiB7XHJcblx0XHRcdFwiZGVmYXVsdFwiOiB7XHJcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53YXJuaW5nLnRleHQsXHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXHJcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53YXJuaW5nLnRleHQsXHJcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndhcm5pbmcudGV4dFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImhvdmVyXCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUud2FybmluZy50ZXh0KS5saWdodGVuKCkudG9TdHJpbmcoKSxcclxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxyXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImFjdGl2ZVwiOiB7XHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLndhcm5pbmcudGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcclxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxyXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5saWdodEdyYXksXHJcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5kYXJrR3JheSxcclxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuZGFya0dyYXlcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdFwidGFiXCI6IHtcclxuXHRcdFx0XCJkZWZhdWx0XCI6IHtcclxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLndoaXRlLFxyXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmluZm8uYmFja2dyb3VuZCxcclxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxyXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5ibGFja1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImhvdmVyXCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby5iYWNrZ3JvdW5kKS5kYXJrZW4oKS50b1N0cmluZygpLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImFjdGl2ZVwiOiB7XHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLndoaXRlKS5saWdodGVuKCkudG9TdHJpbmcoKSxcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXHJcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5saWdodEdyYXksXHJcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmxpZ2h0R3JheVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0XCJwYWdpbmF0aW9uXCI6IHtcclxuXHRcdFx0XCJkZWZhdWx0XCI6IHtcclxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLnN1Y2Nlc3MuYmFja2dyb3VuZCxcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5zdWNjZXNzLmJhY2tncm91bmQsXHJcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5zdWNjZXNzLnRleHQsXHJcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLnN1Y2Nlc3MudGV4dFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImhvdmVyXCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc3VjY2Vzcy5iYWNrZ3JvdW5kKS5kYXJrZW4oKS50b1N0cmluZygpLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImFjdGl2ZVwiOiB7XHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLnN1Y2Nlc3MuYmFja2dyb3VuZCkuZGFya2VuKCkudG9TdHJpbmcoKSxcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XHJcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53aGl0ZSxcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcclxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLm1lZGl1bUdyYXksXHJcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLm1lZGl1bUdyYXlcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdFwibW9kYWxIZWFkXCI6IHtcclxuXHRcdFx0XCJkZWZhdWx0XCI6IHtcclxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLndoaXRlLFxyXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnRyYW5zcGFyZW50LFxyXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXHJcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXHJcblx0XHRcdH0sXHJcblx0XHRcdFwiaG92ZXJcIjoge1xyXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnRyYW5zcGFyZW50LFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImFjdGl2ZVwiOiB7XHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUudHJhbnNwYXJlbnQsXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRcImFjdGlvblwiOiB7XHJcblx0XHRcdFwiZGVmYXVsdFwiOiB7XHJcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5pbmZvLnRleHQsXHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXHJcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5pbmZvLnRleHQsXHJcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmluZm8udGV4dFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImhvdmVyXCI6IHtcclxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5pbmZvLnRleHQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImFjdGl2ZVwiOiB7XHJcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby50ZXh0KS5kYXJrZW4oKS50b1N0cmluZygpLFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0XCJkYW5nZXJcIjoge1xyXG5cdFx0XHRcImRlZmF1bHRcIjoge1xyXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxyXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuZXJyb3IudGV4dCxcclxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmVycm9yLnRleHQsXHJcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmVycm9yLnRleHRcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJob3ZlclwiOiB7XHJcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IudGV4dCkubGlnaHRlbigpLnRvU3RyaW5nKCksXHJcblx0XHRcdH0sXHJcblx0XHRcdFwiYWN0aXZlXCI6IHtcclxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5lcnJvci50ZXh0KS5kYXJrZW4oKS50b1N0cmluZygpLFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0XCJpbmZvXCI6IHtcclxuXHRcdFx0XCJkZWZhdWx0XCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOnRoZW1lLndoaXRlLFxyXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuaW5mby50ZXh0LFxyXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuaW5mby50ZXh0LFxyXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5pbmZvLnRleHRcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJob3ZlclwiOiB7XHJcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuaW5mby50ZXh0KS5saWdodGVuKCkudG9TdHJpbmcoKSxcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJhY3RpdmVcIjoge1xyXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmluZm8udGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdFwic3VjY2Vzc1wiOiB7XHJcblx0XHRcdFwiZGVmYXVsdFwiOiB7XHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXHJcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5zdWNjZXNzLnRleHQsXHJcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5zdWNjZXNzLnRleHQsXHJcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLnN1Y2Nlc3MudGV4dFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImhvdmVyXCI6IHtcclxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS5zdWNjZXNzLnRleHQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImFjdGl2ZVwiOiB7XHJcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuc3VjY2Vzcy50ZXh0KS5kYXJrZW4oKS50b1N0cmluZygpLFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0XCJ3YXJuaW5nXCI6IHtcclxuXHRcdFx0XCJkZWZhdWx0XCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcclxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLndhcm5pbmcudGV4dCxcclxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndhcm5pbmcudGV4dCxcclxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2FybmluZy50ZXh0XHJcblx0XHRcdH0sXHJcblx0XHRcdFwiaG92ZXJcIjoge1xyXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLndhcm5pbmcudGV4dCkubGlnaHRlbigpLnRvU3RyaW5nKCksXHJcblx0XHRcdH0sXHJcblx0XHRcdFwiYWN0aXZlXCI6IHtcclxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRpbnljb2xvcih0aGVtZS53YXJuaW5nLnRleHQpLmRhcmtlbigpLnRvU3RyaW5nKCksXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRcImVycm9yXCI6IHtcclxuXHRcdFx0XCJkZWZhdWx0XCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcclxuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmVycm9yLnRleHQsXHJcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5lcnJvci50ZXh0LFxyXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5lcnJvci50ZXh0XHJcblx0XHRcdH0sXHJcblx0XHRcdFwiaG92ZXJcIjoge1xyXG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGlueWNvbG9yKHRoZW1lLmVycm9yLnRleHQpLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImFjdGl2ZVwiOiB7XHJcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuZXJyb3IudGV4dCkuZGFya2VuKCkudG9TdHJpbmcoKSxcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcbn07IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG5cclxudmFyIGJhc2UgPSByZXF1aXJlKFwiLi4vYmFzZS92bVwiKTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUJ1dHRvbihjb25maWcpIHtcclxuXHRpZiAoIWNvbmZpZykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHRpZiAoY29uZmlnLmNsaWNrICYmIHR5cGVvZiBjb25maWcuY2xpY2sgIT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY2xpY2sgaGFzIHRvIGJlIGEgZnVuY3Rpb24hXCIpO1xyXG5cdH1cclxuXHJcblx0aWYgKCFjb25maWcubGFiZWwgJiYgIWNvbmZpZy5sZWZ0SWNvbiAmJiAhY29uZmlnLnJpZ2h0SWNvbiAmJiAhY29uZmlnLmljb24pIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImVpdGhlciBsYWJlbC9sZWZ0aWNvbi9yaWdodGljb24vaWNvbiBoYXMgdG8gYmUgZ2l2ZW4hXCIpO1xyXG5cdH1cclxuXHJcblx0Y29uZmlnLmNvbXBvbmVudCA9IFwiYnV0dG9uXCI7XHJcblxyXG5cdHZhciB2bSA9IGJhc2UoY29uZmlnKTtcclxuXHJcblx0dm0uYmVoYXZpb3Vycy5ob3Zlci5lbmFibGUoKTtcclxuXHJcblx0aWYgKGNvbmZpZy5yYWRpbykge1xyXG5cdFx0dm0uYmVoYXZpb3Vycy5zZWxlY3QuZW5hYmxlKCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHZtLmJlaGF2aW91cnMuY2xpY2suZW5hYmxlKCk7XHJcblx0fVxyXG5cclxuXHR2bS5sZWZ0SWNvbiA9IGtvLm9ic2VydmFibGUoa28udW53cmFwKGNvbmZpZy5sZWZ0SWNvbiB8fCBjb25maWcuaWNvbikpO1xyXG5cdHZtLnJpZ2h0SWNvbiA9IGtvLm9ic2VydmFibGUoa28udW53cmFwKGNvbmZpZy5yaWdodEljb24pKTtcclxuXHR2bS5sYWJlbCA9IGtvLm9ic2VydmFibGUoa28udW53cmFwKGNvbmZpZy5sYWJlbCkpO1xyXG5cdHZtLnZhbHVlID0gY29uZmlnLnZhbHVlO1xyXG5cdHZtLmNsaWNrID0gY29uZmlnLmNsaWNrIHx8IGZ1bmN0aW9uKCkge307XHJcblxyXG5cdHJldHVybiB2bTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCdXR0b247XHJcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vLyovXHJcblxyXG4vL1RISVMgRklMRSBTSE9VTEQgQkUgR0VORVJBVEVEXHJcblxyXG52YXIgcmVnaXN0ZXJDb21wb25lbnQgPSByZXF1aXJlKFwiLi9rbm9iUmVnaXN0ZXJDb21wb25lbnRcIik7XHJcblxyXG52YXIgYmFzZVZtID0gcmVxdWlyZShcIi4vYmFzZS92bVwiKTtcclxuXHJcbnZhciBjcmVhdGVCdXR0b25TdHlsZTtcclxudmFyIGNyZWF0ZUJ1dHRvblN0eWxlRGVmYXVsdCA9IHJlcXVpcmUoXCIuL2J1dHRvbi9zdHlsZVwiKTtcclxudmFyIGNyZWF0ZUJ1dHRvblN0eWxlVGhlbWUyID0gcmVxdWlyZShcIi4vYnV0dG9uL3RoZW1lMlwiKTtcclxuXHJcbnZhciBjcmVhdGVJbnB1dFN0eWxlO1xyXG52YXIgY3JlYXRlSW5wdXRTdHlsZURlZmF1bHQgPSByZXF1aXJlKFwiLi9pbnB1dC9zdHlsZVwiKTtcclxudmFyIGNyZWF0ZUlucHV0U3R5bGVUaGVtZTIgPSByZXF1aXJlKFwiLi9pbnB1dC90aGVtZTJcIik7XHJcblxyXG52YXIgY3JlYXRlTW9kYWxTdHlsZTtcclxudmFyIGNyZWF0ZU1vZGFsU3R5bGVEZWZhdWx0ID0gcmVxdWlyZShcIi4vbW9kYWwvc3R5bGVcIik7XHJcbnZhciBjcmVhdGVNb2RhbFN0eWxlVGhlbWUyID0gcmVxdWlyZShcIi4vbW9kYWwvdGhlbWUyXCIpO1xyXG5cclxudmFyIGNyZWF0ZVBhZ2VkTGlzdFN0eWxlO1xyXG52YXIgY3JlYXRlUGFnZWRMaXN0U3R5bGVEZWZhdWx0ID0gcmVxdWlyZShcIi4vcGFnZWRMaXN0L3N0eWxlXCIpO1xyXG52YXIgY3JlYXRlUGFnZWRMaXN0U3R5bGVUaGVtZTIgPSByZXF1aXJlKFwiLi9wYWdlZExpc3QvdGhlbWUyXCIpO1xyXG5cclxuZnVuY3Rpb24gaW5pdEtub2IoY29uZmlnKSB7XHJcblxyXG5cclxuXHJcblx0dmFyIGNvbG9yU2V0ID0gY29uZmlnLmNvbG9yU2V0O1xyXG5cdHZhciB0aGVtZSA9IGNvbmZpZy50aGVtZTtcclxuXHJcblx0aWYgKHR5cGVvZiB0aGVtZSA9PT0gXCJvYmplY3RcIikge1xyXG5cclxuXHRcdGlmICh0eXBlb2YgdGhlbWUuY3JlYXRlQnV0dG9uU3R5bGUgIT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudGhlbWUuY3JlYXRlQnV0dG9uU3R5bGUgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0eXBlb2YgdGhlbWUuY3JlYXRlSW5wdXRTdHlsZSAhPT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy50aGVtZS5jcmVhdGVJbnB1dFN0eWxlIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodHlwZW9mIHRoZW1lLmNyZWF0ZU1vZGFsU3R5bGUgIT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudGhlbWUuY3JlYXRlTW9kYWxTdHlsZSBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHR5cGVvZiB0aGVtZS5jcmVhdGVQYWdlZExpc3RTdHlsZSAhPT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy50aGVtZS5jcmVhdGVQYWdlZExpc3RTdHlsZSBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XHJcblx0XHR9XHJcblxyXG5cdFx0Y3JlYXRlQnV0dG9uU3R5bGUgPSB0aGVtZS5jcmVhdGVCdXR0b25TdHlsZTtcclxuXHRcdGNyZWF0ZUlucHV0U3R5bGUgPSB0aGVtZS5jcmVhdGVJbnB1dFN0eWxlO1xyXG5cdFx0Y3JlYXRlTW9kYWxTdHlsZSA9IHRoZW1lLmNyZWF0ZU1vZGFsU3R5bGU7XHJcblx0XHRjcmVhdGVQYWdlZExpc3RTdHlsZSA9IHRoZW1lLmNyZWF0ZVBhZ2VkTGlzdFN0eWxlO1xyXG5cclxuXHR9IGVsc2UgaWYgKHR5cGVvZiB0aGVtZSA9PT0gXCJzdHJpbmdcIikge1xyXG5cclxuXHRcdGlmICh0aGVtZSA9PT0gXCJ0aGVtZTJcIikge1xyXG5cdFx0XHRjcmVhdGVCdXR0b25TdHlsZSA9IGNyZWF0ZUJ1dHRvblN0eWxlVGhlbWUyO1xyXG5cdFx0XHRjcmVhdGVJbnB1dFN0eWxlID0gY3JlYXRlSW5wdXRTdHlsZVRoZW1lMjtcclxuXHRcdFx0Y3JlYXRlTW9kYWxTdHlsZSA9IGNyZWF0ZU1vZGFsU3R5bGVUaGVtZTI7XHJcblx0XHRcdGNyZWF0ZVBhZ2VkTGlzdFN0eWxlID0gY3JlYXRlUGFnZWRMaXN0U3R5bGVUaGVtZTI7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjcmVhdGVCdXR0b25TdHlsZSA9IGNyZWF0ZUJ1dHRvblN0eWxlRGVmYXVsdDtcclxuXHRcdFx0Y3JlYXRlSW5wdXRTdHlsZSA9IGNyZWF0ZUlucHV0U3R5bGVEZWZhdWx0O1xyXG5cdFx0XHRjcmVhdGVNb2RhbFN0eWxlID0gY3JlYXRlTW9kYWxTdHlsZURlZmF1bHQ7XHJcblx0XHRcdGNyZWF0ZVBhZ2VkTGlzdFN0eWxlID0gY3JlYXRlUGFnZWRMaXN0U3R5bGVEZWZhdWx0O1xyXG5cdFx0fVxyXG5cclxuXHR9IGVsc2Uge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnRoZW1lIHNob3VsZCBiZSBhIGZ1bmN0aW9uIG9yIGEgc3RyaW5nXCIpO1xyXG5cdH1cclxuXHJcblx0dmFyIGJ1dHRvblN0eWxlID0gY3JlYXRlQnV0dG9uU3R5bGUoY29sb3JTZXQpO1xyXG5cclxuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItYnV0dG9uXCIsIHJlcXVpcmUoXCIuL2J1dHRvbi92bVwiKSwgcmVxdWlyZShcIi4vYnV0dG9uL3RlbXBsYXRlLmh0bWxcIiksIGJ1dHRvblN0eWxlKTtcclxuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItaW5wdXRcIiwgcmVxdWlyZShcIi4vaW5wdXQvdm1cIiksIHJlcXVpcmUoXCIuL2lucHV0L3RlbXBsYXRlLmh0bWxcIiksIGNyZWF0ZUlucHV0U3R5bGUoY29sb3JTZXQpKTtcclxuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItcmFkaW9cIiwgcmVxdWlyZShcIi4vcmFkaW8vdm1cIiksIHJlcXVpcmUoXCIuL3JhZGlvL3RlbXBsYXRlLmh0bWxcIikpO1xyXG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1pbmxpbmUtdGV4dC1lZGl0b3JcIiwgcmVxdWlyZShcIi4vaW5saW5lVGV4dEVkaXRvci92bVwiKSwgcmVxdWlyZShcIi4vaW5saW5lVGV4dEVkaXRvci90ZW1wbGF0ZS5odG1sXCIpKTtcclxuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItZHJvcGRvd25cIiwgcmVxdWlyZShcIi4vZHJvcGRvd24vdm1cIiksIHJlcXVpcmUoXCIuL2Ryb3Bkb3duL3RlbXBsYXRlLmh0bWxcIikpO1xyXG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1wYWdpbmF0aW9uXCIsIHJlcXVpcmUoXCIuL3BhZ2luYXRpb24vdm1cIiksIHJlcXVpcmUoXCIuL3BhZ2luYXRpb24vdGVtcGxhdGUuaHRtbFwiKSwgYnV0dG9uU3R5bGUpO1xyXG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1pdGVtcy1wZXItcGFnZVwiLCByZXF1aXJlKFwiLi9pdGVtc1BlclBhZ2Uvdm1cIiksIHJlcXVpcmUoXCIuL2l0ZW1zUGVyUGFnZS90ZW1wbGF0ZS5odG1sXCIpKTtcclxuXHJcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLXBhZ2VkLWxpc3RcIiwgcmVxdWlyZShcIi4vcGFnZWRMaXN0L3ZtXCIpLCByZXF1aXJlKFwiLi9wYWdlZExpc3QvdGVtcGxhdGUuaHRtbFwiKSwgY3JlYXRlUGFnZWRMaXN0U3R5bGUoY29sb3JTZXQpKTtcclxuXHJcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLW1vZGFsXCIsIHJlcXVpcmUoXCIuL21vZGFsL3ZtXCIpLCByZXF1aXJlKFwiLi9tb2RhbC90ZW1wbGF0ZS5odG1sXCIpLCBjcmVhdGVNb2RhbFN0eWxlKGNvbG9yU2V0KSk7XHJcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWNvbmZpcm1cIiwgcmVxdWlyZShcIi4vbW9kYWwvY29uZmlybS92bVwiKSwgcmVxdWlyZShcIi4vbW9kYWwvY29uZmlybS90ZW1wbGF0ZS5odG1sXCIpLCBjcmVhdGVNb2RhbFN0eWxlKGNvbG9yU2V0KSk7XHJcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWFsZXJ0XCIsIHJlcXVpcmUoXCIuL21vZGFsL2FsZXJ0L3ZtXCIpLCByZXF1aXJlKFwiLi9tb2RhbC9hbGVydC90ZW1wbGF0ZS5odG1sXCIpLCBjcmVhdGVNb2RhbFN0eWxlKGNvbG9yU2V0KSk7XHJcblxyXG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi10YWJzXCIsIHJlcXVpcmUoXCIuL3RhYnMvdm1cIiksIHJlcXVpcmUoXCIuL3RhYnMvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLXRhYlwiLCByZXF1aXJlKFwiLi90YWJzL3RhYi92bVwiKSwgcmVxdWlyZShcIi4vdGFicy90YWIvdGVtcGxhdGUuaHRtbFwiKSwgYnV0dG9uU3R5bGUpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRpbml0OiBpbml0S25vYixcclxuXHJcblx0cmVnaXN0ZXJDb21wb25lbnQ6IHJlZ2lzdGVyQ29tcG9uZW50LFxyXG5cdGJhc2U6IHtcclxuXHRcdHZtOiBiYXNlVm1cclxuXHR9XHJcbn07XHJcbi8vIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImtub2ItZHJvcGRvd25cIj5cXG5cdDwhLS0gd2l0aCBwYXJhbXMsIHRoZSBzZWxlY3RlZCgpLmxhYmVsIHdvblxcJ3QgYmUgcmVjYWxjdWxhdGVkLCB3aGVuIHNlbGVjdGVkIGlzIGNoYW5nZWQuLi4gLS0+XFxuXHQ8ZGl2IGRhdGEtYmluZD1cImNvbXBvbmVudDoge1xcblx0XHRcdFx0XHRcdG5hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLFxcblx0XHRcdFx0XHRcdHBhcmFtczoge2xhYmVsOiBzZWxlY3RlZCgpLmxhYmVsLFxcblx0XHRcdFx0XHRcdGljb246IHNlbGVjdGVkKCkuaWNvbixcXG5cdFx0XHRcdFx0XHRyaWdodEljb246IHJpZ2h0SWNvbixcXG5cdFx0XHRcdFx0XHRjbGljazogZHJvcGRvd25WaXNpYmxlLnRvZ2dsZX19XCI+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgY2xhc3M9XCJrbm9iLWRyb3Bkb3duLW1lbnVcIiBkYXRhLWJpbmQ9XCJmb3JlYWNoOiBvcHRpb25zLCB2aXNpYmxlOiBkcm9wZG93blZpc2libGVcIj5cXG5cdFx0PGRpdiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtcXG5cdFx0XHRcdFx0XHRcdG5hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLFxcblx0XHRcdFx0XHRcdFx0cGFyYW1zOiB7bGFiZWw6IGxhYmVsLCBpY29uOiBpY29uLCBjbGljazogc2VsZWN0fX0sIFxcblx0XHRcdFx0XHRcdFx0dmlzaWJsZTogJGRhdGEgIT09ICRwYXJlbnQuc2VsZWN0ZWQoKVwiPlxcblx0XHQ8L2Rpdj5cXG5cdDwvZGl2PlxcbjwvZGl2Plxcbic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUJ1dHRvbkRyb3Bkb3duKGNvbmZpZykge1xyXG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0aWYgKCFjb25maWcucmlnaHRJY29uKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcucmlnaHRJY29uIGVsZW1lbnQgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblx0aWYgKCFjb25maWcuaXRlbXMpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5pdGVtcyBlbGVtZW50IGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cdGlmIChjb25maWcuc2VsZWN0ZWQgJiYgIWtvLmlzT2JzZXJ2YWJsZShjb25maWcuc2VsZWN0ZWQpKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc2VsZWN0ZWQgaGFzIHRvIGJlIGEga25vY2tvdXQgb2JzZXJ2YWJsZSFcIik7XHJcblx0fVxyXG5cclxuXHRpZiAoY29uZmlnLml0ZW1zLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLml0ZW1zIHNob3VsZCBub3QgYmUgZW1wdHlcIik7XHJcblx0fVxyXG5cclxuXHR2YXIgcmlnaHRJY29uID0ga28ub2JzZXJ2YWJsZShjb25maWcucmlnaHRJY29uKTtcclxuXHJcblx0dmFyIG9wdGlvbnMgPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xyXG5cclxuXHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCBjb25maWcuaXRlbXMubGVuZ3RoOyBpZHggKz0gMSkge1xyXG5cclxuXHRcdGlmICghY29uZmlnLml0ZW1zW2lkeF0ubGFiZWwgJiYgIWNvbmZpZy5pdGVtc1tpZHhdLmljb24pIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiZWFjaCBlbGVtZW50IG9mIGNvbmZpZy5pdGVtcyBoYXMgdG8gaGF2ZSBsYWJlbCBhbmQvb3IgaWNvbiBwcm9wZXJ0eVwiKTtcclxuXHRcdH1cclxuXHRcdG9wdGlvbnMucHVzaChjcmVhdGVPcHRpb24oe1xyXG5cdFx0XHRsYWJlbDogY29uZmlnLml0ZW1zW2lkeF0ubGFiZWwsXHJcblx0XHRcdGljb246IGNvbmZpZy5pdGVtc1tpZHhdLmljb24sXHJcblx0XHRcdHZhbHVlOiBjb25maWcuaXRlbXNbaWR4XS52YWx1ZVxyXG5cdFx0fSkpO1xyXG5cdH1cclxuXHJcblx0Ly8gY29uc29sZS5sb2cob3B0aW9ucygpKTtcclxuXHJcblx0dmFyIHNlbGVjdGVkID0gY29uZmlnLnNlbGVjdGVkIHx8IGtvLm9ic2VydmFibGUoKTtcclxuXHJcblx0c2VsZWN0ZWQob3B0aW9ucygpW2NvbmZpZy5zZWxlY3RlZElkeCB8fCAwXSk7XHJcblxyXG5cdHZhciBkcm9wZG93blZpc2libGUgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuXHJcblx0ZHJvcGRvd25WaXNpYmxlLnRvZ2dsZSA9IGZ1bmN0aW9uIHRvZ2dsZURyb3Bkb3duVmlzaWJsZShpdGVtLCBldmVudCkge1xyXG5cdFx0aWYgKGV2ZW50KSB7XHJcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB2aXNpYmxlID0gZHJvcGRvd25WaXNpYmxlKCk7XHJcblxyXG5cdFx0ZHJvcGRvd25WaXNpYmxlKCF2aXNpYmxlKTtcclxuXHJcblx0XHQvLyBzaG91bGQgcmVtb3ZlIHRoaXMgd2hlbiB0ZXN0IGluIHBoYW50b21qc1xyXG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh2aXNpYmxlKSB7XHJcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdG9nZ2xlRHJvcGRvd25WaXNpYmxlLCBmYWxzZSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRvZ2dsZURyb3Bkb3duVmlzaWJsZSwgZmFsc2UpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdGZ1bmN0aW9uIGNyZWF0ZU9wdGlvbihjb25maWcpIHtcclxuXHRcdHZhciBvYmogPSB7XHJcblx0XHRcdGxhYmVsOiBrby5vYnNlcnZhYmxlKGNvbmZpZy5sYWJlbCksXHJcblx0XHRcdGljb246IGtvLm9ic2VydmFibGUoY29uZmlnLmljb24pLFxyXG5cdFx0XHR2YWx1ZTogY29uZmlnLnZhbHVlLFxyXG5cdFx0XHRzZWxlY3Q6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHNlbGVjdGVkKG9iaik7XHJcblx0XHRcdFx0ZHJvcGRvd25WaXNpYmxlLnRvZ2dsZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiBvYmo7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0cmlnaHRJY29uOiByaWdodEljb24sXHJcblxyXG5cdFx0c2VsZWN0ZWQ6IHNlbGVjdGVkLFxyXG5cdFx0b3B0aW9uczogb3B0aW9ucyxcclxuXHJcblx0XHRkcm9wZG93blZpc2libGU6IGRyb3Bkb3duVmlzaWJsZVxyXG5cdH07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQnV0dG9uRHJvcGRvd247XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxzcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwidmlzaWJsZTogIWVkaXRNb2RlKClcIj5cXG5cdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogdmFsdWVcIj48L3NwYW4+XFxuXHRcdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJsYWJlbDogXFwnXFwnLCBjbGljazogZWRpdCwgaWNvbjogXFwnI2ljb24tZWRpdFxcJ1wiPlxcblx0PC9zcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwidmlzaWJsZTogZWRpdE1vZGVcIj5cXG5cdFx0PGtub2ItaW5wdXQgcGFyYW1zPVwidmFsdWU6IGVkaXRlZFZhbHVlLCBoYXNGb2N1czogaW5wdXRIYXNGb2N1cywga2V5RG93bjoga2V5RG93biwgdmlzaWJsZTogZWRpdE1vZGVcIj48L2tub2ItaW5wdXQ+XFxuXHRcdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJsYWJlbDogXFwnXFwnLCBjbGljazogc2F2ZSwgaWNvbjogXFwnI2ljb24tZG9uZVxcJ1wiPjwva25vYi1idXR0b24+XFxuXHRcdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJsYWJlbDogXFwnXFwnLCBjbGljazogY2FuY2VsLCBpY29uOiBcXCcjaWNvbi1jbG9zZVxcJ1wiPjwva25vYi1idXR0b24+XFxuXHQ8L3NwYW4+XFxuPC9zcGFuPic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlSW5saW5lVGV4dEVkaXRvcihjb25maWcpIHtcclxuXHR2YXIgdm0gPSB7fTtcclxuXHJcblx0dmFyIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0aWYgKGNvbmZpZy52YWx1ZSAmJiAha28uaXNPYnNlcnZhYmxlKGNvbmZpZy52YWx1ZSkpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy52YWx1ZSBoYXMgdG8gYmUgYW4gb2JzZXJ2YWJsZSFcIik7XHJcblx0fVxyXG5cclxuXHR2bS52YWx1ZSA9IGNvbmZpZy52YWx1ZSB8fCBrby5vYnNlcnZhYmxlKFwiXCIpO1xyXG5cdHZtLmVkaXRlZFZhbHVlID0ga28ub2JzZXJ2YWJsZSh2bS52YWx1ZSgpKTtcclxuXHJcblx0dm0uZWRpdE1vZGUgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuXHJcblx0dm0uZWRpdCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dm0uZWRpdGVkVmFsdWUodm0udmFsdWUoKSk7XHJcblx0XHR2bS5lZGl0TW9kZSh0cnVlKTtcclxuXHRcdHZtLmlucHV0SGFzRm9jdXModHJ1ZSk7XHJcblx0fTtcclxuXHJcblx0dm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dm0udmFsdWUodm0uZWRpdGVkVmFsdWUoKSk7XHJcblx0XHR2bS5lZGl0TW9kZShmYWxzZSk7XHJcblx0fTtcclxuXHJcblx0dm0uY2FuY2VsID0gZnVuY3Rpb24oKSB7XHJcblx0XHR2bS5lZGl0TW9kZShmYWxzZSk7XHJcblx0fTtcclxuXHJcblx0dm0ua2V5RG93biA9IGZ1bmN0aW9uKGl0ZW0sIGV2ZW50KSB7XHJcblx0XHRpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcclxuXHRcdFx0cmV0dXJuIHZtLnNhdmUoKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZXZlbnQua2V5Q29kZSA9PT0gMjcpIHtcclxuXHRcdFx0cmV0dXJuIHZtLmNhbmNlbCgpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fTtcclxuXHJcblx0dm0uaW5wdXRIYXNGb2N1cyA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG5cclxuXHRyZXR1cm4gdm07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlSW5saW5lVGV4dEVkaXRvcjtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVTdHlsZUNvbmZpZyh0aGVtZSkge1xyXG5cdHJldHVybiB7XHJcblx0XHRcImRlZmF1bHRcIjoge1xyXG5cdFx0XHRcImRlZmF1bHRcIjoge1xyXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxyXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2ssXHJcblx0XHRcdFx0XCJib3JkZXItY29sb3JcIjogdGhlbWUuZGFya0dyYXlcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJob3ZlclwiOiB7XHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXHJcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFjayxcclxuXHRcdFx0XHRcImJvcmRlci1jb2xvclwiOiB0aGVtZS5kYXJrR3JheVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImFjdGl2ZVwiOiB7XHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXHJcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5wcmltYXJ5Q29sb3IsXHJcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLnByaW1hcnlDb2xvclxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5saWdodEdyYXksXHJcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5saWdodEdyYXksXHJcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmxpZ2h0R3JheVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGlucHV0IGRhdGEtYmluZD1cImNzczogY3NzQ2xhc3MsXFxuXHRcdFx0XHRcdHN0eWxlOiBzdHlsZSxcXG5cdFx0XHRcdFx0YXR0cjoge3R5cGU6IHR5cGUsIHBsYWNlaG9sZGVyOiBwbGFjZWhvbGRlcn0sXFxuXHRcdFx0XHRcdGV2ZW50OiBldmVudEhhbmRsZXJzLFxcblx0XHRcdFx0XHRoYXNGb2N1czogaGFzRm9jdXMsXFxuXHRcdFx0XHRcdGRpc2FibGU6IHN0YXRlKCkgPT09IFxcJ2Rpc2FibGVkXFwnLFxcblx0XHRcdFx0XHR2YWx1ZTogdmFsdWUsXFxuXHRcdFx0XHRcdHZhbHVlVXBkYXRlOiBcXCdhZnRlcmtleWRvd25cXCdcIiAvPic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG5cclxudmFyIGJhc2UgPSByZXF1aXJlKFwiLi4vYmFzZS92bVwiKTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUlucHV0KGNvbmZpZykge1xyXG5cclxuXHRpZiAoIWNvbmZpZykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHRpZiAoY29uZmlnLnZhbHVlICYmICFrby5pc09ic2VydmFibGUoY29uZmlnLnZhbHVlKSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnZhbHVlIG11c3QgYmUgYW4gb2JzZXJ2YWJsZVwiKTtcclxuXHR9XHJcblxyXG5cdGlmIChjb25maWcuaGFzRm9jdXMgJiYgIWtvLmlzT2JzZXJ2YWJsZShjb25maWcuaGFzRm9jdXMpKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuaGFzRm9jdXMgbXVzdCBiZSBhbiBvYnNlcnZhYmxlXCIpO1xyXG5cdH1cclxuXHJcblx0Y29uZmlnLmNvbXBvbmVudCA9IFwiaW5wdXRcIjtcclxuXHRjb25maWcudHlwZSA9IGNvbmZpZy50eXBlIHx8IFwidGV4dFwiO1xyXG5cdGNvbmZpZy5wbGFjZWhvbGRlciA9IGNvbmZpZy5wbGFjZWhvbGRlciB8fCBcIlwiO1xyXG5cclxuXHR2YXIgdm0gPSBiYXNlKGNvbmZpZyk7XHJcblxyXG5cdHZtLmJlaGF2aW91cnMuaG92ZXIuZW5hYmxlKCk7XHJcblx0dm0uYmVoYXZpb3Vycy5mb2N1cy5lbmFibGUoKTtcclxuXHJcblx0dm0ucGxhY2Vob2xkZXIgPSBjb25maWcucGxhY2Vob2xkZXI7XHJcblx0dm0udHlwZSA9IGNvbmZpZy50eXBlO1xyXG5cdHZtLnZhbHVlID0gY29uZmlnLnZhbHVlIHx8IGtvLm9ic2VydmFibGUoKTtcclxuXHR2bS5oYXNGb2N1cyA9IGNvbmZpZy5oYXNGb2N1cyB8fCBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuXHJcblx0aWYgKGNvbmZpZy5rZXlEb3duKSB7XHJcblx0XHR2bS5ldmVudEhhbmRsZXJzLmtleWRvd24gPSBjb25maWcua2V5RG93bjtcclxuXHR9XHJcblxyXG5cdHJldHVybiB2bTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVJbnB1dDtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGtub2ItZHJvcGRvd24gcGFyYW1zPVwiXFxuXHRyaWdodEljb246IFxcJyNpY29uLWV4cGFuZC1tb3JlXFwnLFxcblx0c2VsZWN0ZWQ6IGl0ZW1zUGVyUGFnZSxcXG5cdGl0ZW1zOiBpdGVtc1BlclBhZ2VMaXN0XCI+XFxuPC9rbm9iLWRyb3Bkb3duPic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVJdGVtc1BlclBhZ2UoY29uZmlnKSB7XHJcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHRpZiAoIWNvbmZpZy5udW1PZkl0ZW1zKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcubnVtT2ZJdGVtcyBlbGVtZW50IGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHRpZiAoY29uZmlnLml0ZW1zUGVyUGFnZUxpc3QpIHtcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY29uZmlnLml0ZW1zUGVyUGFnZUxpc3QubGVuZ3RoOyBpICs9IDEpIHtcclxuXHJcblx0XHRcdGlmICghY29uZmlnLml0ZW1zUGVyUGFnZUxpc3RbaV0udmFsdWUgJiYgIWNvbmZpZy5pdGVtc1BlclBhZ2VMaXN0W2ldLmxhYmVsKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiZWFjaCBlbGVtZW50IG9mIGNvbmZpZy5pdGVtcyBoYXMgdG8gaGF2ZSBsYWJlbCBhbmQvb3IgdmFsdWUgcHJvcGVydHlcIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgbnVtT2ZJdGVtcyA9IGNvbmZpZy5udW1PZkl0ZW1zO1xyXG5cclxuXHR2YXIgaXRlbXNQZXJQYWdlTGlzdCA9IGNvbmZpZy5pdGVtc1BlclBhZ2VMaXN0IHx8IFt7XHJcblx0XHRsYWJlbDogMTAsXHJcblx0XHR2YWx1ZTogMTBcclxuXHR9LCB7XHJcblx0XHRsYWJlbDogMjUsXHJcblx0XHR2YWx1ZTogMjVcclxuXHR9LCB7XHJcblx0XHRsYWJlbDogNTAsXHJcblx0XHR2YWx1ZTogNTBcclxuXHR9LCB7XHJcblx0XHRsYWJlbDogMTAwLFxyXG5cdFx0dmFsdWU6IDEwMFxyXG5cdH1dO1xyXG5cclxuXHR2YXIgaXRlbXNQZXJQYWdlID0ga28ub2JzZXJ2YWJsZShpdGVtc1BlclBhZ2VMaXN0WzBdKTtcclxuXHJcblx0dmFyIG51bU9mUGFnZXMgPSBjb25maWcubnVtT2ZQYWdlcyB8fCBrby5vYnNlcnZhYmxlKCk7XHJcblxyXG5cdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIG51bU9mSXRlbXNWYWwgPSBudW1PZkl0ZW1zKCk7XHJcblx0XHR2YXIgaXRlbXNQZXJQYWdlVmFsID0gaXRlbXNQZXJQYWdlKCk7XHJcblxyXG5cdFx0aWYgKCFpdGVtc1BlclBhZ2VWYWwpIHtcclxuXHRcdFx0cmV0dXJuIG51bU9mUGFnZXMoMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGNvbmZpZy5pdGVtc1BlclBhZ2UpIHtcclxuXHRcdFx0Y29uZmlnLml0ZW1zUGVyUGFnZShpdGVtc1BlclBhZ2VWYWwudmFsdWUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBudW1PZlBhZ2VzKE1hdGguY2VpbChudW1PZkl0ZW1zVmFsIC8gaXRlbXNQZXJQYWdlVmFsLnZhbHVlKSk7XHJcblx0fSk7XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRudW1PZkl0ZW1zOiBudW1PZkl0ZW1zLFxyXG5cdFx0aXRlbXNQZXJQYWdlOiBpdGVtc1BlclBhZ2UsXHJcblx0XHRudW1PZlBhZ2VzOiBudW1PZlBhZ2VzLFxyXG5cclxuXHRcdGl0ZW1zUGVyUGFnZUxpc3Q6IGl0ZW1zUGVyUGFnZUxpc3RcclxuXHR9O1xyXG59O1xyXG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIGtvID0gKHdpbmRvdy5rbyk7XHJcblxyXG5mdW5jdGlvbiBrbm9iUmVnaXN0ZXJDb21wb25lbnQobmFtZSwgY3JlYXRlVm0sIHRlbXBsYXRlLCBzdHlsZSkge1xyXG5cdGtvLmNvbXBvbmVudHMucmVnaXN0ZXIobmFtZSwge1xyXG5cdFx0dmlld01vZGVsOiB7XHJcblx0XHRcdGNyZWF0ZVZpZXdNb2RlbDogZnVuY3Rpb24ocGFyYW1zLCBjb21wb25lbnRJbmZvKSB7XHJcblx0XHRcdFx0cGFyYW1zLnN0eWxlID0gc3R5bGU7XHJcblx0XHRcdFx0cmV0dXJuIGNyZWF0ZVZtKHBhcmFtcywgY29tcG9uZW50SW5mbyk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcclxuXHR9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBrbm9iUmVnaXN0ZXJDb21wb25lbnQ7XHJcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga28gPSAod2luZG93LmtvKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlTGlzdChjb25maWcpIHtcclxuXHRjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cdGlmICghY29uZmlnLmhhc093blByb3BlcnR5KFwic3RvcmVcIikpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zdG9yZSBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0aWYgKCFjb25maWcuaGFzT3duUHJvcGVydHkoXCJmaWVsZHNcIikpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5maWVsZHMgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdGlmICghY29uZmlnLmhhc093blByb3BlcnR5KFwic29ydFwiKSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNvcnQgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdGlmICghY29uZmlnLmhhc093blByb3BlcnR5KFwic2VhcmNoXCIpKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc2VhcmNoIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHRpZiAodHlwZW9mIGNvbmZpZy5zdG9yZSAhPT0gXCJvYmplY3RcIikge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNlYXJjaCBtdXN0IGJlIGFuIG9iamVjdCFcIik7XHJcblx0fVxyXG5cclxuXHRpZiAoIShjb25maWcuZmllbGRzIGluc3RhbmNlb2YgQXJyYXkpKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuZmllbGRzIG11c3QgYmUgYW4gYXJyYXkhXCIpO1xyXG5cdH1cclxuXHJcblx0aWYgKCEoY29uZmlnLnNvcnQgaW5zdGFuY2VvZiBBcnJheSkpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zb3J0IG11c3QgYmUgYW4gYXJyYXkhXCIpO1xyXG5cdH1cclxuXHJcblx0aWYgKHR5cGVvZiBjb25maWcuc2VhcmNoICE9PSBcInN0cmluZ1wiKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc2VhcmNoIG11c3QgYmUgYSBzdHJpbmchXCIpO1xyXG5cdH1cclxuXHJcblx0aWYgKGNvbmZpZy5maWVsZHMuaW5kZXhPZihjb25maWcuc2VhcmNoKSA9PT0gLTEpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5maWVsZHMgbXVzdCBjb250YWluIHRoZSB2YWx1ZSBvZiBjb25maWcuc2VhcmNoIVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBvcmRlckZpZWxkO1xyXG5cclxuXHRpZiAoY29uZmlnLm9yZGVyQnkpIHtcclxuXHRcdGlmICh0eXBlb2YgY29uZmlnLm9yZGVyQnkgIT09IFwib2JqZWN0XCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLm9yZGVyQnkgbXVzdCBoYXZlIHRoZSBmb3JtYXQgb2YgeyA8a2V5PjogWzE7LTFdIH0gXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdG9yZGVyRmllbGQgPSBPYmplY3Qua2V5cyhjb25maWcub3JkZXJCeSlbMF07XHJcblx0XHRpZiAoY29uZmlnLmZpZWxkcy5pbmRleE9mKG9yZGVyRmllbGQpID09PSAtMSB8fCBNYXRoLmFicyhjb25maWcub3JkZXJCeVtvcmRlckZpZWxkXSkgIT09IDEpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLm9yZGVyQnkgbXVzdCBoYXZlIHRoZSBmb3JtYXQgb2YgeyA8a2V5PjogWzE7LTFdIH0gXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBzb3J0Q29udGFpbnNPcmRlckZpZWxkID0gZmFsc2U7XHJcblxyXG5cdFx0Y29uZmlnLnNvcnQuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdGlmIChpdGVtLnZhbHVlID09PSBvcmRlckZpZWxkKSB7XHJcblx0XHRcdFx0c29ydENvbnRhaW5zT3JkZXJGaWVsZCA9IHRydWU7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRpZiAoIXNvcnRDb250YWluc09yZGVyRmllbGQpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNvcnQgbXVzdCBjb250YWluIHRoZSB2YWx1ZSBvZiBjb25maWcub3JkZXJCeSFcIik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjb25maWcuc29ydC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdGlmIChjb25maWcuZmllbGRzLmluZGV4T2YoaXRlbS52YWx1ZSkgPT09IC0xKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcInZhbHVlcyBvZiBjb25maWcuc29ydCBtdXN0IGJlIGluIGNvbmZpZy5maWVsZHMhXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHR2YXIgc3RvcmUgPSBjb25maWcuc3RvcmU7XHJcblx0dmFyIGZpZWxkcyA9IGNvbmZpZy5maWVsZHM7XHJcblxyXG5cdHZhciBzZWFyY2ggPSBrby5vYnNlcnZhYmxlKFwiXCIpLmV4dGVuZCh7XHJcblx0XHR0aHJvdHRsZTogY29uZmlnLnRocm90dGxlIHx8IDUwMFxyXG5cdH0pO1xyXG5cclxuXHR2YXIgc29ydE9wdGlvbnMgPSBbXTtcclxuXHJcblx0dmFyIGRlZmF1bHRPcmRlcklkeDtcclxuXHJcblx0ZnVuY3Rpb24gY3JlYXRlUXVlcnlPYmoocHJvcCwgYXNjKSB7XHJcblx0XHR2YXIgb2JqID0ge307XHJcblxyXG5cdFx0b2JqW3Byb3BdID0gYXNjO1xyXG5cclxuXHRcdGlmIChvcmRlckZpZWxkICYmIHByb3AgPT09IG9yZGVyRmllbGQgJiYgYXNjID09PSBjb25maWcub3JkZXJCeVtvcmRlckZpZWxkXSkge1xyXG5cdFx0XHRkZWZhdWx0T3JkZXJJZHggPSBzb3J0T3B0aW9ucy5sZW5ndGg7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG9iajtcclxuXHR9XHJcblxyXG5cdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGNvbmZpZy5zb3J0Lmxlbmd0aDsgaWR4ICs9IDEpIHtcclxuXHRcdHZhciBhY3QgPSBjb25maWcuc29ydFtpZHhdO1xyXG5cclxuXHRcdHNvcnRPcHRpb25zLnB1c2goe1xyXG5cdFx0XHRpY29uOiBcIiNpY29uLXNvcnQtYXNjXCIsXHJcblx0XHRcdGxhYmVsOiBhY3QubGFiZWwsXHJcblx0XHRcdHZhbHVlOiBjcmVhdGVRdWVyeU9iaihhY3QudmFsdWUsIDEpXHJcblx0XHR9KTtcclxuXHRcdHNvcnRPcHRpb25zLnB1c2goe1xyXG5cdFx0XHRpY29uOiBcIiNpY29uLXNvcnQtZGVzY1wiLFxyXG5cdFx0XHRsYWJlbDogYWN0LmxhYmVsLFxyXG5cdFx0XHR2YWx1ZTogY3JlYXRlUXVlcnlPYmooYWN0LnZhbHVlLCAtMSlcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0dmFyIHNvcnQgPSBrby5vYnNlcnZhYmxlKHNvcnRPcHRpb25zW2RlZmF1bHRPcmRlcklkeCB8fCAwXSk7XHJcblx0dmFyIHNvcnRJZHggPSBkZWZhdWx0T3JkZXJJZHggfHwgMDtcclxuXHJcblx0dmFyIHNraXAgPSBrby5vYnNlcnZhYmxlKDApO1xyXG5cdHZhciBsaW1pdCA9IGtvLm9ic2VydmFibGUoMCk7XHJcblxyXG5cdHZhciBpdGVtcyA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XHJcblxyXG5cdHN0b3JlLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkgeyAvL3N0b3JlID09PSB0aGlzXHJcblx0XHRpdGVtcy5wdXNoKGl0ZW0pO1xyXG5cdH0pO1xyXG5cclxuXHR2YXIgY291bnQgPSBrby5vYnNlcnZhYmxlKDApOyAvL3Nob3VsZCBiZSByZWFkLW9ubHlcclxuXHJcblx0dmFyIGxvYWRpbmcgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTsgLy9zaG91bGQgYmUgcmVhZC1vbmx5XHJcblx0dmFyIGVycm9yID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7IC8vc2hvdWxkIGJlIHJlYWQtb25seT9cclxuXHJcblx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc2VhcmNoVmFsID0gc2VhcmNoKCk7XHJcblx0XHR2YXIgc29ydFZhbCA9IHNvcnQoKS52YWx1ZTtcclxuXHRcdHZhciBza2lwVmFsID0gc2tpcCgpO1xyXG5cdFx0dmFyIGxpbWl0VmFsID0gbGltaXQoKTtcclxuXHJcblx0XHR2YXIgZmluZCA9IHt9O1xyXG5cclxuXHRcdGZpbmRbY29uZmlnLnNlYXJjaF0gPSAobmV3IFJlZ0V4cChzZWFyY2hWYWwsIFwiaWdcIikpLnRvU3RyaW5nKCk7XHJcblxyXG5cdFx0c3RvcmUuZmluZCA9IGZpbmQ7XHJcblx0XHRzdG9yZS5zb3J0ID0gc29ydFZhbDtcclxuXHRcdHN0b3JlLnNraXAgPSBza2lwVmFsO1xyXG5cdFx0c3RvcmUubGltaXQgPSBsaW1pdFZhbDtcclxuXHR9KS5leHRlbmQoe1xyXG5cdFx0dGhyb3R0bGU6IDBcclxuXHR9KTtcclxuXHJcblx0ZnVuY3Rpb24gYmVmb3JlTG9hZCgpIHtcclxuXHRcdGlmIChsb2FkaW5nKCkpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJMaXN0IGlzIGFscmVhZHkgbG9hZGluZy4uLlwiKTsgLy90aGlzIG1pZ2h0IGJlIHByb2JsZW1hdGljIGlmIHRoZXJlIGFyZSBubyBnb29kIHRpbWVvdXQgc2V0dGluZ3MuXHJcblx0XHR9XHJcblxyXG5cdFx0bG9hZGluZyh0cnVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFmdGVyTG9hZChlcnIpIHtcclxuXHRcdGxvYWRpbmcoZmFsc2UpO1xyXG5cdFx0aWYgKGVycikge1xyXG5cdFx0XHRyZXR1cm4gZXJyb3IoZXJyKTtcclxuXHRcdH1cclxuXHRcdGVycm9yKG51bGwpO1xyXG5cclxuXHRcdHN0b3JlLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkgeyAvL3N0b3JlID09PSB0aGlzXHJcblx0XHRcdGl0ZW1zLnB1c2goaXRlbSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRjb3VudChzdG9yZS5jb3VudCk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiByZWFkT25seUNvbXB1dGVkKG9ic2VydmFibGUpIHtcclxuXHRcdHJldHVybiBrby5jb21wdXRlZCh7XHJcblx0XHRcdHJlYWQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBvYnNlcnZhYmxlKCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdHdyaXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0aHJvdyBcIlRoaXMgY29tcHV0ZWQgdmFyaWFibGUgc2hvdWxkIG5vdCBiZSB3cml0dGVuLlwiO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHN0b3JlLmxvYWQuYmVmb3JlLmFkZChiZWZvcmVMb2FkKTtcclxuXHRzdG9yZS5sb2FkLmFmdGVyLmFkZChhZnRlckxvYWQpO1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0c3RvcmU6IHN0b3JlLFxyXG5cclxuXHRcdGZpZWxkczogZmllbGRzLCAvL3Nob3VsZCBmaWx0ZXIgdG8gdGhlIGZpZWxkcy4gKHNlbGVjdClcclxuXHJcblx0XHRzZWFyY2g6IHNlYXJjaCxcclxuXHJcblx0XHRzb3J0OiBzb3J0LFxyXG5cdFx0c29ydElkeDogc29ydElkeCxcclxuXHRcdHNvcnRPcHRpb25zOiBzb3J0T3B0aW9ucyxcclxuXHJcblx0XHRza2lwOiBza2lwLFxyXG5cdFx0bGltaXQ6IGxpbWl0LFxyXG5cclxuXHRcdGl0ZW1zOiBpdGVtcyxcclxuXHRcdGNvdW50OiByZWFkT25seUNvbXB1dGVkKGNvdW50KSxcclxuXHJcblx0XHRsb2FkaW5nOiByZWFkT25seUNvbXB1dGVkKGxvYWRpbmcpLFxyXG5cdFx0ZXJyb3I6IHJlYWRPbmx5Q29tcHV0ZWQoZXJyb3IpXHJcblx0fTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDxrbm9iLW1vZGFsIHBhcmFtcz1cIlxcblx0XHR0aXRsZTogdGl0bGUsXFxuXHRcdGljb246IGljb24sXFxuXHRcdHZpc2libGU6IHZpc2libGVcIj5cXG5cXG5cdFx0PGRpdiBjbGFzcz1cImtub2ItY29uZmlybV9fY29udGVudFwiIGRhdGEtYmluZD1cInRleHQ6IG1lc3NhZ2VcIj48L2Rpdj5cXG5cdFx0PGRpdiBjbGFzcz1cImtub2ItY29uZmlybV9fYnV0dG9uc1wiPlxcblx0XHRcdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0XHRcdGxhYmVsOiBva0xhYmVsLFxcblx0XHRcdFx0Y2xpY2s6IG9rXFxuXHRcdFx0XCI+PC9rbm9iLWJ1dHRvbj5cXG5cdFx0PC9kaXY+XFxuXHQ8L2tub2ItbW9kYWw+XFxuPC9kaXY+XFxuJzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVBbGVydChjb25maWcpIHtcclxuXHJcblx0aWYgKCFjb25maWcpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0aWYgKHR5cGVvZiBjb25maWcubWVzc2FnZSAhPT0gXCJzdHJpbmdcIikge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLm1lc3NhZ2UgbXVzdCBiZSBhIHN0cmluZ1wiKTtcclxuXHR9XHJcblxyXG5cdGlmICh0eXBlb2YgY29uZmlnLm9rTGFiZWwgIT09IFwic3RyaW5nXCIpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5va0xhYmVsIG11c3QgYmUgYSBzdHJpbmdcIik7XHJcblx0fVxyXG5cclxuXHRpZiAoIWtvLmlzT2JzZXJ2YWJsZShjb25maWcudmlzaWJsZSkpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy52aXNpYmxlIG11c3QgYmUgYW4gb2JzZXJ2YWJsZVwiKTtcclxuXHR9XHJcblxyXG5cdGlmICh0eXBlb2YgY29uZmlnLmNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5jYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XHJcblx0fVxyXG5cclxuXHR2YXIgdmlzaWJsZSA9IGNvbmZpZy52aXNpYmxlO1xyXG5cdHZhciBva0xhYmVsID0gY29uZmlnLm9rTGFiZWw7XHJcblx0dmFyIGNhbGxiYWNrID0gY29uZmlnLmNhbGxiYWNrO1xyXG5cclxuXHR2YXIgdGl0bGUgPSBjb25maWcudGl0bGUgfHwgXCJcIjtcclxuXHR2YXIgaWNvbiA9IGNvbmZpZy5pY29uIHx8IFwiXCI7XHJcblx0dmFyIG1lc3NhZ2UgPSBjb25maWcubWVzc2FnZTtcclxuXHJcblx0dmFyIG9rTGFiZWwgPSBjb25maWcub2tMYWJlbDtcclxuXHJcblx0ZnVuY3Rpb24gb2soKSB7XHJcblx0XHRjYWxsYmFjaygpO1xyXG5cdFx0dmlzaWJsZSghdmlzaWJsZSgpKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHR2aXNpYmxlOiB2aXNpYmxlLFxyXG5cclxuXHRcdHRpdGxlOiB0aXRsZSxcclxuXHRcdGljb246IGljb24sXHJcblx0XHRtZXNzYWdlOiBtZXNzYWdlLFxyXG5cclxuXHRcdG9rTGFiZWw6IG9rTGFiZWwsXHJcblxyXG5cdFx0b2s6IG9rXHJcblx0fTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImtub2ItY29uZmlybVwiPlxcblx0PGtub2ItbW9kYWwgcGFyYW1zPVwiXFxuXHRcdHRpdGxlOiB0aXRsZSxcXG5cdFx0aWNvbjogaWNvbixcXG5cdFx0dmlzaWJsZTogdmlzaWJsZVwiPlxcblx0XHQ8ZGl2IGNsYXNzPVwia25vYi1jb25maXJtX19jb250ZW50XCIgZGF0YS1iaW5kPVwidGV4dDogbWVzc2FnZVwiPjwvZGl2Plxcblx0XHQ8ZGl2IGNsYXNzPVwia25vYi1jb25maXJtX19idXR0b25zXCI+XFxuXHRcdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cIlxcblx0XHRcdFx0bGFiZWw6IG9rTGFiZWwsXFxuXHRcdFx0XHR2YXJpYXRpb246IFxcJ3ByaW1hcnlcXCcsXFxuXHRcdFx0XHRjbGljazogb2tcXG5cdFx0XHRcIj48L2tub2ItYnV0dG9uPlxcblx0XHRcdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0XHRcdGxhYmVsOiBjYW5jZWxMYWJlbCxcXG5cdFx0XHRcdGNsaWNrOiBjYW5jZWxcXG5cdFx0XHRcIj48L2tub2ItYnV0dG9uPlxcblx0XHQ8L2Rpdj5cXG5cdDwva25vYi1tb2RhbD5cXG48L2Rpdj5cXG4nOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlQ29uZmlybU1vZGFsKGNvbmZpZykge1xyXG5cdGlmICghY29uZmlnKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdGlmICghY29uZmlnLm1lc3NhZ2UpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5tZXNzYWdlIGVsZW1lbnQgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdGlmICghY29uZmlnLm9rTGFiZWwpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5va0xhYmVsIGVsZW1lbnQgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdGlmICghY29uZmlnLmNhbmNlbExhYmVsKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuY2FuY2VsTGFiZWwgZWxlbWVudCBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHR2YXIgdmlzaWJsZSA9IGNvbmZpZy52aXNpYmxlO1xyXG5cdHZhciBjYWxsYmFjayA9IGNvbmZpZy5jYWxsYmFjaztcclxuXHJcblx0dmFyIHRpdGxlID0gY29uZmlnLnRpdGxlIHx8IFwiXCI7XHJcblx0dmFyIGljb24gPSBjb25maWcuaWNvbiB8fCBcIlwiO1xyXG5cdHZhciBtZXNzYWdlID0gY29uZmlnLm1lc3NhZ2U7XHJcblxyXG5cdHZhciBva0xhYmVsID0gY29uZmlnLm9rTGFiZWw7XHJcblx0dmFyIGNhbmNlbExhYmVsID0gY29uZmlnLmNhbmNlbExhYmVsO1xyXG5cclxuXHJcblx0ZnVuY3Rpb24gb2soKSB7XHJcblx0XHRjYWxsYmFjayh0cnVlKTtcclxuXHRcdHZpc2libGUoIXZpc2libGUoKSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjYW5jZWwoKSB7XHJcblx0XHRjYWxsYmFjayhmYWxzZSk7XHJcblx0XHR2aXNpYmxlKCF2aXNpYmxlKCkpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdHZpc2libGU6IHZpc2libGUsXHJcblxyXG5cdFx0dGl0bGU6IHRpdGxlLFxyXG5cdFx0aWNvbjogaWNvbixcclxuXHRcdG1lc3NhZ2U6IG1lc3NhZ2UsXHJcblxyXG5cdFx0b2tMYWJlbDogb2tMYWJlbCxcclxuXHRcdGNhbmNlbExhYmVsOiBjYW5jZWxMYWJlbCxcclxuXHJcblx0XHRvazogb2ssXHJcblx0XHRjYW5jZWw6IGNhbmNlbFxyXG5cdH07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQ29uZmlybU1vZGFsOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlU3R5bGVDb25maWcodGhlbWUpIHtcclxuXHJcblx0dmFyIHRpbnljb2xvciA9IHJlcXVpcmUoXCJ0aW55Y29sb3IyXCIpO1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0XCJkZWZhdWx0XCI6IHtcclxuXHRcdFx0XCJkZWZhdWx0XCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5ibGFjayxcclxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxyXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImhvdmVyXCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUuYmxhY2spLmxpZ2h0ZW4oKS50b1N0cmluZygpLFxyXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXHJcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwia25vYi1tb2RhbC1vdmVybGF5XCIgZGF0YS1iaW5kPVwidmlzaWJsZTogdmlzaWJsZVwiPlxcblxcblx0PGRpdiBjbGFzcz1cImtub2ItbW9kYWxcIj5cXG5cdFx0PGRpdiBjbGFzcz1cImtub2ItbW9kYWxfX2hlYWRlclwiIGRhdGEtYmluZD1cInN0eWxlOiBzdHlsZVwiPlxcblx0XHRcdDxrbm9iLWJ1dHRvbiBjbGFzcz1cImJ1dHRvbi1jbG9zZVwiIHBhcmFtcz1cInZhcmlhdGlvbjogXFwnbW9kYWxIZWFkXFwnLCBpY29uOiBcXCcjaWNvbi1jbG9zZVxcJywgY2xpY2s6ICRjb21wb25lbnQudmlzaWJsZS50b2dnbGVcIj48L2tub2ItYnV0dG9uPlxcblxcblx0XHRcdDxzcGFuIGNsYXNzPVwiZGVzY1wiPlxcblx0XHRcdFx0PHN2ZyBjbGFzcz1cImljb25cIj5cXG5cdFx0XHRcdFx0PHVzZSB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7XFwneGxpbms6aHJlZlxcJzogaWNvbn1cIiB4bGluazpocmVmPVwiXCI+PC91c2U+XFxuXHRcdFx0XHQ8L3N2Zz5cXG5cdFx0XHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IHRpdGxlXCI+PC9zcGFuPlxcblx0XHRcdDwvc3Bhbj5cXG5cXG5cdFx0PC9kaXY+XFxuXHRcdDxkaXYgY2xhc3M9XCJrbm9iLW1vZGFsX19ib2R5XCI+XFxuXHRcdFx0PCEtLSBrbyB0ZW1wbGF0ZTogeyBub2RlczogJGNvbXBvbmVudFRlbXBsYXRlTm9kZXMsIGRhdGE6ICRwYXJlbnQgfSAtLT48IS0tIC9rbyAtLT5cXG5cdFx0PC9kaXY+XFxuXHQ8L2Rpdj5cXG48L2Rpdj5cXG4nOyIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIga28gPSAod2luZG93LmtvKTtcclxudmFyIGJhc2UgPSByZXF1aXJlKFwiLi4vYmFzZS92bVwiKTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZU1vZGFsKGNvbmZpZykge1xyXG5cclxuXHRpZiAoIWNvbmZpZykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHRpZiAoY29uZmlnLnZpc2libGUgJiYgIWtvLmlzT2JzZXJ2YWJsZShjb25maWcudmlzaWJsZSkpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy52aXNpYmxlIG11c3QgYmUgYW4gb2JzZXJ2YWJsZVwiKTtcclxuXHR9XHJcblxyXG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0dmFyIHZpc2libGUgPSBjb25maWcudmlzaWJsZTtcclxuXHR2YXIgdGl0bGUgPSBjb25maWcudGl0bGU7XHJcblx0dmFyIGljb24gPSBjb25maWcuaWNvbjtcclxuXHJcblx0dmlzaWJsZS50b2dnbGUgPSBmdW5jdGlvbigpIHtcclxuXHRcdHZpc2libGUoIXZpc2libGUoKSk7XHJcblx0fTtcclxuXHJcblx0Y29uZmlnLmNvbXBvbmVudCA9IFwibW9kYWxcIjtcclxuXHJcblx0dmFyIHZtID0gYmFzZShjb25maWcpO1xyXG5cclxuXHR2bS52aXNpYmxlID0gdmlzaWJsZTtcclxuXHR2bS50aXRsZSA9IHRpdGxlO1xyXG5cdHZtLmljb24gPSBpY29uO1xyXG5cclxuXHRyZXR1cm4gdm07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlTW9kYWw7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVTdHlsZUNvbmZpZyh0aGVtZSkge1xyXG5cclxuXHR2YXIgdGlueWNvbG9yID0gcmVxdWlyZShcInRpbnljb2xvcjJcIik7XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRcImRlZmF1bHRcIjoge1xyXG5cdFx0XHRcImRlZmF1bHRcIjoge1xyXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxyXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2ssXHJcblx0XHRcdFx0XCJib3JkZXItY29sb3JcIjogdGhlbWUubWVkaXVtR3JheVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcImhvdmVyXCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aW55Y29sb3IodGhlbWUud2hpdGUpLmRhcmtlbigpLnRvU3RyaW5nKCksXHJcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFjayxcclxuXHRcdFx0XHRcImJvcmRlci1jb2xvclwiOiB0aW55Y29sb3IodGhlbWUubWVkaXVtR3JheSkuZGFya2VuLnRvU3RyaW5nKClcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJhY3RpdmVcIjoge1xyXG5cdFx0XHRcdFwiY29sb3JcIjogdGlueWNvbG9yKHRoZW1lLm1lZGl1bUdyYXkpLmRhcmtlbi50b1N0cmluZygpLFxyXG5cdFx0XHRcdFwiZmlsbFwiOiB0aW55Y29sb3IodGhlbWUubWVkaXVtR3JheSkuZGFya2VuLnRvU3RyaW5nKClcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxyXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2tcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJzdWNjZXNzXCI6IHtcclxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5zdWNjZXNzQ29sb3IsXHJcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcclxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJlcnJvclwiOiB7XHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuYWxlcnRDb2xvcixcclxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxyXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImtub2ItcGFnZWxpc3RcIj5cXG5cdDwhLS0ga28gaWY6IGVycm9yIC0tPlxcblx0XHQ8ZGl2IGRhdGEtYmluZD1cInRleHQ6IGVycm9yXCI+PC9kaXY+XFxuXHQ8IS0tIC9rbyAtLT5cXG5cXG5cdDxkaXY+XFxuXHRcdDxkaXYgY2xhc3M9XCJrbm9iLXBhZ2VsaXN0X19iYXJcIj5cXG5cdFx0XHQ8aW5wdXQgY2xhc3M9XCJrbm9iLWlucHV0XCIgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTogc2VhcmNoLCB2YWx1ZVVwZGF0ZTogXFwnYWZ0ZXJrZXlkb3duXFwnXCIvPlxcblx0XHRcdDxrbm9iLWJ1dHRvbiBjbGFzcz1cImtub2ItYnV0dG9uLXNlYXJjaFwiIHBhcmFtcz1cImxhYmVsOiBcXCdcXCcsXFxuXHRcdFx0XHRcdFx0XHRcdHZhcmlhdGlvbjogXFwnZGVmYXVsdFxcJyxcXG5cdFx0XHRcdFx0XHRcdFx0aWNvbjogXFwnI2ljb24tc2VhcmNoXFwnXCI+XFxuXHRcdFx0PC9rbm9iLWJ1dHRvbj5cXG5cdFx0XHQ8a25vYi1pdGVtcy1wZXItcGFnZSBjbGFzcz1cImtub2ItcGFnZWxpc3RfX2l0ZW1zLXBlci1wYWdlXCIgcGFyYW1zPVwibnVtT2ZJdGVtczogY291bnQsXFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRudW1PZlBhZ2VzOiBudW1PZlBhZ2VzLFxcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbXNQZXJQYWdlOiBpdGVtc1BlclBhZ2VcIj5cXG5cdFx0XHQ8L2tub2ItaXRlbXMtcGVyLXBhZ2U+XFxuXHRcdFx0PCEtLSBrbyBpZjogc29ydE9wdGlvbnMubGVuZ3RoID4gMCAtLT5cXG5cdFx0XHRcdDxrbm9iLWRyb3Bkb3duIGNsYXNzPVwia25vYi1kcm9wZG93blwiIHBhcmFtcz1cInJpZ2h0SWNvbjogXFwnI2ljb24tZXhwYW5kLW1vcmVcXCcsIHNlbGVjdGVkSWR4OiBzb3J0SWR4LCBzZWxlY3RlZDogc29ydCwgaXRlbXM6IHNvcnRPcHRpb25zXCI+PC9rbm9iLWRyb3Bkb3duPlxcblx0XHRcdDwhLS0gL2tvIC0tPlxcblx0XHQ8L2Rpdj5cXG5cdFx0PHVsIGRhdGEtYmluZD1cImNzczogbGlzdENsYXNzLCBmb3JlYWNoOiBpdGVtc1wiPlxcblx0XHRcdDxsaSBkYXRhLWJpbmQ9XCJjc3M6ICRwYXJlbnQuaXRlbUNsYXNzXCI+XFxuXHRcdFx0XHQ8IS0tIGtvIHRlbXBsYXRlOiB7IG5vZGVzOiAkY29tcG9uZW50VGVtcGxhdGVOb2RlcywgZGF0YToge21vZGVsOiAkZGF0YSwgcGFyZW50OiAkcGFyZW50LCBpbmRleDogJGluZGV4fSB9IC0tPjwhLS0gL2tvIC0tPlxcblx0XHRcdDwvbGk+XFxuXHRcdDwvdWw+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogbG9hZGluZ1wiPkxvYWRpbmcuLi48L2Rpdj5cXG5cdDwhLS1cXG5cdDxrbm9iLXBhZ2luYXRpb24gcGFyYW1zPVwibnVtT2ZJdGVtczogcGFnaW5hdGlvbi5udW1PZkl0ZW1zLCBpdGVtc1BlclBhZ2U6IGl0ZW1zUGVyUGFnZVwiPjwva25vYi1wYWdpbmF0aW9uPlxcblx0LS0+XFxuXHQ8IS0tIGtvIGlmOiBudW1PZlBhZ2VzKCkgPiAwIC0tPlxcblx0XHQ8a25vYi1wYWdpbmF0aW9uIHBhcmFtcz1cIm51bU9mUGFnZXM6IG51bU9mUGFnZXMsIGN1cnJlbnRQYWdlOiBjdXJyZW50UGFnZVwiPjwva25vYi1wYWdpbmF0aW9uPlxcblx0PCEtLSAva28gLS0+XFxuXHQ8IS0tIGtvIGlmOiAkZGF0YS5sb2FkTW9yZSAtLT5cXG5cdFx0PGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAhbG9hZGluZygpLCBjbGljazogbG9hZE1vcmVcIj5Mb2FkIG1vcmUuLi48L2Rpdj5cXG5cdDwhLS0gL2tvIC0tPlxcbjwvZGl2Pic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgY3JlYXRlTGlzdCA9IHJlcXVpcmUoXCIuLi9saXN0L3ZtXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVQYWdlZExpc3QoY29uZmlnKSB7XHJcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHRpZiAoIWNvbmZpZy5zdG9yZSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnN0b3JlIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cclxuXHR2YXIgc3RvcmUgPSBjb25maWcuc3RvcmU7XHJcblxyXG5cdHN0b3JlLmxvYWQuYmVmb3JlLmFkZChiZWZvcmVMb2FkKTtcclxuXHJcblx0dmFyIGxpc3QgPSBjcmVhdGVMaXN0KGNvbmZpZyk7XHJcblx0Ly92YXIgcGFnaW5hdGlvbiA9IGNyZWF0ZVBhZ2luYXRpb24oY29uZmlnLnBhZ2luYXRpb24pO1xyXG5cdC8vbGlzdC5wYWdpbmF0aW9uID0gcGFnaW5hdGlvbjtcclxuXHJcblx0dmFyIG51bU9mUGFnZXMgPSBrby5vYnNlcnZhYmxlKCk7XHJcblx0dmFyIGl0ZW1zUGVyUGFnZSA9IGtvLm9ic2VydmFibGUoMTApO1xyXG5cdHZhciBjdXJyZW50UGFnZSA9IGtvLm9ic2VydmFibGUoMCk7XHJcblxyXG5cdGxpc3QubGlzdENsYXNzID0gY29uZmlnLmxpc3RDbGFzcyB8fCBcImtub2ItcGFnZWRsaXN0X19saXN0XCI7XHJcblx0bGlzdC5pdGVtQ2xhc3MgPSBjb25maWcuaXRlbUNsYXNzIHx8IFwia25vYi1wYWdlZGxpc3RfX2l0ZW1cIjtcclxuXHRsaXN0Lm51bU9mUGFnZXMgPSBudW1PZlBhZ2VzO1xyXG5cdGxpc3QuaXRlbXNQZXJQYWdlID0gaXRlbXNQZXJQYWdlO1xyXG5cdGxpc3QuY3VycmVudFBhZ2UgPSBjdXJyZW50UGFnZTtcclxuXHJcblx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgY3VycmVudFBhZ2VWYWwgPSBjdXJyZW50UGFnZSgpO1xyXG5cdFx0dmFyIGl0ZW1zUGVyUGFnZVZhbCA9IGl0ZW1zUGVyUGFnZSgpO1xyXG5cclxuXHRcdGxpc3Quc2tpcChjdXJyZW50UGFnZVZhbCAqIGl0ZW1zUGVyUGFnZVZhbCk7XHJcblx0XHRsaXN0LmxpbWl0KGl0ZW1zUGVyUGFnZVZhbCk7XHJcblx0fSk7XHJcblxyXG5cdC8qXHJcblx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgY291bnQgPSBsaXN0LmNvdW50KCk7XHJcblx0XHRsaXN0LnBhZ2luYXRpb24ubnVtT2ZJdGVtcyhjb3VudCk7XHJcblx0fSk7XHJcblx0Ki9cclxuXHJcblx0ZnVuY3Rpb24gYmVmb3JlTG9hZCgpIHtcclxuXHRcdGxpc3QuaXRlbXMoW10pO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIGxpc3Q7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJrbm9iLXBhZ2luYXRpb25cIiBkYXRhLWJpbmQ9XCJpZjogcGFnZVNlbGVjdG9ycygpLmxlbmd0aFwiPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0cGFyYW1zOiB7XFxuXHRcdFx0XHRcdFx0XHR2YXJpYXRpb246IFxcJ3BhZ2luYXRpb25cXCcsXFxuXHRcdFx0XHRcdFx0XHRpY29uOiBcXCcjaWNvbi1maXJzdC1wYWdlXFwnLFxcblx0XHRcdFx0XHRcdFx0c3RhdGU6IGZpcnN0KCkuc3RhdGUsXFxuXHRcdFx0XHRcdFx0XHRjbGljazogZmlyc3QoKS5zZWxlY3RQYWdlXFxuXHRcdFx0XHRcdFx0fVxcblx0XHRcdFx0XHR9XCI+XFxuXHQ8L3NwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtcXG5cdFx0XHRcdFx0XHRuYW1lOiBcXCdrbm9iLWJ1dHRvblxcJyxcXG5cdFx0XHRcdFx0XHRwYXJhbXM6IHtcXG5cdFx0XHRcdFx0XHRcdHZhcmlhdGlvbjogXFwncGFnaW5hdGlvblxcJyxcXG5cdFx0XHRcdFx0XHRcdGljb246IFxcJyNpY29uLWNoZXZyb24tbGVmdFxcJyxcXG5cdFx0XHRcdFx0XHRcdHN0YXRlOiBwcmV2KCkuc3RhdGUsXFxuXHRcdFx0XHRcdFx0XHRjbGljazogcHJldigpLnNlbGVjdFBhZ2VcXG5cdFx0XHRcdFx0XHR9XFxuXHRcdFx0XHRcdH1cIj5cXG5cdDwvc3Bhbj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cImZvcmVhY2g6IHBhZ2VTZWxlY3RvcnNcIj5cXG5cdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cImxhYmVsOiBsYWJlbCxcXG5cdFx0XHRcdFx0XHRcdHN0YXRlOiBzdGF0ZSxcXG5cdFx0XHRcdFx0XHRcdHZhcmlhdGlvbjogXFwncGFnaW5hdGlvblxcJyxcXG5cdFx0XHRcdFx0XHRcdGNsaWNrOiBzZWxlY3RQYWdlXCI+PC9rbm9iLWJ1dHRvbj5cXG5cdDwvc3Bhbj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cImNvbXBvbmVudDoge1xcblx0XHRcdFx0XHRcdG5hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLFxcblx0XHRcdFx0XHRcdHBhcmFtczoge1xcblx0XHRcdFx0XHRcdFx0dmFyaWF0aW9uOiBcXCdwYWdpbmF0aW9uXFwnLFxcblx0XHRcdFx0XHRcdFx0aWNvbjogXFwnI2ljb24tY2hldnJvbi1yaWdodFxcJyxcXG5cdFx0XHRcdFx0XHRcdHN0YXRlOiBuZXh0KCkuc3RhdGUsXFxuXHRcdFx0XHRcdFx0XHRjbGljazogbmV4dCgpLnNlbGVjdFBhZ2VcXG5cdFx0XHRcdFx0XHR9XFxuXHRcdFx0XHRcdH1cIj5cXG5cdDwvc3Bhbj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cImNvbXBvbmVudDoge1xcblx0XHRcdFx0XHRcdG5hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLFxcblx0XHRcdFx0XHRcdHBhcmFtczoge1xcblx0XHRcdFx0XHRcdFx0dmFyaWF0aW9uOiBcXCdwYWdpbmF0aW9uXFwnLFxcblx0XHRcdFx0XHRcdFx0aWNvbjogXFwnI2ljb24tbGFzdC1wYWdlXFwnLFxcblx0XHRcdFx0XHRcdFx0c3RhdGU6IGxhc3QoKS5zdGF0ZSxcXG5cdFx0XHRcdFx0XHRcdGNsaWNrOiBsYXN0KCkuc2VsZWN0UGFnZVxcblx0XHRcdFx0XHRcdH1cXG5cdFx0XHRcdFx0fVwiPlxcblx0PC9zcGFuPlxcbjwvZGl2Pic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVQYWdpbmF0aW9uKGNvbmZpZykge1xyXG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0aWYgKGNvbmZpZy5hZnRlckhlYWQgJiYgY29uZmlnLmFmdGVySGVhZCA8IDEpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5hZnRlckhlYWQgbXVzdCBiZSBsYXJnZXIgdGhhbiB6ZXJvXCIpO1xyXG5cdH1cclxuXHJcblx0aWYgKGNvbmZpZy5iZWZvcmVUYWlsICYmIGNvbmZpZy5iZWZvcmVUYWlsIDwgMSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmJlZm9yZVRhaWwgbXVzdCBiZSBsYXJnZXIgdGhhbiB6ZXJvXCIpO1xyXG5cdH1cclxuXHJcblx0aWYgKGNvbmZpZy5iZWZvcmVDdXJyZW50ICYmIGNvbmZpZy5iZWZvcmVDdXJyZW50IDwgMSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmJlZm9yZUN1cnJlbnQgbXVzdCBiZSBsYXJnZXIgdGhhbiB6ZXJvXCIpO1xyXG5cdH1cclxuXHJcblx0aWYgKGNvbmZpZy5hZnRlckN1cnJlbnQgJiYgY29uZmlnLmFmdGVyQ3VycmVudCA8IDEpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5hZnRlckN1cnJlbnQgbXVzdCBiZSBsYXJnZXIgdGhhbiB6ZXJvXCIpO1xyXG5cdH1cclxuXHJcblx0dmFyIG51bU9mUGFnZXM7XHJcblxyXG5cdGlmIChrby5pc09ic2VydmFibGUoY29uZmlnLm51bU9mUGFnZXMpKSB7XHJcblx0XHRudW1PZlBhZ2VzID0gY29uZmlnLm51bU9mUGFnZXM7XHJcblx0fSBlbHNlIHtcclxuXHRcdG51bU9mUGFnZXMgPSBrby5vYnNlcnZhYmxlKGNvbmZpZy5udW1PZlBhZ2VzIHx8IDEwKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZSh2YWx1ZSkge1xyXG5cdFx0aWYgKHZhbHVlIDwgMCkge1xyXG5cdFx0XHR2YWx1ZSA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHBhZ2VzTnVtID0gbnVtT2ZQYWdlcygpO1xyXG5cclxuXHRcdGlmICh2YWx1ZSA+PSBwYWdlc051bSkge1xyXG5cdFx0XHR2YWx1ZSA9IHBhZ2VzTnVtIC0gMTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdmFsdWU7XHJcblx0fVxyXG5cclxuXHR2YXIgY3VycmVudFBhZ2UgPSAoZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgY3VycmVudFBhZ2UgPSBrby5vYnNlcnZhYmxlKCk7XHJcblxyXG5cdFx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdG51bU9mUGFnZXMoKTtcclxuXHRcdFx0Y3VycmVudFBhZ2UoMCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpZiAoa28uaXNPYnNlcnZhYmxlKGNvbmZpZy5jdXJyZW50UGFnZSkpIHtcclxuXHRcdFx0Y3VycmVudFBhZ2UgPSBjb25maWcuY3VycmVudFBhZ2U7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjdXJyZW50UGFnZSA9IGtvLm9ic2VydmFibGUobm9ybWFsaXplKGNvbmZpZy5jdXJyZW50UGFnZSkgfHwgMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGtvLmNvbXB1dGVkKHtcclxuXHRcdFx0cmVhZDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIGN1cnJlbnRQYWdlKCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdHdyaXRlOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRcdGN1cnJlbnRQYWdlKG5vcm1hbGl6ZSh2YWx1ZSkpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9KCkpO1xyXG5cclxuXHJcblxyXG5cdHZhciBjdXJyZW50UGFnZVJlYWxJZHg7XHJcblx0dmFyIHBhZ2VTZWxlY3RvcnMgPSAoZnVuY3Rpb24oY29uZmlnKSB7XHJcblx0XHR2YXIgYWZ0ZXJIZWFkID0gY29uZmlnLmFmdGVySGVhZCB8fCAyO1xyXG5cdFx0dmFyIGJlZm9yZVRhaWwgPSBjb25maWcuYmVmb3JlVGFpbCB8fCAyO1xyXG5cdFx0dmFyIGJlZm9yZUN1cnJlbnQgPSBjb25maWcuYmVmb3JlQ3VycmVudCB8fCAyO1xyXG5cdFx0dmFyIGFmdGVyQ3VycmVudCA9IGNvbmZpZy5hZnRlckN1cnJlbnQgfHwgMjtcclxuXHJcblx0XHRmdW5jdGlvbiBjcmVhdGVQYWdlU2VsZWN0b3IoaWR4KSB7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0bGFiZWw6IGlkeCArIDEsXHJcblx0XHRcdFx0c3RhdGU6IFwiZGVmYXVsdFwiLFxyXG5cdFx0XHRcdHNlbGVjdFBhZ2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0Y3VycmVudFBhZ2UoaWR4KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gY3JlYXRlTm9uQ2xpY2thYmxlU2VsZWN0b3IobGFiZWwpIHtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRsYWJlbDogbGFiZWwsXHJcblx0XHRcdFx0c3RhdGU6IFwiZGlzYWJsZWRcIixcclxuXHRcdFx0XHRzZWxlY3RQYWdlOiBmdW5jdGlvbigpIHt9XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgZWxlbWVudHMgPSBbXTtcclxuXHJcblx0XHRcdHZhciBudW1PZlBhZ2VzVmFsID0gbnVtT2ZQYWdlcygpO1xyXG5cdFx0XHR2YXIgY3VycmVudFBhZ2VWYWwgPSBjdXJyZW50UGFnZSgpO1xyXG5cclxuXHRcdFx0dmFyIG5vbkNsaWNrYWJsZUluc2VydGVkID0gZmFsc2U7XHJcblxyXG5cdFx0XHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCBudW1PZlBhZ2VzVmFsOyBpZHggKz0gMSkge1xyXG5cdFx0XHRcdGlmIChpZHggPD0gYWZ0ZXJIZWFkIHx8IGlkeCA+PSBudW1PZlBhZ2VzVmFsIC0gYmVmb3JlVGFpbCAtIDEgfHwgaWR4ID49IGN1cnJlbnRQYWdlVmFsIC0gYmVmb3JlQ3VycmVudCAmJiBpZHggPD0gY3VycmVudFBhZ2VWYWwgKyBhZnRlckN1cnJlbnQpIHtcclxuXHRcdFx0XHRcdHZhciBwYWdlU2VsZWN0b3I7XHJcblxyXG5cdFx0XHRcdFx0aWYgKGlkeCA9PT0gY3VycmVudFBhZ2VWYWwpIHtcclxuXHRcdFx0XHRcdFx0cGFnZVNlbGVjdG9yID0gY3JlYXRlTm9uQ2xpY2thYmxlU2VsZWN0b3IoaWR4ICsgMSk7XHJcblx0XHRcdFx0XHRcdGN1cnJlbnRQYWdlUmVhbElkeCA9IGVsZW1lbnRzLmxlbmd0aDtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHBhZ2VTZWxlY3RvciA9IGNyZWF0ZVBhZ2VTZWxlY3RvcihpZHgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGVsZW1lbnRzLnB1c2gocGFnZVNlbGVjdG9yKTtcclxuXHRcdFx0XHRcdG5vbkNsaWNrYWJsZUluc2VydGVkID0gZmFsc2U7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmICghbm9uQ2xpY2thYmxlSW5zZXJ0ZWQpIHtcclxuXHRcdFx0XHRcdFx0ZWxlbWVudHMucHVzaChjcmVhdGVOb25DbGlja2FibGVTZWxlY3RvcihcIi4uLlwiKSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRub25DbGlja2FibGVJbnNlcnRlZCA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gZWxlbWVudHM7XHJcblx0XHR9KTtcclxuXHR9KGNvbmZpZykpO1xyXG5cclxuXHJcblx0dmFyIG5leHQgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcclxuXHRcdHZhciBpZHggPSBjdXJyZW50UGFnZVJlYWxJZHggKyAxO1xyXG5cclxuXHRcdHZhciBwYWdlcyA9IHBhZ2VTZWxlY3RvcnMoKTtcclxuXHJcblx0XHRpZiAoaWR4ID49IHBhZ2VzLmxlbmd0aCAtIDEpIHtcclxuXHRcdFx0aWR4ID0gcGFnZXMubGVuZ3RoIC0gMTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcGFnZXNbaWR4XTtcclxuXHR9KTtcclxuXHJcblx0dmFyIHByZXYgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcclxuXHRcdHZhciBpZHggPSBjdXJyZW50UGFnZVJlYWxJZHggLSAxO1xyXG5cclxuXHRcdGlmIChpZHggPCAwKSB7XHJcblx0XHRcdGlkeCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHBhZ2VTZWxlY3RvcnMoKVtpZHhdO1xyXG5cdH0pO1xyXG5cclxuXHR2YXIgZmlyc3QgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBwYWdlU2VsZWN0b3JzKClbMF07XHJcblx0fSk7XHJcblxyXG5cdHZhciBsYXN0ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgcGFnZXMgPSBwYWdlU2VsZWN0b3JzKCk7XHJcblxyXG5cdFx0cmV0dXJuIHBhZ2VzW3BhZ2VzLmxlbmd0aCAtIDFdO1xyXG5cdH0pO1xyXG5cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdHBhZ2VTZWxlY3RvcnM6IHBhZ2VTZWxlY3RvcnMsXHJcblxyXG5cdFx0Zmlyc3Q6IGZpcnN0LFxyXG5cdFx0bGFzdDogbGFzdCxcclxuXHJcblx0XHRuZXh0OiBuZXh0LFxyXG5cdFx0cHJldjogcHJldixcclxuXHJcblx0XHRjdXJyZW50UGFnZTogY3VycmVudFBhZ2UsXHJcblxyXG5cdFx0bnVtT2ZQYWdlczogbnVtT2ZQYWdlc1xyXG5cdH07XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJrbm9iLXJhZGlvXCIgZGF0YS1iaW5kPVwiZm9yZWFjaDogaXRlbXNcIj5cXG5cdDxkaXYgZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdG5hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLFxcblx0XHRwYXJhbXM6IHtcXG5cdFx0XHRzdGF0ZTogaXNTZWxlY3RlZCgpID8gXFwnYWN0aXZlXFwnIDogXFwnZGVmYXVsdFxcJyxcXG5cdFx0XHR2YXJpYXRpb246ICRwYXJlbnQudmFyaWF0aW9uLFxcblx0XHRcdGxhYmVsOiBsYWJlbCxcXG5cdFx0XHRpY29uOiBpY29uLFxcblx0XHRcdHJhZGlvOiB0cnVlLFxcblx0XHRcdGdyb3VwOiBncm91cCxcXG5cdFx0XHRjbGljazogc2VsZWN0XFxuXHRcdH1cXG5cdH1cIj5cXG5cdDwvZGl2PlxcbjwvZGl2Plxcbic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlUmFkaW8oY29uZmlnKSB7XHJcblxyXG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0dmFyIHZtID0ge307XHJcblxyXG5cdGlmIChjb25maWcuaXRlbXMubGVuZ3RoID09PSAwKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuaXRlbXMgc2hvdWxkIG5vdCBiZSBlbXB0eVwiKTtcclxuXHR9XHJcblxyXG5cdHZtLnNlbGVjdGVkID0gY29uZmlnLnNlbGVjdGVkIHx8IGtvLm9ic2VydmFibGUoKTtcclxuXHR2bS5zZWxlY3RlZElkeCA9IGNvbmZpZy5zZWxlY3RlZElkeCB8fCBrby5vYnNlcnZhYmxlKCk7XHJcblxyXG5cdHZtLnZhcmlhdGlvbiA9IGNvbmZpZy52YXJpYXRpb24gfHwgXCJkZWZhdWx0XCI7XHJcblxyXG5cdHZtLml0ZW1zID0gW107XHJcblxyXG5cdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGNvbmZpZy5pdGVtcy5sZW5ndGg7IGlkeCArPSAxKSB7XHJcblxyXG5cdFx0dmFyIGFjdCA9IGNvbmZpZy5pdGVtc1tpZHhdO1xyXG5cclxuXHRcdGlmICghYWN0LmxhYmVsICYmICFhY3QuaWNvbikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJlYWNoIGVsZW1lbnQgb2YgY29uZmlnLml0ZW1zIGhhcyB0byBoYXZlIGxhYmVsIGFuZC9vciBpY29uIHByb3BlcnR5XCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZtLml0ZW1zLnB1c2goY3JlYXRlSXRlbVZtKGFjdC5sYWJlbCwgYWN0Lmljb24sIGlkeCkpO1xyXG5cdH1cclxuXHJcblx0dmFyIHNlbCA9IHZtLnNlbGVjdGVkSWR4KCk7XHJcblxyXG5cdGlmICh0eXBlb2Ygc2VsID09PSBcIm51bWJlclwiKSB7XHJcblx0XHRzZWwgPSBNYXRoLmZsb29yKHNlbCk7XHJcblx0XHRzZWwgJT0gdm0uaXRlbXMubGVuZ3RoO1xyXG5cclxuXHRcdHZtLml0ZW1zW3NlbF0uc2VsZWN0KCk7XHJcblxyXG5cdH0gZWxzZSB7XHJcblx0XHR2bS5pdGVtc1swXS5zZWxlY3QoKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNyZWF0ZUl0ZW1WbShsYWJlbCwgaWNvbiwgaWR4KSB7XHJcblxyXG5cdFx0dmFyIG9iaiA9IHtcclxuXHRcdFx0bGFiZWw6IGxhYmVsLFxyXG5cdFx0XHRpY29uOiBpY29uLFxyXG5cdFx0XHRncm91cDogY29uZmlnLmdyb3VwLFxyXG5cdFx0XHRzZWxlY3Q6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZtLnNlbGVjdGVkKG9iaik7XHJcblx0XHRcdFx0dm0uc2VsZWN0ZWRJZHgoaWR4KTtcclxuXHRcdFx0fSxcclxuXHRcdFx0aXNTZWxlY3RlZDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIG9iaiA9PT0gdm0uc2VsZWN0ZWQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4gb2JqO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHZtO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVJhZGlvO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGRhdGEtYmluZD1cImNzczogY3NzQ2xhc3MsXFxuXHRcdFx0XHRcdHN0eWxlOiBzdHlsZVwiPlxcblx0PCEtLSBrbyB0ZW1wbGF0ZTogeyBub2RlczogJGNvbXBvbmVudFRlbXBsYXRlTm9kZXMsIGRhdGE6ICRwYXJlbnQgfSAtLT48IS0tIC9rbyAtLT5cXG48L2Rpdj4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgYmFzZSA9IHJlcXVpcmUoXCIuLi8uLi9iYXNlL3ZtXCIpO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlVGFiKGNvbmZpZykge1xyXG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHRjb25maWcuY29tcG9uZW50ID0gXCJ0YWJcIjtcclxuXHRjb25maWcudmFyaWF0aW9uID0gXCJ0YWJcIjtcclxuXHRjb25maWcuc3RhdGUgPSBcImFjdGl2ZVwiO1xyXG5cdHZhciB2bSA9IGJhc2UoY29uZmlnKTtcclxuXHJcblx0cmV0dXJuIHZtO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVRhYjtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDxrbm9iLXJhZGlvIGNsYXNzPVwia25vYi1yYWRpby0taW5saW5lXCIgcGFyYW1zPVwiXFxuXHRcdGdyb3VwOiB0YWJzR3JvdXAsXFxuXHRcdHZhcmlhdGlvbjogXFwndGFiXFwnLFxcblx0XHRzZWxlY3RlZElkeDogc2VsZWN0ZWRJZHgsXFxuXHRcdGl0ZW1zOiBidXR0b25zXCI+XFxuXHQ8L2tub2ItcmFkaW8+XFxuXFxuXHQ8ZGl2IGRhdGEtYmluZD1cImZvcmVhY2g6IHBhbmVsc1wiPlxcblx0XHQ8a25vYi10YWIgZGF0YS1iaW5kPVwidmlzaWJsZTogJHBhcmVudC5zZWxlY3RlZElkeCgpID09ICRpbmRleCgpXCI+XFxuXHRcdFx0PCEtLSBrbyB0ZW1wbGF0ZTogeyBub2RlczogJGRhdGEgfSAtLT48IS0tIC9rbyAtLT5cXG5cdFx0PC9rbm9iLXRhYj5cXG5cdDwvZGl2PlxcbjwvZGl2Pic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG5cclxudmFyIG5leHRUYWJzR3JvdXBJZHggPSAwO1xyXG5cclxuZnVuY3Rpb24gY29udmVydFBhcmFtc1RvT2JqZWN0KHBhcmFtcykge1xyXG5cdHBhcmFtcyA9IHBhcmFtcy5yZXBsYWNlKC8nL2csIFwiXFxcIlwiKTtcclxuXHJcblx0dmFyIHBhcmFtcyA9IHBhcmFtcy5zcGxpdChcIixcIik7XHJcblxyXG5cdHZhciBjb252ZXJ0ZWRQYXJhbXMgPSBbXTtcclxuXHJcblx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgcGFyYW1zLmxlbmd0aDsgaWR4ICs9IDEpIHtcclxuXHRcdHZhciBhY3QgPSBwYXJhbXNbaWR4XTtcclxuXHJcblx0XHRhY3QgPSBhY3QudHJpbSgpO1xyXG5cclxuXHRcdGFjdCA9IGFjdC5zcGxpdChcIjpcIik7XHJcblxyXG5cdFx0aWYgKGFjdC5sZW5ndGggIT09IDIpIHtcclxuXHRcdFx0Y29udGludWU7XHJcblx0XHR9XHJcblxyXG5cdFx0YWN0ID0gXCJcXFwiXCIgKyBhY3RbMF0gKyBcIlxcXCJcIiArIFwiOlwiICsgYWN0WzFdO1xyXG5cdFx0Y29udmVydGVkUGFyYW1zLnB1c2goYWN0KTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBKU09OLnBhcnNlKFwie1wiICsgY29udmVydGVkUGFyYW1zLmpvaW4oXCIsXCIpICsgXCJ9XCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVUYWJzKGNvbmZpZywgY29tcG9uZW50SW5mbykge1xyXG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHRjb21wb25lbnRJbmZvID0gY29tcG9uZW50SW5mbyB8fCB7fTtcclxuXHRjb21wb25lbnRJbmZvLnRlbXBsYXRlTm9kZXMgPSBjb21wb25lbnRJbmZvLnRlbXBsYXRlTm9kZXMgfHwgW107XHJcblxyXG5cdHZhciBkZWZhdWx0VGFiID0gY29uZmlnLmRlZmF1bHRUYWIgfHwgMDtcclxuXHJcblx0dmFyIHZtID0ge307XHJcblxyXG5cdHZhciB0YWJCdXR0b25zID0gW107XHJcblx0dmFyIHRhYlBhbmVscyA9IFtdO1xyXG5cclxuXHR2YXIgdGFiSWR4ID0gMDtcclxuXHJcblx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgY29tcG9uZW50SW5mby50ZW1wbGF0ZU5vZGVzLmxlbmd0aDsgaWR4ICs9IDEpIHtcclxuXHRcdHZhciBhY3RUZW1wbGF0ZU5vZGUgPSBjb21wb25lbnRJbmZvLnRlbXBsYXRlTm9kZXNbaWR4XTtcclxuXHJcblx0XHRpZiAoYWN0VGVtcGxhdGVOb2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09IFwia25vYi10YWJcIikge1xyXG5cdFx0XHRjb250aW51ZTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgdGFiQnV0dG9uRGF0YSA9IGNvbnZlcnRQYXJhbXNUb09iamVjdChhY3RUZW1wbGF0ZU5vZGUuZ2V0QXR0cmlidXRlKFwicGFyYW1zXCIpKTtcclxuXHJcblx0XHR0YWJCdXR0b25EYXRhLnRhYklkeCA9IHRhYklkeDtcclxuXHRcdHRhYklkeCArPSAxO1xyXG5cclxuXHRcdHRhYkJ1dHRvbnMucHVzaCh0YWJCdXR0b25EYXRhKTtcclxuXHJcblx0XHR0YWJQYW5lbHMucHVzaChhY3RUZW1wbGF0ZU5vZGUuY2hpbGROb2Rlcyk7XHJcblx0fVxyXG5cclxuXHRpZiAodGFiUGFuZWxzLmxlbmd0aCA8IDEpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImtub2ItdGFicyBjb21wb25lbnQgc2hvdWxkIGhhdmUgYXQgbGVhc3Qgb25lIGtub2ItdGFiIGNvbXBvbmVudCBhcyBhIGNoaWxkIGNvbXBvbmVudCFcIik7XHJcblx0fVxyXG5cclxuXHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0YWJCdXR0b25zLmxlbmd0aDsgaWR4ICs9IDEpIHtcclxuXHRcdHZhciBhY3QgPSB0YWJCdXR0b25zW2lkeF07XHJcblxyXG5cdFx0aWYgKCFhY3QuaWNvbiAmJiAhYWN0LmxlZnRJY29uICYmICFhY3QucmlnaHRJY29uICYmICFhY3QubGFiZWwpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhlIGNoaWxkIGtub2ItdGFiIGNvbXBvbmVudHMgc2hvdWxkIGhhdmUgcHJvcGVyIHBhcmFtcyAoaWNvbiBhbmQvb3IgbGFiZWwpIGp1c3QgbGlrZSB3aXRoIGJ1dHRvbnMhXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dm0udGFic0dyb3VwID0gXCJ0YWJzR3JvdXBfXCIgKyBuZXh0VGFic0dyb3VwSWR4O1xyXG5cdG5leHRUYWJzR3JvdXBJZHggKz0gMTtcclxuXHJcblx0dm0uc2VsZWN0ZWRJZHggPSBrby5vYnNlcnZhYmxlKGRlZmF1bHRUYWIpO1xyXG5cclxuXHR2bS5idXR0b25zID0gdGFiQnV0dG9ucztcclxuXHR2bS5wYW5lbHMgPSB0YWJQYW5lbHM7XHJcblxyXG5cdHJldHVybiB2bTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVUYWJzO1xyXG4iXX0=
