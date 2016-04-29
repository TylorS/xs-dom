import * as api from './api/dom';
import * as util from './util/index';

import {VNode, createVNode} from './VNode';
import {Module} from './Module';

const hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];

function registerModules(modules: Array<Module>): Object {
  let i: number;
  let j: number;
  const callbacks = {};

  for (i = 0; i < hooks.length; ++i) {
    callbacks[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (modules[j][hooks[i]] !== void 0) {
        callbacks[hooks[i]].push(
          {context: modules[j], fn: modules[j][hooks[i]]}
        );
      }
    }
  }

  return callbacks;
}

function emptyVNodeAt(elm: Element): VNode {
  return createVNode({
    sel: api.tagName(elm).toLowerCase(),
    elm,
  });
}

function createRemoveCallback(childElm: Element | Text, listeners: number) {
  return function() {
    if (--listeners === 0) {
      let parent = api.parentNode(childElm);
      api.removeChild(parent, childElm);
    }
  };
}

export function init(modules: Array<Module>) {
  const callbacks = registerModules(modules);

  function createElement(vNode: VNode, insertedVNodeQueue: Array<VNode>): Element | Text {
    let i: any;
    let elm: Element | Text;
    let {sel, data} = vNode;

    if (util.isDef(data)) {
      if (util.isDef(i = data.hook) && util.isDef(i = i.init)) {
        i(vNode);
        data = vNode.data;
      }
    }

    if (util.isDef(sel)) {
      const {tagName, id, className} = util.parseSelector(sel);
      elm = vNode.elm = util.isDef(data) && util.isDef(i = data.ns)
        ? api.createElementNS(i, tagName)
        : api.createElement(tagName);

      if (id) { (<Element> elm).id = id; }
      if (className) { (<Element> elm).className = className; }

      if (Array.isArray(vNode.children)) {
        for (i = 0; i < vNode.children.length; ++i) {
          api.appendChild((<Element> elm), createElement(vNode.children[i], insertedVNodeQueue));
        }
      } else if (typeof vNode.text === 'string' || typeof vNode.text === 'number') {
        api.appendChild((<Element> elm), api.createTextNode((<string> vNode.text)));
      }

      for (i = 0; i < (<any> callbacks).create.length; ++i) {
        const {context, fn} = (<any> callbacks).create[i];
        fn.apply(context, [util.emptyVNode(), vNode]);
      }

      i = vNode.data.hook;
      if (util.isDef(i)) {
        if (i.create) { i.create(util.emptyVNode(), vNode); }
        if (i.insert) { insertedVNodeQueue.push(vNode); }
      }
    } else {
      elm = vNode.elm = api.createTextNode((<string> vNode.text));
    }
    return vNode.elm;
  }

  function addVNodes(parentElm: Element | Text, before: Element | Text,
                     vNodes: VNode[], startIdx: number,
                     endIdx: number = 0, insertedVNodeQueue: VNode[]) {
    for (; startIdx <= endIdx; ++startIdx) {
      api.insertBefore(parentElm, createElement(vNodes[startIdx], insertedVNodeQueue), before);
    }
  }

  function invokeDestroyHook(vNode: VNode): void {
    let i: any;
    let j: number;
    const {sel, data} = vNode;
    if (sel === void 0) { return; }
    if (util.isDef(i = data.hook) && util.isDef(i = i.destroy)) {
      i(vNode);
    }
    for (i = 0; i < (<any> callbacks).destroy.length; ++i) {
      const {context, fn} = (<any> callbacks).destroy[i];
      fn.apply(context, [vNode]);
    }
    if (util.isDef(i = vNode.children)) {
      for (j = 0; j < i.length; ++j) {
        invokeDestroyHook(i[j]);
      }
    }
  }

  function removeVNodes(parentElm: Element | Text, vNodes: VNode[],
                        startIdx: number, endIdx: number = 0) {
    for (; startIdx <= endIdx; ++startIdx) {
      let i: any;
      let listeners: number;
      let remove: Function;
      let currentVNode: VNode = vNodes[startIdx];
      if (util.isDef(currentVNode)) {
        if (util.isDef(currentVNode.sel)) {
          invokeDestroyHook(currentVNode);
          listeners = (<any> callbacks).remove.length + 1;
          remove = createRemoveCallback(currentVNode.elm, listeners);
          for (i = 0; i < (<any> callbacks).remove.length; ++i) {
            const {context, fn} = (<any> callbacks).remove[i];
            fn.apply(context, [currentVNode, remove]);
          }
          if (util.isDef(i = currentVNode.data) &&
              util.isDef(i = i.hook) &&
              util.isDef(i = i.remove)) {
            i(currentVNode, remove);
          } else {
            remove();
          }
        } else {
          api.removeChild(parentElm, currentVNode.elm);
        }
      }
    }
  }

  function updateChildren(parentElm: Element | Text, oldChildren: VNode[],
                          newChildren: VNode[], insertedVNodeQueue: VNode[]) {
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = oldChildren.length - 1;
    let oldStartVNode: VNode = oldChildren[0];
    let oldEndVNode: VNode = oldChildren[oldEndIdx];
    let newEndIdx = newChildren.length - 1;
    let newStartVNode: VNode = newChildren[0];
    let newEndVNode: VNode = newChildren[newEndIdx];
    let oldKeyToIdx: Object;
    let idxInOld: any;
    let elmToMove: VNode;
    let before: Element | Text;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (util.isUndef(oldStartVNode)) {
        oldStartVNode = oldChildren[++oldStartIdx]; // VNode has been moved left;
      } else if (util.isUndef(oldEndVNode)) {
        oldEndVNode = oldChildren[--oldEndIdx];
      } else if (util.sameVNode(oldStartVNode, newStartVNode)) {
        patchVNode(oldStartVNode, newStartVNode, insertedVNodeQueue);
        oldStartVNode = oldChildren[++oldStartIdx];
        newStartVNode = newChildren[++newStartIdx];
      } else if (util.sameVNode(oldEndVNode, newEndVNode)) {
        patchVNode(oldEndVNode, newEndVNode, insertedVNodeQueue);
        oldEndVNode = oldChildren[--oldEndIdx];
        newEndVNode = newChildren[--newEndIdx];
      } else if (util.sameVNode(oldStartVNode, newEndVNode)) { // VNode moved right
        patchVNode(oldStartVNode, newEndVNode, insertedVNodeQueue);
        api.insertBefore(parentElm, oldStartVNode.elm, (<Element> api.nextSibling((<Element> oldEndVNode.elm))));
        oldStartVNode = oldChildren[++oldStartIdx];
        newEndVNode = newChildren[--newEndIdx];
      } else if (util.sameVNode(oldEndVNode, newStartVNode)) { // VNode moved left
        patchVNode(oldEndVNode, newStartVNode, insertedVNodeQueue);
        api.insertBefore(parentElm, oldEndVNode.elm, oldStartVNode.elm);
        oldEndVNode = oldChildren[--oldEndIdx];
        newStartVNode = newChildren[++newStartIdx];
      } else {
        if (util.isUndef(oldKeyToIdx)) {
          oldKeyToIdx = util.createKeyToOldIdx(oldChildren, oldStartIdx, oldEndIdx);
        }
        idxInOld = oldKeyToIdx[newStartVNode.key];
        if (util.isUndef(idxInOld)) { // new Element
          api.insertBefore(parentElm, createElement(newStartVNode, insertedVNodeQueue), oldStartVNode.elm);
          newStartVNode = newChildren[++newStartIdx];
        } else {
          elmToMove = oldChildren[idxInOld];
          patchVNode(elmToMove, newStartVNode, insertedVNodeQueue);
          oldChildren[idxInOld] = void 0;
          api.insertBefore(parentElm, elmToMove.elm, oldStartVNode.elm);
          newStartVNode = newChildren[++newStartIdx];
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      before = util.isUndef(newChildren[newEndIdx + 1]) ? null : newChildren[newEndIdx + 1].elm;
      addVNodes(parentElm, before, newChildren, newStartIdx, newEndIdx, insertedVNodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVNodes(parentElm, oldChildren, oldStartIdx, oldEndIdx);
    }
  }

  function patchVNode(oldVNode: VNode, vNode: VNode, insertedVNodeQueue: VNode[]): void {
    let i: any;
    let hook: Module;

    if (util.isDef(i = vNode.data) && util.isDef(hook = i.hook) && util.isDef(i = hook.prepatch)) {
      i(oldVNode, vNode);
    }

    let elm = vNode.elm = oldVNode.elm;
    const oldChildren = oldVNode.children;
    const children = vNode.children;

    if (oldVNode === vNode) return;
    if (!util.sameVNode(oldVNode, vNode)) {
      const parentElm = api.parentNode(oldVNode.elm);
      elm = createElement(vNode, insertedVNodeQueue);
      api.insertBefore(parentElm, elm, oldVNode.elm);
      removeVNodes(parentElm, [oldVNode], 0, 0);
      return;
    }
    if (util.isDef(vNode.data)) {
      for (i = 0; i < (<any> callbacks).update.length; ++ i) {
        const {context, fn} = (<any> callbacks).update[i];
        fn.apply(context, [oldVNode, vNode]);
      }
      i = vNode.data.hook;
      if (util.isDef(i) && util.isDef(i = i.update)) {
        i(oldVNode, vNode);
      }
    }
    if (util.isUndef(vNode.text)) {
      if (util.isDef(oldChildren) && util.isDef(children)) {
        if (oldChildren !== children) {
          updateChildren(elm, oldChildren, children, insertedVNodeQueue);
        }
      } else if (util.isDef(children)) {
        if (util.isDef(oldVNode.text)) api.setTextContent(elm, '');
        addVNodes((<Element> elm), null, children, 0, children.length - 1, insertedVNodeQueue);
      } else if (util.isDef(oldChildren)) {
        removeVNodes(elm, oldChildren, 0, oldChildren.length - 1);
      } else if (util.isDef(oldVNode.text)) {
        api.setTextContent(elm, '');
      }
    } else if (oldVNode.text !== vNode.text) {
      api.setTextContent(elm, (<string> vNode.text));
    }
    if (util.isDef(hook) && util.isDef(i = hook.postpatch)) {
      i(oldVNode, vNode);
    }
  }

  return function patch(oldVNode: VNode | Element, vNode: VNode): VNode {
    let i: number;
    let elm: Element | Text;
    let parent: Element | Text;
    let insertedVNodeQueue: VNode[] = [];

    for (i = 0; i < (<any> callbacks).pre.length; ++ i) {
      const {context, fn} = (<any> callbacks).pre[i];
      fn.apply(context, []);
    }

    if (util.isUndef((<VNode> oldVNode).sel)) {
      oldVNode = emptyVNodeAt((<Element> oldVNode));
    }

    if (util.sameVNode(oldVNode, vNode)) {
      patchVNode(oldVNode, vNode, insertedVNodeQueue);
    } else {
      elm = (<VNode> oldVNode).elm;
      parent = api.parentNode(elm);
      vNode.elm = createElement(vNode, insertedVNodeQueue);

      if (parent !== null) {
        api.insertBefore(parent, vNode.elm, (<Element> api.nextSibling(elm)));
        removeVNodes(parent, [oldVNode], 0, 0);
      }
    }

    for (i = 0; i < insertedVNodeQueue.length; ++i) {
      insertedVNodeQueue[i].data.hook.insert(insertedVNodeQueue[i]);
    }
    for (i = 0; i < (<any> callbacks).post.length; ++i) {
      const {context, fn} = (<any> callbacks).post[i];
      fn.apply(context, []);
    }

    return vNode;
  };
}
