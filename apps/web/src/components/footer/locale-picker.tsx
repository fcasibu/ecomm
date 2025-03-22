'use client';

import {
  useChangeLocale,
  useCurrentLocale,
  useScopedI18n,
} from '@/locales/client';
import { useState } from 'react';
import { getFlagOfLocale } from '@ecomm/lib/get-flag-of-locale';
import { getGeneralLanguageNameOfLocale } from '@ecomm/lib/get-general-language-name-of-locale';
import { Button } from '@ecomm/ui/button';
import { cn } from '@ecomm/ui/lib/utils';
import { ChevronsUpDown, Check } from 'lucide-react';
import { Text } from '@ecomm/ui/typography';
import { dynamicImport } from '@/lib/utils/dynamic-import';
import { LazyLoader } from '../lazy-loader';
import { AVAILABLE_LOCALES } from '@ecomm/lib/locale-helper';

const CommandComponents = dynamicImport(
  () => import('@ecomm/ui/command'),
  {
    Command: null,
    CommandEmpty: null,
    CommandGroup: null,
    CommandInput: null,
    CommandItem: null,
    CommandList: null,
  },
  { ssr: false },
);

const PopoverComponents = dynamicImport(
  () => import('@ecomm/ui/popover'),
  {
    Popover: {
      loading: () => <LocalePickerSkeleton />,
    },
    PopoverContent: null,
    PopoverTrigger: null,
  },
  { ssr: false },
);

export function LocalePicker() {
  const [open, setOpen] = useState(false);
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale();
  const t = useScopedI18n('footer.language');

  return (
    <LazyLoader skeleton={<LocalePickerSkeleton />}>
      <PopoverComponents.Popover open={open} onOpenChange={setOpen}>
        <Text size="md" className="mb-2 !font-semibold">
          {t('title')}
        </Text>
        <PopoverComponents.PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            type="button"
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
        </PopoverComponents.PopoverTrigger>
        <PopoverComponents.PopoverContent className="w-full p-0">
          {open && (
            <CommandComponents.Command>
              <CommandComponents.CommandInput
                aria-label="Search locale"
                placeholder="Search locale..."
              />
              <CommandComponents.CommandList>
                <CommandComponents.CommandEmpty>
                  No locales found.
                </CommandComponents.CommandEmpty>
                <CommandComponents.CommandGroup>
                  {AVAILABLE_LOCALES.map((locale) => (
                    <div key={locale}>
                      <CommandComponents.CommandItem
                        onSelect={() => changeLocale(locale)}
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
                      </CommandComponents.CommandItem>
                    </div>
                  ))}
                </CommandComponents.CommandGroup>
              </CommandComponents.CommandList>
            </CommandComponents.Command>
          )}
        </PopoverComponents.PopoverContent>
      </PopoverComponents.Popover>
    </LazyLoader>
  );
}

function LocalePickerSkeleton() {
  const currentLocale = useCurrentLocale();
  const t = useScopedI18n('footer.language');

  return (
    <>
      <Text size="md" className="mb-2 !font-semibold">
        {t('title')}
      </Text>
      <Button
        variant="outline"
        role="combobox"
        className="w-full justify-between"
        type="button"
      >
        <div className="flex items-center gap-2">
          <span>{getFlagOfLocale(currentLocale)}</span>
          <span>
            {getGeneralLanguageNameOfLocale(currentLocale)} - {currentLocale}
          </span>
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </>
  );
}
