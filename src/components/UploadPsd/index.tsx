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
  const [psd, setPsd] = useState<string>(""); // http://localhost:3001/psds/1200-1200.psd
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
          const res = await axios.post("http://localhost:3001/psdParsing", {
            psd,
          });
          console.log("%c👉 res: ", "background:#41b883", res); // 🐵
        }}
      >
        解析
      </Button>
    </>
  );
}
