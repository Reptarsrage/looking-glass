import { Link } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Zoom from "@mui/material/Zoom";

import { Module, ModuleAuthType } from "../store/module";

interface ModuleListItemProps {
  module: Module;
}

const ModuleListItem: React.FC<ModuleListItemProps> = ({ module }) => {
  // Add default query params
  const defaultSort = module.sort.find((s) => s.isDefault);

  // Determine url
  let url = `/gallery/${module.id}?sort=${defaultSort?.id}`;
  const params = new URLSearchParams([["returnUrl", url]]);
  if (module.authType === ModuleAuthType.OAuth) {
    url = `/oauth/${module.id}?${params.toString()}`;
  } else if (module.authType === ModuleAuthType.Implicit) {
    url = `/implicit-auth/${module.id}?${params.toString()}`;
  } else if (module.authType === ModuleAuthType.Basic) {
    url = `/basic-auth/${module.id}?${params.toString()}`;
  }

  return (
    <ListItem
      button
      component={Link}
      to={url}
      sx={{
        color: "text.main",
        "&:hover": {
          color: "primary.main",
        },
      }}
    >
      <ListItemAvatar>
        <Avatar alt={module.name} src={module.icon} />
      </ListItemAvatar>
      <ListItemText primary={module.name} secondary={module.description} />
    </ListItem>
  );
};

export default ModuleListItem;
