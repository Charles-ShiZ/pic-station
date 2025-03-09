import { Box } from "@mui/material";
import { resolveTextLayer } from "./utils";
import { TextAlign } from "@/types";
import React from "react";
import CanvasTextLayer from "@/types/CanvasTextLayer";

export function TextEditor({
  layer,
  visible,
  height,
  onChange,
}: {
  layer: CanvasTextLayer;
  visible: boolean;
  height?: number;
  onChange?: (text: string) => void;
}) {
  const {
    width,
    fontSize,
    lineHeight,
    align,
    opacity,
    fontStyle,
    fontWeight,
    fontTopSpace = 0,
  } = resolveTextLayer(layer);

  const text = layer.text.replace(/\r/g, "\n");
  const letterSpacing = layer.letterSpacing || 0 + "px";
  const fontFamily = layer.fontFamily.split(",")[0].trim();

  return (
    <div
      style={{
        position: "absolute",
        top: -fontTopSpace,
        width,
        opacity,
        fontSize,
        fontFamily,
        fontWeight,
        fontStyle,
        textAlign: align as TextAlign,
        letterSpacing,
        lineHeight,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      <Box
        sx={{
          // position: 'absolute',
          // top: 0,
          // left: 0,
          zIndex: 100,
          "& textarea": {
            overflow: "hidden!important",
          },
          "& textarea:focus-visible": {
            outline: "none",
          },
        }}
      >
        <textarea
          className="textbox-editor"
          style={{
            visibility: visible ? "visible" : "hidden",
            background: "transparent",
            border: "none",
            padding: 0,
            width,
            height: height,
            fontSize,
            fontFamily,
            fontStyle,
            letterSpacing,
            textAlign: align as TextAlign,
            fontWeight,
            lineHeight,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            color: "transparent",
            caretColor: "#1677ff",
          }}
          value={text}
          onChange={(e) => {
            const value = e.target.value;
            onChange?.(value);
          }}
        />
      </Box>
    </div>
  );
}
