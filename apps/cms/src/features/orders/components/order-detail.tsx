import { notFound } from "next/navigation";
import { getOrderById } from "../services/queries";
import { OrderUpdateForm } from "./order-update-form";
import { getCookieCurrentLocale } from "@/lib/get-cookie-current-locale";

export async function OrderDetail({ id }: { id: Promise<string> }) {
  const orderId = await id;
  const locale = await getCookieCurrentLocale();
  const result = await getOrderById(locale, orderId);

  if (!result.success) return notFound();

  return <OrderUpdateForm order={result.data} />;
}
