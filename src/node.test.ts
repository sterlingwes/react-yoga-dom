import yoga, { YogaNode } from 'yoga-layout';
import { createLayout, LayoutT, PositionValue } from './primitives';
import { createYogaNodes } from './node';

type IteratorT = (value: any, index: number, items: any[]) => unknown;
const mapTimes = (n: number, iterator: IteratorT) => [...Array(n)].map(iterator);

describe('createYogaNodes', () => {
  let layout: LayoutT;

  beforeEach(() => {
    layout = createLayout({
      width: 500,
      height: 500,
    });
  });

  const calculateLayout = () => {
    const node = createYogaNodes(layout);
    node.calculateLayout(layout.width as number, layout.height as number);
    const childCount = node.getChildCount();
    const children = mapTimes(childCount, (_, i) => node.getChild(i).getComputedLayout());
    return { node, children };
  };

  it('should offset children with absolute top', () => {
    layout.children = [...Array(3)].map(() => createLayout({ height: 20 }));
    const { children } = calculateLayout();
    expect(children).toMatchSnapshot();
  });

  it('should account for margin values in layout', () => {
    layout.children = [...Array(3)].map(() => createLayout({ height: 20, marginBottom: 1 }));
    const { children } = calculateLayout();
    expect(children).toMatchSnapshot();
  });

  it('should position relative by default', () => {
    layout.children = [...Array(3)].map(() => createLayout({ height: 20, top: 1 }));
    const { children } = calculateLayout();
    expect(children).toMatchSnapshot();
  });

  it('should allow for absolute positioning', () => {
    layout.children = [...Array(3)].map(() =>
      createLayout({ height: 20, top: 1, position: PositionValue.absolute }),
    );
    const { children } = calculateLayout();
    expect(children).toMatchSnapshot();
  });

  it('should allow for percentage positioning', () => {
    layout.children = [...Array(3)].map(() =>
      createLayout({ height: 20, top: '30%', position: PositionValue.absolute }),
    );
    const { children } = calculateLayout();
    expect(children).toMatchSnapshot();
  });
});
