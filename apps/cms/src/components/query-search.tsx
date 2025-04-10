'use client';

import { Button } from '@ecomm/ui/button';
import { Loader, X } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { Input } from '@ecomm/ui/input';
import { useRef, useTransition } from 'react';

export function QuerySearch({ label = 'Search' }: { label?: string }) {
  const [query, setQuery] = useQueryState('q', {
    defaultValue: '',
  });

  const [_, setPage] = useQueryState('page', {
    defaultValue: '1',
    shallow: false,
  });

  const hasSearched = useRef(Boolean(query));
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();

        startTransition(async () => {
          await setPage('1');
          hasSearched.current = true;
        });
      }}
    >
      <div className="relative w-full max-w-md">
        <Input
          aria-label={label}
          type="text"
          placeholder={label}
          value={query || ''}
          onChange={(e) => {
            setQuery(e.target.value);

            if (hasSearched.current && !e.target.value.length) {
              startTransition(async () => {
                await setPage('1');
                hasSearched.current = false;
              });
            }
          }}
          className="focus:ring-primary py-2 pr-12 focus:ring-2"
        />

        <Button
          aria-label="Clear search"
          type="button"
          variant="ghost"
          size="sm"
          disabled={!query}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
          onClick={() => {
            if (!hasSearched.current) {
              setQuery('');

              return;
            }

            startTransition(async () => {
              await setQuery('');
              await setPage('1');
              hasSearched.current = false;
            });
          }}
        >
          <X className="text-muted-foreground h-4 w-4" />
        </Button>
      </div>
      <Button
        type="submit"
        disabled={isPending || !query}
        className="min-w-[120px]"
      >
        {isPending ? <Loader className="animate-spin" size={16} /> : 'Search'}
      </Button>
    </form>
  );
}
