import { lazy, useMemo, Suspense, useContext } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
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
import NotFound from "./components/Status/NotFound";
import { AuthProvider } from "./store/auth";
import { PreferredTheme, SettingsContext } from "./store/settings";
import { ModuleProvider } from "./store/module";
import { TagProvider } from "./store/tag";
import { FullscreenProvider } from "./store/fullscreen";
import { GalleryProvider } from "./store/gallery";

// Dynamic routes
const HomePage = lazy(() => import("./routes/HomePage"));
const GalleryPage = lazy(() => import("./routes/GalleryPage"));
const OAuthPage = lazy(() => import("./routes/OAuthPage"));
const BasicAuthPage = lazy(() => import("./routes/BasicAuthPage"));
const ImplicitAuthPage = lazy(() => import("./routes/ImplicitAuthPage"));
const SettingsPage = lazy(() => import("./routes/SettingsPage"));

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
      refetchOnMount: false,
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
                      <GalleryProvider>
                        <TagProvider>
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/gallery/:moduleId" element={<GalleryPage />} />
                            <Route path="/basic-auth/:moduleId" element={<BasicAuthPage />} />
                            <Route path="/oauth/:moduleId" element={<OAuthPage />} />
                            <Route path="/implicit-auth/:moduleId" element={<ImplicitAuthPage />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </TagProvider>
                      </GalleryProvider>
                    </AuthProvider>
                  </ModuleProvider>
                </Suspense>
              </ErrorBoundary>
            </Box>
          </HashRouter>
        </FullscreenProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
