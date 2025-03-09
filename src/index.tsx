import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router";
import { psdData } from "./const";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
// import { initiate } from "./hooks/useTranslator";
import { unstable_ClassNameGenerator as ClassNameGenerator } from "@mui/material/className";
import "./public-path.js";
import { isQiankun } from "./qiankun";

ClassNameGenerator.configure((componentName) => `pic-station-${componentName}`);

// 预加载图片
psdData
  .map((i) => i.image_webp)
  .forEach((image_webp) => {
    if (image_webp) {
      const img = new Image();
      img.src = image_webp;
    }
  });

// initiate();

function render(props: any) {
  const root = props?.container
    ? props.container.querySelector("#root")
    : document.querySelector("#root");

  if (root) {
    createRoot(root).render(
      <React.StrictMode>
        <BrowserRouter basename={isQiankun ? "/pic-station" : ""}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
  }
}

if (!isQiankun) {
  render({});
}

export async function bootstrap() {}

export async function mount(props: any) {
  render(props);
}

export async function unmount(props: any) {
  const { container } = props;
  const root = container
    ? container.querySelector("#root")
    : document.querySelector("#root");
  root && createRoot(root).unmount();
}
