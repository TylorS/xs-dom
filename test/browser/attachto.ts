/// <reference path="../../typings/main.d.ts"/>
import * as assert from 'assert';

import {init, h} from '../../src/index';
import attachTo from '../helpers/attachto';

let patch = init([]);

describe('attachTo', function() {
  let elm, vnode0;
  beforeEach(function() {
    elm = document.createElement('div');
    vnode0 = elm;
  });
  it('adds element to target', function() {
    let vnode1 = h('div', [
       h('div#wrapper', [
         h('div', 'Some element'),
         attachTo(elm, h('div#attached', 'Test')),
       ]),
    ]);
    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.children.length, 2);
  });
  it('updates element at target', function() {
    let vnode1 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
        attachTo(elm, h('div#attached', 'First text')),
      ]),
    ]);
    let vnode2 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
        attachTo(elm, h('div#attached', 'New text')),
      ]),
    ]);
    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.children[0].innerHTML, 'First text');
    elm = patch(vnode1, vnode2).elm;
    assert.equal(elm.children[0].innerHTML, 'New text');
  });
  it('element can be inserted before modal', function() {
    let vnode1 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
        attachTo(elm, h('div#attached', 'Text')),
      ]),
    ]);
    let vnode2 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
        h('div', 'A new element'),
        attachTo(elm, h('div#attached', 'Text')),
      ]),
    ]);
    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.children[0].innerHTML, 'Text');
    elm = patch(vnode1, vnode2).elm;
    assert.equal(elm.children[0].innerHTML, 'Text');
  });
  it('removes element at target', function() {
    let vnode1 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
        attachTo(elm, h('div#attached', 'First text')),
      ]),
    ]);
    let vnode2 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
      ]),
    ]);
    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.children[0].innerHTML, 'First text');
    elm = patch(vnode1, vnode2).elm;
    assert.equal(elm.children.length, 1);
  });
  it('remove hook recieves real element', function() {
    function rm(vnode, cb) {
      assert.equal(vnode.elm.tagName, 'DIV');
      assert.equal(vnode.elm.innerHTML, 'First text');
      cb();
    }
    let vnode1 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
        attachTo(elm, h('div#attached', {hook: {remove: rm}}, 'First text')),
      ]),
    ]);
    let vnode2 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
      ]),
    ]);
    elm = patch(vnode0, vnode1).elm;
    elm = patch(vnode1, vnode2).elm;
  });
});