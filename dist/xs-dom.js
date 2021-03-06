(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.xsDom = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var index_1 = require('./util/index');
var api = require('./api/dom');
var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
function registerModules(modules) {
    var callbacks = {
        create: [],
        update: [],
        remove: [],
        destroy: [],
        pre: [],
        post: []
    };
    index_1.forEach(function (hook) {
        return index_1.forEach(function (module) {
            if (module[hook]) callbacks[hook].push(module[hook]);
        }, modules);
    }, hooks);
    return callbacks;
}
function createRemoveCallback(childElm, listeners) {
    return function () {
        if (--listeners === 0) {
            var parent = api.parentNode(childElm);
            api.removeChild(parent, childElm);
        }
    };
}
exports.createRemoveCallback = createRemoveCallback;

var Callbacks = function () {
    function Callbacks(modules) {
        _classCallCheck(this, Callbacks);

        this.callbacks = registerModules(modules);
    }

    _createClass(Callbacks, [{
        key: 'pre',
        value: function pre() {
            index_1.forEach(function (fn) {
                return fn();
            }, this.callbacks.pre);
        }
    }, {
        key: 'create',
        value: function create(vNode) {
            index_1.forEach(function (fn) {
                return fn(index_1.emptyVNode(), vNode);
            }, this.callbacks.create);
        }
    }, {
        key: 'update',
        value: function update(oldVNode, vNode) {
            index_1.forEach(function (fn) {
                return fn(oldVNode, vNode);
            }, this.callbacks.update);
        }
    }, {
        key: 'insert',
        value: function insert(insertedVNodeQueue) {
            index_1.forEach(function (vNode) {
                return vNode.data.hook.insert(vNode);
            }, insertedVNodeQueue);
        }
    }, {
        key: 'remove',
        value: function remove(vNode, _remove) {
            index_1.forEach(function (fn) {
                return fn(vNode, _remove);
            }, this.callbacks.remove);
        }
    }, {
        key: 'getListeners',
        value: function getListeners() {
            return this.callbacks.remove.length + 1;
        }
    }, {
        key: 'destroy',
        value: function destroy(vNode) {
            index_1.forEach(function (fn) {
                return fn(vNode);
            }, this.callbacks.destroy);
        }
    }, {
        key: 'post',
        value: function post() {
            index_1.forEach(function (fn) {
                return fn();
            }, this.callbacks.post);
        }
    }]);

    return Callbacks;
}();

exports.Callbacks = Callbacks;


},{"./api/dom":6,"./util/index":12}],2:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var api = require('./api/dom');
var index_1 = require('./util/index');
var pluckInit = index_1.pluck('hook', 'init');
var pluckCreate = index_1.pluck('hook', 'create');
var pluckInsert = index_1.pluck('hook', 'insert');
var pluckNS = index_1.pluck('ns');

var ElementCreator = function () {
    function ElementCreator(insertedVNodeQueue, callbacks) {
        _classCallCheck(this, ElementCreator);

        this.insertedVNodeQueue = insertedVNodeQueue;
        this.callbacks = callbacks;
    }

    _createClass(ElementCreator, [{
        key: 'create',
        value: function create(vNode) {
            var init = pluckInit(vNode.data);
            if (index_1.isDef(init)) {
                init(vNode);
            }
            if (index_1.isDef(vNode.sel)) {
                var _index_1$parseSelecto = index_1.parseSelector(vNode.sel);

                var tagName = _index_1$parseSelecto.tagName;
                var id = _index_1$parseSelecto.id;
                var className = _index_1$parseSelecto.className;

                var namespace = pluckNS(vNode.data);
                vNode.elm = index_1.isDef(namespace) ? api.createElementNS(namespace, tagName) : api.createElement(tagName);
                if (id) {
                    vNode.elm.id = id;
                }
                if (className) {
                    vNode.elm.className = className;
                }
                if (Array.isArray(vNode.children)) {
                    for (var i = 0; i < vNode.children.length; ++i) {
                        api.appendChild(vNode.elm, this.create(vNode.children[i]));
                    }
                } else if (typeof vNode.text === 'string') {
                    api.appendChild(vNode.elm, api.createTextNode(vNode.text));
                }
                this.callbacks.create(vNode);
                var create = pluckCreate(vNode.data);
                if (create) {
                    create(index_1.emptyVNode(), vNode);
                }
                ;
                if (pluckInsert(vNode.data)) {
                    this.insertedVNodeQueue.push(vNode);
                }
                return vNode.elm;
            }
            vNode.elm = api.createTextNode(vNode.text);
            return vNode.elm;
        }
    }]);

    return ElementCreator;
}();

