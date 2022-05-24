import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import { useAuthStore } from "../store/auth";
import * as lookingGlassService from "../services/lookingGlassService";

const ImplicitAuthPage: React.FC = () => {
  const moduleId = useParams().moduleId!;
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const isAuthed = useAuthStore((state) => moduleId in state.authByModule);
  const [error, setError] = useState<Error | null>(null);
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl")!;

  useEffect(() => {
    async function login() {
      try {
        const response = await lookingGlassService.login(moduleId);
        setAuth(moduleId, response);
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
