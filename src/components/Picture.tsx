import { forwardRef } from "react";
import styled from "@mui/system/styled";

const Img = styled("img")({
  width: "100%",
  height: "100%",
  WebkitUserSelect: "none",
  WebkitUserDrag: "none",
});

interface Source {
  url: string;
  width: number;
  height: number;
}

interface PictureProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  source: Source;
}

const Picture = forwardRef<HTMLImageElement, PictureProps>(({ source, ...passThroughProps }, imageRef) => {
  if (!source) {
    return null;
  }

  return <Img {...passThroughProps} ref={imageRef} src={source.url} />;
});

export default Picture;
