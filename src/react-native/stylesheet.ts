import { flattenStyle } from './stylesheet/flatten';

export class StyleSheet {
  static create(styles: object) {
    return styles;
  }

  static flatten(styles: object) {
    return flattenStyle(styles);
  }
}
