import * as assert from 'assert';

import XSDOM, {h} from '../../src/index';
import props from '../../src/module/properties';

describe('hooks', function() {
  let xsdom;
  let elm;
  beforeEach(function() {
    xsdom = new XSDOM([props]);
    elm = document.createElement('div');
    xsdom.setRootElement(elm);
  });

  describe('element hooks', function() {
    it('calls `create` listener before inserted into parent but after children', function() {
      let result = [];
      function cb(empty, vnode) {
        assert.strictEqual(vnode.elm instanceof Element, true);
        assert.equal(vnode.elm.children.length, 2);
        assert.strictEqual(vnode.elm.parentNode, null);
        result.push(vnode);
      }
      let vnode1 = h('div', [
        h('span', 'First sibling'),
        h('div', {hook: {create: cb}}, [
          h('span', 'Child 1'),
          h('span', 'Child 2'),
        ]),
        h('span', 'Can\'t touch me'),
      ]);
      xsdom.patch(vnode1);
      assert.equal(1, result.length);
    });

    it('calls `insert` listener after both parents, siblings and children have been inserted', function() {
      let result = [];
      function cb(vnode) {
        assert.strictEqual(vnode.elm instanceof Element, true);
        assert.equal(vnode.elm.children.length, 2);
        assert.equal(vnode.elm.parentNode.children.length, 3);
        result.push(vnode);
      }
      let vnode1 = h('div', [
        h('span', 'First sibling'),
        h('div', {hook: {insert: cb}}, [
          h('span', 'Child 1'),
          h('span', 'Child 2'),
        ]),
        h('span', 'Can touch me'),
      ]);
      xsdom.patch(vnode1);
      assert.equal(1, result.length);
    });

    it('calls `prepatch` listener', function() {
      let result = [];
      /* tslint:disable no-use-before-declare */
      function cb(oldVnode, vnode) {
        assert.strictEqual(oldVnode, vnode1.children[1]);
        assert.strictEqual(vnode, vnode2.children[1]);
        result.push(vnode);
      }
      /* tsline:enable */
      let vnode1 = h('div', [
        h('span', 'First sibling'),
        h('div', {hook: {prepatch: cb}}, [
          h('span', 'Child 1'),
          h('span', 'Child 2'),
        ]),
      ]);
      let vnode2 = h('div', [
        h('span', 'First sibling'),
        h('div', {hook: {prepatch: cb}}, [
          h('span', 'Child 1'),
          h('span', 'Child 2'),
        ]),
      ]);
      xsdom.patch(vnode1);
      xsdom.patch(vnode2);
      assert.equal(result.length, 1);
    });

    it('calls `postpatch` after `prepatch` listener', function() {
      let pre = [], post = [];
      function preCb(oldVnode, vnode) {
        pre.push(pre);
      }
      function postCb(oldVnode, vnode) {
        assert.equal(pre.length, post.length + 1);
        post.push(post);
      }
      let vnode1 = h('div', [
        h('span', 'First sibling'),
        h('div', {hook: {prepatch: preCb, postpatch: postCb}}, [
          h('span', 'Child 1'),
          h('span', 'Child 2'),
        ]),
      ]);
      let vnode2 = h('div', [
        h('span', 'First sibling'),
        h('div', {hook: {prepatch: preCb, postpatch: postCb}}, [
          h('span', 'Child 1'),
          h('span', 'Child 2'),
        ]),
      ]);
      xsdom.patch(vnode1);
      xsdom.patch(vnode2);
      assert.equal(pre.length, 1);
      assert.equal(post.length, 1);
    });

    it('calls `update` listener', function() {
      let result1 = [];
      let result2 = [];
      function cb(result, oldVnode, vnode) {
        if (result.length > 0) {
          assert.strictEqual(result[result.length - 1], oldVnode);
        }
        result.push(vnode);
      }
      let vnode1 = h('div', [
        h('span', 'First sibling'),
        h('div', {hook: {update: cb.bind(null, result1)}}, [
          h('span', 'Child 1'),
          h('span', {hook: {update: cb.bind(null, result2)}}, 'Child 2'),
        ]),
      ]);
      let vnode2 = h('div', [
        h('span', 'First sibling'),
        h('div', {hook: {update: cb.bind(null, result1)}}, [
          h('span', 'Child 1'),
          h('span', {hook: {update: cb.bind(null, result2)}}, 'Child 2'),
        ]),
      ]);
      xsdom.patch(vnode1);
      xsdom.patch(vnode2);
      assert.equal(result1.length, 1);
      assert.equal(result2.length, 1);
    });

    it('calls `remove` listener', function() {
      let result = [];
      function cb(vnode, rm) {
        let parent = vnode.elm.parentNode;
        assert.strictEqual(vnode.elm instanceof Element, true);
        assert.equal(vnode.elm.children.length, 2);
        assert.equal(parent.children.length, 2);
        result.push(vnode);
        rm();
        assert.equal(parent.children.length, 1);
      }
      let vnode1 = h('div', [
        h('span', 'First sibling'),
        h('div', {hook: {remove: cb}}, [
          h('span', 'Child 1'),
          h('span', 'Child 2'),
        ]),
      ]);
      let vnode2 = h('div', [
        h('span', 'First sibling'),
      ]);
      xsdom.patch(vnode1);
      xsdom.patch(vnode2);
      assert.equal(1, result.length);
    });

    it('calls `init` and `prepatch` listeners on root', function() {
        let count = 0;
        function init(vnode) {
          assert.strictEqual(vnode, vnode2);
          count += 1;
        }
        function prepatch(oldVnode, vnode) {
          assert.strictEqual(vnode, vnode1);
          count += 1;
        }
        let vnode1 = h('div', {hook: {init: init, prepatch: prepatch}});
        xsdom.patch(vnode1);
        assert.equal(1, count);
        let vnode2 = h('span', {hook: {init: init, prepatch: prepatch}});
        xsdom.patch(vnode2);
        assert.equal(2, count);
    });

    it('removes element when all remove listeners are done', function() {
      let rm1, rm2, rm3;
      let xsdom = new XSDOM([
        {remove: function(_, rm) { rm1 = rm; }},
        {remove: function(_, rm) { rm2 = rm; }},
      ]);
      xsdom.setRootElement(document.createElement('div'));
      let vnode1 = h('div', [h('a', {hook: {remove: function(_, rm) { rm3 = rm; }}})]);
      let vnode2 = h('div', []);
      elm = xsdom.patch(vnode1).elm;
      assert.equal(elm.children.length, 1);
      elm = xsdom.patch(vnode2).elm;
      assert.equal(elm.children.length, 1);
      rm1();
      assert.equal(elm.children.length, 1);
      rm3();
      assert.equal(elm.children.length, 1);
      rm2();
      assert.equal(elm.children.length, 0);
    });

    it('invokes remove hook on replaced root', function() {
      let result = [];
      const xsdom = new XSDOM([]);
      let parent = document.createElement('div');
      let element = document.createElement('div');
      parent.appendChild(element);
      xsdom.setRootElement(element);
      function cb(vnode, rm) {
        result.push(vnode);
        rm();
      }
      let vnode1 = h('div', {hook: {remove: cb}}, [
        h('b', 'Child 1'),
        h('i', 'Child 2'),
      ]);
      let vnode2 = h('span', [
        h('b', 'Child 1'),
        h('i', 'Child 2'),
      ]);
      xsdom.patch(vnode1);
      xsdom.patch(vnode2);
      assert.equal(1, result.length);
    });
  });

  describe('module hooks', function() {
    it('invokes `pre` and `post` hook', function() {
      let result = [];
      let xsdom = new XSDOM([
        {pre: function() { result.push('pre'); }},
        {post: function() { result.push('post'); }},
      ]);
      xsdom.setRootElement(document.createElement('div'));
      let vnode1 = h('div');
      xsdom.patch(vnode1);
      assert.deepEqual(result, ['pre', 'post']);
    });

    it('invokes global `destroy` hook for all removed children', function() {
      let result = [];
      function cb(vnode) { result.push(vnode); }
      let vnode1 = h('div', [
        h('span', 'First sibling'),
        h('div', [
          h('span', {hook: {destroy: cb}}, 'Child 1'),
          h('span', 'Child 2'),
        ]),
      ]);
      let vnode2 = h('div');
      xsdom.patch(vnode1);
      xsdom.patch(vnode2);
      assert.equal(result.length, 1);
    });

    it('handles text vnodes with `undefined` `data` property', function() {
      let vnode1 = h('div', [
        ' '
      ]);
      let vnode2 = h('div', []);
      xsdom.patch(vnode1);
      xsdom.patch(vnode2);
    });

    it('invokes `destroy` module hook for all removed children', function() {
      let created = 0;
      let destroyed = 0;
      let xsdom = new XSDOM([
        {create: function() { created++; }},
        {destroy: function() { destroyed++; }},
      ]);
      xsdom.setRootElement(document.createElement('div'));
      let vnode1 = h('div', [
        h('span', 'First sibling'),
        h('div', [
          h('span', 'Child 1'),
          h('span', 'Child 2'),
        ]),
      ]);
      let vnode2 = h('div');
      xsdom.patch(vnode1);
      xsdom.patch(vnode2);
      assert.equal(created, 4);
      assert.equal(destroyed, 4);
    });

    it('does not invoke `create` and `remove` module hook for text nodes', function() {
      let created = 0;
      let removed = 0;
      let xsdom = new XSDOM([
        {create: function() { created++; }},
        {remove: function() { removed++; }},
      ]);
      xsdom.setRootElement(document.createElement('div'));
      let vnode1 = h('div', [
        h('span', 'First child'),
        '',
        h('span', 'Third child'),
      ]);
      let vnode2 = h('div');
      xsdom.patch(vnode1);
      xsdom.patch(vnode2);
      assert.equal(created, 2);
      assert.equal(removed, 2);
    });
    it('does not invoke `destroy` module hook for text nodes', function() {
      let created = 0;
      let destroyed = 0;
      let xsdom = new XSDOM([
        {create: function() { created++; }},
        {destroy: function() { destroyed++; }},
      ]);
      xsdom.setRootElement(document.createElement('div'));
      let vnode1 = h('div', [
        h('span', 'First sibling'),
        h('div', [
          h('span', 'Child 1'),
          h('span', ['Text 1', 'Text 2']),
        ]),
      ]);
      let vnode2 = h('div');
      xsdom.patch(vnode1);
      xsdom.patch(vnode2);
      assert.equal(created, 4);
      assert.equal(destroyed, 4);
    });
  });
});
