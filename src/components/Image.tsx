import clsx from 'clsx';
import React, { forwardRef, useState } from 'react';

interface Source {
  url: string;
  width: number;
  height: number;
}

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  source: Source;
  placeholderImg?: string;
  errorImg?: string;
}

const MAX_RETIRES = 5;

const ImageElt = forwardRef<HTMLImageElement, ImageProps>(function ImageElt(
  { source, alt, placeholderImg, errorImg, loading, onLoad, onError, ...passThroughProps },
  ref
) {
  const [imgSrc, setSrc] = useState<string | undefined>(source.url);
  const [loaded, setLoaded] = useState(false);
  const [tries, setTries] = useState(MAX_RETIRES);

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    if (onLoad) {
      onLoad(event);
    }

    setLoaded(true);
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    if (onError) {
      onError(event);
    }

    if (tries > 0) {
      console.warn(`Retrying image...`);
      setTries(tries - 1);

      const url = new URL(source.url);
      url.searchParams.set('retry', `${tries}`);
      setSrc(url.toString());
      setLoaded(true);
    } else {
      console.error(`Giving up on image`);
      setSrc(errorImg || placeholderImg);
      setLoaded(true);
    }
  };

  return (
    <img
      ref={ref}
      src={imgSrc}
      alt={alt}
      loading={loading}
      onLoad={handleLoad}
      onError={handleError}
      className={clsx(
        'w-auto max-w-none h-full bg-slate-700 drag-none transition-opacity duration-300',
        loaded ? 'opacity-100' : 'opacity-0'
      )}
      {...passThroughProps}
    />
  );
});

ImageElt.defaultProps = {
  placeholderImg: 'https://i.imgur.com/JGWHYXX_d.webp?maxwidth=520&shape=thumb&fidelity=high',
  errorImg: 'https://i.imgur.com/1POVpwD_d.webp?maxwidth=520&shape=thumb&fidelity=high',
};

export default ImageElt;
