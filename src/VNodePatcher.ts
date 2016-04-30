import {VNode} from './VNode';
import {Callbacks, createRemoveCallback} from './Callbacks';
import {ElementCreator} from './ElementCreator';
import {VNodeUpdater} from './VNodeUpdater';

import * as api from './api/dom';
import {isDef, isUndef, sameVNode, pluck, forEach} from './util/index';

const pluckPrepatch = pluck('hook', 'prepatch');
const pluckPostpatch = pluck('hook', 'postpatch');
const pluckUpdate = pluck('hook', 'update');
const pluckRemove = pluck('hook', 'remove');
const pluckDestroy = pluck('hook', 'destroy');

export class VNodePatcher {
  private vNodeUpdater: VNodeUpdater;
  constructor(private elementCreator: ElementCreator,
              private callbacks: Callbacks) {
    this.vNodeUpdater = new VNodeUpdater(this);
  }

  public patch(oldVNode: VNode, vNode: VNode): VNode {
    const prepatch = pluckPrepatch(vNode.data);
    if (isDef(prepatch)) { prepatch(oldVNode, vNode); }

    let elm = vNode.elm = oldVNode.elm;
    const oldChildren = oldVNode.children;
    const children = vNode.children;

    if (oldVNode === vNode) return; // used for thunks only

    if (!sameVNode(oldVNode, vNode)) {
      const parentElm = api.parentNode(oldVNode.elm);
      elm = this.elementCreator.create(vNode);
      api.insertBefore(parentElm, elm, oldVNode.elm);
      this.remove((<Element> parentElm), [oldVNode], 0, 0);
      return;
    }

    this.callbacks.update(oldVNode, vNode);

    const update = pluckUpdate(vNode.data);
    if (update) { update(oldVNode, vNode); }

    if (isUndef(vNode.text)) { // is a real element
      if (isDef(oldVNode.text)) { api.setTextContent(elm, ''); }

      if (isDef(oldChildren) && isDef(children) && oldChildren !== children) {
        this.vNodeUpdater.update((<Element> elm), oldChildren, children);
      } else if (isDef(children)) {
        this.add((<Element> elm), null, children, 0, children.length - 1);
      } else if (isDef(oldChildren)) {
        this.remove((<Element> elm), oldChildren, 0, oldChildren.length - 1);
      }
    } else if (isDef(vNode.text) && oldVNode.text !== vNode.text) {
      api.setTextContent(elm, vNode.text);
    }

    const postpatch = pluckPostpatch(vNode.data);
    if (postpatch) { postpatch(oldVNode, vNode); }

    return vNode;
  }

  public create(vNode: VNode) {
    return this.elementCreator.create(vNode);
  }

  public add(parentElm: Element, before: Element, vNodes: VNode[],
             startIdx: number, endIdx: number = 0) {
   for (; startIdx <= endIdx; ++startIdx) {
     api.insertBefore(parentElm, this.create(vNodes[startIdx]), before);
   }
  }

  public remove(parentElm: Element, vNodes: VNode[], startIdx: number, endIdx: number) {
    for (; startIdx <= endIdx; ++startIdx) {
      let currentVNode: VNode = vNodes[startIdx];
      if (isDef(currentVNode)) {
        if (isDef(currentVNode.sel)) {
          this.invokeDestroyHook(currentVNode);

          const listeners = this.callbacks.getListeners();
          const removeCallback = createRemoveCallback(currentVNode.elm, listeners);

          this.callbacks.remove(currentVNode, removeCallback);

          const remove = pluckRemove(currentVNode.data);
          if (remove) {
            remove(currentVNode, removeCallback);
          } else {
            removeCallback();
          }
        } else {
          api.removeChild(parentElm, currentVNode.elm);
        }
      }
    }
  }

  private invokeDestroyHook(vNode: VNode) {
    if (vNode.sel === void 0) { return; }

    const destroy = pluckDestroy(vNode.data);
    if (destroy) { destroy(vNode); }

    this.callbacks.destroy(vNode);

    if (isDef(vNode.children)) {
      forEach(c => this.invokeDestroyHook(c), vNode.children);
    }
  }
}
