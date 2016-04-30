(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.xsDom = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Callbacks = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createRemoveCallback = createRemoveCallback;

var _index = require('./util/index');

var _dom = require('./api/dom');

var api = _interopRequireWildcard(_dom);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
function registerModules(modules) {
    var callbacks = {};
    for (var i = 0; i < hooks.length; ++i) {
        callbacks[hooks[i]] = [];
        for (var j = 0; j < modules.length; ++j) {
            if (modules[j][hooks[i]] !== void 0) {
                callbacks[hooks[i]].push(modules[j][hooks[i]]);
            }
        }
    }
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

var Callbacks = function () {
    function Callbacks(modules) {
        _classCallCheck(this, Callbacks);

        this.callbacks = registerModules(modules);
    }

    _createClass(Callbacks, [{
        key: 'pre',
        value: function pre() {
            for (var i = 0; i < this.callbacks.pre.length; ++i) {
                this.callbacks.pre[i]();
            }
        }
    }, {
        key: 'create',
        value: function create(vNode) {
            var create = this.callbacks.create;
            var length = create.length;
            if (length === 1) {
                create[0]((0, _index.emptyVNode)(), vNode);
                return;
            }
            for (var i = 0; i < length; ++i) {
                create[i]((0, _index.emptyVNode)(), vNode);
            }
        }
    }, {
        key: 'update',
        value: function update(oldVNode, vNode) {
            var update = this.callbacks.update;
            var length = update.length;
            if (length === 1) {
                update[0](oldVNode, vNode);
                return;
            }
            for (var i = 0; i < this.callbacks.update.length; ++i) {
                update[i](oldVNode, vNode);
            }
        }
    }, {
        key: 'insert',
        value: function insert(insertedVNodeQueue) {
            for (var i = 0; i < insertedVNodeQueue.length; ++i) {
                insertedVNodeQueue[i].data.hook.insert(insertedVNodeQueue[i]);
            }
        }
    }, {
        key: 'remove',
        value: function remove(vNode, _remove) {
            for (var i = 0; i < this.callbacks.remove.length; ++i) {
                this.callbacks.remove[i](vNode, _remove);
            }
        }
    }, {
        key: 'getListeners',
        value: function getListeners() {
            return this.callbacks.remove.length + 1;
        }
    }, {
        key: 'destroy',
        value: function destroy(vNode) {
            for (var i = 0; i < this.callbacks.destroy.length; ++i) {
                this.callbacks.destroy[i](vNode);
            }
        }
    }, {
        key: 'post',
        value: function post() {
            for (var i = 0; i < this.callbacks.post.length; ++i) {
                this.callbacks.post[i]();
            }
        }
    }]);

    return Callbacks;
}();



exports.Callbacks = Callbacks;

},{"./api/dom":6,"./util/index":12}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ElementCreator = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = require('./api/dom');

var api = _interopRequireWildcard(_dom);

var _index = require('./util/index');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pluckInit = (0, _index.pluck)('hook', 'init');
var pluckCreate = (0, _index.pluck)('hook', 'create');
var pluckInsert = (0, _index.pluck)('hook', 'insert');
var pluckNS = (0, _index.pluck)('ns');

var ElementCreator = exports.ElementCreator = function () {
    function ElementCreator(insertedVNodeQueue, callbacks) {
        _classCallCheck(this, ElementCreator);

        this.insertedVNodeQueue = insertedVNodeQueue;
        this.callbacks = callbacks;
    }

    _createClass(ElementCreator, [{
        key: 'create',
        value: function create(vNode) {
            var init = pluckInit(vNode.data);
            if ((0, _index.isDef)(init)) {
                init(vNode);
            }
            if ((0, _index.isDef)(vNode.sel)) {
                var _parseSelector = (0, _index.parseSelector)(vNode.sel);

                var tagName = _parseSelector.tagName;
                var id = _parseSelector.id;
                var className = _parseSelector.className;

                var namespace = pluckNS(vNode.data);
                vNode.elm = (0, _index.isDef)(namespace) ? api.createElementNS(namespace, tagName) : api.createElement(tagName);
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
                    create((0, _index.emptyVNode)(), vNode);
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


},{"./api/dom":6,"./util/index":12}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createVNode = createVNode;
exports.createTextVNode = createTextVNode;
function createVNode(_ref) {
    var sel = _ref.sel;
    var _ref$data = _ref.data;
    var data = _ref$data === undefined ? {} : _ref$data;
    var _ref$children = _ref.children;
    var children = _ref$children === undefined ? void 0 : _ref$children;
    var _ref$elm = _ref.elm;
    var elm = _ref$elm === undefined ? void 0 : _ref$elm;
    var _ref$text = _ref.text;
    var text = _ref$text === undefined ? void 0 : _ref$text;

    var key = data === void 0 ? void 0 : data.key;
    return { sel: sel, data: data, children: children, elm: elm, text: text, key: key };
}
function createTextVNode(text) {
    return createVNode({
        sel: void 0,
        data: void 0,
        children: void 0,
        text: text
    });
}


},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.VNodePatcher = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Callbacks = require('./Callbacks');

var _VNodeUpdater = require('./VNodeUpdater');

var _dom = require('./api/dom');

var api = _interopRequireWildcard(_dom);

var _index = require('./util/index');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pluckPrepatch = (0, _index.pluck)('hook', 'prepatch');
var pluckPostpatch = (0, _index.pluck)('hook', 'postpatch');
var pluckUpdate = (0, _index.pluck)('hook', 'update');
var pluckRemove = (0, _index.pluck)('hook', 'remove');
var pluckDestroy = (0, _index.pluck)('hook', 'destroy');

var VNodePatcher = exports.VNodePatcher = function () {
    function VNodePatcher(elementCreator, callbacks) {
        _classCallCheck(this, VNodePatcher);

        this.elementCreator = elementCreator;
        this.callbacks = callbacks;
        this.vNodeUpdater = new _VNodeUpdater.VNodeUpdater(this);
    }

    _createClass(VNodePatcher, [{
        key: 'patch',
        value: function patch(oldVNode, vNode) {
            var prepatch = pluckPrepatch(vNode.data);
            if ((0, _index.isDef)(prepatch)) {
                prepatch(oldVNode, vNode);
            }
            var elm = vNode.elm = oldVNode.elm;
            var oldChildren = oldVNode.children;
            var children = vNode.children;
            if (oldVNode === vNode) return; // used for thunks only
            if (!(0, _index.sameVNode)(oldVNode, vNode)) {
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
            if ((0, _index.isUndef)(vNode.text)) {
                if ((0, _index.isDef)(oldVNode.text)) {
                    api.setTextContent(elm, '');
                }
                if ((0, _index.isDef)(oldChildren) && (0, _index.isDef)(children) && oldChildren !== children) {
                    this.vNodeUpdater.update(elm, oldChildren, children);
                } else if ((0, _index.isDef)(children)) {
                    this.add(elm, null, children, 0, children.length - 1);
                } else if ((0, _index.isDef)(oldChildren)) {
                    this.remove(elm, oldChildren, 0, oldChildren.length - 1);
                }
            } else if ((0, _index.isDef)(vNode.text) && oldVNode.text !== vNode.text) {
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
                if ((0, _index.isDef)(currentVNode)) {
                    if ((0, _index.isDef)(currentVNode.sel)) {
                        this.invokeDestroyHook(currentVNode);
                        var listeners = this.callbacks.getListeners();
                        var removeCallback = (0, _Callbacks.createRemoveCallback)(currentVNode.elm, listeners);
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
            if ((0, _index.isDef)(vNode.children)) {
                (0, _index.forEach)(function (c) {
                    return _this.invokeDestroyHook(c);
                }, vNode.children);
            }
        }
    }]);

    return VNodePatcher;
}();


},{"./Callbacks":1,"./VNodeUpdater":5,"./api/dom":6,"./util/index":12}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.VNodeUpdater = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('./util/index');

var _dom = require('./api/dom');

var api = _interopRequireWildcard(_dom);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VNodeUpdater = exports.VNodeUpdater = function () {
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
                if ((0, _index.isUndef)(oldStartVNode)) {
                    oldStartVNode = oldChildren[++oldStartIdx];
                } else if ((0, _index.isUndef)(oldEndVNode)) {
                    oldEndVNode = oldChildren[--oldEndIdx];
                } else if ((0, _index.sameVNode)(oldStartVNode, newStartVNode)) {
                    this.vNodePatcher.patch(oldStartVNode, newStartVNode);
                    oldStartVNode = oldChildren[++oldStartIdx];
                    newStartVNode = children[++newStartIdx];
                } else if ((0, _index.sameVNode)(oldEndVNode, newEndVNode)) {
                    this.vNodePatcher.patch(oldEndVNode, newEndVNode);
                    oldEndVNode = oldChildren[--oldEndIdx];
                    newEndVNode = children[--newEndIdx];
                } else if ((0, _index.sameVNode)(oldStartVNode, newEndVNode)) {
                    this.vNodePatcher.patch(oldStartVNode, newEndVNode);
                    api.insertBefore(element, oldStartVNode.elm, api.nextSibling(oldEndVNode.elm));
                    oldStartVNode = oldChildren[++oldStartIdx];
                    newEndVNode = children[--newEndIdx];
                } else if ((0, _index.sameVNode)(oldEndVNode, newStartVNode)) {
                    this.vNodePatcher.patch(oldEndVNode, newStartVNode);
                    api.insertBefore(element, oldEndVNode.elm, oldStartVNode.elm);
                    oldEndVNode = oldChildren[--oldEndIdx];
                    newStartVNode = children[++newStartIdx];
                } else {
                    if ((0, _index.isUndef)(oldKeyToIdx)) {
                        // a map of keys -> index of oldChidren array
                        oldKeyToIdx = (0, _index.createKeyToOldIdx)(oldChildren, oldStartIdx, oldEndIdx);
                    }
                    idxInOld = oldKeyToIdx[newStartVNode.key]; // try to find where the current vNode was previously
                    if ((0, _index.isUndef)(idxInOld)) {
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
                var before = (0, _index.isUndef)(children[newEndIdx + 1]) ? null : children[newEndIdx + 1].elm;
                this.vNodePatcher.add(element, before, children, newStartIdx, newEndIdx);
            } else if (newStartIdx > newEndIdx) {
                this.vNodePatcher.remove(element, oldChildren, oldStartIdx, oldEndIdx);
            }
        }
    }]);

    return VNodeUpdater;
}();


},{"./api/dom":6,"./util/index":12}],6:[function(require,module,exports){
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
    if (node === void 0) {
        return;
    }
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


},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createTagFunction = createTagFunction;

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
var TAG_NAMES = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'dd', 'del', 'dfn', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'u', 'ul', 'video', 'progress'];
var exported = { TAG_NAMES: TAG_NAMES, isSelector: isSelector, createTagFunction: createTagFunction };
TAG_NAMES.forEach(function (n) {
    exported[n] = createTagFunction(n);
});
exports.default = exported;


},{"./hyperscript":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.h = h;

var _VNode = require('../VNode');

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
                children[i] = (0, _VNode.createTextVNode)(children[i]);
            }
        }
    }
    if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g') {
        addNS(data, children);
    }
    return (0, _VNode.createVNode)({ sel: sel, data: data, children: children, text: text });
}
;


},{"../VNode":3}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _hyperscriptHelpers = require('./hyperscript-helpers');

