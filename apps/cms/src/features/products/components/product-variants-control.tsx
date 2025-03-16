import 'client-only';
import { Form } from '@ecomm/ui/form';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@ecomm/ui/sheet';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@ecomm/ui/form';
import { Input } from '@ecomm/ui/input';
import { Button } from '@ecomm/ui/button';
import { MultiImageUpload } from '@/components/multi-image-upload';
import { ImageComponent } from '@ecomm/ui/image';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { productAttributes } from '@ecomm/validations/cms/products/product-schema';
import type {
  productCreateVariantSchema,
  productUpdateVariantSchema,
  ProductVariantCreateInput,
  ProductVariantUpdateInput,
} from '@ecomm/validations/cms/products/product-schema';
import type { z } from 'zod';

export function ProductVariantsControl({
  value,
  onChange,
  schema,
  ...props
}: {
  value: ProductVariantCreateInput[] | ProductVariantUpdateInput[];
  onChange: (
    value: ProductVariantCreateInput[] | ProductVariantUpdateInput[],
  ) => void;
  schema: typeof productCreateVariantSchema | typeof productUpdateVariantSchema;
}) {
  type Schema = z.infer<typeof schema>;
  const [isOpen, setIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Schema | null>(null);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const resetAndClose = () => {
    form.reset({});
    setIsOpen(false);
    setCurrentItem(null);
  };

  const handleSubmit = (data: Schema) => {
    if (currentItem) {
      onChange(
        value.map((item) =>
          JSON.stringify(item) === JSON.stringify(currentItem) ? data : item,
        ),
      );
    } else {
      onChange([...value, data]);
    }
    resetAndClose();
  };

  const handleRemove = () => {
    if (!currentItem) return;

    onChange(
      value.filter(
        (item) => JSON.stringify(item) !== JSON.stringify(currentItem),
      ),
    );
    resetAndClose();
  };

  const handleVariantClick = (item: Schema) => {
    form.reset(item);
    setCurrentItem(item);
  };

  const handleSheetOpenChange = (open: boolean) => {
    form.reset({});
    setIsOpen(open);

    if (!open) {
      setCurrentItem(null);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
      <div className="flex flex-wrap gap-2">
        {value.length > 0 &&
          value.map((item, index) => (
            <SheetTrigger
              asChild
              key={index}
              onClick={() => handleVariantClick(item)}
            >
              <div className="flex aspect-square h-24 w-24 cursor-pointer items-center justify-center border border-black">
                <ImageComponent
                  src={item.images[0]}
                  className="aspect-square object-cover"
                  alt={`Product variant ${index + 1}`}
                  width={96}
                  height={96}
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </SheetTrigger>
          ))}
        <SheetTrigger asChild>
          <div className="flex aspect-square h-24 w-24 cursor-pointer items-center justify-center border border-black">
            <input className="sr-only" type="button" {...props} />
            <Plus />
          </div>
        </SheetTrigger>
      </div>
      <SheetContent>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              return form.handleSubmit(handleSubmit)(e);
            }}
            className="space-y-4"
          >
            <SheetHeader>
              <SheetTitle>
                {currentItem
                  ? 'Edit product variant'
                  : 'Create a product variant'}
              </SheetTitle>
            </SheetHeader>
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? 0}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? 0}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <MultiImageUpload
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {Object.entries(productAttributes).map(
              ([key, attribute], index) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={`attributes.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{attribute.title}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value?.value ?? ''}
                          onChange={(event) => {
                            field.onChange({
                              title: key,
                              value: event.target.value,
                            });
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ),
            )}
            <SheetFooter className="flex gap-2">
              {currentItem && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleRemove}
                >
                  Remove
                </Button>
              )}
              <Button type="submit">
                {currentItem ? 'Update variant' : 'Save changes'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
