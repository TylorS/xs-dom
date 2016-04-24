import {VNode, VNodeData} from '../VNode';

export {parseSelector} from './parseSelector';

export function isDef (x: any): boolean {
  return typeof x !== 'undefined';
}

export function isUndef(x: any) {
  return typeof x === 'undefined';
}

export function emptyVNode(): VNode {
  return {sel: '', data: {}, children: [], key: void 0, text: void 0};
}

export function sameVNode(vNode1: VNode, vNode2: VNode): boolean {
  return vNode1.key === vNode2.key && vNode1.sel === vNode2.sel;
}

export function createKeyToOldIdx(children: VNodeData[], beginIdx: number, endIdx: number) {
  let map = {};
  let key: string | number;
  for (let i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) map[key] = i;
  }
  return map;
}