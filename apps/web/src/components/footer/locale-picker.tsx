'use client';

import { AVAILABLE_LOCALES } from '@/lib/utils/locale-helper';
import {
  useChangeLocale,
  useCurrentLocale,
  useScopedI18n,
} from '@/locales/client';
import { useState } from 'react';
import { getFlagOfLocale } from '@ecomm/lib/get-flag-of-locale';
import { Popover, PopoverContent, PopoverTrigger } from '@ecomm/ui/popover';
import { getGeneralLanguageNameOfLocale } from '@ecomm/lib/get-general-language-name-of-locale';
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
import { ChevronsUpDown, Check } from 'lucide-react';
import { Text } from '@ecomm/ui/typography';

export function LocalePicker() {
  const [open, setOpen] = useState(false);
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale();
  const t = useScopedI18n('footer.language');

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <Text size="md" className="mb-2 !font-semibold">
          {t('title')}
        </Text>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <span>{getFlagOfLocale(currentLocale)}</span>
              <span>
                {getGeneralLanguageNameOfLocale(currentLocale)} -{' '}
                {currentLocale}
              </span>
            </div>
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
              <CommandEmpty>No locales found.</CommandEmpty>
              <CommandGroup>
                {AVAILABLE_LOCALES.map((locale) => (
                  <div key={locale}>
                    <CommandItem
                      onSelect={() => {
                        console.log(locale);
                        changeLocale(locale);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          locale === currentLocale
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      <div className="flex items-center gap-2">
                        <span>{getFlagOfLocale(locale)}</span>
                        <span>
                          {getGeneralLanguageNameOfLocale(locale)} - {locale}
                        </span>
                      </div>
                    </CommandItem>
                  </div>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
