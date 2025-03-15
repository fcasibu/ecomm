import "server-only";

import { executeOperation } from "@ecomm/lib/execute-operation";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { customersController } from "@ecomm/services/registry";

export const getCustomers = async (
  locale: string,
  input: {
    page?: number;
    query?: string;
    pageSize?: number;
  },
) => {
  "use cache";
  cacheTag("all", "customers", `store_${locale}`);

  return await executeOperation(() =>
    customersController.getAll(locale, input),
  );
};

export const getCustomerById = async (locale: string, id: string) => {
  "use cache";
  cacheTag("all", "customer", `customer_${id}`, `store_${locale}`);

  return await executeOperation(() => customersController.getById(locale, id));
};
