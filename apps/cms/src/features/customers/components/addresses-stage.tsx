import { Button } from '@ecomm/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@ecomm/ui/form';
import { Input } from '@ecomm/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@ecomm/ui/select';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@ecomm/ui/sheet';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@ecomm/ui/table';
import { Text, Heading } from '@ecomm/ui/typography';
import {
  type CustomerCreateInput,
  type AddressInput,
  addressSchema,
} from '@ecomm/validations/cms/customers/customers-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useFormContext, useForm } from 'react-hook-form';

export function AddressesStage() {
  const formContext = useFormContext<CustomerCreateInput>();

  return (
    <div>
      <Heading as="h2" className="mb-4">
        Addresses
      </Heading>
      <FormField
        control={formContext.control}
        name="addresses"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Addresses</FormLabel>
            <FormControl>
              <AddressControl {...field} value={field.value ?? []} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export interface AddressControlProps {
  value: AddressInput[];
  onChange: (value: AddressInput[]) => void;
}

export function AddressControl({
  value,
  onChange,
  ...props
}: AddressControlProps) {
  'use no memo';

  const [isOpen, setIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<AddressInput | null>(null);

  const form = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: 'BILLING',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
  });

  const handleSubmit = (data: AddressInput) => {
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

  const handleAddressClick = (item: AddressInput) => {
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
      <SheetTrigger asChild>
        <Button variant="outline" type="button" className="flex">
          <input className="sr-only" type="button" {...props} />
          <Plus />
          Add Address
        </Button>
      </SheetTrigger>

      {!value?.length ? (
        <Text>There are no addresses associated with this customer.</Text>
      ) : (
        <AddressTable
          handleAddressClick={handleAddressClick}
          addresses={value}
        />
      )}

      <SheetContent>
        <Form {...form}>
          <form
            id="address-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();

              return form.handleSubmit(handleSubmit)(e);
            }}
            className="space-y-4"
          >
            <SheetHeader>
              <SheetTitle>
                {currentItem ? 'Edit address' : 'Create an address'}
              </SheetTitle>
            </SheetHeader>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="BILLING">Billing</SelectItem>
                          <SelectItem value="SHIPPING">Shipping</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal code</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              <Button form="address-form" type="submit">
                {currentItem ? 'Update address' : 'Save changes'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

function AddressTable({
  addresses,
  handleAddressClick,
}: {
  addresses: AddressInput[];
  handleAddressClick: (item: AddressInput) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Street</TableHead>
          <TableHead>City</TableHead>
          <TableHead>State</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>Postal code</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {addresses.map((address, index) => (
          <SheetTrigger asChild key={index}>
            <TableRow
              aria-label="Edit address"
              className="cursor-pointer"
              onClick={() => handleAddressClick(address)}
            >
              <TableCell>{address.type}</TableCell>
              <TableCell>{address.street}</TableCell>
              <TableCell>{address.city}</TableCell>
              <TableCell>{address.state}</TableCell>
              <TableCell>{address.country}</TableCell>
              <TableCell>{address.postalCode}</TableCell>
            </TableRow>
          </SheetTrigger>
        ))}
      </TableBody>
    </Table>
  );
}
