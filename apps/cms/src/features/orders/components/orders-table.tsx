import { TypographyH2 } from "@ecomm/ui/typography";
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
      <TypographyH2>
        Failed to load orders. Please try again later.
      </TypographyH2>
    );
  }

  if (!result.data.totalCount) {
    return <TypographyH2>No orders found.</TypographyH2>;
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
