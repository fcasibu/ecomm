"use client";

import { Form } from "@ecomm/ui/form";
import { Heading, Text } from "@ecomm/ui/typography";
import {
  orderUpdateSchema,
  type OrderUpdateInput,
} from "@ecomm/validations/orders/orders-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@ecomm/ui/button";
import { Loader } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ecomm/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ecomm/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@ecomm/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ecomm/ui/table";
import { updateOrderById } from "../services/mutations";
import { toast } from "@ecomm/ui/hooks/use-toast";
import { OrderStatus } from "@ecomm/db";
import type { OrderDTO } from "@ecomm/services/orders/order-dto";
import type { AddressDTO } from "@ecomm/services/customers/customer-dto";
import { formatPrice } from "@ecomm/lib/format-price";
import { ImageComponent } from "@ecomm/ui/image";

export function OrderUpdateForm({ order }: { order: OrderDTO }) {
  "use no memo";

  const form = useForm<OrderUpdateInput>({
    resolver: zodResolver(orderUpdateSchema),
    defaultValues: {
      orderStatus: order.status,
    },
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (data: OrderUpdateInput) => {
    startTransition(async () => {
      const result = await updateOrderById(order.id, data);

      if (!result.success) {
        toast({
          title: "Order Update",
          description: "There was an issue with updating the order.",
        });

        return;
      }

      toast({
        title: "Order update",
        description: "Order was successfully updated",
      });
    });
  };

  const getBillingAddress = (): AddressDTO | undefined => {
    return order.customer.addresses.find(
      (address) => address.type === "BILLING",
    );
  };

  const getShippingAddress = (): AddressDTO | undefined => {
    return order.customer.addresses.find(
      (address) => address.type === "SHIPPING",
    );
  };

  const formatAddress = (address: AddressDTO | undefined) => {
    if (!address) return "No address provided";

    return (
      <div className="text-sm">
        <Text>{address.street}</Text>
        <Text>
          {address.city}, {address.state} {address.postalCode}
        </Text>
        <Text>{address.country}</Text>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <Heading as="h1">Update order</Heading>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();

            return form.handleSubmit(handleSubmit)(e);
          }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="orderStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(OrderStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Text className="font-medium mb-1">Email</Text>
                <Text size="sm">{order.customer.email}</Text>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Text className="font-medium mb-1">Billing Address</Text>
                  <Text size="sm">{formatAddress(getBillingAddress())}</Text>
                </div>
                <div>
                  <Text className="font-medium mb-1">Shipping Address</Text>
                  <Text size="sm">{formatAddress(getShippingAddress())}</Text>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Image</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.image && (
                          <div className="overflow-hidden rounded">
                            <ImageComponent
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                              className="aspect-square object-cover"
                            />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell className="text-right">
                        {formatPrice(item.price, item.currencyCode)}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(
                          item.price * item.quantity,
                          item.currencyCode,
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2">
                    <TableCell colSpan={5} className="text-right font-bold">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatPrice(order.totalAmount, order.currency)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/orders")}
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
