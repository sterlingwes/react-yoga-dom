import { createLayout } from './primitives';
import { createYogaNodes } from './node';

describe('createYogaNodes', () => {
  it('should offset children with absolute top', () => {
    const children = [...Array(3)].map(() => createLayout({ height: 20 }));
    const layout = createLayout({
      width: 500,
      height: 500,
    });
    layout.children = children;
    const node = createYogaNodes(layout);
    node.calculateLayout(layout.width as number, layout.height as number);
    const childLayouts = children.map((_, i) => node.getChild(i).getComputedLayout());
    expect(childLayouts).toMatchSnapshot();
  });
});
