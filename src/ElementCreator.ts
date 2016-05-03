import {VNode} from './VNode';
import {Callbacks} from './Callbacks';

import * as api from './api/dom';
import {isDef, emptyVNode} from './util/index';

export class ElementCreator {
  constructor (private insertedVNodeQueue: VNode[],
               private callbacks: Callbacks) {
  }

  create (vNode: VNode): Element | Text {
    let i: any;
    let hook: any;

    if (isDef(i = vNode.data) && isDef(hook = i.hook) && isDef(i = hook.init)) {
      i(vNode);
    }

    if (isDef(vNode.sel)) {
      const sel = vNode.sel;
      const hashIdx = sel.indexOf('#');
      const dotIdx = sel.indexOf('.', hashIdx);
      const hash = hashIdx > 0 ? hashIdx : sel.length;
      const dot = dotIdx > 0 ? dotIdx : sel.length;

      const tagName = hashIdx !== -1 || dotIdx !== -1
        ? sel.slice(0, Math.min(hash, dot))
        : sel;

      vNode.elm = isDef(i = vNode.data) && isDef(i = i.ns)
        ? api.createElementNS(i, tagName)
        : api.createElement(tagName);

      if (hash < dot) (<Element> vNode.elm).id = sel.slice(hash + 1, dot);
      if (dotIdx > 0) (<Element> vNode.elm).className = sel.slice(dot + 1).replace(/\./g, ' ');

      if (Array.isArray(vNode.children)) {
        for (let i = 0; i < vNode.children.length; ++i) {
          api.appendChild((<Element> vNode.elm), this.create(vNode.children[i]));
        }
      } else if (typeof vNode.text === 'string') {
        api.appendChild((<Element> vNode.elm), api.createTextNode(vNode.text));
      }

      this.callbacks.create(vNode);

      if (isDef(hook)) {
        if (isDef(i = hook.create)) i(emptyVNode(), vNode);
        if (isDef(hook.insert)) this.insertedVNodeQueue.push(vNode);
      }

      return vNode.elm;
    }

    vNode.elm = api.createTextNode(vNode.text);
    return vNode.elm;
  }
}
