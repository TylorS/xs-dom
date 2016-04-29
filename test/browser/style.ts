import * as assert from 'assert';
import fakeRaf from '../helpers/fake-raf';

import {init, h} from '../../src/index';
import styleModule from '../../src/module/style';

fakeRaf.use();
let patch = init([styleModule]);

describe('style', function() {
  let elm, vnode0;
  beforeEach(function() {
    elm = document.createElement('div');
    vnode0 = elm;
  });

  after(() => {
    fakeRaf.restore();
  });

  it('is being styled', function() {
    elm = patch(vnode0, h('div', {style: {fontSize: '12px'}})).elm;
    assert.equal(elm.style.fontSize, '12px');
  });

  it('updates styles', function() {
    let vnode1 = h('i', {style: {fontSize: '14px', display: 'inline'}});
    let vnode2 = h('i', {style: {fontSize: '12px', display: 'block'}});
    let vnode3 = h('i', {style: {fontSize: '10px', display: 'block'}});
    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.style.fontSize, '14px');
    assert.equal(elm.style.display, 'inline');
    elm = patch(vnode1, vnode2).elm;
    assert.equal(elm.style.fontSize, '12px');
    assert.equal(elm.style.display, 'block');
    elm = patch(vnode2, vnode3).elm;
    assert.equal(elm.style.fontSize, '10px');
    assert.equal(elm.style.display, 'block');
  });

  it('explicialy removes styles', function() {
    let vnode1 = h('i', {style: {fontSize: '14px'}});
    let vnode2 = h('i', {style: {fontSize: ''}});
    let vnode3 = h('i', {style: {fontSize: '10px'}});
    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.style.fontSize, '14px');
    patch(vnode1, vnode2);
    assert.equal(elm.style.fontSize, '');
    patch(vnode2, vnode3);
    assert.equal(elm.style.fontSize, '10px');
  });

  it('implicially removes styles from element', function() {
    let vnode1 = h('div', [h('i', {style: {fontSize: '14px'}})]);
    let vnode2 = h('div', [h('i')]);
    let vnode3 = h('div', [h('i', {style: {fontSize: '10px'}})]);
    patch(vnode0, vnode1);
    assert.equal(elm.firstChild.style.fontSize, '14px');
    patch(vnode1, vnode2);
    assert.equal(elm.firstChild.style.fontSize, '');
    patch(vnode2, vnode3);
    assert.equal(elm.firstChild.style.fontSize, '10px');
  });

  it('updates delayed styles in next frame', function() {
    let patch = init([
      styleModule
    ]);
    let vnode1 = h('i', {style: {fontSize: '14px', delayed: {fontSize: '16px'}}});
    let vnode2 = h('i', {style: {fontSize: '18px', delayed: {fontSize: '20px'}}});
    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.style.fontSize, '14px');
    fakeRaf.step();
    fakeRaf.step();
    assert.equal(elm.style.fontSize, '16px');
    elm = patch(vnode1, vnode2).elm;
    assert.equal(elm.style.fontSize, '18px');
    fakeRaf.step();
    fakeRaf.step();
    assert.equal(elm.style.fontSize, '20px');
  });
});
