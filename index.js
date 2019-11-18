const createTextElement = text => {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
};

const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        return typeof child === 'object' ? child : createTextElement(child);
      }),
    },
  };
};

const isProperty = key => key !== 'children';

const render = (element, container) => {
  const dom = element.type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(element.type);

  Object.keys(element.props)
    .reduce((acc, name) => {
      if (isProperty(name)) acc[name] = element.props[name];
      return acc;
    }, dom);

  element.props.children.forEach(child => render(child, dom));
  container.appendChild(dom);
};

const Didact = {
  createElement,
  render,
};

// const element = Didact.createElement(
//   'div',
//   { id: 'foo' },
//   Didact.createElement('a', null, 'bar'),
//   Didact.createElement('b')
// );

/*If we have a comment like this one, when babel transpiles the JSX it will use the function we define.*/
/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
);

const container = document.getElementById('root');
Didact.render(element, container);
