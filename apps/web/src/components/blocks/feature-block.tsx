import type { FeatureBlock as FeatureBlockType } from '@/sanity/queries/content-page/types';
import { ImageComponent } from '@ecomm/ui/image';
import { Heading } from '@ecomm/ui/typography';

export function FeatureBlock({ data }: { data: FeatureBlockType }) {
  const { title, features } = data;

  return (
    <div className="container flex flex-col gap-10">
      <Heading as={title.type} className="text-center !text-3xl">
        {title.value}
      </Heading>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div key={feature.title} className="text-center">
            {feature.icon.url && (
              <ImageComponent
                alt={feature.icon.alt}
                src={feature.icon.url}
                width={32}
                height={32}
                quality={25}
              />
            )}
            <p className="mb-2 font-semibold">{feature.title}</p>
            <p className="text-muted-foreground text-xs">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
