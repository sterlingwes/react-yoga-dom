import { convertReactNativeStyle } from './style-converter';

const reactNativeStyle = {
  boxShadow: '1px 1px 1px 1px #000',
  borderWidthLeft: 2,
  borderWidth: 1,
  borderWidthRight: 3,
  display: 'flex',
  marginVertical: 0,
  opacity: 0,
  shadowColor: 'red',
  shadowOffset: { width: 1, height: 2 },
  resizeMode: 'contain',
};

describe('style-converter/convertReactNativeStyle', () => {
  test('noop on DOM styles', () => {
    const firstStyle = convertReactNativeStyle(reactNativeStyle);
    const secondStyle = convertReactNativeStyle(firstStyle);
    expect(firstStyle).toEqual(secondStyle);
  });

  test('shortform -> longform', () => {
    const style = {
      borderStyle: 'solid',
      boxSizing: 'border-box',
      borderBottomColor: 'white',
      borderBottomWidth: 1,
      borderWidth: 0,
      marginTop: 50,
      marginVertical: 25,
      margin: 10,
      overflow: 'hidden',
      overscrollBehavior: 'contain',
    };

    expect(convertReactNativeStyle(style)).toMatchSnapshot();
  });

  describe('flexbox styles', () => {
    test('flex: -1', () => {
      expect(convertReactNativeStyle({ flex: -1 })).toEqual({});
    });

    test('flex: 0', () => {
      expect(convertReactNativeStyle({ flex: 0 })).toEqual({});
    });

    test('flex: 1', () => {
      expect(convertReactNativeStyle({ flex: 1 })).toEqual({});
    });

    test('flex: 10', () => {
      expect(convertReactNativeStyle({ flex: 10 })).toEqual({});
    });

    test('flexBasis overrides', () => {
      expect(convertReactNativeStyle({ flexBasis: '25%' })).toEqual({});
      expect(convertReactNativeStyle({ flex: 1, flexBasis: '25%' })).toEqual({});
    });

    test('flexShrink overrides', () => {
      expect(convertReactNativeStyle({ flexShrink: 1 })).toEqual({});
      expect(convertReactNativeStyle({ flex: 1, flexShrink: 2 })).toEqual({});
    });
  });

  describe('fontFamily', () => {
    test('general case', () => {
      expect(convertReactNativeStyle({ fontFamily: 'Georgia, Times, serif' })).toMatchSnapshot();
    });

    test('"monospace"', () => {
      expect(convertReactNativeStyle({ fontFamily: 'monospace' })).toMatchSnapshot();
    });

    test('"System"', () => {
      expect(convertReactNativeStyle({ fontFamily: 'System' })).toMatchSnapshot();
      expect(convertReactNativeStyle({ font: '14px System' })).toMatchSnapshot();
    });

    test('"Noto, System"', () => {
      expect(convertReactNativeStyle({ fontFamily: 'Noto, System' })).toMatchSnapshot();
      expect(convertReactNativeStyle({ font: '14px Noto, System' })).toMatchSnapshot();
    });

    test('"Noto, BlinkMacSystemFont"', () => {
      expect(convertReactNativeStyle({ fontFamily: 'Noto, BlinkMacSystemFont' })).toMatchSnapshot();
    });
  });

  test('fontVariant', () => {
    expect(convertReactNativeStyle({ fontVariant: ['common-ligatures', 'small-caps'] })).toEqual({
      fontVariant: 'common-ligatures small-caps',
    });
  });

  test('textAlignVertical', () => {
    expect(
      convertReactNativeStyle({
        textAlignVertical: 'center',
      }),
    ).toEqual({
      verticalAlign: 'middle',
    });
  });

  describe('transform', () => {
    // passthrough if transform value is ever a string
    test('string', () => {
      const transform = 'perspective(50px) scaleX(20) translateX(20px) rotate(20deg)';
      const style = { transform };
      const resolved = convertReactNativeStyle(style);

      expect(resolved).toEqual({ transform });
    });

    test('array', () => {
      const style = {
        transform: [{ perspective: 50 }, { scaleX: 20 }, { translateX: 20 }, { rotate: '20deg' }],
      };
      const resolved = convertReactNativeStyle(style);

      expect(resolved).toEqual({
        transform: 'perspective(50px) scaleX(20) translateX(20px) rotate(20deg)',
      });
    });

    test('transformMatrix', () => {
      const style = { transformMatrix: [1, 2, 3, 4, 5, 6] };
      const resolved = convertReactNativeStyle(style);

      expect(resolved).toEqual({
        transform: 'matrix3d(1,2,3,4,5,6)',
      });
    });
  });
});
