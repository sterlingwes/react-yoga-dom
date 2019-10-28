import { RNStyleT } from './primitives';
import { addToRegistry } from './style-registry';

const makeNodeId = () =>
  Math.random()
    .toString(36)
    .substring(7);

export class ProxyDomNode {
  element: HTMLElement;
  nodeId: string;

  constructor(elementType: string) {
    this.element = document.createElement(elementType);
    this.nodeId = makeNodeId();
    this.element.dataset.style = this.nodeId;
  }

  saveStyle(style: RNStyleT) {
    addToRegistry(this.nodeId, style);
  }

  // =======================================================
  // HTMLElement proxy methods
  // =======================================================

  focus() {
    this.element.focus();
  }

  appendChild(child) {
    if (child.element) {
      this.element.appendChild(child.element);
    } else {
      this.element.appendChild(child);
    }
  }

  insertBefore(child, beforeChild) {
    this.element.insertBefore(child, beforeChild);
  }

  removeChild(child) {
    if (child.element) {
      this.element.removeChild(child.element);
    } else {
      this.element.removeChild(child);
    }
  }
}
