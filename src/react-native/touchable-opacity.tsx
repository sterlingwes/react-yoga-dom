import React from 'react';

type ViewProps = {
  style?: any;
  children?: any;
  onPress: () => any;
};

export const TouchableOpacity = ({ style, children, onPress, ...rest }: ViewProps) => (
  <div data-style={style} onClick={onPress} {...rest}>
    {children}
  </div>
);
