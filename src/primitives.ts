import yoga from 'yoga-layout';
import { UnreachableCaseError } from './utils';

export enum FlexJustifyValue {
  flexStart = 'flex-start',
  flexEnd = 'flex-end',
  center = 'center',
  spaceBetween = 'space-between',
  spaceAround = 'space-around',
  spaceEvenly = 'space-evenly',
}

export enum FlexAlignValue {
  flexStart = 'flex-start',
  flexEnd = 'flex-end',
  center = 'center',
  stretch = 'stretch',
  baseline = 'baseline',
}

export enum LayoutDirection {
  inherit = 'inherit',
  ltr = 'ltr',
  rtl = 'rtl',
}

export enum FlexDisplay {
  none = 'none',
  flex = 'flex',
}

export enum FlexDirection {
  row = 'row',
  rowReverse = 'row-reverse',
  column = 'column',
  columnReverse = 'column-reverse',
}

export enum FlexWrap {
  wrap = 'wrap',
  nowrap = 'nowrap',
}

export enum OverflowValue {
  visible = 'visible',
  hidden = 'hidden',
  scroll = 'scroll',
}

export enum PositionValue {
  absolute = 'absolute',
  relative = 'relative',
}

type LayoutPositionT = ReturnType<typeof LayoutPosition>;
type PositionValues = { [key in 'top' | 'left' | 'right' | 'bottom']: LayoutValue };

export type LayoutValue = number | string;

// ltr / rtl props not implemented; here for reference
// also not supporting some percentage (string) dimension values yet
// (minWidthPercent etc)
export interface RNStyleT {
  alignContent?: FlexJustifyValue;
  alignItems?: FlexAlignValue;
  alignSelf?: FlexAlignValue;
  aspectRatio?: number;
  borderBottomWidth?: number;
  borderEndWidth?: number;
  borderLeftWidth?: number;
  borderRightWidth?: number;
  borderStartWidth?: number;
  borderTopWidth?: number;
  borderWidth?: number;
  bottom?: LayoutValue;
  direction?: LayoutDirection;
  display?: FlexDisplay;
  end?: LayoutValue;
  flex?: number;
  flexBasis?: LayoutValue;
  flexDirection?: FlexDirection;
  flexGrow?: number;
  flexShrink?: number;
  flexWrap?: FlexWrap;
  height?: string | number;
  justifyContent?: FlexJustifyValue;
  left?: LayoutValue;
  margin?: LayoutValue;
  marginBottom?: LayoutValue;
  marginEnd?: LayoutValue;
  marginHorizontal?: LayoutValue;
  marginLeft?: LayoutValue;
  marginRight?: LayoutValue;
  marginStart?: LayoutValue;
  marginTop?: LayoutValue;
  marginVertical?: LayoutValue;
  maxHeight?: LayoutValue;
  maxWidth?: LayoutValue;
  minHeight?: LayoutValue;
  minWidth?: LayoutValue;
  overflow?: OverflowValue;
  padding?: LayoutValue;
  paddingBottom?: LayoutValue;
  paddingEnd?: LayoutValue;
  paddingHorizontal?: LayoutValue;
  paddingLeft?: LayoutValue;
  paddingRight?: LayoutValue;
  paddingStart?: LayoutValue;
  paddingTop?: LayoutValue;
  paddingVertical?: LayoutValue;
  position?: PositionValue;
  right?: LayoutValue;
  start?: LayoutValue;
  top?: LayoutValue;
  width?: LayoutValue;
  zIndex?: number;
}

const selectConsistentStyles = (style: RNStyleT) => {
  const { width, height } = style;
  return {
    width,
    height,
  };
};

const resolveFlexBasis = (style: RNStyleT) => {
  if (style.flexBasis) return style.flexBasis;
  if (style.flex && style.flex > 0) return 0;
  return 'auto';
};

const resolveFlexGrow = (style: RNStyleT) => {
  if (style.flexGrow) return style.flexGrow;
  if (style.flex && style.flex > 0) return style.flex;
  return 0;
};

const resolveFlexShrink = (style: RNStyleT) => {
  if (style.flexShrink) return style.flexShrink;
  if (style.flex && style.flex < 0) return -style.flex;
  return 0;
};

const convertAlignValue = (value?: FlexJustifyValue | FlexAlignValue) => {
  switch (value) {
    case undefined:
      return yoga.ALIGN_AUTO;
    case FlexAlignValue.baseline:
      return yoga.ALIGN_BASELINE;
    case FlexAlignValue.center:
    case FlexJustifyValue.center:
      return yoga.ALIGN_CENTER;
    case FlexAlignValue.flexEnd:
    case FlexJustifyValue.flexEnd:
      return yoga.ALIGN_FLEX_END;
    case FlexAlignValue.flexStart:
    case FlexJustifyValue.flexStart:
      return yoga.ALIGN_FLEX_START;
    case FlexJustifyValue.spaceAround:
      return yoga.ALIGN_SPACE_AROUND;
    case FlexJustifyValue.spaceBetween:
      return yoga.ALIGN_SPACE_BETWEEN;
    case FlexJustifyValue.spaceEvenly:
      return yoga.JUSTIFY_SPACE_EVENLY;
    case FlexAlignValue.stretch:
      return yoga.ALIGN_STRETCH;
    default:
      throw new UnreachableCaseError(value);
  }
};

const convertAlignContent = (style: RNStyleT) => {
  const { alignContent } = style;
  return convertAlignValue(alignContent);
};

