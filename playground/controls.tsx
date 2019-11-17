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
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: '1px solid #ddd',
  },

  description: {
    color: '#ddd',
    fontWeight: 200,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: '1px solid #ddd',
  },

  sectionHeader: {
    color: '#61dafb',
    fontWeight: 700,
    margin: '20px 0 10px 0',
  },

  styleTextarea: {
    width: '80%',
    minHeight: '80px',
    border: 0,
    backgroundColor: '#3a414d',
    color: '#ccc',
    fontSize: 14,
    padding: 10,
  },

  addButton: {
    backgroundColor: '#61dafb',
    color: '#222',
    padding: '4px 10px',
    border: 0,
    cursor: 'pointer',
    margin: '5px 0 10px 0',
  },

  footer: {
    marginTop: 40,
  },

  footerLink: {
    color: '#61dafb',
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
    <div style={styles.sectionHeader}>Node Hierarchy</div>
    <button style={styles.addButton} onClick={onAddChild}>
      Add child to selected node
    </button>
    <NodeTree tree={tree} depth={0} onClick={onSelectNode} selectedNode={selectedNode} />
    <div style={styles.sectionHeader}>Selected Node Style</div>
    <div style={{ flex: 1 }}>
      <textarea style={styles.styleTextarea} onChange={onChangeStyle} value={selectedStyleValue} />
    </div>
    <div style={styles.footer}>
      <a href="https://github.com/sterlingwes/react-yoga-dom" style={styles.footerLink}>
        Github
      </a>
    </div>
  </div>
);
