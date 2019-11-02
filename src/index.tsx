import React from 'react';
import YogaRenderer from './renderer';
import { ProxyDomNode } from './dom-node';

type ViewProps = {
  style?: any;
  children?: any;
};

const View = ({ style, children, ...rest }: ViewProps) => (
  <div data-style={style} {...rest}>
    {children}
  </div>
);

// WIP: for some reason `top: 5` leads to bottom: 5 in the YogaNode layout:
// position: absolute; left: 0px; right: 0px; top: 5px; bottom: 5px; width: 0px;
const App = () => (
  <View style={{ flex: 1 }}>
    <View style={{ flex: 1 }}>Hello</View>
    <View style={{ position: 'absolute', top: 40 }}>World</View>
  </View>
);

const root = new ProxyDomNode('div');
document.querySelector('body').appendChild(root.element);
console.log(root);

YogaRenderer.render(<App />, root, () => console.log('rendered'));
