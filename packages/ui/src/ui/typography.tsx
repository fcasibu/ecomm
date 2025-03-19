import { Slot } from '@radix-ui/react-slot';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

type Headings = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const heading = cva('m-0 font-bold leading-1.5', {
  variants: {
    as: {
      h1: 'text-[2.9rem]',
      h2: 'text-[2.4rem]',
      h3: 'text-[2rem]',
      h4: 'text-[1.7rem]',
      h5: 'text-[1.4rem]',
      h6: 'text-[1.2rem]',
    },
  },
});

export function Heading<T extends Headings>({
  className,
  as: Tag,
  children,
  asChild,
  ...props
}: React.ComponentProps<T> & {
  as: Headings;
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : Tag;
  return (
    <Comp {...props} className={heading({ as: Tag, className })}>
      {children}
    </Comp>
  );
}

const text = cva('m-0 font-normal leading-[1.5] last:m-0', {
  variants: {
    size: {
      xs: 'text-[0.6rem]',
      sm: 'text-[0.8rem]',
      md: 'text-[1rem]',
    },
  },
});

interface TextProps
  extends React.ComponentProps<'p'>,
    VariantProps<typeof text> {
  as?: 'p' | 'span';
  asChild?: boolean;
}

// TODO(fcasibu): remove
export function Text({
  className,
  as: Tag = 'p',
  children,
  size = 'sm',
  asChild,
  ...props
}: TextProps) {
  const Comp = asChild ? Slot : Tag;

  return (
    <Comp {...props} className={text({ size, className })}>
      {children}
    </Comp>
  );
}
