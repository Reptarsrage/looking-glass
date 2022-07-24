import { useMemo, useState, useContext } from "react";
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

import Slideshow from "./Slideshow";
import ZoomFromTo from "./ZoomFromTo";
import { useModalStore } from "../store/modal";
import useTheme from "@mui/material/styles/useTheme";
import useAppSearchParams from "../hooks/useAppSearchParams";
import { PostTagsList } from "./TagList";
import { ModalContext } from "./ContentMasonry/context";

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

const Modal: React.FC = () => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useAppSearchParams();
  const open = useModalStore((state) => state.modalIsOpen);
  const boundingRect = useModalStore((state) => state.modalBoundingRect);
  const closeModal = useModalStore((state) => state.closeModal);
  const exitModal = useModalStore((state) => state.exitModal);
  const postId = useModalStore((state) => state.modalItem);
  const items = useContext(ModalContext);
  const post = items.find((post) => post.id === postId);

  const [entered, setEntered] = useState(false);
  const [entering, setEntering] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [showCaption, setShowCaption] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    setExiting(true);
    setEntered(false);
  }

  function onModalExited() {
    exitModal();
    setExiting(false);
  }

  function onCaptionToggled() {
    setShowCaption((s) => !s);
  }

  function onAuthorClicked() {
    const key = `${post?.author?.id}|${post?.author?.name}`;
    if (post?.author && searchParams.filters.indexOf(key) < 0) {
      searchParams.filters.push(key);
    }

    closeModal();
    exitModal();
    setSearchParams(searchParams);
  }

  function onSourceClicked() {
    const key = `${post?.source?.id}|${post?.source?.name}`;
    if (post?.source && searchParams.filters.indexOf(key) < 0) {
      searchParams.filters.push(key);
    }

    closeModal();
    exitModal();
    setSearchParams(searchParams);
  }

  function onMenuClicked() {
    setDrawerOpen(true);
  }

  const [from, to] = useMemo(() => {
    if (!post) {
      return [{}, {}];
    }

    const totalHeight = window.innerHeight - TitleBarHeight - Gutter;
    const { width: post_width, height: post_height } = clampImageDimensions(
      post.width,
      post.height,
      window.innerWidth,
      totalHeight
    );

    const from: React.CSSProperties = {
      top: boundingRect?.top ?? 0,
      left: boundingRect?.left ?? 0,
      width: boundingRect?.width ?? 0,
      height: boundingRect?.height ?? 0,
      paddingLeft: 4,
      paddingRight: 4,
    };

    const to: React.CSSProperties = {
      top: (totalHeight - post_height) / 2 + TitleBarHeight + Gutter / 2,
      left: (window.innerWidth - post_width) / 2,
      width: post_width,
      height: post_height,
      paddingLeft: 4,
      paddingRight: 4,
    };

    return [from, to];
  }, [open]);

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

  if (!post) {
    return null;
  }

  return (
    <>
      {/* Toggle Caption Button */}
      <Zoom in={open} unmountOnExit>
        <ToggleCaptionButton onClick={onCaptionToggled} sx={{ opacity: showCaption ? undefined : "0.5" }}>
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
        <PostTagsList overscanCount={3} postTags={post.filters} />
      </MuiDrawer>

      {/* Modal Content */}
      <MuiModal
        open={open}
        onClose={onModalClose}
        disableRestoreFocus
        BackdropComponent={Backdrop}
        sx={{ top: TitleBarHeight }}
        BackdropProps={{ style: { backgroundColor: theme.palette.background.paper } }}
      >
        <ZoomFromTo
          in={open}
          to={open ? to : from}
          from={from}
          tabIndex={-1}
          position={!entered ? "fixed" : "unset"}
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
