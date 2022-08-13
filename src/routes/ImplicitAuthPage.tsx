import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import { AuthContext } from "../store/auth";
import * as lookingGlassService from "../services/lookingGlassService";
import { ModuleContext } from "../store/module";

const ImplicitAuthPage: React.FC = () => {
  const { moduleId = "" } = useParams();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const moduleContext = useContext(ModuleContext);
  const [error, setError] = useState<Error | null>(null);
  const [searchParams] = useSearchParams();

  const isAuthed = moduleId in authContext.auth;
  const returnUrl = searchParams.get("returnUrl")!;
  const module = moduleContext.modules.find((m) => m.id === moduleId);

  // effect to set window title
  useEffect(() => {
    window.electronAPI.setTitle(module?.name);
  }, []);

  // effect to redirect on auth
  useEffect(() => {
    if (isAuthed) {
      navigate(returnUrl, { replace: true });
    }
  }, [isAuthed]);

  useEffect(() => {
    async function login() {
      try {
        const value = await lookingGlassService.login(moduleId);
        authContext.setAuth({ moduleId, value });
        navigate(returnUrl, { replace: true });
      } catch (error: unknown) {
        setError(error as Error);
      }
    }

    if (!isAuthed) {
      login();
    }
  }, [isAuthed, moduleId]);

  if (error) {
    return <span>An error ocurred while logging in...</span>;
  }

  return (
    <Box sx={{ flex: "1", paddingTop: "25%", textAlign: "center" }}>
      <CircularProgress size="6rem" />
    </Box>
  );
};

export default ImplicitAuthPage;
