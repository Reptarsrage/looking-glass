import { useContext, useEffect, useState } from "react";
import { useNavigate, useNavigationType, useLocation, Link } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Fade from "@mui/material/Fade";

import { FullscreenContext } from "../store/fullscreen";

const NavigationControls: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fullscreen } = useContext(FullscreenContext);
  const navigationType = useNavigationType();
  const [stack, setStack] = useState<string[]>([]);
  const [stackPointer, setStackPointer] = useState(0);

  useEffect(() => {
    const currentLocation = `${location.pathname}${location.search}`;

    // Handle "REPLACE" navigation. These don't currently ever happen.
    if (navigationType === "REPLACE") {
      // Simply replace last element of the stack
      setStack(stack.slice(0, stackPointer + 1).concat(currentLocation));
      return;
    }

    // Handle "PUSH" navigation. These can occur if the user navigates to a new route, or
    // react refresh updates the current page
    if (navigationType === "PUSH" && stack[stackPointer] !== currentLocation) {
      // Handle navigation to a new URL by pushing a new location to the stack and incrementing the pointer.
      // Make sure to chop off old stack items that may have cropped up via the back button.
      setStack(stack.slice(0, stackPointer + 1).concat(currentLocation));
      setStackPointer(stackPointer + 1);
      return;
    }

    // Handle "POP" navigation. These occur when going forward, backward, and on
    // initialization (when app is first opened).
    if (navigationType === "POP") {
      if (stack.length === 0) {
        // Handle initialize by creating stack
        setStack([currentLocation]);
        setStackPointer(0);
        return;
      }

      if (stack[stackPointer - 1] === currentLocation) {
        // Handle back by decrementing pointer
        setStackPointer(stackPointer - 1);
        return;
      }

      // Handle forward by incrementing pointer
      setStackPointer(stackPointer + 1);
    }
  }, [location]);

  const hasBack = stackPointer > 0;
  const hasForward = stackPointer < stack.length - 1;

  return (
    <Fade in={!fullscreen}>
      <Box component="span" sx={{ mx: 1, whiteSpace: "no-wrap" }}>
        <Fab component={Link} size="small" to="/settings" sx={{ mr: 1, WebkitAppRegion: "no-drag" }}>
          <MoreVertIcon />
        </Fab>

        <Fab component={Link} size="small" color="primary" to="/" sx={{ mr: 1, WebkitAppRegion: "no-drag" }}>
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
