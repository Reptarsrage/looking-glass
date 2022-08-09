import { useContext } from "react";
import { Link } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import FolderIcon from "@mui/icons-material/Folder";

import { FILE_SYSTEM_MODULE_ID, Module, ModuleAuthType } from "../store/module";
import { AuthContext } from "../store/auth";

interface ModuleListItemProps {
  module: Module;
  onClick?: () => void;
}

const ModuleListItem: React.FC<ModuleListItemProps> = ({ module, onClick }) => {
  const authContext = useContext(AuthContext);

  // render skeleton placeholder
  if (module.isPlaceholder) {
    return (
      <ListItem>
        <ListItemAvatar>
          <Skeleton variant="circular" width={40} height={40} />
        </ListItemAvatar>
        <ListItemText primary={<Skeleton width={200} />} secondary={<Skeleton />} />
      </ListItem>
    );
  }

  // render file system entry
  if (module.id === FILE_SYSTEM_MODULE_ID) {
    return (
      <ListItem button onClick={onClick}>
        <ListItemAvatar>
          <Avatar>
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Local files" secondary="Choose a directory" />
      </ListItem>
    );
  }

  // for all other items, determine url
  const defaultSort = module.sort.find((s) => s.isDefault);
  const isAuthenticated = module.id in authContext.auth;
  let url = `/gallery/${module.id}?sort=${defaultSort?.id}`;
  if (!isAuthenticated) {
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
