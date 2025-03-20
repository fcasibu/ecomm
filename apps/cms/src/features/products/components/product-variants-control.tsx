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
import { useFieldArray, useForm } from 'react-hook-form';
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
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@ecomm/ui/collapsible';
import { ScrollArea } from '@ecomm/ui/scroll-area';

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

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const {
    fields: sizeFields,
    append: appendSize,
    remove: removeSize,
  } = useFieldArray({
    control: form.control,
    name: 'sizes',
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

            <Collapsible>
              <CollapsibleTrigger className="flex w-full justify-between rounded-md border p-2">
                <span className="font-medium">Sizes</span>
                <Plus className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ScrollArea className="h-60 w-full">
                  <div className="space-y-4 p-2">
                    {sizeFields.map((sizeField, index) => (
                      <div
                        key={sizeField.id}
                        className="flex items-center gap-4"
                      >
                        <FormField
                          control={form.control}
                          name={`sizes.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Size</FormLabel>
                              <FormControl>
                                <Input {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`sizes.${index}.stock`}
                          render={({ field }) => (
                            <FormItem className="w-24">
                              <FormLabel>Stock</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  value={field.value ?? 0}
                                  onChange={(e) =>
                                    field.onChange(e.target.valueAsNumber)
                                  }
                                  placeholder="Stock"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeSize(index)}
                          className="mt-6"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="mt-2 flex justify-end">
                  <Button
                    type="button"
                    onClick={() =>
                      appendSize({
                        value: '',
                        stock: 0,
                      })
                    }
                  >
                    Add Size
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>

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
