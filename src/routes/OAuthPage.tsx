import { useState, useCallback } from "react";
import { useNavigate, useParams, Navigate, useSearchParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import CloseIcon from "@mui/icons-material/Close";

import { useModulesStore } from "../store/module";
import { useAuthStore } from "../store/auth";
import * as lookingGlassService from "../services/lookingGlassService";

const OAuthPage: React.FC = () => {
  const app = window.require("@electron/remote");
  const moduleId = useParams().moduleId!;
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const isAuthed = useAuthStore((state) => moduleId in state.authByModule);
  const module = useModulesStore(useCallback((state) => state.modules.find((m) => m.id === moduleId)!, [moduleId]));
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl")!;

  const showOauthModal = (uri: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const url = new URL(uri);
      const searchParams = new URLSearchParams(url.search);
      const expectedState = searchParams.get("state");
      const authWindow: Electron.BrowserWindow = new app.BrowserWindow({
        parent: app.getCurrentWindow(),
        modal: true,
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
          devTools: false,
        },
      });

      const handleRedirect = (uri: string) => {
        const url = new URL(uri);
        const searchParams = new URLSearchParams(url.search);
        const state = searchParams.get("state");
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        if (error) {
          reject(new Error(error));
        }

        if (state === expectedState && code) {
          authWindow.removeAllListeners("closed");
          setImmediate(() => authWindow.close());
          resolve(code);
        }
      };

      authWindow.on("closed", () => reject(new Error("Auth window was closed by user")));
      authWindow.webContents.on("will-redirect", (_, newUrl) => handleRedirect(newUrl));
      authWindow.webContents.on("will-navigate", (_, newUrl) => handleRedirect(newUrl));

      console.log("uri", uri);
      authWindow.loadURL(uri);
      authWindow.show();
    });
  };

  function handleClose() {
    navigate(-1);
  }

  async function handleSubmit() {
    if (!module.oAuthUrl) {
      return;
    }

    setFetching(true);

    try {
      const code = await showOauthModal(module.oAuthUrl);
      console.log("code", code);
      const response = await lookingGlassService.authorize(moduleId, code);
      setAuth(moduleId, response);
    } catch (error: unknown) {
      setError(error as Error);
    } finally {
      setFetching(false);
    }
  }

  if (isAuthed) {
    return <Navigate to={returnUrl} replace={true} />;
  }

  return (
    <Container component="main" maxWidth="xs" sx={{ pt: "20%" }}>
      <Paper elevation={3} sx={{ p: 3, textAlign: "center", position: "relative" }}>
        <IconButton size="large" onClick={handleClose} sx={{ position: "absolute", top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>

        <Avatar sx={{ mt: 2, mx: "auto", bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5" sx={{ mt: 3 }}>
          Authorize using {module.name} OAuth
        </Typography>

        {error && (
          <Typography align="center" color="error">
            {error.message}
          </Typography>
        )}

        <Button
          type="button"
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
          onClick={handleSubmit}
          disabled={fetching}
          startIcon={<LockOpenIcon />}
        >
          Authorize
        </Button>
      </Paper>
    </Container>
  );
};

export default OAuthPage;
