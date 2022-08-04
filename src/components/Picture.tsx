import { useEffect, useRef } from "react";
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

interface PictureProps extends React.HTMLAttributes<HTMLPictureElement> {
  source: Source;
  alt: string;
  width: number;
  height: number;
}

const Picture: React.FC<PictureProps> = ({ source, alt, width, height, ...passThroughProps }) => {
  const imageRef = useRef<HTMLImageElement>(null);

  // Unload image so chrome stops loading it when it does off page
  useEffect(() => {
    const imageElement = imageRef.current;

    if (imageElement != null) {
      if (!imageElement.hasAttribute("src")) {
        imageElement.setAttribute("src", source.url);
      }

      return () => {
        imageElement.removeAttribute("src");
      };
    }
  }, []);

  if (!source) {
    return null;
  }

  return <Img {...passThroughProps} ref={imageRef} src={source.url} alt={alt} width={width} height={height} />;
};

export default Picture;
