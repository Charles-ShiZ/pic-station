import React from "react";
import {
  MULTI_LANG_REGEXP,
  hasOnlyArabic,
  resolveTextLayer,
  reverseAlign,
} from "./utils";
import CanvasTextLayer from "@/types/CanvasTextLayer";
import { Box } from "@mui/material";
import { TextAlign } from "@/types";

export function TextView({
  layer,
  lang = "en",
  ref,
}: {
  layer: CanvasTextLayer;
  lang?: string;
  ref: React.RefObject<HTMLDivElement | null>;
}) {
  const {
    width,
    fontSize,
    lineHeight,
    align,
    fontStyle,
    fontWeight,
    fill = "",
    fontTopSpace = 0,
    text,
    fontFamily,
    letterSpacing = 0,
    lineNumber = 1,
    direction: directionProp,
  } = resolveTextLayer(layer);

  const textFill = fill.includes("gradient")
    ? {
        backgroundImage: fill,
        backgroundSize: "100%",
        backgroundRepeat: "repeat",
        "-webkit-background-clip": "text",
        "-webkit-text-fill-color": "transparent",
        "-moz-background-clip": "text",
        "-moz-text-fill-color": "transparent",
      }
    : {
        color: fill,
      };

  const isSingleLine = lineNumber === 1;
  const isOnlyArabic = hasOnlyArabic(text);
  const hasArabic = text.match(MULTI_LANG_REGEXP.AR);
  let direction =
    (isSingleLine && isOnlyArabic) ||
    (!isSingleLine && hasArabic) ||
    ["ar"].includes(lang)
      ? "rtl"
      : "ltr";

  if (directionProp) {
    direction = directionProp;
  }

  const textAlign =
    !directionProp && direction === "rtl"
      ? reverseAlign((align ?? "left") as TextAlign)
      : (align as TextAlign);

  return (
    <Box
      ref={ref}
      style={{
        position: "relative",
        top: -fontTopSpace,
        width,
        fontSize,
        fontFamily,
        fontWeight,
        fontStyle,
        textAlign,
        letterSpacing,
        lineHeight,
        whiteSpace: "break-spaces",
        wordBreak: "break-word",
        ...textFill,
      }}
    >
      {text.split("").map((c, index) => {
        return <span key={index}>{c}</span>;
      })}
    </Box>
  );
}
