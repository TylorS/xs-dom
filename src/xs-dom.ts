import * as api from './api/dom';
import {sameVNode} from './util/index';
import {Callbacks} from './Callbacks';
import {ElementCreator} from './ElementCreator';
import {VNodePatcher} from './VNodePatcher';
import {curry2} from './util/index';

import {VNode, createVNode} from './VNode';
import {Module} from './Module';

function emptyVNodeAt(elm: Element): VNode {
  return createVNode({
    sel: api.tagName(elm).toLowerCase(),
    elm,
  });
}

export const init = curry2(
  function init(modules: Module[], rootElement: Element) {
    const insertedVNodeQueue: VNode[] = [];
    const callbacks = new Callbacks(modules);
    const elementCreator = new ElementCreator(insertedVNodeQueue, callbacks);
    const vNodePatcher = new VNodePatcher(elementCreator, callbacks);
    const vNode = emptyVNodeAt(rootElement);
    return new XSDOM(insertedVNodeQueue, callbacks, elementCreator, vNodePatcher, vNode);
  }
);

class XSDOM {
  constructor (private insertedVNodeQueue: VNode[],
               private callbacks: Callbacks,
               private elementCreator: ElementCreator,
               private vNodePatcher: VNodePatcher,
               private oldVNode: VNode) {
  }

  public patch (vNode: VNode) {
    const oldVNode = this.oldVNode;

    this.callbacks.pre();

    if (sameVNode(oldVNode, vNode)) {
      vNode = this.vNodePatcher.patch(oldVNode, vNode);
    } else {
      const parent = api.parentNode(oldVNode.elm);
      const element = this.elementCreator.create(vNode);
      vNode.elm = element;
      if (parent !== null) {
        api.insertBefore(parent, element, (<Element> api.nextSibling(oldVNode.elm)));
        this.vNodePatcher.remove((<Element> parent), [oldVNode], 0, 0);
      }
    }

    this.callbacks.insert(this.insertedVNodeQueue);
    this.callbacks.post();

    this.insertedVNodeQueue = [];
    this.oldVNode = vNode;

    return vNode;
  }
}
