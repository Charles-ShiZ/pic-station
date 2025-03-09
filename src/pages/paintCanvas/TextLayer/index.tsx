import CanvasTextLayer from "@/types/CanvasTextLayer";
import { Box } from "@mui/material";
import React, { useLayoutEffect, useRef, useState } from "react";
import { TextView } from "./TextView";
import { measureText } from "./utils";
import { useAsyncEffect } from "ahooks";

export function TextLayer({
  layer,
  onClick,
}: {
  layer: CanvasTextLayer;
  onClick?: (textLayer: CanvasTextLayer) => void;
}) {
  const initialized = useRef(false);
  // const [textLayer, setTextLayer] = useState(layer);
  const textLayer = layer;

  const textLayerBoxRef = useRef<HTMLDivElement>(null);
  const textViewRef = useRef<HTMLDivElement>(null);

  const loadFont = async (fontFamily: string) => {
    try {
      const fontFileName = `${fontFamily}.ttf`;
      const fontFace = new window.FontFace(
        fontFamily,
        `url(https://localhost:3001/fonts/${fontFileName})`
      );
      await fontFace.load();
      document.fonts.add(fontFace);
    } catch (error) {
      console.log("%c👉 error: ", "background:#41b883", error); // 🐵
    }
  };

  const getTextLines = () => {
    const textView = textViewRef.current!;
    const spans = Array.from(textView.children) as HTMLSpanElement[];
    const object: Record<number, string> = {};
    spans.forEach((span) => {
      object[span.offsetTop] =
        (object[span.offsetTop] ?? "") + span.textContent;
    });
    const textLines = Object.keys(object)
      .sort((a, b) => +a - +b)
      .map((key) => object[key as unknown as number]);

    textLayer.textLines = textLines;
    return textLines;
  };

  const measureTextLine = (index: number) => {
    const { fontSize, fontFamily, lineHeight } = textLayer;
    const textLines = getTextLines();
    const textLine = textLines[index];
    const {
      actualBoundingBoxAscent,
      actualBoundingBoxDescent,
      fontBoundingBoxAscent,
      fontBoundingBoxDescent,
      width,
    } = measureText({
      text: textLine,
      fontSize,
      fontFamily,
    });

    const actualLineHeight = actualBoundingBoxAscent + actualBoundingBoxDescent;

    const leadingDifference =
      fontBoundingBoxAscent -
      actualBoundingBoxAscent -
      (fontBoundingBoxDescent - actualBoundingBoxDescent);
    const extraSpace = fontSize * lineHeight - actualLineHeight;

    const lineTopSpace = (extraSpace + leadingDifference) / 2;
    const lineBottomSpace = (extraSpace - leadingDifference) / 2;

    return {
      actualHeight: actualLineHeight,
      topSpace: lineTopSpace,
      bottomSpace: lineBottomSpace,
      width,
    };
  };

  const initTextPosition = () => {
    const textView = textViewRef.current!;
    const textLines = getTextLines();

    const { topSpace } = measureTextLine(0);
    const { bottomSpace } = measureTextLine(textLines.length - 1);
    textView.style.top = -topSpace + "px";

    textLayer.fontTopSpace = topSpace;
    textLayer.fontBottomSpace = bottomSpace;
  };

  const initLayerWidth = () => {
    const textView = textViewRef.current!;
    const textLayerBox = textLayerBoxRef.current!;

    const { width, lineNumber = 1 } = textLayer;

    let count = 0;
    while (getTextLines().length > lineNumber && count < 10) {
      const newWidth = parseInt(textView.style.width) + 1 + "px";
      textLayerBox.style.width = newWidth;
      textView.style.width = newWidth;
      count++;
    }

    const newWidth = width + count;
    return newWidth;
  };

  useAsyncEffect(async () => {
    await loadFont(textLayer.fontFamily);
    initLayerWidth();
    initTextPosition();
    initialized.current = true;
  }, []);

  const getActualTextHeight = (textView: HTMLDivElement) => {
    const clientHeight = textView.clientHeight;
    const textLines = getTextLines();
    const { topSpace } = measureTextLine(0);
    const { bottomSpace } = measureTextLine(textLines.length - 1);
    textView.style.top = -topSpace + "px";
    textLayer.fontTopSpace = topSpace;
    return clientHeight - (topSpace + bottomSpace);
  };

  // 自动字号
  useLayoutEffect(() => {
    if (initialized.current) {
      const textView = textViewRef.current!;
      if (getActualTextHeight(textView) > textLayer.height) {
        while (
          getActualTextHeight(textView) > textLayer.height &&
          parseInt(textView.style.fontSize) > 12
        ) {
          const fontSize = parseInt(textView.style.fontSize);
          const newFontSize = fontSize - 1;
          textView.style.fontSize = newFontSize + "px";
          textLayer.fontSize = newFontSize;
        }
      } else {
        while (getActualTextHeight(textView) < textLayer.height) {
          const fontSize = parseInt(textView.style.fontSize);
          const newFontSize = fontSize + 1;
          textView.style.fontSize = newFontSize + "px";
          textLayer.fontSize = newFontSize;
          if (getActualTextHeight(textView) >= textLayer.height) {
            textView.style.fontSize = newFontSize - 1 + "px";
            textLayer.fontSize = newFontSize - 1;
            break;
          }
        }
      }
    }
  }, [textLayer.text]);

  return (
    <Box
      ref={textLayerBoxRef}
      id={layer.id}
      style={{
        position: "absolute",
        top: layer.y,
        left: layer.x,
        width: layer.width,
        height: layer.height,
        zIndex: layer.zIndex,
        opacity: layer.opacity,
        visibility: layer.visible ? "visible" : "hidden",
        border: "1px dashed blue",
      }}
      onClick={() => {
        onClick?.(textLayer);
      }}
    >
      <TextView ref={textViewRef} layer={textLayer} />
    </Box>
  );
}
