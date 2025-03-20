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
import { type ProductDTO } from '@ecomm/services/products/product-dto';
import {
  productAttributes,
  productUpdateSchema,
  productUpdateVariantSchema,
  type ProductUpdateInput,
} from '@ecomm/validations/cms/products/product-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { deleteProductById, updateProductById } from '../services/mutations';
import {
  deliveryPromises,
  DeliveryPromisesControl,
} from './product-delivery-promises-control';
import { ProductVariantsControl } from './product-variants-control';

export function ProductUpdateForm({ product }: { product: ProductDTO }) {
  const store = useStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProductUpdateInput>({
    resolver: zodResolver(productUpdateSchema),
    defaultValues: {
      name: product.name,
      description: product.description ?? '',
      categoryId: product.category?.id ?? undefined,
      features: product.features,
      variants: product.variants.map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        images: variant.images,
        price: variant.price.value,
        sizes: variant.sizes.map((size) => ({
          value: size.value,
          stock: size.stock,
        })),
        attributes: Object.keys(productAttributes).map((key) => ({
          title: key,
          value: variant.attributes[key as keyof typeof productAttributes],
        })) as z.infer<typeof productUpdateVariantSchema>['attributes'],
      })),
      deliveryPromises: deliveryPromises.map((item) => {
        const deliveryPromise = product.deliveryPromises.find(
          (deliveryPromise) => deliveryPromise.shippingMethod === item.value,
        );

        if (!deliveryPromise) {
          return {
            id: undefined,
            shippingMethod: item.value,
            price: 0,
            estimatedMinDays: 0,
            estimatedMaxDays: 0,
            requiresShippingFee: false,
            enabled: false,
          };
        }

        return {
          id: deliveryPromise.id,
          shippingMethod: deliveryPromise.shippingMethod,
          price: deliveryPromise.price.value,
          estimatedMinDays: deliveryPromise.estimatedMinDays,
          estimatedMaxDays: deliveryPromise.estimatedMaxDays,
          requiresShippingFee: deliveryPromise.requiresShippingFee,
          enabled: true,
        };
      }),
    },
  });

  const handleSubmit = (data: ProductUpdateInput) => {
    startTransition(async () => {
      const result = await updateProductById(store.locale, product.id, data);

      if (!result.success) {
        toast({
          title: 'Product Update',
          description: 'There was an issue with updating the product.',
        });
        return;
      }

      toast({
        title: 'Product update',
        description: 'Product was successfully updated',
      });
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProductById(store.locale, product.id);

      if (!result.success) {
        toast({
          title: 'Product deletion',
          description: result.error.message,
        });
        return;
      }

      router.push('/products');
    });
  };

  const handleCancel = () => router.push('/products');

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <Heading as="h1">Update product</Heading>
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
                    schema={productUpdateVariantSchema}
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
              variant="destructive"
              type="button"
              className="min-w-[120px]"
              onClick={handleDelete}
            >
              {isPending ? (
                <Loader className="animate-spin" size={16} />
              ) : (
                'Delete'
              )}
            </Button>
            <Button
              disabled={isPending}
              type="submit"
              className="min-w-[120px]"
            >
              {isPending ? (
                <Loader className="animate-spin" size={16} />
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
