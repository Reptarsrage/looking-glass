import { useState, useEffect, memo, useContext, useRef } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Skeleton from "@mui/material/Skeleton";
import Paper from "@mui/material/Paper";

import { MasonryItemProps } from "./VirtualizedMasonryColumn";
import { ModalContext } from "../../store/modal";
import { FullscreenContext } from "../../store/fullscreen";
import useAppSearchParams from "../../hooks/useAppSearchParams";
import PostElt from "../Post";
import type { Post } from "../../store/gallery";

const VirtualizedMasonryItem: React.FC<MasonryItemProps<Post>> = ({ item, style, isScrolling }) => {
  const [searchParams, setSearchParams] = useAppSearchParams();
  const modalContext = useContext(ModalContext);
  const fullscreenContext = useContext(FullscreenContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isGallery, id, name, isPlaceholder, width, height } = item;
  const isModalItem = modalContext.state.modalItem === id;
  const isHidden = isModalItem && !modalContext.state.modalIsExited;
  const isShown = isModalItem && modalContext.state.modalIsOpen;
  const hasName = name.length > 0;

  // effect to update modal item bounds
  useEffect(() => {
    if (isShown && containerRef.current && !isScrolling) {
      const boundingRect = containerRef.current.getBoundingClientRect();
      setModalItemBounds(boundingRect, id);
    }
  }, [id, isShown, isScrolling]);

  if (isPlaceholder) {
    return (
      <Paper style={style} elevation={4} sx={{ borderRadius: 2, height: "100%", overflow: "hidden" }}>
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </Paper>
    );
  }

  function setModalItemBounds(boundingRect: DOMRect, postId: string) {
    modalContext.dispatch({ type: "SET_MODAL_BOUNDS", payload: { boundingRect, postId } });
  }

  function openModal(boundingRect: DOMRect, postId: string) {
    modalContext.dispatch({ type: "OPEN_MODAL", payload: { boundingRect, postId } });
    fullscreenContext.setFullscreen(true);
  }

  function onClick() {
    if (isGallery) {
      setSearchParams({ ...searchParams, galleryId: id });
      return;
    }

    if (containerRef.current) {
      const boundingRect = containerRef.current.getBoundingClientRect();
      openModal(boundingRect, id);
    }
  }

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(null);
  };

  return (
    <>
      <div
        ref={containerRef}
        style={{ ...style, visibility: isHidden ? "hidden" : undefined }}
        onClick={onClick}
        onMouseEnter={hasName ? handleMouseEnter : undefined}
        onMouseLeave={hasName ? handleMouseLeave : undefined}
        aria-describedby={id}
      >
        {isGallery && (
          <Avatar sx={{ bgcolor: "rgba(0,0,0,0.3)", position: "absolute", top: 8, right: 8 }}>
            <FolderIcon />
          </Avatar>
        )}

        <PostElt post={item} />
      </div>

      {hasName && (
        <Popper id={id} open={anchorEl !== null} anchorEl={anchorEl} placement="top">
          <Box sx={{ p: 1, bgcolor: "background.paper" }}>{name}</Box>
        </Popper>
      )}
    </>
  );
};

export default memo(
  VirtualizedMasonryItem,
  (prev, next) =>
    prev.isScrolling === next.isScrolling &&
    prev.item.id === next.item.id &&
    prev.item.isPlaceholder === next.item.isPlaceholder &&
    prev.style.top === next.style.top &&
    prev.style.left === next.style.left &&
    prev.style.right === next.style.right &&
    prev.style.top === next.style.top &&
    prev.style.height === next.style.height
);
