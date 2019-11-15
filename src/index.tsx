import React from 'react';
import yoga from 'yoga-layout';
// @ts-ignore
import ReactDOM from 'react-dom';
import YogaRenderer from './renderer';
import { ProxyDomNode } from './dom-node';
import { RenderArea } from './example/render-area';
import { Controls } from './example/controls';

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

let parentFlex: 'column' | 'row' = 'column';
let selectedNode: number = 0;
const children = [{ id: 1, style: { flex: 1 } }, { id: 2, style: { flex: 1 } }];
let nodeCount = children.length;
const makeNode = style => ({ id: 0, style: { ...style, flex: 1 }, children });
const getParentNode = () => makeNode({ flexDirection: parentFlex });

const onSelectNode = nodeId => {
  selectedNode = nodeId;
  renderControls();
};

const findNodeByIndex = (nodes, index) =>
  nodes.find(node => {
    const found = node.id === index;
    if (found) return true;
    if (node.children) {
      return findNodeByIndex(node.children, index);
    }
    return false;
  });
const addChild = node => {
  if (!node.children) node.children = [];
  nodeCount += 1;
  node.children.push({ id: nodeCount, style: { flex: 1 } });
  renderCanvas();
};
const onAddChild = () => {
  const node = findNodeByIndex(children, selectedNode);
  if (node) {
    addChild(node);
  } else {
    console.warn('No node found for selectedNode');
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
      onSelectNode={onSelectNode}
      selectedNode={selectedNode}
    />,
    controlMountPoint,
  );
}
renderControls();
