/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const createAnimatedComponent = require('./create-animated');
const AnimatedValue = require('./animated-value');
const { View } = require('../view');

type EndResult = { finished: boolean };
type EndCallback = (result: EndResult) => void;

/**
 * Animations are a source of flakiness in snapshot testing. This mock replaces
 * animation functions from AnimatedImplementation with empty animations for
 * predictability in tests.
 */
export type CompositeAnimation = {
  start: (callback?: EndCallback) => void;
  stop: () => void;
  reset: () => void;
  _startNativeLoop: (iterations?: number) => void;
  _isUsingNativeDriver: () => boolean;
};

const emptyAnimation = {
  start: () => {},
  stop: () => {},
  reset: () => {},
  _startNativeLoop: () => {},
  _isUsingNativeDriver: () => {
    return false;
  },
};

const spring = function(
  value: any /*AnimatedValue | AnimatedValueXY*/,
  config: any /*SpringAnimationConfig*/,
): CompositeAnimation {
  const anyValue: any = value;
  return {
    ...emptyAnimation,
    start: (callback?: EndCallback): void => {
      anyValue.setValue(config.toValue);
      callback && callback({ finished: true });
    },
  };
};

const timing = function(
  value: any /*AnimatedValue | AnimatedValueXY*/,
  config: any /*SpringAnimationConfig*/,
): CompositeAnimation {
  const anyValue: any = value;
  return {
    ...emptyAnimation,
    start: (callback?: EndCallback): void => {
      anyValue.setValue(config.toValue);
      callback && callback({ finished: true });
    },
  };
};

const decay = function(
  value: any /*AnimatedValue | AnimatedValueXY*/,
  config: any /*SpringAnimationConfig*/,
): CompositeAnimation {
  return emptyAnimation;
};

const sequence = function(animations: Array<CompositeAnimation>): CompositeAnimation {
  return emptyAnimation;
};

const parallel = function(animations: Array<CompositeAnimation>): CompositeAnimation {
  return emptyAnimation;
};

const delay = function(time: number): CompositeAnimation {
  return emptyAnimation;
};

const stagger = function(time: number, animations: Array<CompositeAnimation>): CompositeAnimation {
  return emptyAnimation;
};

const loop = function(animation: CompositeAnimation): CompositeAnimation {
  return emptyAnimation;
};

const event = function(argMapping: Array<any>, config: any): any {
  return null;
};

export const Animated = {
  Value: AnimatedValue,
  // ValueXY: AnimatedValueXY,
  // Interpolation: AnimatedInterpolation,
  // Node: AnimatedNode,
  decay,
  timing,
  spring,
  // add: AnimatedImplementation.add,
  // subtract: AnimatedImplementation.subtract,
  // divide: AnimatedImplementation.divide,
  // multiply: AnimatedImplementation.multiply,
  // modulo: AnimatedImplementation.modulo,
  // diffClamp: AnimatedImplementation.diffClamp,
  delay,
  sequence,
  parallel,
  stagger,
  loop,
  event,
  createAnimatedComponent,
  // attachNativeEvent,
  // forkEvent: AnimatedImplementation.forkEvent,
  // unforkEvent: AnimatedImplementation.unforkEvent,
  // Event: AnimatedEvent,
  // __PropsOnlyForTests: AnimatedProps,
  View,
};
