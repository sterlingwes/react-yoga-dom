import React from 'react';
import { View } from './view';

const nodeBoxStyle = {
  margin: 2,
  padding: 2,
  borderWidth: 1,
};

export const NodeBox = ({ children, style }) => (
  <View className="node-box" style={{ ...nodeBoxStyle, ...style }}>
    {children}
  </View>
);
