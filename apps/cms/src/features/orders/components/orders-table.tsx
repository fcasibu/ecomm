import { Heading } from "@ecomm/ui/typography";
import { QueryPagination } from "@/components/query-pagination";
import { ORDERS_PAGE_SIZE } from "@/lib/constants";
import { getOrders } from "../services/queries";
import { OrdersTableClient } from "./orders-table-client";

export async function OrdersTable({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const where = searchParams.then((sp) => Number(sp.page || "1"));
  const page = await where;

  const result = await getOrders({
    page,
    pageSize: ORDERS_PAGE_SIZE,
  });

  if (!result.success) {
    return (
      <Heading as="h2">Failed to load orders. Please try again later.</Heading>
    );
  }

  if (!result.data.totalCount) {
    return <Heading as="h2">No orders found.</Heading>;
  }

  const { orders, totalCount } = result.data;

  const totalPages = Math.ceil(totalCount / ORDERS_PAGE_SIZE);

  return (
    <div className="space-y-6">
      <OrdersTableClient orders={orders} />
      <QueryPagination totalPages={totalPages} />
    </div>
  );
}
