import React from 'react';
import YogaRenderer from './renderer';
import { ProxyDomNode } from './dom-node';
import { Playground } from './example';

const root = new ProxyDomNode('div');
root.element.style.setProperty('width', '100vw');
root.element.style.setProperty('height', '100vh');
document.querySelector('body').appendChild(root.element);

YogaRenderer.render(<Playground />, root, () => console.log('rendered'));
