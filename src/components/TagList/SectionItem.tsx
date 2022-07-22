import { memo, useContext } from "react";
import { useParams } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import { TagsContext } from "./context";
import useAppSearchParams from "../../hooks/useAppSearchParams";
import { useModalStore } from "../../store/modal";
import { useModulesStore } from "../../store/module";

interface SectionItemProps {
  sectionId: string;
  index: number;
}

const SectionItem: React.FC<SectionItemProps> = ({ sectionId, index }) => {
  const [searchParams, setSearchParams] = useAppSearchParams();
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
    const key = `${item.id}|${item.name}`;
    if (searchParams.filters.indexOf(key) >= 0) {
      return;
    }

    const galleryId = supportsGalleryFilters ? searchParams.galleryId : undefined;
    const query = section.supportsSearch ? searchParams.query : undefined;
    let filters = searchParams.filters;
    if (section.supportsMultiple) {
      filters.push(key);
    } else {
      filters = [key];
    }

    setSearchParams({ ...searchParams, galleryId, query, filters });
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
