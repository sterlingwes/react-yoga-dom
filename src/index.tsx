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

const children = [{ id: 1, style: { flex: 1 } }, { id: 2, style: { flex: 1 } }];
const makeNode = style => ({ id: 0, style: { ...style, flex: 1 }, children });

let parentFlex: 'column' | 'row' = 'column';

const renderCanvas = () =>
  YogaRenderer.render(
    <RenderArea node={makeNode({ flexDirection: parentFlex })} />,
    canvasMountPoint,
    () => console.log('rendered', parentFlex),
  );
renderCanvas();

const update = updater => (...args) => {
  updater(...args);
  renderCanvas();
};

ReactDOM.render(
  <Controls
    parentFlex={parentFlex}
    onParentFlexDirectionChange={update(direction => {
      parentFlex = direction;
    })}
  />,
  controlMountPoint,
);
