import * as assert from 'assert';

import XSDOM, {h} from '../../src/index';
import props from '../../src/module/properties';
import klass from '../../src/module/classes';

describe('creating elements', function() {
  let xsdom;
  let elm;
  beforeEach(function() {
    elm = document.createElement('div');
    xsdom = new XSDOM([props, klass], elm);
  });

  it('has tag', function() {
    elm = xsdom.patch(h('div')).elm;
    assert.equal(elm.tagName, 'DIV');
  });

  it('has different tag and id', function() {
    let vnode1 = h('span#id');
    elm = xsdom.patch(vnode1).elm;
    assert.equal(elm.tagName, 'SPAN');
    assert.equal(elm.id, 'id');
  });

  it('has id', function() {
    elm = xsdom.patch(h('div', [h('div#unique')])).elm;
    assert.equal(elm.firstChild.id, 'unique');
  });

  it('has correct namespace', function() {
    elm = xsdom.patch(h('div', [h('div', {ns: 'http://www.w3.org/2000/svg'})])).elm;
    assert.equal(elm.firstChild.namespaceURI, 'http://www.w3.org/2000/svg');
  });

  it('is recieves classes in selector', function() {
    elm = xsdom.patch(h('div', [h('i.am.a.class')])).elm;
    assert.strictEqual(elm.firstChild.classList.contains('am'), true);
    assert.strictEqual(elm.firstChild.classList.contains('a'), true);
    assert.strictEqual(elm.firstChild.classList.contains('class'), true);
  });

  it('is recieves classes in class property', function() {
    elm = xsdom.patch(h('i', {class: {am: true, a: true, class: true, not: false}})).elm;
    assert.strictEqual(elm.classList.contains('am'), true);
    assert.strictEqual(elm.classList.contains('a'), true);
    assert.strictEqual(elm.classList.contains('class'), true);
    assert.strictEqual(!elm.classList.contains('not'), true);
  });

  it('handles classes from both selector and property', function() {
    elm = xsdom.patch(h('div', [h('i.has', {class: {classes: true}})])).elm;
    assert.strictEqual(elm.firstChild.classList.contains('has'), true);
    assert.strictEqual(elm.firstChild.classList.contains('classes'), true);
  });

  it('can create elements with text content', function() {
    elm = xsdom.patch(h('div', ['I am a string'])).elm;
    assert.equal(elm.innerHTML, 'I am a string');
  });

  it('can create elements with span and text content', function() {
    elm = xsdom.patch(h('a', [h('span'), 'I am a string'])).elm;
    assert.equal(elm.childNodes[0].tagName, 'SPAN');
    assert.equal(elm.childNodes[1].textContent, 'I am a string');
  });

  it('can create elements with props', function() {
    elm = xsdom.patch(h('a', {props: {src: 'http://localhost/'}})).elm;
    assert.equal(elm.src, 'http://localhost/');
  });
});