exports.ElementCreator = ElementCreator;


},{"./api/dom":6,"./util/index":12}],3:[function(require,module,exports){
"use strict";

function createVNode(vNode) {
    var data = vNode.data || {};
    var children = vNode.children || void 0;
    var elm = vNode.elm || void 0;
    var text = vNode.text || void 0;
    var key = data === void 0 ? void 0 : data.key;
    return { sel: vNode.sel, data: data, children: children, elm: elm, text: text, key: key };
}
exports.createVNode = createVNode;
function createTextVNode(text) {
    return createVNode({
        sel: void 0,
        data: void 0,
        children: void 0,
        text: text
    });
}
exports.createTextVNode = createTextVNode;


},{}],4:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Callbacks_1 = require('./Callbacks');
var VNodeUpdater_1 = require('./VNodeUpdater');
var api = require('./api/dom');
var index_1 = require('./util/index');
var pluckPrepatch = index_1.pluck('hook', 'prepatch');
var pluckPostpatch = index_1.pluck('hook', 'postpatch');
var pluckUpdate = index_1.pluck('hook', 'update');
var pluckRemove = index_1.pluck('hook', 'remove');
var pluckDestroy = index_1.pluck('hook', 'destroy');

var VNodePatcher = function () {
    function VNodePatcher(elementCreator, callbacks) {
        _classCallCheck(this, VNodePatcher);

        this.elementCreator = elementCreator;
        this.callbacks = callbacks;
        this.vNodeUpdater = new VNodeUpdater_1.VNodeUpdater(this);
    }

    _createClass(VNodePatcher, [{
        key: 'patch',
        value: function patch(oldVNode, vNode) {
            var prepatch = pluckPrepatch(vNode.data);
            if (index_1.isDef(prepatch)) {
                prepatch(oldVNode, vNode);
            }
            var elm = vNode.elm = oldVNode.elm;
            var oldChildren = oldVNode.children;
            var children = vNode.children;
            if (oldVNode === vNode) return; // used for thunks only
            if (!index_1.sameVNode(oldVNode, vNode)) {
                var parentElm = api.parentNode(oldVNode.elm);
                elm = this.elementCreator.create(vNode);
                api.insertBefore(parentElm, elm, oldVNode.elm);
                this.remove(parentElm, [oldVNode], 0, 0);
                return;
            }
            this.callbacks.update(oldVNode, vNode);
            var update = pluckUpdate(vNode.data);
            if (update) {
                update(oldVNode, vNode);
            }
            if (index_1.isUndef(vNode.text)) {
                if (index_1.isDef(oldVNode.text)) {
                    api.setTextContent(elm, '');
                }
                if (index_1.isDef(oldChildren) && index_1.isDef(children) && oldChildren !== children) {
                    this.vNodeUpdater.update(elm, oldChildren, children);
                } else if (index_1.isDef(children)) {
                    this.add(elm, null, children, 0, children.length - 1);
                } else if (index_1.isDef(oldChildren)) {
                    this.remove(elm, oldChildren, 0, oldChildren.length - 1);
                }
            } else if (index_1.isDef(vNode.text) && oldVNode.text !== vNode.text) {
                api.setTextContent(elm, vNode.text);
            }
            var postpatch = pluckPostpatch(vNode.data);
            if (postpatch) {
                postpatch(oldVNode, vNode);
            }
            return vNode;
        }
    }, {
        key: 'create',
        value: function create(vNode) {
            return this.elementCreator.create(vNode);
        }
    }, {
        key: 'add',
        value: function add(parentElm, before, vNodes, startIdx) {
            var endIdx = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];

            for (; startIdx <= endIdx; ++startIdx) {
                api.insertBefore(parentElm, this.create(vNodes[startIdx]), before);
            }
        }
    }, {
        key: 'remove',
        value: function remove(parentElm, vNodes, startIdx, endIdx) {
            for (; startIdx <= endIdx; ++startIdx) {
                var currentVNode = vNodes[startIdx];
                if (index_1.isDef(currentVNode)) {
                    if (index_1.isDef(currentVNode.sel)) {
                        this.invokeDestroyHook(currentVNode);
                        var listeners = this.callbacks.getListeners();
                        var removeCallback = Callbacks_1.createRemoveCallback(currentVNode.elm, listeners);
                        this.callbacks.remove(currentVNode, removeCallback);
                        var remove = pluckRemove(currentVNode.data);
                        if (remove) {
                            remove(currentVNode, removeCallback);
                        } else {
                            removeCallback();
                        }
                    } else {
                        api.removeChild(parentElm, currentVNode.elm);
                    }
                }
            }
        }
    }, {
        key: 'invokeDestroyHook',
        value: function invokeDestroyHook(vNode) {
            var _this = this;

            if (vNode.sel === void 0) {
                return;
            }
            var destroy = pluckDestroy(vNode.data);
            if (destroy) {
                destroy(vNode);
            }
            this.callbacks.destroy(vNode);
            if (index_1.isDef(vNode.children)) {
                index_1.forEach(function (c) {
                    return _this.invokeDestroyHook(c);
                }, vNode.children);
            }
        }
    }]);

    return VNodePatcher;
}();

