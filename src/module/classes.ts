import {VNode} from '../VNode';

function updateClass(oldVnode: VNode, vnode: VNode) {
  let cur: any;
  let name: any;
  let elm = vnode.elm;
  let oldClass = oldVnode.data.class || {};
  let klass = vnode.data.class || {};

  for (name in oldClass) {
    if (!klass[name]) {
      (<HTMLElement> elm).classList.remove(name);
    }
  }
  for (name in klass) {
    cur = klass[name];
    if (cur !== oldClass[name]) {
      (<HTMLElement> elm).classList[cur ? 'add' : 'remove'](name);
    }
  }
}

const ClassModule = {
  create: updateClass,
  update: updateClass,
};

export default ClassModule;