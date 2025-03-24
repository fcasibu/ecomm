'use client';

import { useGetNonRootCategories } from '@/features/categories/hooks/use-get-non-root-categories';
import { useGetRootCategories } from '@/features/categories/hooks/use-get-root-categories';
import type { CategoryDTO } from '@ecomm/services/categories/category-dto';
import { Button } from '@ecomm/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@ecomm/ui/command';
import { cn } from '@ecomm/ui/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@ecomm/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import type { ObjectInputProps } from 'sanity';
import { set, unset } from 'sanity';

function CategorySelectUI({
  open,
  setOpen,
  selectedCategory,
  categories,
  handleSelect,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedCategory: Pick<CategoryDTO, 'name' | 'id'> | null;
  categories: CategoryDTO[];
  handleSelect: (category: Pick<CategoryDTO, 'name' | 'id'>) => void;
}) {
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
                  <CommandItem
                    onSelect={() =>
                      handleSelect({ id: category.id, name: category.name })
                    }
                  >
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

export function RootCategorySelect(props: ObjectInputProps) {
  const { onChange, value } = props;

  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Pick<
    CategoryDTO,
    'name' | 'id'
  > | null>(value as Pick<CategoryDTO, 'name' | 'id'>);
  const { result } = useGetRootCategories();

  const categories = result?.success ? result.data : [];

  const handleSelect = (category: Pick<CategoryDTO, 'name' | 'id'>) => {
    const hasBeenSelected = selectedCategory?.id === category.id;

    setSelectedCategory(hasBeenSelected ? null : category);

    const patches = hasBeenSelected
      ? [unset(['id']), unset(['name'])]
      : [set(category.id, ['id']), set(category.name, ['name'])];

    onChange(patches);
    setOpen(false);
  };

  return (
    <CategorySelectUI
      open={open}
      setOpen={setOpen}
      selectedCategory={selectedCategory}
      categories={categories}
      handleSelect={handleSelect}
    />
  );
}

export function NonRootCategorySelect(props: ObjectInputProps) {
  const { onChange, value } = props;

  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Pick<
    CategoryDTO,
    'name' | 'id'
  > | null>(value as Pick<CategoryDTO, 'name' | 'id'>);
  const { result } = useGetNonRootCategories();

  const categories = result?.success ? result.data : [];

  const handleSelect = (category: Pick<CategoryDTO, 'name' | 'id'>) => {
    const hasBeenSelected = selectedCategory?.id === category.id;

    setSelectedCategory(hasBeenSelected ? null : category);

    const patches = hasBeenSelected
      ? [unset(['id']), unset(['name'])]
      : [set(category.id, ['id']), set(category.name, ['name'])];

    onChange(patches);
    setOpen(false);
  };

  return (
    <CategorySelectUI
      open={open}
      setOpen={setOpen}
      selectedCategory={selectedCategory}
      categories={categories}
      handleSelect={handleSelect}
    />
  );
}
