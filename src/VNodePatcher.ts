import {VNode} from './VNode';
import {Callbacks, createRemoveCallback} from './Callbacks';
import {ElementCreator} from './ElementCreator';

import * as api from './api/dom';
import {
  isDef,
  isUndef,
  sameVNode,
  pluck,
  createKeyToOldIdx} from './util/index';

const pluckPrepatch = pluck('hook', 'prepatch');
const pluckPostpatch = pluck('hook', 'postpatch');
const pluckUpdate = pluck('hook', 'update');
const pluckRemove = pluck('hook', 'remove');
const pluckDestroy = pluck('hook', 'destroy');

export class VNodePatcher {
  constructor(private elementCreator: ElementCreator,
              private callbacks: Callbacks) {
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
        this.update((<Element> elm), oldChildren, children);
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

  update (element: Element, oldChildren: VNode[], children: VNode[]) {
    // controls while loop
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = oldChildren.length - 1;
    let newEndIdx = children.length - 1;

    // used to compare children to see if they have been simply moved
    // or if they have been removed altogether
    let oldStartVNode: VNode = oldChildren[0];
    let oldEndVNode: VNode = oldChildren[oldEndIdx];
    let newStartVNode: VNode = children[0];
    let newEndVNode: VNode = children[newEndIdx];

    // used to keep track of `key`ed items that need to be reordered
    let oldKeyToIdx: Object; // a map of vNode keys -> index in oldChildren array
    let idxInOld: number; // index of a *new* vNode in the oldChildren array

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVNode)) { // vNode has moved up in the vTree
        oldStartVNode = oldChildren[++oldStartIdx];
      } else if (isUndef(oldEndVNode)) {
        oldEndVNode = oldChildren[--oldEndIdx];
      } else if (sameVNode(oldStartVNode, newStartVNode)) {// vNode has not moved
        this.patch(oldStartVNode, newStartVNode);
        oldStartVNode = oldChildren[++oldStartIdx];
        newStartVNode = children[++newStartIdx];
      } else if (sameVNode(oldEndVNode, newEndVNode)) { // vNode has not moved
        this.patch(oldEndVNode, newEndVNode);
        oldEndVNode = oldChildren[--oldEndIdx];
        newEndVNode = children[--newEndIdx];
      } else if (sameVNode(oldStartVNode, newEndVNode)) { // vNode has moved down in the vTree
        this.patch(oldStartVNode, newEndVNode);
        api.insertBefore(element, oldStartVNode.elm, (<Element> api.nextSibling(oldEndVNode.elm)));
        oldStartVNode = oldChildren[++oldStartIdx];
        newEndVNode = children[--newEndIdx];
      } else if (sameVNode(oldEndVNode, newStartVNode)) { // vNode has moved up in the vTree
        this.patch(oldEndVNode, newStartVNode);
        api.insertBefore(element, oldEndVNode.elm, oldStartVNode.elm);
        oldEndVNode = oldChildren[--oldEndIdx];
        newStartVNode = children[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) {// only needs to happen once, generate
          // a map of keys -> index of oldChidren array
          oldKeyToIdx = createKeyToOldIdx(oldChildren, oldStartIdx, oldEndIdx);
        }
        idxInOld = oldKeyToIdx[newStartVNode.key]; // try to find where the current vNode was previously
        if (isUndef(idxInOld)) { // vNode did not previously exist, so create it
          const elm =  this.elementCreator.create(newStartVNode);
          api.insertBefore(element, elm, oldStartVNode.elm);
          newStartVNode = children[++newStartIdx];
        } else { // vNode did previously exist, so move it instead of recreating it
          const elmToMove = oldChildren[idxInOld];
          this.patch(elmToMove, newStartVNode);
          oldChildren[idxInOld] = void 0;
          api.insertBefore(element, elmToMove.elm, oldStartVNode.elm);
          newStartVNode = children[++newStartIdx];
        }
      }
    }

    if (oldStartIdx > oldEndIdx) {
      const before = isUndef(children[newEndIdx + 1]) ? null
        : children[newEndIdx + 1].elm;
      this.add(element, (<Element> before), children, newStartIdx, newEndIdx);
    } else if (newStartIdx > newEndIdx) {
      this.remove(element, oldChildren, oldStartIdx, oldEndIdx);
    }
  }

  public add(parentElm: Element, before: Element, vNodes: VNode[],
             startIdx: number, endIdx: number = 0) {
   for (; startIdx <= endIdx; ++startIdx) {
     api.insertBefore(parentElm, this.elementCreator.create(vNodes[startIdx]), before);
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
      const children = vNode.children;
      for (let i = 0; i < children.length; ++i) {
        this.invokeDestroyHook(children[i]);
      }
    }
  }
}
