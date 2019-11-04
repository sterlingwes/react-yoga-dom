import ReactReconciler from 'react-reconciler';
import { ProxyDomNode } from './dom-node';
import { layoutChildren, layoutNode, applyNodeStyle } from './crawler';
import { createYogaNodes } from './node';

function traceWrap(hostConfig) {
  let traceWrappedHostConfig = {};
  Object.keys(hostConfig).map(key => {
    const func = hostConfig[key];
    traceWrappedHostConfig[key] = (...args) => {
      console.log(key);
      return func(...args);
    };
  });
  return traceWrappedHostConfig;
}

const setProps = (instance, props) => {
  const domElement = instance.element;
  Object.keys(props).forEach(propName => {
    const propValue = props[propName];
    if (propName === 'children') {
      if (typeof propValue === 'string' || typeof propValue === 'number') {
        // @ts-ignore
        domElement.textContent = propValue;
      }
    } else if (propName === 'onClick') {
      domElement.addEventListener('click', propValue);
    } else if (propName === 'className') {
      domElement.setAttribute('class', propValue);
    } else if (propName === 'data-style') {
      propValue && instance.saveStyle(props[propName]);
    } else {
      const propValue = props[propName];
      domElement.setAttribute(propName, propValue);
    }
  });
};

const layoutNodes = (root: ProxyDomNode) => {
  const children = layoutChildren(root.element);
  const layout = layoutNode(root.element);
  const { width, height } = root.element.getBoundingClientRect();
  layout.width = width;
  layout.height = height;
  layout.children = children;
  const node = createYogaNodes(layout);
  node.calculateLayout(layout.width as number, layout.height as number);
  applyNodeStyle(root.element, node);
};

const rootHostContext = {};
const childHostContext = {};

const hostConfig = {
  now: Date.now,
  getRootHostContext: () => {
    return rootHostContext;
  },
  getChildHostContext: () => {
    return childHostContext;
  },
  shouldSetTextContent: (type, props) => {
    return typeof props.children === 'string' || typeof props.children === 'number';
  },
  createTextInstance: text => {
    return document.createTextNode(text);
  },
  createInstance: (type, newProps, rootContainerInstance, _currentHostContext, workInProgress) => {
    const instance = new ProxyDomNode('div');
    const domElement = instance.element;
    setProps(instance, newProps);
    return instance;
  },
  appendInitialChild: (parent, child) => {
    parent.appendChild(child);
  },
  finalizeInitialChildren: (domElement, type, props) => {
    return !!props.autofocus;
  },
  prepareForCommit: () => {},
  resetAfterCommit: (parent: ProxyDomNode) => {
    layoutNodes(parent);
  },
  commitMount: (domElement, type, newProps, fiberNode) => {
    domElement.focus();
  },
  appendChildToContainer: (parent: ProxyDomNode, child: ProxyDomNode) => {
    parent.appendChild(child);
    layoutNodes(parent);
  },
  supportsMutation: true,
  prepareUpdate: (instance, type, oldProps, newProps, rootContainerInstance, hostContext) => true,
  commitUpdate(instance, updatePayload, type, oldProps, newProps) {
    // prepareUpdate -> true retriggers this
    const domElement = instance.element;
    setProps(instance, newProps);
  },
  commitTextUpdate(textInstance, oldText, newText) {
    textInstance.textContent = newText;
  },
  appendChild(parent, child) {
    parent.appendChild(child);
  },
  insertBefore: (parentInstance, child, beforeChild) => {
    parentInstance.insertBefore(child, beforeChild);
  },
  removeChild(parentInstance, child) {
    parentInstance.removeChild(child);
  },
  insertInContainerBefore: (container, child, beforeChild) => {
    container.insertBefore(child, beforeChild);
  },
  removeChildFromContainer: (container, child) => {
    container.removeChild(child);
  },
  resetTextContent: () => {},
  shouldDeprioritizeSubtree: (type, nextProps) => {
    return !!nextProps.hidden;
  },
};
// @ts-ignore
const ReactReconcilerInst = ReactReconciler(traceWrap(hostConfig));
export default {
  render: (reactElement, domElement, callback) => {
    // Create a root Container if it doesnt exist
    if (!domElement._rootContainer) {
      domElement._rootContainer = ReactReconcilerInst.createContainer(domElement, false);
    }

    // update the root Container
    return ReactReconcilerInst.updateContainer(
      reactElement,
      domElement._rootContainer,
      null,
      callback,
    );
  },
};
