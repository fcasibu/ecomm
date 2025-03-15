import type { ImageProps as NextImageProps, ImageLoader } from 'next/image';
import NextImage from 'next/image';
import type { Ref } from 'react';

interface CustomImageProps extends Omit<NextImageProps, 'src' | 'loader'> {
  src: NextImageProps['src'] | null | undefined;
  ref?: Ref<HTMLImageElement>;
  loader?: ImageLoader;
}

const PLACEHOLDER_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect width='1' height='1' fill='#ccc'/%3E%3C/svg%3E";

const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM3RDdEN0QiLz48L3N2Zz4=';

export function ImageComponent({ src, loader, ...props }: CustomImageProps) {
  const resolvedLoader =
    loader ||
    (typeof src === 'string' && !isResolvableUrl(src)
      ? cloudinaryLoader
      : undefined);

  return (
    <NextImage
      {...props}
      src={src || PLACEHOLDER_SRC}
      loader={resolvedLoader}
      blurDataURL={BLUR_DATA_URL}
      placeholder="blur"
      decoding={props.loading === 'eager' ? 'sync' : 'async'}
    />
  );
}

const cloudinaryLoader: ImageLoader = ({ src, width, quality }) => {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`];
  return `https://res.cloudinary.com/dzvz2v25d/image/upload/${params.join(',')}/${src}`;
};

const isResolvableUrl = (src: string) => /^(https?:|\/)/.test(src);
