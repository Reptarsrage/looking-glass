import { forwardRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Loading: React.FC<any> = forwardRef((props, ref) => (
  <Box ref={ref} {...props} sx={{ textAlign: "center", padding: 8, ...(props.sx || {}) }}>
    <CircularProgress size="6rem" />
  </Box>
));

export default Loading;
