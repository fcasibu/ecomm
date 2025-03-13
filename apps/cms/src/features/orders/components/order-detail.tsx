import { notFound } from "next/navigation";
import { getOrderById } from "../services/queries";
import { OrderUpdateForm } from "./order-update-form";

export async function OrderDetail({ id }: { id: Promise<string> }) {
  const orderId = await id;
  const result = await getOrderById(orderId);

  if (!result.success) return notFound();

  return <OrderUpdateForm order={result.data} />;
}
