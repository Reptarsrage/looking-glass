import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import SortIcon from "@mui/icons-material/Sort";

import SortMenuItem from "./SortMenuItem";
import { useModulesStore } from "../../store/module";

const SortBy: React.FC = () => {
  const moduleId = useParams().moduleId!;
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const module = useModulesStore(useCallback((state) => state.modules.find((m) => m.id === moduleId)!, [moduleId]));

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!module || module.sort.length === 0) {
    return null;
  }

  const ariaId = `${moduleId}-sort-menu`;

  return (
    <>
      <Button aria-controls={ariaId} aria-haspopup="true" onClick={handleClick} startIcon={<SortIcon />}>
        Sort By
      </Button>

      <Popover
        id={ariaId}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <List sx={{ minWidth: anchorEl?.clientWidth }}>
          {module.sort
            .filter((s) => !s.parentId)
            .map((s) => (
              <SortMenuItem key={s.id} id={s.id} onClick={handleClose} />
            ))}
        </List>
      </Popover>
    </>
  );
};

export default SortBy;
