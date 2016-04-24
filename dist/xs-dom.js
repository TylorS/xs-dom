(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.xsDom = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createElement = createElement;
exports.createElementNS = createElementNS;
exports.createTextNode = createTextNode;
exports.insertBefore = insertBefore;
exports.removeChild = removeChild;
exports.appendChild = appendChild;
exports.parentNode = parentNode;
exports.nextSibling = nextSibling;
exports.tagName = tagName;
exports.setTextContent = setTextContent;
function createElement(tagName) {
    return document.createElement(tagName);
}
function createElementNS(namespaceURI, qualifiedName) {
    return document.createElementNS(namespaceURI, qualifiedName);
}
function createTextNode(text) {
    return document.createTextNode(text);
}
function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}
function removeChild(node, child) {
    node.removeChild(child);
}
function appendChild(node, child) {
    node.appendChild(child);
}
function parentNode(node) {
    return node.parentElement;
}
function nextSibling(node) {
    return node.nextSibling;
}
function tagName(node) {
    return node.tagName;
}
function setTextContent(node, text) {
    node.textContent = text;
}


},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _hyperscript = require('./hyperscript');

function isValidString(param) {
    return typeof param === 'string' && param.length > 0;
}
function isSelector(param) {
    return isValidString(param) && (param[0] === '.' || param[0] === '#');
}
function createTagFunction(tagName) {
    return function hyperscript(first, b, c) {
        if (isSelector(first)) {
            if (!!b && !!c) {
                return (0, _hyperscript.h)(tagName + first, b, c);
            } else if (!!b) {
                return (0, _hyperscript.h)(tagName + first, b);
            } else {
                return (0, _hyperscript.h)(tagName + first, {});
            }
        } else if (!!b) {
            return (0, _hyperscript.h)(tagName, first, b);
        } else if (!!first) {
            return (0, _hyperscript.h)(tagName, first);
        } else {
            return (0, _hyperscript.h)(tagName, {});
        }
    };
}
var TAG_NAMES = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'dd', 'del', 'dfn', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'sup', 'svg', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'u', 'ul', 'video', 'progress'];
var exported = { TAG_NAMES: TAG_NAMES, isSelector: isSelector, createTagFunction: createTagFunction };
TAG_NAMES.forEach(function (n) {
    exported[n] = createTagFunction(n);
});
exports.default = exported;


},{"./hyperscript":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function isObservable(x) {
    return typeof x.addListener === 'function';
}
function addNSToObservable(vNode) {
    addNS(vNode.data, vNode.children);
    return vNode;
}
function addNS(data, children) {
    data.ns = 'http://www.w3.org/2000/svg';
    if (children !== void 0 && Array.isArray(children)) {
        for (var i = 0; i < children.length; ++i) {
            if (isObservable(children[i])) {
                children[i] = children[i].map(addNSToObservable);
            } else {
                addNS(children[i].data, children[i].children);
            }
        }
    }
}
function h(sel, b, c) {
    var data = {};
    var children = void 0;
    var text = void 0;
    var i = void 0;
    if (arguments.length === 3) {
        data = b;
        if (Array.isArray(c)) {
            children = c;
        } else if (typeof c === 'string' || typeof c === 'number') {
            text = c;
        }
    } else if (arguments.length === 2) {
        if (Array.isArray(b)) {
            children = b;
        } else if (typeof b === 'string' || typeof b === 'number') {
            text = b;
        } else {
            data = b;
        }
    }
    if (Array.isArray(children)) {
        for (i = 0; i < children.length; ++i) {
            if (typeof children[i] === 'string' || typeof children[i] === 'number') {
                children[i] = { text: children[i] };
            }
        }
    }
    if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g') {
        addNS(data, children);
    }
    return { sel: sel, data: data, children: children, text: text };
}
;
exports.h = h;


},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.thunk = thunk;

var _hyperscript = require('./hyperscript');

