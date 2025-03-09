import {
  calculateLuminance,
  getClosestColor,
  hexToRgb,
} from "@waku-objects/luminance";
import { hexToRgba, hsl2rgb, rgb2hsl, splitRgbaString } from "./utils";

import { IRGB, IHSL } from "./types";

export function transformColor({
  color,
  smartH,
  backgroundLuminance = 1,
  backgroundMainColor,
}: {
  color: string;
  smartH: number;
  backgroundLuminance: number;
  backgroundMainColor: {
    rgb: IRGB;
    hsl: IHSL;
  };
}) {
  const fillRgba = splitRgbaString(color);
  const originalLuminance = calculateLuminance({
    r: fillRgba[0],
    g: fillRgba[1],
    b: fillRgba[2],
  });

  const fillHsl = rgb2hsl({
    r: fillRgba[0],
    g: fillRgba[1],
    b: fillRgba[2],
  });

  const s = Math.round(fillHsl.s);
  const l = Math.round(fillHsl.l);

  const newHsl = {
    h: smartH,
    s,
    l,
  };
  const newRgb = hsl2rgb({
    h: newHsl.h,
    s: newHsl.s,
    l: newHsl.l,
  });

  if (originalLuminance > 0.95) {
    if (backgroundLuminance > 0.75) {
      const luminance = 0.3;
      const newRgb = hsl2rgb({
        h: (backgroundMainColor.hsl.h + 180) % 360,
        s: backgroundMainColor.hsl.s,
        l: backgroundMainColor.hsl.l,
      });
      const hex = getClosestColor(newRgb, luminance);
      const rgb = hexToRgb(hex);
      return {
        color: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        luminance,
        originalLuminance,
      };
    }
    return {
      color,
      luminance: originalLuminance,
      backgroundLuminance,
    };
  }
  if (originalLuminance < 0.05) {
    if (backgroundLuminance < 0.3) {
      const hex = getClosestColor(newRgb, 1);
      const rgb = hexToRgb(hex);
      return {
        color: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        luminance: 1,
        originalLuminance,
      };
    }
    return {
      color,
      luminance: originalLuminance,
      backgroundLuminance,
    };
  }

  let newLuminance = calculateLuminance({
    r: newRgb.r,
    g: newRgb.g,
    b: newRgb.b,
  });

  let newColor = getClosestColor(newRgb, newLuminance);

  if (Math.abs(backgroundLuminance - newLuminance) < 0.25) {
    if (backgroundLuminance <= 0.5) {
      newLuminance = backgroundLuminance * 1.8;
      newColor = getClosestColor(newRgb, newLuminance);
    } else {
      newLuminance = backgroundLuminance * 0.2;
      newColor = getClosestColor(newRgb, newLuminance);
    }
  }

  const rgb = hexToRgba(newColor, 1);
  return {
    color: rgb,
    luminance: newLuminance,
    originalLuminance: originalLuminance,
  };
}
