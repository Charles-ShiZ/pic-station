import { psdp } from "./psd";

export default interface CanvasImageLayer extends psdp.ImageLayer {
  localUrl?: string;
  layerWorkType?: string;
  skcRelative?: {
    psdPictureTypeEnum?: string;
    siteId?: string;
    skc?: string;
    operateType?: number;
  };
  croppingImage?: string; // 剪裁后生成的图片 url
  rotate?: number;
  maskType?: string;
}

export function isCanvasImageLayer(layer: any): layer is CanvasImageLayer {
  return layer.type === "image";
}
