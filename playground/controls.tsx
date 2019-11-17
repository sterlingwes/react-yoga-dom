import React from 'react';
import { NodeTree } from './node-tree';
import { Node } from './types';

type Props = {
  tree: Node;
  onAddChild: () => void;
  onChangeStyle: (string) => void;
  onSelectNode: (nodeId: number) => void;
  selectedNode: number;
  selectedStyleValue: string;
};

const styles = {
  container: {
    flex: 1,
    padding: 10,
  },

  header: {
    color: '#61dafb',
    fontSize: '2em',
    fontWeight: 700,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: '1px solid #ddd',
  },

  description: {
    color: '#ddd',
    fontWeight: 200,
  },
};

export const Controls = ({
  tree,
  onAddChild,
  onChangeStyle,
  onSelectNode,
  selectedNode,
  selectedStyleValue,
}: Props) => (
  <div style={styles.container}>
    <div style={styles.header}>react-yoga-dom</div>
    <div style={styles.description}>
      <p>
        A React.js renderer for the DOM / web using Yoga for layout. Yoga is the layout engine used
        by React Native which is similar to CSS flexbox, but not the same.
      </p>
      <p>
        This playground demonstrates rendering to web using styles that might be used for views in
        React Native.
      </p>
    </div>
    <NodeTree tree={tree} depth={0} onClick={onSelectNode} selectedNode={selectedNode} />
    <button onClick={onAddChild}>Add child</button>
    <div style={{ flex: 1 }}>
      <label>Node Styles</label>
      <textarea onChange={onChangeStyle} value={selectedStyleValue} />
    </div>
  </div>
);
