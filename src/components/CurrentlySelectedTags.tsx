import { useContext, useRef, useState } from "react";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import useAppSearchParams from "../hooks/useAppSearchParams";
import { TagContext } from "../store/tag";

const Tag: React.FC<{ id: string; moduleId: string; onDelete: () => void; onFilterToThis: () => void }> = ({
  id,
  moduleId,
  onDelete,
  onFilterToThis,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const tagContext = useContext(TagContext);
  const tag = tagContext.tags[moduleId].find((tag) => tag.id === id);

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <Chip onClick={handleClick} label={tag?.name} onDelete={onDelete} sx={{ mr: 1 }} />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={onFilterToThis}>Filter to just this</MenuItem>
        <MenuItem onClick={onDelete}>Remove</MenuItem>
      </Menu>
    </>
  );
};

export const CurrentlySelectedTags: React.FC = () => {
  const [searchParams, setSearchParams] = useAppSearchParams();
  const { filters, moduleId } = searchParams;

  const handleFilterToThis = (filter: string) => () => {
    setSearchParams({ ...searchParams, filters: [filter] });
  };

  const handleDelete = (filterToDelete: string) => () => {
    const filters = searchParams.filters.filter((id) => id !== filterToDelete);
    setSearchParams({ ...searchParams, filters });
  };

  return (
    <Box
      sx={{
        display: "inline-flex",
        flexWrap: "wrap",
        listStyle: "none",
        p: 0.5,
      }}
    >
      {filters.map((filter) => (
        <Tag
          key={filter}
          id={filter}
          onDelete={handleDelete(filter)}
          onFilterToThis={handleFilterToThis(filter)}
          moduleId={moduleId}
        />
      ))}
    </Box>
  );
};

export default CurrentlySelectedTags;
