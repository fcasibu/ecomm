import { Heading } from "@ecomm/ui/typography";
import { QueryPagination } from "@/components/query-pagination";
import { CustomersTableClient } from "./customers-table-client";
import { getCustomers } from "../services/queries";
import { CUSTOMERS_PAGE_SIZE } from "@/lib/constants";
import { getCookieCurrentLocale } from "@/lib/get-cookie-current-locale";

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

  const locale = await getCookieCurrentLocale();
  const result = await getCustomers(locale, {
    page,
    query: query.toLowerCase(),
    pageSize: CUSTOMERS_PAGE_SIZE,
  });

  if (!result.success) {
    return (
      <Heading as="h2">
        Failed to load customers. Please try again later.
      </Heading>
    );
  }

  if (!result.data.totalCount) {
    return <Heading as="h2">No customers found.</Heading>;
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
