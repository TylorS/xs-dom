import {VNode} from '../VNode';

function updateDataset(oldVnode: VNode, vnode: VNode) {
  let elm = vnode.elm;
  let oldDataset = oldVnode.data.dataset || {};
  let dataset = vnode.data.dataset || {};
  let key: any;

  for (key in oldDataset) {
    if (!dataset[key]) {
      delete (<HTMLElement> elm).dataset[key];
    }
  }
  for (key in dataset) {
    if (oldDataset[key] !== dataset[key]) {
      (<HTMLElement> elm).dataset[key] = dataset[key];
    }
  }
}

const DatasetModule = {
  create: updateDataset,
  update: updateDataset,
};

export default DatasetModule;