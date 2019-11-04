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

const verticallyCenterText = (children?: Node[]) => (children ? {} : { flexDirection: 'row' });

const renderChild = (node: Node) => (
  <NodeBox style={{ ...node.style, ...verticallyCenterText(node.children) }}>
    {node.children ? (
      node.children.map(renderChild)
    ) : (
      <View className="node-text" style={{ alignSelf: 'center', flex: 1 }}>
        {node.id}
      </View>
    )}
  </NodeBox>
);

const renderCanvasStyle = {
  margin: 10,
};

export const RenderArea = ({ node: { style, children } }: Props) => (
  <NodeBox style={{ flex: 1, ...renderCanvasStyle, ...style }}>{children.map(renderChild)}</NodeBox>
);
