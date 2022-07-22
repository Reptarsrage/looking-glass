import { useRef, memo, useEffect, useContext } from "react";

import { MasonryItemProps } from "./VirtualizedMasonryColumn";
import { useModalStore } from "../../store/modal";
import { MasonryContext } from "./context";
import useAppSearchParams from "../../hooks/useAppSearchParams";
import Post from "../Post";

const ContentListItem: React.FC<MasonryItemProps<undefined>> = ({ columnIndex, index, isScrolling, style }) => {
  const [searchParams, setSearchParams] = useAppSearchParams();
  const columns = useContext(MasonryContext);
  const column = columns[columnIndex];
  const item = column.items[index];
  const containerRef = useRef<HTMLDivElement>(null);
  const setModalItemBounds = useModalStore((state) => state.setModalItemBounds);
  const setCurrentModalItem = useModalStore((state) => state.setCurrentModalItem);
  const openModal = useModalStore((state) => state.openModal);
  const modalItem = useModalStore((state) => state.modalItem);
  const modalIsOpen = useModalStore((state) => state.modalIsOpen);
  const modalIsExited = useModalStore((state) => state.modalIsExited);
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

  const onMouseEnter: React.MouseEventHandler<HTMLDivElement> = () => {
    setCurrentModalItem(item.id);
  };

  return (
    <div style={{ ...style, outline: "none" }} ref={containerRef} onClick={handleClick} onMouseEnter={onMouseEnter}>
      {!isHidden && (
        <Post
          isVideo={item.isVideo}
          urls={item.urls}
          name={item.name}
          width={item.width}
          height={item.height}
          poster={item.poster}
        />
      )}
    </div>
  );
};

export default ContentListItem;
