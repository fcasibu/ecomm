'use client';

import type { InputProps } from 'sanity';
import { set } from 'sanity';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@ecomm/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@ecomm/ui/popover';
import { Button } from '@ecomm/ui/button';
import { useGetRootCategories } from '@/features/categories/hooks/use-get-root-categories';
import { useState } from 'react';
import { cn } from '@ecomm/ui/lib/utils';
import { ChevronsUpDown, Check } from 'lucide-react';
import type { CategoryDTO } from '@ecomm/services/categories/category-dto';

export function RootCategorySelect(props: InputProps) {
  const { onChange } = props;

  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDTO | null>(
    null,
  );
  const { data: result } = useGetRootCategories();

  const categories = result?.success ? result.data : [];

  const handleSelect = (category: CategoryDTO) => {
    setSelectedCategory(category);
    onChange(set(category.id));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-black"
        >
          {selectedCategory
            ? `${selectedCategory?.id} - ${selectedCategory?.name}`
            : 'Select category'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-black opacity-50" />
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
              {categories.map((category) => (
                <div key={category.id}>
                  <CommandItem onSelect={() => handleSelect(category)}>
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedCategory?.id === category.id
                          ? 'opacity-100'
                          : 'opacity-0',
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