var TAG_NAMES = ['a', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor', 'animateMotion', 'animateTransform', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotlight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath', 'path', 'pattern', 'polygon', 'polyling', 'radialGradient', 'rect', 'script', 'set', 'stop', 'style', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref', 'tspan', 'use', 'view', 'vkern'];
var svg = (0, _hyperscriptHelpers.createTagFunction)('svg');
TAG_NAMES.forEach(function (tag) {
    svg[tag] = (0, _hyperscriptHelpers.createTagFunction)(tag);
});
exports.default = svg;


},{"./hyperscript-helpers":7}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.thunk = thunk;

var _hyperscript = require('./hyperscript');

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

    return (0, _hyperscript.h)(sel, {
        key: key,
        hook: { init: init, prepatch: prepatch },
        fn: fn,
        args: args
    });
}
;


},{"./hyperscript":8}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = exports.svg = exports.video = exports.ul = exports.u = exports.tr = exports.title = exports.thead = exports.th = exports.tfoot = exports.textarea = exports.td = exports.tbody = exports.table = exports.sup = exports.sub = exports.style = exports.strong = exports.span = exports.source = exports.small = exports.select = exports.section = exports.script = exports.samp = exports.s = exports.ruby = exports.rt = exports.rp = exports.q = exports.pre = exports.param = exports.p = exports.option = exports.optgroup = exports.ol = exports.object = exports.noscript = exports.nav = exports.meta = exports.menu = exports.mark = exports.map = exports.main = exports.link = exports.li = exports.legend = exports.label = exports.keygen = exports.kbd = exports.ins = exports.input = exports.img = exports.iframe = exports.i = exports.html = exports.hr = exports.hgroup = exports.header = exports.head = exports.h6 = exports.h5 = exports.h4 = exports.h3 = exports.h2 = exports.h1 = exports.form = exports.footer = exports.figure = exports.figcaption = exports.fieldset = exports.embed = exports.em = exports.dt = exports.dl = exports.div = exports.dir = exports.dfn = exports.del = exports.dd = exports.colgroup = exports.col = exports.code = exports.cite = exports.caption = exports.canvas = exports.button = exports.br = exports.body = exports.blockquote = exports.bdo = exports.bdi = exports.base = exports.b = exports.audio = exports.aside = exports.article = exports.area = exports.address = exports.abbr = exports.a = exports.h = exports.thunk = undefined;

