'use client';

import {
  storeUpdateSchema,
  type StoreUpdateInput,
} from '@ecomm/validations/cms/store/store-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useStore } from '../providers/store-provider';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ecomm/ui/form';
import { useTransition } from 'react';
import { updateStoreById } from '../services/mutations';
import { toast } from '@ecomm/ui/hooks/use-toast';
import { Input } from '@ecomm/ui/input';
import { Button } from '@ecomm/ui/button';
import { Loader } from 'lucide-react';

export function StoreUpdateForm() {
  'use no memo';

  const store = useStore();

  const form = useForm<StoreUpdateInput>({
    resolver: zodResolver(storeUpdateSchema),
    defaultValues: {
      freeShippingThreshold: store.freeShippingThreshold,
    },
  });

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (data: StoreUpdateInput) => {
    startTransition(async () => {
      const result = await updateStoreById(store.id, data);

      if (!result.success) {
        toast({
          title: 'Store Update',
          description: 'There was an issue with updating the store.',
          variant: 'destructive',
        });

        return;
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();

          return form.handleSubmit(handleSubmit)(e);
        }}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="freeShippingThreshold"
          render={({ field }) => (
            <FormItem>
              <div>
                <FormLabel>Global Price Shipping Threshold</FormLabel>
                <FormDescription>
                  The minimum amount of a product&apos;s price to be eligible
                  for free shipping.
                </FormDescription>
              </div>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isPending || !form.formState.isDirty}
          className="min-w-[120px]"
        >
          {isPending ? <Loader className="animate-spin" /> : 'Save'}
        </Button>
      </form>
    </Form>
  );
}
