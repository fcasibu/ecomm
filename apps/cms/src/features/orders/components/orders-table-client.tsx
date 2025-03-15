'use client';

import { format } from 'date-fns';
import { useStore } from '@/features/store/providers/store-provider';
import { formatPrice } from '@ecomm/lib/format-price';
import type { OrderDTO } from '@ecomm/services/orders/order-dto';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ecomm/ui/table';
import { useRouter } from 'next/navigation';

export function OrdersTableClient({ orders }: { orders: OrderDTO[] }) {
  const store = useStore();
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[140px]">Status</TableHead>
          <TableHead className="text-right">Order total</TableHead>
          <TableHead>Created at</TableHead>
          <TableHead>Updated at</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow
            aria-label="Go to order details"
            key={order.id}
            onClick={() => router.push(`/orders/${order.id}`)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                router.push(`/orders/${order.id}`);
              }
            }}
            tabIndex={0}
            className="cursor-pointer"
          >
            <TableCell className="max-w-[140px] truncate">
              {order.status}
            </TableCell>
            <TableCell className="text-right">
              {formatPrice(order.totalAmount, store.currency)}
            </TableCell>
            <TableCell>{format(order.createdAt, 'MM/dd/yyyy')}</TableCell>
            <TableCell>{format(order.updatedAt, 'MM/dd/yyyy')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
