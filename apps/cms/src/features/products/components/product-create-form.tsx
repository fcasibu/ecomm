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
import { productCreateSchema } from "@ecomm/validations/products/product-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useTransition } from "react";
import { createProduct } from "../services/mutations";
import { toast } from "@ecomm/ui/hooks/use-toast";
import { useRouter } from "next/navigation";
import { TypographyH1 } from "@ecomm/ui/typography";

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
      <TypographyH1>Create a new product</TypographyH1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                <FormControl></FormControl>
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
