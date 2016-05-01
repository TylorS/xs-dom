import {VNode} from './VNode';
import {
  Module,
  CreateHook,
  UpdateHook,
  RemoveHook,
  DestroyHook,
  PreHook,
  PostHook} from './Module';

import {emptyVNode, forEach} from './util/index';
import * as api from './api/dom';

const hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];

interface CallbacksInterface {
  create?: Array<CreateHook>;
  update?: Array<UpdateHook>;
  remove?: Array<RemoveHook>;
  destroy?: Array<DestroyHook>;
  pre?: Array<PreHook>;
  post?: Array<PostHook>;
}

function registerModules(modules: Array<Module>): CallbacksInterface {
  const callbacks: CallbacksInterface = {
    create: [],
    update: [],
    remove: [],
    destroy: [],
    pre: [],
    post: [],
  };

  forEach(hook => forEach(module => {
    if (module[hook]) callbacks[hook].push(module[hook]);
  }, modules), hooks);

  return callbacks;
}

export function createRemoveCallback(childElm: Element | Text,
                                     listeners: number) {
  return function() {
    if (--listeners === 0) {
      let parent = api.parentNode(childElm);
      api.removeChild(parent, childElm);
    }
  };
}

export class Callbacks {
  private callbacks: CallbacksInterface;

  constructor (modules: Module[]) {
    this.callbacks = registerModules(modules);
  }

  pre () {
    forEach((fn: PreHook) => fn(), this.callbacks.pre);
  }

  create (vNode: VNode) {
    forEach((fn: CreateHook) => fn(emptyVNode(), vNode), this.callbacks.create);
  }

  update (oldVNode: VNode, vNode: VNode) {
    forEach((fn: UpdateHook) => fn(oldVNode, vNode), this.callbacks.update);
  }

  insert (insertedVNodeQueue: VNode[]) {
    forEach((vNode: VNode) => vNode.data.hook.insert(vNode), insertedVNodeQueue);
  }

  remove (vNode: VNode, remove: () => void): void {
    forEach((fn: RemoveHook) => fn(vNode, remove), this.callbacks.remove);
  }

  getListeners(): number {
    return this.callbacks.remove.length + 1;
  }

  destroy (vNode: VNode) {
    forEach((fn: DestroyHook) => fn(vNode), this.callbacks.destroy);
  }

  post () {
    forEach((fn: PostHook) => fn(), this.callbacks.post);

  }
}
