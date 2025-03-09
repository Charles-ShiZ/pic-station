import React from "react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PictureInPictureRounded from "@mui/icons-material/PictureInPictureRounded";

export default [
  {
    path: "/",
    name: "Home",
    Component: React.lazy(() => import("../pages/home")),
    icon: <HomeRoundedIcon />,
  },
  {
    path: "/paintCanvas",
    name: "PaintCanvas",
    Component: React.lazy(() => import("../pages/paintCanvas")),
    icon: <PictureInPictureRounded />,
  },
];

export const smartColors = [
  { r: 208, g: 2, b: 27, a: 1 },
  { r: 245, g: 166, b: 35, a: 1 },
  { r: 248, g: 231, b: 28, a: 1 },
  { r: 139, g: 87, b: 42, a: 1 },
  { r: 126, g: 211, b: 33, a: 1 },
  { r: 189, g: 16, b: 224, a: 1 },
  { r: 74, g: 144, b: 226, a: 1 },
  { r: 80, g: 227, b: 194, a: 1 },
  { r: 65, g: 117, b: 5, a: 1 },
  { r: 144, g: 19, b: 254, a: 1 },
  { r: 184, g: 233, b: 134, a: 1 },
  { r: 184, g: 200, b: 134, a: 1 },
  { r: 184, g: 170, b: 134, a: 1 },
  { r: 160, g: 140, b: 134, a: 1 },
  { r: 123, g: 233, b: 134, a: 1 },
  { r: 150, g: 233, b: 134, a: 1 },
  { r: 190, g: 30, b: 134, a: 1 },
  { r: 255, g: 233, b: 134, a: 1 },
  { r: 60, g: 100, b: 134, a: 1 },
  { r: 100, g: 203, b: 54, a: 1 },
];
