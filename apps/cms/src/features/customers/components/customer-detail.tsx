import { notFound } from "next/navigation";
import { CustomerUpdateForm } from "./customer-update-form";
import { getCustomerById } from "../services/queries";

export async function CustomerDetail({
  param,
}: {
  param: Promise<{ id: string; tab?: string }>;
}) {
  const { id, tab } = await param;
  const result = await getCustomerById(id);

  if (!result.success) return notFound();

  return <CustomerUpdateForm tab={tab} customer={result.data} />;
}
