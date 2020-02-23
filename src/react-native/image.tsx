import React from 'react';

type ModuleExport = { default: string };

type ViewProps = {
  style?: any;
  source: string | ModuleExport;
};

export const Image = ({ style, source, ...rest }: ViewProps) => {
  let src = source;
  if (typeof src === 'object') {
    src = src.default;
  }
  return <img data-style={style} src={src} {...rest} />;
};
