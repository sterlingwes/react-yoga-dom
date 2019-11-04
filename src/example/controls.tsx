import React from 'react';
import { View } from './view';

type Direction = 'row' | 'column';

type Props = {
  parentFlex: Direction;
  onParentFlexDirectionChange: (arg0: Direction) => any;
};

export const Controls = ({ parentFlex, onParentFlexDirectionChange }: Props) => (
  <View style={{ flex: 1 }}>
    <View style={{ flex: 1 }}>
      <label>Parent Flex Direction</label>
      <select onChange={ev => onParentFlexDirectionChange(ev.target.value as Direction)}>
        <option selected={parentFlex === 'row'}>row</option>
        <option selected={parentFlex === 'column'}>column</option>
      </select>
    </View>
    <View style={{ flex: 1 }}>
      <label>Node Styles</label>
      <textarea>Something</textarea>
    </View>
  </View>
);
