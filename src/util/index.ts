import {VNode, VNodeData} from '../VNode';

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

export function pluck(...args: string[]) {
  let a: any;
  return function plucker(obj: Object): any {
    switch (args.length) {
    case 0: return obj;
    case 1: return obj[args[0]] || void 0;
    case 2: a = obj[args[0]]; return isDef(a) ? a[args[1]] : void 0;
    default: throw Error('Too many arguments');
    }
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
