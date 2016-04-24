const classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
const notClassId = /^\.|#/;

export function parseSelector(selector = ``) {
  let tagName: string;
  let id: string = ``;
  let classes: Array<string> = [];

  let tagParts = selector.split(classIdSplit)

  if (notClassId.test(tagParts[1]) || selector === ``) {
    tagName = `div`;
  }

  let part: string;
  let type: string;
  let i: number;

  for (i = 0; i < tagParts.length; i++) {
    part = tagParts[i];

    if (!part) {
      continue;
    }

    type = part.charAt(0);

    if (!tagName) {
      tagName = part;
    } else if (type === `.`) {
      classes.push(part.substring(1, part.length));
    } else if (type === `#`) {
      id = part.substring(1, part.length);
    }
  }

  return {
    tagName,
    id,
    className: classes.join(` `),
  }
}