import type { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import type { ImageProps as NextImageProps } from "next/image";
import NextImage from "next/image";
import type { Ref } from "react";

interface ImageProps extends Omit<NextImageProps, "src"> {
  src: NextImageProps["src"] | null | undefined;
  ref?: Ref<HTMLImageElement>;
}

const PLACEHOLDER_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect width='1' height='1' fill='#ccc'/%3E%3C/svg%3E";

const GLIMMER_PLACEHOLDER = `data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`;

export const Image = ({ ref, ...props }: ImageProps) => {
  return (
    <div className="relative w-full h-full">
      <NextImage
        {...props}
        src={props.src || PLACEHOLDER_SRC}
        placeholder={GLIMMER_PLACEHOLDER as PlaceholderValue}
        decoding={props.loading === "eager" ? "sync" : "async"}
        ref={ref}
      />
    </div>
  );
};

function shimmer(w: number, h: number) {
  return `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
  <stop stop-color="#DDDDDD" offset="20%" />
  <stop stop-color="#CCCCCC" offset="50%" />
  <stop stop-color="#DDDDDD" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;
}

function toBase64(str: string) {
  return typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);
}
