import { cloneElement } from "react";
import useTheme from "@mui/material/styles/useTheme";

interface SVGWithColorProps {
  svg: React.ReactElement<any>;
  maxHeight?: number;
}

const ThemedSVG: React.FC<SVGWithColorProps> = ({ svg, maxHeight }) => {
  const theme = useTheme();
  const clone = cloneElement(svg, {
    style: { fill: theme.palette.primary.main, width: "auto", height: maxHeight },
  });

  return clone;
};

export default ThemedSVG;
