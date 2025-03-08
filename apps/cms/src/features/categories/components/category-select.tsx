"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@ecomm/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ecomm/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@ecomm/ui/popover";
import { useGetCategories } from "../hooks/use-get-categories";
import { cn } from "@ecomm/ui/lib/utils";

interface CategorySelectProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  currentCategoryId?: string;
}

export function CategorySelect({
  value,
  onChange,
  currentCategoryId,
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const { result } = useGetCategories({});

  const rootCategories = result?.success
    ? result.data.categories.filter(
        (category) => category.id !== currentCategoryId,
      )
    : [];

  const category = rootCategories.find((category) => category.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {category ? `${category?.id} - ${category?.name}` : "Select category"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            aria-label="Search categories"
            placeholder="Search categories..."
          />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {rootCategories.map((category) => (
                <div key={category.id}>
                  <CommandItem
                    onSelect={() => {
                      if (value && category.id === value) {
                        onChange("");
                        return;
                      }

                      onChange(category.id);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === category.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {`${category.name} - ${category.slug}`}
                  </CommandItem>
                </div>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
