import {VNode} from './VNode';
import {VNodePatcher} from './VNodePatcher';

import {isUndef, sameVNode, createKeyToOldIdx} from './util/index';
import * as api from './api/dom';

export class VNodeUpdater {
  constructor (private vNodePatcher: VNodePatcher) {
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
      if (isUndef(oldStartVNode)) { // vNode as moved up in the vTree
        oldStartVNode = oldChildren[++oldStartIdx];
      } else if (isUndef(oldEndVNode)) {
        oldEndVNode = oldChildren[--oldEndIdx];
      } else if (sameVNode(oldStartVNode, newStartVNode)) {// vNode has not moved
        this.vNodePatcher.patch(oldStartVNode, newStartVNode);
        oldStartVNode = oldChildren[++oldStartIdx];
        newStartVNode = children[++newStartIdx];
      } else if (sameVNode(oldEndVNode, newEndVNode)) { // vNode has not moved
        this.vNodePatcher.patch(oldEndVNode, newEndVNode);
        oldEndVNode = oldChildren[--oldEndIdx];
        newEndVNode = children[--newEndIdx];
      } else if (sameVNode(oldStartVNode, newEndVNode)) { // vNode has moved down in the vTree
        this.vNodePatcher.patch(oldStartVNode, newEndVNode);
        api.insertBefore(element, oldStartVNode.elm, (<Element> api.nextSibling(oldEndVNode.elm)));
        oldStartVNode = oldChildren[++oldStartIdx];
        newEndVNode = children[--newEndIdx];
      } else if (sameVNode(oldEndVNode, newStartVNode)) { // vNode has moved up in the vTree
        this.vNodePatcher.patch(oldEndVNode, newStartVNode);
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
          const elm =  this.vNodePatcher.create(newStartVNode);
          api.insertBefore(element, elm, oldStartVNode.elm);
          newStartVNode = children[++newStartIdx];
        } else { // vNode did previously exist, so move it instead of recreating it
          const elmToMove = oldChildren[idxInOld];
          this.vNodePatcher.patch(elmToMove, newStartVNode);
          oldChildren[idxInOld] = void 0;
          api.insertBefore(element, elmToMove.elm, oldStartVNode.elm);
          newStartVNode = children[++newStartIdx];
        }
      }
    }

    if (oldStartIdx > oldEndIdx) {
      const before = isUndef(children[newEndIdx + 1]) ? null
        : children[newEndIdx + 1].elm;
      this.vNodePatcher.add(element, (<Element> before), children, newStartIdx, newEndIdx);
    } else if (newStartIdx > newEndIdx) {
      this.vNodePatcher.remove(element, oldChildren, oldStartIdx, oldEndIdx);
    }
  }
}
