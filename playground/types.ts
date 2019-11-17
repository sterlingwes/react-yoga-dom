import { RNStyleT } from 'react-yoga-dom';

export type Node = {
  id: number;
  style: RNStyleT;
  children?: Node[];
};
