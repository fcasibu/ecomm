'use client';

import { Fragment, Suspense, use, useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@ecomm/ui/pagination';
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@ecomm/ui/breadcrumb';
import { Input } from '@ecomm/ui/input';
import { categoryUpdateSchema } from '@ecomm/validations/cms/categories/category-schema';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { slugify } from '@ecomm/ui/lib/utils';
import {
  deleteCategoryById,
  updateCategoryById,
} from '@/features/categories/services/mutations';
import { toast } from '@ecomm/ui/hooks/use-toast';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Text, Heading } from '@ecomm/ui/typography';
import { ImageIcon, Loader, Tag } from 'lucide-react';
import { Card, CardContent } from '@ecomm/ui/card';
import { Badge } from '@ecomm/ui/badge';
import type { CategoryDTO } from '@ecomm/services/categories/category-dto';
import Link from 'next/link';
import { formatPrice } from '@ecomm/lib/format-price';
import type { Result } from '@ecomm/lib/execute-operation';
import { Skeleton } from '@ecomm/ui/skeleton';
import { ImageUpload } from '@/components/image-upload';
import { useStore } from '@/features/store/providers/store-provider';

export function CategoryUpdateForm({
  category,
  categoriesPathResultPromise,
}: {
  category: CategoryDTO;
  categoriesPathResultPromise: Promise<
    Result<{ id: string; name: string; slug: string }[]>
  >;
}) {
  'use no memo';

  const store = useStore();
  const form = useForm<z.infer<typeof categoryUpdateSchema>>({
    resolver: zodResolver(categoryUpdateSchema),
    defaultValues: {
      name: category.name,
      slug: category.slug,
      description: category.description ?? '',
      image: category.image ?? '',
    },
  });

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (data: z.infer<typeof categoryUpdateSchema>) => {
    startTransition(async () => {
      const result = await updateCategoryById(store.locale, category.id, data);

      if (!result.success) {
        switch (result.error.code) {
          case 'DUPLICATE_ERROR': {
            toast({
              title: 'Category update',
              description: (
                <Text>
                  Category with the slug <b>{data.slug}</b> already exists.
                </Text>
              ),
            });
            break;
          }

          default: {
            toast({
              title: 'Category update',
              description: 'There was an issue with updating the Category',
            });
          }
        }

        return;
      }

      toast({
        title: 'Category update',
        description: 'Category was successfully updated',
      });
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCategoryById(store.locale, category.id);

      if (!result.success) {
        if (result.error.code === 'CONSTRAINT_ERROR') {
          toast({
            title: 'Category deletion',
            description: result.error.message,
          });
        }

        return;
      }

      router.push('/categories');
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <Heading as="h1">Update Category</Heading>
      <Suspense fallback={<CategoryPathBreadcrumbSkeleton />}>
        <CategoryPathBreadcrumb
          categoriesPathResultPromise={categoriesPathResultPromise}
        />
      </Suspense>
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

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              type="button"
              disabled={isPending}
              onClick={() => router.push('/categories')}
            >
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

      <SubCategories subCategories={category?.children ?? []} />
      <Products products={category?.products ?? []} />
    </div>
  );
}

function CategoryPathBreadcrumbSkeleton() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {[...Array(3)].map((_, index) => (
          <Fragment key={index}>
            <BreadcrumbItem>
              <Skeleton className="h-4 w-20" />
            </BreadcrumbItem>
            {index < 2 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function CategoryPathBreadcrumb({
  categoriesPathResultPromise,
}: {
  categoriesPathResultPromise: Promise<
    Result<{ id: string; name: string; slug: string }[]>
  >;
}) {
  const result = use(categoriesPathResultPromise);

  if (!result.success || !result.data) return null;

  const path = result.data;

  if (path.length < 2) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {path.map((item, index) => (
          <Fragment key={item.id}>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/categories/${item.id}`}>
                {item.name}
              </BreadcrumbLink>
            </BreadcrumbItem>

            {index < path.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function SubCategories({
  subCategories,
}: {
  subCategories: CategoryDTO['children'];
}) {
  if (!subCategories.length) return null;

  return (
    <div>
      <Heading as="h2">Subcategories</Heading>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subCategories.map((category) => (
          <Link
            key={category.id}
            aria-label={`Go to ${category.name}`}
            href={`/categories/${category.id}`}
          >
            <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-md">
              <div className="relative">
                {category.image ? (
                  <div className="h-32 w-full bg-gray-100">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-32 items-center justify-center bg-slate-100">
                    <ImageIcon className="h-10 w-10 text-slate-400" />
                  </div>
                )}
              </div>

              <CardContent className="flex flex-grow flex-col p-4">
                <div>
                  <div className="mb-2 truncate text-lg font-semibold">
                    {category.name}
                  </div>

                  {category.description && (
                    <Text className="line-clamp-2 text-gray-500">
                      {category.description}
                    </Text>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between pt-4">
                  <Badge variant="outline" className="text-xs">
                    {category.updatedAt}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

const MAX_ITEMS_PER_PAGE = 12;
const TOTAL_PAGE_NUMBERS = 5;

function Products({ products }: { products: CategoryDTO['products'] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const store = useStore();

  if (!products.length) return null;

  const totalPages = Math.ceil(products.length / MAX_ITEMS_PER_PAGE);

  const indexOfLastProduct = currentPage * MAX_ITEMS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - MAX_ITEMS_PER_PAGE;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const getPageNumbers = () => {
    const pageNumbers = [];
    const totalPageNumbers = TOTAL_PAGE_NUMBERS;

    if (totalPages <= totalPageNumbers) {
      for (let i = 1; i <= totalPages; ++i) {
        pageNumbers.push(i);
      }
    } else {
      const leftSiblingIndex = Math.max(currentPage - 2, 2);
      const rightSiblingIndex = Math.min(currentPage + 2, totalPages - 1);

      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

      pageNumbers.push(1);

      if (shouldShowLeftDots) {
        pageNumbers.push(0);
      } else {
        for (let i = 2; i < leftSiblingIndex; ++i) {
          pageNumbers.push(i);
        }
      }

      for (let i = leftSiblingIndex; i <= rightSiblingIndex; ++i) {
        pageNumbers.push(i);
      }

      if (shouldShowRightDots) {
        pageNumbers.push(0);
      } else {
        for (let i = rightSiblingIndex + 1; i <= totalPages - 1; ++i) {
          pageNumbers.push(i);
        }
      }

      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Products ({products.length})</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-normal">
            Page {currentPage} of {totalPages}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentProducts.map((product) => {
          const variant = product.variants[0];

          return (
            <Link
              key={product.id}
              aria-label={`Go to ${product.name}`}
              href={`/products/${product.id}`}
            >
              <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-md">
                <div className="relative">
                  {variant?.images.length ? (
                    <div className="h-40 w-full bg-gray-100">
                      <img
                        src={variant.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-slate-100">
                      <ImageIcon className="h-10 w-10 text-slate-400" />
                    </div>
                  )}

                  <div className="absolute right-2 top-2 flex flex-col gap-1">
                    <Badge className="bg-white text-slate-800">
                      <Tag className="mr-1 h-3 w-3" />
                      {variant?.price &&
                        formatPrice(variant.price.value, store.currency)}
                    </Badge>
                  </div>
                </div>

                <CardContent className="flex flex-grow flex-col p-4">
                  <div>
                    <Text size="sm" className="mb-1 truncate font-semibold">
                      {product.name}
                    </Text>
                    <Text size="xs" className="mb-2 text-slate-500">
                      SKU: {product.sku}
                    </Text>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    <Badge variant="outline" className="text-xs">
                      {product.updatedAt}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={
                  currentPage === 1
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
                aria-disabled={currentPage <= 1}
              />
            </PaginationItem>

            {pageNumbers.map((pageNumber, index) => {
              if (pageNumber === 0) {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={pageNumber}>
                  <Button
                    variant={currentPage === pageNumber ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber)}
                    className="h-8 w-8 p-0"
                  >
                    {pageNumber}
                  </Button>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
                aria-disabled={currentPage >= totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export default Products;
