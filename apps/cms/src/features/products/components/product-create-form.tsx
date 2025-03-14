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
  productCreateSchema,
  productCreateVariantSchema,
} from "@ecomm/validations/products/product-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Suspense, useState, useTransition } from "react";
import { createProduct } from "../services/mutations";
import { toast } from "@ecomm/ui/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Heading } from "@ecomm/ui/typography";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@ecomm/ui/sheet";
import { ImageUpload } from "@/components/image-upload";
import { ImageComponent } from "@ecomm/ui/image";
import { CategorySelectSkeleton } from "@/components/category-select-skeleton";

export function ProductCreateForm() {
  const form = useForm<z.infer<typeof productCreateSchema>>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: undefined,
      features: [],
      variants: [],
    },
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (data: z.infer<typeof productCreateSchema>) => {
    startTransition(async () => {
      const result = await createProduct(data);

      if (!result.success) {
        toast({
          title: "Product Creation",
          description: "There was an issue with creating a product.",
        });

        return;
      }

      toast({
        title: "Product creation",
        description: "Product was successfully created",
      });

      router.push("/products");
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <Heading as="h1">Create a new product</Heading>
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
                  <Suspense fallback={<CategorySelectSkeleton />}>
                    <CategorySelect
                      value={field.value}
                      onChange={(categories) => field.onChange(categories)}
                    />
                  </Suspense>
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
              type="submit"
              className="min-w-[120px]"
            >
              {isPending ? (
                <Loader className="animate-spin" size={16} />
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

type ProductVariant = z.infer<typeof productCreateVariantSchema>;

interface ProductVariantsControlProps {
  value: ProductVariant[];
  onChange: (value: ProductVariant[]) => void;
}

function ProductVariantsControl({
  value,
  onChange,
  ...props
}: ProductVariantsControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<ProductVariant | null>(null);

  const form = useForm<ProductVariant>({
    resolver: zodResolver(productCreateVariantSchema),
    defaultValues: {},
  });

  const handleSubmit = (data: ProductVariant) => {
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

  const handleVariantClick = (item: ProductVariant) => {
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
