'use client';

import { Suspense, useEffect, useState, useTransition } from 'react';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, Loader, Trash } from 'lucide-react';
import type { ZodType } from 'zod';

import { Button } from '@ecomm/ui/button';
import { cn } from '@ecomm/ui/lib/utils';
import { Input } from '@ecomm/ui/input';
import { Separator } from '@ecomm/ui/separator';
import { Text, Heading } from '@ecomm/ui/typography';
import { toast } from '@ecomm/ui/hooks/use-toast';
import { ImageComponent } from '@ecomm/ui/image';
import { Popover, PopoverContent, PopoverTrigger } from '@ecomm/ui/popover';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ecomm/ui/form';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@ecomm/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ecomm/ui/table';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@ecomm/ui/command';

import { useMultiStage } from '@/hooks/use-multi-stage';
import { QueryPagination } from '@/components/query-pagination';
import { CustomersTableSkeleton } from '@/features/customers/components/customers-table-skeleton';
import { CustomersTable } from './customers-table';
import { useGetCustomers } from '@/features/customers/hooks/use-get-customers';
import { useGetProducts } from '@/features/products/hooks/use-get-products';
import { createCart } from '@/features/cart/services/mutations';
import { createOrder } from '../services/mutations';
import { formatPrice } from '@ecomm/lib/format-price';

import {
  orderCreateSchema,
  type OrderCreateInput,
} from '@ecomm/validations/cms/orders/orders-schema';
import {
  cartCreateSchema,
  type CartCreateInput,
} from '@ecomm/validations/cms/cart/cart-schema';
import type {
  ProductDTO,
  ProductVariantDTO,
} from '@ecomm/services/products/product-dto';
import { CUSTOMERS_PAGE_SIZE, PRODUCTS_PAGE_SIZE } from '@/lib/constants';
import { useStore } from '@/features/store/providers/store-provider';

type StageKey = 'customer' | 'cart';

const stages = [
  { title: 'Customer', key: 'customer' },
  { title: 'Cart', key: 'cart' },
] as const;

const stageAwareSchema = (currentStage: StageKey) => {
  switch (currentStage) {
    case 'customer':
      return orderCreateSchema.pick({
        customerId: true,
        shippingAddressId: true,
        billingAddressId: true,
      });
    case 'cart':
      return orderCreateSchema.omit({ cart: true });
    default:
      throw new Error('Invalid step');
  }
};

export function OrderCreateForm() {
  'use no memo';

  const store = useStore();
  const { currentStage, onNext, onPrevious, goToStage, isStageDisabled } =
    useMultiStage(stages, 'customer');

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<OrderCreateInput>({
    resolver: zodResolver(
      stageAwareSchema(currentStage) as unknown as ZodType<OrderCreateInput>,
    ),
    defaultValues: {
      customerId: undefined,
      billingAddressId: undefined,
      shippingAddressId: undefined,
    },
  });

  const handleSubmit = (data: OrderCreateInput) => {
    if (currentStage !== 'cart') return onNext();

    if (!data.preCart.itemsForDisplay.length) {
      form.setError('preCart', {
        message: 'Cart must at least have one item',
      });

      return;
    }

    startTransition(async () => {
      const cartResult = await createCart(store.locale, {
        customerId: data.customerId,
        items: data.preCart.items,
      });

      if (!cartResult.success) {
        toast({
          title: 'Cart creation',
          description: 'There was an issue with creating a cart.',
        });
        return;
      }

      const result = await createOrder(store.locale, {
        ...data,
        cart: cartResult.data,
      });

      if (!result.success) {
        toast({
          title: 'Order Creation',
          description: 'There was an issue with creating an order.',
        });
        return;
      }

      toast({
        title: 'Order creation',
        description: 'Order was successfully created',
      });

      router.push('/orders');
    });
  };

  return (
    <div>
      <Heading as="h1">Create an order</Heading>
      <StageIndicator
        currentStage={currentStage}
        goToStage={goToStage}
        isStageDisabled={isStageDisabled}
      />
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return form.handleSubmit(handleSubmit)(e);
          }}
        >
          <div className="mx-auto max-w-3xl space-y-8 p-8">
            <StageContent currentStage={currentStage} />
            <StageController
              onPrevious={onPrevious}
              isPending={isPending}
              currentStage={currentStage}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}

interface StageControllerProps {
  currentStage: StageKey;
  isPending: boolean;
  onPrevious: () => void;
}

