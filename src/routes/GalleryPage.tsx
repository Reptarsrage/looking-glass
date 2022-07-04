import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TuneIcon from "@mui/icons-material/Tune";
import Stack from "@mui/material/Stack";

import ContentMasonry from "../components/ContentMasonry";
import CurrentlySelectedTags from "../components/CurrentlySelectedTags";
import Modal from "../components/Modal";
import Drawer from "../components/Drawer";
import SortBy from "../components/SortBy";
import { useDrawerStore } from "../store/drawer";

const GalleryPage: React.FC = () => {
  const setDrawerOpen = useDrawerStore((state) => state.setOpen);

  return (
    <>
      <Modal />
      <Drawer />

      <Box sx={{ display: "flex", p: 0.5 }}>
        <CurrentlySelectedTags />

        <Stack direction="row" spacing={2} sx={{ marginLeft: "auto" }}>
          <SortBy />

          <Button onClick={setDrawerOpen} startIcon={<TuneIcon />}>
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
