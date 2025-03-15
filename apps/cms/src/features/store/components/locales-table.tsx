import { getFlagOfLocale } from "@ecomm/lib/get-flag-of-locale";
import { Badge } from "@ecomm/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ecomm/ui/table";
import { getStores } from "../services/queries";
import { STORES_PAGE_SIZE } from "@/lib/constants";
import { getLocales } from "@ecomm/lib/locales";
import { QueryPagination } from "@/components/query-pagination";
import { deleteStoreById } from "../services/mutations";
import { Button } from "@ecomm/ui/button";
import { Trash } from "lucide-react";
import type { StoreDTO } from "@ecomm/services/store/store-dto";

export async function LocalesTable({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const locales = getLocales();
  const where = searchParams.then((sp) => Number(sp.page || "1"));
  const page = await where;

  const result = await getStores({
    page,
    pageSize: STORES_PAGE_SIZE,
  });

  const { stores, totalCount } = result.success
    ? result.data
    : {
        stores: [] as StoreDTO[],
        totalCount: 0,
      };

  const totalPages = Math.ceil(totalCount / STORES_PAGE_SIZE);

  const handleStoreDelete = (storeId: string) => async () => {
    "use server";

    await deleteStoreById(storeId);
  };

  const sortedStores = stores.sort((a, b) => {
    if (a.locale === b.locale) return 0;
    if (a.locale === "en-US") return -1;
    if (b.locale === "en-US") return 1;

    return 0;
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Locale</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Currency</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedStores.length > 0 ? (
            sortedStores.map((store) => (
              <TableRow key={store.id}>
                <TableCell className="font-mono">{`${getFlagOfLocale(store.locale)} ${store.locale}`}</TableCell>
                <TableCell>
                  {locales[store.locale as keyof typeof locales]?.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{store.currency}</Badge>
                </TableCell>
                {sortedStores.length !== 1 && store.locale !== "en-US" && (
                  <TableCell className="w-[20px] pr-4">
                    <form action={handleStoreDelete(store.id)}>
                      <Button
                        aria-label={`Delete ${store.locale}`}
                        variant="outline"
                        size="icon"
                        className="p-0"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </form>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No locales found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <QueryPagination totalPages={totalPages} />
    </div>
  );
}
