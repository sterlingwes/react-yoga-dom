import React from 'react';

type ViewProps = {
  style?: any;
  children?: any;
  className?: string;
};

export const View = ({ style, children, ...rest }: ViewProps) => (
  <div data-style={style} {...rest}>
    {children}
  </div>
);
