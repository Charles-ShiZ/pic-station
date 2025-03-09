import { Box } from "@mui/material";
import { HourglassTop } from "@mui/icons-material/";
import React from "react";

export function TextLoading({
  isLoading,
  fontSize,
}: {
  isLoading: boolean;
  fontSize: number;
}) {
  return (
    <Box
      style={{
        position: "absolute",
        zIndex: 100,
        width: "100%",
        background: "rgba(0,0,0,0.3)",
        display: isLoading ? "flex" : "none",
        justifyContent: "center",
      }}
    >
      <HourglassTop
        style={{
          fontSize,
          borderRadius: "100%",
          color: "#ccc",
          padding: "4px",
          animation: "uploadingIconRotate 1s infinite linear",
        }}
      />
    </Box>
  );
}
