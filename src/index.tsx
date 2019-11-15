import React from 'react';
import yoga from 'yoga-layout';
// @ts-ignore
import ReactDOM from 'react-dom';
import YogaRenderer from './renderer';
import { ProxyDomNode } from './dom-node';
import { RenderArea } from './example/render-area';
import { Controls } from './example/controls';
import { REACT_SETTABLE_PROPERTIES } from './constants/styles';

const canvasMountPoint = new ProxyDomNode('div');
canvasMountPoint.element.style.setProperty('width', '60vw');
canvasMountPoint.element.style.setProperty('height', '100vh');
document.querySelector('body').appendChild(canvasMountPoint.element);

const controlMountPoint = document.createElement('div');
controlMountPoint.style.setProperty('width', '40vw');
controlMountPoint.style.setProperty('height', '100vh');
controlMountPoint.style.setProperty('position', 'absolute');
controlMountPoint.style.setProperty('right', '0px');
document.querySelector('body').appendChild(controlMountPoint);

const DEFAULT_NODE_STYLE = '{flex: 1}';
let parentFlex: 'column' | 'row' = 'column';
let selectedNode: number = 0;
let selectedNodeStyle: string = DEFAULT_NODE_STYLE;
const children = [{ id: 1, style: { flex: 1 } }, { id: 2, style: { flex: 1 } }];
let nodeCount = children.length;
const makeNode = style => ({ id: 0, style: { ...style, flex: 1 }, children });
const getParentNode = () => makeNode({ flexDirection: parentFlex });

const findNodeStyle = (nodeId: number): string => {
  const node = findNodeByIndex(children, nodeId);
  if (node) {
    return JSON.stringify(node.style, null, 2);
  }
  return DEFAULT_NODE_STYLE;
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
  node.children.push({ id: nodeCount, style: { flex: 1 } });
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
const filterValidAttributes = (styles: Object) =>
  Object.keys(styles).reduce((acc, key) => {
    if (REACT_SETTABLE_PROPERTIES.indexOf(key) < 0) return acc;
    return {
      ...acc,
      [key]: styles[key],
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
  if (!selectedNode) return;
  const node = findNodeByIndex(children, selectedNode);
  if (node) {
    const style = parseStyle(styles);
    if (!Object.keys(style).length) return;
    node.style = style;
    renderCanvas();
  }
};

function renderCanvas() {
  YogaRenderer.render(<RenderArea node={getParentNode()} />, canvasMountPoint, () =>
    console.log('rendered', parentFlex),
  );
}
renderCanvas();

const update = updater => (...args) => {
  updater(...args);
  renderCanvas();
};

function renderControls() {
  ReactDOM.render(
    <Controls
      tree={getParentNode()}
      parentFlex={parentFlex}
      onParentFlexDirectionChange={update(direction => {
        parentFlex = direction;
      })}
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
