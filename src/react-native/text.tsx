import React from 'react';

type TextProps = {
  style?: any;
  children?: any;
  className?: string;
};

export const Text = ({ style, children, ...rest }: TextProps) => (
  <span data-style={style} {...rest}>
    {children}
  </span>
);
