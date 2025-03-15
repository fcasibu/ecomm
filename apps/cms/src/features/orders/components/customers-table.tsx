import 'client-only';
import { Card, CardHeader, CardTitle, CardContent } from '@ecomm/ui/card';
import { Button } from '@ecomm/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ecomm/ui/form';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@ecomm/ui/select';
import type { CustomerDTO } from '@ecomm/services/customers/customer-dto';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ecomm/ui/table';
import { Minus } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { OrderCreateInput } from '@ecomm/validations/cms/orders/orders-schema';
import { toast } from '@ecomm/ui/hooks/use-toast';
import { Heading, Text } from '@ecomm/ui/typography';
import { format } from 'date-fns';

export function CustomersTable({
  customers,
  value,
  onChange,
}: {
  customers: CustomerDTO[];
  value: string;
  onChange: (customerId: string | undefined) => void;
}) {
  const formContext = useFormContext<OrderCreateInput>();

  const customer = customers.find((customer) => customer.id === value);

  if (customer) {
    return (
      <CustomerAddressSelect
        customer={customer}
        onChangeCustomer={() => {
          onChange('');
        }}
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[140px]">User ID</TableHead>
          <TableHead>First name</TableHead>
          <TableHead>Last name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Created at</TableHead>
          <TableHead>Updated at</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => {
          const shippingAddresses = customer.addresses.filter(
            (address) => address.type === 'SHIPPING',
          );
          const billingAddresses = customer.addresses.filter(
            (address) => address.type === 'BILLING',
          );

          const showToastForMissingAddress = () => {
            toast({
              title: 'Missing address',
              description:
                'The customer you have selected does not have the required addresses. The customer need to have at least one shipping and one billing address.',
              variant: 'destructive',
            });
          };

          return (
            <TableRow
              aria-label="Select customer"
              key={customer.id}
              onClick={() => {
                if (!shippingAddresses.length || !billingAddresses.length) {
                  showToastForMissingAddress();
                  return;
                }

                formContext.clearErrors('shippingAddressId');
                formContext.clearErrors('billingAddressId');

                onChange(customer.id);
                formContext.setValue(
                  'shippingAddressId',
                  shippingAddresses[0]!.id,
                );
                formContext.setValue(
                  'billingAddressId',
                  billingAddresses[0]!.id,
                );
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  if (!shippingAddresses.length || !billingAddresses.length) {
                    showToastForMissingAddress();
                    return;
                  }

                  onChange(customer.id);
                  formContext.setValue(
                    'shippingAddressId',
                    shippingAddresses[0]!.id,
                  );
                  formContext.setValue(
                    'billingAddressId',
                    billingAddresses[0]!.id,
                  );
                }
              }}
              tabIndex={0}
              className="cursor-pointer"
            >
              <TableCell className="max-w-[140px] truncate">
                {customer.userId || <Minus />}
              </TableCell>
              <TableCell>{customer.firstName || <Minus />}</TableCell>
              <TableCell>{customer.lastName || <Minus />}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{format(customer.createdAt, 'MM/dd/yyyy')}</TableCell>
              <TableCell>{format(customer.updatedAt, 'MM/dd/yyyy')}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

interface CustomerAddressSelectorProps {
  customer: CustomerDTO;
  onChangeCustomer: () => void;
}

export const CustomerAddressSelect = ({
  customer,
  onChangeCustomer,
}: CustomerAddressSelectorProps) => {
  const formContext = useFormContext<OrderCreateInput>();
  const shippingAddressId = formContext.watch('shippingAddressId');
  const billingAddressId = formContext.watch('billingAddressId');

  const shippingAddresses = customer.addresses.filter(
    (address) => address.type === 'SHIPPING',
  );
  const billingAddresses = customer.addresses.filter(
    (address) => address.type === 'BILLING',
  );

  const selectedShippingAddress = shippingAddressId
    ? shippingAddresses.find((address) => address.id === shippingAddressId)
    : shippingAddresses[0];
  const selectedBillingAddress = billingAddressId
    ? billingAddresses.find((address) => address.id === billingAddressId)
    : billingAddresses[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading as="h3">Customer Addresses</Heading>
        <Button variant="outline" onClick={onChangeCustomer}>
          Change Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedShippingAddress ? (
              <div className="space-y-4">
                <Text size="sm">
                  {selectedShippingAddress.street},{' '}
                  {selectedShippingAddress.city},{' '}
                  {selectedShippingAddress.state}{' '}
                  {selectedShippingAddress.postalCode},{' '}
                  {selectedShippingAddress.country}
                </Text>
                <FormField
                  control={formContext.control}
                  name="shippingAddressId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Shipping Address:</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a shipping address" />
                          </SelectTrigger>
                          <SelectContent>
                            {shippingAddresses.map((address) => (
                              <SelectItem key={address.id} value={address.id}>
                                {address.street}, {address.city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <Text size="sm" className="text-gray-500">
                No shipping addresses available.
              </Text>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedBillingAddress ? (
              <div className="space-y-4">
                <Text size="sm">
                  {selectedBillingAddress.street}, {selectedBillingAddress.city}
                  , {selectedBillingAddress.state}{' '}
                  {selectedBillingAddress.postalCode},{' '}
                  {selectedBillingAddress.country}
                </Text>
                <FormField
                  control={formContext.control}
                  name="billingAddressId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Billing Address:</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a billing address" />
                          </SelectTrigger>
                          <SelectContent>
                            {billingAddresses.map((address) => (
                              <SelectItem key={address.id} value={address.id}>
                                {address.street}, {address.city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <Text size="sm" className="text-gray-500">
                No billing addresses available.
              </Text>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
