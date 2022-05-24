import { memo, useContext } from "react";
import { useParams } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import { TagsContext } from "./context";
import { useDrawerStore } from "../../store/drawer";
import useAppSearchParams from "../../hooks/useAppSearchParams";
import { useModalStore } from "../../store/modal";
import { useModulesStore } from "../../store/module";

interface SectionItemProps {
  sectionId: string;
  index: number;
}

const SectionItem: React.FC<SectionItemProps> = ({ sectionId, index }) => {
  const [searchParams, setSearchParams] = useAppSearchParams();
  const setDrawerClose = useDrawerStore((state) => state.setClose);
  const closeModal = useModalStore((state) => state.closeModal);
  const exitModal = useModalStore((state) => state.exitModal);

  const moduleId = useParams().moduleId!;
  const supportsGalleryFilters = useModulesStore(
    (state) => state.modules.find((m) => m.id === moduleId)?.supportsGalleryFilters
  );

  const tagSections = useContext(TagsContext);
  const section = tagSections[sectionId];
  const item = section.items[index];

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

    setSearchParams({ ...searchParams, galleryId, query, filters });
    setDrawerClose();
    closeModal();
    exitModal();
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
