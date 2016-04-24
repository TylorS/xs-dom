import {VNode, Thunk, ThunkData} from '../VNode';

import {h} from './hyperscript';

function copyToThunk(vNode: VNode, thunk: Thunk) {
  thunk.elm = vNode.elm;
  vNode.data.fn = thunk.data.fn;
  vNode.data.args = thunk.data.args;
  thunk.data = (<ThunkData> vNode.data);
  thunk.children = vNode.children;
  thunk.text = vNode.text;
  thunk.elm = vNode.elm;
}

function init(thunk: Thunk) {
  const data = thunk.data;
  const vNode = data.fn.apply(void 0, data.args);
  copyToThunk(vNode, thunk);
}

function prepatch(oldVNode: VNode, thunk: Thunk): void {
  const old = oldVNode.data;
  const cur = thunk.data;
  const oldArgs = old.args;
  const args = cur.args;
  if (old.fn !== cur.fn || oldArgs.length !== args.length) {
    copyToThunk(cur.fn.apply(void 0, args), thunk);
  }
  for (let i = 0; i < args.length; ++i) {
    if (oldArgs[i] !== args[i]) {
      copyToThunk(cur.fn.apply(void 0, args), thunk);
      return;
    }
  }
  copyToThunk(oldVNode, thunk);
}

export function thunk(selector: string, key: string | number, fn: () => VNode, args: Array<any>): VNode {
  return h(selector, {key, hook: {init, prepatch}, fn, args}, []);
}