function copyToThunk(vNode, thunk) {
    thunk.elm = vNode.elm;
    vNode.data.fn = thunk.data.fn;
    vNode.data.args = thunk.data.args;
    thunk.data = vNode.data;
    thunk.children = vNode.children;
    thunk.text = vNode.text;
    thunk.elm = vNode.elm;
}
function init(thunk) {
    var data = thunk.data;
    var vNode = data.fn.apply(void 0, data.args);
    copyToThunk(vNode, thunk);
}
function prepatch(oldVNode, thunk) {
    var old = oldVNode.data;
    var cur = thunk.data;
    var oldArgs = old.args;
    var args = cur.args;
    if (old.fn !== cur.fn || oldArgs.length !== args.length) {
        copyToThunk(cur.fn.apply(void 0, args), thunk);
    }
    for (var i = 0; i < args.length; ++i) {
        if (oldArgs[i] !== args[i]) {
            copyToThunk(cur.fn.apply(void 0, args), thunk);
            return;
        }
    }
    copyToThunk(oldVNode, thunk);
}
function thunk(selector, key, fn, args) {
    return (0, _hyperscript.h)(selector, { key: key, hook: { init: init, prepatch: prepatch }, fn: fn, args: args }, []);
}


},{"./hyperscript":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.video = exports.ul = exports.u = exports.tr = exports.title = exports.thead = exports.th = exports.tfoot = exports.textarea = exports.td = exports.tbody = exports.table = exports.svg = exports.sup = exports.sub = exports.style = exports.strong = exports.span = exports.source = exports.small = exports.select = exports.section = exports.script = exports.samp = exports.s = exports.ruby = exports.rt = exports.rp = exports.q = exports.pre = exports.param = exports.p = exports.option = exports.optgroup = exports.ol = exports.object = exports.noscript = exports.nav = exports.meta = exports.menu = exports.mark = exports.map = exports.main = exports.link = exports.li = exports.legend = exports.label = exports.keygen = exports.kbd = exports.ins = exports.input = exports.img = exports.iframe = exports.i = exports.html = exports.hr = exports.hgroup = exports.header = exports.head = exports.h6 = exports.h5 = exports.h4 = exports.h3 = exports.h2 = exports.h1 = exports.form = exports.footer = exports.figure = exports.figcaption = exports.fieldset = exports.embed = exports.em = exports.dt = exports.dl = exports.div = exports.dir = exports.dfn = exports.del = exports.dd = exports.colgroup = exports.col = exports.code = exports.cite = exports.caption = exports.canvas = exports.button = exports.br = exports.body = exports.blockquote = exports.bdo = exports.bdi = exports.base = exports.b = exports.audio = exports.aside = exports.article = exports.area = exports.address = exports.abbr = exports.a = exports.h = exports.thunk = undefined;

var _thunk = require('./hyperscript/thunk');

Object.defineProperty(exports, 'thunk', {
  enumerable: true,
  get: function get() {
    return _thunk.thunk;
  }
});

var _xsDom = require('./xs-dom');

Object.keys(_xsDom).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _xsDom[key];
    }
  });
});

var _hyperscript = require('./hyperscript/hyperscript');

var _hyperscriptHelpers = require('./hyperscript/hyperscript-helpers');

