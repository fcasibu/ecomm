"use client";

import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ecomm/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ecomm/ui/form";
import { Loader } from "lucide-react";
import {
  storeCreateSchema,
  type StoreCreateInput,
} from "@ecomm/validations/cms/store/store-schema";
import { useMemo, useTransition } from "react";
import { createStore } from "../services/mutations";
import { toast } from "@ecomm/ui/hooks/use-toast";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ecomm/ui/command";
import { cn } from "@ecomm/ui/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@ecomm/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { getFlagOfLocale } from "@ecomm/lib/get-flag-of-locale";
import { Text } from "@ecomm/ui/typography";

export function StoreCreateForm({
  locales,
}: {
  locales: Record<string, { name: string; currencyCode: string }>;
}) {
  "use no memo";

  const form = useForm<StoreCreateInput>({
    resolver: zodResolver(storeCreateSchema),
    defaultValues: {
      locale: "en-US",
      currency: "USD",
    },
  });

  const [isPending, startTransition] = useTransition();

  async function onSubmit(data: StoreCreateInput) {
    startTransition(async () => {
      const result = await createStore(data);

      if (!result.success) {
        if (result.error.code === "DUPLICATE_ERROR") {
          toast({
            variant: "destructive",
            title: "Store Creation",
            description: (
              <Text>
                Store with the locale <b>{data.locale}</b> already exists.
              </Text>
            ),
          });
        } else {
          toast({
            variant: "destructive",
            title: "Store Creation",
            description: "There was an issue with creating a store.",
          });
        }

        return;
      }

      toast({
        title: "Store Creation",
        description: "STore was successfully created",
      });
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="locale"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Locale</FormLabel>
              <FormControl>
                <LocaleList
                  value={field.value}
                  locales={locales}
                  onSelectLocale={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="min-w-[120px]">
          {isPending ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Create Locale"
          )}
        </Button>
      </form>
    </Form>
  );
}

function LocaleList({
  value,
  locales,
  onSelectLocale,
}: {
  value: string;
  locales: Record<string, { name: string; currencyCode: string }>;
  onSelectLocale: (locale: string) => void;
}) {
  const formContext = useFormContext<StoreCreateInput>();

  const [open, setOpen] = useState(false);
  const sortedLocales = useMemo(
    () =>
      Object.entries(locales).sort(([keyA], [keyB]) => {
        if (keyA === value) return -1;
        if (keyB === value) return 1;

        return 0;
      }),
    [value, locales],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between max-w-[300px] flex"
        >
          {`${getFlagOfLocale(value)} ${value}`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput
            aria-label="Search locale"
            placeholder="Search locale..."
          />
          <CommandList>
            <CommandGroup>
              {sortedLocales.map(([key, locale]) => (
                <div key={key}>
                  <CommandItem
                    onSelect={() => {
                      onSelectLocale(key);
                      formContext.setValue("currency", locale.currencyCode);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        key === value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {`${getFlagOfLocale(key)} ${locale.name} (${key})`}
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
