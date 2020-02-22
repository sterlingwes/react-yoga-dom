import React from 'react';
import { YogaRenderer, ProxyDomNode } from 'react-yoga-dom';

window.React = React;

// @ts-ignore
window.renderComponent = reactElement => {
  const mountPoint = new ProxyDomNode('div');
  mountPoint.element.style.setProperty('width', '320px');
  mountPoint.element.style.setProperty('height', '100vh');
  document.querySelector('body').appendChild(mountPoint.element);

  YogaRenderer.render(reactElement, mountPoint, () => console.log('rendered'));
};
