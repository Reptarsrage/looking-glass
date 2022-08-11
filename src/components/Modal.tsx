import React, { useEffect, useMemo, useState, useContext, forwardRef } from "react";
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
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";

import Slideshow from "./Slideshow";
import ZoomFromTo from "./ZoomFromTo";
import { ModalContext } from "../store/modal";
import { GalleryContext } from "../store/gallery";
import { FullscreenContext } from "../store/fullscreen";
import useTheme from "@mui/material/styles/useTheme";
import useAppSearchParams from "../hooks/useAppSearchParams";
import { PostTagsList } from "./TagList";
import useKeyPress from "../hooks/useKeyPress";

const TitleBarHeight = 30;
const Gutter = 16;

const CloseButton = styled(Fab)(({ theme }) => ({
  top: Gutter + TitleBarHeight,
  right: Gutter,
  position: "fixed",
  zIndex: (theme.zIndex as any).modal + 1,
}));

const MenuButton = styled(Fab)(({ theme }) => ({
  top: 100 + Gutter, // below CloseButton
  right: Gutter,
  position: "fixed",
  zIndex: (theme.zIndex as any).modal + 1,
}));

const ToggleCaptionButton = styled(Fab)(({ theme }) => ({
  top: Gutter + TitleBarHeight,
  left: Gutter,
  position: "fixed",
  zIndex: (theme.zIndex as any).modal + 2,
}));

const Caption = styled("div")(({ theme }) => ({
  WebkitAppRegion: "no-drag",
  position: "fixed",
  top: TitleBarHeight,
  left: 0,
  right: 0,
  background: `linear-gradient(${theme.palette.background.default}, transparent)`,
  color: theme.palette.text.primary,
  zIndex: (theme.zIndex as any).modal + 1,
  padding: theme.spacing(1),
  paddingLeft: 72 + Gutter, // tight of ToggleCaptionButton
  paddingRight: 72 + Gutter, // tight of ToggleCaptionButton
}));

/**
 * Resizes image dimensions to fit container, preserving aspect ratio
 * @param {*} width
 * @param {*} height
 * @param {*} maxHeight
 * @param {*} maxWidth
 */
function clampImageDimensions(width: number, height: number, maxHeight: number, maxWidth: number) {
  let clampTo = Math.min(maxHeight, maxWidth);
  let clampWidth = Math.min(width, clampTo);
  let clampHeight = Math.min(height, clampTo);

  if (width > height) {
    clampHeight = (height / width) * clampWidth;
  } else {
    clampWidth = (width / height) * clampHeight;
  }
  return { width: clampWidth, height: clampHeight };
}

interface CustomRootProps {
  onModalClose: () => void;
  entering: boolean;
  children?: React.ReactNode;
}

