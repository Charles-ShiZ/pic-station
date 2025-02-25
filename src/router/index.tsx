import { createBrowserRouter } from "react-router";
import React from "react";

const router = createBrowserRouter([
  {
    path: "/",
    Component: React.lazy(() => import("../pages/home")),
  },
  {
    path: "/paintCanvas",
    Component: React.lazy(() => import("../pages/paintCanvas")),
  },
]);
export default router;