var _hyperscriptHelpers2 = _interopRequireDefault(_hyperscriptHelpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var a = _hyperscriptHelpers2.default.a;
var abbr = _hyperscriptHelpers2.default.abbr;
var address = _hyperscriptHelpers2.default.address;
var area = _hyperscriptHelpers2.default.area;
var article = _hyperscriptHelpers2.default.article;
var aside = _hyperscriptHelpers2.default.aside;
var audio = _hyperscriptHelpers2.default.audio;
var b = _hyperscriptHelpers2.default.b;
var base = _hyperscriptHelpers2.default.base;
var bdi = _hyperscriptHelpers2.default.bdi;
var bdo = _hyperscriptHelpers2.default.bdo;
var blockquote = _hyperscriptHelpers2.default.blockquote;
var body = _hyperscriptHelpers2.default.body;
var br = _hyperscriptHelpers2.default.br;
var button = _hyperscriptHelpers2.default.button;
var canvas = _hyperscriptHelpers2.default.canvas;
var caption = _hyperscriptHelpers2.default.caption;
var cite = _hyperscriptHelpers2.default.cite;
var code = _hyperscriptHelpers2.default.code;
var col = _hyperscriptHelpers2.default.col;
var colgroup = _hyperscriptHelpers2.default.colgroup;
var dd = _hyperscriptHelpers2.default.dd;
var del = _hyperscriptHelpers2.default.del;
var dfn = _hyperscriptHelpers2.default.dfn;
var dir = _hyperscriptHelpers2.default.dir;
var div = _hyperscriptHelpers2.default.div;
var dl = _hyperscriptHelpers2.default.dl;
var dt = _hyperscriptHelpers2.default.dt;
var em = _hyperscriptHelpers2.default.em;
var embed = _hyperscriptHelpers2.default.embed;
var fieldset = _hyperscriptHelpers2.default.fieldset;
var figcaption = _hyperscriptHelpers2.default.figcaption;
var figure = _hyperscriptHelpers2.default.figure;
var footer = _hyperscriptHelpers2.default.footer;
var form = _hyperscriptHelpers2.default.form;
var h1 = _hyperscriptHelpers2.default.h1;
var h2 = _hyperscriptHelpers2.default.h2;
var h3 = _hyperscriptHelpers2.default.h3;
var h4 = _hyperscriptHelpers2.default.h4;
var h5 = _hyperscriptHelpers2.default.h5;
var h6 = _hyperscriptHelpers2.default.h6;
var head = _hyperscriptHelpers2.default.head;
var header = _hyperscriptHelpers2.default.header;
var hgroup = _hyperscriptHelpers2.default.hgroup;
var hr = _hyperscriptHelpers2.default.hr;
var html = _hyperscriptHelpers2.default.html;
var i = _hyperscriptHelpers2.default.i;
var iframe = _hyperscriptHelpers2.default.iframe;
var img = _hyperscriptHelpers2.default.img;
var input = _hyperscriptHelpers2.default.input;
var ins = _hyperscriptHelpers2.default.ins;
var kbd = _hyperscriptHelpers2.default.kbd;
var keygen = _hyperscriptHelpers2.default.keygen;
var label = _hyperscriptHelpers2.default.label;
var legend = _hyperscriptHelpers2.default.legend;
var li = _hyperscriptHelpers2.default.li;
var link = _hyperscriptHelpers2.default.link;
var main = _hyperscriptHelpers2.default.main;
var map = _hyperscriptHelpers2.default.map;
var mark = _hyperscriptHelpers2.default.mark;
var menu = _hyperscriptHelpers2.default.menu;
var meta = _hyperscriptHelpers2.default.meta;
var nav = _hyperscriptHelpers2.default.nav;
var noscript = _hyperscriptHelpers2.default.noscript;
var object = _hyperscriptHelpers2.default.object;
var ol = _hyperscriptHelpers2.default.ol;
var optgroup = _hyperscriptHelpers2.default.optgroup;
var option = _hyperscriptHelpers2.default.option;
var p = _hyperscriptHelpers2.default.p;
var param = _hyperscriptHelpers2.default.param;
var pre = _hyperscriptHelpers2.default.pre;
var q = _hyperscriptHelpers2.default.q;
var rp = _hyperscriptHelpers2.default.rp;
var rt = _hyperscriptHelpers2.default.rt;
var ruby = _hyperscriptHelpers2.default.ruby;
var s = _hyperscriptHelpers2.default.s;
var samp = _hyperscriptHelpers2.default.samp;
var script = _hyperscriptHelpers2.default.script;
var section = _hyperscriptHelpers2.default.section;
var select = _hyperscriptHelpers2.default.select;
var small = _hyperscriptHelpers2.default.small;
var source = _hyperscriptHelpers2.default.source;
var span = _hyperscriptHelpers2.default.span;
var strong = _hyperscriptHelpers2.default.strong;
var style = _hyperscriptHelpers2.default.style;
var sub = _hyperscriptHelpers2.default.sub;
var sup = _hyperscriptHelpers2.default.sup;
var svg = _hyperscriptHelpers2.default.svg;
var table = _hyperscriptHelpers2.default.table;
var tbody = _hyperscriptHelpers2.default.tbody;
var td = _hyperscriptHelpers2.default.td;
var textarea = _hyperscriptHelpers2.default.textarea;
var tfoot = _hyperscriptHelpers2.default.tfoot;
var th = _hyperscriptHelpers2.default.th;
var thead = _hyperscriptHelpers2.default.thead;
var title = _hyperscriptHelpers2.default.title;
var tr = _hyperscriptHelpers2.default.tr;
var u = _hyperscriptHelpers2.default.u;
var ul = _hyperscriptHelpers2.default.ul;
var video = _hyperscriptHelpers2.default.video;
exports.h = _hyperscript.h;
exports.a = a;
exports.abbr = abbr;
exports.address = address;
exports.area = area;
exports.article = article;
exports.aside = aside;
exports.audio = audio;
exports.b = b;
exports.base = base;
exports.bdi = bdi;
exports.bdo = bdo;
exports.blockquote = blockquote;
exports.body = body;
exports.br = br;
exports.button = button;
exports.canvas = canvas;
exports.caption = caption;
exports.cite = cite;
exports.code = code;
exports.col = col;
exports.colgroup = colgroup;
exports.dd = dd;
exports.del = del;
exports.dfn = dfn;
exports.dir = dir;
exports.div = div;
exports.dl = dl;
exports.dt = dt;
exports.em = em;
exports.embed = embed;
exports.fieldset = fieldset;
exports.figcaption = figcaption;
exports.figure = figure;
exports.footer = footer;
exports.form = form;
exports.h1 = h1;
exports.h2 = h2;
exports.h3 = h3;
exports.h4 = h4;
exports.h5 = h5;
exports.h6 = h6;
exports.head = head;
exports.header = header;
exports.hgroup = hgroup;
exports.hr = hr;
exports.html = html;
exports.i = i;
exports.iframe = iframe;
exports.img = img;
exports.input = input;
exports.ins = ins;
exports.kbd = kbd;
exports.keygen = keygen;
exports.label = label;
exports.legend = legend;
exports.li = li;
exports.link = link;
exports.main = main;
exports.map = map;
exports.mark = mark;
exports.menu = menu;
exports.meta = meta;
exports.nav = nav;
exports.noscript = noscript;
exports.object = object;
exports.ol = ol;
exports.optgroup = optgroup;
exports.option = option;
exports.p = p;
exports.param = param;
exports.pre = pre;
exports.q = q;
exports.rp = rp;
exports.rt = rt;
exports.ruby = ruby;
exports.s = s;
exports.samp = samp;
exports.script = script;
exports.section = section;
exports.select = select;
exports.small = small;
exports.source = source;
exports.span = span;
exports.strong = strong;
exports.style = style;
exports.sub = sub;
exports.sup = sup;
exports.svg = svg;
exports.table = table;
exports.tbody = tbody;
exports.td = td;
exports.textarea = textarea;
exports.tfoot = tfoot;
exports.th = th;
exports.thead = thead;
exports.title = title;
exports.tr = tr;
exports.u = u;
exports.ul = ul;


exports.video = video;

},{"./hyperscript/hyperscript":3,"./hyperscript/hyperscript-helpers":2,"./hyperscript/thunk":4,"./xs-dom":8}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _parseSelector = require('./parseSelector');

