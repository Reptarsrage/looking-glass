import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TuneIcon from "@mui/icons-material/Tune";
import Stack from "@mui/material/Stack";
import MuiDrawer from "@mui/material/Drawer";

import ContentMasonry from "../components/ContentMasonry";
import CurrentlySelectedTags from "../components/CurrentlySelectedTags";
import { SectionedTagsList } from "../components/TagList";
import SortBy from "../components/SortBy";

const GalleryPage: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <MuiDrawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <SectionedTagsList overscanCount={3} />
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
    </>
  );
};

export default GalleryPage;
