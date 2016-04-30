import * as assert from 'assert';

import XSDOM, {h} from '../../src/index';
import props from '../../src/module/properties';
import klass from '../../src/module/classes';

describe('patching elements', function() {
  let xsdom;
  let elm;
  beforeEach(function() {
    xsdom = new XSDOM([props, klass]);
    elm = document.createElement('div');
    xsdom.setRootElement(elm);
  });

  it('changes the elements classes', function() {
    let vnode1 = h('i', {class: {i: true, am: true, horse: true}});
    let vnode2 = h('i', {class: {i: true, am: true, horse: false}});
    xsdom.patch(vnode1);
    elm = xsdom.patch(vnode2).elm;
    assert.strictEqual(elm.classList.contains('i'), true);
    assert.strictEqual(elm.classList.contains('am'), true);
    assert.strictEqual(!elm.classList.contains('horse'), true);
  });
  it('changes classes in selector', function() {
    let vnode1 = h('i', {class: {i: true, am: true, horse: true}});
    let vnode2 = h('i', {class: {i: true, am: true, horse: false}});
    xsdom.patch(vnode1);
    elm = xsdom.patch(vnode2).elm;
    assert.strictEqual(elm.classList.contains('i'), true);
    assert.strictEqual(elm.classList.contains('am'), true);
    assert.strictEqual(!elm.classList.contains('horse'), true);
  });
  it('removes missing classes', function() {
    let vnode1 = h('i', {class: {i: true, am: true, horse: true}});
    let vnode2 = h('i', {class: {i: true, am: true}});
    xsdom.patch(vnode1);
    elm = xsdom.patch(vnode2).elm;
    assert.strictEqual(elm.classList.contains('i'), true);
    assert.strictEqual(elm.classList.contains('am'), true);
    assert.strictEqual(!elm.classList.contains('horse'), true);
  });
  it('changes an elements props', function() {
    let vnode1 = h('a', {props: {src: 'http://other/'}});
    let vnode2 = h('a', {props: {src: 'http://localhost/'}});
    xsdom.patch(vnode1);
    elm = xsdom.patch(vnode2).elm;
    assert.equal(elm.src, 'http://localhost/');
  });
  it('removes an elements props', function() {
    let vnode1 = h('a', {props: {src: 'http://other/'}});
    let vnode2 = h('a');
    xsdom.patch(vnode1);
    xsdom.patch(vnode2);
    assert.equal(elm.src, undefined);
  });

  describe('short circuiting', function() {
    it('does not update strictly equal vnodes', function() {
      let result = [];
      function cb(vnode) { result.push(vnode); }
      let vnode1 = h('div', [
        h('span', {hook: {update: cb}}, 'Hello'),
        h('span', 'there'),
      ]);
      xsdom.patch(vnode1);
      xsdom.patch(vnode1);
      assert.equal(result.length, 0);
    });
    it('does not update strictly equal children', function() {
      let result = [];
      function cb(vnode) { result.push(vnode); }
      let vnode1 = h('div', [
        h('span', {hook: {patch: cb}}, 'Hello'),
        h('span', 'there'),
      ]);
      let vnode2 = h('div');
      vnode2.children = vnode1.children;
      xsdom.patch(vnode1);
      xsdom.patch(vnode2);
      assert.equal(result.length, 0);
    });
  });
});
