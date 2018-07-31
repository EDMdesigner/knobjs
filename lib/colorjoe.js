(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory(require('onecolor'));
    }
    else if(typeof define === 'function' && define.amd) {
        define(['onecolor'], factory);
    }
    else {
        root.colorjoe = factory(root.one.color);
    }
}(this, function(onecolor) {
/*! colorjoe - v2.0.0 - Juho Vepsalainen <bebraw@gmail.com> - MIT
https://bebraw.github.com/colorjoe - 2016-08-12 */
/*! dragjs - v0.7.0 - Juho Vepsalainen <bebraw@gmail.com> - MIT
https://bebraw.github.com/dragjs - 2016-08-12 */
var drag = (function() {
    function drag(elem, cbs) {
        if(!elem) {
            console.warn('drag is missing elem!');
            return;
        }

        dragTemplate(elem, cbs, 'touchstart', 'touchmove', 'touchend');
        dragTemplate(elem, cbs, 'mousedown', 'mousemove', 'mouseup');
    }

    function xyslider(o) {
        var twod = div(o['class'] || '', o.parent);
        var pointer = div('pointer', twod);
        div('shape shape1', pointer);
        div('shape shape2', pointer);
        div('bg bg1', twod);
        div('bg bg2', twod);

        drag(twod, attachPointer(o.cbs, pointer));

        return {
            background: twod,
            pointer: pointer
        };
    }

    function slider(o) {
        var oned = div(o['class'], o.parent);
        var pointer = div('pointer', oned);
        div('shape', pointer);
        div('bg', oned);

        drag(oned, attachPointer(o.cbs, pointer));

        return {
            background: oned,
            pointer: pointer
        };
    }

    drag.xyslider = xyslider;
    drag.slider = slider;

    return drag;

    function attachPointer(cbs, pointer) {
        var ret = {};

        for(var n in cbs) {
          ret[n] = wrap(cbs[n]);
        }

        function wrap(fn) {
            return function(p) {
                p.pointer = pointer;
                fn(p);
            };
        }

        return ret;
    }

    // move to elemutils lib?
    function div(klass, p) {
        return e('div', klass, p);
    }

    function e(type, klass, p) {
        var elem = document.createElement(type);
        if(klass) {
          elem.className = klass;
        }
        if(p){
            p.appendChild(elem);
        }

        return elem;
    }

    function dragTemplate(elem, cbs, down, move, up) {
        var dragging = false;

        cbs = getCbs(cbs);

        var beginCb = cbs.begin;
        var changeCb = cbs.change;
        var endCb = cbs.end;

        on(elem, down, function(e) {
            dragging = true;

            var moveHandler = partial(callCb, changeCb, elem);
            function upHandler() {
                dragging = false;

                off(document, move, moveHandler);
                off(document, up, upHandler);

                callCb(endCb, elem, e);
            }

            on(document, move, moveHandler);
            on(document, up, upHandler);

            callCb(beginCb, elem, e);
        });
    }

    function on(elem, evt, handler) {
        elem.addEventListener(evt, handler, false);
    }

    function off(elem, evt, handler) {
      elem.removeEventListener(evt, handler, false);
    }

    function getCbs(cbs) {
        if(!cbs) {
            var initialOffset;
            var initialPos;

            return {
                begin: function(c) {
                    initialOffset = {x: c.elem.offsetLeft, y: c.elem.offsetTop};
                    initialPos = c.cursor;
                },
                change: function(c) {
                    style(c.elem, 'left', (initialOffset.x + c.cursor.x - initialPos.x) + 'px');
                    style(c.elem, 'top', (initialOffset.y + c.cursor.y - initialPos.y) + 'px');
                },
                end: empty
            };
        }
        else {
            return {
                begin: cbs.begin || empty,
                change: cbs.change || empty,
                end: cbs.end || empty
            };
        }
    }

    // TODO: set draggable class (handy for fx)
    function style(e, prop, value) {
        e.style[prop] = value;
    }

    function empty() {}

    function callCb(cb, elem, e) {
        e.preventDefault();

        var offset = findPos(elem);
        var width = elem.clientWidth;
        var height = elem.clientHeight;
        var cursor = {
            x: cursorX(elem, e),
            y: cursorY(elem, e)
        };
        var x = (cursor.x - offset.x) / width;
        var y = (cursor.y - offset.y) / height;

        cb({
            x: isNaN(x)? 0: x,
            y: isNaN(y)? 0: y,
            cursor: cursor,
            elem: elem,
            e: e
        });
    }

    // http://stackoverflow.com/questions/4394747/javascript-curry-function
    function partial(fn) {
        var slice = Array.prototype.slice;
        var args = slice.apply(arguments, [1]);

        return function() {
            return fn.apply(null, args.concat(slice.apply(arguments)));
        };
    }

    // http://www.quirksmode.org/js/findpos.html
    function findPos(e) {
        var r = e.getBoundingClientRect();

        return {
            x: r.left,
            y: r.top
        };
    }

    // http://javascript.about.com/library/blmousepos.htm
    function cursorX(elem, evt) {
        var evtPos = evt.touches ? evt.touches[evt.touches.length -1] : evt;
        return evtPos.clientX;
    }
    function cursorY(elem, evt) {
        var evtPos = evt.touches ? evt.touches[evt.touches.length -1] : evt;
        return evtPos.clientY;
    }
})();
var div = partial(e, 'div');

function e(type, klass, p) {
    var elem = document.createElement(type);
    elem.className = klass;
    p.appendChild(elem);

    return elem;
}

// http://stackoverflow.com/questions/4394747/javascript-curry-function
function partial(fn) {
    var slice = Array.prototype.slice;
    var args = slice.apply(arguments, [1]);

    return function() {
        return fn.apply(null, args.concat(slice.apply(arguments)));
    };
}

function labelInput(klass, n, p, maxLen) {
    var id = "colorPickerInput" + Math.floor(Math.random() * 1001);
    var d = div(klass, p);
    var l = label(n, d, id);
    var i = input('text', d, maxLen, id);

    return {
        label: l, 
        input: i
    };
}

function label(c, p, id) {
    var elem = e('label', '', p);
    elem.innerHTML = c;

    if (id) {
        elem.setAttribute('for', id);
    }

    return elem;
}

function input(t, p, maxLen, id) {
    var elem = e('input', '', p);
    elem.type = t;

    if(maxLen) { 
        elem.maxLength = maxLen;
    }

    if (id) {
        elem.setAttribute('id', id);
    }

    if(maxLen) {
        elem.maxLength = maxLen;
    }

    return elem;
}

function X(p, a) {
    p.style.left = clamp(a * 100, 0, 100) + '%';
}
function Y(p, a) {
    p.style.top = clamp(a * 100, 0, 100) + '%';
}
function BG(e, c) {
    e.style.background = c;
}

function clamp(a, minValue, maxValue) {
    return Math.min(Math.max(a, minValue), maxValue);
}

var utils = {
    clamp: clamp,
    e: e,
    div: div,
    partial: partial,
    labelInput: labelInput,
    X: X,
    Y: Y,
    BG: BG
};  
function currentColor(p) {
    var e1 = utils.div('currentColorContainer', p);
    var e = utils.div('currentColor', e1);

    return {
        change: function(col) {
            utils.BG(e, col.cssa());
        }
    };
}

function fields(p, joe, o) {
    var cs = o.space;
    var fac = o.limit || 255;
    var fix = o.fix >= 0? o.fix: 0;
    var inputLen = ('' + fac).length + fix;
    inputLen = fix? inputLen + 1: inputLen;

    var initials = cs.split('');
    var useAlpha = cs[cs.length - 1] == 'A';
    cs = useAlpha? cs.slice(0, -1): cs;

    if(['RGB', 'HSL', 'HSV', 'CMYK'].indexOf(cs) < 0) {
        return console.warn('Invalid field names', cs);
    }

    var c = utils.div('colorFields', p);
    var elems = initials.map(function(n) {
        n = n.toLowerCase();

        var e = utils.labelInput('color ' + n, n, c, inputLen);
        e.input.onblur = done;
        e.input.onkeydown = validate;
        e.input.onkeyup = update;

        return {
            name: n, 
            e: e
        };
    });

    function done() {
        joe.done();
    }

    function validate(e) {
        if (!(e.ctrlKey || e.altKey) && /^[a-zA-Z]$/.test(e.key)) {
            e.preventDefault();
        }
    }

    function update() {
        var col = [cs];

        elems.forEach(function(o) {col.push(o.e.input.value / fac);});

        if(!useAlpha) {
            col.push(joe.getAlpha());
        }

        joe.set(col);
    }

    return {
        change: function(col) {
            elems.forEach(function(o) {
                o.e.input.value = (col[o.name]() * fac).toFixed(fix);
            });
        }
    };
}

function alpha(p, joe) {
    var e = drag.slider({
        parent: p,
        'class': 'oned alpha',
        cbs: {
            begin: change,
            change: change,
            end: done
        }
    });

    function done() {
        joe.done();
    }

    function change(p) {
        var val = utils.clamp(p.y, 0, 1);

        utils.Y(p.pointer, val);
        joe.setAlpha(1 - val);
    }

    return {
        change: function(col) {
            utils.Y(e.pointer, 1 - col.alpha());
        }
    };
}

function hex(p, joe, o) {
    var e = utils.labelInput('hex', o.label || '', p, 7);
    e.input.value = '#';

    e.input.onkeyup = function(elem) {
        var key = elem.keyCode || elem.which;
        var val = elem.target.value;
        val = val[0] == '#'? val: '#' + val;
        val = pad(val, 7, '0');

        if(key == 13) {
            joe.set(val);
        }
    };

    e.input.onblur = function(elem) {
        joe.set(elem.target.value);
        joe.done();
    };

    return {
        change: function(col) {
            e.input.value = e.input.value[0] == '#'? '#': '';
            e.input.value += col.hex().slice(1);
        }
    };
}

function close(p, joe, o) {
    var elem = utils.e('a', o['class'] || 'close', p);
    elem.href = '#';
    elem.innerHTML = o.label || 'Close';

    elem.onclick = function(e) {
        e.preventDefault();

        joe.hide();
    };
}

function pad(a, n, c) {
    var ret = a;

    for(var i = a.length; i < n; i++) {
        ret += c;
    }

    return ret;
}

var extras = {
    currentColor: currentColor,
    fields: fields,
    hex: hex,
    alpha: alpha,
    close: close
};
var colorjoe = function(cbs) {
    if(!all(isFunction, [cbs.init, cbs.xy, cbs.z])) {
        return console.warn('colorjoe: missing cb');
    }

    return function(element, initialColor, extras) {
        return setup({
            e: element,
            color: initialColor,
            cbs: cbs,
            extras: extras
        });
    };
};

/* pickers */
colorjoe.rgb = colorjoe({
    init: function(col, xy, z) {
        var ret = onecolor(col).hsv();

        this.xy(ret, {x: ret.saturation(), y: 1 - ret.value()}, xy, z);
        this.z(ret, ret.hue(), xy, z);

        return ret;
    },
    xy: function(col, p, xy) {
        utils.X(xy.pointer, p.x);
        utils.Y(xy.pointer, p.y);

        return col.saturation(p.x).value(1 - p.y);
    },
    z: function(col, v, xy, z) {
        utils.Y(z.pointer, v);
        RGB_BG(xy.background, v);

        return col.hue(v);
    }
});

colorjoe.hsl = colorjoe({
    init: function(col, xy, z) {
        var ret = onecolor(col).hsl();

        this.xy(ret, {x: ret.hue(), y: 1 - ret.saturation()}, xy, z);
        this.z(ret, 1 - ret.lightness(), xy, z);

        return ret;
    },
    xy: function(col, p, xy, z) {
        utils.X(xy.pointer, p.x);
        utils.Y(xy.pointer, p.y);
        RGB_BG(z.background, p.x);

        return col.hue(p.x).saturation(1 - p.y);
    },
    z: function(col, v, xy, z) {
        utils.Y(z.pointer, v);

        return col.lightness(1 - v);
    }
});

colorjoe._extras = {};

colorjoe.registerExtra = function(name, fn) {
    if(name in colorjoe._extras) {
        console.warn('Extra "' + name + '"has been registered already!');
    }

    colorjoe._extras[name] = fn;
};

for(var k in extras) {
    colorjoe.registerExtra(k, extras[k]);
}

function RGB_BG(e, h) {
    utils.BG(e, new onecolor.HSV(h, 1, 1).cssa());
}

function setup(o) {
    if(!o.e) {
        return console.warn('colorjoe: missing element');
    }

    var e = isString(o.e)? document.getElementById(o.e): o.e;
    if(e){
        e.className = 'colorPicker';
    }

    var cbs = o.cbs;

    var xy = drag.xyslider({
        parent: e,
        'class': 'twod',
        cbs: {
            begin: changeXY,
            change: changeXY,
            end: done
        }
    });

    function changeXY(p) {
        col = cbs.xy(col, {
            x: utils.clamp(p.x, 0, 1),
            y: utils.clamp(p.y, 0, 1)
        }, xy, z);
        changed();
    }

    var z = drag.slider({
        parent: e,
        'class': 'oned',
        cbs: {
            begin: changeZ,
            change: changeZ,
            end: done
        }
    });

    function changeZ(p) {
        col = cbs.z(col, utils.clamp(p.y, 0, 1), xy, z);
        changed();
    }

    // Initial color
    var previous = getColor(o.color);
    var col = cbs.init(previous, xy, z);
    var listeners = {change: [], done: []};

    function changed(skip) {
        skip = isArray(skip)? skip: [];

        var li = listeners.change;
        var v;

        for(var i = 0, len = li.length; i < len; i++) {
            v = li[i];
            if(skip.indexOf(v.name) == -1) {
                v.fn(col);
            }
        }
    }

    function done() {
        // Do not call done callback if the color did not change
        if (previous.equals(col)) {
            return;
        }
        
        for(var i = 0, len = listeners.done.length; i < len; i++) {
            listeners.done[i].fn(col);
        }

        previous = col;
    }

    var ob = {
        e: e,
        done: function() {
            done();

            return this;
        },
        update: function(skip) {
            changed(skip);

            return this;
        },
        hide: function() {
            e.style.display = 'none';

            return this;
        },
        show: function() {
            e.style.display = '';

            return this;
        },
        get: function() {
            return col;
        },
        set: function(c) {
            var oldCol = this.get();
            col = cbs.init(getColor(c), xy, z);

            if(!oldCol.equals(col) && col._alpha !== 0) {
                this.update();
            }
            console.log("gcis alpha", this.getAlpha());
            return this;
        },
        getAlpha: function() {
            return col.alpha();
        },
        setAlpha: function(v) {
            col = col.alpha(v);

            this.update();

            return this;
        },
        on: function(evt, cb, name) {
            if(evt == 'change' || evt == 'done') {
                listeners[evt].push({name: name, fn: cb});
            }
            else {
                console.warn('Passed invalid evt name "' + evt + '" to colorjoe.on');
            }

            return this;
        },
        removeAllListeners: function(evt) {
            if (evt) {
                delete listeners[evt];
            }
            else {
                for(var key in listeners) {
                    delete listeners[key];
                }
            }

            return this;
        }
    };

    setupExtras(e, ob, o.extras);
    changed();

    return ob;
}

function getColor(c) {
    if(!isDefined(c)) {
        return onecolor('#000');
    }
    if(c.isColor) {
        return c;
    }

    var ret = onecolor(c);
    
    if(ret) {
        return ret;
    }

    if(isDefined(c)) {
        console.warn('Passed invalid color to colorjoe, using black instead');
    } 

    return onecolor('#000');
}

function setupExtras(p, joe, extras) {
    if(!extras) {
        return;
    }

    var c = utils.div('extras', p);
    var cbs;
    var name;
    var params;

    extras.forEach(function(e, i) {
        if(isArray(e)) {
            name = e[0];
            params = e.length > 1? e[1]: {};
        }
        else {
            name = e;
            params = {};
        }
        var extra = name in colorjoe._extras? colorjoe._extras[name]: null;

        if(extra) {
            cbs = extra(c, extraProxy(joe, name + i), params);
            for(var k in cbs) {
                joe.on(k, cbs[k], name);
            }
        }
    });
}

function extraProxy(joe, name) {
    var ret = copy(joe);

    ret.update = function() {
        joe.update([name]);
    };

    return ret;
}

function copy(o) {
    // returns a shallow copy
    var ret = {};

    for(var k in o) {
        ret[k] = o[k];
    }

    return ret;
}

function all(cb, a) {
    return a.map(cb).filter(id).length == a.length;
}

function isArray(o) {
    return Object.prototype.toString.call(o) === "[object Array]";
}
function isString(o) {
    return typeof(o) === 'string';
}
function isDefined(input) {
    return typeof input !== "undefined";
}
function isFunction(input) {
    return typeof input === "function";
}
function id(a) {
    return a;
}
    return colorjoe;
}));
