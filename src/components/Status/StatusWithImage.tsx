import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import ThemedSVG from "./ThemedSVG";

interface StatusWithImageProps {
  message: React.ReactNode;
  children: React.ReactElement<any>;
  height?: number;
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "caption"
    | "button"
    | "overline"
    | "inherit"
    | undefined;
}

const StatusWithImage: React.FC<StatusWithImageProps> = ({ message, height, variant, children }) => (
  <Box sx={{ mt: "10%" }}>
    <Box sx={{ mb: 4, textAlign: "center" }}>
      <ThemedSVG svg={children} maxHeight={height} />
    </Box>
    <Typography align="center" variant={variant}>
      {message}
    </Typography>
  </Box>
);

StatusWithImage.defaultProps = {
  height: 500,
  variant: "h2",
};

export default StatusWithImage;