Object.defineProperty(exports, 'parseSelector', {
    enumerable: true,
    get: function get() {
        return _parseSelector.parseSelector;
    }
});
exports.isDef = isDef;
exports.isUndef = isUndef;
exports.emptyVNode = emptyVNode;
exports.sameVNode = sameVNode;
exports.createKeyToOldIdx = createKeyToOldIdx;
function isDef(x) {
    return typeof x !== 'undefined';
}
function isUndef(x) {
    return typeof x === 'undefined';
}
function emptyVNode() {
    return { sel: '', data: {}, children: [], key: void 0, text: void 0 };
}
function sameVNode(vNode1, vNode2) {
    return vNode1.key === vNode2.key && vNode1.sel === vNode2.sel;
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
    var map = {};
    var key = void 0;
    for (var i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key;
        if (isDef(key)) map[key] = i;
    }
    return map;
}


},{"./parseSelector":7}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseSelector = parseSelector;
var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;
function parseSelector() {
    var selector = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

    var tagName = void 0;
    var id = "";
    var classes = [];
    var tagParts = selector.split(classIdSplit);
    if (notClassId.test(tagParts[1]) || selector === "") {
        tagName = "div";
    }
    var part = void 0;
    var type = void 0;
    var i = void 0;
    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];
        if (!part) {
            continue;
        }
        type = part.charAt(0);
        if (!tagName) {
            tagName = part;
        } else if (type === ".") {
            classes.push(part.substring(1, part.length));
        } else if (type === "#") {
            id = part.substring(1, part.length);
        }
    }
    return {
        tagName: tagName,
        id: id,
        className: classes.join(" ")
    };
}


},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.init = init;

