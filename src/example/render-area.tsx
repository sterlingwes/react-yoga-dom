import React from 'react';
import { NodeBox } from './node-box';
import { View } from './view';
import { RNStyleT } from '../primitives';

type Node = {
  id: number;
  style: RNStyleT;
  children?: Node[];
};

type Props = {
  node: Node;
};

const renderChild = (node: Node) => (
  <NodeBox style={node.style}>
    {node.children ? node.children.map(renderChild) : <View>{node.id}</View>}
  </NodeBox>
);

const renderCanvasStyle = {
  margin: 10,
};

export const RenderArea = ({ node: { style, children } }) => (
  <NodeBox style={{ flex: 1, ...renderCanvasStyle, ...style }}>{children.map(renderChild)}</NodeBox>
);