var _thunk = require('./hyperscript/thunk');

Object.defineProperty(exports, 'thunk', {
  enumerable: true,
  get: function get() {
    return _thunk.thunk;
  }
});

var _xsDom = require('./xs-dom');

Object.defineProperty(exports, 'init', {
  enumerable: true,
  get: function get() {
    return _xsDom.init;
  }
});

var _hyperscript = require('./hyperscript/hyperscript');

var _hyperscriptHelpers = require('./hyperscript/hyperscript-helpers');

var _hyperscriptHelpers2 = _interopRequireDefault(_hyperscriptHelpers);

var _svgHelpers = require('./hyperscript/svg-helpers');

var _svgHelpers2 = _interopRequireDefault(_svgHelpers);

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
exports.svg = _svgHelpers2.default;

},{"./hyperscript/hyperscript":8,"./hyperscript/hyperscript-helpers":7,"./hyperscript/svg-helpers":9,"./hyperscript/thunk":10,"./xs-dom":14}],12:[function(require,module,exports){
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
exports.pluck = pluck;
exports.forEach = forEach;
exports.curry2 = curry2;
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
function forEach(fn, array) {
    var l = array.length;
    for (var i = 0; i < l; ++i) {
        fn(array[i]);
    }
}
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


},{"./parseSelector":13}],13:[function(require,module,exports){
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


},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.init = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = require('./api/dom');

var api = _interopRequireWildcard(_dom);

var _index = require('./util/index');

var _Callbacks = require('./Callbacks');

var _ElementCreator = require('./ElementCreator');

var _VNodePatcher = require('./VNodePatcher');

var _VNode = require('./VNode');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function emptyVNodeAt(elm) {
    return (0, _VNode.createVNode)({
        sel: api.tagName(elm).toLowerCase(),
        elm: elm
    });
}
var init = exports.init = (0, _index.curry2)(function init(modules, rootElement) {
    var insertedVNodeQueue = [];
    var callbacks = new _Callbacks.Callbacks(modules);
    var elementCreator = new _ElementCreator.ElementCreator(insertedVNodeQueue, callbacks);
    var vNodePatcher = new _VNodePatcher.VNodePatcher(elementCreator, callbacks);
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
            if ((0, _index.sameVNode)(oldVNode, vNode)) {
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