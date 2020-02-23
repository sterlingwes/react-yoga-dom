import React from 'react';

export function createAnimatedComponent(Component: any) {
  return class AnimatedComponent extends React.Component<Object> {
    render() {
      return <Component {...this.props} />;
    }
  };
}
