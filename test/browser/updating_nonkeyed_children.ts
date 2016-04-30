import * as assert from 'assert';

import {init, h} from '../../src/index';
import props from '../../src/module/properties';
import klass from '../../src/module/classes';

function prop(name) {
  return function(obj) {
    return obj[name];
  };
}

function map(fn, list) {
  let ret = [];
  for (let i = 0; i < list.length; ++i) {
    ret[i] = fn(list[i]);
  }
  return ret;
}

let inner = prop('innerHTML');

describe('updating children without keys', function() {
  let xsdom;
  let elm;
  beforeEach(function() {
    elm = document.createElement('div');
    xsdom = init([props, klass], elm);
  });

  it('appends elements', function() {
    let vnode1 = h('div', [h('span', 'Hello')]);
    let vnode2 = h('div', [h('span', 'Hello'), h('span', 'World')]);
    elm = xsdom.patch(vnode1).elm;
    assert.deepEqual(map(inner, elm.children), ['Hello']);
    elm = xsdom.patch(vnode2).elm;
    assert.deepEqual(map(inner, elm.children), ['Hello', 'World']);
  });

  it('handles unmoved text nodes', function() {
    let vnode1 = h('div', ['Text', h('span', 'Span')]);
    let vnode2 = h('div', ['Text', h('span', 'Span')]);
    elm = xsdom.patch(vnode1).elm;
    assert.equal(elm.childNodes[0].textContent, 'Text');
    elm = xsdom.patch(vnode2).elm;
    assert.equal(elm.childNodes[0].textContent, 'Text');
  });

  it('handles changing text children', function() {
    let vnode1 = h('div', ['Text', h('span', 'Span')]);
    let vnode2 = h('div', ['Text2', h('span', 'Span')]);
    elm = xsdom.patch(vnode1).elm;
    assert.equal(elm.childNodes[0].textContent, 'Text');
    elm = xsdom.patch(vnode2).elm;
    assert.equal(elm.childNodes[0].textContent, 'Text2');
  });

  it('prepends element', function() {
    let vnode1 = h('div', [h('span', 'World')]);
    let vnode2 = h('div', [h('span', 'Hello'), h('span', 'World')]);
    elm = xsdom.patch(vnode1).elm;
    assert.deepEqual(map(inner, elm.children), ['World']);
    elm = xsdom.patch(vnode2).elm;
    assert.deepEqual(map(inner, elm.children), ['Hello', 'World']);
  });

  it('prepends element of different tag type', function() {
    let vnode1 = h('div', [h('span', 'World')]);
    let vnode2 = h('div', [h('div', 'Hello'), h('span', 'World')]);
    elm = xsdom.patch(vnode1).elm;
    assert.deepEqual(map(inner, elm.children), ['World']);
    elm = xsdom.patch(vnode2).elm;
    assert.deepEqual(map(prop('tagName'), elm.children), ['DIV', 'SPAN']);
    assert.deepEqual(map(inner, elm.children), ['Hello', 'World']);
  });

  it('removes elements', function() {
    let vnode1 = h('div', [h('span', 'One'), h('span', 'Two'), h('span', 'Three')]);
    let vnode2 = h('div', [h('span', 'One'), h('span', 'Three')]);
    elm = xsdom.patch(vnode1).elm;
    assert.deepEqual(map(inner, elm.children), ['One', 'Two', 'Three']);
    elm = xsdom.patch(vnode2).elm;
    assert.deepEqual(map(inner, elm.children), ['One', 'Three']);
  });

  it('removes a single text node', function() {
    let vnode1 = h('div', 'One');
    let vnode2 = h('div');
    xsdom.patch(vnode1);
    assert.equal(elm.textContent, 'One');
    xsdom.patch(vnode2);
    assert.equal(elm.textContent, '');
  });

  it('removes a single text node when children are updated', function() {
    let vnode1 = h('div', 'One');
    let vnode2 = h('div', [ h('div', 'Two'), h('span', 'Three') ]);
    xsdom.patch(vnode1);
    assert.equal(elm.textContent, 'One');
    xsdom.patch(vnode2);
    assert.deepEqual(map(prop('textContent'), elm.childNodes), ['Two', 'Three']);
  });

  it('removes a text node among other elements', function() {
    let vnode1 = h('div', [ 'One', h('span', 'Two') ]);
    let vnode2 = h('div', [ h('div', 'Three')]);
    xsdom.patch(vnode1);
    assert.deepEqual(map(prop('textContent'), elm.childNodes), ['One', 'Two']);
    xsdom.patch(vnode2);
    assert.equal(elm.childNodes.length, 1);
    assert.equal(elm.childNodes[0].tagName, 'DIV');
    assert.equal(elm.childNodes[0].textContent, 'Three');
  });

  it('reorders elements', function() {
    let vnode1 = h('div', [h('span', 'One'), h('div', 'Two'), h('b', 'Three')]);
    let vnode2 = h('div', [h('b', 'Three'), h('span', 'One'), h('div', 'Two')]);
    elm = xsdom.patch(vnode1).elm;
    assert.deepEqual(map(inner, elm.children), ['One', 'Two', 'Three']);
    elm = xsdom.patch(vnode2).elm;
    assert.deepEqual(map(prop('tagName'), elm.children), ['B', 'SPAN', 'DIV']);
    assert.deepEqual(map(inner, elm.children), ['Three', 'One', 'Two']);
  });
});
