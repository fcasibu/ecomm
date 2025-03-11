"use client";

import { CategorySelect } from "@/components/category-select";
import { Button } from "@ecomm/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@ecomm/ui/form";
import { Input } from "@ecomm/ui/input";
import { MultiInput } from "@ecomm/ui/multi-input";
import {
  productUpdateSchema,
  productUpdateVariantSchema,
  type ProductUpdateInput,
  type ProductVariantUpdateInput,
} from "@ecomm/validations/products/product-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { toast } from "@ecomm/ui/hooks/use-toast";
import { useRouter } from "next/navigation";
import { TypographyH1 } from "@ecomm/ui/typography";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@ecomm/ui/sheet";
import { ImageUpload } from "@/components/image-upload";
import type { ProductDTO } from "@ecomm/services/products/product-dto";
import { deleteProductById, updateProductById } from "../services/mutations";
import { ImageComponent } from "@ecomm/ui/image";

export function ProductUpdateForm({ product }: { product: ProductDTO }) {
  const form = useForm<ProductUpdateInput>({
    resolver: zodResolver(productUpdateSchema),
    defaultValues: {
      name: product.name,
      description: product.description ?? "",
      categoryId: product.category?.id ?? undefined,
      features: product.features,
      variants: product.variants,
    },
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (data: ProductUpdateInput) => {
    startTransition(async () => {
      const result = await updateProductById(product.id, data);

      if (!result.success) {
        toast({
          title: "Product Update",
          description: "There was an issue with updating the product.",
        });

        return;
      }

      toast({
        title: "Product update",
        description: "Product was successfully updated",
      });

      router.push("/products");
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProductById(product.id);

      if (!result.success) {
        toast({
          title: "Product deletion",
          description: result.error.message,
        });

        return;
      }

      router.push("/products");
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <TypographyH1>Update product</TypographyH1>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();

            return form.handleSubmit(handleSubmit)(e);
          }}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Features</FormLabel>
                <FormControl>
                  <MultiInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <CategorySelect
                    value={field.value}
                    onChange={(categories) => field.onChange(categories)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="variants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variants</FormLabel>
                <FormControl>
                  <ProductVariantsControl
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/products")}
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              variant="destructive"
              type="button"
              className="min-w-[120px]"
              onClick={handleDelete}
            >
              {isPending ? (
                <Loader className="animate-spin" size={16} />
              ) : (
                "Delete"
              )}
            </Button>
            <Button
              disabled={isPending}
              type="submit"
              className="min-w-[120px]"
            >
              {isPending ? (
                <Loader className="animate-spin" size={16} />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface ProductVariantsControlProps {
  value: ProductVariantUpdateInput[];
  onChange: (value: ProductVariantUpdateInput[]) => void;
}

function ProductVariantsControl({
  value,
  onChange,
  ...props
}: ProductVariantsControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentItem, setCurrentItem] =
    useState<ProductVariantUpdateInput | null>(null);

  const form = useForm<ProductVariantUpdateInput>({
    resolver: zodResolver(productUpdateVariantSchema),
  });

  const handleSubmit = (data: ProductVariantUpdateInput) => {
    onChange(
      currentItem
        ? value.map((item) =>
            JSON.stringify(item) === JSON.stringify(currentItem) ? data : item,
          )
        : [...value, data],
    );

    resetAndClose();
  };

  const handleRemove = () => {
    if (!currentItem) return;

    onChange(
      value.filter(
        (item) => JSON.stringify(item) !== JSON.stringify(currentItem),
      ),
    );
    resetAndClose();
  };

  const resetAndClose = () => {
    form.reset({});
    setIsOpen(false);
    setCurrentItem(null);
  };

  const handleVariantClick = (item: ProductVariantUpdateInput) => {
    form.reset(item);
    setCurrentItem(item);
  };

  const handleSheetOpenChange = (open: boolean) => {
    form.reset({});
    setIsOpen(open);

    if (!open) {
      setCurrentItem(null);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
      <div className="flex gap-2 flex-wrap">
        {value.length > 0 &&
          value.map((item, index) => (
            <SheetTrigger
              asChild
              key={index}
              onClick={() => handleVariantClick(item)}
            >
              <div className="w-24 h-24 aspect-square border border-black flex justify-center items-center cursor-pointer">
                <ImageComponent
                  src={item.image}
                  className="object-cover aspect-square"
                  alt={`Product variant ${index + 1}`}
                  width={96}
                  height={96}
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </SheetTrigger>
          ))}
        <SheetTrigger asChild>
          <div className="w-24 h-24 aspect-square border border-black flex justify-center items-center cursor-pointer">
            <input className="sr-only" type="button" {...props} />
            <Plus />
          </div>
        </SheetTrigger>
      </div>
      <SheetContent>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();

              return form.handleSubmit(handleSubmit)(e);
            }}
            className="space-y-4"
          >
            <SheetHeader>
              <SheetTitle>
                {currentItem
                  ? "Edit product variant"
                  : "Create a product variant"}
              </SheetTitle>
            </SheetHeader>
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currencyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency Code</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="flex gap-2">
              {currentItem && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleRemove}
                >
                  Remove
                </Button>
              )}
              <Button type="submit">
                {currentItem ? "Update variant" : "Save changes"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
