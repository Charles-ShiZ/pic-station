import CanvasTextLayer from "@/types/CanvasTextLayer";

export const resolveText = (text: string) =>
  text.replace(/\r/g, "\n").replace(/^\n/g, "");
export const getFirstFontFamily = (fontFamily: string) =>
  fontFamily.split(",")[0].trim();

export const toFixed2 = (num: number) => {
  if (num) {
    return Number(num.toFixed(2));
  }
  return 0;
};

export const getOriginWidthFromTransformMatrix = ({
  // TODO: This function is not used anywhere
  width,
  transform,
}: {
  width: number;
  transform?: number[];
}) => {
  if (Array.isArray(transform) && transform.length === 6) {
    const [a, b, c, d, e, f] = transform.slice(0, 4).concat([0, 0]);
    const [x, y] = [width, 0];
    const y1 = (a * y - b * x + b * e - a * f) / (d * a - b * c);
    const x1 = (x - e - c * y1) / a;
    return x1;
  } else {
    return width;
  }
};

export const resolveTextLayer = (layer: CanvasTextLayer): CanvasTextLayer => {
  return {
    ...layer,
    // uniqueId: nanoid(),
    text: resolveText(layer.text).trim(),
    fontFamily: getFirstFontFamily(layer.fontFamily),
  };
};

export const parseTransformMatrix = (a: number[] = [1, 0, 0, 1, 0, 0]) => {
  const angle = Math.atan2(a[1], a[0]),
    denom = Math.pow(a[0], 2) + Math.pow(a[1], 2),
    scaleX = Math.sqrt(denom),
    scaleY = (a[0] * a[3] - a[2] * a[1]) / scaleX,
    skewX = Math.atan2(a[0] * a[2] + a[1] * a[3], denom);

  const anglePI = angle / (Math.PI / 180);
  const skewXPI = skewX / (Math.PI / 180);
  return {
    angle: toFixed2(anglePI),
    scaleX: toFixed2(scaleX),
    scaleY: toFixed2(scaleY),
    skewX: toFixed2(skewXPI),
    skewY: 0,
    translateX: toFixed2(a[4]),
    translateY: toFixed2(a[5]),
  };
};

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

export const reverseAlign = (align: "left" | "center" | "right") => {
  return align === "left" ? "right" : align === "right" ? "left" : align;
};

export const MULTI_LANG_REGEXP = {
  WORDS: /[a-zA-ZàâäèéêëîïôœùûüÿçÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ]+/g, // 匹配英语、德语、法语
  CN: /[\u4e00-\u9fa5]/g, // 中文
  KO: /[\uac00-\ud7ff]/g, // 韩语
  JA: /[\u0800-\u4e00]/g, // 日语
  TH: /[\u0E00-\u0E7F]/g, // 泰语
  AR: /[\u0600-\u06FF]/g, // 阿拉伯语
};

export const hasOnlyArabic = (text: string) => {
  return (
    text.match(MULTI_LANG_REGEXP.AR) &&
    text.replace(MULTI_LANG_REGEXP.AR, "").trim() === ""
  );
};

export function transformAngleToCoordinate(angle: number) {
  const anglePI = (angle - 90) * (Math.PI / 180);
  const angleCoords = {
    x1: Math.round(50 + Math.sin(anglePI) * 50) + "%",
    y1: Math.round(50 + Math.cos(anglePI) * 50) + "%",
    x2: Math.round(50 + Math.sin(anglePI + Math.PI) * 50) + "%",
    y2: Math.round(50 + Math.cos(anglePI + Math.PI) * 50) + "%",
  };
  return angleCoords;
}

export function measureText({
  text,
  fontSize,
  fontFamily,
}: {
  text: string;
  fontSize: number;
  fontFamily?: string;
}) {
  const canvas = document.createElement("canvas")!;
  const ctx = canvas.getContext("2d")!;
  ctx.font = `${fontSize}px ${fontFamily}`;
  const metrics = ctx.measureText(text);
  canvas.remove();
  return metrics;
}
