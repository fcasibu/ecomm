import { notFound } from "next/navigation";
import { getProductById } from "../services/queries";
import { ProductUpdateForm } from "./product-update-form";

export async function ProductDetail({
  productId,
}: {
  productId: Promise<string>;
}) {
  const result = await getProductById(await productId);

  if (!result.success) return notFound();

  return <ProductUpdateForm product={result.data} />;
}
