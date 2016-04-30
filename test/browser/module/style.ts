import * as assert from 'assert';
import fakeRaf from '../../helpers/fake-raf';

import {init, h} from '../../../src/index';
import styleModule from '../../../src/module/style';

fakeRaf.use();

describe('style', function() {
  let xsdom, elm;
  beforeEach(function() {
    elm = document.createElement('div');
    xsdom = init([styleModule], elm);
  });

  after(() => {
    fakeRaf.restore();
  });

  it('is being styled', function() {
    elm = xsdom.patch(h('div', {style: {fontSize: '12px'}})).elm;
    assert.equal(elm.style.fontSize, '12px');
  });

  it('updates styles', function() {
    let vnode1 = h('i', {style: {fontSize: '14px', display: 'inline'}});
    let vnode2 = h('i', {style: {fontSize: '12px', display: 'block'}});
    let vnode3 = h('i', {style: {fontSize: '10px', display: 'block'}});
    elm = xsdom.patch(vnode1).elm;
    assert.equal(elm.style.fontSize, '14px');
    assert.equal(elm.style.display, 'inline');
    elm = xsdom.patch(vnode2).elm;
    assert.equal(elm.style.fontSize, '12px');
    assert.equal(elm.style.display, 'block');
    elm = xsdom.patch(vnode3).elm;
    assert.equal(elm.style.fontSize, '10px');
    assert.equal(elm.style.display, 'block');
  });

  it('explicialy removes styles', function() {
    let vnode1 = h('i', {style: {fontSize: '14px'}});
    let vnode2 = h('i', {style: {fontSize: ''}});
    let vnode3 = h('i', {style: {fontSize: '10px'}});
    elm = xsdom.patch(vnode1).elm;
    assert.equal(elm.style.fontSize, '14px');
    xsdom.patch(vnode2);
    assert.equal(elm.style.fontSize, '');
    xsdom.patch(vnode3);
    assert.equal(elm.style.fontSize, '10px');
  });

  it('implicially removes styles from element', function() {
    let vnode1 = h('div', [h('i', {style: {fontSize: '14px'}})]);
    let vnode2 = h('div', [h('i')]);
    let vnode3 = h('div', [h('i', {style: {fontSize: '10px'}})]);
    xsdom.patch(vnode1);
    assert.equal(elm.firstChild.style.fontSize, '14px');
    xsdom.patch(vnode2);
    assert.equal(elm.firstChild.style.fontSize, '');
    xsdom.patch(vnode3);
    assert.equal(elm.firstChild.style.fontSize, '10px');
  });

  it('updates delayed styles in next frame', function() {
    let vnode1 = h('i', {style: {fontSize: '14px', delayed: {fontSize: '16px'}}});
    let vnode2 = h('i', {style: {fontSize: '18px', delayed: {fontSize: '20px'}}});
    elm = xsdom.patch(vnode1).elm;
    assert.equal(elm.style.fontSize, '14px');
    fakeRaf.step();
    fakeRaf.step();
    assert.equal(elm.style.fontSize, '16px');
    elm = xsdom.patch(vnode2).elm;
    assert.equal(elm.style.fontSize, '18px');
    fakeRaf.step();
    fakeRaf.step();
    assert.equal(elm.style.fontSize, '20px');
  });
});
