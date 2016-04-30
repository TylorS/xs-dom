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

function tryPluckProperty(obj: Object, prop: string): any {
  try {
    return obj[prop];
  } catch (e) {
    return void 0;
  }
}

export function pluck(...args: string[]) {
  return function plucker(obj: Object): any {
    let x = obj;
    for (let i = 0, l = args.length; i < l; ++i) {
      x = tryPluckProperty(x, args[i]);
    }
    return x;
  };
}

export function forEach(fn: (x: any) => void, array: Array<any>): void {
  const l = array.length;
  for (let i = 0; i < l; ++i) {
    fn(array[i]);
  }
}

export function curry2(f: Function): Function {
  function curried (a: any, b: any): any {
    switch (arguments.length) {
      case 0: return curried;
      case 1: return (b: any) => f(a, b);
      default: return f(a, b);
    }
  }
  return curried;
}
