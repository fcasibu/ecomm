import { CUSTOMERS_PAGE_SIZE } from "@/features/categories/constants";
import { TypographyH2 } from "@ecomm/ui/typography";
import { QueryPagination } from "@/components/query-pagination";
import { CustomersTableClient } from "./customers-table-client";
import { getCustomers } from "../services/queries";

export async function CustomersTable({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const where = searchParams.then((sp) => ({
    page: Number(sp.page || "1"),
    query: (sp.q as string) ?? "",
  }));
  const { query = "", page = 1 } = await where;

  const result = await getCustomers({
    page,
    query: query.toLowerCase(),
    pageSize: CUSTOMERS_PAGE_SIZE,
  });

  if (!result.success) {
    return (
      <TypographyH2>
        Failed to load customers. Please try again later.
      </TypographyH2>
    );
  }

  if (!result.data.totalCount) {
    return <TypographyH2>No customers found.</TypographyH2>;
  }

  const { customers, totalCount } = result.data;

  const totalPages = Math.ceil(totalCount / CUSTOMERS_PAGE_SIZE);

  return (
    <div className="space-y-6">
      <CustomersTableClient customers={customers} />
      <QueryPagination totalPages={totalPages} />
    </div>
  );
}
