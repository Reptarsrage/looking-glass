import { memo, useContext, useState } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { TagsContext } from "./context";
import useAppSearchParams from "../../hooks/useAppSearchParams";
import { ModalContext } from "../../store/modal";
import { ModuleContext } from "../../store/module";
import { TagContext } from "../../store/tag";

interface SectionItemProps {
  sectionId: string;
  index: number;
  onClick?: () => void;
}

const SectionItem: React.FC<SectionItemProps> = ({ sectionId, index, onClick }) => {
  const [searchParams, setSearchParams] = useAppSearchParams();
  const modalContext = useContext(ModalContext);
  const moduleContext = useContext(ModuleContext);
  const tagContext = useContext(TagContext);
  const tagSections = useContext(TagsContext);

  const module = moduleContext.modules.find((m) => m.id === searchParams.moduleId);
  const supportsGalleryFilters = module?.supportsGalleryFilters ?? false;
  const section = tagSections[sectionId];
  const item = section.items[index];
  const closeModal = (payload: () => void) => modalContext.dispatch({ type: "CLOSE_MODAL", payload });
  const { modalIsOpen } = modalContext.state;

  //   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  //   const open = Boolean(anchorEl);

  //   function handleClick(event: React.MouseEvent<HTMLElement>) {
  //     setAnchorEl(event.currentTarget);
  //   }

  //   function handleClose() {
  //     setAnchorEl(null);
  //   }

  const handleClick = () => {
    if (searchParams.filters.indexOf(item.id) >= 0) {
      return;
    }

    const galleryId = supportsGalleryFilters ? searchParams.galleryId : undefined;
    const query = section.supportsSearch ? searchParams.query : undefined;
    let filters = [] as string[];
    if (section.supportsMultiple) {
      filters = searchParams.filters.filter((filterId) => {
        const filter = tagContext.tags[searchParams.moduleId].find((tag) => tag.id === filterId);
        const section = module?.filters.find((f) => f.id === filter?.filterSectionId);
        const { supportsMultiple = false } = section ?? {};
        return supportsMultiple;
      });
    }

    filters.push(item.id);

    if (onClick) {
      onClick();
    }

    if (modalIsOpen) {
      closeModal(() => setSearchParams({ ...searchParams, galleryId, query, filters }));
    } else {
      setSearchParams({ ...searchParams, galleryId, query, filters });
    }
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

export default SectionItem;
