import {VNode} from './VNode';
import {
  Module,
  CreateHook,
  UpdateHook,
  RemoveHook,
  DestroyHook,
  PreHook,
  PostHook} from './Module';

import {emptyVNode} from './util/index';
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
  const callbacks = {};

  for (let i = 0; i < hooks.length; ++i) {
    callbacks[hooks[i]] = [];
    for (let j = 0; j < modules.length; ++j) {
      if (modules[j][hooks[i]] !== void 0) {
        callbacks[hooks[i]].push( modules[j][hooks[i]] );
      }
    }
  }

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
    for (let i = 0; i < this.callbacks.pre.length; ++i) {
      this.callbacks.pre[i]();
    }
  }

  create (vNode: VNode) {
    const create = this.callbacks.create;
    const length = create.length;

    if (length === 1) { create[0](emptyVNode(), vNode); return ; }

    for (let i = 0; i < length; ++i) {
      create[i](emptyVNode(), vNode);
    }
  }

  update (oldVNode: VNode, vNode: VNode) {
    const update = this.callbacks.update;
    const length = update.length;

    if (length === 1) { update[0](oldVNode, vNode); return; }

    for (let i = 0; i < this.callbacks.update.length; ++i) {
      update[i](oldVNode, vNode);
    }
  }

  insert (insertedVNodeQueue: VNode[]) {
    for (let i = 0; i < insertedVNodeQueue.length; ++i) {
      insertedVNodeQueue[i].data.hook.insert(insertedVNodeQueue[i]);
    }
  }

  remove (vNode: VNode, remove: () => void): void {
    for (let i = 0; i < this.callbacks.remove.length; ++i) {
      this.callbacks.remove[i](vNode, remove);
    }
  }

  getListeners(): number {
    return this.callbacks.remove.length + 1;
  }

  destroy (vNode: VNode) {
    for (let i = 0; i < this.callbacks.destroy.length; ++i) {
      this.callbacks.destroy[i](vNode);
    }
  }

  post () {
    for (let i = 0; i < this.callbacks.post.length; ++i) {
      this.callbacks.post[i]();
    }
  }
}