function StageController({
  currentStage,
  isPending,
  onPrevious,
}: StageControllerProps) {
  const router = useRouter();
  const isFirstStage = currentStage === 'customer';
  const isLastStage = currentStage === 'cart';

  const buttonText = isPending ? (
    <Loader className="animate-spin" size={16} />
  ) : isLastStage ? (
    'Submit'
  ) : (
    'Next'
  );

  return (
    <div className="flex justify-end gap-4">
      <Button
        variant="outline"
        type="button"
        onClick={() => router.push('/orders')}
      >
        Cancel
      </Button>

      {!isFirstStage && (
        <Button
          disabled={isPending}
          type="button"
          onClick={onPrevious}
          className="min-w-[120px]"
        >
          {isPending ? (
            <Loader className="animate-spin" size={16} />
          ) : (
            'Previous'
          )}
        </Button>
      )}

      <Button disabled={isPending} type="submit" className="min-w-[120px]">
        {buttonText}
      </Button>
    </div>
  );
}

interface StageIndicatorProps {
  currentStage: StageKey;
  goToStage: (stage: StageKey) => void;
  isStageDisabled: (stage: StageKey) => boolean;
}

function StageIndicator({
  currentStage,
  goToStage,
  isStageDisabled,
}: StageIndicatorProps) {
  return (
    <div className="flex w-full justify-between gap-6">
      {stages.map((stage, index) => {
        const isActive = currentStage === stage.key;
        const isLastStage = index === stages.length - 1;

        return (
          <div
            key={stage.key}
            className={cn('flex flex-1 items-center', {
              'flex-grow-0 justify-end': isLastStage,
            })}
          >
            <div className="flex w-full items-center gap-2">
              <div className="flex h-[40px] w-[40px] items-center justify-center">
                <Button
                  aria-label={`Move to ${stage.title}`}
                  variant="none"
                  className={cn(
                    'flex h-[40px] w-[40px] items-center justify-center rounded-full outline outline-black',
                    {
                      'bg-blue-500 outline-none outline-offset-0 outline-transparent':
                        isActive,
                    },
                  )}
                  disabled={isStageDisabled(stage.key)}
                  onClick={() => goToStage(stage.key)}
                  size="icon"
                >
                  <span
                    className={cn('pointer-events-none text-lg text-black', {
                      'text-white': isActive,
                    })}
                  >
                    {index + 1}
                  </span>
                </Button>
              </div>
              <span className="flex-shrink-0">{stage.title}</span>
              {!isLastStage && (
                <Separator className="!flex-shrink bg-gray-500" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface StageContentProps {
  currentStage: StageKey;
}

function StageContent({ currentStage }: StageContentProps) {
  switch (currentStage) {
    case 'customer':
      return <CustomerStage />;
    case 'cart':
      return (
        <Suspense
          fallback={
            <div className="mx-auto flex h-full max-w-4xl items-center justify-center space-y-8 p-8">
              <Loader className="animate-spin" />
            </div>
          }
        >
          <CartStage />
        </Suspense>
      );
    default:
      throw new Error('Unknown stage');
  }
}

function CustomerStage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const formContext = useFormContext<OrderCreateInput>();

  const { result, isLoading } = useGetCustomers({
    page,
    pageSize: CUSTOMERS_PAGE_SIZE,
  });

  return (
    <div>
      <Heading as="h2" className="mb-4">
        Customer
      </Heading>
      <div className="space-y-4">
        {isLoading && <CustomersTableSkeleton />}
        {!isLoading && result.success && (
          <FormField
            control={formContext.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormDescription>
                  Select a customer from the table below
                </FormDescription>
                <FormMessage />
                <FormControl>
                  <div>
                    <CustomersTable
                      value={field.value}
                      onChange={field.onChange}
                      customers={result.data.customers}
                    />
                    {!field.value && (
                      <QueryPagination totalPages={result.data.count} />
                    )}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
}

function CartStage() {
  const [open, setOpen] = useState(false);
  const [popoverStates, setPopoverStates] = useState<boolean[]>([]);
  const formContext = useFormContext<OrderCreateInput>();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const store = useStore();

  const { result, isLoading } = useGetProducts({
    page,
    pageSize: PRODUCTS_PAGE_SIZE,
  });

  const products =
    (!isLoading && result.success ? result.data.products : []) ?? [];
  const cart = formContext.watch('preCart');

  const form = useForm<CartCreateInput>({
    resolver: zodResolver(cartCreateSchema),
    defaultValues: { items: [{ sku: '', productId: '', quantity: 1 }] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  useEffect(() => {
    setPopoverStates(Array(fields.length).fill(false));
  }, [fields.length]);

  const getProductById = (productId: string) => {
    return products.find((p) => p.id === productId);
  };

  const handlePopoverToggle = (index: number) => {
    setPopoverStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  const closePopover = (index: number) => {
    setPopoverStates((prev) => {
      if (index >= prev.length) return prev;
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });
  };

  const mergeProductQuantities = (existingIndex: number, newIndex: number) => {
    const currentQuantity =
      form.getValues(`items.${existingIndex}.quantity`) || 0;
    const newQuantity = form.getValues(`items.${newIndex}.quantity`) || 1;
    form.setValue(
      `items.${existingIndex}.quantity`,
      currentQuantity + newQuantity,
    );
  };

  const updateProductSelection = (product: ProductDTO, index: number) => {
    form.setValue(`items.${index}.productId`, product.id);

    if (product.variants.length === 1) {
      form.setValue(`items.${index}.sku`, product.variants[0]?.sku || '');
    } else {
      form.setValue(`items.${index}.sku`, '');
    }

    closePopover(index);
  };

  const handleSelectProduct = (product: ProductDTO, index: number) => {
    if (index >= fields.length) return;

    const existingIndex = fields.findIndex(
      (_, i) =>
        i !== index && form.getValues(`items.${i}.productId`) === product.id,
    );

    if (existingIndex >= 0) {
      mergeProductQuantities(existingIndex, index);
      remove(index);

      toast({
        title: 'Products merged',
        description: `Combined quantities for ${product.name}`,
      });
    } else {
      updateProductSelection(product, index);
    }
  };

  const handleSelectVariant = (index: number, variant: ProductVariantDTO) => {
    form.setValue(`items.${index}.sku`, variant.sku);

    const existingIndex = fields.findIndex(
      (_, i) =>
        i !== index &&
        form.getValues(`items.${i}.productId`) ===
          form.getValues(`items.${index}.productId`) &&
        form.getValues(`items.${i}.sku`) === variant.sku,
    );

    if (existingIndex >= 0) {
      mergeProductQuantities(existingIndex, index);
      remove(index);

      const product = products.find(
        (p) => p.id === form.getValues(`items.${existingIndex}.productId`),
      );

      toast({
        title: 'Products merged',
        description: `Combined quantities for ${product?.name || 'selected product'}`,
      });
    }
  };

  const handleSubmit = (data: CartCreateInput) => {
    const cartItemsForDisplay = data.items.map((item) => {
      const product = products.find(
        (product) => product.id === item.productId,
      )!;
      const variant = product.variants.find(
        (variant) => variant.sku === item.sku,
      )!;

      return {
        ...item,
        image: variant.images[0] ?? '',
        name: product.name,
        price: variant.price,
        stock: variant.stock,
      };
    });

    formContext.setValue('preCart', {
      itemsForDisplay: cartItemsForDisplay,
      ...data,
    });

    setOpen(false);
  };

  const renderVariantStock = (stock: number) => {
    if (stock <= 0) return 'Out of stock';
    if (stock < 5) return `Low stock: ${stock} remaining`;

    return `In stock: ${stock} available`;
  };

  const getStockTextColor = (stock: number) => {
    if (stock <= 0) return 'text-red-500';
    if (stock < 5) return 'text-amber-500';

    return 'text-green-500';
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div>
        <SheetTrigger asChild>
          <Button variant="outline">+ Add custom cart item</Button>
        </SheetTrigger>

        {formContext.formState.errors.preCart && (
          <FormMessage>
            {formContext.formState.errors.preCart.message}
          </FormMessage>
        )}

        {cart && cart.itemsForDisplay.length > 0 && (
          <CartDetails cart={cart} formContext={formContext} />
        )}
      </div>

      <SheetContent side="right" className="w-[500px] sm:w-[540px]">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();

              return form.handleSubmit(handleSubmit)(e);
            }}
            className="h-full space-y-4 overflow-y-auto"
          >
            <div>
              <SheetHeader>
                <SheetTitle>Add Items to Cart</SheetTitle>
              </SheetHeader>
              {form.formState.errors.items && (
                <FormMessage>
                  {form.formState.errors.items.message ||
                    form.formState.errors.items.root?.message}
                </FormMessage>
              )}
            </div>

            {fields.map((rootField, index) => (
              <div key={rootField.id} className="space-y-2 rounded border p-4">
                <FormField
                  control={form.control}
                  name={`items.${index}.productId`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product</FormLabel>
                      <FormControl>
                        <Popover
                          open={popoverStates[index]}
                          onOpenChange={() => handlePopoverToggle(index)}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={popoverStates[index]}
                              className="w-full justify-between"
                            >
                              {products.find((p) => p.id === field.value)
                                ?.name ?? 'Search by SKU or Variant Key'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search by SKU or Variant Key..." />
                              <CommandList>
                                <CommandEmpty>No products found.</CommandEmpty>
                                <CommandGroup>
                                  {products.map((product) => (
                                    <CommandItem
                                      key={`${product.id}-${rootField.id}`}
                                      onSelect={() => {
                                        handleSelectProduct(product, index);
                                        field.onChange(product.id);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === product.id
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                        )}
                                      />
                                      {product.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.getValues(`items.${index}.productId`) && (
                  <FormField
                    control={form.control}
                    name={`items.${index}.sku`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Variant</FormLabel>
                        <div className="space-y-3">
                          {getProductById(
                            form.getValues(`items.${index}.productId`),
                          )?.variants.map((variant) => {
                            const isSelected = field.value === variant.sku;
                            const isOutOfStock = variant.stock <= 0;

                            return (
                              <div
                                key={variant.sku}
                                className={cn(
                                  'flex cursor-pointer items-start rounded border p-3',
                                  isSelected
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200',
                                  isOutOfStock ? 'opacity-50' : '',
                                )}
                                onClick={() => {
                                  if (!isOutOfStock) {
                                    field.onChange(variant.sku);
                                    handleSelectVariant(index, variant);
                                  }
                                }}
                              >
                                <div className="mr-3 flex-shrink-0">
                                  {variant.images && (
                                    <div className="overflow-hidden rounded border bg-gray-100">
                                      <ImageComponent
                                        src={variant.images[0]}
                                        alt="Product Variant"
                                        width={64}
                                        height={64}
                                        className="aspect-square object-cover"
                                      />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="mb-1 flex justify-between">
                                    <div className="font-medium">
                                      {variant.sku}
                                    </div>
                                    <div className="font-semibold">
                                      {formatPrice(
                                        variant.price,
                                        store.currency,
                                      )}
                                    </div>
                                  </div>

                                  {variant.attributes &&
                                    Object.entries(variant.attributes).map(
                                      ([key, value]) => (
                                        <div
                                          className="mb-1 text-sm text-gray-500"
                                          key={`${key}-${value}`}
                                        >
                                          {key}: {value}
                                        </div>
                                      ),
                                    )}

                                  <div
                                    className={cn(
                                      'text-sm',
                                      getStockTextColor(variant.stock),
                                    )}
                                  >
                                    {renderVariantStock(variant.stock)}
                                  </div>

                                  {isOutOfStock && (
                                    <div className="mt-1 text-xs text-red-500">
                                      This variant cannot be selected
                                    </div>
                                  )}

                                  {isSelected && (
                                    <div className="absolute right-2 top-2">
                                      <Check className="text-primary h-4 w-4" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant="outline"
                  className="w-full"
                >
                  Remove Item
                </Button>
              </div>
            ))}

            <div className="flex space-x-4">
              <Button
                type="button"
                onClick={() => append({ sku: '', productId: '', quantity: 1 })}
                variant="outline"
              >
                Add Another Item
              </Button>
              <Button type="submit">Add to Cart</Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

interface CartDetailsProps {
  cart: OrderCreateInput['preCart'];
  formContext: ReturnType<typeof useFormContext<OrderCreateInput>>;
}

function CartDetails({ cart, formContext }: CartDetailsProps) {
  const store = useStore();
  const total = cart.itemsForDisplay.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const removeItem = (itemSku: string) => {
    const updatedItems = cart.itemsForDisplay.filter(
      (item) => item.sku !== itemSku,
    );
    formContext.setValue('preCart.itemsForDisplay', updatedItems);
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cart.itemsForDisplay.map((item) => (
            <TableRow key={item.sku}>
              <TableCell className="flex gap-2">
                <ImageComponent
                  src={item.image}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="mr-2 inline-block aspect-square"
                />
                <div>
                  <Text size="sm" className="mb-0">
                    {item.name}
                  </Text>
                  <Text className="my-0 text-[10px] text-gray-500">
                    {item.sku}
                  </Text>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {formatPrice(item.price, store.currency)}
              </TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TableCell className="text-right">
                {formatPrice(item.price * item.quantity, store.currency)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-2"
                  type="button"
                  onClick={() => removeItem(item.sku)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end">
        <div className="space-y-2">
          <Text className="font-semibold">
            Total: {formatPrice(total, store.currency)}
          </Text>
        </div>
      </div>
    </div>
  );
}
