import Yoga, { YogaNode } from 'yoga-layout';
import { LayoutT, createLayout, RNStyleT } from './primitives';
import { getFromRegistry } from './style-registry';

const compact = (a: Array<LayoutT | undefined>) => a.filter(item => !!item);

const getStyleFromNode = (node: HTMLElement): RNStyleT => {
  if (!node.dataset) return;
  const styleId = node.dataset.style;
  return getFromRegistry(styleId);
};

export const layoutChildren = (node: HTMLElement): LayoutT[] => {
  const childNodes = Array.from(node.childNodes);
  return childNodes.map(child => layoutNode(child as HTMLElement));
};

export const layoutNode = (node: HTMLElement): LayoutT => {
  const style = getStyleFromNode(node);
  let layout: LayoutT;
  if (!style) {
    layout = createLayout({});
  } else {
    layout = createLayout(style);
  }

  layout.children = compact(node.hasChildNodes() ? layoutChildren(node) : []);
  return layout;
};

type YogaNodeLayout = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

const applyStyles = (node: HTMLElement, style: YogaNodeLayout) => {
  node.style.setProperty('position', 'absolute');
  Object.keys(style).forEach(key => {
    if (key === 'height' && !style[key]) return;
    if (key === 'bottom' || key === 'right') return;
    const val = isNaN(style[key]) ? '0px' : `${style[key]}px`;
    node.style.setProperty(key, val);
  });
};

export const applyStylesToChildren = (parentElement: HTMLElement, parentNode: YogaNode) => {
  for (let i = 0; i < parentElement.childNodes.length; i++) {
    const yogaChild = parentNode.getChild(i);
    if (yogaChild) {
      const layout = yogaChild.getComputedLayout();
      const element = parentElement.childNodes[i] as HTMLElement;
      if (element && element.style) {
        applyStyles(element, layout);
        applyStylesToChildren(element, yogaChild);
      }
    }
  }
};

export const applyNodeStyle = (rootDomElement: HTMLElement, rootNode: YogaNode) => {
  applyStyles(rootDomElement, rootNode.getComputedLayout());
  applyStylesToChildren(rootDomElement, rootNode);
};