exports.VNodePatcher = VNodePatcher;


},{"./Callbacks":1,"./VNodeUpdater":5,"./api/dom":6,"./util/index":12}],5:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var index_1 = require('./util/index');
var api = require('./api/dom');

var VNodeUpdater = function () {
    function VNodeUpdater(vNodePatcher) {
        _classCallCheck(this, VNodeUpdater);

        this.vNodePatcher = vNodePatcher;
    }

    _createClass(VNodeUpdater, [{
        key: 'update',
        value: function update(element, oldChildren, children) {
            // controls while loop
            var oldStartIdx = 0;
            var newStartIdx = 0;
            var oldEndIdx = oldChildren.length - 1;
            var newEndIdx = children.length - 1;
            // used to compare children to see if they have been simply moved
            // or if they have been removed altogether
            var oldStartVNode = oldChildren[0];
            var oldEndVNode = oldChildren[oldEndIdx];
            var newStartVNode = children[0];
            var newEndVNode = children[newEndIdx];
            // used to keep track of `key`ed items that need to be reordered
            var oldKeyToIdx = void 0; // a map of vNode keys -> index in oldChildren array
            var idxInOld = void 0; // index of a *new* vNode in the oldChildren array
            while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
                if (index_1.isUndef(oldStartVNode)) {
                    oldStartVNode = oldChildren[++oldStartIdx];
                } else if (index_1.isUndef(oldEndVNode)) {
                    oldEndVNode = oldChildren[--oldEndIdx];
                } else if (index_1.sameVNode(oldStartVNode, newStartVNode)) {
                    this.vNodePatcher.patch(oldStartVNode, newStartVNode);
                    oldStartVNode = oldChildren[++oldStartIdx];
                    newStartVNode = children[++newStartIdx];
                } else if (index_1.sameVNode(oldEndVNode, newEndVNode)) {
                    this.vNodePatcher.patch(oldEndVNode, newEndVNode);
                    oldEndVNode = oldChildren[--oldEndIdx];
                    newEndVNode = children[--newEndIdx];
                } else if (index_1.sameVNode(oldStartVNode, newEndVNode)) {
                    this.vNodePatcher.patch(oldStartVNode, newEndVNode);
                    api.insertBefore(element, oldStartVNode.elm, api.nextSibling(oldEndVNode.elm));
                    oldStartVNode = oldChildren[++oldStartIdx];
                    newEndVNode = children[--newEndIdx];
                } else if (index_1.sameVNode(oldEndVNode, newStartVNode)) {
                    this.vNodePatcher.patch(oldEndVNode, newStartVNode);
                    api.insertBefore(element, oldEndVNode.elm, oldStartVNode.elm);
                    oldEndVNode = oldChildren[--oldEndIdx];
                    newStartVNode = children[++newStartIdx];
                } else {
                    if (index_1.isUndef(oldKeyToIdx)) {
                        // a map of keys -> index of oldChidren array
                        oldKeyToIdx = index_1.createKeyToOldIdx(oldChildren, oldStartIdx, oldEndIdx);
                    }
                    idxInOld = oldKeyToIdx[newStartVNode.key]; // try to find where the current vNode was previously
                    if (index_1.isUndef(idxInOld)) {
                        var elm = this.vNodePatcher.create(newStartVNode);
                        api.insertBefore(element, elm, oldStartVNode.elm);
                        newStartVNode = children[++newStartIdx];
                    } else {
                        var elmToMove = oldChildren[idxInOld];
                        this.vNodePatcher.patch(elmToMove, newStartVNode);
                        oldChildren[idxInOld] = void 0;
                        api.insertBefore(element, elmToMove.elm, oldStartVNode.elm);
                        newStartVNode = children[++newStartIdx];
                    }
                }
            }
            if (oldStartIdx > oldEndIdx) {
                var before = index_1.isUndef(children[newEndIdx + 1]) ? null : children[newEndIdx + 1].elm;
                this.vNodePatcher.add(element, before, children, newStartIdx, newEndIdx);
            } else if (newStartIdx > newEndIdx) {
                this.vNodePatcher.remove(element, oldChildren, oldStartIdx, oldEndIdx);
            }
        }
    }]);

    return VNodeUpdater;
}();

