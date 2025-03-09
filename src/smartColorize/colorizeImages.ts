import { IHSL } from "./types";
import CanvasImageLayer from "@/types/CanvasImageLayer";
import { loadImage, rgb2hsl, hsl2rgb, loadImageInWorker } from "./utils";

export async function colorizeImages({
  imageLayers,
  smartHSL,
}: {
  imageLayers: CanvasImageLayer[];
  smartHSL: IHSL;
}) {
  // 获取 smartColor 的 h 值 作为新的 h 值
  const smartH = smartHSL.h;
  const newImageLayers: CanvasImageLayer[] = [];

  for (let i = 0; i < imageLayers.length; i++) {
    const imageLayer = imageLayers[i];

    // 使用 loadImage 加载 image，创建 imageElement
    const imageElement = await loadImageInWorker(imageLayer.image ?? "");
    // 使用 canvas 加载 imageElement，创建 ctx
    const canvas = new OffscreenCanvas(imageElement.width, imageElement.height);
    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    })! as unknown as CanvasRenderingContext2D;
    ctx.drawImage(imageElement, 0, 0);

    // 遍历图片的每个像素点，获取每个像素点的 rgb，将 rgb 转为 hsl
    const imageData = ctx.getImageData(
      0,
      0,
      imageElement.width,
      imageElement.height
    );
    const dataLength = imageData.data.length;
    for (let i = 0; i < dataLength; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const hsl = rgb2hsl({
        r,
        g,
        b,
      });
      // 保留原来的饱和度和亮度
      const { s, l } = hsl;

      const newRgb = hsl2rgb({
        h: smartH,
        s: s,
        l: l,
      });
      imageData.data[i] = newRgb.r;
      imageData.data[i + 1] = newRgb.g;
      imageData.data[i + 2] = newRgb.b;
    }

    ctx.putImageData(imageData, 0, 0);
    const blob = await canvas.convertToBlob();
    const newImage = self.URL.createObjectURL(blob);
    newImageLayers.push({
      ...imageLayer,
      image: newImage,
    });
  }
  return newImageLayers;
}
