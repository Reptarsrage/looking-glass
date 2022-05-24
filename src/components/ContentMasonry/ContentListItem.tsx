import { useRef, memo, useEffect, useContext, useState } from "react";
import ImageListItem from "@mui/material/ImageListItem";
import Paper from "@mui/material/Paper";
import Fade from "@mui/material/Fade";
import CollectionsIcon from "@mui/icons-material/Collections";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import Video from "../Video";
import Picture from "../Picture";
import { MasonryItemProps } from "./VirtualizedMasonryColumn";
import { useModalStore } from "../../store/modal";
import { MasonryContext } from "./context";
import useAppSearchParams from "../../hooks/useAppSearchParams";
import { useSettingsStore } from "../../store/settings";

const ContentListItem: React.FC<MasonryItemProps<undefined>> = ({ columnIndex, index, isScrolling, style }) => {
  const [searchParams, setSearchParams] = useAppSearchParams();
  const columns = useContext(MasonryContext);
  const column = columns[columnIndex];
  const item = column.items[index];
  const containerRef = useRef<HTMLDivElement>(null);
  const setModalItemBounds = useModalStore((state) => state.setModalItemBounds);
  const setCurrentModalItem = useModalStore((state) => state.setCurrentModalItem);
  const pictureLowDataMode = useSettingsStore((state) => state.pictureLowDataMode);
  const videoLowDataMode = useSettingsStore((state) => state.videoLowDataMode);
  const videoAutoPlay = useSettingsStore((state) => state.videoAutoPlay);
  const openModal = useModalStore((state) => state.openModal);
  const modalItem = useModalStore((state) => state.modalItem);
  const modalIsExited = useModalStore((state) => state.modalIsExited);
  const modalIsOpen = useModalStore((state) => state.modalIsOpen);
  const [playing, setPlaying] = useState(videoAutoPlay);
  const isHidden = modalItem === item.id && !modalIsExited;
  const isShown = modalItem === item.id && modalIsOpen;

  useEffect(() => {
    if (isShown && containerRef.current && !isScrolling) {
      const boundingRect = containerRef.current.getBoundingClientRect();
      setModalItemBounds(boundingRect, item.id);
    }
  }, [item.id, isShown, isScrolling]);

  const handleClick = () => {
    if (item.isGallery) {
      setSearchParams({ ...searchParams, galleryId: item.id });
      return;
    }

    if (containerRef.current) {
      const boundingRect = containerRef.current.getBoundingClientRect();
      openModal(boundingRect, item.id);
    }
  };

  const onMouseEnter: React.MouseEventHandler<HTMLVideoElement> = (event) => {
    if (!videoAutoPlay && event.currentTarget.paused) event.currentTarget.play();
    setCurrentModalItem(item.id);
  };

  const onMouseLeave: React.MouseEventHandler<HTMLVideoElement> = (event) => {
    if (!videoAutoPlay && !event.currentTarget.paused) event.currentTarget.pause();
  };

  const onPlay = () => {
    if (!videoAutoPlay) setPlaying(true);
  };

  const onPause = () => {
    if (!videoAutoPlay) setPlaying(false);
  };

  if (item.isVideo) {
    return (
      <ImageListItem style={{ ...style, outline: "none" }} onClick={handleClick}>
        <Paper
          ref={containerRef}
          sx={{
            visibility: isHidden ? "hidden" : undefined,
            boxShadow: 1,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {item.isGallery && <CollectionsIcon sx={{ position: "absolute", top: 8, right: 8 }} />}

          <Fade in={!playing} unmountOnExit>
            <PlayArrowIcon
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "#fff",
                borderRadius: "50%",
                fontSize: 80,
              }}
            />
          </Fade>

          <Video
            preload={videoLowDataMode ? "metadata" : "auto"}
            muted
            loop
            autoPlay={videoAutoPlay}
            poster={item.poster}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onPlay={onPlay}
            onPause={onPause}
            width={item.width}
            height={item.height}
            sources={item.urls}
            style={{ width: "100%", height: "100%" }}
          />
        </Paper>
      </ImageListItem>
    );
  }

  return (
    <ImageListItem style={{ ...style, outline: "none" }} onClick={handleClick} tabIndex={index}>
      <Paper
        ref={containerRef}
        sx={{ visibility: isHidden ? "hidden" : undefined, boxShadow: 1, borderRadius: 2, overflow: "hidden" }}
      >
        {item.isGallery && <CollectionsIcon sx={{ position: "absolute", top: 8, right: 8 }} />}
        <Picture
          sources={item.urls}
          alt={item.name}
          width={item.width}
          height={item.height}
          loading={videoLowDataMode ? "lazy" : "eager"}
          style={{ width: "100%", height: "100%" }}
        />
      </Paper>
    </ImageListItem>
  );
};

function areEqual(prev: MasonryItemProps<undefined>, next: MasonryItemProps<undefined>) {
  return (
    next.columnIndex === prev.columnIndex &&
    next.isScrolling === prev.isScrolling &&
    next.index === prev.index &&
    next.style.top === prev.style.top &&
    next.style.height === prev.style.height
  );
}

export default memo(ContentListItem, areEqual);