exports.VNodeUpdater = VNodeUpdater;


},{"./api/dom":6,"./util/index":12}],6:[function(require,module,exports){
"use strict";

function createElement(tagName) {
    return document.createElement(tagName);
}
exports.createElement = createElement;
function createElementNS(namespaceURI, qualifiedName) {
    return document.createElementNS(namespaceURI, qualifiedName);
}
exports.createElementNS = createElementNS;
function createTextNode(text) {
    return document.createTextNode(text);
}
exports.createTextNode = createTextNode;
function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}
exports.insertBefore = insertBefore;
function removeChild(node, child) {
    if (node === void 0) {
        return;
    }
    node.removeChild(child);
}
exports.removeChild = removeChild;
function appendChild(node, child) {
    node.appendChild(child);
}
exports.appendChild = appendChild;
function parentNode(node) {
    return node.parentElement;
}
exports.parentNode = parentNode;
function nextSibling(node) {
    return node.nextSibling;
}
exports.nextSibling = nextSibling;
function tagName(node) {
    return node.tagName;
}
exports.tagName = tagName;
function setTextContent(node, text) {
    node.textContent = text;
}
exports.setTextContent = setTextContent;


},{}],7:[function(require,module,exports){
"use strict";

var hyperscript_1 = require('./hyperscript');
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
                return hyperscript_1.h(tagName + first, b, c);
            } else if (!!b) {
                return hyperscript_1.h(tagName + first, b);
            } else {
                return hyperscript_1.h(tagName + first, {});
            }
        } else if (!!b) {
            return hyperscript_1.h(tagName, first, b);
        } else if (!!first) {
            return hyperscript_1.h(tagName, first);
        } else {
            return hyperscript_1.h(tagName, {});
        }
    };
}
exports.createTagFunction = createTagFunction;
var TAG_NAMES = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'dd', 'del', 'dfn', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'u', 'ul', 'video', 'progress'];
var exported = { TAG_NAMES: TAG_NAMES, isSelector: isSelector, createTagFunction: createTagFunction };
TAG_NAMES.forEach(function (n) {
    exported[n] = createTagFunction(n);
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exported;


},{"./hyperscript":8}],8:[function(require,module,exports){
"use strict";

var VNode_1 = require('../VNode');
function isObservable(x) {
    return !Array.isArray(x) && typeof x.map === 'function';
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
        } else if (typeof c === 'string') {
            text = c;
        }
    } else if (arguments.length === 2) {
        if (Array.isArray(b)) {
            children = b;
        } else if (typeof b === 'string') {
            text = b;
        } else {
            data = b;
        }
    }
    if (Array.isArray(children)) {
        for (i = 0; i < children.length; ++i) {
            if (typeof children[i] === 'string') {
                children[i] = VNode_1.createTextVNode(children[i]);
            }
        }
    }
    if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g') {
        addNS(data, children);
    }
    return VNode_1.createVNode({ sel: sel, data: data, children: children, text: text });
}
exports.h = h;
;


},{"../VNode":3}],9:[function(require,module,exports){
"use strict";

var hyperscript_helpers_1 = require('./hyperscript-helpers');
var TAG_NAMES = ['a', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor', 'animateMotion', 'animateTransform', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotlight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath', 'path', 'pattern', 'polygon', 'polyling', 'radialGradient', 'rect', 'script', 'set', 'stop', 'style', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref', 'tspan', 'use', 'view', 'vkern'];
var svg = hyperscript_helpers_1.createTagFunction('svg');
TAG_NAMES.forEach(function (tag) {
    svg[tag] = hyperscript_helpers_1.createTagFunction(tag);
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = svg;


},{"./hyperscript-helpers":7}],10:[function(require,module,exports){
"use strict";

var hyperscript_1 = require('./hyperscript');
function copyToThunk(vnode, thunk) {
    thunk.elm = vnode.elm;
    vnode.data.fn = thunk.data.fn;
    vnode.data.args = thunk.data.args;
    thunk.data = vnode.data;
    thunk.children = vnode.children;
    thunk.text = vnode.text;
    thunk.elm = vnode.elm;
}
function init(thunk) {
    var cur = thunk.data;
    var vNode = cur.fn.apply(undefined, cur.args);
    copyToThunk(vNode, thunk);
}
function prepatch(oldVnode, thunk) {
    var old = oldVnode.data;
    var cur = thunk.data;
    var oldArgs = old.args;
    var args = cur.args;
    if (old.fn !== cur.fn || oldArgs.length !== args.length) {
        copyToThunk(cur.fn.apply(undefined, args), thunk);
    }
    for (var i = 0; i < args.length; ++i) {
        if (oldArgs[i] !== args[i]) {
            copyToThunk(cur.fn.apply(undefined, args), thunk);
            return;
        }
    }
    copyToThunk(oldVnode, thunk);
}
function thunk(sel, key, fn) {
    for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        args[_key - 3] = arguments[_key];
    }

    return hyperscript_1.h(sel, {
        key: key,
        hook: { init: init, prepatch: prepatch },
        fn: fn,
        args: args
    });
}
exports.thunk = thunk;
;


},{"./hyperscript":8}],11:[function(require,module,exports){
"use strict";
// TS Defs;

var thunk_1 = require('./hyperscript/thunk');
exports.thunk = thunk_1.thunk;
var hyperscript_1 = require('./hyperscript/hyperscript');
exports.h = hyperscript_1.h;
var hyperscript_helpers_1 = require('./hyperscript/hyperscript-helpers');
var _hyperscript_helpers_ = hyperscript_helpers_1.default;
var a = _hyperscript_helpers_.a;
var abbr = _hyperscript_helpers_.abbr;
var address = _hyperscript_helpers_.address;
var area = _hyperscript_helpers_.area;
var article = _hyperscript_helpers_.article;
var aside = _hyperscript_helpers_.aside;
var audio = _hyperscript_helpers_.audio;
var b = _hyperscript_helpers_.b;
var base = _hyperscript_helpers_.base;
var bdi = _hyperscript_helpers_.bdi;
var bdo = _hyperscript_helpers_.bdo;
var blockquote = _hyperscript_helpers_.blockquote;
var body = _hyperscript_helpers_.body;
var br = _hyperscript_helpers_.br;
var button = _hyperscript_helpers_.button;
var canvas = _hyperscript_helpers_.canvas;
var caption = _hyperscript_helpers_.caption;
var cite = _hyperscript_helpers_.cite;
var code = _hyperscript_helpers_.code;
var col = _hyperscript_helpers_.col;
var colgroup = _hyperscript_helpers_.colgroup;
var dd = _hyperscript_helpers_.dd;
var del = _hyperscript_helpers_.del;
var dfn = _hyperscript_helpers_.dfn;
var dir = _hyperscript_helpers_.dir;
var div = _hyperscript_helpers_.div;
var dl = _hyperscript_helpers_.dl;
var dt = _hyperscript_helpers_.dt;
var em = _hyperscript_helpers_.em;
var embed = _hyperscript_helpers_.embed;
var fieldset = _hyperscript_helpers_.fieldset;
var figcaption = _hyperscript_helpers_.figcaption;
var figure = _hyperscript_helpers_.figure;
var footer = _hyperscript_helpers_.footer;
var form = _hyperscript_helpers_.form;
var h1 = _hyperscript_helpers_.h1;
var h2 = _hyperscript_helpers_.h2;
var h3 = _hyperscript_helpers_.h3;
var h4 = _hyperscript_helpers_.h4;
var h5 = _hyperscript_helpers_.h5;
var h6 = _hyperscript_helpers_.h6;
var head = _hyperscript_helpers_.head;
var header = _hyperscript_helpers_.header;
var hgroup = _hyperscript_helpers_.hgroup;
var hr = _hyperscript_helpers_.hr;
var html = _hyperscript_helpers_.html;
var i = _hyperscript_helpers_.i;
var iframe = _hyperscript_helpers_.iframe;
var img = _hyperscript_helpers_.img;
var input = _hyperscript_helpers_.input;
var ins = _hyperscript_helpers_.ins;
var kbd = _hyperscript_helpers_.kbd;
var keygen = _hyperscript_helpers_.keygen;
var label = _hyperscript_helpers_.label;
var legend = _hyperscript_helpers_.legend;
var li = _hyperscript_helpers_.li;
var link = _hyperscript_helpers_.link;
var main = _hyperscript_helpers_.main;
var map = _hyperscript_helpers_.map;
var mark = _hyperscript_helpers_.mark;
var menu = _hyperscript_helpers_.menu;
var meta = _hyperscript_helpers_.meta;
var nav = _hyperscript_helpers_.nav;
var noscript = _hyperscript_helpers_.noscript;
var object = _hyperscript_helpers_.object;
var ol = _hyperscript_helpers_.ol;
var optgroup = _hyperscript_helpers_.optgroup;
var option = _hyperscript_helpers_.option;
var p = _hyperscript_helpers_.p;
var param = _hyperscript_helpers_.param;
var pre = _hyperscript_helpers_.pre;
var q = _hyperscript_helpers_.q;
var rp = _hyperscript_helpers_.rp;
var rt = _hyperscript_helpers_.rt;
var ruby = _hyperscript_helpers_.ruby;
var s = _hyperscript_helpers_.s;
var samp = _hyperscript_helpers_.samp;
var script = _hyperscript_helpers_.script;
var section = _hyperscript_helpers_.section;
var select = _hyperscript_helpers_.select;
var small = _hyperscript_helpers_.small;
var source = _hyperscript_helpers_.source;
var span = _hyperscript_helpers_.span;
var strong = _hyperscript_helpers_.strong;
var style = _hyperscript_helpers_.style;
var sub = _hyperscript_helpers_.sub;
var sup = _hyperscript_helpers_.sup;
var table = _hyperscript_helpers_.table;
var tbody = _hyperscript_helpers_.tbody;
var td = _hyperscript_helpers_.td;
var textarea = _hyperscript_helpers_.textarea;
var tfoot = _hyperscript_helpers_.tfoot;
var th = _hyperscript_helpers_.th;
var thead = _hyperscript_helpers_.thead;
var title = _hyperscript_helpers_.title;
var tr = _hyperscript_helpers_.tr;
var u = _hyperscript_helpers_.u;
var ul = _hyperscript_helpers_.ul;
var video = _hyperscript_helpers_.video;

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
var svg_helpers_1 = require('./hyperscript/svg-helpers');
exports.svg = svg_helpers_1.default;
var xs_dom_1 = require('./xs-dom');
exports.init = xs_dom_1.init;


},{"./hyperscript/hyperscript":8,"./hyperscript/hyperscript-helpers":7,"./hyperscript/svg-helpers":9,"./hyperscript/thunk":10,"./xs-dom":14}],12:[function(require,module,exports){
"use strict";

var parseSelector_1 = require('./parseSelector');
exports.parseSelector = parseSelector_1.parseSelector;
function isDef(x) {
    return typeof x !== 'undefined';
}
exports.isDef = isDef;
function isUndef(x) {
    return typeof x === 'undefined';
}
exports.isUndef = isUndef;
function emptyVNode() {
    return { sel: '', data: {}, children: [], key: void 0, text: void 0 };
}
exports.emptyVNode = emptyVNode;
function sameVNode(vNode1, vNode2) {
    return vNode1.key === vNode2.key && vNode1.sel === vNode2.sel;
}
exports.sameVNode = sameVNode;
function createKeyToOldIdx(children, beginIdx, endIdx) {
    var map = {};
    var key = void 0;
    for (var i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key;
        if (isDef(key)) map[key] = i;
    }
    return map;
}
exports.createKeyToOldIdx = createKeyToOldIdx;
function tryPluckProperty(obj, prop) {
    try {
        return obj[prop];
    } catch (e) {
        return void 0;
    }
}
function pluck() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return function plucker(obj) {
        var x = obj;
        for (var i = 0, l = args.length; i < l; ++i) {
            x = tryPluckProperty(x, args[i]);
        }
        return x;
    };
}
exports.pluck = pluck;
function forEach(fn, array) {
    var l = array.length;
    for (var i = 0; i < l; ++i) {
        fn(array[i]);
    }
}
exports.forEach = forEach;
function curry2(f) {
    function curried(a, b) {
        switch (arguments.length) {
            case 0:
                return curried;
            case 1:
                return function (b) {
                    return f(a, b);
                };
            default:
                return f(a, b);
        }
    }
    return curried;
}
exports.curry2 = curry2;


},{"./parseSelector":13}],13:[function(require,module,exports){
"use strict";

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
exports.parseSelector = parseSelector;


},{}],14:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var api = require('./api/dom');
var index_1 = require('./util/index');
var Callbacks_1 = require('./Callbacks');
var ElementCreator_1 = require('./ElementCreator');
var VNodePatcher_1 = require('./VNodePatcher');
var index_2 = require('./util/index');
var VNode_1 = require('./VNode');
function emptyVNodeAt(elm) {
    return VNode_1.createVNode({
        sel: api.tagName(elm).toLowerCase(),
        elm: elm
    });
}
exports.init = index_2.curry2(function init(modules, rootElement) {
    var insertedVNodeQueue = [];
    var callbacks = new Callbacks_1.Callbacks(modules);
    var elementCreator = new ElementCreator_1.ElementCreator(insertedVNodeQueue, callbacks);
    var vNodePatcher = new VNodePatcher_1.VNodePatcher(elementCreator, callbacks);
    var vNode = emptyVNodeAt(rootElement);
    return new XSDOM(insertedVNodeQueue, callbacks, elementCreator, vNodePatcher, vNode);
});

var XSDOM = function () {
    function XSDOM(insertedVNodeQueue, callbacks, elementCreator, vNodePatcher, oldVNode) {
        _classCallCheck(this, XSDOM);

        this.insertedVNodeQueue = insertedVNodeQueue;
        this.callbacks = callbacks;
        this.elementCreator = elementCreator;
        this.vNodePatcher = vNodePatcher;
        this.oldVNode = oldVNode;
    }

    _createClass(XSDOM, [{
        key: 'patch',
        value: function patch(vNode) {
            var oldVNode = this.oldVNode;
            this.callbacks.pre();
            if (index_1.sameVNode(oldVNode, vNode)) {
                vNode = this.vNodePatcher.patch(oldVNode, vNode);
            } else {
                var parent = api.parentNode(oldVNode.elm);
                var element = this.elementCreator.create(vNode);
                vNode.elm = element;
                if (parent !== null) {
                    api.insertBefore(parent, element, api.nextSibling(oldVNode.elm));
                    this.vNodePatcher.remove(parent, [oldVNode], 0, 0);
                }
            }
            this.callbacks.insert(this.insertedVNodeQueue);
            this.callbacks.post();
            this.insertedVNodeQueue = [];
            this.oldVNode = vNode;
            return vNode;
        }
    }]);

    return XSDOM;
}();


},{"./Callbacks":1,"./ElementCreator":2,"./VNode":3,"./VNodePatcher":4,"./api/dom":6,"./util/index":12}]},{},[11])(11)
});