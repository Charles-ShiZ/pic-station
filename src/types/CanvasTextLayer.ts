import { psdp } from "./psd";

export default interface CanvasTextLayer extends psdp.TextLayer {
  layerWorkType?: string;
  fixedHeight?: number;
  backgroundColor?: string;
  background?: string;
  borderRadius?: number;
  locked?: boolean;
  initialized?: boolean; // 是否已初始化
  fontTopSpace?: number;
  fontBottomSpace?: number;
  textLines?: string[];
  fontActualHeight?: number;
  rotate?: number;

  uniqueId?: string; // 唯一标识
  viewElementHeight?: number; // 临时参数，为了弥补单画布情况下，viewElement 元素引用被清除所造成的高度为 0 问题，导致文字图层高度塌陷
}

export function isCanvasTextLayer(layer: any): layer is CanvasTextLayer {
  return layer.type === "text";
}
