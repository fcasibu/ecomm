import { cva, type VariantProps } from 'class-variance-authority';

const spacerVariants = cva('', {
  variants: {
    size: {
      sm: 'my-2',
      md: 'my-4',
      lg: 'my-8',
      xl: 'my-12',
      '2xl': 'my-16',
    },
    top: {
      true: 'mt-0',
      false: '',
    },
    bottom: {
      true: 'mb-0',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    top: true,
    bottom: true,
  },
});

export interface SpacerProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof spacerVariants> {}

export const Spacer = ({
  size = 'md',
  top = true,
  bottom = true,
  className,
  ...props
}: SpacerProps) => (
  <div
    {...props}
    className={spacerVariants({ size, top, bottom, className })}
  />
);
