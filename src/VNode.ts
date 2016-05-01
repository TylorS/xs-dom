import {Stream} from 'xstream';
import {Module} from './Module';

export interface VNodeData {
  // modules
  props?: Object;
  attrs?: Object;
  class?: Object;
  style?: Object;
  dataset?: Object;
  // end of modules
  hook?: Module;
  key?: string | number;
  ns?: string; // for SVGs
  fn?: () => VNode; // for thunks
  args?: Array<any>; // for thunks
  isolate?: string; // Cycle.js specific
  static?: boolean; // Cycle.js Specific
}

export interface VNode {
  sel?: string;
  data?: VNodeData;
  children?: Array<VNode | string | Stream<VNode>>;
  elm?: Element | Text;
  text?: string;
  key?: string | number;
}

export interface ThunkData extends VNodeData {
  fn: () => VNode;
  args: Array<any>;
}

export interface Thunk extends VNode {
  data: ThunkData;
}

export function createVNode(vNode: VNode): VNode {
  const data = vNode.data || {};
  const children = vNode.children || void 0;
  const elm = vNode.elm || void 0;
  const text = vNode.text || void 0;
  const key = data === void 0 ? void 0 : (<any> data).key;
  return {sel: vNode.sel, data, children, elm, text, key};
}

export function createTextVNode(text: string): VNode {
  return createVNode({
    sel: void 0,
    data: void 0,
    children: void 0,
    text,
  });
}
