import Button from "@mui/material/Button";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { Input } from "@mui/material";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export function UploadPsd() {
  const [psd, setPsd] = useState<string>(""); // https://localhost:3001/psds/1200-1200.psd
  return (
    <>
      <Input
        value={psd}
        onChange={(e) => {
          setPsd(e.target.value);
        }}
      ></Input>
      <Button
        onClick={async () => {
          const psds = [
            "https://localhost:3001/psds/1080-1920-1.psd",
            "https://localhost:3001/psds/1080-1920-2.psd",
            "https://localhost:3001/psds/1080-1920-3.psd",
            "https://localhost:3001/psds/1080-1920-4.psd",
            "https://localhost:3001/psds/1080-1920.psd",
            "https://localhost:3001/psds/1200-902.psd",
            "https://localhost:3001/psds/1200-1200.psd",
            "https://localhost:3001/psds/1200-1500.psd",
            "https://localhost:3001/psds/dc13.psd",
          ];
          const psdData = await Promise.allSettled(
            psds.map(async (psd) => {
              const res = await axios.post(
                "https://localhost:3001/psdParsing",
                {
                  psd,
                }
              );
              return res;
            })
          );

          console.log("%c👉 psdData: ", "background:#41b883", psdData); // 🐵
        }}
      >
        解析
      </Button>
    </>
  );
}
