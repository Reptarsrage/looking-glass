import { useState, useContext } from "react";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckIcon from "@mui/icons-material/Check";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import NestedSortMenuItem from "./NestedSortMenuItem";
import { ModuleContext } from "../../store/module";
import useAppSearchParams from "../../hooks/useAppSearchParams";

interface SortMenuItemProps {
  id: string;
  onClick: () => void;
}

const SortMenuItem: React.FC<SortMenuItemProps> = ({ id, onClick }) => {
  const [searchParams, setSearchParams] = useAppSearchParams();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const moduleContext = useContext(ModuleContext);
  const module = moduleContext.modules.find((m) => m.id === searchParams.moduleId);
  const sortValue = module?.sort.find((sort) => sort.id === id);
  const nestedValues = module?.sort.filter((sort) => sort.parentId === id) ?? [];

  const handleClick: React.MouseEventHandler<HTMLElement> = (event) => {
    if (nestedValues.length > 0) {
      setAnchorEl(event.currentTarget);
    } else {
      setSearchParams({ ...searchParams, sort: id });
      onClick();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    onClick();
  };

  if (!sortValue) {
    return null;
  }

  const isSelected = searchParams.sort === sortValue.id;
  const hasNested = nestedValues.length > 0;
  const ariaId = `${sortValue.id}-nested-sort-menu`;

  return (
    <ListItem button onClick={handleClick}>
      <ListItemText primary={sortValue.name} />
      {isSelected && (
        <ListItemIcon sx={{ justifyContent: "flex-end" }}>
          <CheckIcon color="primary" />
        </ListItemIcon>
      )}

      {hasNested && (
        <ListItemIcon sx={{ justifyContent: "flex-end", marginLeft: isSelected ? "-20px" : undefined }}>
          <ChevronRightIcon />
        </ListItemIcon>
      )}

      {hasNested && (
        <Popover
          id={ariaId}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <List sx={{ minWidth: anchorEl?.clientWidth }}>
            {nestedValues.map((nestedValue) => (
              <NestedSortMenuItem key={nestedValue.id} onClick={handleClose} id={nestedValue.id} />
            ))}
          </List>
        </Popover>
      )}
    </ListItem>
  );
};

export default SortMenuItem;
