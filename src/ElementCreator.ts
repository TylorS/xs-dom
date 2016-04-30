import {VNode} from './VNode';
import {Callbacks} from './Callbacks';

import * as api from './api/dom';
import {pluck, isDef, emptyVNode, parseSelector} from './util/index';

const pluckInit = pluck('hook', 'init');
const pluckCreate = pluck('hook', 'create');
const pluckInsert = pluck('hook', 'insert');
const pluckNS = pluck('ns');

export class ElementCreator {
  constructor (private insertedVNodeQueue: VNode[],
               private callbacks: Callbacks) {
  }

  create (vNode: VNode): Element | Text {
    const init = pluckInit(vNode.data);
    if (isDef(init)) { init(vNode); }

    if (isDef(vNode.sel)) {
      const {tagName, id, className} = parseSelector(vNode.sel);

      const namespace = pluckNS(vNode.data);
      vNode.elm = isDef(namespace)
        ? api.createElementNS(namespace, tagName)
        : api.createElement(tagName);

      if (id) { (<Element> vNode.elm).id = id; }
      if (className) { (<Element> vNode.elm).className = className; }

      if (Array.isArray(vNode.children)) {
        for (let i = 0; i < vNode.children.length; ++i) {
          api.appendChild((<Element> vNode.elm), this.create(vNode.children[i]));
        }
      } else if (typeof vNode.text === 'string') {
        api.appendChild((<Element> vNode.elm), api.createTextNode(vNode.text));
      }

      this.callbacks.create(vNode);

      const create = pluckCreate(vNode.data);
      if (create) { create(emptyVNode(), vNode); };
      if (pluckInsert(vNode.data)) { this.insertedVNodeQueue.push(vNode); }

      return vNode.elm;
    }

    vNode.elm = api.createTextNode(vNode.text);
    return vNode.elm;
  }
}
