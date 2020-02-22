/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import normalizeColorValue from 'normalize-css-color';

type Maybe<T> = T | null | undefined;

const processColor = (color?: string | number): Maybe<number> => {
  if (typeof color !== 'string' && (color === undefined || color === null)) {
    return color;
  }

  // convert number and hex
  let int32Color = normalizeColorValue(color);
  if (int32Color === undefined || int32Color === null) {
    return undefined;
  }

  int32Color = ((int32Color << 24) | (int32Color >>> 8)) >>> 0;

  return int32Color;
};

const isWebColor = (color: string): boolean =>
  color === 'currentcolor' ||
  color === 'currentColor' ||
  color === 'inherit' ||
  color.indexOf('var(') === 0;

export const normalizeColor = (color?: number | string, opacity: number = 1) => {
  if (color == null) return;

  if (typeof color === 'string' && isWebColor(color)) {
    return color;
  }

  const colorInt = processColor(color);
  if (colorInt != null) {
    const r = (colorInt >> 16) & 255;
    const g = (colorInt >> 8) & 255;
    const b = colorInt & 255;
    const a = ((colorInt >> 24) & 255) / 255;
    const alpha = (a * opacity).toFixed(2);
    return `rgba(${r},${g},${b},${alpha})`;
  }
};
