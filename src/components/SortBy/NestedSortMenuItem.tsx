import { useContext } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckIcon from "@mui/icons-material/Check";

import { ModuleContext } from "../../store/module";
import useAppSearchParams from "../../hooks/useAppSearchParams";

interface NestedSortMenuItemProps {
  id: string;
  onClick: () => void;
}

const NestedSortMenuItem: React.FC<NestedSortMenuItemProps> = ({ id, onClick }) => {
  const [searchParams, setSearchParams] = useAppSearchParams();
  const moduleContext = useContext(ModuleContext);
  const module = moduleContext.modules.find((m) => m.id === searchParams.moduleId);
  const sortValue = module?.sort.find((sort) => sort.id === id);
  const isSelected = searchParams.sort === sortValue?.id;

  const handleClick = () => {
    setSearchParams({ ...searchParams, sort: id });
    onClick();
  };

  if (sortValue === undefined) {
    return null;
  }

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
