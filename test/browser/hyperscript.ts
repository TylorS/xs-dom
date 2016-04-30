import * as assert from 'assert';

import {h, VNode} from '../../src/index';

describe('hyperscript', () => {
  it('can create vnode with proper tag', () => {
    assert.strictEqual(h('div').sel, 'div');
    assert.strictEqual(h('a').sel, 'a');
  });

  it('can create vnode with children', () => {
    let vnode = h('div', [h('span#hello'), h('b.world')]);
    assert.equal(vnode.sel, 'div');
    assert.equal((<VNode> vnode.children[0]).sel, 'span#hello');
    assert.equal((<VNode> vnode.children[1]).sel, 'b.world');
  })

  it('can create vnode with text content', function() {
    let vnode = h('a', ['I am a string']);
    assert.equal((<VNode> vnode.children[0]).text, 'I am a string');
  });

  it('can create vnode with text content in string', function() {
    let vnode = h('a', 'I am a string');
    assert.equal(vnode.text, 'I am a string');
  });

  it('can create vnode with props and text content in string', function() {
    let vnode = h('a', {}, 'I am a string');
    assert.equal(vnode.text, 'I am a string');
  });
})
