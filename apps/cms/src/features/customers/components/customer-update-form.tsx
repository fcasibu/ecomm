'use client';

import type { CustomerDTO } from '@ecomm/services/customers/customer-dto';
import { Form } from '@ecomm/ui/form';
import { Heading } from '@ecomm/ui/typography';
import {
  customerUpdateSchema,
  type CustomerUpdateInput,
} from '@ecomm/validations/cms/customers/customers-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ecomm/ui/tabs';
import { Button } from '@ecomm/ui/button';
import { Loader } from 'lucide-react';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CustomerDetailsStage } from './customer-details-stage';
import { AddressesStage } from './addresses-stage';
import { deleteCustomerById, updateCustomerById } from '../services/mutations';
import { toast } from '@ecomm/ui/hooks/use-toast';
import Link from 'next/link';
import { useStore } from '@/features/store/providers/store-provider';

export function CustomerUpdateForm({
  customer,
  tab,
}: {
  customer: CustomerDTO;
  tab?: string;
}) {
  'use no memo';

  const store = useStore();
  const form = useForm<CustomerUpdateInput>({
    resolver: zodResolver(customerUpdateSchema),
    defaultValues: {
      addresses: customer.addresses,
      email: customer.email,
      phone: customer.phone ?? '',
      lastName: customer.lastName ?? '',
      birthDate: customer.birthDate ? new Date(customer.birthDate) : undefined,
      firstName: customer.firstName ?? '',
      middleName: customer.middleName ?? '',
    },
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (data: CustomerUpdateInput) => {
    startTransition(async () => {
      const result = await updateCustomerById(store.locale, customer.id, data);

      if (!result.success) {
        toast({
          title: 'Customer Update',
          description: 'There was an issue with updating the customer.',
        });

        return;
      }

      toast({
        title: 'Customer update',
        description: 'Customer was successfully updated',
      });
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCustomerById(store.locale, customer.id);

      if (!result.success) {
        toast({
          title: 'Customer deletion',
          description: result.error.message,
        });

        return;
      }

      router.push('/customers');
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <Heading as="h2">Update customer</Heading>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();

            return form.handleSubmit(handleSubmit)(e);
          }}
        >
          <Tabs defaultValue={tab ?? 'customer-details'}>
            <TabsList>
              <TabsTrigger asChild value="customer-details">
                <Link href={`/customers/${customer.id}/customer-details`}>
                  Customer details
                </Link>
              </TabsTrigger>
              <TabsTrigger asChild value="addresses">
                <Link href={`/customers/${customer.id}/addresses`}>
                  Addresses
                </Link>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="customer-details">
              <CustomerDetailsStage />
            </TabsContent>
            <TabsContent value="addresses">
              <AddressesStage />
            </TabsContent>
          </Tabs>
          <div className="mt-4 flex justify-end gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push('/customers')}
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
    </div>
  );
}
