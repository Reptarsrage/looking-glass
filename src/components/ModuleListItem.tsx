import { useContext } from "react";
import { Link } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

import { Module, ModuleAuthType } from "../store/module";
import { AuthContext } from "../store/auth";

interface ModuleListItemProps {
  module: Module;
}

const ModuleListItem: React.FC<ModuleListItemProps> = ({ module }) => {
  const authContext = useContext(AuthContext);
  const defaultSort = module.sort.find((s) => s.isDefault);
  const isAuthed = module.id in authContext.auth;

  // Determine url
  let url = `/gallery/${module.id}?sort=${defaultSort?.id}`;
  if (!isAuthed) {
    const params = new URLSearchParams([["returnUrl", url]]);
    if (module.authType === ModuleAuthType.OAuth) {
      url = `/oauth/${module.id}?${params.toString()}`;
    } else if (module.authType === ModuleAuthType.Implicit) {
      url = `/implicit-auth/${module.id}?${params.toString()}`;
    } else if (module.authType === ModuleAuthType.Basic) {
      url = `/basic-auth/${module.id}?${params.toString()}`;
    }
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
