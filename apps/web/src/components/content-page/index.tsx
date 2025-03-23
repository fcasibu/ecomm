import type { ComponentType } from 'react';
import type {
  BlockKeys,
  ContentPageDTO,
} from '@/sanity/queries/content-page/types';
import { FullScreenBanner } from '../blocks/full-screen-banner';
import { Spacer } from '../spacer';
import { ContentPageBreadcrumb } from '../content-page-breadcrumb';
import { ThinBanner } from '../blocks/thin-banner';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BLOCKS: Record<BlockKeys, ComponentType<{ data: any }>> = {
  fullScreenBanner: FullScreenBanner,
  thinBanner: ThinBanner,
};

const BLOCKS_WITH_NO_SPACING: BlockKeys[] = ['fullScreenBanner'];

export function ContentPage({ contentPage }: { contentPage: ContentPageDTO }) {
  if (!contentPage.blocks.length) return null;

  return (
    <>
      <ContentPageBreadcrumb data={contentPage.breadcrumb} />
      {contentPage.blocks.map((block) => {
        const Component = BLOCKS[block.type];

        if (!Component) return null;

        const hasSpacing = !BLOCKS_WITH_NO_SPACING.includes(block.type);

        return (
          <Spacer
            size="xl"
            key={block.key}
            top={!hasSpacing}
            bottom={!hasSpacing}
          >
            <Component data={block} />
          </Spacer>
        );
      })}
    </>
  );
}
