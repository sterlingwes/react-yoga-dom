import React from 'react';
import { View } from './view';
import { Controls } from './controls';
import { RenderArea } from './render-area';

const children = [{ id: 1, style: { flex: 1 } }, { id: 2, style: { flex: 1 } }];

export const Playground = () => (
  <View style={{ flex: 1, flexDirection: 'row' }}>
    <View style={{ flex: 3 }}>
      <RenderArea node={{ style: {}, children }} />
    </View>
    <View style={{ flex: 1 }}>
      <Controls />
    </View>
  </View>
);
