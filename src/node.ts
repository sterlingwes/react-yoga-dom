import yoga, { Node, YogaNode } from 'yoga-layout';
import { LayoutT } from './primitives';
import { UnreachableCaseError } from './utils';

type SettableProperty =
  | 'width'
  | 'height'
  | 'minWidth'
  | 'maxWidth'
  | 'minHeight'
  | 'maxHeight'
  | 'justifyContent'
  | 'alignItems'
  | 'alignSelf'
  | 'alignContent'
  | 'flexGrow'
  | 'flexShrink'
  | 'positionType'
  | 'aspectRatio'
  | 'flexWrap'
  | 'flexDirection';

const SETTABLE_PROPERTIES: Array<SettableProperty> = [
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'justifyContent',
  'alignItems',
  'alignSelf',
  'alignContent',
  'flexGrow',
  'flexShrink',
  'positionType',
  'aspectRatio',
  'flexWrap',
  'flexDirection',
];

// @ts-ignore
const createSetNodeProperty = (layoutDefinition, defaultLayout, root) => key => {
  try {
    // @ts-ignore
    const value = layoutDefinition[key] === '' ? defaultLayout[key] : layoutDefinition[key];
    // @ts-ignore
    root[`set${key[0].toUpperCase()}${key.substr(1)}`](value);
  } catch (e) {
    console.warn(e);
  }
};

export const createYogaNodes = (layout: LayoutT): YogaNode => {
  const root = Node.create();

  SETTABLE_PROPERTIES.forEach(key => {
    switch (key) {
      case 'width':
        layout.width && root.setWidth(layout.width);
        break;
      case 'height':
        layout.height && root.setHeight(layout.height);
        break;
      case 'minWidth':
        layout.minWidth && root.setMinWidth(layout.minWidth);
        break;
      case 'maxWidth':
        layout.maxWidth && root.setMaxWidth(layout.maxWidth);
        break;
      case 'minHeight':
        layout.minHeight && root.setMinHeight(layout.minHeight);
        break;
      case 'maxHeight':
        layout.maxHeight && root.setMaxWidth(layout.maxHeight);
        break;
      case 'justifyContent':
        layout.justifyContent && root.setJustifyContent(layout.justifyContent);
        break;
      case 'alignItems':
        layout.alignItems && root.setAlignItems(layout.alignItems);
        break;
      case 'alignSelf':
        layout.alignSelf && root.setAlignSelf(layout.alignSelf);
        break;
      case 'alignContent':
        layout.alignContent && root.setAlignContent(layout.alignContent);
        break;
      case 'flexGrow':
        layout.flexGrow && root.setFlexGrow(layout.flexGrow);
        break;
      case 'flexShrink':
        layout.flexShrink && root.setFlexShrink(layout.flexShrink);
        break;
      case 'positionType':
        layout.positionType && root.setPositionType(layout.positionType);
        break;
      case 'aspectRatio':
        layout.aspectRatio && root.setAspectRatio(layout.aspectRatio);
        break;
      case 'flexWrap':
        layout.flexWrap && root.setFlexWrap(layout.flexWrap);
        break;
      case 'flexDirection':
        break;
      default:
        throw new UnreachableCaseError(key);
    }
  });

  ['padding', 'margin', 'position', 'border'].forEach(key => {
    ['top', 'right', 'bottom', 'left'].forEach(direction => {
      try {
        // @ts-ignore
        root[`set${key[0].toUpperCase()}${key.substr(1)}`](
          // @ts-ignore
          yoga[`EDGE_${direction.toUpperCase()}`],
          // @ts-ignore
          layout[key][direction],
        );
      } catch (e) {}
    });
  });

  root.setDisplay(yoga.DISPLAY_FLEX);

  (layout.children || []).map(createYogaNodes).forEach((node, i) => {
    root.insertChild(node, i);
  });
  return root;
};
