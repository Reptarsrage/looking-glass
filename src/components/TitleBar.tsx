import { useState, useCallback, useEffect } from "react";
import { styled } from "@mui/system";
import type { BrowserWindow } from "electron";
import Box from "@mui/material/Box";

import NavigationControls from "./NavigationControls";
import SearchBar from "./SearchBar";

const TitleBarContainer = styled("header")(({ theme }) => ({
  display: "block",
  position: "fixed",
  height: "64px",
  width: "100%",
  background: theme.palette.grey[900],
  color: theme.palette.getContrastText(theme.palette.grey[900]),
  boxShadow: (theme.shadows as any)[3],
}));

const DragRegion = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
  WebkitAppRegion: "drag",
  display: "flex",
  alignItems: "center",
}));

const WindowControls = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(3, 46px)",
  position: "absolute",
  top: 0,
  right: 0,
  height: "30px",
  WebkitAppRegion: "no-drag",
});

const Button = styled("div")(({ theme }) => ({
  gridRow: "1 / span 1",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "46px",
  height: "100%",
  userSelect: "none",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:active": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ButtonClose = styled("div")({
  gridRow: "1 / span 1",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "46px",
  height: "100%",
  userSelect: "none",
  "&:hover": {
    backgroundColor: "rgba(232, 17, 35, 0.9)",
  },
  "&:active": {
    backgroundColor: "rgba(232, 17, 35, 0.5)",
  },
});

const IconMin = styled("div")(({ theme }) => ({
  display: "inline-block",
  height: "100%",
  width: "100%",
  maskSize: "23.1%",
  backgroundColor: theme.palette.getContrastText(theme.palette.grey[900]),
  gridColumn: 1,
  mask: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 4.399V5.5H0V4.399h11z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%",
}));

const IconMax = styled("div")(({ theme }) => ({
  display: "inline-block",
  height: "100%",
  width: "100%",
  maskSize: "23.1%",
  backgroundColor: theme.palette.getContrastText(theme.palette.grey[900]),
  gridColumn: 1,
  mask: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 0v11H0V0h11zM9.899 1.101H1.1V9.9h8.8V1.1z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%",
}));

const IconRestore = styled("div")(({ theme }) => ({
  display: "inline-block",
  height: "100%",
  width: "100%",
  maskSize: "23.1%",
  backgroundColor: theme.palette.getContrastText(theme.palette.grey[900]),
  gridColumn: 1,
  mask: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 8.798H8.798V11H0V2.202h2.202V0H11v8.798zm-3.298-5.5h-6.6v6.6h6.6v-6.6zM9.9 1.1H3.298v1.101h5.5v5.5h1.1v-6.6z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%",
}));

const IconClose = styled("div")(({ theme }) => ({
  display: "inline-block",
  height: "100%",
  width: "100%",
  maskSize: "23.1%",
  backgroundColor: theme.palette.getContrastText(theme.palette.grey[900]),
  gridColumn: 1,
  mask: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%",
}));

const TitleBar: React.FC = () => {
  const app = window.require("@electron/remote");
  const win: BrowserWindow = app.getCurrentWindow();
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    win.on("maximize", toggleMaxRestoreButtons);
    win.on("unmaximize", toggleMaxRestoreButtons);

    return () => {
      win.off("maximize", toggleMaxRestoreButtons);
      win.off("unmaximize", toggleMaxRestoreButtons);
    };
  }, [win]);

  const toggleMaxRestoreButtons = useCallback(() => {
    setMaximized(win.isMaximized());
  }, [win]);

  const minimize = useCallback(() => {
    win.minimize();
  }, [win]);

  const maximize = useCallback(() => {
    win.maximize();
  }, [win]);

  const unmaximize = useCallback(() => {
    win.unmaximize();
  }, [win]);

  const close = useCallback(() => {
    win.close();
  }, [win]);

  const handleKeyPress = useCallback(() => {}, []);

  return (
    <TitleBarContainer>
      <DragRegion>
        <Box sx={{ mx: 1, display: "inline-flex", flexWrap: "nowrap" }}>
          <NavigationControls />
          <SearchBar />
        </Box>

        <WindowControls>
          <Button onClick={minimize} role="button" tabIndex={0} onKeyPress={handleKeyPress}>
            <IconMin />
          </Button>

          {!maximized && (
            <Button onClick={maximize} role="button" tabIndex={0} onKeyPress={handleKeyPress}>
              <IconMax />
            </Button>
          )}

          {maximized && (
            <Button onClick={unmaximize} role="button" tabIndex={0} onKeyPress={handleKeyPress}>
              <IconRestore />
            </Button>
          )}

          <ButtonClose onClick={close} role="button" tabIndex={0} onKeyPress={handleKeyPress}>
            <IconClose />
          </ButtonClose>
        </WindowControls>
      </DragRegion>
    </TitleBarContainer>
  );
};

export default TitleBar;
