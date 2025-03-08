import { assertValue, cn } from "#lib/utils";
import * as React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { ChevronsUpDown, Plus, X } from "lucide-react";
import { Button } from "./button";
import { Text } from "./typography";

const MultiInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<"input">, "value" | "onChange"> & {
    value: string[];
    onChange: (
      data: string[],
      event: React.ChangeEvent<HTMLInputElement>,
    ) => void;
  }
>(({ className, value, onChange, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [values, setValues] = React.useState<string[]>(
    Array.isArray(value) && value.length ? value : [""],
  );

  const handleChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => {
        const prevCopy = [...prev];
        prevCopy[index] = event.target.value;

        onChange(prevCopy, event);

        return prevCopy;
      });
    };

  const handleAdd = () => {
    setValues((prev) => [...prev, ""]);
  };

  const handleRemove = (index: number) => () => {
    assertValue(index !== 0, "Should not be index 0");
    setValues((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-end space-x-4 px-4 mb-2">
        <Button variant="ghost" size="sm" type="button" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add</span>
        </Button>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
        {values.length - 1 > 0 && <Text size="xs">+{values.length - 1}</Text>}
      </div>
      <div className="mb-2">
        <input
          type="text"
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className,
          )}
          value={values[0]}
          onChange={handleChange(0)}
          ref={ref}
          {...props}
        />
      </div>
      <CollapsibleContent className="flex flex-col gap-2 space-y-2">
        {values.length > 1 &&
          values.slice(1).map((item, index) => (
            <div key={index} className="relative">
              <input
                type="text"
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                  className,
                )}
                value={item}
                ref={ref}
                onChange={handleChange(index + 1)}
                {...props}
              />
              <Button
                className="absolute right-0 top-1/2 -translate-y-1/2"
                type="button"
                variant="link"
                onClick={handleRemove(index + 1)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          ))}
      </CollapsibleContent>
    </Collapsible>
  );
});
MultiInput.displayName = "MultiInput";

export { MultiInput };
