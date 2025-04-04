import type { HeroBanner as HeroBannerType } from '@/sanity/queries/content-page/types';
import type { HeroBanner } from '@/sanity.types';
import { Badge } from '@ecomm/ui/badge';
import { Button } from '@ecomm/ui/button';
import { ImageComponent, type CustomImageProps } from '@ecomm/ui/image';
import { Heading } from '@ecomm/ui/typography';
import { ConditionalLink } from '../link';
import { cn } from '@ecomm/ui/lib/utils';

export function HeroBanner({
  data,
  imageLoadingStrategy = null,
}: {
  data: HeroBannerType;
  imageLoadingStrategy?: Pick<
    CustomImageProps,
    'loading' | 'fetchPriority'
  > | null;
}) {
  const { layout, cta, tag, image, title, description } = data;

  return (
    <div className={cn('flex gap-8', getLayoutClass(layout))}>
      <ImageComponent
        src={image.url}
        alt={image.alt}
        width={900}
        height={1000}
        className="h-[50vh] w-full object-cover lg:h-[80vh] lg:w-1/2"
        {...imageLoadingStrategy}
      />
      <div className="container flex w-full flex-col items-center justify-center lg:w-1/2">
        <div className="max-w-md">
          {tag?.value && (
            <Badge style={{ color: tag.textColor }}>{tag.value}</Badge>
          )}
          <Heading style={{ color: title.textColor }} as={title.type}>
            {title.value}
          </Heading>
          {description?.value && (
            <p
              style={{ color: description.textColor }}
              className="mt-2 text-lg"
            >
              {description.value}
            </p>
          )}
          {cta?.url && (
            <Button
              asChild
              className="mt-6 w-full max-w-max hover:no-underline"
              type="button"
            >
              <ConditionalLink href={cta.url} newTab={cta.newTab}>
                {cta.title}
              </ConditionalLink>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function getLayoutClass(layout: HeroBanner['layout']): string {
  switch (layout) {
    case 'image-left':
      return 'flex-col lg:flex-row';
    case 'image-right':
      return 'flex-col-reverse lg:flex-row-reverse';
    default:
      return 'flex-col lg:flex-row';
  }
}
