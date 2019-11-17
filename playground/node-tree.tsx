import React from 'react';
import { Node } from './types';

type IteratorT = (value: any, index: number, items: any[]) => unknown;
const mapTimes = (n: number, iterator: IteratorT) => [...Array(n)].map(iterator).join('');

const Indent = ({ times }) => <span>{times ? '┝' + mapTimes(times - 1, () => '━') : ''}</span>;

type ClickHandler = (treeId: number) => void;

const styles = {
  nodeRow: {
    flex: 1,
    cursor: 'pointer',
    color: '#ccc',
  },
};

export const NodeTree = ({
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
      <div style={styles.nodeRow} onClick={() => onClick(tree.id)}>
        <Indent times={depth} />
        {tree.id === 0 ? 'Parent Node' : `Node ${tree.id}`}
        {selected}
      </div>
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
