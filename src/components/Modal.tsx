import { useCallback, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import MuiModal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import styled from "@mui/system/styled";
import Zoom from "@mui/material/Zoom";
import Fade from "@mui/material/Fade";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

import Video from "./Video";
import Picture from "./Picture";
import Slideshow from "./Slideshow";
import ZoomFromTo from "./ZoomFromTo";
import { useModalStore } from "../store/modal";
import { useGalleryStore, getKey } from "../store/gallery";
import useTheme from "@mui/material/styles/useTheme";
import useAppSearchParams from "../hooks/useAppSearchParams";
import { useDrawerStore } from "../store/drawer";

const CloseButton = styled(Fab)(({ theme }) => ({
  top: 46, // 16 + titleBar height
  right: 16,
  position: "fixed",
  zIndex: (theme.zIndex as any).modal + 1,
}));

const MenuButton = styled(Fab)(({ theme }) => ({
  top: 116,
  right: 16,
  position: "fixed",
  zIndex: (theme.zIndex as any).modal + 1,
}));

const ToggleCaptionButton = styled(Fab)(({ theme }) => ({
  top: 46, // 16 + titleBar height
  left: 16,
  position: "fixed",
  zIndex: (theme.zIndex as any).modal + 2,
}));

const Caption = styled("div")(({ theme }) => ({
  WebkitAppRegion: "no-drag",
  position: "fixed",
  top: 30, // titleBar height
  left: 0,
  right: 0,
  background: `linear-gradient(${theme.palette.background.default}, transparent)`,
  color: theme.palette.text.primary,
  zIndex: (theme.zIndex as any).modal + 1,
  padding: theme.spacing(1),
  paddingLeft: 88,
}));

function capBounds(originalWidth: number, originalHeight: number, maxHeight: number, maxWidth: number): number[] {
  const clampTo = Math.min(maxHeight, maxWidth);
  let clamp_width = Math.min(originalWidth, clampTo);
  let clamp_height = Math.min(originalHeight, clampTo);

  if (originalWidth > originalHeight) {
    clamp_height = (originalHeight / originalWidth) * clamp_width;
  } else {
    clamp_width = (originalWidth / originalHeight) * clamp_height;
  }

  return [clamp_width, clamp_height];
}

const Modal: React.FC = () => {
  const [searchParams, setSearchParams] = useAppSearchParams();
  const theme = useTheme();
  const open = useModalStore((state) => state.modalIsOpen);
  const boundingRect = useModalStore((state) => state.modalBoundingRect);
  const closeModal = useModalStore((state) => state.closeModal);
  const exitModal = useModalStore((state) => state.exitModal);
  const postId = useModalStore((state) => state.modalItem);
  const openDrawerOpen = useDrawerStore((state) => state.setOpen);
  const location = useLocation();
  const galleryKey = getKey(location);
  const post = useGalleryStore(
    useCallback(
      (state) => state.galleriesByLocation[galleryKey]?.items.find((i) => i.id === postId),
      [galleryKey, postId]
    )
  );
  const [entering, setEntering] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [showCaption, setShowCaption] = useState(true);

  function handleEnter() {
    setEntering(true);
  }

  function handleEntered() {
    setEntering(false);
  }

  function handleClose() {
    closeModal();
  }

  function handleExit() {
    setExiting(true);
  }

  function handleExited() {
    exitModal();
    setExiting(false);
  }

  function toggleCaption() {
    setShowCaption((s) => !s);
  }

  function handleAuthorClick() {
    if (post?.author && searchParams.filters.indexOf(post.author.id) < 0) {
      searchParams.filters.push(post.author.id);
    }

    closeModal();
    exitModal();
    setSearchParams(searchParams);
  }

  function handleSourceClick() {
    if (post?.source && searchParams.filters.indexOf(post.source.id) < 0) {
      searchParams.filters.push(post.source.id);
    }

    closeModal();
    exitModal();
    setSearchParams(searchParams);
  }

  function handleMenuClick() {
    openDrawerOpen();
  }

  const totalHeight = window.innerHeight - 30 - 16;
  const [post_width, post_height] = capBounds(post?.width ?? 1, post?.height ?? 1, window.innerWidth, totalHeight);
  const [from, to] = useMemo(() => {
    const from: React.CSSProperties = {
      top: boundingRect?.top ?? 0,
      left: boundingRect?.left ?? 0,
      width: boundingRect?.width ?? 0,
      height: boundingRect?.height ?? 0,
    };

    const to: React.CSSProperties = {
      top: (totalHeight - post_height) / 2 + 30 + 8,
      left: (window.innerWidth - post_width) / 2,
      width: post_width,
      height: post_height,
    };

    return [from, to];
  }, [open]);

  const subCaptions = [
    post?.author && (
      <span key="author">
        by{" "}
        <Link role="button" sx={{ cursor: "pointer" }} onClick={handleAuthorClick}>
          {post.author.name}
        </Link>
      </span>
    ),
    post?.source && (
      <span key="source">
        to{" "}
        <Link role="button" sx={{ cursor: "pointer" }} onClick={handleSourceClick}>
          {post.source.name}
        </Link>
      </span>
    ),
    post?.date && <span key="date">on {new Date(post.date).toLocaleString()}</span>,
  ]
    .filter(Boolean)
    .reduce((prev, curr) => [...prev, " ", curr], [] as React.ReactNode[]);

  if (!post) {
    return null;
  }

  return (
    <>
      <Zoom in={open} unmountOnExit>
        <ToggleCaptionButton onClick={toggleCaption} sx={{ opacity: showCaption ? undefined : "0.5" }}>
          {showCaption ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </ToggleCaptionButton>
      </Zoom>

      {showCaption && post && (
        <Fade in={open} unmountOnExit>
          <Caption>
            <Typography variant="h4" sx={{ minHeight: "1em" }}>
              {post.name || "UNTITLED"}
            </Typography>
            <Typography sx={{ color: "palette.grey[400]" }} variant="subtitle1">
              {subCaptions}
            </Typography>
            {post.description && (
              <Typography sx={{ color: "palette.grey[400]" }} variant="subtitle1">
                {post.description}
              </Typography>
            )}
          </Caption>
        </Fade>
      )}

      <Zoom in={open} unmountOnExit>
        <CloseButton color="default" onClick={handleClose}>
          <CloseIcon />
        </CloseButton>
      </Zoom>

      <Zoom in={open && !entering} unmountOnExit>
        <MenuButton color="default" onClick={handleMenuClick}>
          <MenuIcon />
        </MenuButton>
      </Zoom>

      <MuiModal
        open={open}
        onClose={handleClose}
        disableRestoreFocus
        BackdropComponent={Backdrop}
        sx={{ top: 30 }}
        BackdropProps={{ style: { backgroundColor: theme.palette.background.paper } }}
      >
        <ZoomFromTo
          in={open}
          to={open ? to : from}
          from={from}
          tabIndex={-1}
          position={exiting || entering ? "fixed" : "unset"}
          onExited={handleExited}
          onEnter={handleEnter}
          onEntered={handleEntered}
          onExit={handleExit}
        >
          {exiting || entering ? (
            <Box
              sx={{
                maxWidth: "100%",
                maxHeight: "100%",
                width: post_width,
                height: post_height,
                boxShadow: 1,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              {post.isVideo ? (
                <Video
                  preload="auto"
                  muted
                  loop
                  poster={post.poster}
                  width={post_width}
                  height={post_height}
                  sources={post.urls}
                />
              ) : (
                <Picture sources={post.urls} alt={post.name} loading="eager" width={post_width} height={post_height} />
              )}
            </Box>
          ) : (
            <Slideshow />
          )}
        </ZoomFromTo>
      </MuiModal>
    </>
  );
};

export default Modal;
