import { textNode } from './constants';

export const fulfillAttributes = (el, attrs) => {
  if (typeof attrs !== 'object') return;
  Object.entries(attrs).forEach(v => el.setAttribute(v[0], v[1]));
};

export const appendChildren = (root, children) => {
  if (!Array.isArray(children)) return root.appendChild(children);
  children.forEach(v => root.appendChild(v))
};

export const createDom = (type, value) => {
  const dom = type === textNode ? document.createTextNode(value || '') : document.createElement(type);
  if (typeof value === 'string') dom.innerHTML = value;
  if (typeof value === 'object') dom.appendChild(value);
  return dom;
};

export const makeElement = parts => {
  return parts.reduceRight((acc, v, i, arr) => {
    const { type, value } = { type: v.type || v, value: v.value };
    const last = i === arr.length - 1;
    return createDom(type, last ? value : acc);
  }, null)
};

export const printRules = (element, styleSheet) => {
  const preEl = element.appendChild(
    document.createElement('pre')
  );
  preEl.innerHTML = JSON.stringify(
    [...styleSheet.cssRules].map(
      rule => rule.cssText
    ), null, 2
  );
};

export const makeClassFromCss = (sheet, styleString) => {
  const index = sheet.cssRules.length;
  const id = index.toString(36);
  const className = `css-${id}`;
  const rule = `.${className} { ${styleString} }`;
  sheet.insertRule(rule, index);
  return className;
};

export const cumulativeOffset = element => {
  let top = 0;
  let left = 0;
  do {
    top += element.offsetTop  || 0;
    left += element.offsetLeft || 0;
    element = element.offsetParent;
  } while(element);
  return { top, left };
};
