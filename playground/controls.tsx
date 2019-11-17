import React from 'react';
import { RNStyleT } from 'react-yoga-dom';

type Direction = 'row' | 'column';

type Node = {
  id: number;
  style: RNStyleT;
  children?: Node[];
};

type Props = {
  tree: Node;
  onAddChild: () => void;
  onChangeStyle: (string) => void;
  onSelectNode: (nodeId: number) => void;
  selectedNode: number;
  selectedStyleValue: string;
};

type IteratorT = (value: any, index: number, items: any[]) => unknown;
const mapTimes = (n: number, iterator: IteratorT) => (
  <span>{[...Array(n)].map(iterator).join('')}</span>
);

const Indent = ({ times }) => mapTimes(times, () => '-');

type ClickHandler = (treeId: number) => void;

const NodeTree = ({
  tree,
  depth,
  onClick,
  selectedNode,
}: {
  tree: Node;
  depth: number;
  onClick: ClickHandler;
  selectedNode: number;
}) => {
  const selected = tree.id === selectedNode ? ' (selected)' : '';
  return (
    <div style={{ flex: 1 }}>
      <Indent times={depth} />
      <button onClick={() => onClick(tree.id)}>
        Node {tree.id}
        {selected}
      </button>
      <br />
      {tree.children &&
        tree.children.map(child => (
          <NodeTree
            key={`node-tree-${child.id}`}
            tree={child}
            depth={depth + 1}
            onClick={onClick}
            selectedNode={selectedNode}
          />
        ))}
    </div>
  );
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
