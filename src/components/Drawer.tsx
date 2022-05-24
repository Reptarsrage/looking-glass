import MuiDrawer from "@mui/material/Drawer";

import TagList from "./TagList";
import { useDrawerStore } from "../store/drawer";

const Drawer: React.FC = () => {
  const open = useDrawerStore((state) => state.open);
  const setClose = useDrawerStore((state) => state.setClose);

  return (
    <MuiDrawer anchor="right" open={open} onClose={setClose}>
      <TagList overscanCount={3} />
    </MuiDrawer>
  );
};

export default Drawer;
