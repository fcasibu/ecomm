import { getCategories } from "@/features/categories/services/queries";
import { getCustomers } from "@/features/customers/services/queries";
import { getOrders } from "@/features/orders/services/queries";
import { getProducts } from "@/features/products/services/queries";
import { getCookieCurrentLocale } from "@/lib/get-cookie-current-locale";
import type { Result } from "@ecomm/lib/execute-operation";
import { Card, CardHeader, CardTitle, CardContent } from "@ecomm/ui/card";
import { Package, Users, ShoppingCart, List } from "lucide-react";

const getDashboardData = async () => {
  const locale = await getCookieCurrentLocale();

  const [categoriesResult, productsResult, ordersResult, customersResult] =
    await Promise.allSettled([
      getCategories(locale, { page: 1, pageSize: 20 }),
      getProducts(locale, { page: 1, pageSize: 20 }),
      getOrders(locale, { page: 1, pageSize: 20 }),
      getCustomers(locale, { page: 1, pageSize: 20 }),
    ]);

  const extractCount = (
    result: PromiseSettledResult<Result<{ totalCount: number }>>,
  ) =>
    result.status === "fulfilled" && result.value.success
      ? result.value.data.totalCount
      : 0;

  return [
    extractCount(categoriesResult),
    extractCount(productsResult),
    extractCount(ordersResult),
    extractCount(customersResult),
  ] as const;
};

export default async function Home() {
  const [categoriesCount, productsCount, ordersCount, customersCount] =
    await getDashboardData();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoriesCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersCount}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
