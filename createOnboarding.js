import finder from '@medv/finder';

const text = 'TEXT';

const createDom = (type, value) => {
  const dom = type === text ? document.createTextNode(value || '') : document.createElement(type);
  if (typeof value === 'string') dom.innerHTML = value;
  if (typeof value === 'object') dom.appendChild(value);
  return dom;
};

const fulfillAttributes = (el, attrs) => {
  if (typeof attrs !== 'object') return;
  Object.entries(attrs).forEach(v => el.setAttribute(v[0], v[1]));
};

const appendChildren = (root, children) => {
  if (!Array.isArray(children)) return root.appendChild(children);
  children.forEach(v => root.appendChild(v))
};

const makeElement = parts => {
  return parts.reduceRight((acc, v, i, arr) => {
    const { type, value } = { type: v.type || v, value: v.value };
    console.log(i, type, value);
    const last = i === arr.length - 1;
    return createDom(type, last ? value : acc);
  }, null)
};

const renderButton = (root, cb) => {
  // const button = createDom('div', createDom('button', createDom(text, 'Capture Position')));
  const button = makeElement(['div', 'button', { type: text, value: 'Capture Position' }]);
  button.onclick = cb;
  appendChildren(root, button);
};

const makeArea = () => {
  const area = createDom('div');
  const body = document.getElementsByTagName('body')[0];
  fulfillAttributes(area, { style: 'position: absolute; height: 100%; width: 100%; top: 0; left: 0; background-color: rgba(0, 0, 0, 0.2);' });
  appendChildren(body, area);
};

const capturePosition = () => {
  console.log('capturePosition');

  const mouseDownHandler = e => {
    console.log('mouseDownHandler', e.screenX, e.screenY);
    window.removeEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mouseup', mouseUpHandler);
  };
  const mouseMoveHandler = e => {
    console.log('mouseMoveHandler', e.screenX, e.screenY);
  };
  const mouseUpHandler = e => {
    console.log('mouseUpHandler', e.screenX, e.screenY);
    window.removeEventListener('mousemove', mouseMoveHandler);
    window.removeEventListener('mouseup', mouseUpHandler);
  };
  window.addEventListener('mousedown', mouseDownHandler);
};

const root = document.getElementById('root');
// makeArea(root);
renderButton(root, capturePosition);

document.addEventListener('click', event => {
  const selector = finder(event.target);
  console.log(selector);
  fulfillAttributes(document.querySelector(selector), { style: 'background-color: red;' });
});
