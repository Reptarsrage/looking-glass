import { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TuneIcon from "@mui/icons-material/Tune";
import Stack from "@mui/material/Stack";
import MuiDrawer from "@mui/material/Drawer";

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

  // effect to hide/show full screen elements like nav buttons and search
  useEffect(() => {
    fullscreenContext.setFullscreen(drawerOpen);
  }, [drawerOpen]);

  function onItemClicked() {
    setDrawerOpen(false);
  }

  return (
    <ModalProvider>
      <Modal />

      <MuiDrawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <SectionedTagsList overscanCount={3} onItemClicked={onItemClicked} />
      </MuiDrawer>

      <Box sx={{ display: "flex", p: 0.5 }}>
        <CurrentlySelectedTags />

        <Stack direction="row" spacing={2} sx={{ marginLeft: "auto" }}>
          <SortBy />

          <Button onClick={() => setDrawerOpen(true)} startIcon={<TuneIcon />}>
            Filter By
          </Button>
        </Stack>
      </Box>

      <Box flex="1" overflow="hidden" display="flex" flexDirection="column">
        <ContentMasonry />
      </Box>
    </ModalProvider>
  );
};

export default GalleryPage;
