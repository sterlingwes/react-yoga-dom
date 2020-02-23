/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

type Callback<T> = (value: T) => void;

interface Animation {
  start: (
    value: number,
    valueCb: Callback<number>,
    resultCv: Callback<number>,
    priorAnimation: Animation,
    context: AnimatedValue,
  ) => {};
}

class AnimatedValue {
  _value: number;
  _startingValue: number;
  _offset: number;
  _animation: any;
  _tracking: any;

  constructor(value: number) {
    this._startingValue = this._value = value;
    this._offset = 0;
    this._animation = null;
  }

  __detach() {
    this.stopAnimation();
  }

  __getValue(): number {
    return this._value + this._offset;
  }

  /**
   * Directly set the value.  This will stop any animations running on the value
   * and update all the bound properties.
   *
   * See http://facebook.github.io/react-native/docs/animatedvalue.html#setvalue
   */
  setValue(value: number): void {
    if (this._animation) {
      this._animation.stop();
      this._animation = null;
    }
    this._updateValue(value);
  }

  /**
   * Sets an offset that is applied on top of whatever value is set, whether via
   * `setValue`, an animation, or `Animated.event`.  Useful for compensating
   * things like the start of a pan gesture.
   *
   * See http://facebook.github.io/react-native/docs/animatedvalue.html#setoffset
   */
  setOffset(offset: number): void {
    this._offset = offset;
  }

  /**
   * Merges the offset value into the base value and resets the offset to zero.
   * The final output of the value is unchanged.
   *
   * See http://facebook.github.io/react-native/docs/animatedvalue.html#flattenoffset
   */
  flattenOffset(): void {
    this._value += this._offset;
    this._offset = 0;
  }

  /**
   * Sets the offset value to the base value, and resets the base value to zero.
   * The final output of the value is unchanged.
   *
   * See http://facebook.github.io/react-native/docs/animatedvalue.html#extractoffset
   */
  extractOffset(): void {
    this._offset += this._value;
    this._value = 0;
  }

  /**
   * Stops any running animation or tracking. `callback` is invoked with the
   * final value after stopping the animation, which is useful for updating
   * state to match the animation position with layout.
   *
   * See http://facebook.github.io/react-native/docs/animatedvalue.html#stopanimation
   */
  stopAnimation(callback?: (value: number) => void): void {
    this.stopTracking();
    this._animation && this._animation.stop();
    this._animation = null;
    callback && callback(this.__getValue());
  }

  /**
   * Stops any animation and resets the value to its original.
   *
   * See http://facebook.github.io/react-native/docs/animatedvalue.html#resetanimation
   */
  resetAnimation(callback?: (value: number) => void): void {
    this.stopAnimation(callback);
    this._value = this._startingValue;
  }

  _onAnimatedValueUpdateReceived(value: number): void {
    this._updateValue(value);
  }

  /**
   * Interpolates the value before updating the property, e.g. mapping 0-1 to
   * 0-10.
   */
  interpolate(config: any) {
    throw new Error('Mocked AnimationValue has no interpolate() implementation');
  }

  /**
   * Typically only used internally, but could be used by a custom Animation
   * class.
   *
   * See http://facebook.github.io/react-native/docs/animatedvalue.html#animate
   */
  animate(animation: Animation, callback: any): void {
    const previousAnimation = this._animation;
    this._animation && this._animation.stop();
    this._animation = animation;
    animation.start(
      this._value,
      value => {
        this._updateValue(value);
      },
      result => {
        this._animation = null;
        callback && callback(result);
      },
      previousAnimation,
      this,
    );
  }

  /**
   * Typically only used internally.
   */
  stopTracking(): void {
    this._tracking && this._tracking.__detach();
    this._tracking = null;
  }

  /**
   * Typically only used internally.
   */
  track(tracking: any): void {
    this.stopTracking();
    this._tracking = tracking;
  }

  _updateValue(value: number): void {
    this._value = value;
  }

  __getNativeConfig(): Object {
    return {
      type: 'value',
      value: this._value,
      offset: this._offset,
    };
  }
}

module.exports = AnimatedValue;
