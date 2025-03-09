import { TRGBA } from "./types";

export function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const imageElement = new Image();
    imageElement.src = src;
    imageElement.crossOrigin = "crossOrigin";
    imageElement.onload = () => {
      resolve(imageElement);
    };
    imageElement.onerror = (error) => {
      reject(error);
    };
  });
}

export async function loadImageInWorker(src: string) {
  const response = await fetch(src);
  const blob = await response.blob();
  const imageBitmap = await createImageBitmap(blob);
  return imageBitmap;
}

export function colorFromRgba({ r, g, b, a }: TRGBA) {
  return `rgba(${r},${g},${b},${a})`;
}

export function rgb2hsl({ r, g, b }: { r: number; g: number; b: number }) {
  // 1. 将 RGB 颜色值归一化到范围 [0, 1]：将每个 RGB 分量除以 255。
  r = r / 255;
  g = g / 255;
  b = b / 255;
  // 2. 计算 HSL 中的亮度（Lightness）：取 RGB 归一化后的最大值和最小值之和的一半
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  let l = (min + max) / 2;
  const difference = max - min;
  let h = 0;
  let s = 0;
  // 3. 计算 HSL 中的饱和度（Saturation）：
  if (max === min) {
    // 如果饱和度为 0，色相也为 0。
    s = 0;
    h = 0;
  } else {
    s = l > 0.5 ? difference / (2.0 - max - min) : difference / (max + min);
  }
  // 4. 计算 HSL 中的色相（Hue）：
  switch (max) {
    case r:
      h = (g - b) / difference + (g < b ? 6 : 0);
      break;
    case g:
      h = 2.0 + (b - r) / difference;
      break;
    case b:
      h = 4.0 + (r - g) / difference;
      break;
  }

  h = Math.round(h * 60);
  // 如果计算结果为负数，加上 360 来确保落在 0 到 360 度之间。
  h = h < 0 ? h + 360 : h;
  s = Math.round(s * 100); // 转换成百分比的形式
  l = Math.round(l * 100);
  return { h, s, l };
}

export function hsl2rgb({ h, s, l }: { h: number; s: number; l: number }) {
  h = h / 360;
  s = s / 100;
  l = l / 100;
  let rgb: number[] = [];

  if (s == 0) {
    rgb = [Math.round(l * 255), Math.round(l * 255), Math.round(l * 255)];
  } else {
    const q = l >= 0.5 ? l + s - l * s : l * (1 + s);
    const p = 2 * l - q;
    rgb[0] = h + 1 / 3;
    rgb[1] = h;
    rgb[2] = h - 1 / 3;
    for (let i = 0; i < rgb.length; i++) {
      let tc = rgb[i];

      if (tc < 0) {
        tc = tc + 1;
      } else if (tc > 1) {
        tc = tc - 1;
      }
      switch (true) {
        case tc < 1 / 6:
          tc = p + (q - p) * 6 * tc;
          break;
        case 1 / 6 <= tc && tc < 0.5:
          tc = q;
          break;
        case 0.5 <= tc && tc < 2 / 3:
          tc = p + (q - p) * (4 - 6 * tc);
          break;
        default:
          tc = p;
          break;
      }
      rgb[i] = Math.round(tc * 255);
    }
  }

  return {
    r: rgb[0],
    g: rgb[1],
    b: rgb[2],
  };
}

export const splitRgbaString = (
  color: string
): [number, number, number, number] => {
  const [r = 0, g = 0, b = 0, a = 1] = color
    .replace(/rgba?\(/, "")
    .replace(")", "")
    .split(",")
    .map((v) => parseFloat(v))
    .map((v) => (isNaN(v) ? 0 : v));
  return [r, g, b, a];
};

export function hexToRgba(hex: string, opacity: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
