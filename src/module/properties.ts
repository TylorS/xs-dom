import {VNode} from '../VNode';

function updateProps(oldVnode: VNode, vnode: VNode) {
  let key: any;
  let cur: any;
  let old: any;
  let elm = vnode.elm;
  let oldProps = oldVnode.data.props || {};
  let props = vnode.data.props || {};

  for (key in oldProps) {
    if (!props[key]) {
      delete elm[key];
    }
  }
  for (key in props) {
    cur = props[key];
    old = oldProps[key];
    if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
      elm[key] = cur;
    }
  }
}

const PropsModule = {
  create: updateProps,
  update: updateProps,
};

export default PropsModule;
