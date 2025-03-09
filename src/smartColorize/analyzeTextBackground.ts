import { calculateLuminance } from "@waku-objects/luminance";
import { analyzeLayerImage, rankHsl } from "./analyzeLayersColor";
import { IRGB, IHSL } from "./types";
import { hsl2rgb } from "./utils";
import CanvasImageLayer from "@/types/CanvasImageLayer";
import {
  parseTransformMatrix,
  toFixed2,
} from "@/pages/paintCanvas/TextLayer/utils";

export async function analyzeTextBackground(
  textBox?: Textbox,
  imageLayers?: CanvasImageLayer[]
) {
  let backgroundLuminance = 0;
  let backgroundMainRgba: IRGB = {
    r: 0,
    b: 0,
    g: 0,
  };
  let backgroundMainHsl: IHSL = {
    h: 0,
    s: 0,
    l: 0,
  };

  if (!textBox)
    return {
      backgroundLuminance,
      backgroundMainColor: {
        rgb: backgroundMainRgba,
        hsl: backgroundMainHsl,
      },
    };
  const transform =
    textBox.props.transform && textBox.props.transform.length
      ? textBox.props.transform
      : [1, 0, 0, 1, 0, 0];

  const { scaleX = 1, scaleY = 1 } = parseTransformMatrix(transform);
  const left = parseFloat(textBox.element.style.left);
  const top = parseFloat(textBox.element.style.top);
  const clientWidth = textBox.element.clientWidth;
  const clientHeight = textBox.element.clientHeight;
  const realWidth = clientWidth * scaleX;
  const realHeight = clientHeight * scaleY;

  const textLayerX = toFixed2(left + (clientWidth - realWidth) / 2);
  const textLayerY = toFixed2(top + (clientHeight - realHeight) / 2);
  const textLayerWidth = toFixed2(realWidth);
  const textLayerHeight = toFixed2(realHeight);

  const textLayerZIndex = textBox.props.zIndex;
  const sortedImageLayers = imageLayers?.sort((a, b) => b.zIndex - a.zIndex);
  const backgroundImageLayer = sortedImageLayers?.find((imageLayer) => {
    if (textLayerZIndex > imageLayer.zIndex) {
      if (
        imageLayer.x <= textLayerX &&
        imageLayer.x + imageLayer.width >= textLayerX + textLayerWidth &&
        imageLayer.y <= textLayerY &&
        imageLayer.y + imageLayer.height >= textLayerY + textLayerHeight
      ) {
        return true;
      }
    }
  }) as CanvasImageLayer;

  let backgroundBlock = "";
  let backgroundImage = "";
  if (backgroundImageLayer) {
    backgroundImage = backgroundImageLayer.image;

    const backgroundImageLayerImage = backgroundImageLayer.localUrl
      ? backgroundImageLayer.localUrl
      : backgroundImageLayer.image;

    const hueCount: Record<string, number> = {};
    const hslCount: Record<string, number> = {};
    const hslMap: IHSL[] = [];
    // console.log({
    //   sx: textLayerX - backgroundImageLayer.x,
    //   sy: textLayerY - backgroundImageLayer.y,
    //   sw: textLayerWidth,
    //   sh: textLayerHeight,
    // })
    const canvas = await analyzeLayerImage({
      image: backgroundImageLayerImage,
      hslMap,
      hueCount,
      hslCount,
      range: {
        sx: textLayerX - backgroundImageLayer.x,
        sy: textLayerY - backgroundImageLayer.y,
        sw: textLayerWidth,
        sh: textLayerHeight,
      },
    });

    backgroundBlock = window.URL.createObjectURL(await canvas.convertToBlob());
    const {
      // mainHue: bgMainHue,
      // hslMap: sortedHslMap,
      mainHsl,
    } = rankHsl(hslMap, hueCount, hslCount);
    // backgroundMainHsl = sortedHslMap
    //   .sort((a, b) => b.l - a.l)
    //   .find((hsl) => {
    //     return hsl.h === bgMainHue
    //   })
    backgroundMainHsl = mainHsl;

    if (backgroundMainHsl) {
      backgroundMainRgba = hsl2rgb({
        h: backgroundMainHsl.h,
        s: backgroundMainHsl.s,
        l: backgroundMainHsl.l,
      });
      backgroundLuminance = calculateLuminance({
        r: backgroundMainRgba.r,
        g: backgroundMainRgba.g,
        b: backgroundMainRgba.b,
      });
    }
  }
  return {
    backgroundLuminance,
    backgroundMainColor: {
      rgb: backgroundMainRgba,
      hsl: backgroundMainHsl,
    },
    backgroundImage,
    backgroundBlock,
  };
}
