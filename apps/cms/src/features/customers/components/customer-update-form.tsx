"use client";

import type { CustomerDTO } from "@ecomm/services/customers/customer-dto";
import { Form } from "@ecomm/ui/form";
import { TypographyH1 } from "@ecomm/ui/typography";
import {
  customerUpdateSchema,
  type CustomerUpdateInput,
} from "@ecomm/validations/customers/customers-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ecomm/ui/tabs";
import { Button } from "@ecomm/ui/button";
import { Loader } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CustomerDetailsStage } from "./customer-details-stage";
import { AddressesStage } from "./addresses-stage";
import { updateCustomerById } from "../services/mutations";
import { toast } from "@ecomm/ui/hooks/use-toast";

export function CustomerUpdateForm({ customer }: { customer: CustomerDTO }) {
  "use no memo";

  const form = useForm<CustomerUpdateInput>({
    resolver: zodResolver(customerUpdateSchema),
    defaultValues: {
      addresses: customer.addresses,
      email: customer.email,
      phone: customer.phone ?? "",
      lastName: customer.lastName ?? "",
      birthDate: customer.birthDate ? new Date(customer.birthDate) : undefined,
      firstName: customer.firstName ?? "",
      middleName: customer.middleName ?? "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (data: CustomerUpdateInput) => {
    startTransition(async () => {
      const result = await updateCustomerById(customer.id, data);

      if (!result.success) {
        toast({
          title: "Customer Update",
          description: "There was an issue with updating the customer.",
        });

        return;
      }

      toast({
        title: "Customer update",
        description: "Customer was successfully updated",
      });
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <TypographyH1>Update customer</TypographyH1>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();

            return form.handleSubmit(handleSubmit)(e);
          }}
        >
          <Tabs defaultValue="customer-details">
            <TabsList>
              <TabsTrigger value="customer-details">
                Customer details
              </TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
            </TabsList>
            <TabsContent value="customer-details">
              <CustomerDetailsStage />
            </TabsContent>
            <TabsContent value="addresses">
              <AddressesStage />
            </TabsContent>
          </Tabs>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/customers")}
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
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
