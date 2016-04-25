import {VNode} from '../VNode';

export class IsolateModule {
  constructor (private isolatedElements: Map<string, Element | Text>) {
  }

  private setScope(elm: Element | Text, scope: string) {
    this.isolatedElements.set(scope, elm);
  }

  private removeScope(scope: string) {
    this.isolatedElements.delete(scope);
  }

  getIsolatedElement(scope: string) {
    return this.isolatedElements.get(scope);
  }

  isIsolatedElement(elm: Element | Text): string | boolean {
    const elements = Array.from(this.isolatedElements.entries());
    for (let i = 0; i < elements.length; ++i) {
      if (elm === elements[i][1]) {
        return elements[i][0];
      }
    }
    return false;
  }

  reset() {
    this.isolatedElements.clear();
  }

  // snabbdom module stuff
  create(oldVNode: VNode, vNode: VNode) {
    const {data: oldData = {}} = oldVNode;
    const {elm, data = {}} = vNode;
    const oldIsolate = oldData.isolate || ``;
    const isolate = data.isolate || ``;
    if (isolate) {
      if (oldIsolate) { this.removeScope(oldIsolate); }
      this.setScope(elm, isolate);
    }
    if (oldIsolate && !isolate) {
      this.removeScope(isolate);
    }
  }

  update(oldVNode: VNode, vNode: VNode) {
    this.create(oldVNode, vNode);
  }

  remove({data = {}}, cb: Function) {
    if ((<any> data).isolate) {
      this.removeScope((<any> data).isolate);
    }
    cb();
  }

  destroy({data = {}}) {
    if ((<any> data).isolate) {
      this.removeScope((<any> data).isolate);
    }
  }
}