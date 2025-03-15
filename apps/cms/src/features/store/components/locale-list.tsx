'use client';

import type { StoreDTO } from '@ecomm/services/store/store-dto';
import { Button } from '@ecomm/ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@ecomm/ui/command';
import { cn } from '@ecomm/ui/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@ecomm/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../providers/store-provider';
import { getFlagOfLocale } from '@ecomm/lib/get-flag-of-locale';

export function LocaleList({
  stores,
  selectStoreLocaleAction,
}: {
  stores: StoreDTO[];
  selectStoreLocaleAction: (locale: string) => Promise<void>;
}) {
  const currentStore = useStore();

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full max-w-[250px] justify-between text-black"
        >
          {`${getFlagOfLocale(currentStore.locale)} ${currentStore.locale}`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            aria-label="Search locale"
            placeholder="Search locale..."
          />
          <CommandList>
            <CommandGroup>
              {stores.map((store) => (
                <div key={store.id}>
                  <CommandItem
                    onSelect={() => {
                      if (currentStore.locale === store.locale) return;

                      selectStoreLocaleAction(store.locale);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        store.locale === currentStore.locale
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    {`${getFlagOfLocale(store.locale)} ${store.locale}`}
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