const convertJustifyContent = (style: RNStyleT) => {
  const { justifyContent } = style;
  if (!justifyContent) return yoga.JUSTIFY_FLEX_START;
  switch (justifyContent) {
    case FlexJustifyValue.center:
      return yoga.JUSTIFY_CENTER;
    case FlexJustifyValue.flexEnd:
      return yoga.JUSTIFY_FLEX_END;
    case FlexJustifyValue.flexStart:
      return yoga.JUSTIFY_FLEX_START;
    case FlexJustifyValue.spaceAround:
      return yoga.JUSTIFY_SPACE_AROUND;
    case FlexJustifyValue.spaceBetween:
      return yoga.JUSTIFY_SPACE_BETWEEN;
    case FlexJustifyValue.spaceEvenly:
      return yoga.JUSTIFY_SPACE_EVENLY;
    default:
      throw new UnreachableCaseError(justifyContent);
  }
};

const convertAlignItems = (style: RNStyleT) => {
  const { alignItems } = style;
  return convertAlignValue(alignItems);
};

const convertAlignSelf = (style: RNStyleT) => {
  const { alignSelf } = style;
  return convertAlignValue(alignSelf);
};

const convertFlexDirection = (style: RNStyleT) => {
  const { flexDirection } = style;
  switch (flexDirection) {
    case undefined:
    case FlexDirection.column:
      return yoga.FLEX_DIRECTION_COLUMN;
    case FlexDirection.columnReverse:
      return yoga.FLEX_DIRECTION_COLUMN_REVERSE;
    case FlexDirection.row:
      return yoga.FLEX_DIRECTION_ROW;
    case FlexDirection.rowReverse:
      return yoga.FLEX_DIRECTION_ROW_REVERSE;
    default:
      throw new UnreachableCaseError(flexDirection);
  }
};

const convertPositionType = (style: RNStyleT) => {
  const { position } = style;
  switch (position) {
    case undefined:
    case PositionValue.relative:
      return yoga.POSITION_TYPE_RELATIVE;
    case PositionValue.absolute:
      return yoga.POSITION_TYPE_ABSOLUTE;
    default:
      throw new UnreachableCaseError(position);
  }
};

const convertDimension = (value?: LayoutValue) => {
  if (!value) return 'auto';
  return value;
};

const convertFlexWrap = (style: RNStyleT) => {
  const { flexWrap } = style;
  switch (flexWrap) {
    case undefined:
    case FlexWrap.nowrap:
      return yoga.WRAP_NO_WRAP;
    case FlexWrap.wrap:
      return yoga.WRAP_WRAP;
    default:
      throw new UnreachableCaseError(flexWrap);
  }
};

const convertBordersToPosition = (style: RNStyleT): LayoutPositionT => {
  const {
    borderBottomWidth,
    borderLeftWidth,
    borderRightWidth,
    borderTopWidth,
    borderWidth,
  } = style;

  return LayoutPosition({
    top: borderTopWidth || borderWidth || 0,
    left: borderLeftWidth || borderWidth || 0,
    right: borderRightWidth || borderWidth || 0,
    bottom: borderBottomWidth || borderWidth || 0,
  });
};

const convertPaddingToPosition = (style: RNStyleT): LayoutPositionT => {
  const {
    padding,
    paddingBottom,
    paddingHorizontal,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingVertical,
  } = style;

  return LayoutPosition({
    top: paddingTop || paddingVertical || padding || 0,
    left: paddingLeft || paddingHorizontal || padding || 0,
    right: paddingRight || paddingHorizontal || padding || 0,
    bottom: paddingBottom || paddingVertical || padding || 0,
  });
};

const convertMarginToPosition = (style: RNStyleT): LayoutPositionT => {
  const {
    margin,
    marginBottom,
    marginHorizontal,
    marginLeft,
    marginRight,
    marginTop,
    marginVertical,
  } = style;

  return LayoutPosition({
    top: marginTop || marginVertical || margin || 0,
    left: marginLeft || marginHorizontal || margin || 0,
    right: marginRight || marginHorizontal || margin || 0,
    bottom: marginBottom || marginVertical || margin || 0,
  });
};

const convertPosition = (style: RNStyleT): PositionValues => {
  const { top, left, right, bottom } = style;
  return {
    top: top || NaN,
    left: left || NaN,
    right: right || NaN,
    bottom: bottom || NaN,
  };
};

export const createLayout = (style: RNStyleT): LayoutT => {
  const flowThrough = selectConsistentStyles(style);
  return {
    ...flowThrough,
    flexBasis: resolveFlexBasis(style),
    flexGrow: resolveFlexGrow(style),
    flexShrink: resolveFlexShrink(style),
    flexWrap: convertFlexWrap(style),
    alignContent: convertAlignContent(style),
    justifyContent: convertJustifyContent(style),
    alignItems: convertAlignItems(style),
    alignSelf: convertAlignSelf(style),
    flexDirection: convertFlexDirection(style),
    positionType: convertPositionType(style),
    width: convertDimension(style.width),
    height: convertDimension(style.height),
    padding: convertPaddingToPosition(style),
    margin: convertMarginToPosition(style),
    border: convertBordersToPosition(style),
    position: convertPosition(style),
  };
};

export const LayoutPosition = (positions = {}) => ({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  ...positions,
});

export interface LayoutT {
  width?: LayoutValue;
  height?: LayoutValue;
  justifyContent?: yoga.YogaJustifyContent;
  alignItems?: yoga.YogaAlign;
  alignSelf?: yoga.YogaAlign;
  alignContent?: yoga.YogaAlign;
  flexDirection?: number;
  padding?: LayoutPositionT;
  margin?: LayoutPositionT;
  border?: LayoutPositionT;
  position?: PositionValues;
  positionType?: yoga.YogaPositionType;
  flexWrap?: yoga.YogaFlexWrap;
  flexBasis?: LayoutValue;
  flexGrow?: number;
  flexShrink?: number;
  children?: Array<LayoutT>;
  aspectRatio?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}
