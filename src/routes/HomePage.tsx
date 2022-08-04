import { useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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

import { FILE_SYSTEM_MODULE_ID, fileSystemModule, ModuleContext } from "../store/module";
import ModuleListItem from "../components/ModuleListItem";
import { ReactComponent as SVG } from "../assets/undraw_lighthouse_frb8.svg";
import ThemedSVG from "../components/Status/ThemedSVG";
import AnErrorOccurred from "../components/Status/AnErrorOccurred";
import * as lookingGlassService from "../services/lookingGlassService";

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
  const { setModules } = useContext(ModuleContext);
  const { data, status } = useQuery({
    onSuccess: (data) => setModules(data),
    queryKey: ["modules"],
    queryFn: async () => {
      let modules = await lookingGlassService.fetchModules();
      modules.sort((a, b) => a.name.localeCompare(b.name)); // sort alphabetically
      modules = modules.concat(fileSystemModule); // concat file system module
      return modules;
    },
  });

  // effect to set window title
  useEffect(() => {
    window.electronAPI.setTitle();
  }, []);

  async function handleLocalClick() {
    const filePath = await window.electronAPI.chooseFolder();
    if (!filePath) {
      return;
    }

    const params = new URLSearchParams([
      ["galleryId", filePath],
      ["sort", "name"],
    ]);

    navigate(`/gallery/local?${params.toString()}`);
  }

  if (status === "loading") {
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

  if (status === "error" || data === undefined) {
    return <AnErrorOccurred />;
  }

  return (
    <HomePageOuter>
      {data
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
