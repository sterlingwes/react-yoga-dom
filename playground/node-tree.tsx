import React from 'react';
import { Node } from './types';

type IteratorT = (value: any, index: number, items: any[]) => unknown;
const mapTimes = (n: number, iterator: IteratorT) => (
  <span>{[...Array(n)].map(iterator).join('')}</span>
);

const Indent = ({ times }) => mapTimes(times, () => '-');

type ClickHandler = (treeId: number) => void;

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
