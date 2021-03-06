import * as assert from 'assert';

import {init, h, thunk} from '../../src/index';

describe('thunk', function() {
  let xsdom;
  let elm;
  beforeEach(function() {
    elm = document.createElement('div');
    xsdom = init([], elm);
  });
  it('returns vnode with data and render function', function() {
    function numberInSpan(n) {
      return h('span', 'Number is ' + n);
    }
    let vnode = thunk('span', 'num', numberInSpan, 22);
    assert.deepEqual(vnode.sel, 'span');
    assert.deepEqual(vnode.data.key, 'num');
    assert.deepEqual(vnode.data.args, [22]);
  });
  it('only calls render function on data change', function() {
    let called = 0;
    function numberInSpan(n) {
      called++;
      return h('span', {key: 'num'}, 'Number is ' + n);
    }
    let vnode1 = h('div', [
      thunk('span', 'num', numberInSpan, 1)
    ]);
    let vnode2 = h('div', [
      thunk('span', 'num', numberInSpan, 1)
    ]);
    let vnode3 = h('div', [
      thunk('span', 'num', numberInSpan, 2)
    ]);
    xsdom.patch(vnode1);
    xsdom.patch(vnode2);
    xsdom.patch(vnode3);
    assert.equal(called, 2);
  });
  it('renders correctly', function() {
    let called = 0;
    function numberInSpan(n) {
      called++;
      return h('span', {key: 'num'}, 'Number is ' + n);
    }
    let vnode1 = h('div', [
      thunk('span', 'num', numberInSpan, 1)
    ]);
    let vnode2 = h('div', [
      thunk('span', 'num', numberInSpan, 1)
    ]);
    let vnode3 = h('div', [
      thunk('span', 'num', numberInSpan, 2)
    ]);
    elm = xsdom.patch(vnode1).elm;
    assert.equal(elm.firstChild.tagName.toLowerCase(), 'span');
    assert.equal(elm.firstChild.innerHTML, 'Number is 1');
    elm = xsdom.patch(vnode2).elm;
    assert.equal(elm.firstChild.tagName.toLowerCase(), 'span');
    assert.equal(elm.firstChild.innerHTML, 'Number is 1');
    elm = xsdom.patch(vnode3).elm;
    assert.equal(elm.firstChild.tagName.toLowerCase(), 'span');
    assert.equal(elm.firstChild.innerHTML, 'Number is 2');
    assert.equal(called, 2);
  });
  it('renders child thunk correctly', function() {
    function oddEven(n) {
      let prefix = (n % 2) === 0 ? 'even' : 'odd';
      return h('span', {key: 'oddeven'}, prefix + ': ' + n);
    }
    function numberInSpan(n) {
      return h('span.number', ['Number is ', thunk('span', 'oddeven', oddEven, n)]);
    }
    let vnode1 = thunk('span.number', 'num', numberInSpan, 1);
    let vnode2 = thunk('span.number', 'num', numberInSpan, 2);
    elm = xsdom.patch(vnode1).elm;
    assert.equal(elm.tagName.toLowerCase(), 'span');
    assert.equal(elm.className, 'number');
    assert.equal(elm.childNodes[1].tagName.toLowerCase(), 'span');
    assert.equal(elm.childNodes[1].innerHTML, 'odd: 1');
    elm = xsdom.patch(vnode2).elm;
    assert.equal(elm.tagName.toLowerCase(), 'span');
    assert.equal(elm.className, 'number');
    assert.equal(elm.childNodes[1].tagName.toLowerCase(), 'span');
    assert.equal(elm.childNodes[1].innerHTML, 'even: 2');
  });
  it('renders correctly when root', function() {
    let called = 0;
    function numberInSpan(n) {
      called++;
      return h('span', {key: 'num'}, 'Number is ' + n);
    }
    let vnode1 = thunk('span', 'num', numberInSpan, 1);
    let vnode2 = thunk('span', 'num', numberInSpan, 1);
    let vnode3 = thunk('span', 'num', numberInSpan, 2);

    elm = xsdom.patch(vnode1).elm;
    assert.equal(elm.tagName.toLowerCase(), 'span');
    assert.equal(elm.innerHTML, 'Number is 1');

    elm = xsdom.patch(vnode2).elm;
    assert.equal(elm.tagName.toLowerCase(), 'span');
    assert.equal(elm.innerHTML, 'Number is 1');

    elm = xsdom.patch(vnode3).elm;
    assert.equal(elm.tagName.toLowerCase(), 'span');
    assert.equal(elm.innerHTML, 'Number is 2');
    assert.equal(called, 2);
  });
  it('can be replaced and removed', function() {
    function numberInSpan(n) {
      return h('span', {key: 'num'}, 'Number is ' + n);
    }
    function oddEven(n) {
      let prefix = (n % 2) === 0 ? 'Even' : 'Odd';
      return h('div', {key: oddEven}, prefix + ': ' + n);
    }
    let vnode1 = h('div', [thunk('span', 'num', numberInSpan, 1)]);
    let vnode2 = h('div', [thunk('div', 'oddEven', oddEven, 4)]);

    elm = xsdom.patch(vnode1).elm;
    assert.equal(elm.firstChild.tagName.toLowerCase(), 'span');
    assert.equal(elm.firstChild.innerHTML, 'Number is 1');

    elm = xsdom.patch(vnode2).elm;
    assert.equal(elm.firstChild.tagName.toLowerCase(), 'div');
    assert.equal(elm.firstChild.innerHTML, 'Even: 4');
  });
  it('can be replaced and removed when root', function() {
    function numberInSpan(n) {
      return h('span', {key: 'num'}, 'Number is ' + n);
    }
    function oddEven(n) {
      let prefix = (n % 2) === 0 ? 'Even' : 'Odd';
      return h('div', {key: oddEven}, prefix + ': ' + n);
    }
    let vnode1 = thunk('span', 'num', numberInSpan, 1);
    let vnode2 = thunk('div', 'oddEven', oddEven, 4);

    elm = xsdom.patch(vnode1).elm;
    assert.equal(elm.tagName.toLowerCase(), 'span');
    assert.equal(elm.innerHTML, 'Number is 1');

    elm = xsdom.patch(vnode2).elm;
    assert.equal(elm.tagName.toLowerCase(), 'div');
    assert.equal(elm.innerHTML, 'Even: 4');
  });
  it('invokes destroy hook on thunks', function() {
    let called = 0;
    function destroyHook() {
      called++;
    }
    function numberInSpan(n) {
      return h('span', {key: 'num', hook: {destroy: destroyHook}}, 'Number is ' + n);
    }
    let vnode1 = h('div', [
      h('div', 'Foo'),
      thunk('span', 'num', numberInSpan, 1),
      h('div', 'Foo')
    ]);
    let vnode2 = h('div', [
      h('div', 'Foo'),
      h('div', 'Foo')
    ]);
    xsdom.patch(vnode1);
    xsdom.patch(vnode2);
    assert.equal(called, 1);
  });
  it('invokes remove hook on thunks', function() {
    let called = 0;
    function hook() {
      called++;
    }
    function numberInSpan(n) {
      return h('span', {key: 'num', hook: {remove: hook}}, 'Number is ' + n);
    }
    let vnode1 = h('div', [
      h('div', 'Foo'),
      thunk('span', 'num', numberInSpan, 1),
      h('div', 'Foo')
    ]);
    let vnode2 = h('div', [
      h('div', 'Foo'),
      h('div', 'Foo')
    ]);
    xsdom.patch(vnode1);
    xsdom.patch(vnode2);
    assert.equal(called, 1);
  });
});