var _dom = require('./api/dom');

var api = _interopRequireWildcard(_dom);

var _index = require('./util/index');

var util = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
function registerModules(modules) {
    var i = void 0;
    var j = void 0;
    var callbacks = {};
    for (i = 0; i < hooks.length; ++i) {
        callbacks[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
            if (modules[j][hooks[i]] !== void 0) {
                callbacks[hooks[i]].push({ context: modules[j], fn: modules[j][hooks[i]] });
            }
        }
    }
    return callbacks;
}
function emptyVNodeAt(elm) {
    return {
        sel: api.tagName(elm).toLowerCase(),
        data: {},
        children: [],
        text: void 0,
        key: void 0,
        elm: elm
    };
}
function createRemoveCallback(childElm, listeners) {
    return function () {
        if (--listeners === 0) {
            var parent = api.parentNode(childElm);
            api.removeChild(parent, childElm);
        }
    };
}
function init(modules) {
    var callbacks = registerModules(modules);
    function createElement(vNode, insertedVNodeQueue) {
        var i = void 0;
        var elm = void 0;
        var sel = vNode.sel;
        var children = vNode.children;
        var text = vNode.text;
        var data = vNode.data;

        if (util.isDef(data)) {
            if (util.isDef(i = data.hook) && util.isDef(i = i.init)) {
                i(vNode);
                data = vNode.data;
            }
        }
        if (util.isDef(sel)) {
            var _util$parseSelector = util.parseSelector(sel);

            var tagName = _util$parseSelector.tagName;
            var id = _util$parseSelector.id;
            var className = _util$parseSelector.className;

            elm = vNode.elm = util.isDef(data) && util.isDef(i = data.ns) ? api.createElementNS(i, tagName) : api.createElement(tagName);
            if (id) {
                elm.id = id;
            }
            if (className) {
                elm.className = className;
            }
            if (Array.isArray(children)) {
                for (i = 0; i < children.length; ++i) {
                    api.appendChild(elm, createElement(children[i], insertedVNodeQueue));
                }
            } else if (typeof text === 'string' || typeof text === 'number') {
                api.appendChild(elm, api.createTextNode(text));
            }
            for (i = 0; i < callbacks.create.length; ++i) {
                var _callbacks$create$i = callbacks.create[i];
                var context = _callbacks$create$i.context;
                var fn = _callbacks$create$i.fn;

                fn.apply(context, [util.emptyVNode(), vNode]);
            }
            i = vNode.data.hook;
            if (util.isDef(i)) {
                if (i.create) {
                    i.create(util.emptyVNode(), vNode);
                }
                if (i.insert) {
                    insertedVNodeQueue.push(vNode);
                }
            }
        } else {
            elm = vNode.elm = api.createTextNode(text);
        }
        return vNode.elm;
    }
    function addVNodes(parentElm, before, vNodes, startIdx, endIdx, insertedVNodeQueue) {
        for (; startIdx < endIdx; ++startIdx) {
            api.insertBefore(parentElm, createElement(vNodes[startIdx], insertedVNodeQueue), before);
        }
    }
    function invokeDestroyHook(vNode) {
        var i = void 0;
        var j = void 0;
        var data = vNode.data;
        var children = vNode.children;

        if (util.isDef(i = data.hook) && util.isDef(i = i.destroy)) {
            i(vNode);
        }
        for (i = 0; i < callbacks.destroy.length; ++i) {
            var _callbacks$destroy$i = callbacks.destroy[i];
            var context = _callbacks$destroy$i.context;
            var fn = _callbacks$destroy$i.fn;

            fn.apply(context, [vNode]);
        }
        if (util.isDef(i = children)) {
            for (j = 0; j < children.length; ++j) {
                invokeDestroyHook(children[j]);
            }
        }
    }
    function removeVNodes(parentElm, vNodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
            var i = void 0;
            var listeners = void 0;
            var remove = void 0;
            var currentVNode = vNodes[startIdx];
            if (util.isDef(currentVNode)) {
                if (util.isDef(currentVNode.sel)) {
                    invokeDestroyHook(currentVNode);
                    listeners = callbacks.remove.length + 1;
                    remove = createRemoveCallback(currentVNode.elm, listeners);
                    for (i = 0; i < callbacks.remove.length; ++i) {
                        var _callbacks$remove$i = callbacks.remove[i];
                        var context = _callbacks$remove$i.context;
                        var fn = _callbacks$remove$i.fn;

                        fn.apply(context, [currentVNode, remove]);
                    }
                    if (util.isDef(i = currentVNode.data) && util.isDef(i = i.hook) && util.isDef(i = i.remove)) {
                        i(currentVNode, remove);
                    } else {
                        remove();
                    }
                } else {
                    api.removeChild(parentElm, currentVNode.elm);
                }
            }
        }
    }
    function updateChildren(parentElm, oldChildren, newChildren, insertedVNodeQueue) {
        var oldStartIdx = 0;
        var newStartIdx = 0;
        var oldEndIdx = oldChildren.length - 1;
        var oldStartVNode = oldChildren[0];
        var oldEndVNode = oldChildren[oldEndIdx];
        var newEndIdx = newChildren.length - 1;
        var newStartVNode = newChildren[0];
        var newEndVNode = [newEndIdx];
        var oldKeyToIdx = void 0;
        var idxInOld = void 0;
        var elmToMove = void 0;
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (util.isUndef(oldStartVNode)) {
                oldStartVNode = oldChildren[++oldStartIdx]; // VNode has been moved left;
            } else if (util.isUndef(oldEndVNode)) {
                    oldEndVNode = oldChildren[--oldEndIdx];
                } else if (util.sameVNode(oldStartVNode, newStartVNode)) {
                    patchVNode(oldStartVNode, newStartVNode, insertedVNodeQueue);
                    oldStartVNode = oldChildren[--oldEndIdx];
                    newStartVNode = newChildren[++newStartIdx];
                } else if (util.sameVNode(oldEndVNode, newEndVNode)) {
                    patchVNode(oldEndVNode, newEndVNode, insertedVNodeQueue);
                    oldEndVNode = oldChildren[--oldEndIdx];
                    newEndVNode = newChildren[--newEndIdx];
                } else if (util.sameVNode(oldStartVNode, newEndVNode)) {
                    api.insertBefore(parentElm, oldStartVNode.elm, api.nextSibling(oldEndVNode.elm));
                    oldStartVNode = oldChildren[++oldStartIdx];
                    newEndVNode = newChildren[--newEndIdx];
                } else if (util.sameVNode(oldEndVNode, newStartVNode)) {
                    patchVNode(oldEndVNode, newStartVNode, insertedVNodeQueue);
                    api.insertBefore(parentElm, oldEndVNode.elm, oldStartVNode.elm);
                    oldEndVNode = oldChildren[--oldEndIdx];
                    newStartVNode = newChildren[++newStartIdx];
                } else {
                    if (util.isUndef(oldKeyToIdx)) {
                        oldKeyToIdx = util.createKeyToOldIdx(oldChildren, oldStartIdx, oldEndIdx);
                    }
                    idxInOld = oldKeyToIdx[newStartVNode.key];
                    if (util.isUndef(idxInOld)) {
                        api.insertBefore(parentElm, createElement(newStartVNode, insertedVNodeQueue), oldStartVNode.elm);
                        newStartVNode = newChildren[++newStartIdx];
                    } else {
                        elmToMove = oldChildren[idxInOld];
                        patchVNode(elmToMove, newStartVNode, insertedVNodeQueue);
                        oldChildren[idxInOld] = void 0;
                        api.insertBefore(parentElm, elmToMove.elm, oldStartVNode.elm);
                        newStartVNode = newChildren[++newStartIdx];
                    }
                }
        }
    }
    function patchVNode(oldVNode, vNode, insertedVNodeQueue) {
        var i = void 0;
        var hook = void 0;
        if (util.isDef(i = vNode.data) && util.isDef(hook = i.hook) && util.isDef(i = hook.prepatch)) {
            i(oldVNode, vNode);
        }
        var elm = vNode.elm = oldVNode.elm;
        var oldChildren = oldVNode.children;
        var children = vNode.children;
        var data = vNode.data;
        var text = vNode.text;

        if (oldVNode === vNode) return;
        if (!util.sameVNode(oldVNode, vNode)) {
            var parentElm = api.parentNode(oldVNode.elm);
            elm = createElement(vNode, insertedVNodeQueue);
            api.insertBefore(parentElm, elm, oldVNode.elm);
            removeVNodes(parentElm, [oldVNode], 0, 0);
            return;
        }
        if (util.isDef(data)) {
            for (i = 0; i < callbacks.update.length; ++i) {
                var _callbacks$update$i = callbacks.update[i];
                var context = _callbacks$update$i.context;
                var fn = _callbacks$update$i.fn;

                fn.apply(context, [oldVNode, vNode]);
            }
            i = data.hook;
            if (util.isDef(i) && util.isDef(i = i.update)) {
                i(oldVNode, vNode);
            }
        }
        if (util.isUndef(text)) {
            if (util.isDef(oldChildren) && util.isDef(children)) {
                if (oldChildren !== children) {
                    updateChildren(elm, oldChildren, children, insertedVNodeQueue);
                }
            } else if (util.isDef(children)) {
                if (util.isDef(oldVNode.text)) api.setTextContent(elm, '');
                addVNodes(elm, null, children, 0, children.length - 1, insertedVNodeQueue);
            } else if (util.isDef(oldChildren)) {
                removeVNodes(elm, oldChildren, 0, children.length - 1);
            } else if (util.isDef(oldVNode.text)) {
                api.setTextContent(elm, '');
            }
        } else if (oldVNode.text !== vNode.text) {
            api.setTextContent(elm, vNode.text);
        }
        if (util.isDef(hook) && util.isDef(i = hook.postpatch)) {
            i(oldVNode, vNode);
        }
    }
    return function patch(oldVNode, vNode) {
        var i = void 0;
        var elm = void 0;
        var parent = void 0;
        var insertedVNodeQueue = [];
        for (i = 0; i < callbacks.pre.length; ++i) {
            var _callbacks$pre$i = callbacks.pre[i];
            var context = _callbacks$pre$i.context;
            var fn = _callbacks$pre$i.fn;

            fn.apply(context, []);
        }
        if (util.isUndef(oldVNode.sel)) {
            oldVNode = emptyVNodeAt(oldVNode);
        }
        if (util.sameVNode(oldVNode, vNode)) {
            patchVNode(oldVNode, vNode, insertedVNodeQueue);
        } else {
            elm = oldVNode.elm;
            parent = api.parentNode(elm);
            createElement(vNode, insertedVNodeQueue);
            if (parent !== null) {
                api.insertBefore(parent, vNode.elm, api.nextSibling(elm));
                removeVNodes(parent, [oldVNode], 0, 0);
            }
        }
        for (i = 0; i < insertedVNodeQueue.length; ++i) {
            insertedVNodeQueue[i].data.hook.insert(insertedVNodeQueue[i]);
        }
        for (i = 0; i < callbacks.post.length; ++i) {
            var _callbacks$post$i = callbacks.post[i];
            var context = _callbacks$post$i.context;
            var fn = _callbacks$post$i.fn;

            fn.apply(context, []);
        }
        return vNode.elm;
    };
}


},{"./api/dom":1,"./util/index":6}]},{},[5])(5)
});