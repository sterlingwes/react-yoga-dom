import { RNStyleT } from './primitives';
import { StyleSheet } from './react-native';

type Maybe<T> = T | null | undefined;

const styleRegistry = {};
// @ts-ignore
window.YogaStyles = styleRegistry;

export const addToRegistry = (id: string, style: RNStyleT) => {
  styleRegistry[id] = StyleSheet.flatten(style);
};

export const getFromRegistry = (id: string): Maybe<RNStyleT> => {
  return styleRegistry[id];
};
