import { useCallback } from "react";
import { useParams } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckIcon from "@mui/icons-material/Check";

import { useModulesStore } from "../../store/module";
import useAppSearchParams from "../../hooks/useAppSearchParams";

interface NestedSortMenuItemProps {
  id: string;
  onClick: () => void;
}

const NestedSortMenuItem: React.FC<NestedSortMenuItemProps> = ({ id, onClick }) => {
  const [searchParams, setSearchParams] = useAppSearchParams();
  const moduleId = useParams().moduleId!;
  const sortValue = useModulesStore(
    useCallback(
      (state) => {
        const module = state.modules.find((m) => m.id === moduleId)!;
        return module.sort.find((sort) => sort.id === id)!;
      },
      [moduleId, id]
    )
  );
  const isSelected = searchParams.sort === sortValue.id;

  const handleClick = () => {
    setSearchParams({ ...searchParams, sort: id });
    onClick();
  };

  return (
    <ListItem button onClick={handleClick}>
      <ListItemText primary={sortValue.name} />
      {isSelected && (
        <ListItemIcon sx={{ justifyContent: "flex-end" }}>
          <CheckIcon color="primary" />
        </ListItemIcon>
      )}
    </ListItem>
  );
};

export default NestedSortMenuItem;
