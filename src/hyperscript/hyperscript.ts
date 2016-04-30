import {Stream} from 'xstream';
import {createVNode, createTextVNode, VNode, VNodeData} from '../VNode';

function isObservable(x: any): boolean {
  return !Array.isArray(x) && typeof x.map === 'function';
}

function addNSToObservable(vNode: VNode): VNode {
  addNS(vNode.data, vNode.children);
  return vNode;
}

function addNS(data: VNodeData, children: Array<VNode | string | Stream<VNode>>): void {
  data.ns = `http://www.w3.org/2000/svg`;
  if (children !== void 0 && Array.isArray(children)) {
    for (let i = 0; i < children.length; ++i) {
      if (isObservable(children[i])) {
        children[i] = (<Stream<VNode>> children[i]).map(addNSToObservable);
      } else {
        addNS((<VNode> children[i]).data, (<VNode> children[i]).children);
      }
    }
  }
}

export function h(sel: string, b?: any, c?: any): VNode {
  let data: any = {};
  let children: Array<VNode | string | Stream<VNode>>;
  let text: string;
  let i: number;
  if (arguments.length === 3) {
    data = b;
    if (Array.isArray(c)) {
      children = c;
    } else if (typeof c === 'string') {
      text = c;
    }
  } else if (arguments.length === 2) {
    if (Array.isArray(b)) {
      children = b;
    } else if (typeof b === 'string') {
      text = b;
    } else {
      data = b;
    }
  }
  if (Array.isArray(children)) {
    for (i = 0; i < children.length; ++i) {
      if (typeof children[i] === 'string') {
        children[i] = createTextVNode(children[i]);
      }
    }
  }
  if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g') {
    addNS(data, children);
  }

  return createVNode({sel, data, children, text});
};
