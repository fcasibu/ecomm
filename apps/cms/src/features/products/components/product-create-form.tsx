'use client';

import { CategorySelect } from '@/components/category-select';
import { Button } from '@ecomm/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  FormDescription,
} from '@ecomm/ui/form';
import { Input } from '@ecomm/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@ecomm/ui/toggle-group';
import { MultiInput } from '@ecomm/ui/multi-input';
import {
  productAttributes,
  productCreateSchema,
  productCreateVariantSchema,
  type ProductCreateInput,
  type ProductDeliveryPromiseCreateInput,
  type ProductVariantCreateInput,
} from '@ecomm/validations/cms/products/product-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BoxSelectIcon,
  CheckSquare2,
  Clock,
  Loader,
  Plus,
  Truck,
  Zap,
} from 'lucide-react';
import { useForm, useFormContext } from 'react-hook-form';
import type { z } from 'zod';
import { Suspense, useState, useTransition } from 'react';
import { createProduct } from '../services/mutations';
import { toast } from '@ecomm/ui/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Heading, Text } from '@ecomm/ui/typography';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@ecomm/ui/sheet';
import { ImageComponent } from '@ecomm/ui/image';
import { CategorySelectSkeleton } from '@/components/category-select-skeleton';
import { MultiImageUpload } from '@/components/multi-image-upload';
import { useStore } from '@/features/store/providers/store-provider';
import { Card } from '@ecomm/ui/card';
import { cn } from '@ecomm/ui/lib/utils';
import { Switch } from '@ecomm/ui/switch';

const deliveryPromises = [
  {
    title: 'Standard Delivery',
    value: 'STANDARD',
    icon: Truck,
  },
  {
    title: 'Express Delivery',
    value: 'EXPRESS',
    icon: Zap,
  },
  {
    title: 'Next Day Delivery',
    value: 'NEXT_DAY',
    icon: Clock,
  },
] as const satisfies {
  title: string;
  value: ProductDeliveryPromiseCreateInput['shippingMethod'];
  icon: React.ElementType;
}[];

export function ProductCreateForm() {
  'use no memo';

  const store = useStore();
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

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
                  <Input
                    type="text"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
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
                      onChange={(categories) => field.onChange(categories)}
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
                  Set up delivery options for this product
                </FormDescription>
                <FormControl>
                  <DeliveryPromisesControl {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push('/products')}
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

interface DeliveryPromisesControlProps {
  value: ProductDeliveryPromiseCreateInput[];
  onChange: (value: ProductDeliveryPromiseCreateInput[]) => void;
}

function DeliveryPromisesControl({
  value,
  onChange,
  ...props
}: DeliveryPromisesControlProps) {
  const [selectedShippingMethods, setSelectedShippingMethods] = useState<
    string[]
  >([]);
  const formContext = useFormContext<ProductCreateInput>();

  const isDisabled = (shippingMethod: string) => {
    return (
      !selectedShippingMethods.length ||
      !selectedShippingMethods.includes(shippingMethod)
    );
  };

  const updatedDeliveryPromises = formContext.watch('deliveryPromises');

  return (
    <ToggleGroup
      {...props}
      aria-label="Delivery Promise Selection"
      value={selectedShippingMethods}
      onValueChange={(
        data: ProductDeliveryPromiseCreateInput['shippingMethod'][],
      ) => {
        setSelectedShippingMethods(data);
        onChange(
          updatedDeliveryPromises.map((item) => ({
            ...item,
            enabled: data.includes(item.shippingMethod),
          })),
        );
      }}
      type="multiple"
      className="items-stretch gap-3"
    >
      {deliveryPromises.map(({ value, title, icon: Icon }, index) => (
        <Card
          key={value}
          className={cn('flex-1 space-y-2 p-4', {
            'bg-gray-100/50': isDisabled(value),
          })}
        >
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5" />
              <Text as="span" size="sm">
                {title}
              </Text>
            </div>
            <ToggleGroupItem value={value} className="p-0">
              {!selectedShippingMethods.includes(value) ? (
                <BoxSelectIcon />
              ) : (
                <CheckSquare2 />
              )}
            </ToggleGroupItem>
          </div>
          <FormField
            control={formContext.control}
            name={`deliveryPromises.${index}.price`}
            render={({ field }) => (
              <FormItem>
                <Text asChild size="xs">
                  <FormLabel>Delivery Price</FormLabel>
                </Text>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    disabled={isDisabled(value)}
                    value={field.value || 0}
                    min={0}
                    onChange={(event) =>
                      field.onChange(event.target.valueAsNumber)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {value !== 'NEXT_DAY' && (
            <div>
              <FormField
                control={formContext.control}
                name={`deliveryPromises.${index}.estimatedMinDays`}
                render={({ field }) => (
                  <FormItem>
                    <Text asChild size="xs">
                      <FormLabel>Min Days</FormLabel>
                    </Text>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        disabled={isDisabled(value)}
                        value={field.value || 0}
                        min={0}
                        onChange={(event) =>
                          field.onChange(event.target.valueAsNumber)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formContext.control}
                name={`deliveryPromises.${index}.estimatedMaxDays`}
                render={({ field }) => (
                  <FormItem>
                    <Text asChild size="xs">
                      <FormLabel>Max Days</FormLabel>
                    </Text>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        disabled={isDisabled(value)}
                        value={field.value || 0}
                        min={0}
                        onChange={(event) =>
                          field.onChange(event.target.valueAsNumber)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <FormField
            control={formContext.control}
            name={`deliveryPromises.${index}.requiresShippingFee`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="mt-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isDisabled(value)}
                      />
                      <Text asChild size="xs">
                        <FormLabel>Required Shipping Fee</FormLabel>
                      </Text>
                    </div>
                    <FormDescription>
                      Check this if the delivery fee is mandatory for this
                      shipping method
                    </FormDescription>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>
      ))}
    </ToggleGroup>
  );
}

interface ProductVariantsControlProps {
  value: ProductVariantCreateInput[];
  onChange: (value: ProductVariantCreateInput[]) => void;
}

function ProductVariantsControl({
  value,
  onChange,
  ...props
}: ProductVariantsControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentItem, setCurrentItem] =
    useState<ProductVariantCreateInput | null>(null);

  const form = useForm<ProductVariantCreateInput>({
    resolver: zodResolver(productCreateVariantSchema),
    defaultValues: {},
  });

  const handleSubmit = (data: ProductVariantCreateInput) => {
    onChange(
      currentItem
        ? value.map((item) =>
            JSON.stringify(item) === JSON.stringify(currentItem) ? data : item,
          )
        : [...value, data],
    );

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

  const resetAndClose = () => {
    form.reset({});
    setIsOpen(false);
    setCurrentItem(null);
  };

  const handleVariantClick = (item: ProductVariantCreateInput) => {
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
