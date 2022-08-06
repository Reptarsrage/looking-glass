import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";

import useAppSearchParams from "../hooks/useAppSearchParams";
import { useContext } from "react";
import { TagContext } from "../store/tag";

const Tag: React.FC<{ id: string; onDelete: () => void }> = ({ id, onDelete }) => {
  const tagContext = useContext(TagContext);
  const { moduleId = "" } = useParams();

  if (!(moduleId in tagContext.tags)) {
    return null;
  }

  const tag = tagContext.tags[moduleId].find((tag) => tag.id === id);
  return <Chip label={tag?.name} onDelete={onDelete} sx={{ mr: 1 }} />;
};

export const CurrentlySelectedTags: React.FC = () => {
  const [searchParams, setSearchParams] = useAppSearchParams();
  const { filters } = searchParams;

  const handleDelete = (filterToDelete: string) => () => {
    const filters = searchParams.filters.filter((id) => id !== filterToDelete);
    setSearchParams({ ...searchParams, filters });
  };

  if (filters.length === 0) {
    return null;
  }

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
        <Tag key={filter} id={filter} onDelete={handleDelete(filter)} />
      ))}
    </Box>
  );
};

export default CurrentlySelectedTags;
