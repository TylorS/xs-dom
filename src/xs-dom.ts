import * as api from './api/dom';
import {sameVNode} from './util/index';
import {Callbacks} from './Callbacks';
import {ElementCreator} from './ElementCreator';
import {VNodePatcher} from './VNodePatcher';

import {VNode, createVNode} from './VNode';
import {Module} from './Module';

function emptyVNodeAt(elm: Element): VNode {
  return createVNode({
    sel: api.tagName(elm).toLowerCase(),
    elm,
  });
}

export class XSDOM {
  private insertedVNodeQueue: VNode[];
  private callbacks: Callbacks;
  private elementCreator: ElementCreator;
  private vNodePatcher: VNodePatcher;
  private oldVNode: VNode;

  constructor (modules: Array<Module>) {
    this.insertedVNodeQueue = [];
    this.callbacks = new Callbacks(modules);
    this.elementCreator = new ElementCreator(this.insertedVNodeQueue, this.callbacks);
    this.vNodePatcher = new VNodePatcher(this.elementCreator, this.callbacks, this.insertedVNodeQueue);
  }

  public setRootElement (element: Element) {
    this.oldVNode = emptyVNodeAt(element);
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
