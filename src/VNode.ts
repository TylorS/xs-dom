import {Stream} from 'xstream';
import {Module} from './Module';

export interface VNodeData {
  props?: Object;
  attrs?: Object;
  class?: Object;
  style?: Object;
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
  text?: string | number;
  key?: string | number;
}

export interface ThunkData extends VNodeData {
  fn: () => VNode;
  args: Array<any>;
}

export interface Thunk extends VNode {
  data: ThunkData;
}