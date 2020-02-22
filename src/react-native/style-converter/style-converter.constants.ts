/**
 * Copyright (c) Nicolas Gallagher.
 * (Adapted from react-native-web)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const STYLE_SHORT_FORM_EXPANSIONS = {
  borderColor: ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'],
  borderRadius: [
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomRightRadius',
    'borderBottomLeftRadius',
  ],
  borderStyle: ['borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle'],
  borderWidth: ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'],
  margin: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
  marginHorizontal: ['marginRight', 'marginLeft'],
  marginVertical: ['marginTop', 'marginBottom'],
  overflow: ['overflowX', 'overflowY'],
  overscrollBehavior: ['overscrollBehaviorX', 'overscrollBehaviorY'],
  padding: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
  paddingHorizontal: ['paddingRight', 'paddingLeft'],
  paddingVertical: ['paddingTop', 'paddingBottom'],
};

export const MONOSPACE_FONT_STACK = 'monospace,monospace';
export const SYSTEM_FONT_STACK =
  'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Ubuntu,"Helvetica Neue",sans-serif';
