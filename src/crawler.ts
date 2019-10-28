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

const nodeIsAbsoluteOrFlexible = (node: YogaNode) => {
  return (
    node.getPositionType() === Yoga.POSITION_TYPE_ABSOLUTE ||
    !!node.getFlexGrow() ||
    !!node.getFlexShrink()
  );
};

const applyStyles = (node: HTMLElement, style: YogaNodeLayout, flexible: boolean) => {
  node.style.setProperty('position', flexible ? 'absolute' : 'relative');
  Object.keys(style).forEach(key => {
    if (key === 'height' && !style[key]) return;
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
        const flexible = nodeIsAbsoluteOrFlexible(yogaChild);
        applyStyles(element, layout, flexible);
        applyStylesToChildren(element, yogaChild);
      }
    }
  }
};

export const applyNodeStyle = (rootDomElement: HTMLElement, rootNode: YogaNode) => {
  const flexible = nodeIsAbsoluteOrFlexible(rootNode);
  applyStyles(rootDomElement, rootNode.getComputedLayout(), flexible);
  applyStylesToChildren(rootDomElement, rootNode);
};
