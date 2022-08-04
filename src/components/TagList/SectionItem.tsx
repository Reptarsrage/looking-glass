import { memo, useContext } from "react";
import { useParams } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import { TagsContext } from "./context";
import useAppSearchParams from "../../hooks/useAppSearchParams";
import { ModalContext } from "../../store/modal";
import { ModuleContext } from "../../store/module";
import { FullscreenContext } from "../../store/fullscreen";

interface SectionItemProps {
  sectionId: string;
  index: number;
  onClick?: () => void;
}

const SectionItem: React.FC<SectionItemProps> = ({ sectionId, index, onClick }) => {
  const [searchParams, setSearchParams] = useAppSearchParams();
  const modalContext = useContext(ModalContext);
  const fullscreenContext = useContext(FullscreenContext);
  const moduleContext = useContext(ModuleContext);
  const tagSections = useContext(TagsContext);
  const moduleId = useParams().moduleId!;

  const module = moduleContext.modules.find((m) => m.id === moduleId);
  const supportsGalleryFilters = module?.supportsGalleryFilters ?? false;
  const section = tagSections[sectionId];
  const item = section.items[index];
  const closeModal = () => modalContext.dispatch({ type: "CLOSE_MODAL" });
  const exitModal = () => modalContext.dispatch({ type: "EXIT_MODAL" });

  const handleClick = () => {
    if (searchParams.filters.indexOf(item.id) >= 0) {
      return;
    }

    const galleryId = supportsGalleryFilters ? searchParams.galleryId : undefined;
    const query = section.supportsSearch ? searchParams.query : undefined;
    let filters = searchParams.filters;
    if (section.supportsMultiple) {
      filters.push(item.id);
    } else {
      filters = [item.id];
    }

    closeModal();
    exitModal();
    fullscreenContext.setFullscreen(false);

    if (onClick) {
      onClick();
    }

    setSearchParams({ ...searchParams, galleryId, query, filters });
  };

  const itemHeight = 48;
  if (item === undefined) {
    return null;
  }

  return (
    <ListItem
      button
      onClick={handleClick}
      style={{
        position: "absolute",
        top: (index + 1) * itemHeight,
        left: 0,
        width: "100%",
      }}
    >
      <ListItemText primary={item.name} />
    </ListItem>
  );
};

function areEqual(prevProps: SectionItemProps, nextProps: SectionItemProps) {
  return prevProps.sectionId === nextProps.sectionId && prevProps.index === nextProps.index;
}

export default memo(SectionItem, areEqual);
