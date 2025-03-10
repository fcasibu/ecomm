import "server-only";

import { executeOperation } from "@ecomm/lib/execute-operation";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { customersController } from "@ecomm/services/registry";

export const getCustomers = async (input: {
  page?: number;
  query?: string;
  pageSize?: number;
}) => {
  "use cache";
  cacheTag("all", "customers");

  return await executeOperation(() => customersController.getAll(input));
};
