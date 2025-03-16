'use client';

import { CategorySelect } from '@/components/category-select';
import { CategorySelectSkeleton } from '@/components/category-select-skeleton';
import { useStore } from '@/features/store/providers/store-provider';
import { Button } from '@ecomm/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ecomm/ui/form';
import { toast } from '@ecomm/ui/hooks/use-toast';
import { Input } from '@ecomm/ui/input';
import { MultiInput } from '@ecomm/ui/multi-input';
import { Heading } from '@ecomm/ui/typography';
import {
  productCreateSchema,
  productCreateVariantSchema,
} from '@ecomm/validations/cms/products/product-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { createProduct } from '../services/mutations';
import {
  deliveryPromises,
  DeliveryPromisesControl,
} from './product-delivery-promises-control';
import { ProductVariantsControl } from './product-variants-control';

export function ProductCreateForm() {
  const store = useStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof productCreateSchema>>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      name: '',
      description: '',
      categoryId: undefined,
      features: [],
      variants: [],
      deliveryPromises: deliveryPromises.map((item) => ({
        shippingMethod: item.value,
        price: 0,
        estimatedMinDays: 0,
        estimatedMaxDays: 0,
        requiredShippingFee: false,
        enabled: false,
      })),
    },
  });

  const handleSubmit = (data: z.infer<typeof productCreateSchema>) => {
    startTransition(async () => {
      const result = await createProduct(store.locale, data);

      if (!result.success) {
        toast({
          title: 'Product Creation',
          description: 'There was an issue with creating a product.',
        });
        return;
      }

      toast({
        title: 'Product creation',
        description: 'Product was successfully created',
      });

      router.push('/products');
    });
  };

  const handleCancel = () => router.push('/products');

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <Heading as="h1">Create a new product</Heading>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return form.handleSubmit(handleSubmit)(e);
          }}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Features</FormLabel>
                <FormControl>
                  <MultiInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Suspense fallback={<CategorySelectSkeleton />}>
                    <CategorySelect
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </Suspense>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="variants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variants</FormLabel>
                <FormControl>
                  <ProductVariantsControl
                    value={field.value}
                    onChange={field.onChange}
                    schema={productCreateVariantSchema}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deliveryPromises"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Promise</FormLabel>
                <FormDescription>
                  Set up delivery options for this product (tick the boxes)
                </FormDescription>
                <FormControl>
                  <DeliveryPromisesControl {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              disabled={isPending}
              type="submit"
              className="min-w-[120px]"
            >
              {isPending ? (
                <Loader className="animate-spin" size={16} />
              ) : (
                'Create'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
