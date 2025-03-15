"use client";

import { format } from "date-fns";
import type { ProductDTO } from "@ecomm/services/products/product-dto";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ecomm/ui/table";
import { Minus } from "lucide-react";
import { useRouter } from "next/navigation";

export function ProductsTableClient({ products }: { products: ProductDTO[] }) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[140px]">SKU</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Created at</TableHead>
          <TableHead>Updated at</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow
            key={product.id}
            aria-label="Go to product details"
            onClick={() => router.push(`/products/${product.id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                router.push(`/products/${product.id}`);
              }
            }}
            tabIndex={0}
            className="cursor-pointer"
          >
            <TableCell className="font-medium max-w-[140px] truncate">
              {product.sku}
            </TableCell>
            <TableCell className="max-w-[20ch] truncate">
              {product.name}
            </TableCell>
            <TableCell className="max-w-[20ch] truncate">
              {product.description || <Minus />}
            </TableCell>
            <TableCell>{product.category?.name || <Minus />}</TableCell>
            <TableCell>{format(product.createdAt, "MM/dd/yyyy")}</TableCell>
            <TableCell>{format(product.updatedAt, "MM/dd/yyyy")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
