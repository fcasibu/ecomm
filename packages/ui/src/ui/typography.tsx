import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { cn } from "#lib/utils";

export const TypographyH1 = forwardRef<
  HTMLHeadingElement,
  Readonly<React.ComponentProps<"h1">>
>(({ className, ...props }, ref) => {
  return (
    <h1
      {...props}
      ref={ref}
      className={cn(
        "mb-2 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl",
        className,
      )}
    />
  );
});

TypographyH1.displayName = "TypographyH1";

export const TypographyH2 = forwardRef<
  HTMLHeadingElement,
  Readonly<React.ComponentProps<"h2">>
>(({ className, ...props }, ref) => {
  return (
    <h2
      {...props}
      ref={ref}
      className={cn(
        "mb-2 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl",
        className,
      )}
    />
  );
});

TypographyH2.displayName = "TypographyH2";

export const TypographyH3 = forwardRef<
  HTMLHeadingElement,
  Readonly<React.ComponentProps<"h3">>
>(({ className, ...props }, ref) => {
  return (
    <h3
      {...props}
      ref={ref}
      className={cn(
        "mb-2 text-xl font-bold leading-tight md:text-2xl lg:text-3xl",
        className,
      )}
    />
  );
});

TypographyH3.displayName = "TypographyH3";

export const TypographyH4 = forwardRef<
  HTMLHeadingElement,
  Readonly<React.ComponentProps<"h4">>
>(({ className, ...props }, ref) => {
  return (
    <h4
      {...props}
      ref={ref}
      className={cn(
        "mb-2 text-lg font-bold leading-tight md:text-xl lg:text-2xl",
        className,
      )}
    />
  );
});

TypographyH4.displayName = "TypographyH4";

export const TypographyH5 = forwardRef<
  HTMLHeadingElement,
  Readonly<React.ComponentProps<"h5">>
>(({ className, ...props }, ref) => {
  return (
    <h5
      {...props}
      ref={ref}
      className={cn(
        "mb-2 text-base font-bold leading-tight md:text-lg lg:text-xl",
        className,
      )}
    />
  );
});

TypographyH5.displayName = "TypographyH5";

export const TypographyH6 = forwardRef<
  HTMLHeadingElement,
  Readonly<React.ComponentProps<"h6">>
>(({ className, ...props }, ref) => {
  return (
    <h6
      {...props}
      ref={ref}
      className={cn(
        "mb-2 text-sm font-bold leading-tight md:text-base lg:text-lg",
        className,
      )}
    />
  );
});

TypographyH6.displayName = "TypographyH6";

const text = cva("mb-2 text-base font-normal leading-relaxed last:m-0", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      lg: "text-lg",
      xl: "text-xl",
    },
  },
});

interface TextProps
  extends React.ComponentProps<"p">,
    VariantProps<typeof text> {
  as?: "p" | "span" | "label";
  asChild?: boolean;
}

export const Text = forwardRef<React.ElementRef<"p">, Readonly<TextProps>>(
  ({ className, as: Tag = "p", children, size, ...props }, ref) => {
    return (
      <Slot {...props} ref={ref} className={text({ size, className })}>
        <Tag>{children}</Tag>
      </Slot>
    );
  },
);

Text.displayName = "Text";
