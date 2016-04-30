import * as assert from 'assert';

import {init, h} from '../../src/index';
import props from '../../src/module/properties';
import klass from '../../src/module/classes';

import {shuffle} from '../helpers/shuffle';

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

function spanNum(n) {
  if (typeof n === 'string') {
    return h('span', {}, n);
  } else {
    return h('span', {key: n}, n.toString());
  }
}

function spanNumWithOpacity(n, o) {
  return h('span', {key: n, style: {opacity: o}}, n.toString());
}

describe('updating children with keys', function() {
  let xsdom;
  let elm;
  beforeEach(function() {
    elm = document.createElement('div');
    xsdom = init([props, klass], elm);
  });

  describe('addition of elements', function() {
    it('appends elements', function() {
      let vnode1 = h('span', [1].map(spanNum));
      let vnode2 = h('span', [1, 2, 3].map(spanNum));
      elm = xsdom.patch(vnode1).elm;
      assert.equal(elm.children.length, 1);
      elm = xsdom.patch(vnode2).elm;
      assert.equal(elm.children.length, 3);
      assert.equal(elm.children[1].innerHTML, '2');
      assert.equal(elm.children[2].innerHTML, '3');
    });

    it('prepends elements', function() {
      let vnode1 = h('span', [4, 5].map(spanNum));
      let vnode2 = h('span', [1, 2, 3, 4, 5].map(spanNum));
      elm = xsdom.patch(vnode1).elm;
      assert.equal(elm.children.length, 2);
      elm = xsdom.patch(vnode2).elm;
      assert.deepEqual(map(inner, elm.children), ['1', '2', '3', '4', '5']);
    });

    it('add elements in the middle', function() {
      let vnode1 = h('span', [1, 2, 4, 5].map(spanNum));
      let vnode2 = h('span', [1, 2, 3, 4, 5].map(spanNum));
      elm = xsdom.patch(vnode1).elm;
      assert.equal(elm.children.length, 4);
      assert.equal(elm.children.length, 4);
      elm = xsdom.patch(vnode2).elm;
      assert.deepEqual(map(inner, elm.children), ['1', '2', '3', '4', '5']);
    });

    it('add elements at begin and end', function() {
      let vnode1 = h('span', [2, 3, 4].map(spanNum));
      let vnode2 = h('span', [1, 2, 3, 4, 5].map(spanNum));
      elm = xsdom.patch(vnode1).elm;
      assert.equal(elm.children.length, 3);
      elm = xsdom.patch(vnode2).elm;
      assert.deepEqual(map(inner, elm.children), ['1', '2', '3', '4', '5']);
    });

    it('adds children to parent with no children', function() {
      let vnode1 = h('span', {key: 'span'});
      let vnode2 = h('span', {key: 'span'}, [1, 2, 3].map(spanNum));
      elm = xsdom.patch(vnode1).elm;
      assert.equal(elm.children.length, 0);
      elm = xsdom.patch(vnode2).elm;
      assert.deepEqual(map(inner, elm.children), ['1', '2', '3']);
    });

    it('removes all children from parent', function() {
      let vnode1 = h('span', {key: 'span'}, [1, 2, 3].map(spanNum));
      let vnode2 = h('span', {key: 'span'}, []);
      elm = xsdom.patch(vnode1).elm;
      assert.deepEqual(map(inner, elm.children), ['1', '2', '3']);
      elm = xsdom.patch(vnode2).elm;
      assert.equal(elm.children.length, 0);
    });
  });

  describe('removal of elements', function() {
    it('removes elements from the beginning', function() {
      let vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
      let vnode2 = h('span', [3, 4, 5].map(spanNum));
      elm = xsdom.patch(vnode1).elm;
      assert.equal(elm.children.length, 5);
      elm = xsdom.patch(vnode2).elm;
      assert.deepEqual(map(inner, elm.children), ['3', '4', '5']);
    });

    it('removes elements from the end', function() {
      let vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
      let vnode2 = h('span', [1, 2, 3].map(spanNum));
      elm = xsdom.patch(vnode1).elm;
      assert.equal(elm.children.length, 5);
      elm = xsdom.patch(vnode2).elm;
      assert.equal(elm.children.length, 3);
      assert.equal(elm.children[0].innerHTML, '1');
      assert.equal(elm.children[1].innerHTML, '2');
      assert.equal(elm.children[2].innerHTML, '3');
    });

    it('removes elements from the middle', function() {
      let vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
      let vnode2 = h('span', [1, 2, 4, 5].map(spanNum));
      elm = xsdom.patch(vnode1).elm;
      assert.equal(elm.children.length, 5);
      elm = xsdom.patch(vnode2).elm;
      assert.equal(elm.children.length, 4);
      assert.deepEqual(elm.children[0].innerHTML, '1');
      assert.equal(elm.children[0].innerHTML, '1');
      assert.equal(elm.children[1].innerHTML, '2');
      assert.equal(elm.children[2].innerHTML, '4');
      assert.equal(elm.children[3].innerHTML, '5');
    });
  });

  describe('element reordering', function() {
    it('moves element forward', function() {
      let vnode1 = h('span', [1, 2, 3, 4].map(spanNum));
      let vnode2 = h('span', [2, 3, 1, 4].map(spanNum));
      elm = xsdom.patch(vnode1).elm;
      assert.equal(elm.children.length, 4);
      elm = xsdom.patch(vnode2).elm;
      assert.equal(elm.children.length, 4);
      assert.equal(elm.children[0].innerHTML, '2');
      assert.equal(elm.children[1].innerHTML, '3');
      assert.equal(elm.children[2].innerHTML, '1');
      assert.equal(elm.children[3].innerHTML, '4');
    });

    it('moves element to end', function() {
      let vnode1 = h('span', [1, 2, 3].map(spanNum));
      let vnode2 = h('span', [2, 3, 1].map(spanNum));
      elm = xsdom.patch(vnode1).elm;
      assert.equal(elm.children.length, 3);
      elm = xsdom.patch(vnode2).elm;
      assert.equal(elm.children.length, 3);
      assert.equal(elm.children[0].innerHTML, '2');
      assert.equal(elm.children[1].innerHTML, '3');
      assert.equal(elm.children[2].innerHTML, '1');
    });

    it('moves element backwards', function() {
      let vnode1 = h('span', [1, 2, 3, 4].map(spanNum));
      let vnode2 = h('span', [1, 4, 2, 3].map(spanNum));
      elm = xsdom.patch(vnode1).elm;
      assert.equal(elm.children.length, 4);
      elm = xsdom.patch(vnode2).elm;
      assert.equal(elm.children.length, 4);
      assert.equal(elm.children[0].innerHTML, '1');
      assert.equal(elm.children[1].innerHTML, '4');
      assert.equal(elm.children[2].innerHTML, '2');
      assert.equal(elm.children[3].innerHTML, '3');
    });

    it('swaps first and last', function() {
      let vnode1 = h('span', [1, 2, 3, 4].map(spanNum));
      let vnode2 = h('span', [4, 2, 3, 1].map(spanNum));
      elm = xsdom.patch(vnode1).elm;
      assert.equal(elm.children.length, 4);
      elm = xsdom.patch(vnode2).elm;
      assert.equal(elm.children.length, 4);
      assert.equal(elm.children[0].innerHTML, '4');
      assert.equal(elm.children[1].innerHTML, '2');
      assert.equal(elm.children[2].innerHTML, '3');
      assert.equal(elm.children[3].innerHTML, '1');
    });
  });

  describe('combinations of additions, removals and reorderings', function() {
    it('move to left and replace', function() {
      let vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
      let vnode2 = h('span', [4, 1, 2, 3, 6].map(spanNum));
      elm = xsdom.patch(vnode1).elm;
      assert.equal(elm.children.length, 5);
      elm = xsdom.patch(vnode2).elm;
      assert.equal(elm.children.length, 5);
      assert.equal(elm.children[0].innerHTML, '4');
      assert.equal(elm.children[1].innerHTML, '1');
      assert.equal(elm.children[2].innerHTML, '2');
      assert.equal(elm.children[3].innerHTML, '3');
      assert.equal(elm.children[4].innerHTML, '6');
    });

    it('moves to left and leaves hole', function() {
      let vnode1 = h('span', [1, 4, 5].map(spanNum));
      let vnode2 = h('span', [4, 6].map(spanNum));
      elm = xsdom.patch(vnode1).elm;
      assert.equal(elm.children.length, 3);
      elm = xsdom.patch(vnode2).elm;
      assert.deepEqual(map(inner, elm.children), ['4', '6']);
    });

    it('handles moved and set to undefined element ending at the end', function() {
      let vnode1 = h('span', [2, 4, 5].map(spanNum));
      let vnode2 = h('span', [4, 5, 3].map(spanNum));
      elm = xsdom.patch(vnode1).elm;
      assert.equal(elm.children.length, 3);
      elm = xsdom.patch(vnode2).elm;
      assert.equal(elm.children.length, 3);
      assert.equal(elm.children[0].innerHTML, '4');
      assert.equal(elm.children[1].innerHTML, '5');
      assert.equal(elm.children[2].innerHTML, '3');
    });

    it('moves a key in non-keyed nodes with a size up', function() {
      let vnode1 = h('span', [1, 'a', 'b', 'c'].map(spanNum));
      let vnode2 = h('span', ['d', 'a', 'b', 'c', 1, 'e'].map(spanNum));
      elm = xsdom.patch(vnode1).elm;
      assert.equal(elm.childNodes.length, 4);
      assert.equal(elm.textContent, '1abc');
      elm = xsdom.patch(vnode2).elm;
      assert.equal(elm.childNodes.length, 6);
      assert.equal(elm.textContent, 'dabc1e');
    });
  });

  it('reverses elements', function() {
    let vnode1 = h('span', [1, 2, 3, 4, 5, 6, 7, 8].map(spanNum));
    let vnode2 = h('span', [8, 7, 6, 5, 4, 3, 2, 1].map(spanNum));
    elm = xsdom.patch(vnode1).elm;
    assert.equal(elm.children.length, 8);
    elm = xsdom.patch(vnode2).elm;
    assert.deepEqual(map(inner, elm.children), ['8', '7', '6', '5', '4', '3', '2', '1']);
  });

  it('something', function() {
    let vnode1 = h('span', [0, 1, 2, 3, 4, 5].map(spanNum));
    let vnode2 = h('span', [4, 3, 2, 1, 5, 0].map(spanNum));
    elm = xsdom.patch(vnode1).elm;
    assert.equal(elm.children.length, 6);
    elm = xsdom.patch(vnode2).elm;
    assert.deepEqual(map(inner, elm.children), ['4', '3', '2', '1', '5', '0']);
  });

  it('handles random shuffles', function() {
    let n, arr = [], opacities = [], elms = 14, samples = 5;
    for (n = 0; n < elms; ++n) { arr[n] = n; }
    for (n = 0; n < samples; ++n) {
      let vnode1 = h('span', arr.map(function(n) {
        return spanNumWithOpacity(n, '1');
      }));
      elm = (<HTMLElement> document.createElement('div'));
      const xsdom = init([], elm);
      let shufArr = shuffle(arr.slice(0));
      elm = xsdom.patch(vnode1).elm;
      for (let i = 0; i < elms; ++i) {
        assert.equal(elm.children[i].innerHTML, i.toString());
        opacities[i] = Math.random().toFixed(5).toString();
      }
      let vnode2 = h('span', arr.map(function(n) {
        return spanNumWithOpacity(shufArr[n], opacities[n]);
      }));
      elm = xsdom.patch(vnode2).elm;
      for (let i = 0; i < elms; ++i) {
        assert.equal(elm.children[i].innerHTML, shufArr[i].toString());
        assert.equal(opacities[i].indexOf((<HTMLElement> elm.children[i]).style.opacity), 0);
      }
    }
  });
});
