// TS Defs;
export {VNode, VNodeData, Thunk, ThunkData} from './VNode';
export {Module} from './Module';

export {thunk} from './hyperscript/thunk';
import {h} from './hyperscript/hyperscript';

import hh from './hyperscript/hyperscript-helpers';
const {
  a, abbr, address, area, article, aside, audio, b, base,
  bdi, bdo, blockquote, body, br, button, canvas, caption,
  cite, code, col, colgroup, dd, del, dfn, dir, div, dl,
  dt, em, embed, fieldset, figcaption, figure, footer, form,
  h1, h2, h3, h4, h5, h6, head, header, hgroup, hr, html,
  i, iframe, img, input, ins, kbd, keygen, label, legend,
  li, link, main, map, mark, menu, meta, nav, noscript,
  object, ol, optgroup, option, p, param, pre, q, rp, rt,
  ruby, s, samp, script, section, select, small, source, span,
  strong, style, sub, sup, table, tbody, td, textarea,
  tfoot, th, thead, title, tr, u, ul, video,
} = hh;

export {h,
  a, abbr, address, area, article, aside, audio, b, base,
  bdi, bdo, blockquote, body, br, button, canvas, caption,
  cite, code, col, colgroup, dd, del, dfn, dir, div, dl,
  dt, em, embed, fieldset, figcaption, figure, footer, form,
  h1, h2, h3, h4, h5, h6, head, header, hgroup, hr, html,
  i, iframe, img, input, ins, kbd, keygen, label, legend,
  li, link, main, map, mark, menu, meta, nav, noscript,
  object, ol, optgroup, option, p, param, pre, q, rp, rt,
  ruby, s, samp, script, section, select, small, source, span,
  strong, style, sub, sup, table, tbody, td, textarea,
  tfoot, th, thead, title, tr, u, ul, video,
};

import svg from './hyperscript/svg-helpers';
export {svg};

export {XSDOM as default} from './xs-dom';
