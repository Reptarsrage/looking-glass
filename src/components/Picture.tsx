import { useMemo, useState } from "react";
import styled from "@mui/system/styled";

const Pic = styled("picture")({
  width: "100%",
  height: "100%",
});

const Img = styled("img")(({ theme }) => ({
  objectFit: "contain",
  width: "100%",
  height: "100%",
  WebkitUserSelect: "none",
  WebkitUserDrag: "none",
}));

interface Source {
  url: string;
  width: number;
  height: number;
}

interface PictureProps extends React.HTMLAttributes<HTMLPictureElement> {
  sources: Source[];
  alt: string;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
}

const Picture: React.FC<PictureProps> = ({ sources, alt, loading, width, height, ...passThroughProps }) => {
  const sorted = useMemo(() => [...sources].sort((a, b) => a.width - b.width), [sources]);
  if (sources.length === 0) {
    return null;
  }

  return (
    <Pic {...passThroughProps}>
      {sorted.slice(1).map((source, idx) => (
        <source key={idx} srcSet={source.url} media={`(min-width: ${source.width}px)`} />
      ))}

      <Img src={`${sorted[0].url}`} alt={alt} loading={loading} width={width} height={height} />
    </Pic>
  );
};

Picture.defaultProps = {
  loading: "lazy",
};

export default Picture;
