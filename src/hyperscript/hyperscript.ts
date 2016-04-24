import {Stream} from 'xstream';
import {VNode, VNodeData} from '../VNode';

function isObservable(x: any): boolean {
  return typeof x.addListener === `function`;
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

function h(sel: string, b?: any, c?: any): VNode {
  let data = {};
  let children: Array<VNode | string | Stream<VNode>>;
  let text: string | number;
  let i: number;
  if (arguments.length === 3) {
    data = b;
    if (Array.isArray(c)) {
      children = c;
    } else if (typeof c === 'string' || typeof c === 'number') {
      text = c;
    }
  } else if (arguments.length === 2) {
    if (Array.isArray(b)) {
      children = b;
    } else if (typeof b === 'string' || typeof b === 'number') {
      text = b;
    } else {
      data = b;
    }
  }
  if (Array.isArray(children)) {
    for (i = 0; i < children.length; ++i) {
      if (typeof children[i] === 'string' || typeof children[i] === 'number') {
        children[i] = {text: children[i]}
      }
    }
  }
  if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g') {
    addNS(data, children);
  }
  return {sel, data, children, text};
};

export {h};