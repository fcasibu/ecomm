import { notFound } from "next/navigation";
import { CustomerUpdateForm } from "./customer-update-form";
import { getCustomerById } from "../services/queries";

export async function CustomerDetail({
  customerId,
}: {
  customerId: Promise<string>;
}) {
  const result = await getCustomerById(await customerId);

  if (!result.success) return notFound();

  return <CustomerUpdateForm customer={result.data} />;
}
