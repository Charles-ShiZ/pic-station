import { IHSL } from "./types";
import CanvasImageLayer from "@/types/CanvasImageLayer";
import { loadImage, rgb2hsl, hsl2rgb } from "./utils";
import CanvasTextLayer from "@/types/CanvasTextLayer";
import { analyzeTextBackground } from "./analyzeTextBackground";
import { transformColor } from "./transformColor";

export async function colorizeTexts({
  layers: { textLayers, imageLayers },
  smartHSL,
}: {
  layers: {
    textLayers: CanvasTextLayer[];
    imageLayers: CanvasImageLayer[];
  };
  smartHSL: IHSL;
}) {
  const smartH = Math.round(smartHSL.h);
  return Promise.all(
    textLayers.map(async (textLayer) => {
      const textBox = textLayer.Textbox;
      const {
        backgroundLuminance,
        backgroundMainColor,
        backgroundImage,
        backgroundBlock,
      } = await analyzeTextBackground(textBox, imageLayers);
      const { rgb, hsl } = backgroundMainColor;

      const initialFill = textLayer.initialData?.fill ?? "";
      const {
        color: newFill,
        luminance,
        originalLuminance,
      } = transformColor({
        color: initialFill,
        smartH,
        backgroundLuminance,
        backgroundMainColor,
      });

      return {
        ...textLayer,
        fill: newFill,
      };
    })
  );
}
