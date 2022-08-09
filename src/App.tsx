import { useMemo, Suspense, useContext } from "react";
import { HashRouter } from "react-router-dom";
import Box from "@mui/material/Box";
import createTheme, { ThemeOptions } from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import CircularProgress from "@mui/material/CircularProgress";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ErrorBoundary from "./components/ErrorBoundary";
import TitleBar from "./components/TitleBar";
import AnErrorOccurred from "./components/Status/AnErrorOccurred";
import Router from "./Router";
import { AuthProvider } from "./store/auth";
import { PreferredTheme, SettingsContext } from "./store/settings";
import { ModuleProvider } from "./store/module";
import { FullscreenProvider } from "./store/fullscreen";
import { VolumeProvider } from "./store/volume";

// https://material-ui.com/customization/palette/
const darkTheme: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      light: "#a6d4fa",
      main: "#90caf9",
      dark: "#648dae",
    },
    secondary: {
      light: "#f6a5c0",
      main: "#f48fb1",
      dark: "#aa647b",
    },
    grey: {
      900: "#191919",
    },
  },
  zIndex: {
    drawer: 1300,
    modal: 1200,
  },
};

const lightTheme: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      light: "#4791db",
      main: "#1976d2",
      dark: "#115293",
    },
    secondary: {
      light: "#e33371",
      main: "#dc004e",
      dark: "#9a0036",
    },
    grey: {
      900: "#EBEBEB",
    },
  },
  zIndex: {
    drawer: 1300,
    modal: 1200,
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

const App: React.FC = () => {
  const settingsContext = useContext(SettingsContext);
  const { preferredTheme } = settingsContext.settings;
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const appliedTheme = useMemo(
    () =>
      createTheme(
        preferredTheme === PreferredTheme.Dark || (preferredTheme === PreferredTheme.Default && prefersDarkMode)
          ? darkTheme
          : lightTheme
      ),
    [prefersDarkMode, preferredTheme]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={appliedTheme}>
        <FullscreenProvider>
          <VolumeProvider>
            <CssBaseline />
            <HashRouter>
              <TitleBar />

              <Box sx={{ flex: "1", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <ErrorBoundary fallback={<AnErrorOccurred />}>
                  <Suspense
                    fallback={
                      <Box sx={{ paddingTop: "25%", textAlign: "center" }}>
                        <CircularProgress size="6rem" />
                      </Box>
                    }
                  >
                    <ModuleProvider>
                      <AuthProvider>
                        <Router />
                      </AuthProvider>
                    </ModuleProvider>
                  </Suspense>
                </ErrorBoundary>
              </Box>
            </HashRouter>
          </VolumeProvider>
        </FullscreenProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
