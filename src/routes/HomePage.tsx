import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import FolderIcon from "@mui/icons-material/Folder";
import Skeleton from "@mui/material/Skeleton";

import { FILE_SYSTEM_MODULE_ID, useModulesStore } from "../store/module";
import ModuleListItem from "../components/ModuleListItem";
import { ReactComponent as SVG } from "../assets/undraw_lighthouse_frb8.svg";
import ThemedSVG from "../components/Status/ThemedSVG";
import AnErrorOccurred from "../components/Status/AnErrorOccurred";

const HomePageOuter: React.FC<React.PropsWithChildren<any>> = ({ children }) => (
  <Box sx={{ overflow: "auto" }}>
    <Container>
      <Box
        sx={{
          width: 250,
          height: 250,
          borderRadius: "50%",
          overflow: "hidden",
          bgcolor: "#FFEE58",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          mr: 2,
          mb: 2,
          mt: 2,
          boxShadow: 3,
        }}
      >
        <ThemedSVG svg={<SVG />} maxHeight={150} />
      </Box>
      <Typography variant="h1" sx={{ display: "inline-block" }}>
        The Looking Glass
      </Typography>
      <List sx={{ bgcolor: "background.paper" }}>{children}</List>
    </Container>
  </Box>
);

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const modules = useModulesStore((state) => state.modules);
  const fetched = useModulesStore((state) => state.fetched);
  const error = useModulesStore((state) => state.error);
  const fetchModules = useModulesStore((state) => state.fetchModules);

  // TODO: Once react router supports preload, move this
  // see: https://github.com/remix-run/react-router/discussions/8009
  // the ultimate goal here would be to utilize suspense for async data fetching
  useEffect(() => {
    fetchModules();
  }, []);

  async function handleLocalClick() {
    const filePath = await window.electronAPI.chooseFolder();
    if (!filePath) {
      return;
    }

    navigate(
      `/gallery/local?${new URLSearchParams([
        ["galleryId", filePath],
        ["sort", "name"],
      ]).toString()}`
    );
  }

  if (error) {
    throw error;
  }

  if (!fetched) {
    return (
      <HomePageOuter>
        {[...Array(10)].map((_, i) => (
          <ListItem key={i}>
            <ListItemAvatar>
              <Skeleton variant="circular" width={40} height={40} />
            </ListItemAvatar>
            <ListItemText primary={<Skeleton width={200} />} secondary={<Skeleton />} />
          </ListItem>
        ))}
      </HomePageOuter>
    );
  }

  return (
    <HomePageOuter>
      {modules
        .filter((module) => module.id !== FILE_SYSTEM_MODULE_ID)
        .map((module) => <ModuleListItem key={module.id} module={module} />)
        .concat(
          <ListItem key={2} button onClick={handleLocalClick}>
            <ListItemAvatar>
              <Avatar>
                <FolderIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Local files" secondary="Choose a directory" />
          </ListItem>
        )}
    </HomePageOuter>
  );
};

export default HomePage;
