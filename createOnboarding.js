import finder from '@medv/finder';
import {
  fulfillAttributes, appendChildren, createDom, makeElement, makeClassFromCss,
  printRules, cumulativeOffset,
} from './utils';
import { textNode } from './constants';

const body = document.getElementsByTagName('body')[0];
const sheet = document.head.appendChild(createDom('style')).sheet;
const noCursorClass = makeClassFromCss(sheet, 'cursor: none!important;');
const hideClass = makeClassFromCss(sheet, 'display: none;');
const toolsClass = makeClassFromCss(sheet, 'position: absolute; pointer-events: none; z-index: 999999999;');
const hoveredClass = makeClassFromCss(sheet, 'border: 2px solid #F75C3D; position: fixed; background-color: rgba(211,169,227,0.3);');
const cursorClass = makeClassFromCss(sheet, 'position: fixed; background-color: #F75C3D; border-radius: 50%; height: 1em; width: 1em;');

const renderTools = () => {
  const tools = createDom('div');
  tools.classList.add(toolsClass);
  appendChildren(body, tools);
  return tools;
};

const renderButton = (root, cb) => {
  // const button = createDom('div', createDom('button', createDom(text, 'Capture Position')));
  const button = makeElement(['div', 'button', { type: textNode, value: 'Capture Position' }]);
  button.onclick = cb;
  appendChildren(root, button);
  return button;
};

const renderHover = (root, cb) => {
  const hover = createDom('div');
  hover.classList.add(hoveredClass);
  hover.onclick = cb;
  appendChildren(root, hover);
  return hover;
};

const renderCursor = root => {
  const cursor = createDom('div');
  cursor.classList.add(cursorClass);
  appendChildren(root, cursor);
  return cursor;
};

const captureElement = (toolsEl, hoverEl, cursorEl) => {
  const clickHandler = e => {
    e.stopPropagation();
    document.removeEventListener('mouseover', mouseOverHandler);
    document.removeEventListener('mousemove', mouseMoveHandler);
    const cssSelector = finder(e.target);
    body.classList.remove(noCursorClass);
    document.querySelectorAll('body button, a, div').forEach(el => el.classList.remove(noCursorClass));
    toolsEl.classList.add(hideClass);
    console.log('clickHandler', cssSelector);
    return cssSelector;
  };
  const mouseOverHandler = e => {
    const { clientWidth, clientHeight } = e.target;
    const { left, top } = cumulativeOffset(e.target);
    fulfillAttributes(hoverEl, {
      style: `left: ${left}px; top: ${top}px; width: ${clientWidth}px; height: ${clientHeight}px;`
    });
  };
  const mouseMoveHandler = e => {
    fulfillAttributes(cursorEl, {
      style: `left: ${e.clientX}px; top: ${e.clientY}px;`
    });
  };

  toolsEl.classList.remove(hideClass);

  body.classList.add(noCursorClass);
  document.querySelectorAll('body button, a, div').forEach(el => el.classList.add(noCursorClass));

  setTimeout(() => document.addEventListener('click', clickHandler, { capture: true, once: true }), 0);
  document.addEventListener('mouseover', mouseOverHandler);
  document.addEventListener('mousemove', mouseMoveHandler);
};


const root = document.getElementById('root');

const tools = renderTools();
tools.classList.add(hideClass);
const hover = renderHover(tools, () => console.log('HOVER clicked'));
const cursor = renderCursor(tools);

renderButton(root, () => captureElement(tools, hover, cursor));

printRules(tools, sheet);
