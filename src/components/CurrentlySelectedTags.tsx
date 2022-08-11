import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

import useAppSearchParams from "../hooks/useAppSearchParams";
import { useContext } from "react";
import { TagContext } from "../store/tag";

const Tag: React.FC<{ id: string; moduleId: string; onDelete: () => void }> = ({ id, moduleId, onDelete }) => {
  const tagContext = useContext(TagContext);
  const tag = tagContext.tags[moduleId].find((tag) => tag.id === id);
  return <Chip label={tag?.name} onDelete={onDelete} sx={{ mr: 1 }} />;
};

export const CurrentlySelectedTags: React.FC = () => {
  const [searchParams, setSearchParams] = useAppSearchParams();
  const { filters, moduleId } = searchParams;

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
        <Tag key={filter} id={filter} onDelete={handleDelete(filter)} moduleId={moduleId} />
      ))}
    </Box>
  );
};

export default CurrentlySelectedTags;
