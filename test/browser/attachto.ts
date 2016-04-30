import * as assert from 'assert';

import XSDOM, {h} from '../../src/index';
import attachTo from '../helpers/attachto';

describe('attachTo', function() {
  let xsdom;
  let elm;
  beforeEach(function() {
    xsdom = new XSDOM([]);
    elm = document.createElement('div');
  });
  it('adds element to target', function() {
    const vnode1 = h('div', [
       h('div#wrapper', [
         h('div', 'Some element'),
         attachTo(elm, h('div#attached', 'Test')),
       ]),
    ]);
    xsdom.setRootElement(elm);
    elm = xsdom.patch(vnode1).elm;
    assert.equal(elm.children.length, 2);
  });
  it('updates element at target', function() {
    const vnode1 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
        attachTo(elm, h('div#attached', 'First text')),
      ]),
    ]);
    const vnode2 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
        attachTo(elm, h('div#attached', 'New text')),
      ]),
    ]);
    xsdom.setRootElement(elm);
    elm = xsdom.patch(vnode1).elm;
    assert.equal(elm.children[0].innerHTML, 'First text');
    elm = xsdom.patch(vnode2).elm;
    assert.equal(elm.children[0].innerHTML, 'New text');
  });
  it('element can be inserted before modal', function() {
    const vnode1 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
        attachTo(elm, h('div#attached', 'Text')),
      ]),
    ]);
    const vnode2 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
        h('div', 'A new element'),
        attachTo(elm, h('div#attached', 'Text')),
      ]),
    ]);
    xsdom.setRootElement(elm);
    elm = xsdom.patch(vnode1).elm;
    assert.equal(elm.children[0].innerHTML, 'Text');
    elm = xsdom.patch(vnode2).elm;
    assert.equal(elm.children[0].innerHTML, 'Text');
  });
  it('removes element at target', function() {
    const vnode1 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
        attachTo(elm, h('div#attached', 'First text')),
      ]),
    ]);
    const vnode2 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
      ]),
    ]);
    xsdom.setRootElement(elm);
    elm = xsdom.patch(vnode1).elm;
    assert.equal(elm.children[0].innerHTML, 'First text');
    elm = xsdom.patch(vnode2).elm;
    assert.equal(elm.children.length, 1);
  });
  it('remove hook recieves real element', function() {
    function rm(vnode, cb) {
      assert.equal(vnode.elm.tagName, 'DIV');
      assert.equal(vnode.elm.innerHTML, 'First text');
      cb();
    }
    const vnode1 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
        attachTo(elm, h('div#attached', {hook: {remove: rm}}, 'First text')),
      ]),
    ]);
    const vnode2 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
      ]),
    ]);
    xsdom.setRootElement(elm);
    elm = xsdom.patch(vnode1).elm;
    elm = xsdom.patch(vnode2).elm;
  });
});
