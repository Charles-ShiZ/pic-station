import * as React from "react";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "./components/AppNavbar";
import Header from "./components/Header";
import MainGrid from "./components/MainGrid";
import SideMenu from "./components/SideMenu";
import AppTheme from "./theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./theme/customizations";
import { useNavigate, useRoutes } from "react-router";
import routes from "./config/routes";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { activeTabItemAtom } from "./atoms/global";
import { isQiankun } from "./qiankun";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  const RouterPage = useRoutes(routes);
  const [activeTabItem, setActiveTabItem] = useAtom(activeTabItemAtom);

  useEffect(() => {
    const location = window.location;
    const route = routes.find((route) => route.path === location.pathname);
    if (route) setActiveTabItem(route);
  }, []);
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", height: "100%" }}>
        {!isQiankun && <SideMenu />}
        {/* <AppNavbar /> */}
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            height: "100%",
            // backgroundColor: theme.vars
            //   ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
            //   : alpha(theme.palette.background.default, 1),
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mt: 0,
              marginTop: 0,
              // pb: 5,
              overflow: "hidden",
              height: "100%",
            }}
          >
            {!isQiankun && <Header />}
            <Box
              sx={{
                marginTop: "0!important",
                overflow: "auto",
                width: "100%",
                height: "100%",
              }}
            >
              {RouterPage}
              {/* <MainGrid /> */}
            </Box>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
