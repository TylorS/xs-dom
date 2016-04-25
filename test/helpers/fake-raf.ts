let original: (fn: FrameRequestCallback) => number;

let requesters: any[] = [];

function fakeRaf(fn: FrameRequestCallback): number {
  requesters.push(fn);
  return requesters.length;
}

function use() {
  original = window.requestAnimationFrame;
  window.requestAnimationFrame = fakeRaf;
}

function restore() {
  window.requestAnimationFrame = original;
}

function step() {
  let cur = requesters;
  requesters = [];
  cur.forEach(function(f) { return f(16); });
}

export default {
  use,
  restore,
  step,
};