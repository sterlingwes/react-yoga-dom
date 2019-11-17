import React from 'react';
import { View, RNStyleT } from 'react-yoga-dom';

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
    <View style={{ flex: 1 }}>
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
    </View>
  );
};

export const Controls = ({
  tree,
  onAddChild,
  onChangeStyle,
  onSelectNode,
  selectedNode,
  selectedStyleValue,
}: Props) => (
  <View style={{ flex: 1 }}>
    <NodeTree tree={tree} depth={0} onClick={onSelectNode} selectedNode={selectedNode} />
    <button onClick={onAddChild}>Add child</button>
    <View style={{ flex: 1 }}>
      <label>Node Styles</label>
      <textarea onChange={onChangeStyle} value={selectedStyleValue} />
    </View>
  </View>
);
