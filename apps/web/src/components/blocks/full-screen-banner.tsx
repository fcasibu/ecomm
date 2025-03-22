import type {
  ContentAlignment,
  ContentPosition,
  FullScreenBanner as FullScreenBannerType,
} from '@/sanity/queries/content-page/types';
import { Button } from '@ecomm/ui/button';
import { ImageComponent } from '@ecomm/ui/image';
import { Heading } from '@ecomm/ui/typography';
import { NextLink } from '../link';
import { cn } from '@ecomm/ui/lib/utils';

export function FullScreenBanner({ data }: { data: FullScreenBannerType }) {
  const { cta, image, title, description, contentPosition, contentAlignment } =
    data;

  return (
    <div className="relative h-screen py-8">
      <div className="absolute inset-0">
        <ImageComponent
          className="object-cover"
          alt={image.alt}
          src={image.url}
          fill
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <div className="container relative h-full w-full">
        <div
          className={cn(
            'absolute flex flex-col gap-6 px-4',
            getAlignmentClass(contentAlignment),
            getPositionClass(contentPosition),
          )}
        >
          <div>
            <Heading style={{ color: title.textColor }} as={title.type}>
              {title.value}
            </Heading>
            <p style={{ color: description.textColor }} className="text-lg">
              {description.value}
            </p>
          </div>
          <Button
            asChild
            className="w-full max-w-max hover:no-underline"
            variant="outline"
          >
            <NextLink href={cta.url} newTab={cta.newTab}>
              {cta.title}
            </NextLink>
          </Button>
        </div>
      </div>
    </div>
  );
}

function getAlignmentClass(contentAlignment: ContentAlignment) {
  switch (contentAlignment) {
    case 'left':
      return 'text-left items-start';
    case 'center':
      return 'text-center items-center';
    case 'right':
      return 'text-right items-end';
    default:
      throw new Error(`Unknwon content alignment: ${contentAlignment}`);
  }
}

function getPositionClass(contentPosition: ContentPosition) {
  switch (contentPosition) {
    case 'top-left':
      return 'top-0 left-0';
    case 'middle-left':
      return 'top-1/2 left-0 -translate-y-1/2';
    case 'bottom-left':
      return 'bottom-0 left-0';
    case 'top-center':
      return 'top-0 left-1/2 -translate-x-1/2';
    case 'center':
      return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    case 'bottom-center':
      return 'bottom-0 left-1/2 -translate-x-1/2';
    case 'top-right':
      return 'top-0 right-0';
    case 'middle-right':
      return 'right-0 top-1/2 -translate-y-1/2';
    case 'bottom-right':
      return 'bottom-0 right-0';
    default:
      throw new Error(`Unknwon content alignment: ${contentPosition}`);
  }
}
