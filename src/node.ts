import yoga, { Node, YogaNode } from 'yoga-layout';
import { LayoutT, LayoutPosition, LayoutValue } from './primitives';
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

const SETTABLE_PROPERTIES: SettableProperty[] = [
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

type LayoutType = 'padding' | 'margin' | 'position' | 'border';
const LAYOUT_TYPE: LayoutType[] = ['padding', 'margin', 'position', 'border'];

type LayoutEdge = 'top' | 'left' | 'bottom' | 'right';
const LAYOUT_EDGE: LayoutEdge[] = ['left', 'top', 'right', 'bottom'];
const EDGE_MAP: { [key in LayoutEdge]: yoga.YogaEdge } = {
  top: yoga.EDGE_TOP,
  left: yoga.EDGE_LEFT,
  bottom: yoga.EDGE_BOTTOM,
  right: yoga.EDGE_RIGHT,
};

const isPercent = (value: LayoutValue) => typeof value === 'string' && value !== 'auto';
const asPercent = (value: LayoutValue) => (typeof value === 'string' ? parseFloat(value) : value);

export const createYogaNodes = (layout: LayoutT): YogaNode => {
  const root = Node.create();

  SETTABLE_PROPERTIES.forEach(key => {
    switch (key) {
      case 'width':
        if (layout.width) {
          if (isPercent(layout.width)) {
            root.setWidthPercent(asPercent(layout.width));
            break;
          }
          root.setWidth(layout.width);
        }
        break;
      case 'height':
        if (layout.height) {
          if (isPercent(layout.height)) {
            root.setHeightPercent(asPercent(layout.height));
            break;
          }
          root.setHeight(layout.height);
        }
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

  LAYOUT_TYPE.forEach(type => {
    LAYOUT_EDGE.forEach(edge => {
      const edgeVal = EDGE_MAP[edge];
      const edgeKey = LAYOUT_EDGE[edgeVal];

      switch (type) {
        case 'border':
          layout.border && root.setBorder(edgeVal, layout.border[edgeKey]);
          break;
        case 'margin':
          if (layout.margin) {
            const marginVal = layout.margin[edgeKey];
            if (isPercent(marginVal)) {
              root.setMarginPercent(edgeVal, asPercent(marginVal));
              break;
            }
            root.setMargin(edgeVal, layout.margin[edgeKey]);
          }
          break;
        case 'padding':
          if (layout.padding) {
            const paddingval = layout.padding[edgeKey];
            if (isPercent(paddingval)) {
              root.setPaddingPercent(edgeVal, asPercent(paddingval));
              break;
            }
            root.setPadding(edgeVal, layout.padding[edgeKey]);
          }
          break;
        case 'position':
          if (layout.position) {
            const positionVal = layout.position[edgeKey];
            if (isPercent(positionVal)) {
              root.setPositionPercent(edgeVal, asPercent(positionVal));
              break;
            }
            root.setPosition(edgeVal, positionVal);
          }
          break;
        default:
          throw new UnreachableCaseError(type);
      }
    });
  });

  root.setDisplay(yoga.DISPLAY_FLEX);

  (layout.children || []).map(createYogaNodes).forEach((node, i) => {
    root.insertChild(node, i);
  });
  return root;
};
