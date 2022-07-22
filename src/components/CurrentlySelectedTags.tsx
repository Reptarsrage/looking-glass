import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

import useAppSearchParams from "../hooks/useAppSearchParams";

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
      {filters.map(
        (filter) =>
          filter && (
            <Chip key={`${filter}`} label={filter.split("|")[1]} onDelete={handleDelete(filter)} sx={{ mr: 1 }} />
          )
      )}
    </Box>
  );
};

export default CurrentlySelectedTags;
