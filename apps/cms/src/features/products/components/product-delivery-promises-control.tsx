import 'client-only';
import { ToggleGroup, ToggleGroupItem } from '@ecomm/ui/toggle-group';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@ecomm/ui/form';
import { Input } from '@ecomm/ui/input';
import { Card } from '@ecomm/ui/card';
import { Switch } from '@ecomm/ui/switch';
import { Text } from '@ecomm/ui/typography';
import { useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { BoxSelectIcon, CheckSquare2, Clock, Truck, Zap } from 'lucide-react';
import { cn } from '@ecomm/ui/lib/utils';
import type {
  ProductCreateInput,
  ProductDeliveryPromiseCreateInput,
  ProductDeliveryPromiseUpdateInput,
} from '@ecomm/validations/cms/products/product-schema';

export const deliveryPromises = [
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
] as const;

export interface DeliveryPromisesControlProps {
  value:
    | ProductDeliveryPromiseCreateInput[]
    | ProductDeliveryPromiseUpdateInput[];
  onChange: (
    value:
      | ProductDeliveryPromiseCreateInput[]
      | ProductDeliveryPromiseUpdateInput[],
  ) => void;
}

export function DeliveryPromisesControl({
  value,
  onChange,
  ...props
}: DeliveryPromisesControlProps) {
  const formContext = useFormContext<ProductCreateInput>();
  const updatedDeliveryPromises = formContext.watch('deliveryPromises');

  const [selectedShippingMethods, setSelectedShippingMethods] = useState<
    string[]
  >(value.filter((item) => item.enabled).map((item) => item.shippingMethod));

  const isDisabled = (shippingMethod: string) =>
    !selectedShippingMethods.length ||
    !selectedShippingMethods.includes(shippingMethod);

  const handleValueChange = (data: string[]) => {
    setSelectedShippingMethods(data);
    onChange(
      updatedDeliveryPromises.map((item) => ({
        ...item,
        enabled: data.includes(item.shippingMethod),
      })),
    );
  };

  return (
    <ToggleGroup
      {...props}
      aria-label="Delivery Promise Selection"
      value={selectedShippingMethods}
      onValueChange={handleValueChange}
      type="multiple"
      className="items-stretch gap-3"
    >
      {deliveryPromises.map(
        ({ value: shippingValue, title, icon: Icon }, index) => (
          <Card
            key={shippingValue}
            className={cn('flex-1 space-y-2 p-4', {
              'bg-gray-100/50': isDisabled(shippingValue),
            })}
          >
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5" />
                <Text as="span" size="sm">
                  {title}
                </Text>
              </div>
              <ToggleGroupItem
                tabIndex={0}
                value={shippingValue}
                className="p-0"
              >
                {!selectedShippingMethods.includes(shippingValue) ? (
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
                      disabled={isDisabled(shippingValue)}
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
            {shippingValue !== 'NEXT_DAY' && (
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
                          disabled={isDisabled(shippingValue)}
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
                          disabled={isDisabled(shippingValue)}
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
                          disabled={isDisabled(shippingValue)}
                        />
                        <Text asChild size="xs">
                          <FormLabel>Required Shipping Fee</FormLabel>
                        </Text>
                      </div>
                      <FormDescription>
                        Toggle this if the delivery fee is mandatory for this
                        shipping method
                      </FormDescription>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
        ),
      )}
    </ToggleGroup>
  );
}
