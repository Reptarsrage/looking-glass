import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import { AuthContext } from "../store/auth";
import * as lookingGlassService from "../services/lookingGlassService";
import { ModuleContext } from "../store/module";

const ImplicitAuthPage: React.FC = () => {
  const moduleId = useParams().moduleId!;
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const moduleContext = useContext(ModuleContext);
  const isAuthed = moduleId in authContext.auth;
  const [error, setError] = useState<Error | null>(null);
  const [searchParams] = useSearchParams();

  const returnUrl = searchParams.get("returnUrl")!;
  const module = moduleContext.modules.find((m) => m.id === moduleId);

  // effect to set window title
  useEffect(() => {
    window.electronAPI.setTitle(module?.name);
  }, []);

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

  if (isAuthed) {
    return <Navigate to={returnUrl} replace={true} />;
  }

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
