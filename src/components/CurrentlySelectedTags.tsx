import { useCallback } from "react";
import { useParams } from "react-router-dom";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

import useAppSearchParams from "../hooks/useAppSearchParams";
import { useTagsStore } from "../store/tag";

export const CurrentlySelectedTags: React.FC = () => {
  const moduleId = useParams().moduleId!;
  const [searchParams, setSearchParams] = useAppSearchParams();
  const filterIds = searchParams.filters;
  const filters = useTagsStore(
    useCallback((state) => filterIds.map((id) => state.tagsByModule[moduleId]?.find((t) => t.id === id)), [filterIds])
  );

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
      {filters.map(
        (filter) =>
          filter && (
            <Chip
              key={`${filter.filterSectionId}/${filter.id}`}
              label={filter.name}
              onDelete={handleDelete(filter.id)}
              sx={{ mr: 1 }}
            />
          )
      )}
    </Box>
  );
};

export default CurrentlySelectedTags;
