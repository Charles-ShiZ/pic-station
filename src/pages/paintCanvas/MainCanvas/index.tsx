import CanvasImageLayer from "@/types/CanvasImageLayer";
import CanvasTextLayer from "@/types/CanvasTextLayer";
import { Box } from "@mui/material";
import React from "react";
import { TextLayer } from "../TextLayer";

export default function MainCanvas({
  textLayers,
  imageLayers,
  onClick,
  scale = 1,
}: {
  textLayers: CanvasTextLayer[];
  imageLayers: CanvasImageLayer[];
  onClick?: (layer: CanvasTextLayer) => void;
  scale?: number;
}) {
  return (
    <Box>
      <Box
        sx={{
          transform: `scale(${scale})`,
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {textLayers?.map((textLayer) => {
          return (
            <TextLayer
              key={textLayer.id}
              layer={textLayer}
              onClick={(textLayer) => {
                onClick?.(textLayer);
              }}
            />
          );
        })}
        {imageLayers?.map((imageLayer) => {
          return (
            <Box
              key={imageLayer.id}
              sx={{
                position: "absolute",
                top: imageLayer.y,
                left: imageLayer.x,
                zIndex: imageLayer.zIndex,
                width: imageLayer.width,
                height: imageLayer.height,
              }}
            >
              <img
                src={imageLayer.image_webp || imageLayer.image}
                width={imageLayer.width}
                height={imageLayer.height}
                alt={imageLayer.image_webp || imageLayer.image}
              ></img>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
