import React from 'react';
import yoga from 'yoga-layout';
// @ts-ignore
import ReactDOM from 'react-dom';
import YogaRenderer, { layoutNodes } from './renderer';
import { ProxyDomNode } from './dom-node';
import { RenderArea } from './example/render-area';
import { Controls } from './example/controls';
import { REACT_SETTABLE_PROPERTIES, REACT_VALID_STRING_VALUES } from './constants/styles';

const applyViewportStyle = (element: HTMLElement, width: string) => {
  element.style.setProperty('width', width);
  element.style.setProperty('height', '100vh');
};

const canvasMountPoint = new ProxyDomNode('div');
applyViewportStyle(canvasMountPoint.element, '60vw');
document.querySelector('body').appendChild(canvasMountPoint.element);

const controlMountPoint = document.createElement('div');
applyViewportStyle(controlMountPoint, '40vw');
controlMountPoint.style.setProperty('position', 'absolute');
controlMountPoint.style.setProperty('right', '0px');
document.querySelector('body').appendChild(controlMountPoint);

const DEFAULT_ROOT_STYLE = { flex: 1, flexDirection: 'column' };
const DEFAULT_ROOT_STYLE_TEXT = JSON.stringify(DEFAULT_ROOT_STYLE, null, 2);
const DEFAULT_NODE_STYLE = { flex: 1 };
const DEFAULT_NODE_STYLE_TEXT = JSON.stringify(DEFAULT_NODE_STYLE, null, 2);
let selectedNode: number = 0;
let selectedNodeStyle: string = DEFAULT_ROOT_STYLE_TEXT;
const children = [{ id: 1, style: DEFAULT_NODE_STYLE }, { id: 2, style: DEFAULT_NODE_STYLE }];
let nodeCount = children.length;
const makeRootNode = style => ({ id: 0, style, children });
let parentNode = makeRootNode(DEFAULT_ROOT_STYLE);

const findNodeStyle = (nodeId: number): string => {
  if (!nodeId) {
    return JSON.stringify(parentNode.style, null, 2);
  }

  const node = findNodeByIndex(children, nodeId);
  if (node) {
    return JSON.stringify(node.style, null, 2);
  }
  return DEFAULT_NODE_STYLE_TEXT;
};
const onSelectNode = (nodeId: number) => {
  selectedNode = nodeId;
  selectedNodeStyle = findNodeStyle(nodeId);
  renderControls();
};

const findNodeByIndex = (nodes, index) => {
  let foundChildNode;
  const foundParentNode = nodes.find(node => {
    const found = node.id === index;
    if (found) return true;
    if (node.children) {
      foundChildNode = findNodeByIndex(node.children, index);
      return !!foundChildNode;
    }
    return false;
  });

  return foundChildNode || foundParentNode;
};
const addChild = node => {
  if (!node.children) node.children = [];
  nodeCount += 1;
  node.children.push({ id: nodeCount, style: DEFAULT_NODE_STYLE });
  renderCanvas();
  renderControls();
};
const onAddChild = () => {
  if (!selectedNode) {
    addChild({ children });
  }
  const node = findNodeByIndex(children, selectedNode);
  if (node) {
    addChild(node);
  } else {
    console.warn('No node found for selectedNode');
  }
};

const enforceStringKeys = (obj: string) => obj.replace(/([a-zA-Z0-9]+):/g, '"$1":');
const enforceDoubleQuotes = (obj: string) => obj.replace(/'/g, '"');
const validStringValue = (key: string, value: string) =>
  REACT_VALID_STRING_VALUES[key] ? REACT_VALID_STRING_VALUES[key].indexOf(value) >= 0 : true;
const filterValidAttributes = (styles: Object) =>
  Object.keys(styles).reduce((acc, key) => {
    if (REACT_SETTABLE_PROPERTIES.indexOf(key) < 0) return acc;
    const value = styles[key];
    if (typeof value === 'string' && !validStringValue(key, value)) return acc;
    return {
      ...acc,
      [key]: value,
    };
  }, {});
const parseStyle = (styles: string) => {
  const cleanedStyles = enforceStringKeys(enforceDoubleQuotes(styles));
  let styleObj = {};
  try {
    styleObj = JSON.parse(cleanedStyles);
  } finally {
    return filterValidAttributes(styleObj);
  }
};
const onChangeStyle = changeEvent => {
  const styles = changeEvent.target.value;
  selectedNodeStyle = styles;
  renderControls();

  if (!selectedNode) {
    const style = parseStyle(styles);
    if (!Object.keys(style).length) return;
    parentNode = makeRootNode(style);
    renderCanvas();
    return;
  }

  const node = findNodeByIndex(children, selectedNode);
  if (node) {
    const style = parseStyle(styles);
    if (!Object.keys(style).length) return;
    node.style = style;
    renderCanvas();
  }
};

function renderCanvas() {
  YogaRenderer.render(<RenderArea node={parentNode} />, canvasMountPoint, () =>
    console.log('rendered'),
  );
}
renderCanvas();

function renderControls() {
  ReactDOM.render(
    <Controls
      tree={parentNode}
      onAddChild={onAddChild}
      onChangeStyle={onChangeStyle}
      onSelectNode={onSelectNode}
      selectedNode={selectedNode}
      selectedStyleValue={selectedNodeStyle}
    />,
    controlMountPoint,
  );
}
renderControls();

const RESIZE_DEBOUNCE = 500;
let resizeTimeout;

window.onresize = () => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  resizeTimeout = setTimeout(() => {
    applyViewportStyle(canvasMountPoint.element, '60vw');
    layoutNodes(canvasMountPoint);
  }, RESIZE_DEBOUNCE);
};
