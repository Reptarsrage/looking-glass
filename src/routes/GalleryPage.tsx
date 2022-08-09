import { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TuneIcon from "@mui/icons-material/Tune";
import Stack from "@mui/material/Stack";
import MuiDrawer from "@mui/material/Drawer";

import { TagProvider } from "../store/tag";
import { GalleryProvider } from "../store/gallery";
import { ModalProvider } from "../store/modal";
import { FullscreenContext } from "../store/fullscreen";
import ContentMasonry from "../components/ContentMasonry";
import CurrentlySelectedTags from "../components/CurrentlySelectedTags";
import { SectionedTagsList } from "../components/TagList";
import Modal from "../components/Modal";
import SortBy from "../components/SortBy";

const GalleryPage: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const fullscreenContext = useContext(FullscreenContext);

  function onOpen() {
    setDrawerOpen(true);
    fullscreenContext.setFullscreen(true);
  }

  function onClose() {
    setDrawerOpen(false);
    fullscreenContext.setFullscreen(false);
  }

  return (
    <GalleryProvider>
      <TagProvider>
        <ModalProvider>
          <Modal />

          <MuiDrawer anchor="right" open={drawerOpen} onClose={onClose}>
            <SectionedTagsList overscanCount={3} onItemClicked={onClose} />
          </MuiDrawer>

          <Box sx={{ display: "flex", p: 0.5 }}>
            <CurrentlySelectedTags />

            <Stack direction="row" spacing={2} sx={{ marginLeft: "auto" }}>
              <SortBy />

              <Button onClick={onOpen} startIcon={<TuneIcon />}>
                Filter By
              </Button>
            </Stack>
          </Box>

          <Box flex="1" overflow="hidden" display="flex" flexDirection="column">
            <ContentMasonry />
          </Box>
        </ModalProvider>
      </TagProvider>
    </GalleryProvider>
  );
};

export default GalleryPage;
