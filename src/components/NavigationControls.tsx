import { useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Fade from "@mui/material/Fade";

import { FullscreenContext } from "../store/fullscreen";
import useNavigationStack from "../hooks/useNavigationStack";

const NavigationControls: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fullscreen } = useContext(FullscreenContext);
  const { hasBack, hasForward } = useNavigationStack();
  const isHome = location.pathname === "/";
  const isSettings = location.pathname === "/settings";

  return (
    <Fade in={!fullscreen}>
      <Box component="span" sx={{ mx: 1, whiteSpace: "no-wrap" }}>
        <Fab
          component={Link}
          size="small"
          to="/settings"
          sx={{ mr: 1, WebkitAppRegion: "no-drag" }}
          disabled={isSettings}
        >
          <MoreVertIcon />
        </Fab>

        <Fab
          component={Link}
          size="small"
          color="primary"
          to="/"
          sx={{ mr: 1, WebkitAppRegion: "no-drag" }}
          disabled={isHome}
        >
          <HomeIcon />
        </Fab>

        <Fab
          size="small"
          color="primary"
          onClick={() => navigate(-1)}
          disabled={!hasBack}
          sx={{ mr: 1, WebkitAppRegion: "no-drag" }}
        >
          <ChevronLeftIcon />
        </Fab>

        <Fab
          size="small"
          color="primary"
          onClick={() => navigate(1)}
          disabled={!hasForward}
          sx={{ WebkitAppRegion: "no-drag" }}
        >
          <ChevronRightIcon />
        </Fab>
      </Box>
    </Fade>
  );
};

export default NavigationControls;
