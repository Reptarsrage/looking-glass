import { useState, useCallback } from "react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import LoginIcon from "@mui/icons-material/Login";
import CloseIcon from "@mui/icons-material/Close";

import { useModulesStore } from "../store/module";
import { useAuthStore } from "../store/auth";
import * as lookingGlassService from "../services/lookingGlassService";

const BasicAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const moduleId = useParams().moduleId!;
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl")!;
  const isAuthed = useAuthStore((state) => moduleId in state.authByModule);
  const module = useModulesStore(useCallback((state) => state.modules.find((m) => m.id === moduleId)!, [moduleId]));
  const setAuth = useAuthStore((state) => state.setAuth);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function login() {
    setFetching(true);

    try {
      const response = await lookingGlassService.login(moduleId, username, password);
      setAuth(moduleId, response);
    } catch (error: unknown) {
      setError(error as Error);
    } finally {
      setFetching(false);
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleUsernameChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    login();
  };

  function handleClose() {
    navigate(-1);
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
          Sign in to {module.name}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl margin="normal" required fullWidth disabled={fetching}>
            <InputLabel htmlFor="username">Username</InputLabel>
            <Input
              id="username"
              type="text"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={handleUsernameChange}
            />
          </FormControl>

          <FormControl margin="normal" required fullWidth disabled={fetching} error={error !== null}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete={showPassword ? "off" : "current-password"}
              aria-describedby="component-error-text"
              value={password}
              onChange={handlePasswordChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="Toggle password visibility" onClick={handleClickShowPassword}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText id="component-error-text">
              {error && "An error occurred. Please check your username and password and try again."}
            </FormHelperText>
          </FormControl>

          <Box sx={{ m: 1, position: "relative" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 4 }}
              disabled={fetching}
              startIcon={<LoginIcon />}
            >
              Log in
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BasicAuthPage;
