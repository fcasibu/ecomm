'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@ecomm/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ecomm/ui/form';
import { Input } from '@ecomm/ui/input';
import { categoryCreateSchema } from '@ecomm/validations/cms/categories/category-schema';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { slugify } from '@ecomm/lib/transformers';
import { createCategory } from '@/features/categories/services/mutations';
import { toast } from '@ecomm/ui/hooks/use-toast';
import { Suspense, useTransition } from 'react';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Heading, Text } from '@ecomm/ui/typography';
import { CategorySelect } from '@/components/category-select';
import { ImageUpload } from '@/components/image-upload';
import { CategorySelectSkeleton } from '@/components/category-select-skeleton';
import { useStore } from '@/features/store/providers/store-provider';

export function CategoryCreateForm() {
  'use no memo';

  const store = useStore();
  const form = useForm<z.infer<typeof categoryCreateSchema>>({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      image: '',
      parentId: undefined,
    },
  });

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (data: z.infer<typeof categoryCreateSchema>) => {
    startTransition(async () => {
      const result = await createCategory(store.locale, data);

      if (!result.success) {
        if (result.error.code === 'DUPLICATE_ERROR') {
          toast({
            title: 'Category creation',
            description: (
              <Text>
                Category with the slug <b>{data.slug}</b> already exists.
              </Text>
            ),
          });
        } else {
          toast({
            title: 'Category creation',
            description: 'There was an issue with creating a Category',
          });
        }
        return;
      }

      toast({
        title: 'Category creation',
        description: 'Category was successfully created',
      });

      router.push('/categories');
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <Heading as="h1">Create a new category</Heading>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      form.setValue('slug', slugify(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
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
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload value={field.value} onUpload={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent category</FormLabel>
                <FormControl>
                  <Suspense fallback={<CategorySelectSkeleton />}>
                    <CategorySelect
                      value={field.value}
                      onChange={(categories) => field.onChange(categories)}
                    />
                  </Suspense>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push('/categories')}
            >
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
