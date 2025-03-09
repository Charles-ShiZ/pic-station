import { uniq } from "lodash-es";
import { IHSL } from "./types";
import { loadImage, rgb2hsl } from "./utils";

export async function analyzeLayerImage({
  image,
  range,
  hslMap,
  hueCount,
  hslCount,
  filterWhiteAndBlack = false,
}: {
  image: string;
  range?: {
    sx: number;
    sy: number;
    sw: number;
    sh: number;
  };
  hueCount: Record<string, number>;
  hslCount?: Record<string, number>;
  hslMap: IHSL[];
  filterWhiteAndBlack?: boolean;
}) {
  const imageElement = await loadImage(image);
  const canvas = new OffscreenCanvas(imageElement.width, imageElement.height);
  const ctx = canvas.getContext("2d", {
    willReadFrequently: true,
  })! as unknown as CanvasRenderingContext2D;
  ctx.drawImage(imageElement, 0, 0);

  const imageData = range
    ? ctx.getImageData(range.sx, range.sy, range.sw, range.sh)
    : ctx.getImageData(0, 0, imageElement.width, imageElement.height);

  for (let i = 0; i < imageData.data.length; i += 4) {
    // 遍历每一个像素点的色值
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    // 转换成 hsl
    const hsl = rgb2hsl({
      r,
      g,
      b,
    });

    const { h, s, l } = hsl;
    if (filterWhiteAndBlack) {
      // 满足条件的颜色再写入
      if (l <= 90 && l > 5) {
        hslMap.push({ h, s, l });
        if (hslCount) {
          const hslKey = JSON.stringify({ h, s, l });
          hslCount[hslKey] = (hslCount[hslKey] ?? 0) + 1;
        }
        // 统计每个色相的数量
        if (hueCount[h]) hueCount[h]++;
        else hueCount[h] = 1;
      }
    } else {
      hslMap.push({ h, s, l });
      if (hslCount) {
        const hslKey = JSON.stringify({ h, s, l });
        hslCount[hslKey] = (hslCount[hslKey] ?? 0) + 1;
      }
      if (hueCount[h]) hueCount[h]++;
      else hueCount[h] = 1;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}
// 色相排序计算
export function rankHsl(
  hslMap: IHSL[],
  hueCount: Record<string, number>,
  hslCount?: Record<string, number>
) {
  // 计算主色调
  const mainHslItem = Object.entries(hslCount ?? {})?.sort(
    (a, b) => b[1] - a[1]
  );
  const mainHslStr = mainHslItem?.[0]?.[0] ?? '{"h":0,"s":0,"l":0}';
  const mainHsl = JSON.parse(mainHslStr) as IHSL;
  // 去重并倒序排序
  const uniqHslMap = uniq(hslMap.map((hsl) => JSON.stringify(hsl))).map((str) =>
    JSON.parse(str)
  ) as IHSL[];
  const sortedUniqHslMap = uniqHslMap.sort((a, b) => a.h - b.h);
  // 色相倒序排序
  const hueRank = Object.entries(hueCount)
    .map(([hue, count]) => [hue, count] as const)
    .sort((a, b) => b[1] - a[1]);
  // 获取主色相
  const [mainHue = 0] = hueRank[0] ?? [];
  return {
    mainHue: Number(mainHue),
    hslMap: sortedUniqHslMap,
    mainHsl,
  };
}

export async function analyzeLayersColor(layers: any[]) {
  const imageLayers = layers.filter((layer) => layer.type === "image");
  const hueCount: Record<string, number> = {};
  const hslMap: IHSL[] = [];
  // 分析每一层的颜色
  await Promise.all(
    imageLayers.map(async (imageLayer) => {
      const image = imageLayer.initialData?.image ?? "";
      await analyzeLayerImage({
        image,
        hueCount,
        hslMap,
        filterWhiteAndBlack: true,
      });
    })
  );
  return rankHsl(hslMap, hueCount);
}