const CustomRoot = forwardRef<HTMLDivElement, CustomRootProps>(
  ({ onModalClose, entering, children, ...passThroughProps }, ref) => {
    const theme = useTheme();
    const [searchParams, setSearchParams] = useAppSearchParams();

    const galleryContext = useContext(GalleryContext);
    const modalContext = useContext(ModalContext);
    const fullscreenContext = useContext(FullscreenContext);
    const open = modalContext.state.modalIsOpen;
    const postId = modalContext.state.modalItem;
    const closeModal = (payload: () => void) => modalContext.dispatch({ type: "CLOSE_MODAL", payload });
    const post = galleryContext.posts.find((post) => post.id === postId);

    const [showCaption, setShowCaption] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // effect to hide/show full screen elements like nav buttons and search
    useEffect(() => {
      fullscreenContext.setFullscreen(drawerOpen || open);
    }, [drawerOpen, open]);

    function onCaptionToggled() {
      setShowCaption((s) => !s);
    }

    function onItemClicked() {
      setDrawerOpen(false);
    }

    function onAuthorClicked() {
      if (post?.author && searchParams.filters.indexOf(post.author.id) < 0) {
        searchParams.filters.push(post.author.id);
      }

      closeModal(() => setSearchParams(searchParams));
    }

    function onSourceClicked() {
      if (post?.source && searchParams.filters.indexOf(post.source.id) < 0) {
        searchParams.filters.push(post.source.id);
      }

      closeModal(() => setSearchParams(searchParams));
    }

    function onMenuClicked() {
      setDrawerOpen(true);
    }

    const subCaptions = [
      post?.author && (
        <span key="author">
          by{" "}
          <Link role="button" sx={{ cursor: "pointer" }} onClick={onAuthorClicked}>
            {post.author.name}
          </Link>
        </span>
      ),
      post?.source && (
        <span key="source">
          to{" "}
          <Link role="button" sx={{ cursor: "pointer" }} onClick={onSourceClicked}>
            {post.source.name}
          </Link>
        </span>
      ),
      post?.date && <span key="date">on {new Date(post.date).toLocaleString()}</span>,
    ]
      .filter(Boolean)
      .reduce((prev, curr) => [...prev, " ", curr], [] as React.ReactNode[]);

    return (
      <Box ref={ref} {...passThroughProps}>
        {/* Toggle Caption Button */}
        <Zoom in={open} unmountOnExit>
          <ToggleCaptionButton
            onClick={onCaptionToggled}
            sx={{ opacity: showCaption ? undefined : "0.5" }}
            data-testid="showCaption"
          >
            {showCaption ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </ToggleCaptionButton>
        </Zoom>

        {/* Caption */}
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

        {/* Close Button */}
        <Zoom in={open} unmountOnExit>
          <CloseButton color="default" onClick={onModalClose}>
            <CloseIcon />
          </CloseButton>
        </Zoom>

        {/* Menu Button */}
        <Zoom in={open && !entering} unmountOnExit>
          <MenuButton color="default" onClick={onMenuClicked}>
            <MenuIcon />
          </MenuButton>
        </Zoom>

        {/* Drawer */}
        <MuiDrawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <PostTagsList overscanCount={3} postTags={post?.filters ?? []} onItemClicked={onItemClicked} />
        </MuiDrawer>

        {children}
      </Box>
    );
  }
);

const Modal: React.FC = () => {
  const theme = useTheme();

  const galleryContext = useContext(GalleryContext);
  const modalContext = useContext(ModalContext);
  const open = modalContext.state.modalIsOpen;
  const boundingRect = modalContext.state.modalBoundingRect;
  const postId = modalContext.state.modalItem;
  const modalCloseCallback = modalContext.state.modalCloseCallback;
  const closeModal = () => modalContext.dispatch({ type: "CLOSE_MODAL" });
  const exitModal = () => modalContext.dispatch({ type: "EXIT_MODAL" });
  const post = galleryContext.posts.find((post) => post.id === postId);

  const [entered, setEntered] = useState(false);
  const [entering, setEntering] = useState(false);

  useKeyPress("Escape", onModalClose);

  function onModalEntering() {
    setEntering(true);
  }

  function onModalEntered() {
    setEntering(false);
    setEntered(true);
  }

  function onModalClose() {
    closeModal();
  }

  function onModalExiting() {
    setEntered(false);
  }

  function onModalExited() {
    exitModal();
    if (modalCloseCallback !== null) {
      modalCloseCallback();
    }
  }

  const [from, to] = useMemo(() => {
    if (!post) {
      return [{}, {}];
    }

    const totalHeight = window.innerHeight - TitleBarHeight - 2 * Gutter;
    const totalWidth = window.innerWidth - 2 * Gutter;
    const { width: post_width, height: post_height } = clampImageDimensions(
      post.width,
      post.height,
      totalWidth,
      totalHeight
    );

    const from: React.CSSProperties = {
      top: boundingRect?.top ?? 0,
      left: boundingRect?.left ?? 0,
      width: boundingRect?.width ?? 0,
      height: boundingRect?.height ?? 0,
      overflow: "visible",
    };

    const to: React.CSSProperties = {
      top: (totalHeight - post_height) / 2 + TitleBarHeight + 2 * Gutter,
      left: (totalWidth - post_width) / 2 + Gutter,
      width: post_width,
      height: post_height,
      overflow: "visible",
    };

    return [from, to];
  }, [open, boundingRect]);

  return (
    <>
      {/* Modal Content */}
      <MuiModal
        open={open}
        onClose={onModalClose}
        disableRestoreFocus
        components={{
          Backdrop,
          Root: CustomRoot,
        }}
        componentsProps={{
          backdrop: { style: { backgroundColor: theme.palette.background.paper, zIndex: 1 } },
          root: { entering, onModalClose } as any,
        }}
        sx={{ top: TitleBarHeight }}
      >
        <ZoomFromTo
          in={open}
          to={open ? to : from}
          from={from}
          tabIndex={-1}
          position={!entered ? "fixed" : undefined}
          onExited={onModalExited}
          onEnter={onModalEntering}
          onEntered={onModalEntered}
          onExit={onModalExiting}
        >
          <Slideshow modalIsTransitioning={!entered} />
        </ZoomFromTo>
      </MuiModal>
    </>
  );
};

export default Modal;
