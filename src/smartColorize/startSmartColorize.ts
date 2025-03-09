import { psdData } from "@/const";
import { rgb2hsl } from "./utils";
import { TRGBA } from "./types";
import CanvasImageLayer, { isCanvasImageLayer } from "@/types/CanvasImageLayer";
import { uniqueId } from "lodash-es";
import { colorizeImages } from "./colorizeImages";
import { colorizeTexts } from "./colorizeTexts";
import { isCanvasTextLayer } from "@/types/CanvasTextLayer";

export async function startSmartColorize(
  canvasData: (typeof psdData)[number],
  {
    smartColor,
    filterLayerIds = [],
  }: {
    smartColor: TRGBA;
    filterLayerIds: CanvasImageLayer["id"][];
  }
): Promise<(typeof psdData)[number]> {
  const layers = canvasData?.layers ?? [];
  const imageLayers = layers.filter((layer) => isCanvasImageLayer(layer));
  const textLayers = layers.filter((layer) => isCanvasTextLayer(layer));
  // 需要换配色的图层
  const imageLayersFiltered = imageLayers.filter(
    (layer) => !filterLayerIds.includes(layer.id)
  );
  // 不变的图层
  const commodityImageLayers = imageLayers.filter(
    (layer) => !!filterLayerIds.includes(layer.id)
  );

  const smartHSL = rgb2hsl(smartColor);

  // const newImageLayers = await colorizeImages({
  //   smartHSL,
  //   imageLayers: imageLayersFiltered,
  // });

  // const newTextLayers = await colorizeTexts({
  //   smartHSL,
  //   layers: {
  //     textLayers,
  //     imageLayers: [...newImageLayers, ...commodityImageLayers],
  //   },
  // });

  const newImageLayers = await new Promise<CanvasImageLayer[]>((resolve) => {
    const colorizeImages_worker = new Worker(
      new URL("./workers/colorizeImages.worker.ts", import.meta.url)
    );
    const callback = function (event: MessageEvent) {
      const newImageLayers = event.data;
      resolve(newImageLayers);
      colorizeImages_worker.removeEventListener("message", callback);
    };
    colorizeImages_worker.onmessage = callback;
    colorizeImages_worker.postMessage({
      smartHSL,
      imageLayers: imageLayersFiltered,
    });
  });

  if (canvasData) {
    const newLayers = [
      ...newImageLayers,
      ...textLayers,
      ...commodityImageLayers,
    ];
    return {
      ...canvasData,
      id: uniqueId(),
      layers: newLayers,
    };
  }
  return canvasData;
}
