/**
 * Copyright (c) Nicolas Gallagher.
 * (Adapted from react-native-web)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import decamelize from 'decamelize';

import {
  MONOSPACE_FONT_STACK,
  SYSTEM_FONT_STACK,
  STYLE_SHORT_FORM_EXPANSIONS,
} from './style-converter.constants';
import { normalizeValueWithProperty } from './normalizer';

const toCSSProp = (prop: string) => decamelize(prop, '-');

/**
 * The browser implements the CSS cascade, where the order of properties is a
 * factor in determining which styles to paint. React Native is different. It
 * gives giving precedence to the more specific style property. For example,
 * the value of `paddingTop` takes precedence over that of `padding`.
 *
 * This module creates mutally exclusive style declarations by expanding all of
 * React Native's supported shortform properties (e.g. `padding`) to their
 * longfrom equivalents.
 */

type TransformInstruction = {
  [attr: string]: string | number;
};

type WidthHeight = {
  width: number;
  height: number;
};

type RNStyleObj = {
  // subset of RN styles for typechecking attributes we handle explicitly
  borderWidth?: number;
  borderWidthLeft?: number;
  borderWidthRight?: number;
  boxShadow?: string;
  direction?: string;
  display?: string;
  flex?: number;
  flexBasis?: string | number;
  flexShrink?: number;
  font?: string;
  fontFamily?: string;
  fontVariant?: string | Array<string>;
  marginVertical?: string | number;
  opacity?: number;
  resizeMode?: string;
  shadowColor?: string;
  shadowOffset?: WidthHeight;
  textAlignVertical?: string;
  textDecoration?: string;
  textDecorationLine?: string;
  transform?: string | TransformInstruction | Array<TransformInstruction>;
  transformMatrix?: Array<number>;
  verticalAlign?: string;
};

const emptyObject = {};

const supportsCSS3TextDecoration =
  window.CSS != null &&
  window.CSS.supports != null &&
  (window.CSS.supports('text-decoration-line', 'none') ||
    window.CSS.supports('-webkit-text-decoration-line', 'none'));

/**
 * Transform
 */

// { scale: 2 } => 'scale(2)'
// { translateX: 20 } => 'translateX(20px)'
const mapTransform = (transform: TransformInstruction) => {
  const type = Object.keys(transform)[0];
  const value = normalizeValueWithProperty(transform[type], type);
  return `${type}(${value})`;
};

// [1,2,3,4,5,6] => 'matrix3d(1,2,3,4,5,6)'
const convertTransformMatrix = (transformMatrix: Array<number>) => {
  const matrix = transformMatrix.join(',');
  return `matrix3d(${matrix})`;
};

const resolveTransform = (resolvedStyle: RNStyleObj, style: RNStyleObj) => {
  let transform = style.transform;
  if (Array.isArray(style.transform)) {
    transform = style.transform.map(mapTransform).join(' ');
  } else if (style.transformMatrix) {
    transform = convertTransformMatrix(style.transformMatrix);
  }
  resolvedStyle.transform = transform;
};

/**
 * Reducer
 */

export const convertReactNativeStyle = (style: RNStyleObj) => {
  if (!style) {
    return emptyObject;
  }

  const resolvedStyle: RNStyleObj = {};

  Object.keys(style)
    .sort()
    .forEach(prop => {
      const value = normalizeValueWithProperty(style[prop], prop);

      // Ignore everything else with a null value
      if (value == null) {
        return;
      }

      const settableProp = toCSSProp(prop);

      switch (prop) {
        // Ignore some React Native styles
        case 'aspectRatio':
        case 'elevation':
        case 'overlayColor':
        case 'resizeMode':
        case 'tintColor':

        // Ignore properties handled by yoga
        case 'alignContent':
        case 'alignItems':
        case 'alignSelf':
        case 'aspectRatio':
        case 'bottom':
        case 'direction':
        case 'display':
        case 'end':
        case 'flex':
        case 'flexBasis':
        case 'flexDirection':
        case 'flexGrow':
        case 'flexShrink':
        case 'flexWrap':
        case 'height':
        case 'justifyContent':
        case 'left':
        case 'margin':
        case 'marginBottom':
        case 'marginEnd':
        case 'marginHorizontal':
        case 'marginLeft':
        case 'marginRight':
        case 'marginStart':
        case 'marginTop':
        case 'marginVertical':
        case 'maxHeight':
        case 'maxWidth':
        case 'minHeight':
        case 'minWidth':
        case 'padding':
        case 'paddingBottom':
        case 'paddingEnd':
        case 'paddingHorizontal':
        case 'paddingLeft':
        case 'paddingRight':
        case 'paddingStart':
        case 'paddingTop':
        case 'paddingVertical':
        case 'position':
        case 'right':
        case 'start':
        case 'top':
        case 'width':
        case 'zIndex': {
          break;
        }

        // Ignore the flex property since we convert it in primitives.ts
        case 'flex': {
          break;
        }

        case 'font': {
          resolvedStyle[settableProp] = value.replace('System', SYSTEM_FONT_STACK);
          break;
        }

        case 'fontFamily': {
          if (value.indexOf('System') > -1) {
            const stack = value.split(/,\s*/);
            stack[stack.indexOf('System')] = SYSTEM_FONT_STACK;
            resolvedStyle[settableProp] = stack.join(',');
          } else if (value === 'monospace') {
            resolvedStyle[settableProp] = MONOSPACE_FONT_STACK;
          } else {
            resolvedStyle[settableProp] = value;
          }
          break;
        }

        case 'fontVariant': {
          if (Array.isArray(value) && value.length > 0) {
            resolvedStyle.fontVariant = value.join(' ');
          }
          break;
        }

        case 'textAlignVertical': {
          resolvedStyle.verticalAlign = value === 'center' ? 'middle' : value;
          break;
        }

        case 'textDecorationLine': {
          // use 'text-decoration' for browsers that only support CSS2
          // text-decoration (e.g., IE, Edge)
          if (!supportsCSS3TextDecoration) {
            resolvedStyle.textDecoration = value;
          } else {
            resolvedStyle.textDecorationLine = value;
          }
          break;
        }

        case 'transform':
        case 'transformMatrix': {
          resolveTransform(resolvedStyle, style);
          break;
        }

        case 'writingDirection': {
          resolvedStyle.direction = value;
          break;
        }

        default: {
          const longFormProperties = STYLE_SHORT_FORM_EXPANSIONS[prop];
          if (longFormProperties) {
            longFormProperties.forEach((longForm, i) => {
              // The value of any longform property in the original styles takes
              // precedence over the shortform's value.
              if (typeof style[longForm] === 'undefined') {
                resolvedStyle[toCSSProp(longForm)] = value;
              }
            });
          } else {
            resolvedStyle[settableProp] = Array.isArray(value) ? value.join(',') : value;
          }
        }
      }
    });

  return resolvedStyle;
};
