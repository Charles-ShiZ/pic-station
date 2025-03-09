import { resolveTextLayer } from "./utils";
import { Box } from "@mui/material";
import React from "react";
import CanvasTextLayer from "@/types/CanvasTextLayer";

export function TextBackground({ textLayer }: { textLayer: CanvasTextLayer }) {
  const {
    width,
    height,
    backgroundColor,
    background,
    borderRadius = 0,
    fontTopSpace = 0,
    fontBottomSpace = 0,
  } = resolveTextLayer(textLayer);
  return (
    <Box
      sx={{
        position: "absolute",
        top: (fontTopSpace - fontBottomSpace) / 2,
        width,
        height: height + fontBottomSpace + fontTopSpace,
        backgroundColor,
        background,
        borderRadius: `${borderRadius}px`,
      }}
    ></Box>
  );
}
