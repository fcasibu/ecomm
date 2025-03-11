"use client";

import type { CustomerDTO } from "@ecomm/services/customers/customer-dto";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ecomm/ui/table";
import { Minus } from "lucide-react";
import { useRouter } from "next/navigation";

export function CustomersTableClient({
  customers,
}: {
  customers: CustomerDTO[];
}) {
  const router = useRouter();

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
        {customers.map((customer) => (
          <TableRow
            aria-label="Go to customer details"
            key={customer.id}
            onClick={() =>
              router.push(`/customers/${customer.id}/customer-details`)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                router.push(`/customers/${customer.id}/customer-details`);
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
            <TableCell>{customer.createdAt}</TableCell>
            <TableCell>{customer.updatedAt}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
