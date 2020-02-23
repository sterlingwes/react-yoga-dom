/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

import { Animated } from '../animated';

export function flattenStyle(style: object): object {
  if (style === null || typeof style !== 'object') {
    return undefined;
  }

  if (!Array.isArray(style)) {
    return style;
  }

  const result = {};
  for (let i = 0, styleLength = style.length; i < styleLength; ++i) {
    const computedStyle = flattenStyle(style[i]);
    if (computedStyle) {
      for (const key in computedStyle) {
        let value = computedStyle[key];
        if (value instanceof Animated.Value) {
          console.log(value, value._value);
          value = value._value;
        }
        result[key] = value;
      }
    }
  }
  return result;
}
