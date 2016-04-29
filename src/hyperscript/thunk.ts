import {VNode, Thunk, ThunkData} from '../VNode';

import {h} from './hyperscript';

function copyToThunk(vnode: VNode, thunk: Thunk) {
  thunk.elm = vnode.elm;
  vnode.data.fn = thunk.data.fn;
  vnode.data.args = thunk.data.args;
  thunk.data = (<ThunkData> vnode.data);
  thunk.children = vnode.children;
  thunk.text = vnode.text;
  thunk.elm = vnode.elm;
}

function init(thunk: Thunk) {
  const cur = thunk.data;
  const vNode = cur.fn.apply(undefined, cur.args);
  copyToThunk(vNode, thunk);
}

function prepatch(oldVnode: VNode, thunk: Thunk) {
  let old = oldVnode.data;
  let cur = thunk.data;
  let oldArgs = old.args;
  let args = cur.args;

  if (old.fn !== cur.fn || oldArgs.length !== args.length) {
    copyToThunk(cur.fn.apply(undefined, args), thunk);
  }
  for (let i = 0; i < args.length; ++i) {
    if (oldArgs[i] !== args[i]) {
      copyToThunk(cur.fn.apply(undefined, args), thunk);
      return;
    }
  }
  copyToThunk(oldVnode, thunk);
}

export function thunk(sel: string, key: string | number,
                      fn: (...args: Array<any>) => VNode, ...args: Array<any>) {
  return h(sel, {
    key: key,
    hook: {init: init, prepatch: prepatch},
    fn: fn,
    args: args
  });
};
